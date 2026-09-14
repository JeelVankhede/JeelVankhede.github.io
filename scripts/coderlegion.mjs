#!/usr/bin/env node
/**
 * coderlegion.mjs
 * Imports a Hashnode article into CoderLegion via its REST API.
 *
 * ─── Setup ───────────────────────────────────────────────────────────────────
 *   cp scripts/.env.example .env    # add CODERLEGION_API_KEY
 *
 * ─── Usage ───────────────────────────────────────────────────────────────────
 *   npm run post:coderlegion -- your-article-slug
 *   node scripts/coderlegion.mjs your-article-slug
 *   node scripts/coderlegion.mjs --cuid cmq63mocp00010chvb3h91cj1
 *   node scripts/coderlegion.mjs --latest
 *   node scripts/coderlegion.mjs --dry-run your-article-slug
 *   node scripts/coderlegion.mjs --publish your-article-slug   # skip the draft step
 *   node scripts/coderlegion.mjs --category tutorials your-article-slug
 *   node scripts/coderlegion.mjs --list-categories
 *
 * ─── Drafts ──────────────────────────────────────────────────────────────────
 * CoderLegion's API has no draft state. The closest equivalent is creating the
 * post and immediately hiding it (`POST /posts/{id}/hide`), which is what this
 * script does by default: the post exists, is editable, and is not shown in
 * feeds or category listings until you hit "Reshow" on the post page.
 * Pass --publish to leave it visible instead.
 */

import dotenv from 'dotenv';
import {
  parseArgs, findArticle, canonicalUrl, parseTags,
  printHeader, printFooter, die,
} from './lib/article.mjs';

dotenv.config();

const API      = 'https://coderlegion.com/api/v1';
const MAX_TAGS = 5;

// ─── CLI ─────────────────────────────────────────────────────────────────────

const cli            = parseArgs(['--category']);
const PUBLISH        = cli.flag('--publish');
const NO_COVER       = cli.flag('--no-cover');
const LIST_CATEGORIES = cli.flag('--list-categories');
const CATEGORY       = cli.arg('--category') ?? 'articles';
const DRY_RUN        = cli.dryRun;

// ─── HTTP ────────────────────────────────────────────────────────────────────

function apiKey() {
  const key = process.env.CODERLEGION_API_KEY;
  if (!key) die('CODERLEGION_API_KEY missing from .env');
  return key;
}

/** Wraps fetch with the API key header and unwraps the `{status, data}` envelope. */
async function api(path, { method = 'GET', body, headers = {} } = {}) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      'X-API-Key': apiKey(),
      ...(body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...headers,
    },
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
  });

  let json;
  try { json = await res.json(); }
  catch { die(`CoderLegion returned a non-JSON response (${res.status}) for ${method} ${path}`); }

  if (!res.ok || json.status === 'error') {
    const detail = json.errors ? ` — ${JSON.stringify(json.errors)}` : '';
    return { ok: false, status: res.status, message: json.message ?? res.statusText, detail, json };
  }
  return { ok: true, status: res.status, data: json.data, json };
}

// ─── Categories ──────────────────────────────────────────────────────────────

async function fetchCategories() {
  const res = await api('/categories');
  if (!res.ok) die(`Could not fetch categories (${res.status}): ${res.message}${res.detail}`);
  return res.data ?? [];
}

async function resolveCategoryId(slug) {
  // A dry-run should still be useful before the API key is configured.
  if (DRY_RUN && !process.env.CODERLEGION_API_KEY) {
    console.log('\n   ⚠   No CODERLEGION_API_KEY set — category id left unresolved.');
    return { id: '?', slug, title: slug };
  }

  const categories = await fetchCategories();
  const wanted     = slug.toLowerCase();
  const match      = categories.find(c =>
    c.slug?.toLowerCase() === wanted || String(c.title).toLowerCase() === wanted);

  if (!match) {
    const available = categories.map(c => `${c.slug} (${c.id})`).join(', ');
    die(`Category "${slug}" not found. Available: ${available || 'none returned'}`);
  }
  if (match.parent_id) die(`Category "${slug}" is a sub-category — CoderLegion only accepts top-level ones.`);
  return match;
}

// ─── Cover image ─────────────────────────────────────────────────────────────

