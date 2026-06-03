/* =====================================================================
   한글 練習 PWA — 主程式
   - 用瀏覽器內建 Web Speech API 唸韓文（不需後端、不需金鑰）
   - 資料驅動：母音/子音/받침/女團 都放在陣列，方便日後擴充
   ===================================================================== */

/* ---------------------------------------------------------------------
   1. 資料區
   - h  = 字母本身
   - r  = 羅馬拼音
   - s  = 配 ㅇ 的完整音節（唸這個比唸單獨字母準）
   - hint = 中文發音提示
   --------------------------------------------------------------------- */

// 母音（21 個，分 4 組教學）
const vowelGroups = [
  { title: '基本母音', items: [
    { h:'ㅏ', r:'a',  s:'아', hint:'啊' },
    { h:'ㅓ', r:'eo', s:'어', hint:'呃(嘴張大)' },
    { h:'ㅗ', r:'o',  s:'오', hint:'歐(嘴圓)' },
    { h:'ㅜ', r:'u',  s:'우', hint:'烏' },
    { h:'ㅡ', r:'eu', s:'으', hint:'扁嘴呃' },
    { h:'ㅣ', r:'i',  s:'이', hint:'衣' },
  ]},
  { title: 'Y 母音（前面多一個 y 音）', items: [
    { h:'ㅑ', r:'ya',  s:'야', hint:'呀' },
    { h:'ㅕ', r:'yeo', s:'여', hint:'唷(yeo)' },
    { h:'ㅛ', r:'yo',  s:'요', hint:'喲' },
    { h:'ㅠ', r:'yu',  s:'유', hint:'呦(yu)' },
  ]},
  { title: 'ㅐ ㅔ 系（都唸「ㄝ」）', items: [
    { h:'ㅐ', r:'ae', s:'애', hint:'ㄝ' },
    { h:'ㅔ', r:'e',  s:'에', hint:'ㄝ' },
    { h:'ㅒ', r:'yae', s:'얘', hint:'ㄧㄝ' },
    { h:'ㅖ', r:'ye',  s:'예', hint:'ㄧㄝ' },
  ]},
  { title: 'W 複合母音（前面多一個 w 音）', items: [
    { h:'ㅘ', r:'wa',  s:'와', hint:'哇' },
    { h:'ㅙ', r:'wae', s:'왜', hint:'歪' },
    { h:'ㅚ', r:'oe',  s:'외', hint:'威' },
    { h:'ㅝ', r:'wo',  s:'워', hint:'喔(wo)' },
    { h:'ㅞ', r:'we',  s:'웨', hint:'為' },
    { h:'ㅟ', r:'wi',  s:'위', hint:'威(wi)' },
    { h:'ㅢ', r:'ui',  s:'의', hint:'ㄜ衣' },
  ]},
];

// 子音（19 個，分 3 組）— 子音配 ㅏ 唸（가 나 다…）比較準
const consonantGroups = [
  { title: '平音（基本，輕鬆發）', items: [
    { h:'ㄱ', r:'g/k', s:'가', hint:'가 ga' },
    { h:'ㄴ', r:'n',   s:'나', hint:'나 na' },
    { h:'ㄷ', r:'d/t', s:'다', hint:'다 da' },
    { h:'ㄹ', r:'r/l', s:'라', hint:'라 ra' },
    { h:'ㅁ', r:'m',   s:'마', hint:'마 ma' },
    { h:'ㅂ', r:'b/p', s:'바', hint:'바 ba' },
    { h:'ㅅ', r:'s',   s:'사', hint:'사 sa' },
    { h:'ㅇ', r:'不發音/ng', s:'아', hint:'開頭不發音' },
    { h:'ㅈ', r:'j',   s:'자', hint:'자 ja' },
    { h:'ㅎ', r:'h',   s:'하', hint:'하 ha' },
  ]},
  { title: '送氣音（用力吐一口氣）', items: [
    { h:'ㅋ', r:'k',  s:'카', hint:'ㄱ 的吐氣版' },
    { h:'ㅌ', r:'t',  s:'타', hint:'ㄷ 的吐氣版' },
    { h:'ㅍ', r:'p',  s:'파', hint:'ㅂ 的吐氣版' },
    { h:'ㅊ', r:'ch', s:'차', hint:'ㅈ 的吐氣版' },
  ]},
  { title: '緊音（繃緊喉嚨、短促）', items: [
    { h:'ㄲ', r:'kk', s:'까', hint:'用力的 가' },
    { h:'ㄸ', r:'tt', s:'따', hint:'用力的 다' },
    { h:'ㅃ', r:'pp', s:'빠', hint:'用力的 바' },
    { h:'ㅆ', r:'ss', s:'싸', hint:'用力的 사' },
    { h:'ㅉ', r:'jj', s:'짜', hint:'用力的 자' },
  ]},
];

