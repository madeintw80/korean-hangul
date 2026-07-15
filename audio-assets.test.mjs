import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const manifestSource = fs.readFileSync(path.join(root, 'audio', 'manifest.js'), 'utf8');
const manifest = JSON.parse(
  manifestSource.replace(/^self\.HANGUL_AUDIO = /, '').replace(/;\s*$/, '')
);

const vowelSamples = [
  '아','어','오','우','으','이','야','여','요','유','애','에','얘','예','와','왜','외','워','웨','위','의',
];
const consonantSamples = [
  '가','나','다','라','마','바','사','아','자','하','카','타','파','차','까','따','빠','싸','짜',
];
const batchimSamples = [
  '악','책','안','손','앋','옷','알','물','암','밤','압','밥','앙','강',
];

assert.equal(manifest.version, '2.4.0');
assert.deepEqual(Object.keys(manifest.voices), ['sarah', 'olivia', 'emily']);
assert.equal(manifest.files.length, Object.keys(manifest.texts).length * 3);
assert.equal(manifest.coreFiles.length, 54 * 3);

for (const text of [...vowelSamples, ...consonantSamples, ...batchimSamples, manifest.previewText]) {
  assert.ok(manifest.texts[text], `missing core text: ${text}`);
  assert.deepEqual(Object.keys(manifest.texts[text]), ['sarah', 'olivia', 'emily']);
}

for (const relPath of manifest.files) {
  const fullPath = path.join(root, relPath);
  assert.ok(fs.existsSync(fullPath), `missing file: ${relPath}`);
  assert.ok(fs.statSync(fullPath).size > 1000, `audio file too small: ${relPath}`);
}

const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
assert.ok(index.indexOf('audio/manifest.js') < index.indexOf('app.js'));
assert.match(index, /value="static"/);
assert.match(index, /id="naturalVoiceSelect"/);

const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
assert.match(app, /function playStatic/);
assert.match(app, /playStatic\(text, r\)\.catch\(\(\) => speakSystem/);

const sw = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');
assert.match(sw, /hangul-v2\.4\.0/);
assert.match(sw, /CORE_AUDIO/);

console.log(`PASS: ${Object.keys(manifest.texts).length} texts × 3 voices = ${manifest.files.length} MP3 files`);
