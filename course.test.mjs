import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'course-data.js'), 'utf8'), sandbox);
const course = sandbox.window.HANGUL_COURSE_DATA;
const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const courseJs = fs.readFileSync(path.join(root, 'course.js'), 'utf8');

assert.equal(course.version, '3.2.0-preview');
assert.equal(course.lessons.length, 9);
assert.deepEqual(
  Array.from(course.lessons.find(lesson => lesson.id === 'aspirated').sounds, item => item.letter),
  ['ㅋ', 'ㅌ', 'ㅍ', 'ㅊ', 'ㅎ']
);
assert.deepEqual(
  Array.from(course.lessons.find(lesson => lesson.id === 'resonants').sounds, item => item.letter),
  ['ㄴ', 'ㅁ', 'ㅇ', 'ㄹ']
);

const full = course.matrixGroups.find(group => group.id === 'all');
assert.equal(full.consonants.length, 19);
assert.equal(full.vowels.length, 21);
assert.equal(full.consonants.length * full.vowels.length, 399);

assert.deepEqual(Array.from(course.singleBatchim, item => item.sound), ['ㄱ', 'ㄴ', 'ㅁ', 'ㅇ', 'ㄹ', 'ㄷ', 'ㅂ']);
assert.deepEqual(Array.from(course.singleBatchim, item => item.standalone), ['악', '안', '암', '앙', '알', '앋', '압']);
for (const item of course.singleBatchim) {
  assert.ok(item.cue && item.spellings.length && item.example.word && item.example.mean, `${item.sound} 單收音資料完整`);
}
assert.deepEqual(Array.from(course.doubleBatchimGroups, group => group.sound), ['ㄱ', 'ㄴ', 'ㅁ', 'ㄹ', 'ㅂ']);
assert.deepEqual(
  Array.from(course.doubleBatchimGroups.flatMap(group => group.items), item => item.letters).sort(),
  ['ㄳ','ㄵ','ㄶ','ㄺ','ㄻ','ㄼ','ㄽ','ㄾ','ㄿ','ㅀ','ㅄ'].sort()
);
assert.equal(course.doubleBatchimLiaison.length, 8);
assert.equal(course.doubleBatchimExceptions.length, 2);
for (const item of [
  ...course.doubleBatchimGroups.flatMap(group => group.items),
  ...course.doubleBatchimLiaison,
  ...course.doubleBatchimExceptions,
]) {
  assert.ok(item.word && item.pronounced, `雙收音 ${item.letters || item.title} 需要拼法與實際讀音`);
}
assert.deepEqual(Array.from(course.soundChanges, rule => rule.id), ['liaison', 'nasal', 'tense', 'aspiration', 'palatal']);
assert.equal(course.soundChanges.flatMap(rule => rule.examples).length, 15);
for (const rule of course.soundChanges) {
  assert.ok(rule.examples.length >= 2, `${rule.label} 至少需要兩組例字`);
  for (const example of rule.examples) {
    assert.ok(example.written && example.pronounced && example.note, `${rule.label} 例字資料完整`);
  }
}

for (const id of ['course-view', 'matrix-view', 'final-view', 'sound-change-view', 'course-quiz-view', 'toolbox-view']) {
  assert.match(index, new RegExp(`id=["']${id}["']`));
}
for (const id of ['track-idols', 'track-lyrics', 'tab-idols', 'tab-lyrics']) {
  assert.match(index, new RegExp(`id=["']${id}["']`));
}
for (const id of ['track-vowels', 'track-consonants', 'track-batchim', 'track-lab', 'track-quiz']) {
  assert.doesNotMatch(index, new RegExp(`id=["']${id}["']`));
}
for (const mode of ['split', 'hear', 'final', 'sound']) {
  assert.match(courseJs, new RegExp(`id:["']${mode}["']`));
}
assert.doesNotMatch(courseJs, /id:["']compose["']/);
assert.match(courseJs, /courseQuiz\.audio = item\.word/);
assert.match(courseJs, /courseQuiz\.audio = item\.written/);
assert.match(courseJs, /if \(courseQuiz\.audio\) speak\(courseQuiz\.audio\)/);

console.log('PASS: 9 lessons, 399 syllables, 7 standalone final sounds, 11 double finals, 5 sound changes, and 4 narrated quiz modes are wired');
