/* =====================================================================
   한글 練習 PWA — 主程式
   - 用瀏覽器內建 Web Speech API 唸韓文（不需後端、不需金鑰）
   - 資料驅動：母音/子音/받침/女團/歌曲 都放在陣列，方便日後擴充
   - v2.0.0 新增：發音變化引擎（連音/鼻音化/緊音化…自動標出「實際唸法」）
     + 歌詞逐字跟讀 + 貼歌詞自動拆解
   ===================================================================== */

/* ---------------------------------------------------------------------
   1. 資料區
   - h  = 字母本身
   - r  = 羅馬拼音
   - s  = 配 ㅇ 的完整音節（唸這個比唸單獨字母準）
   - hint = 注音發音提示
   --------------------------------------------------------------------- */

// 母音（21 個，分 4 組教學）
const vowelGroups = [
  { title: '基本母音', items: [
    { h:'ㅏ', r:'a',  s:'아', hint:'ㄚ' },
    { h:'ㅓ', r:'eo', s:'어', hint:'ㄜ(嘴張大)' },
    { h:'ㅗ', r:'o',  s:'오', hint:'ㄛ(嘴圓)' },
    { h:'ㅜ', r:'u',  s:'우', hint:'ㄨ' },
    { h:'ㅡ', r:'eu', s:'으', hint:'≈ㄜ(扁嘴)' },
    { h:'ㅣ', r:'i',  s:'이', hint:'ㄧ' },
  ]},
  { title: 'Y 母音（前面多一個 y 音）', items: [
    { h:'ㅑ', r:'ya',  s:'야', hint:'ㄧㄚ' },
    { h:'ㅕ', r:'yeo', s:'여', hint:'ㄧㄜ' },
    { h:'ㅛ', r:'yo',  s:'요', hint:'ㄧㄛ' },
    { h:'ㅠ', r:'yu',  s:'유', hint:'ㄧㄨ' },
  ]},
  { title: 'ㅐ ㅔ 系（都唸「ㄝ」）', items: [
    { h:'ㅐ', r:'ae', s:'애', hint:'ㄝ' },
    { h:'ㅔ', r:'e',  s:'에', hint:'ㄝ' },
    { h:'ㅒ', r:'yae', s:'얘', hint:'ㄧㄝ' },
    { h:'ㅖ', r:'ye',  s:'예', hint:'ㄧㄝ' },
  ]},
  { title: 'W 複合母音（前面多一個 w 音）', items: [
    { h:'ㅘ', r:'wa',  s:'와', hint:'ㄨㄚ' },
    { h:'ㅙ', r:'wae', s:'왜', hint:'ㄨㄝ' },
    { h:'ㅚ', r:'oe',  s:'외', hint:'ㄨㄝ' },
    { h:'ㅝ', r:'wo',  s:'워', hint:'ㄨㄛ' },
    { h:'ㅞ', r:'we',  s:'웨', hint:'ㄨㄝ' },
    { h:'ㅟ', r:'wi',  s:'위', hint:'ㄨㄧ' },
    { h:'ㅢ', r:'ui',  s:'의', hint:'≈ㄜㄧ' },
  ]},
];

// 子音（19 個，分 3 組）— 子音配 ㅏ 唸（가 나 다…）比較準
const consonantGroups = [
  { title: '平音（基本，輕鬆發）', items: [
    { h:'ㄱ', r:'g/k', s:'가', hint:'ㄍ／가' },
    { h:'ㄴ', r:'n',   s:'나', hint:'ㄋ／나' },
    { h:'ㄷ', r:'d/t', s:'다', hint:'ㄉ／다' },
    { h:'ㄹ', r:'r/l', s:'라', hint:'ㄌ／라(舌輕彈)' },
    { h:'ㅁ', r:'m',   s:'마', hint:'ㄇ／마' },
    { h:'ㅂ', r:'b/p', s:'바', hint:'ㄅ／바' },
    { h:'ㅅ', r:'s',   s:'사', hint:'ㄙ／사(ㅣ前像ㄒ)' },
    { h:'ㅇ', r:'不發音/ng', s:'아', hint:'開頭不發音' },
    { h:'ㅈ', r:'j',   s:'자', hint:'ㄐ／자' },
    { h:'ㅎ', r:'h',   s:'하', hint:'ㄏ／하' },
  ]},
  { title: '送氣音（用力吐一口氣）', items: [
    { h:'ㅋ', r:'k',  s:'카', hint:'ㄎ（ㄱ吐氣）' },
    { h:'ㅌ', r:'t',  s:'타', hint:'ㄊ（ㄷ吐氣）' },
    { h:'ㅍ', r:'p',  s:'파', hint:'ㄆ（ㅂ吐氣）' },
    { h:'ㅊ', r:'ch', s:'차', hint:'ㄘ（ㅈ吐氣）' },
  ]},
  { title: '緊音（繃緊喉嚨、短促）', items: [
    { h:'ㄲ', r:'kk', s:'까', hint:'用力ㄍ' },
    { h:'ㄸ', r:'tt', s:'따', hint:'用力ㄉ' },
    { h:'ㅃ', r:'pp', s:'빠', hint:'用力ㄅ' },
    { h:'ㅆ', r:'ss', s:'싸', hint:'用力ㄙ' },
    { h:'ㅉ', r:'jj', s:'짜', hint:'用力ㄐ' },
  ]},
];

// 받침（收尾音）— 7 個代表音 + 真實例字
const batchim = [
  { h:'ㄱ', r:'k',  zhu:'ㄍ(擋住)', s:'악', ex:'책', exr:'chaek', exm:'書' },
  { h:'ㄴ', r:'n',  zhu:'ㄣ',       s:'안', ex:'손', exr:'son',   exm:'手' },
  { h:'ㄷ', r:'t',  zhu:'ㄊ(擋住)', s:'앋', ex:'옷', exr:'ot',    exm:'衣服' },
  { h:'ㄹ', r:'l',  zhu:'ㄌ',       s:'알', ex:'물', exr:'mul',   exm:'水' },
  { h:'ㅁ', r:'m',  zhu:'ㄇ(閉嘴)', s:'암', ex:'밤', exr:'bam',   exm:'夜晚' },
  { h:'ㅂ', r:'p',  zhu:'ㄅ(閉唇)', s:'압', ex:'밥', exr:'bap',   exm:'飯' },
  { h:'ㅇ', r:'ng', zhu:'ㄥ',       s:'앙', ex:'강', exr:'gang',  exm:'江' },
];

// 女團拼讀案例庫
const groups = [
  { name:'aespa',       han:'에스파', rom:'e-seu-pa' },
  { name:'NMIXX',       han:'엔믹스', rom:'en-mik-seu' },
  { name:'ITZY',        han:'있지',   rom:'it-ji' },
  { name:'NewJeans',    han:'뉴진스', rom:'nyu-jin-seu' },
  { name:'IVE',         han:'아이브', rom:'a-i-beu' },
  { name:'LE SSERAFIM', han:'르세라핌', rom:'leu-se-ra-pim' },
  { name:'(G)I-DLE',    han:'아이들', rom:'a-i-deul' },
  { name:'BLACKPINK',   han:'블랙핑크', rom:'beul-laek-ping-keu' },
  { name:'TWICE',       han:'트와이스', rom:'teu-wa-i-seu' },
  { name:'Red Velvet',  han:'레드벨벳', rom:'re-deu-bel-bet' },
];

