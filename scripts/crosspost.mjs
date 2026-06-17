#!/usr/bin/env node
/**
 * crosspost.mjs
 * Publishes a Hashnode article to Dev.to (REST API) and Medium (Playwright import).
 *
 * ─── First-time setup ────────────────────────────────────────────────────────
 *   npm install --save-dev playwright gray-matter dotenv
 *   npx playwright install chromium
 *   cp .env.example .env                              # add DEVTO_API_KEY
 *   node scripts/crosspost.mjs --setup-medium         # log in once, saves session
 *
 * ─── Usage ───────────────────────────────────────────────────────────────────
 *   node scripts/crosspost.mjs --slug your-article-slug
 *   node scripts/crosspost.mjs --cuid cmq63mocp00010chvb3h91cj1
 *   node scripts/crosspost.mjs --latest
 *
 *   Flags:
 *     --devto-only      skip Medium
 *     --medium-only     skip Dev.to
 *     --publish         auto-publish on Medium (default: leaves draft open for review)
 *     --dry-run         parse and log article data without publishing anywhere
 *     --setup-medium    first-time Medium login flow (saves .medium-session.json)
 */

import { readFileSync, readdirSync, existsSync } from 'fs';
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';
import { chromium } from 'playwright';
import dotenv from 'dotenv';

dotenv.config();

const __dirname   = dirname(fileURLToPath(import.meta.url));
const ROOT        = resolve(__dirname, '..');
const SESSION     = resolve(ROOT, '.medium-session.json');
const HASHNODE    = 'https://jeelvankhede.hashnode.dev';
const DEVTO_API   = 'https://dev.to/api/articles';

// ─── CLI ─────────────────────────────────────────────────────────────────────

const argv      = process.argv.slice(2);
const flag      = n  => argv.includes(n);
const arg       = n  => { const i = argv.indexOf(n); return i !== -1 ? argv[i + 1] : null; };

const SLUG         = arg('--slug');
const CUID         = arg('--cuid');
const LATEST       = flag('--latest');
const DEVTO_ONLY   = flag('--devto-only');
const MEDIUM_ONLY  = flag('--medium-only');
const AUTO_PUBLISH = flag('--publish');
const DRY_RUN      = flag('--dry-run');
const SETUP        = flag('--setup-medium');

// ─── Article resolution ───────────────────────────────────────────────────────

