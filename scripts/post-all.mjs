#!/usr/bin/env node
/**
 * post-all.mjs
 * Runs both crosspost targets against the same article, in sequence.
 *
 *   npm run post:all -- your-article-slug
 *
 * Every flag is forwarded to both scripts, so `--dry-run` and `--latest`
 * work here too. A failure in one target does not stop the other; the exit
 * code is non-zero if any target failed.
 */

import { spawn }        from 'child_process';
import { dirname, join} from 'path';
import { fileURLToPath} from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const args      = process.argv.slice(2);

const TARGETS = [
  { name: 'Dev.to',      script: 'crosspost.mjs'  },
  { name: 'CoderLegion', script: 'coderlegion.mjs'},
];

const run = script => new Promise(resolve => {
  spawn(process.execPath, [join(__dirname, script), ...args], { stdio: 'inherit' })
    .on('close', resolve);
});

let failed = [];
for (const { name, script } of TARGETS) {
  const code = await run(script);
  if (code !== 0) failed.push(name);
}

if (failed.length) {
  console.error(`\n❌  Failed: ${failed.join(', ')}\n`);
  process.exit(1);
}