// 追星常用語
const phrases = [
  { han:'안녕하세요', rom:'annyeonghaseyo', mean:'你好' },
  { han:'사랑해요',   rom:'saranghaeyo',    mean:'我愛你' },
  { han:'화이팅',     rom:'hwaiting',       mean:'加油(Fighting)' },
  { han:'진짜',       rom:'jinjja',         mean:'真的假的' },
  { han:'대박',       rom:'daebak',         mean:'超讚/誇張' },
  { han:'오빠',       rom:'oppa',           mean:'哥哥(女生叫男生)' },
  { han:'언니',       rom:'eonni',          mean:'姊姊(女生叫女生)' },
];

// 拼字實驗室「範例字」— 只存 子音/母音/收尾，字本身由 composeHangul 算（保證一致）
const labExamples = [
  { cho:'ㅎ', jung:'ㅏ', jong:'ㄴ', mean:'韓' },   // 한
  { cho:'ㄱ', jung:'ㅡ', jong:'ㄹ', mean:'字' },   // 글
  { cho:'ㅂ', jung:'ㅏ', jong:'ㅂ', mean:'飯' },   // 밥
  { cho:'ㅁ', jung:'ㅜ', jong:'ㄹ', mean:'水' },   // 물
  { cho:'ㄲ', jung:'ㅜ', jong:'ㅁ', mean:'夢' },   // 꿈
  { cho:'ㅂ', jung:'ㅕ', jong:'ㄹ', mean:'星' },   // 별
  { cho:'ㅂ', jung:'ㅗ', jong:'ㅁ', mean:'春' },   // 봄
  { cho:'ㄱ', jung:'ㅏ', jong:'ㅇ', mean:'江' },   // 강
];

/* ---------------------------------------------------------------------
   1.5 歌曲庫（v2：副歌精華句，Hangul 已逐句查證）
   - han  = 歌詞原文（寫的字）
   - mean = 中文意思
   - pron = 「實際唸法」人工 override（只有不規則變音才需要寫；
            沒寫的話由發音引擎自動算）
   - changes = 搭配 pron 的人工變音說明（格式同引擎輸出）
   --------------------------------------------------------------------- */
const songs = [
  { group:'aespa', song:'Next Level', year:2021, lines:[
    { han:"I'm on the next level", mean:'我上到下一個層級（英文 hook）' },
    { han:'절대적 룰을 지켜', mean:'遵守絕對的規則',
      pron:'절때적 루를 지켜',
      changes:[
        { from:'절대적', to:'절때적', rule:'漢字語緊音化', desc:'漢字語的 ㄹ받침＋ㄷ 常變緊音 ㄸ（字典型例外，背起來）' },
        { from:'룰을', to:'루를', rule:'連音', desc:'받침 ㄹ 滑到下一個字當開頭' },
      ] },
    { han:'광야로 걸어가', mean:'走向曠野（aespa 世界觀 KWANGYA）' },
    { han:'내 손을 놓지 말아', mean:'別放開我的手' },
    { han:'결속은 나의 무기', mean:'羈絆是我的武器',
      pron:'결쏘근 나의 무기',
      changes:[
        { from:'결속', to:'결쏙', rule:'漢字語緊音化', desc:'漢字語 ㄹ받침 後面的 ㅅ 變緊音 ㅆ' },
        { from:'쏙은', to:'쏘근', rule:'連音', desc:'받침 ㄱ 滑到下一個字當開頭' },
      ] },
    { han:'제껴라 제껴라 제껴라', mean:'甩開他們！（經典口號）' },
  ]},
  { group:'aespa', song:'Supernova', year:2024, lines:[
    { han:'사건은 다가와 Ah Oh Ay', mean:'事件正在逼近',
      pron:'사꺼는 다가와 Ah Oh Ay',
      changes:[
        { from:'사건', to:'사껀', rule:'漢字語緊音化', desc:'這個詞習慣唸緊音（字典型例外）' },
        { from:'껀은', to:'꺼는', rule:'連音', desc:'받침 ㄴ 滑到下一個字當開頭' },
      ] },
    { han:'거세게 커져가 Ah Oh Ay', mean:'猛烈地擴大' },
    { han:'질문은 계속돼 Ah Oh Ay', mean:'疑問不斷持續' },
    { han:'우린 어디서 왔나 Oh Ay', mean:'我們從哪裡來' },
    { han:'원초 그걸 찾아', mean:'尋找那個起源' },
    { han:'불러낸 내 우주를 봐 봐', mean:'看我召喚出的宇宙' },
    { han:'수수수 Supernova', mean:'Su-su-su 超新星（洗腦 hook）' },
  ]},
  { group:'NMIXX', song:'DASH', year:2024, lines:[
    { han:'날 막아선 barricade', mean:'擋住我的路障' },
    { han:'사뿐히 즈려밟고 가', mean:'輕盈地踩過去（化用名詩《진달래꽃》）' },
  ]},
  { group:'ITZY', song:'WANNABE', year:2020, lines:[
    { han:'잔소리는 Stop it 알아서 할게', mean:'嘮叨 stop it，我自己會搞定',
      pron:'잔소리는 Stop it 아라서 할께',
      changes:[
        { from:'알아서', to:'아라서', rule:'連音', desc:'받침 ㄹ 滑到下一個字當開頭' },
        { from:'할게', to:'할께', rule:'語尾緊音化', desc:'動詞語尾 -(으)ㄹ게 一律唸 께（超常見）' },
      ] },
    { han:'내가 뭐가 되든 내가 알아서 할 테니까 좀', mean:'不管我變成什麼樣，我會自己看著辦' },
    { han:'누가 뭐라 해도 난 나야', mean:'不管誰說什麼，我就是我' },
    { han:'난 그냥 내가 되고 싶어', mean:'我只想成為我自己' },
    { han:'굳이 뭔가 될 필요는 없어', mean:'不需要非得成為什麼' },
    { han:'난 그냥 나일 때 완벽하니까', mean:'因為我做自己的時候最完美' },
  ]},
];

/* ---------------------------------------------------------------------
   1.6 韓文組字/拆字工具
   --------------------------------------------------------------------- */
// 韓文組字用的三組字母（標準 Unicode 順序）
const CHO  = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ']; // 初聲 19
const JUNG = ['ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅗ','ㅘ','ㅙ','ㅚ','ㅛ','ㅜ','ㅝ','ㅞ','ㅟ','ㅠ','ㅡ','ㅢ','ㅣ']; // 中聲 21
const JONG = ['','ㄱ','ㄲ','ㄳ','ㄴ','ㄵ','ㄶ','ㄷ','ㄹ','ㄺ','ㄻ','ㄼ','ㄽ','ㄾ','ㄿ','ㅀ','ㅁ','ㅂ','ㅄ','ㅅ','ㅆ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ']; // 終聲 28（含「無」）

/* 韓文組字公式：把 初聲+中聲+終聲 合成一個方塊字
   code = 0xAC00 + (初聲序 × 21 + 中聲序) × 28 + 終聲序
   例：ㅎ+ㅏ+ㄴ → 한 */
function composeHangul(choChar, jungChar, jongChar) {
  const ci = CHO.indexOf(choChar);
  const ji = JUNG.indexOf(jungChar);
  const ki = JONG.indexOf(jongChar || '');
  if (ci < 0 || ji < 0 || ki < 0) return '';
  return String.fromCharCode(0xAC00 + (ci * 21 + ji) * 28 + ki);
}

// 反向：把一個韓文字拆回 初聲/中聲/終聲（組字公式倒著算）
function decompose(ch) {
  const code = ch.charCodeAt(0) - 0xAC00;
  if (code < 0 || code > 11171) return null;   // 不是完成型韓文字
  return {
    cho:  CHO[Math.floor(code / 588)],
    jung: JUNG[Math.floor(code / 28) % 21],
    jong: JONG[code % 28],
  };
}