/** Downloads the Hashnode cover and re-uploads it, returning a CoderLegion blob ID. */
async function uploadCover(url) {
  const res = await fetch(url);
  if (!res.ok) {
    console.log(`   ⚠   Cover download failed (${res.status}) — posting without one.`);
    return null;
  }

  const type = res.headers.get('content-type') ?? 'image/png';
  const ext  = (type.split('/')[1] ?? 'png').split(';')[0].replace('jpeg', 'jpg');
  if (!['jpg', 'png', 'gif', 'webp'].includes(ext)) {
    console.log(`   ⚠   Unsupported cover format "${type}" — posting without one.`);
    return null;
  }

  const form = new FormData();
  form.append('file', new Blob([await res.arrayBuffer()], { type }), `cover.${ext}`);
  form.append('type', 'cover');

  const upload = await api('/uploads/image', { method: 'POST', body: form });
  if (!upload.ok) {
    console.log(`   ⚠   Cover upload failed (${upload.status}): ${upload.message} — posting without one.`);
    return null;
  }
  return upload.data.blobid;
}

/** CoderLegion post URLs are `/{id}/{slug}`; the id alone is what resolves it. */
const postUrl = post => `https://coderlegion.com/${post.id}/` +
  String(post.title ?? '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// ─── Duplicate guard ─────────────────────────────────────────────────────────

async function findExisting(title) {
  const res = await api(`/posts/search?q=${encodeURIComponent(title)}`);
  if (!res.ok) return null;
  return (res.data ?? []).find(p => p.title?.trim() === title.trim()) ?? null;
}

// ─── Publish ─────────────────────────────────────────────────────────────────

async function publish(article, canonical) {
  const category = await resolveCategoryId(CATEGORY);
  const tags     = parseTags(article.data.tags).slice(0, MAX_TAGS);
  const asDraft  = !PUBLISH;

  console.log('\n── CoderLegion ──────────────────────────────────');
  console.log(`   Title    : ${article.data.title}`);
  console.log(`   Category : ${category.slug} (id ${category.id})`);
  console.log(`   Tags     : ${tags.join(', ') || 'none'}`);
  console.log(`   Cover    : ${NO_COVER ? 'skipped' : article.data.cover || 'none'}`);
  console.log(`   Source   : ${canonical}`);
  console.log(`   Draft    : ${asDraft}`);

  if (DRY_RUN) { console.log('\n   [dry-run] skipping publish'); return; }

  const existing = await findExisting(article.data.title);
  if (existing) {
    console.log(`\n⚠   Already on CoderLegion — skipping: ${postUrl(existing)}`);
    return null;
  }

  const blobid = NO_COVER || !article.data.cover ? null : await uploadCover(article.data.cover);

  const payload = {
    title:       article.data.title,
    content:     article.body,
    format:      'markdown',
    category_id: category.id,
    source_url:  canonical,
    ...(tags.length ? { tags }                        : {}),
    ...(blobid     ? { cover_image_blobid: blobid }   : {}),
  };

  const created = await api('/posts', { method: 'POST', body: payload });
  if (!created.ok) die(`CoderLegion error (${created.status}): ${created.message}${created.detail}`);

  const post = created.data;
  const url  = postUrl(post);

  if (created.json.queued) console.log('\n⏳  Post accepted and queued for moderation.');

  if (!asDraft) {
    console.log(`\n✅  CoderLegion live: ${url}`);
    return url;
  }

  const hidden = await api(`/posts/${post.id}/hide`, { method: 'POST' });
  if (!hidden.ok) {
    console.log(`\n⚠   Post created but could not be hidden (${hidden.status}): ${hidden.message}`);
    console.log(`    It may be publicly visible — hide it manually: ${url}`);
    return url;
  }

  console.log(`\n✅  CoderLegion draft (hidden): ${url}`);
  console.log('    Review it, then hit "Reshow" on the post page to publish.');
  return url;
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  if (LIST_CATEGORIES) {
    const categories = await fetchCategories();
    console.log('\nCoderLegion categories:\n');
    for (const c of categories) {
      console.log(`  ${String(c.id).padStart(4)}  ${c.slug.padEnd(24)} ${c.title}`);
    }
    console.log('');
    return;
  }

  if (!cli.slug && !cli.cuid && !cli.latest) {
    console.log([
      '',
      'Usage:',
      '  node scripts/coderlegion.mjs <slug>',
      '  node scripts/coderlegion.mjs --cuid <cuid>',
      '  node scripts/coderlegion.mjs --latest',
      '',
      'Options:',
      '  --dry-run             print the payload without posting',
      '  --publish             publish immediately instead of saving as a hidden draft',
      '  --category <slug>     target category (default: articles)',
      '  --no-cover            skip the cover image upload',
      '  --list-categories     print available categories and exit',
      '',
    ].join('\n'));
    process.exit(1);
  }

  const article = findArticle(cli);
  if (!article) die('Article not found. Resync your GitHub repo and try again.');

  const canonical = canonicalUrl(article);
  printHeader(article, canonical);
  await publish(article, canonical);
  printFooter();
}

main().catch(err => die(`Fatal: ${err.message}`));
