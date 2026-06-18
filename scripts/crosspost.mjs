#!/usr/bin/env node
/**
 * crosspost.mjs
 * Publishes a Hashnode article to Dev.to via REST API.
 *
 * ─── Setup ───────────────────────────────────────────────────────────────────
 *   npm install --save-dev gray-matter dotenv
 *   cp scripts/.env.example .env    # add DEVTO_API_KEY
 *
 * ─── Usage ───────────────────────────────────────────────────────────────────
 *   node scripts/crosspost.mjs --slug your-article-slug
 *   node scripts/crosspost.mjs --cuid cmq63mocp00010chvb3h91cj1
 *   node scripts/crosspost.mjs --latest
 *   node scripts/crosspost.mjs --dry-run --slug your-article-slug
 */

import { readFileSync, readdirSync } from 'fs';
import { resolve, dirname, join }    from 'path';
import { fileURLToPath }             from 'url';
import matter                        from 'gray-matter';
import dotenv                        from 'dotenv';

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT      = resolve(__dirname, '..');
const HASHNODE  = 'https://jeelvankhede.hashnode.dev';
const DEVTO_API = 'https://dev.to/api/articles';

// ─── CLI ─────────────────────────────────────────────────────────────────────

const argv    = process.argv.slice(2);
const flag    = n => argv.includes(n);
const arg     = n => { const i = argv.indexOf(n); return i !== -1 ? argv[i + 1] : null; };

const SLUG    = arg('--slug');
const CUID    = arg('--cuid');
const LATEST  = flag('--latest');
const DRY_RUN = flag('--dry-run');

// ─── Article resolution ───────────────────────────────────────────────────────

function loadArticles() {
  return readdirSync(ROOT)
    .filter(f => /^[a-z0-9]+\.md$/i.test(f) && f !== 'README.md')
    .map(file => {
      try {
        const { data, content } = matter(readFileSync(join(ROOT, file), 'utf-8'));
        return data.slug ? { file, data, body: content.trim() } : null;
      } catch { return null; }
    })
    .filter(Boolean);
}

function findArticle() {
  const articles = loadArticles();
  if (!articles.length) return null;
  if (LATEST) return articles.sort((a, b) =>
    new Date(b.data.datePublished) - new Date(a.data.datePublished))[0];
  if (SLUG)   return articles.find(a => a.data.slug === SLUG)    ?? null;
  if (CUID)   return articles.find(a => a.file === `${CUID}.md`) ?? null;
  return null;
}

// ─── Tag normalisation ────────────────────────────────────────────────────────

function devToTags(raw) {
  const list = typeof raw === 'string'
    ? raw.split(',').map(t => t.trim())
    : Array.isArray(raw) ? raw : [];
  return list.map(t => t.toLowerCase().replace(/[\s-]+/g, '')).filter(Boolean).slice(0, 4);
}

// ─── Dev.to (REST API) ────────────────────────────────────────────────────────

async function publishDevTo(article, canonical) {
  const key = process.env.DEVTO_API_KEY;
  if (!key) { console.error('\n❌  DEVTO_API_KEY missing from .env'); process.exit(1); }

  const tags    = devToTags(article.data.tags);
  const payload = {
    article: {
      title:         article.data.title,
      body_markdown: article.body,
      published:     true,
      canonical_url: canonical,
      tags,
      ...(article.data.cover ? { main_image: article.data.cover } : {}),
    },
  };

  console.log('\n── Dev.to ───────────────────────────────────────');
  console.log(`   Title    : ${article.data.title}`);
  console.log(`   Tags     : ${tags.join(', ')}`);
  console.log(`   Cover    : ${article.data.cover || 'none'}`);
  console.log(`   Canonical: ${canonical}`);

  if (DRY_RUN) { console.log('\n   [dry-run] skipping publish'); return; }

  const res  = await fetch(DEVTO_API, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json', 'api-key': key },
    body:    JSON.stringify(payload),
  });
  const json = await res.json();

  if (!res.ok) {
    const errorMsg    = json.error ?? JSON.stringify(json);
    const isDuplicate = res.status === 422 && /already been taken/i.test(errorMsg);
    if (isDuplicate) {
      console.log('\n⚠   Already published on Dev.to — skipping.');
      return null;
    }
    console.error(`\n❌  Dev.to error (${res.status}): ${errorMsg}`);
    process.exit(1);
  }

  console.log(`\n✅  Dev.to live: ${json.url}`);
  return json.url;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  if (!SLUG && !CUID && !LATEST) {
    console.log([
      '',
      'Usage:',
      '  node scripts/crosspost.mjs --slug <slug>',
      '  node scripts/crosspost.mjs --cuid <cuid>',
      '  node scripts/crosspost.mjs --latest',
      '  node scripts/crosspost.mjs --dry-run --slug <slug>',
      '',
    ].join('\n'));
    process.exit(1);
  }

  const article = findArticle();
  if (!article) {
    console.error('\n❌  Article not found. Resync your GitHub repo and try again.\n');
    process.exit(1);
  }

  const canonical = `${HASHNODE}/${article.data.slug}`;

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📄  ${article.data.title}`);
  console.log(`    ${canonical}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  await publishDevTo(article, canonical);

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅  Done.');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main().catch(err => {
  console.error('\n❌  Fatal:', err.message);
  process.exit(1);
});