/* ---------------------------------------------------------------------
   1.7 發音變化引擎 ⚡（v2 核心）
   韓文「寫的字」和「實際唸的音」常常不同 — 這就是聽歌對不上歌詞的原因。
   這個引擎照「標準發音法」的常規規則，把單字轉成「實際唸法」：
     ① 口蓋音化：받침 ㄷ/ㅌ＋이 → 지/치（굳이→구지）
     ② ㅎ 相關：좋아→조아（ㅎ脫落）、놓지→노치（激音化）、완벽하니까→완벼카니까
     ③ 連音：받침 滑到下一個字當開頭（걸어가→거러가）
     ④ 받침代表音：받침再多種，實際只發 7 個音（옷→옫）
     ⑤ 流音化：신라→실라　⑥ 鼻音化：왔나→완나　⑦ 緊音化：밟고→밥꼬
   漢字語的特殊緊音（사건→사껀）是字典型例外，引擎查不出來 → 歌曲資料用 pron 人工 override
   --------------------------------------------------------------------- */

// 받침中和表：每個 받침 實際只發 7 個代表音之一
const JONG_NEUTRAL = {
  'ㄱ':'ㄱ','ㄲ':'ㄱ','ㅋ':'ㄱ','ㄳ':'ㄱ','ㄺ':'ㄱ',
  'ㄴ':'ㄴ','ㄵ':'ㄴ','ㄶ':'ㄴ',
  'ㄷ':'ㄷ','ㅅ':'ㄷ','ㅆ':'ㄷ','ㅈ':'ㄷ','ㅊ':'ㄷ','ㅌ':'ㄷ','ㅎ':'ㄷ',
  'ㄹ':'ㄹ','ㄼ':'ㄹ','ㄽ':'ㄹ','ㄾ':'ㄹ','ㅀ':'ㄹ',
  'ㅁ':'ㅁ','ㄻ':'ㅁ',
  'ㅂ':'ㅂ','ㅍ':'ㅂ','ㄿ':'ㅂ','ㅄ':'ㅂ',
  'ㅇ':'ㅇ', '':'',
};
// 雙받침遇母音的拆法：[留在原字的, 滑過去的]（없어→업써：ㅅ 滑過去且變 ㅆ）
const JONG_SPLIT = {
  'ㄳ':['ㄱ','ㅆ'], 'ㄵ':['ㄴ','ㅈ'], 'ㄺ':['ㄹ','ㄱ'], 'ㄻ':['ㄹ','ㅁ'],
  'ㄼ':['ㄹ','ㅂ'], 'ㄽ':['ㄹ','ㅆ'], 'ㄾ':['ㄹ','ㅌ'], 'ㄿ':['ㄹ','ㅍ'], 'ㅄ':['ㅂ','ㅆ'],
};
const ASPIRATE = { 'ㄱ':'ㅋ', 'ㄷ':'ㅌ', 'ㅈ':'ㅊ', 'ㅅ':'ㅆ' };          // ㅎ받침＋這些 → 送氣/緊音
const ASP_BY_JONG = { 'ㄱ':'ㅋ', 'ㄷ':'ㅌ', 'ㅂ':'ㅍ' };                  // 받침＋ㅎ → 送氣
const TENSE = { 'ㄱ':'ㄲ', 'ㄷ':'ㄸ', 'ㅂ':'ㅃ', 'ㅅ':'ㅆ', 'ㅈ':'ㅉ' };  // 緊音化
const NASAL = { 'ㄱ':'ㅇ', 'ㄷ':'ㄴ', 'ㅂ':'ㅁ' };                        // 鼻音化

// 把一個「純韓文單字」轉成實際唸法，回傳 { pron, changes:[{from,to,rule,desc}] }
function applyPronWord(word) {
  const syl = [...word].map(decompose);
  if (syl.some(s => !s)) return { pron: word, changes: [] };   // 夾雜非韓文 → 不處理
  const changes = [];
  const sylStr = s => composeHangul(s.cho, s.jung, s.jong);
  // 記錄一筆變音：from/to 都拍「這一步之前/之後」的字串
  const record = (idxs, before, rule, desc) => {
    const after = idxs.map(i => sylStr(syl[i])).join('');
    if (before !== after) changes.push({ from: before, to: after, rule, desc });
  };

  /* === Pass A：要用「原始받침」判斷的規則（由左到右）=== */
  for (let i = 0; i < syl.length - 1; i++) {
    const a = syl[i], b = syl[i + 1];
    const before = sylStr(a) + sylStr(b);

    // ① 口蓋音化：받침 ㄷ/ㅌ ＋ 이/여 → 지/치（굳이→구지、같이→가치）
    if ((a.jong === 'ㄷ' || a.jong === 'ㅌ') && b.cho === 'ㅇ' && (b.jung === 'ㅣ' || b.jung === 'ㅕ')) {
      b.cho = (a.jong === 'ㄷ') ? 'ㅈ' : 'ㅊ';
      a.jong = '';
      record([i, i + 1], before, '口蓋音化', '받침 ㄷ/ㅌ 遇「이」變 지/치');
      continue;
    }
    // ② ㅎ받침 遇母音 → ㅎ 不發音（좋아→조아；않아→아나）
    if ((a.jong === 'ㅎ' || a.jong === 'ㄶ' || a.jong === 'ㅀ') && b.cho === 'ㅇ') {
      if (a.jong === 'ㅎ') { a.jong = ''; }
      else { b.cho = (a.jong === 'ㄶ') ? 'ㄴ' : 'ㄹ'; a.jong = ''; }
      record([i, i + 1], before, 'ㅎ脫落', '받침 ㅎ 遇母音不發音');
      continue;
    }
    // ② ㅎ받침 ＋ ㄱ/ㄷ/ㅈ/ㅅ → 合體變送氣音（놓지→노치、않다→안타）
    if ((a.jong === 'ㅎ' || a.jong === 'ㄶ' || a.jong === 'ㅀ') && ASPIRATE[b.cho]) {
      b.cho = ASPIRATE[b.cho];
      a.jong = (a.jong === 'ㅎ') ? '' : (a.jong === 'ㄶ' ? 'ㄴ' : 'ㄹ');
      record([i, i + 1], before, '激音化', 'ㅎ 跟下一個子音合體變送氣音');
      continue;
    }
    // ② 받침 ＋ ㅎ → 送氣音（완벽하니까→완벼카니까、못해→모태）
    if (b.cho === 'ㅎ' && !JONG_SPLIT[a.jong] && ASP_BY_JONG[JONG_NEUTRAL[a.jong]]) {
      b.cho = ASP_BY_JONG[JONG_NEUTRAL[a.jong]];
      a.jong = '';
      record([i, i + 1], before, '激音化', '받침 跟 ㅎ 合體變送氣音');
      continue;
    }
    // ③ 連音：받침 滑到下一個字當開頭（걸어→거러；없어→업써）
    if (b.cho === 'ㅇ' && a.jong && a.jong !== 'ㅇ') {
      if (JONG_SPLIT[a.jong]) {            // 雙받침：留一個、滑一個
        b.cho = JONG_SPLIT[a.jong][1];
        a.jong = JONG_SPLIT[a.jong][0];
      } else {                              // 單받침：原音直接滑過去
        b.cho = a.jong;
        a.jong = '';
      }
      record([i, i + 1], before, '連音', '받침 滑到下一個字當開頭（遇母音）');
    }
  }

  /* === Pass B：받침中和（剩下的받침一律變 7 個代表音）=== */
  for (let i = 0; i < syl.length; i++) {
    const s = syl[i];
    if (!s.jong) continue;
    const before = sylStr(s);
    // 特例：밟 的 ㄼ 唸 ㅂ（一般 ㄼ 唸 ㄹ）
    const neutral = (sylStr(s) === '밟') ? 'ㅂ' : JONG_NEUTRAL[s.jong];
    if (neutral !== s.jong) {
      s.jong = neutral;
      record([i], before, '받침代表音', '받침實際只發 7 個代表音');
    }
  }

  /* === Pass C：用「代表音받침」判斷的規則（由左到右）=== */
  for (let i = 0; i < syl.length - 1; i++) {
    const a = syl[i], b = syl[i + 1];
    const before = sylStr(a) + sylStr(b);

    // ⑤ 流音化：ㄴ 遇 ㄹ 同化成 ㄹ（신라→실라、설날→설랄）
    if (a.jong === 'ㄴ' && b.cho === 'ㄹ') {
      a.jong = 'ㄹ';
      record([i, i + 1], before, '流音化', 'ㄴ 遇 ㄹ 被同化成 ㄹ');
      continue;
    }
    if (a.jong === 'ㄹ' && b.cho === 'ㄴ') {
      b.cho = 'ㄹ';
      record([i, i + 1], before, '流音化', 'ㄹ 後面的 ㄴ 被同化成 ㄹ');
      continue;
    }
    // ⑥ 鼻音化：받침 ㄱ/ㄷ/ㅂ 遇 ㄴ/ㅁ → ㅇ/ㄴ/ㅁ（왔나→완나、입니다→임니다）
    if ((b.cho === 'ㄴ' || b.cho === 'ㅁ') && NASAL[a.jong]) {
      a.jong = NASAL[a.jong];
      record([i, i + 1], before, '鼻音化', '받침 ㄱ/ㄷ/ㅂ 遇 ㄴ/ㅁ 變鼻音');
      continue;
    }
    // ⑥ ㄹ 的鼻音化：독립→동닙、정류→정뉴
    if (b.cho === 'ㄹ' && NASAL[a.jong]) {
      a.jong = NASAL[a.jong];
      b.cho = 'ㄴ';
      record([i, i + 1], before, '鼻音化', '받침＋ㄹ → 兩邊都變鼻音');
      continue;
    }
    if (b.cho === 'ㄹ' && (a.jong === 'ㅁ' || a.jong === 'ㅇ')) {
      b.cho = 'ㄴ';
      record([i, i + 1], before, '鼻音化', 'ㅁ/ㅇ받침 後面的 ㄹ 唸 ㄴ');
      continue;
    }
    // ⑦ 緊音化：받침 ㄱ/ㄷ/ㅂ 後面的 ㄱ/ㄷ/ㅂ/ㅅ/ㅈ 變緊音（학교→학꾜、밟고→밥꼬）
    if ((a.jong === 'ㄱ' || a.jong === 'ㄷ' || a.jong === 'ㅂ') && TENSE[b.cho]) {
      b.cho = TENSE[b.cho];
      record([i, i + 1], before, '緊音化', '받침 ㄱ/ㄷ/ㅂ 後面的子音要用力唸（變緊音）');
    }
  }

  return { pron: syl.map(sylStr).join(''), changes };
}

