import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'manifest.json'), 'utf8'));
const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
assert.match(index, /<title>한글 Studio v3\.3\.2 Preview/);
const sw = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');
const generator = fs.readFileSync(path.join(root, 'generate_icons.py'), 'utf8');

const expectedIcons = [
  { src: 'icons/favicon-32.png', size: 32 },
  { src: 'icons/apple-touch-icon-180.png', size: 180 },
  { src: 'icons/icon-192.png', size: 192, purpose: 'any' },
  { src: 'icons/icon-512.png', size: 512, purpose: 'any' },
  { src: 'icons/icon-maskable-512.png', size: 512, purpose: 'maskable' },
];

function pngSize(filePath) {
  const data = fs.readFileSync(filePath);
  assert.deepEqual([...data.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
  return { width: data.readUInt32BE(16), height: data.readUInt32BE(20) };
}

for (const icon of expectedIcons) {
  const dimensions = pngSize(path.join(root, icon.src));
  assert.deepEqual(dimensions, { width: icon.size, height: icon.size });
  assert.match(sw, new RegExp(icon.src.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
}

assert.deepEqual(
  manifest.icons,
  expectedIcons.slice(2).map(icon => ({
    src: icon.src,
    sizes: `${icon.size}x${icon.size}`,
    type: 'image/png',
    purpose: icon.purpose,
  }))
);
assert.match(index, /icons\/favicon-32\.png/);
assert.match(index, /icons\/apple-touch-icon-180\.png/);
assert.match(index, /한글 Studio v3\.3\.2-preview/);
assert.match(index, /PUBLIC PREVIEW/);
assert.match(index, /公開預覽版・三內建女聲全覆蓋＋短音一致化/);
assert.match(index, /app\.js\?v=3\.3\.2/);
assert.match(sw, /hangul-v3\.3\.2-preview-public/);
assert.match(sw, /app\.js\?v=3\.3\.2/);
assert.match(sw, /audio\/manifest\.js\?v=3\.3\.2/);
assert.match(sw, /course-data\.js/);
assert.match(sw, /course\.js/);
assert.doesNotMatch(generator, /BASE\s*=\s*r?["']C:\\\\Users/i);

console.log('PASS: favicon, course assets, PWA any, and maskable icons are wired for v3.3.2-preview-public');
