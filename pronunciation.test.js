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
  '가져': '가저',
  '다쳐': '다처',
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
  '안의': '아니',
  '닦다': '닥따',
  '옷': '옫',
  '앞': '압',
  '앉다': '안따',
  '넓다': '널따',
  '밟다': '밥따',
  '넓죽하다': '넙쭈카다',
  '닭': '닥',
  '삶': '삼',
  '읊다': '읍따',
  '놓는': '논는',
  '많아': '마나',
  '꽃을': '꼬츨',
  '넋이': '넉씨',
  '값을': '갑쓸',
  '맛없다': '마덥따',
  '겉옷': '거돋',
  '값어치': '가버치',
  '디귿이': '디그시',
  '지읒이': '지으시',
  '치읓이': '치으시',
  '키읔이': '키으기',
  '티읕이': '티으시',
  '피읖이': '피으비',
  '히읗이': '히으시',
  '먹어': '머거',
  '집에': '지베',
  '읽어': '일거',
  '없어': '업써',
  '국물': '궁물',
  '먹는': '멍는',
  '앞문': '암문',
  '먹다': '먹따',
  '잡지': '잡찌',
  '좋다': '조타',
  '축하': '추카',
  '입학': '이팍',
  '같이': '가치',
  '앞마당': '암마당',
  '담력': '담녁',
  '석류': '성뉴',
  '난로': '날로',
  '칼날': '칼랄',
  '생산량': '생산냥',
  '공권력': '공꿘녁',
  '앉고': '안꼬',
  '닮고': '담꼬',
  '넓게': '널께',
  '핥다': '할따',
  '갈등': '갈뜽',
  '발전': '발쩐',
  '할걸': '할껄',
  '할수록': '할쑤록',
  '문고리': '문꼬리',
  '맘속': '맘쏙',
  '꽃잎': '꼰닙',
  '담요': '담뇨',
  '물약': '물략',
  '냇가': '내까',
  '깻잎': '깬닙',
  '콧날': '콘날',
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

assert.equal(
  evaluate(`songs.find(item => item.song === 'Supernova').lines.find(line => line.han.includes('커져가')).pron`),
  '거세게 커저가 Ah Oh Ay'
);
assert.equal(
  evaluate(`songs.find(item => item.song === 'LEMONADE').lines.find(line => line.han.startsWith('겁 없이')).pron`),
  '거법씨 Walk my way'
);
assert.equal(
  evaluate(`songs.find(item => item.song === 'Love Me Like This').lines.find(line => line.han.startsWith('맘속')).pron`),
  '맘쏙 Fireworks'
);

console.log(`PASS: 21 母音、19 子音、${Object.keys(pronunciationCases).length} 組變音、15 組注音與 3,192 組合覆蓋`);