/* 整句處理：按空白切成單字，韓文字處理、英文/標點原樣保留
   回傳 { pron, changes, tokens:[{ w:原字, p:唸法, isKo }] } */
function applyPronLine(text) {
  const changes = [];
  const tokens = text.split(' ').filter(t => t.length).map(tok => {
    // 容許前後帶標點（例：가!）— 中間抓出純韓文core來處理
    const m = tok.match(/^([^가-힣]*)([가-힣]+)([^가-힣]*)$/);
    if (!m) return { w: tok, p: tok, isKo: false };
    const r = applyPronWord(m[2]);
    changes.push(...r.changes);
    return { w: tok, p: m[1] + r.pron + m[3], ko: m[2], koPron: r.pron, isKo: true };
  });
  return { pron: tokens.map(t => t.p).join(' '), changes, tokens };
}

/* ---------------------------------------------------------------------
   1.8 羅馬拼音 + 注音引擎（都吃「實際唸法」的字，照拆照轉）
   --------------------------------------------------------------------- */
const ROM_CHO  = ['g','kk','n','d','tt','r','m','b','pp','s','ss','','j','jj','ch','k','t','p','h'];
const ROM_JUNG = ['a','ae','ya','yae','eo','e','yeo','ye','o','wa','wae','oe','yo','u','wo','we','wi','yu','eu','ui','i'];
const ROM_JONG = { '':'', 'ㄱ':'k','ㄴ':'n','ㄷ':'t','ㄹ':'l','ㅁ':'m','ㅂ':'p','ㅇ':'ng' };

// 一個單字 → 羅馬拼音（音節用 - 接）
function romWord(word) {
  return [...word].map(ch => {
    const d = decompose(ch);
    if (!d) return ch;
    return ROM_CHO[CHO.indexOf(d.cho)] + ROM_JUNG[JUNG.indexOf(d.jung)] + (ROM_JONG[d.jong] ?? '');
  }).join('-');
}

// 注音對照（台灣人最快上手的近似音）
const ZHU_CHO = { 'ㄱ':'ㄍ','ㄲ':'ㄍ','ㄴ':'ㄋ','ㄷ':'ㄉ','ㄸ':'ㄉ','ㄹ':'ㄌ','ㅁ':'ㄇ','ㅂ':'ㄅ','ㅃ':'ㄅ','ㅅ':'ㄙ','ㅆ':'ㄙ','ㅇ':'','ㅈ':'ㄐ','ㅉ':'ㄐ','ㅊ':'ㄘ','ㅋ':'ㄎ','ㅌ':'ㄊ','ㅍ':'ㄆ','ㅎ':'ㄏ' };
const ZHU_JUNG = { 'ㅏ':'ㄚ','ㅐ':'ㄝ','ㅑ':'ㄧㄚ','ㅒ':'ㄧㄝ','ㅓ':'ㄜ','ㅔ':'ㄝ','ㅕ':'ㄧㄜ','ㅖ':'ㄧㄝ','ㅗ':'ㄛ','ㅘ':'ㄨㄚ','ㅙ':'ㄨㄝ','ㅚ':'ㄨㄝ','ㅛ':'ㄧㄛ','ㅜ':'ㄨ','ㅝ':'ㄨㄛ','ㅞ':'ㄨㄝ','ㅟ':'ㄨㄧ','ㅠ':'ㄧㄨ','ㅡ':'ㄜ','ㅢ':'ㄜㄧ','ㅣ':'ㄧ' };
const ZHU_JONG = { '':'', 'ㄱ':'(ㄍ)','ㄴ':'ㄣ','ㄷ':'(ㄊ)','ㄹ':'(ㄌ)','ㅁ':'(ㄇ)','ㅂ':'(ㄅ)','ㅇ':'ㄥ' };
const TENSE_SET = new Set(['ㄲ','ㄸ','ㅃ','ㅆ','ㅉ']);
const I_VOWELS  = new Set(['ㅣ','ㅑ','ㅒ','ㅕ','ㅖ','ㅛ','ㅠ']);

// 一個音節 → 注音（緊音加 •；ㅅ/ㅊ 在 ㅣ 系前改 ㄒ/ㄑ；收尾 ㄣ/ㄥ 自然併進韻母）
function zhuSyl(d) {
  let cho = ZHU_CHO[d.cho];
  if (I_VOWELS.has(d.jung)) {
    if (d.cho === 'ㅅ' || d.cho === 'ㅆ') cho = 'ㄒ';
    if (d.cho === 'ㅊ') cho = 'ㄑ';
  }
  let fin = ZHU_JUNG[d.jung] + (ZHU_JONG[d.jong] ?? '');
  // 韻母合併：唸起來更像台灣注音的拼法（간→ㄍㄢ、강→ㄍㄤ、건→ㄍㄣ、공→ㄍㄨㄥ）
  fin = fin.replace('ㄚㄣ','ㄢ').replace('ㄚㄥ','ㄤ').replace('ㄜㄣ','ㄣ').replace('ㄜㄥ','ㄥ').replace('ㄛㄥ','ㄨㄥ');
  return (TENSE_SET.has(d.cho) ? '•' : '') + cho + fin;
}

