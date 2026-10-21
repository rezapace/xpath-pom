#!/usr/bin/env node
'use strict';

/**
 * Builds the production zip for the Chrome extension.
 *
 * Output: release/xpath-pom-v<version>.zip containing a single xpath-pom/
 * folder with only the files Chrome needs to load the unpacked extension.
 */

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'manifest.json'), 'utf8'));
const version = manifest.version;
const outDir = path.join(root, 'release');
const stage = path.join(outDir, 'xpath-pom');
const zipName = `xpath-pom-v${version}.zip`;

const FILES = ['manifest.json', 'background.js', 'content.js', 'content.css'];
const DIRS = ['icons'];

function rmrf(target) {
  if (fs.existsSync(target)) fs.rmSync(target, { recursive: true, force: true });
}

rmrf(outDir);
fs.mkdirSync(stage, { recursive: true });

for (const file of FILES) {
  fs.copyFileSync(path.join(root, file), path.join(stage, file));
}

for (const dir of DIRS) {
  const src = path.join(root, dir);
  const dest = path.join(stage, dir);
  fs.mkdirSync(dest, { recursive: true });
  for (const name of fs.readdirSync(src)) {
    if (name === '.DS_Store') continue;
    const from = path.join(src, name);
    if (fs.statSync(from).isFile()) fs.copyFileSync(from, path.join(dest, name));
  }
}

const zipPath = path.join(outDir, zipName);
execFileSync('zip', ['-qr', zipName, 'xpath-pom', '-x', '*.DS_Store'], {
  cwd: outDir,
  stdio: 'inherit'
});

console.log(`built ${path.relative(root, zipPath)} (${fs.statSync(zipPath).size} bytes)`);
