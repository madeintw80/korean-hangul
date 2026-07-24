import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
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
const doubleBatchimSamples = [
  '넋','앉다','많다','닭','삶','여덟','외곬','핥다','싫다','없다','읊다',
  '넋이','앉아','닭을','젊어','읊어','없어','많아','싫어',
  '읽고','밟다',
];
const nmixxSamples = [
  '뛰는 심장 소릴 따라가',
  '맘속 Fireworks',
  '하늘 위로 닻을 던져봐',
  '한 발만 내디뎌',
  '마음 안의 말 털어내 Voice up',
  '그래, 난 별별별',
  '날 믿고 다음 다음 Step을 밟아',
  '이젠 알아',
];
const courseContext = { window: {} };
vm.createContext(courseContext);
vm.runInContext(
  fs.readFileSync(path.join(root, 'course-data.js'), 'utf8'),
  courseContext,
);
const soundChangeSamples = courseContext.window.HANGUL_COURSE_DATA.soundChanges
  .flatMap((group) => group.examples.map((example) => example.written));
const updatedSongPronSamples = [
  '거세게 커저가 Ah Oh Ay',
  '거법씨 Walk my way',
  '던저 On my stage',
  '맘쏙 Fireworks',
];

assert.equal(manifest.version, '3.3.0-preview');
assert.deepEqual(Object.keys(manifest.voices), ['sarah', 'olivia', 'emily']);
assert.equal(Object.keys(manifest.texts).length, 221);
assert.equal(manifest.files.length, Object.keys(manifest.texts).length * 3);
assert.equal(manifest.coreFiles.length, 136 * 3);

for (const text of [...vowelSamples, ...consonantSamples, ...batchimSamples, manifest.previewText]) {
  assert.ok(manifest.texts[text], `missing core text: ${text}`);
  assert.deepEqual(Object.keys(manifest.texts[text]), ['sarah', 'olivia', 'emily']);
}

for (const text of nmixxSamples) {
  assert.ok(manifest.texts[text], `missing NMIXX text: ${text}`);
  assert.deepEqual(Object.keys(manifest.texts[text]), ['sarah', 'olivia', 'emily']);
}

for (const text of soundChangeSamples) {
  assert.ok(manifest.texts[text], `missing sound-change text: ${text}`);
  assert.deepEqual(Object.keys(manifest.texts[text]), ['sarah', 'olivia', 'emily']);
  for (const relPath of Object.values(manifest.texts[text])) {
    assert.ok(manifest.coreFiles.includes(relPath), `sound-change audio is not in core cache: ${relPath}`);
  }
}

for (const text of updatedSongPronSamples) {
  assert.ok(manifest.texts[text], `missing updated song pronunciation: ${text}`);
  assert.deepEqual(Object.keys(manifest.texts[text]), ['sarah', 'olivia', 'emily']);
  for (const relPath of Object.values(manifest.texts[text])) {
    assert.ok(manifest.coreFiles.includes(relPath), `song pronunciation audio is not in core cache: ${relPath}`);
  }
}

for (const text of doubleBatchimSamples) {
  assert.ok(manifest.texts[text], `missing double-batchim text: ${text}`);
  assert.deepEqual(Object.keys(manifest.texts[text]), ['sarah', 'olivia', 'emily']);
  for (const relPath of Object.values(manifest.texts[text])) {
    assert.ok(manifest.coreFiles.includes(relPath), `double-batchim audio is not in core cache: ${relPath}`);
  }
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
assert.match(app, /speak\(line\.han, 0\.6\)/);
assert.doesNotMatch(app, /speak\(a\.pron, 0\.6\)/);

const course = fs.readFileSync(path.join(root, 'course.js'), 'utf8');
assert.match(course, /\.slow'\)\.onclick = \(\) => speak\(example\.written, 0\.72\)/);

const songsSource = app.slice(app.indexOf('const songs = ['), app.indexOf('const CHO'));
const lyricLines = [...songsSource.matchAll(/han:\s*(['"])(.*?)\1/g)].map((match) => match[2]);
const allEnglishLines = lyricLines.filter((line) => !/[가-힣]/.test(line));
assert.ok(lyricLines.length > 0, 'failed to extract built-in lyric lines');
assert.deepEqual(allEnglishLines, [], `all-English built-in lyrics are not allowed: ${allEnglishLines.join(' | ')}`);

for (const removedText of [
  "I'm on the next level",
  "I'll make it LEMONADE",
  "You'll always be my blue valentine",
]) {
  assert.equal(manifest.texts[removedText], undefined, `removed English lyric remains in manifest: ${removedText}`);
}

const sw = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');
assert.match(sw, /hangul-v3\.3\.0-preview-public/);
assert.match(sw, /CORE_AUDIO/);

console.log(`PASS: ${Object.keys(manifest.texts).length} texts × 3 voices = ${manifest.files.length} MP3 files`);
