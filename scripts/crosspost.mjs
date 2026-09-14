#!/usr/bin/env node
/**
 * crosspost.mjs
 * Publishes a Hashnode article to Dev.to via REST API.
 *
 * ─── Setup ───────────────────────────────────────────────────────────────────
 *   cp scripts/.env.example .env    # add DEVTO_API_KEY
 *
 * ─── Usage ───────────────────────────────────────────────────────────────────
 *   npm run post:devto -- your-article-slug
 *   node scripts/crosspost.mjs your-article-slug
 *   node scripts/crosspost.mjs --cuid cmq63mocp00010chvb3h91cj1
 *   node scripts/crosspost.mjs --latest
 *   node scripts/crosspost.mjs --dry-run your-article-slug
 *   node scripts/crosspost.mjs --draft your-article-slug   # save as draft
 */

import dotenv from 'dotenv';
import {
  parseArgs, findArticle, canonicalUrl,
  truncateDescription, parseTags,
  printHeader, printFooter, die,
} from './lib/article.mjs';

dotenv.config();

const DEVTO_API = 'https://dev.to/api/articles';

// ─── CLI ─────────────────────────────────────────────────────────────────────

const cli     = parseArgs();
const DRY_RUN = cli.dryRun;
const DRAFT   = cli.flag('--draft');

// ─── Tag normalisation ────────────────────────────────────────────────────────

/** Dev.to tags are alphanumeric only, max 4. */
function devToTags(raw) {
  return parseTags(raw)
    .map(t => t.toLowerCase().replace(/[\s-]+/g, ''))
    .filter(Boolean)
    .slice(0, 4);
}

// ─── Dev.to (REST API) ────────────────────────────────────────────────────────

async function publishDevTo(article, canonical) {
  const key = process.env.DEVTO_API_KEY;
  if (!key) die('DEVTO_API_KEY missing from .env');

  const tags        = devToTags(article.data.tags);
  const description = truncateDescription(article.data.seoDescription);
  const payload = {
    article: {
      title:         article.data.title,
      body_markdown: article.body,
      published:     !DRAFT,
      canonical_url: canonical,
      tags,
      ...(description        ? { description }                    : {}),
      ...(article.data.cover ? { main_image: article.data.cover } : {}),
    },
  };

  console.log('\n── Dev.to ───────────────────────────────────────');
  console.log(`   Title    : ${article.data.title}`);
  console.log(`   Tags     : ${tags.join(', ')}`);
  console.log(`   Cover    : ${article.data.cover || 'none'}`);
  console.log(`   Canonical: ${canonical}`);
  console.log(`   Desc     : ${description ?? 'none'} (${(description ?? '').length} chars)`);
  console.log(`   Draft    : ${DRAFT}`);

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
    die(`Dev.to error (${res.status}): ${errorMsg}`);
  }

  console.log(`\n✅  Dev.to ${DRAFT ? 'draft saved' : 'live'}: ${json.url}`);
  return json.url;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  if (!cli.slug && !cli.cuid && !cli.latest) {
    console.log([
      '',
      'Usage:',
      '  node scripts/crosspost.mjs <slug>',
      '  node scripts/crosspost.mjs --cuid <cuid>',
      '  node scripts/crosspost.mjs --latest',
      '',
      'Options:',
      '  --dry-run    print the payload without posting',
      '  --draft      save as a Dev.to draft instead of publishing',
      '',
    ].join('\n'));
    process.exit(1);
  }

  const article = findArticle(cli);
  if (!article) die('Article not found. Resync your GitHub repo and try again.');

  const canonical = canonicalUrl(article);
  printHeader(article, canonical);
  await publishDevTo(article, canonical);
  printFooter();
}

main().catch(err => die(`Fatal: ${err.message}`));
