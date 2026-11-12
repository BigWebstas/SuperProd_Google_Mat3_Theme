#!/usr/bin/env node
/**
 * Builds the self-contained theme files from one shared template.
 *
 *   src/template.css      shared rules (everything except colours)
 *   themes/<name>.css     per-theme header comment + light and dark colour blocks
 *
 * Usage: node scripts/build.js [--check]
 *   --check  build in memory and fail if any output file is out of date
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const OUTPUT = {
  baseline: 'google-material-3.css',
  sage: 'google-material-3-sage.css',
  coral: 'google-material-3-coral.css',
  lavender: 'google-material-3-lavender.css',
  monochrome: 'google-material-3-monochrome.css',
};

const template = fs.readFileSync(path.join(root, 'src/template.css'), 'utf8');
const check = process.argv.includes('--check');
let stale = 0;

for (const [name, outFile] of Object.entries(OUTPUT)) {
  const src = fs.readFileSync(path.join(root, 'themes', `${name}.css`), 'utf8');
  const m = src.match(/^([\s\S]*?)\n\/\*@@LIGHT@@\*\/\n([\s\S]*?)\n\/\*@@DARK@@\*\/\n([\s\S]*)$/);
  if (!m) throw new Error(`themes/${name}.css must contain /*@@LIGHT@@*/ and /*@@DARK@@*/ markers`);
  const [, header, light, dark] = m;
  const out = template
    .replace('/*@@HEADER@@*/\n', () => header.trimEnd() + '\n')
    .replace('/*@@LIGHT@@*/\n', () => light.trimEnd() + '\n')
    .replace('/*@@DARK@@*/\n', () => dark.trimEnd() + '\n');
  const outPath = path.join(root, outFile);
  if (check) {
    const cur = fs.existsSync(outPath) ? fs.readFileSync(outPath, 'utf8') : '';
    if (cur !== out) { console.error(`✖ ${outFile} is out of date, run: npm run build`); stale++; }
  } else {
    fs.writeFileSync(outPath, out);
    console.log(`built ${outFile} (${(Buffer.byteLength(out) / 1024).toFixed(1)} KB)`);
  }
}
process.exit(stale ? 1 : 0);