function loadArticles() {
  return readdirSync(ROOT)
    .filter(f => /^[a-z0-9]+\.md$/i.test(f) && f !== 'README.md')
    .map(file => {
      try {
        const raw            = readFileSync(join(ROOT, file), 'utf-8');
        const { data, content } = matter(raw);
        if (!data.slug) return null;
        return { file, data, body: content.trim() };
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

function findArticle() {
  const articles = loadArticles();
  if (!articles.length) return null;

  if (LATEST) {
    return articles.sort((a, b) =>
      new Date(b.data.datePublished) - new Date(a.data.datePublished)
    )[0];
  }
  if (SLUG) return articles.find(a => a.data.slug === SLUG)   ?? null;
  if (CUID) return articles.find(a => a.file === `${CUID}.md`) ?? null;
  return null;
}

// ─── Tag normalisation ────────────────────────────────────────────────────────

function devToTags(raw) {
  const list = typeof raw === 'string'
    ? raw.split(',').map(t => t.trim())
    : Array.isArray(raw) ? raw : [];

  return list
    .map(t => t.toLowerCase().replace(/[\s-]+/g, ''))  // "code-review" → "codereview"
    .filter(Boolean)
    .slice(0, 4);
}

// ─── Dev.to (REST API) ────────────────────────────────────────────────────────

async function publishDevTo(article, canonical) {
  const key = process.env.DEVTO_API_KEY;
  if (!key) {
    console.error('\n❌  DEVTO_API_KEY missing from .env');
    process.exit(1);
  }

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

  if (DRY_RUN) { console.log('   [dry-run] skipping API call'); return; }

  const res  = await fetch(DEVTO_API, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json', 'api-key': key },
    body:    JSON.stringify(payload),
  });
  const json = await res.json();

  if (!res.ok) {
    console.error(`\n❌  Dev.to error (${res.status}): ${json.error ?? JSON.stringify(json)}`);
    process.exit(1);
  }

  console.log(`\n✅  Dev.to live: ${json.url}`);
  return json.url;
}

// ─── Medium session setup ─────────────────────────────────────────────────────

async function setupMedium() {
  console.log('\n── Medium session setup ─────────────────────────');
  console.log('   Opening browser. Sign in to Medium, then come back here and press Enter.');

  const browser = await chromium.launch({ headless: false });
  const ctx     = await browser.newContext();
  const page    = await ctx.newPage();

  await page.goto('https://medium.com/m/signin');

  process.stdout.write('\n   Press Enter once you are signed in... ');
  await new Promise(r => process.stdin.once('data', r));

  await ctx.storageState({ path: SESSION });
  await browser.close();

  console.log(`\n✅  Session saved → ${SESSION}`);
  console.log('   Run this once — subsequent cross-posts reuse the session automatically.\n');
}

// ─── Medium (Playwright import flow) ─────────────────────────────────────────

async function publishMedium(article, canonical, autoPublish) {
  if (!existsSync(SESSION)) {
    console.error('\n❌  No Medium session found.');
    console.error('    Run: node scripts/crosspost.mjs --setup-medium\n');
    process.exit(1);
  }

  console.log('\n── Medium ───────────────────────────────────────');
  console.log(`   Importing from: ${canonical}`);

  if (DRY_RUN) { console.log('   [dry-run] skipping browser'); return; }

  const browser = await chromium.launch({ headless: false });
  const ctx     = await browser.newContext({ storageState: SESSION });
  const page    = await ctx.newPage();

  try {
    // ── Navigate to import page ───────────────────────────────────────────
    await page.goto('https://medium.com/p/import', { waitUntil: 'networkidle' });

    // Re-login guard: if redirected to signin, session expired
    if (page.url().includes('signin') || page.url().includes('login')) {
      console.error('\n❌  Medium session expired. Re-run: node scripts/crosspost.mjs --setup-medium');
      await browser.close();
      process.exit(1);
    }

    // ── Enter the Hashnode article URL ────────────────────────────────────
    const input = page.getByRole('textbox').first();
    await input.waitFor({ state: 'visible', timeout: 10_000 });
    await input.fill(canonical);

    // ── Click Import ──────────────────────────────────────────────────────
    const importBtn = page.getByRole('button', { name: /import/i });
    await importBtn.waitFor({ state: 'visible', timeout: 5_000 });
    await importBtn.click();

    // ── Wait for redirect to the draft editor ─────────────────────────────
    await page.waitForURL(/medium\.com\/(p\/[a-z0-9]+\/edit|.*\/edit)/, {
      timeout: 30_000,
    });

    const draftUrl = page.url();
    console.log(`   Draft ready: ${draftUrl}`);

    if (!autoPublish) {
      console.log('\n   Review the draft in the browser.');
      console.log('   Add to a publication if needed, then publish manually.');
      console.log('   Press Enter here to close the browser...');
      process.stdout.write('   ');
      await new Promise(r => process.stdin.once('data', r));
      await browser.close();
      return draftUrl;
    }

    // ── Auto-publish path ─────────────────────────────────────────────────
    const publishBtn = page.getByRole('button', { name: /^publish$/i });
    await publishBtn.waitFor({ state: 'visible', timeout: 10_000 });
    await publishBtn.click();

    // Confirmation dialog (Medium sometimes shows one)
    const confirmBtn = page.getByRole('button', { name: /publish now/i });
    const hasConfirm = await confirmBtn.isVisible({ timeout: 3_000 }).catch(() => false);
    if (hasConfirm) await confirmBtn.click();

    // Wait for published article URL
    await page.waitForURL(/medium\.com\/@[^/]+\/[^/]+/, { timeout: 15_000 });
    const liveUrl = page.url();

    console.log(`\n✅  Medium live: ${liveUrl}`);
    await browser.close();
    return liveUrl;

  } catch (err) {
    console.error(`\n❌  Medium error: ${err.message}`);
    console.log('   Browser left open — check the page and close manually.');
    // Don't close browser so user can inspect the state
    throw err;
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  if (SETUP) {
    await setupMedium();
    return;
  }

  if (!SLUG && !CUID && !LATEST) {
    console.log([
      '',
      'Usage:',
      '  node scripts/crosspost.mjs --slug <slug>',
      '  node scripts/crosspost.mjs --cuid <cuid>',
      '  node scripts/crosspost.mjs --latest',
      '',
      'Flags:',
      '  --devto-only    skip Medium',
      '  --medium-only   skip Dev.to',
      '  --publish       auto-publish on Medium (default: open draft for review)',
      '  --dry-run       validate without publishing',
      '  --setup-medium  first-time Medium login',
      '',
    ].join('\n'));
    process.exit(1);
  }

  const article = findArticle();

  if (!article) {
    console.error('\n❌  Article not found in project files.');
    console.error('    Resync your GitHub repo and try again.\n');
    process.exit(1);
  }

  const canonical = `${HASHNODE}/${article.data.slug}`;

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📄  ${article.data.title}`);
  console.log(`    ${canonical}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  if (!MEDIUM_ONLY) await publishDevTo(article, canonical);
  if (!DEVTO_ONLY)  await publishMedium(article, canonical, AUTO_PUBLISH);

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅  Done.');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main().catch(err => {
  console.error('\n❌  Fatal:', err.message);
  process.exit(1);
});