// 一個單字 → 注音（音節用 · 接）
function zhuWord(word) {
  return [...word].map(ch => {
    const d = decompose(ch);
    return d ? zhuSyl(d) : ch;
  }).join('·');
}

/* ---------------------------------------------------------------------
   2. 語音引擎（Web Speech API）
   --------------------------------------------------------------------- */
let koVoice = null;       // 目前選用的韓文語音
let koVoices = [];        // 裝置上所有韓文語音
let currentRate = 0.85;   // 語速（初學者調慢）
let seqToken = 0;         // 逐字播放的「世代」編號：發新動作就 +1，舊隊伍自動停

function loadVoices() {
  const voices = window.speechSynthesis ? speechSynthesis.getVoices() : [];
  koVoices = voices.filter(v => v.lang && v.lang.toLowerCase().startsWith('ko'));
  // 自動挑最自然的：上次選過的 > Google > Natural/Siri/Yuna > 第一個
  const saved = localStorage.getItem('koVoiceName');
  koVoice = koVoices.find(v => v.name === saved)
         || koVoices.find(v => /google/i.test(v.name))
         || koVoices.find(v => /natural|siri|yuna|sora/i.test(v.name))
         || koVoices[0] || null;
  populateVoiceSelect();
  updateVoiceStatus();
}

// 把裝置上所有韓文語音填進下拉選單，讓使用者自己挑最順耳的
function populateVoiceSelect() {
  const sel = document.getElementById('voiceSelect');
  if (!sel) return;
  if (!koVoices.length) { sel.style.display = 'none'; return; }  // 沒語音就藏起來
  sel.style.display = '';
  sel.innerHTML = '';
  koVoices.forEach(v => {
    const opt = document.createElement('option');
    opt.value = v.name;
    opt.textContent = (/google/i.test(v.name) ? '⭐ ' : '') + v.name;  // Google 標星號
    if (koVoice && v.name === koVoice.name) opt.selected = true;
    sel.appendChild(opt);
  });
}

function updateVoiceStatus() {
  const el = document.getElementById('voiceStatus');
  if (!el) return;
  if (!('speechSynthesis' in window)) {
    el.className = 'voice-status warn';
    el.textContent = '⚠️ 此瀏覽器不支援語音，建議用 Chrome / Edge / Safari';
  } else if (koVoice) {
    el.className = 'voice-status ok';
    el.textContent = '✅ 韓文語音就緒：' + koVoice.name;
  } else {
    el.className = 'voice-status warn';
    el.textContent = '⚠️ 沒找到韓文語音 → 連網路用 Chrome/Edge/Safari 最穩，或裝系統韓文語音包';
  }
}

// 停掉所有發音（含逐字隊伍）
function stopSpeak() {
  seqToken++;
  if ('speechSynthesis' in window) speechSynthesis.cancel();
  document.querySelectorAll('.w-chip.speaking').forEach(e => e.classList.remove('speaking'));
}

// 唸出韓文文字（rate 可另外指定，例如慢速跟讀）
function speak(text, rate) {
  if (!('speechSynthesis' in window)) return;
  stopSpeak();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'ko-KR';
  if (koVoice) u.voice = koVoice;
  u.rate = rate || currentRate;
  speechSynthesis.speak(u);
}

/* 逐字接力播放：一個字一個字唸，唸到哪個字就高亮哪個
   items = [{ text:'要唸的字', el:對應的 DOM（可空）}] */
function speakSeq(items, rate, gapMs) {
  if (!('speechSynthesis' in window)) return;
  stopSpeak();
  const myToken = ++seqToken;   // 記住自己的世代；中途有新動作就停
  let i = 0;
  const next = () => {
    if (myToken !== seqToken || i >= items.length) {
      document.querySelectorAll('.w-chip.speaking').forEach(e => e.classList.remove('speaking'));
      return;
    }
    const it = items[i++];
    document.querySelectorAll('.w-chip.speaking').forEach(e => e.classList.remove('speaking'));
    if (it.el) it.el.classList.add('speaking');
    const u = new SpeechSynthesisUtterance(it.text);
    u.lang = 'ko-KR';
    if (koVoice) u.voice = koVoice;
    u.rate = rate;
    u.onend = () => setTimeout(next, gapMs);
    u.onerror = () => setTimeout(next, gapMs);
    speechSynthesis.speak(u);
  };
  next();
}

/* ---------------------------------------------------------------------
   3. 建立各分頁內容
   --------------------------------------------------------------------- */

// 小工具：建一張會發音的字母卡
function makeCard(item) {
  const card = document.createElement('div');
  card.className = 'card';
  let inner = `<div class="han">${item.h}</div><div class="rom">${item.r}</div>`;
  if (item.hint) inner += `<div class="hint">${item.hint}</div>`;
  card.innerHTML = inner;
  card.onclick = () => speak(item.s);
  return card;
}

// 小工具：建一個「分組標題 + 卡片格線」
function makeGroupBlock(title, items) {
  const wrap = document.createElement('div');
  const h = document.createElement('h3');
  h.className = 'group-title';
  h.textContent = title;
  wrap.appendChild(h);
  const grid = document.createElement('div');
  grid.className = 'grid';
  items.forEach(it => grid.appendChild(makeCard(it)));
  wrap.appendChild(grid);
  return wrap;
}

// 分頁①：母音
function renderVowels() {
  const root = document.getElementById('tab-vowels');
  vowelGroups.forEach(g => root.appendChild(makeGroupBlock(g.title, g.items)));
}

// 分頁②：子音
function renderConsonants() {
  const root = document.getElementById('tab-consonants');
  consonantGroups.forEach(g => root.appendChild(makeGroupBlock(g.title, g.items)));
}

// 分頁③：받침（收尾音）
function renderBatchim() {
  const root = document.getElementById('tab-batchim');
  const intro = document.createElement('p');
  intro.className = 'tab-intro';
  intro.innerHTML = '收尾子音再多種，實際只發這 <b>7 個音</b>。點卡片聽「代表音」，點例字聽真實單字 👇';
  root.appendChild(intro);

  const grid = document.createElement('div');
  grid.className = 'grid batchim-grid';
  batchim.forEach(b => {
    const card = document.createElement('div');
    card.className = 'card batchim-card';
    card.innerHTML = `<div class="han">${b.h}</div>
                      <div class="rom">收尾音 ${b.r}｜注音 ${b.zhu}</div>
                      <div class="ex">例：<b>${b.ex}</b> ${b.exr}（${b.exm}）</div>`;
    // 點上半部唸代表音，點例字唸例字
    card.onclick = (e) => speak(b.s);
    const exEl = card.querySelector('.ex');
    exEl.onclick = (e) => { e.stopPropagation(); speak(b.ex); };
    grid.appendChild(card);
  });
  root.appendChild(grid);
}

