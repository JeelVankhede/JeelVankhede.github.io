/**
 * article.mjs
 * Shared helpers for the crosspost scripts: CLI parsing + Hashnode article lookup.
 *
 * Articles live as `<cuid>.md` files at the repo root, synced from Hashnode's
 * GitHub backup. Frontmatter carries title / slug / cover / tags / seoDescription.
 */

import { readFileSync, readdirSync } from 'fs';
import { resolve, dirname, join }    from 'path';
import { fileURLToPath }             from 'url';
import matter                        from 'gray-matter';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const ROOT     = resolve(__dirname, '..', '..');
export const HASHNODE = 'https://jeelvankhede.hashnode.dev';

// ─── CLI ─────────────────────────────────────────────────────────────────────

/** Flags that consume the next argv entry as their value. */
const SHARED_VALUE_FLAGS = ['--slug', '--cuid'];

/**
 * Parses argv once. A bare argument is treated as the slug, so
 * `node scripts/crosspost.mjs my-article-slug` works without any flags.
 *
 * @param {string[]} valueFlags extra script-specific flags that take a value
 */
export function parseArgs(valueFlags = [], argv = process.argv.slice(2)) {
  const takesValue = new Set([...SHARED_VALUE_FLAGS, ...valueFlags]);
  const flag = n => argv.includes(n);
  const arg  = n => { const i = argv.indexOf(n); return i !== -1 ? argv[i + 1] : null; };

  const positional = argv.filter((a, i) =>
    !a.startsWith('--') && !(i > 0 && takesValue.has(argv[i - 1])));

  return {
    argv, flag, arg, positional,
    slug:   arg('--slug') ?? positional[0] ?? null,
    cuid:   arg('--cuid'),
    latest: flag('--latest'),
    dryRun: flag('--dry-run'),
  };
}

// ─── Article resolution ───────────────────────────────────────────────────────

export function loadArticles() {
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

export function findArticle({ slug, cuid, latest }) {
  const articles = loadArticles();
  if (!articles.length) return null;
  if (latest) return articles.sort((a, b) =>
    new Date(b.data.datePublished) - new Date(a.data.datePublished))[0];
  if (slug)   return articles.find(a => a.data.slug === slug)    ?? null;
  if (cuid)   return articles.find(a => a.file === `${cuid}.md`) ?? null;
  return null;
}

export const canonicalUrl = article => `${HASHNODE}/${article.data.slug}`;

// ─── Frontmatter normalisation ────────────────────────────────────────────────

/** Trims a description to `max` chars on a word boundary. */
export function truncateDescription(raw, max = 160) {
  if (!raw) return undefined;
  const str = String(raw);
  if (str.length <= max) return str;
  return str.slice(0, max - 3).replace(/\s+\S*$/, '') + '...';
}

/** Hashnode stores tags as a comma-separated string (or an array). */
export function parseTags(raw) {
  const list = typeof raw === 'string'
    ? raw.split(',')
    : Array.isArray(raw) ? raw : [];
  return list.map(t => String(t).trim()).filter(Boolean);
}

// ─── Console ──────────────────────────────────────────────────────────────────

const RULE = '━'.repeat(48);

export function printHeader(article, canonical) {
  console.log(`\n${RULE}`);
  console.log(`📄  ${article.data.title}`);
  console.log(`    ${canonical}`);
  console.log(RULE);
}

export function printFooter(message = '✅  Done.') {
  console.log(`\n${RULE}`);
  console.log(message);
  console.log(`${RULE}\n`);
}

export function die(message) {
  console.error(`\n❌  ${message}\n`);
  process.exit(1);
}
