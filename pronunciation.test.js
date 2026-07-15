/* 韓文發音／注音回歸測試：不載入瀏覽器，只執行 app.js 裡的純函式。 */
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const source = fs.readFileSync('app.js', 'utf8');
const context = vm.createContext({
  console,
  window: {},
  document: { addEventListener() {} },
  navigator: {},
  localStorage: { getItem() { return null; }, setItem() {} },
  setTimeout,
  clearTimeout,
});

vm.runInContext(source, context, { filename: 'app.js' });
const evaluate = expression => vm.runInContext(expression, context);

assert.equal(evaluate('vowelGroups.flatMap(group => group.items).length'), 21, '應有 21 個母音');
assert.equal(evaluate('consonantGroups.flatMap(group => group.items).length'), 19, '應有 19 個子音');

const pronunciationCases = {
  '굳이': '구지',
  '좋아': '조아',
  '밝히다': '발키다',
  '붉게': '불께',
  '닭과': '닥꽈',
  '신라': '실라',
  '왔나': '완나',
  '학교': '학꾜',
  '희망': '히망',
  '띄어쓰기': '띠어쓰기',
  '주의': '주의',
};

for (const [written, expected] of Object.entries(pronunciationCases)) {
  assert.equal(evaluate(`applyPronWord(${JSON.stringify(written)}).pron`), expected, `${written} 的實際唸法`);
}

const zhuyinCases = {
  '차': 'ㄑㄚ',
  '치': 'ㄑㄧ',
  '시': 'ㄒㄧ',
  '쉬': 'ㄒㄨㄧ',
  '언': 'ㄜㄣ',
  '엉': 'ㄜㄥ',
  '은': 'ㄜㄣ',
  '응': 'ㄜㄥ',
  '안': 'ㄢ',
  '강': 'ㄍㄤ',
  '공': 'ㄍㄨㄥ',
  '앋': 'ㄚ(ㄉ)',
  '옫': 'ㄛ(ㄉ)',
  '압': 'ㄚ(ㄅ)',
  '언니': 'ㄜㄣ·ㄋㄧ',
};

for (const [hangul, expected] of Object.entries(zhuyinCases)) {
  assert.equal(evaluate(`zhuWord(${JSON.stringify(hangul)})`), expected, `${hangul} 的注音近似`);
}

const allMappingsAreDefined = evaluate(`CHO.every(cho => JUNG.every(jung =>
  ['', 'ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅇ'].every(jong => {
    const output = zhuSyl({ cho, jung, jong });
    return typeof output === 'string' && output.length > 0 && !output.includes('undefined');
  })
))`);
assert.equal(allMappingsAreDefined, true, '19×21×8 的注音組合都必須有輸出');

assert.ok(evaluate(`voiceQualityScore({ name: 'Microsoft SunHi Online (Natural)' })`) > evaluate(`voiceQualityScore({ name: 'Google 한국의' })`));
assert.ok(evaluate(`voiceQualityScore({ name: 'Google 한국의' })`) > evaluate(`voiceQualityScore({ name: 'Yuna' })`));
assert.ok(evaluate(`voiceQualityScore({ name: 'Yuna' })`) > evaluate(`voiceQualityScore({ name: 'Basic Korean' })`));
assert.equal(evaluate(`voiceQualityScore({ name: 'Microsoft InJoon' })`), evaluate(`voiceQualityScore({ name: 'Yuna' })`));

console.log('PASS: 21 母音、19 子音、11 組變音、15 組注音與 3,192 組合覆蓋');