// 分頁④：拼字實驗室
let labCho = 'ㄱ', labJung = 'ㅏ', labJong = '';
function renderLab() {
  const root = document.getElementById('tab-lab');

  const intro = document.createElement('p');
  intro.className = 'tab-intro';
  intro.innerHTML = '選一個<b>子音</b>＋一個<b>母音</b>（收尾音可選），即時拼出韓文字並唸出來。這就是 한글 的組字魔法 ✨';
  root.appendChild(intro);

  // 大顯示區
  const display = document.createElement('div');
  display.className = 'lab-display';
  display.id = 'labDisplay';
  root.appendChild(display);

  // 三排選擇器：子音 / 母音 / 收尾音
  const makeRow = (label, list, kind) => {
    const row = document.createElement('div');
    row.className = 'lab-row';
    const lab = document.createElement('div');
    lab.className = 'lab-label';
    lab.textContent = label;
    row.appendChild(lab);
    const btns = document.createElement('div');
    btns.className = 'lab-btns';
    list.forEach(ch => {
      const b = document.createElement('button');
      b.className = 'lab-btn';
      b.textContent = ch === '' ? '∅' : ch;   // 「無收尾」用 ∅ 顯示
      b.dataset.kind = kind;
      b.dataset.val = ch;
      b.onclick = () => {
        if (kind === 'cho')  labCho  = ch;
        if (kind === 'jung') labJung = ch;
        if (kind === 'jong') labJong = ch;
        updateLab(true);
      };
      btns.appendChild(b);
    });
    row.appendChild(btns);
    return row;
  };

  // 子音只放 19 初聲；母音放 21；收尾音放「無 + 7 代表」
  root.appendChild(makeRow('子音', CHO, 'cho'));
  root.appendChild(makeRow('母音', JUNG, 'jung'));
  root.appendChild(makeRow('收尾', ['', 'ㄱ','ㄴ','ㄷ','ㄹ','ㅁ','ㅂ','ㅇ'], 'jong'));

  // 範例字：點一下自動帶入拼法 + 高亮對應字母
  const exRow = document.createElement('div');
  exRow.className = 'lab-row';
  exRow.innerHTML = '<div class="lab-label">範例字（點看怎麼拼出來）</div>';
  const exBtns = document.createElement('div');
  exBtns.className = 'lab-btns';
  labExamples.forEach(ex => {
    const ch = composeHangul(ex.cho, ex.jung, ex.jong);
    const b = document.createElement('button');
    b.className = 'lab-btn lab-example';
    b.innerHTML = `${ch}<span class="ex-mean">${ex.mean}</span>`;
    b.onclick = () => { labCho = ex.cho; labJung = ex.jung; labJong = ex.jong; updateLab(true); };
    exBtns.appendChild(b);
  });
  exRow.appendChild(exBtns);
  root.appendChild(exRow);

  updateLab(false);   // 第一次只顯示不發音（瀏覽器也會擋自動播放）
}

// 更新拼字實驗室的顯示 + 高亮目前選的字母（speakIt=true 才發音）
function updateLab(speakIt) {
  const ch = composeHangul(labCho, labJung, labJong);
  const display = document.getElementById('labDisplay');
  if (display) {
    display.innerHTML = `<div class="lab-char">${ch}</div>
      <div class="lab-formula">${labCho} ＋ ${labJung}${labJong ? ' ＋ ' + labJong : ''}</div>
      <button class="big-btn" id="labSpeak">🔊 唸這個字</button>`;
    document.getElementById('labSpeak').onclick = () => speak(ch);
  }
  // 高亮目前選中的按鈕
  document.querySelectorAll('.lab-btn').forEach(b => {
    const k = b.dataset.kind, v = b.dataset.val;
    const on = (k === 'cho' && v === labCho) || (k === 'jung' && v === labJung) || (k === 'jong' && v === labJong);
    b.classList.toggle('active', on);
  });
  if (speakIt) speak(ch);
}

// 分頁⑤：測驗（聽音猜字母）
let quizPool = [];        // 目前題庫
let quizAnswer = null;
let quizCorrect = 0, quizTotal = 0;
let quizLocked = false;   // 作答後鎖住，避免補點正解被重複計分
let quizTimer = null;     // 待跳下一題的 timer（切頁/換範圍要清，否則會在別處突然出題發聲）

/* 發音相同的字母組 — 同題出現用聽的不可能分辨：
   ㅐ/ㅔ、ㅒ/ㅖ、ㅙ/ㅚ/ㅞ 現代韓語已合流（app 的 hint 也標同音）；
   母音 ㅏ 與子音 ㅇ 的示範音節都是「아」，TTS 唸出來 100% 一樣 */
const HOMOPHONES = [['ㅐ','ㅔ'], ['ㅒ','ㅖ'], ['ㅙ','ㅚ','ㅞ'], ['ㅏ','ㅇ']];

function sameSound(a, b) {
  if (a.s === b.s) return true;   // 示範音節相同 → 必同音
  return HOMOPHONES.some(g => g.includes(a.h) && g.includes(b.h));
}

function flatVowels() { return vowelGroups.flatMap(g => g.items); }
function flatConsonants() { return consonantGroups.flatMap(g => g.items); }

function setQuizScope(scope) {
  if (scope === 'vowel') quizPool = flatVowels();
  else if (scope === 'consonant') quizPool = flatConsonants();
  else quizPool = flatVowels().concat(flatConsonants());
  document.querySelectorAll('.scope-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.scope === scope));
  newQuestion();
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function newQuestion() {
  clearTimeout(quizTimer);   // 清掉殘留 timer（連點/切範圍時不會被舊 timer 再洗一次題）
  quizLocked = false;
  const fb = document.getElementById('quizFeedback');
  if (fb) fb.textContent = '';
  const pool = shuffle(quizPool);
  quizAnswer = pool[0];
  // 干擾項排除「跟正解同音」與「彼此同音」的字母，保證 4 個選項用聽的分得出來
  const distractors = [];
  for (const item of pool.slice(1)) {
    if (distractors.length === 3) break;
    if (sameSound(item, quizAnswer)) continue;
    if (distractors.some(d => sameSound(d, item))) continue;
    distractors.push(item);
  }
  const options = shuffle([quizAnswer, ...distractors]);
  const optWrap = document.getElementById('quizOptions');
  optWrap.innerHTML = '';
  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'quiz-opt';
    btn.textContent = opt.h;
    btn.onclick = () => checkAnswer(opt, btn);
    optWrap.appendChild(btn);
  });
  speak(quizAnswer.s);
}

function checkAnswer(opt, btn) {
  if (quizLocked) return;   // 這題已作答 — 補點任何選項都不再計分
  quizLocked = true;
  document.querySelectorAll('.quiz-opt').forEach(b => { b.disabled = true; });
  quizTotal++;
  const fb = document.getElementById('quizFeedback');
  if (opt.h === quizAnswer.h) {
    quizCorrect++;
    btn.classList.add('correct');
    fb.textContent = '🎉 答對！「' + quizAnswer.h + '」= ' + quizAnswer.r;
    fb.style.color = '#2a7d4f';
  } else {
    btn.classList.add('wrong');
    fb.textContent = '差一點～正解是「' + quizAnswer.h + '」= ' + quizAnswer.r;
    fb.style.color = '#b52a2a';
    [...document.getElementById('quizOptions').children].forEach(b => {
      if (b.textContent === quizAnswer.h) b.classList.add('correct');
    });
  }
  document.getElementById('quizScore').textContent = `答對 ${quizCorrect} ／ 共 ${quizTotal} 題`;
  quizTimer = setTimeout(newQuestion, 1200);
}

