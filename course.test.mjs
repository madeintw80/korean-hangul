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

assert.equal(course.version, '3.0.2-preview');
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

assert.deepEqual(Array.from(course.batchimFamilies, family => family.sound), ['ㄱ', 'ㄷ', 'ㅂ']);
assert.deepEqual(Array.from(course.resonantBatchim, item => item.letter), ['ㄴ', 'ㅁ', 'ㅇ', 'ㄹ']);
assert.equal(course.doubleBatchim.length, 11);

for (const id of ['course-view', 'matrix-view', 'final-view', 'course-quiz-view', 'toolbox-view']) {
  assert.match(index, new RegExp(`id=["']${id}["']`));
}
for (const id of ['track-idols', 'track-lyrics', 'tab-idols', 'tab-lyrics']) {
  assert.match(index, new RegExp(`id=["']${id}["']`));
}
for (const id of ['track-vowels', 'track-consonants', 'track-batchim', 'track-lab', 'track-quiz']) {
  assert.doesNotMatch(index, new RegExp(`id=["']${id}["']`));
}
for (const mode of ['split', 'hear', 'final']) {
  assert.match(courseJs, new RegExp(`id:["']${mode}["']`));
}
assert.doesNotMatch(courseJs, /id:["']compose["']/);
assert.match(courseJs, /courseQuiz\.audio = item\.word/);
assert.match(courseJs, /if \(courseQuiz\.audio\) speak\(courseQuiz\.audio\)/);

console.log('PASS: 9 lessons, 399 syllables, 7 final sounds, and 3 narrated quiz modes are wired');