// 받침（收尾音）— 7 個代表音 + 真實例字
const batchim = [
  { h:'ㄱ', r:'k',  s:'악', ex:'책', exr:'chaek', exm:'書' },
  { h:'ㄴ', r:'n',  s:'안', ex:'손', exr:'son',   exm:'手' },
  { h:'ㄷ', r:'t',  s:'앋', ex:'옷', exr:'ot',    exm:'衣服' },
  { h:'ㄹ', r:'l',  s:'알', ex:'물', exr:'mul',   exm:'水' },
  { h:'ㅁ', r:'m',  s:'암', ex:'밤', exr:'bam',   exm:'夜晚' },
  { h:'ㅂ', r:'p',  s:'압', ex:'밥', exr:'bap',   exm:'飯' },
  { h:'ㅇ', r:'ng', s:'앙', ex:'강', exr:'gang',  exm:'江' },
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

// 韓文組字用的三組字母（標準 Unicode 順序，拼字實驗室會用到）
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

/* ---------------------------------------------------------------------
   2. 語音引擎（Web Speech API）
   --------------------------------------------------------------------- */
let koVoice = null;       // 抓到的韓文語音
let currentRate = 0.85;   // 語速（初學者調慢）

function loadVoices() {
  const voices = window.speechSynthesis ? speechSynthesis.getVoices() : [];
  koVoice = voices.find(v => v.lang === 'ko-KR')
         || voices.find(v => v.lang && v.lang.toLowerCase().startsWith('ko'))
         || null;
  updateVoiceStatus();
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

// 唸出韓文文字
function speak(text) {
  if (!('speechSynthesis' in window)) return;
  speechSynthesis.cancel();                 // 先停掉上一個
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'ko-KR';
  if (koVoice) u.voice = koVoice;
  u.rate = currentRate;
  speechSynthesis.speak(u);
}

/* ---------------------------------------------------------------------
   3. 建立各分頁內容
   --------------------------------------------------------------------- */

// 小工具：建一張會發音的字母卡
function makeCard(item, extraClass) {
  const card = document.createElement('div');
  card.className = 'card' + (extraClass ? ' ' + extraClass : '');
  let inner = `<div class="han">${item.h}</div><div class="rom">${item.r}</div>`;
  if (item.hint) inner += `<div class="hint">${item.hint}</div>`;
  card.innerHTML = inner;
  card.onclick = () => speak(item.s);
  return card;
}

// 小工具：建一個「分組標題 + 卡片格線」
function makeGroupBlock(title, items, extraCardClass) {
  const wrap = document.createElement('div');
  const h = document.createElement('h3');
  h.className = 'group-title';
  h.textContent = title;
  wrap.appendChild(h);
  const grid = document.createElement('div');
  grid.className = 'grid';
  items.forEach(it => grid.appendChild(makeCard(it, extraCardClass)));
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
                      <div class="rom">收尾音 ${b.r}</div>
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
        updateLab();
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

  updateLab();
}

// 更新拼字實驗室的顯示 + 高亮目前選的字母
function updateLab() {
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
  speak(ch); // 每次改變自動唸
}

// 分頁⑤：測驗（聽音猜字母）
let quizPool = [];        // 目前題庫
let quizAnswer = null;
let quizCorrect = 0, quizTotal = 0;

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
  const fb = document.getElementById('quizFeedback');
  if (fb) fb.textContent = '';
  const pool = shuffle(quizPool);
  quizAnswer = pool[0];
  const options = shuffle(pool.slice(0, 4));
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
  setTimeout(newQuestion, 1200);
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
      // 切走時停掉正在唸的音
      if ('speechSynthesis' in window) speechSynthesis.cancel();
      // 切到測驗分頁且還沒出題 → 自動出第一題
      if (target === 'tab-quiz' && !quizAnswer) setQuizScope('vowel');
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
  setupTabs();

  // 測驗範圍按鈕
  document.querySelectorAll('.scope-btn').forEach(b => {
    b.onclick = () => setQuizScope(b.dataset.scope);
  });
  document.getElementById('quizReplay').onclick = () => {
    if (!quizAnswer) setQuizScope('vowel');
    else speak(quizAnswer.s);
  };

  // 語速滑桿
  const rate = document.getElementById('rate');
  const rateVal = document.getElementById('rateVal');
  rate.oninput = () => {
    currentRate = parseFloat(rate.value);
    rateVal.textContent = currentRate.toFixed(2) + 'x';
  };
}

document.addEventListener('DOMContentLoaded', init);

// 註冊 Service Worker（PWA：可加到主畫面、離線可用）
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(err => console.log('SW 註冊失敗', err));
  });
}