// 分頁⑥：女團 + 常用語
function renderIdols() {
  const root = document.getElementById('tab-idols');

  const h1 = document.createElement('h3');
  h1.className = 'group-title';
  h1.textContent = '女團團名（點一下唸出來）';
  root.appendChild(h1);
  const grid = document.createElement('div');
  grid.className = 'grid group-grid';
  groups.forEach(g => {
    const card = document.createElement('div');
    card.className = 'card group-card';
    card.innerHTML = `<div class="name">${g.name}</div>
                      <div class="han">${g.han}</div>
                      <div class="rom">${g.rom}</div>`;
    card.onclick = () => speak(g.han);
    grid.appendChild(card);
  });
  root.appendChild(grid);

  const h2 = document.createElement('h3');
  h2.className = 'group-title';
  h2.textContent = '追星常用語';
  root.appendChild(h2);
  const grid2 = document.createElement('div');
  grid2.className = 'grid phrase-grid';
  phrases.forEach(p => {
    const card = document.createElement('div');
    card.className = 'card phrase-card';
    card.innerHTML = `<div class="han">${p.han}</div>
                      <div class="rom">${p.rom}</div>
                      <div class="mean">${p.mean}</div>`;
    card.onclick = () => speak(p.han);
    grid2.appendChild(card);
  });
  root.appendChild(grid2);
}

/* ---------------------------------------------------------------------
   3.5 分頁⑦：歌詞 v2（逐字跟讀 + 變音解說 + 貼歌詞拆解）
   --------------------------------------------------------------------- */
let lyricsMode = 'songs';   // 'songs' = 內建歌曲｜'paste' = 自己貼歌詞
let currentSongIdx = 0;

// 小工具：建元素
function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
}

// 分析一句歌詞：有人工 pron 就用人工的，否則引擎自動算
function analyzeLine(line) {
  if (line.pron) {
    const wTok = line.han.split(' ').filter(t => t.length);
    const pTok = line.pron.split(' ').filter(t => t.length);
    const tokens = wTok.map((w, i) => {
      const p = pTok[i] || w;
      return { w, p, isKo: /^[가-힣]+$/.test(p), koPron: p };
    });
    return { pron: line.pron, changes: line.changes || [], tokens };
  }
  return applyPronLine(line.han);
}

// 建一張「歌詞句卡」：逐字 chips + 實際唸法 + 注音 + 羅馬 + 意思 + 播放按鈕
function makeLyricCard(line, showMean) {
  const a = analyzeLine(line);
  const card = el('div', 'card lyric-card');

  // ① 歌詞原文 — 每個字是一顆可點的 chip（點了用慢速唸那個字）
  const wordsRow = el('div', 'lyric-words');
  const chipEls = [];
  a.tokens.forEach(t => {
    const s = el('span', 'w-chip' + (t.isKo ? '' : ' w-en'), t.w);
    s.onclick = () => speak(t.koPron || t.p, Math.max(0.5, currentRate * 0.8));
    wordsRow.appendChild(s);
    chipEls.push(s);
  });
  card.appendChild(wordsRow);

  // ② 實際唸法（只有跟原文不同才顯示；變音的字加粗）
  if (a.pron !== line.han) {
    const pr = el('div', 'pron-row');
    pr.innerHTML = '🗣 實際唸：' + a.tokens.map(t => t.p !== t.w ? `<b>${t.p}</b>` : t.p).join(' ');
    card.appendChild(pr);
  }

  // ③ 注音（•=緊音要用力；(ㄍ)=收尾擋住不爆開）＋ ④ 羅馬拼音
  const zhu = a.tokens.map(t => t.isKo ? zhuWord(t.koPron || t.p) : t.w).join('　');
  card.appendChild(el('div', 'zhu-row', '🇹🇼 ' + zhu));
  const rom = a.tokens.map(t => t.isKo ? romWord(t.koPron || t.p) : t.w).join('  ');
  card.appendChild(el('div', 'rom', rom));

  // ⑤ 中文意思
  if (showMean && line.mean) card.appendChild(el('div', 'mean', '💬 ' + line.mean));

  // ⑥ 播放按鈕列：整句 / 慢速 / 逐字跟讀 /（有變音才出現）變音說明
  const btns = el('div', 'line-btns');
  const mkBtn = (label, fn, cls) => {
    const b = el('button', 'mini-btn' + (cls ? ' ' + cls : ''), label);
    b.onclick = fn;
    btns.appendChild(b);
    return b;
  };
  mkBtn('🔊 整句', () => speak(line.han));                 // 整句用原文：TTS 自己會做自然變音
  mkBtn('🐢 慢速', () => speak(a.pron, 0.6));              // 慢速用「實際唸法」，看字對音
  mkBtn('🎯 逐字跟讀', () => speakSeq(
    a.tokens.map((t, i) => ({ text: t.koPron || t.p, el: chipEls[i] })), 0.65, 380));

  if (a.changes.length) {
    const panel = el('div', 'chg-panel');
    a.changes.forEach(c => {
      const item = el('div', 'chg-item');
      item.innerHTML = `<b>${c.from}</b> → <b>${c.to}</b>　<span class="chg-rule">${c.rule}</span><br><span class="chg-desc">${c.desc}</span>`;
      panel.appendChild(item);
    });
    panel.style.display = 'none';
    const tg = mkBtn(`⚡ 為什麼變音 ×${a.changes.length}`, () => {
      const open = panel.style.display === 'none';
      panel.style.display = open ? '' : 'none';
      tg.classList.toggle('on', open);
    }, 'chg-btn');
    card.appendChild(btns);
    card.appendChild(panel);
  } else {
    card.appendChild(btns);
  }
  return card;
}

// 歌詞分頁主渲染（模式切換用重畫的方式，狀態存在 lyricsMode）
function renderLyrics() {
  const root = document.getElementById('tab-lyrics');
  root.innerHTML = '';
  stopSpeak();

  // 模式切換：學內建歌曲 ↔ 自己貼歌詞
  const modeRow = el('div', 'mode-chips');
  [['songs', '🎵 學歌曲'], ['paste', '✍️ 貼歌詞拆解']].forEach(([m, label]) => {
    const b = el('button', 'mode-chip' + (lyricsMode === m ? ' active' : ''), label);
    b.onclick = () => { lyricsMode = m; renderLyrics(); };
    modeRow.appendChild(b);
  });
  root.appendChild(modeRow);

  if (lyricsMode === 'songs') renderSongMode(root);
  else renderPasteMode(root);
}

// 內建歌曲模式：選歌 → 一句一卡
function renderSongMode(root) {
  const intro = el('p', 'tab-intro');
  intro.innerHTML = '韓文歌「寫的字」和「唱的音」常不一樣，這就是聽不清楚的原因！'
    + '<br>🟡 點<b>單字</b>＝慢速唸那個字｜🎯 <b>逐字跟讀</b>＝一個字一個字帶你唸｜⚡ 看<b>為什麼變音</b>';
  root.appendChild(intro);

  // 選歌 chips
  const chips = el('div', 'song-chips');
  songs.forEach((s, i) => {
    const b = el('button', 'song-chip' + (i === currentSongIdx ? ' active' : ''));
    b.innerHTML = `<span class="sc-group">${s.group}</span>${s.song}`;
    b.onclick = () => { currentSongIdx = i; renderLyrics(); };
    chips.appendChild(b);
  });
  root.appendChild(chips);

  const song = songs[currentSongIdx];
  const h = el('h3', 'group-title', `${song.group} — ${song.song}（${song.year}）副歌精華`);
  root.appendChild(h);
  song.lines.forEach(ln => root.appendChild(makeLyricCard(ln, true)));
}

// 貼歌詞模式：任何歌詞貼進來，自動標 實際唸法/注音/羅馬拼音
function renderPasteMode(root) {
  const intro = el('p', 'tab-intro');
  intro.innerHTML = '從任何地方複製韓文歌詞貼進來（一行一句），妮妮自動標'
    + '<b>實際唸法、注音、羅馬拼音</b>，一樣可以逐字跟讀 ✨<br>'
    + '<span class="paste-note">⚠️ 引擎涵蓋常規變音（連音/鼻音化/緊音化/激音化/口蓋音化）；'
    + '少數漢字語特殊緊音（例 사건→사껀）抓不到，唸起來怪怪的就問妮妮 🐱 中文意思也可以問我！</span>';
  root.appendChild(intro);

  const area = el('textarea', 'paste-area');
  area.id = 'pasteArea';
  area.placeholder = '예) 수수수 Supernova\n사건은 다가와 Ah Oh Ay\n（貼韓文歌詞，每行一句）';
  area.value = localStorage.getItem('pastedLyrics') || '';
  root.appendChild(area);

  const btn = el('button', 'big-btn', '✨ 拆解發音');
  btn.style.margin = '10px auto';
  btn.style.display = 'block';
  root.appendChild(btn);

  const result = el('div', '');
  result.id = 'pasteResult';
  root.appendChild(result);

  const doParse = () => {
    localStorage.setItem('pastedLyrics', area.value);   // 記住，下次打開還在
    result.innerHTML = '';
    const lines = area.value.split('\n').map(s => s.trim()).filter(Boolean).slice(0, 50);
    if (!lines.length) { result.appendChild(el('p', 'tab-intro', '先貼一點歌詞再按拆解唷 🐱')); return; }
    lines.forEach(l => result.appendChild(makeLyricCard({ han: l }, false)));
  };
  btn.onclick = doParse;
  if (area.value.trim()) doParse();   // 上次貼過的自動拆好
}

/* ---------------------------------------------------------------------
   4. 分頁切換
   --------------------------------------------------------------------- */
function setupTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach(tab => {
    tab.onclick = () => {
      // 切換按鈕 active
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      // 切換內容顯示
      const target = tab.dataset.target;
      document.querySelectorAll('.tab-content').forEach(c => {
        c.classList.toggle('active', c.id === target);
      });
      // 切走時停掉正在唸的音（含逐字隊伍）+ 清掉測驗待跳題 timer（避免在別的分頁突然出題發聲）
      stopSpeak();
      clearTimeout(quizTimer);
      // 切到測驗分頁：還沒出過題 → 出第一題；上一題已作答（timer 被切頁清掉）→ 直接出新題
      if (target === 'tab-quiz' && !quizAnswer) setQuizScope('vowel');
      else if (target === 'tab-quiz' && quizLocked) newQuestion();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
  });
}

/* ---------------------------------------------------------------------
   5. 啟動
   --------------------------------------------------------------------- */
function init() {
  // 語音
  if ('speechSynthesis' in window) {
    speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();
  } else {
    updateVoiceStatus();
  }

  // 各分頁
  renderVowels();
  renderConsonants();
  renderBatchim();
  renderLab();
  renderIdols();
  renderLyrics();
  setupTabs();

  // 測驗範圍按鈕
  document.querySelectorAll('.scope-btn').forEach(b => {
    b.onclick = () => setQuizScope(b.dataset.scope);
  });
  document.getElementById('quizReplay').onclick = () => {
    if (!quizAnswer) setQuizScope('vowel');
    else speak(quizAnswer.s);
  };

  // 語音選單：切換 voice + 記住選擇 + 立刻試聽
  const voiceSel = document.getElementById('voiceSelect');
  if (voiceSel) {
    voiceSel.onchange = () => {
      koVoice = koVoices.find(v => v.name === voiceSel.value) || koVoice;
      localStorage.setItem('koVoiceName', voiceSel.value);  // 記住，下次自動用
      updateVoiceStatus();
      speak('안녕하세요');   // 換 voice 馬上聽一句
    };
  }

  // 語速滑桿
  const rate = document.getElementById('rate');
  const rateVal = document.getElementById('rateVal');
  rate.oninput = () => {
    currentRate = parseFloat(rate.value);
    rateVal.textContent = currentRate.toFixed(2) + 'x';
  };
}

document.addEventListener('DOMContentLoaded', init);

/* ---------------------------------------------------------------------
   6. Service Worker + App 內更新鍵 🔄
   PWA 的更新很容易卡在舊快取，所以這裡做兩件事：
   ① 自動偵測新版 → 跳「有新版本」橫幅，按一下就更新（不用關 App 重開）
   ② 標題列常駐「🔄 檢查更新」鍵 → 隨時手動戳一下看有沒有新版
   --------------------------------------------------------------------- */
let swReg = null;          // 記住註冊物件，更新鍵要用
let reloadingForUpdate = false;

// 顯示「有新版本」橫幅（按鈕一按 → 叫新版 SW 接管 → 自動重載）
function showUpdateBar() {
  let bar = document.getElementById('updateBar');
  if (!bar) {
    bar = document.createElement('div');
    bar.id = 'updateBar';
    bar.className = 'update-bar';
    bar.innerHTML = '<span>🎉 有新版本！</span><button id="updateNow">立即更新</button>';
    document.body.appendChild(bar);
  }
  bar.classList.add('show');
  document.getElementById('updateNow').onclick = () => {
    document.getElementById('updateNow').textContent = '更新中…';
    // 叫等待中的新版 SW 立刻接管；沒有就直接重載
    if (swReg && swReg.waiting) swReg.waiting.postMessage({ type: 'SKIP_WAITING' });
    else window.location.reload();
  };
}

// 設定更新偵測（綁在註冊物件上）
function setupUpdateDetection(reg) {
  swReg = reg;
  // 載入時就已經有等待中的新版（上次偵測到但沒更新）→ 直接顯示
  if (reg.waiting && navigator.serviceWorker.controller) showUpdateBar();
  // 偵測到新版正在安裝 → 裝好且有舊版在跑 = 真的有更新
  reg.addEventListener('updatefound', () => {
    const nw = reg.installing;
    if (!nw) return;
    nw.addEventListener('statechange', () => {
      if (nw.state === 'installed' && navigator.serviceWorker.controller) showUpdateBar();
    });
  });
}

// 手動「檢查更新」鍵：戳一下主動問伺服器有沒有新版
async function checkForUpdate() {
  const btn = document.getElementById('checkUpdate');
  if (!swReg) {                      // 還沒註冊好（或瀏覽器不支援）→ 直接重載保底
    window.location.reload();
    return;
  }
  if (btn) btn.textContent = '🔄 檢查中…';
  try {
    await swReg.update();            // 主動抓 sw.js 看版本有沒有變
    setTimeout(() => {
      if (swReg.waiting || swReg.installing) {
        showUpdateBar();             // 有新版 → 橫幅會跳出來
        if (btn) btn.textContent = '🔄 檢查更新';
      } else if (btn) {
        btn.textContent = '✅ 已是最新';
        setTimeout(() => { btn.textContent = '🔄 檢查更新'; }, 2000);
      }
    }, 1200);
  } catch (err) {
    console.log('檢查更新失敗', err);
    if (btn) btn.textContent = '🔄 檢查更新';
  }
}

// 新版 SW 接管的那一刻 → 自動重載一次，畫面就變新版（只重載一次，防迴圈）
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (reloadingForUpdate) return;
    reloadingForUpdate = true;
    window.location.reload();
  });

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js')
      .then(reg => {
        setupUpdateDetection(reg);
        // 回到 App（從背景切回前景）時自動檢查一次新版
        document.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'visible') reg.update().catch(() => {});
        });
      })
      .catch(err => console.log('SW 註冊失敗', err));

    // 標題列的「🔄 檢查更新」鍵
    const btn = document.getElementById('checkUpdate');
    if (btn) btn.onclick = checkForUpdate;
  });
}
