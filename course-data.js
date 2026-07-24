/* 한글 Studio v3 課程資料：內容與互動引擎分離，之後擴課不必改主程式。 */
window.HANGUL_COURSE_DATA = {
  version: '3.2.0-preview',
  lessons: [
    {
      id: 'blocks', number: '01', minutes: 4, title: '先看懂韓文字塊',
      kicker: '一格就是一個音節',
      goal: '知道韓文不是圖案，而是「初聲＋母音＋可選收尾」拼成的積木。',
      note: '母音形狀決定左右排或上下排；先會拆，之後遇到沒背過的字也能試著讀。',
      sounds: [
        { letter: '가', sample: '가', roman: 'ga', hint: 'ㄱ ＋ ㅏ' },
        { letter: '고', sample: '고', roman: 'go', hint: 'ㄱ ＋ ㅗ' },
        { letter: '한', sample: '한', roman: 'han', hint: 'ㅎ ＋ ㅏ ＋ ㄴ' },
        { letter: '글', sample: '글', roman: 'geul', hint: 'ㄱ ＋ ㅡ ＋ ㄹ' },
      ],
      compare: [['가', '고', '한', '글']],
    },
    {
      id: 'lax', number: '02', minutes: 6, title: '鬆音', kicker: '輕鬆開始，不要硬擠',
      goal: '先抓住 ㄱ、ㄷ、ㅂ、ㅅ、ㅈ 五個基本家族。',
      note: '鬆音在單字位置不同時會有些音感變化；現在先聽完整音節，不用硬套華語注音。',
      sounds: [
        { letter:'ㄱ', sample:'가', roman:'g/k', hint:'가' }, { letter:'ㄷ', sample:'다', roman:'d/t', hint:'다' },
        { letter:'ㅂ', sample:'바', roman:'b/p', hint:'바' }, { letter:'ㅅ', sample:'사', roman:'s', hint:'사' },
        { letter:'ㅈ', sample:'자', roman:'j', hint:'자' },
      ],
      compare: [['가','다','바','사','자']],
    },
    {
      id: 'tense', number: '03', minutes: 6, title: '緊音', kicker: '短、緊、乾淨',
      goal: '能把 ㄲ、ㄸ、ㅃ、ㅆ、ㅉ 和鬆音分開。',
      note: '緊音不是更大聲，也不是吐更多氣；感覺像先把聲門繃住，再短促放出。',
      sounds: [
        { letter:'ㄲ', sample:'까', roman:'kk', hint:'까' }, { letter:'ㄸ', sample:'따', roman:'tt', hint:'따' },
        { letter:'ㅃ', sample:'빠', roman:'pp', hint:'빠' }, { letter:'ㅆ', sample:'싸', roman:'ss', hint:'싸' },
        { letter:'ㅉ', sample:'짜', roman:'jj', hint:'짜' },
      ],
      compare: [['가','까'],['다','따'],['바','빠'],['사','싸'],['자','짜']],
    },
    {
      id: 'aspirated', number: '04', minutes: 6, title: '送氣音與 ㅎ', kicker: '手掌放嘴前，感受氣流',
      goal: '認出 ㅋ、ㅌ、ㅍ、ㅊ，並把 ㅎ 放進氣流家族理解。',
      note: 'ㅋ／ㅌ／ㅍ／ㅊ 是送氣音；ㅎ 本身是帶明顯氣流的音，也會影響相鄰子音。',
      sounds: [
        { letter:'ㅋ', sample:'카', roman:'k', hint:'카' }, { letter:'ㅌ', sample:'타', roman:'t', hint:'타' },
        { letter:'ㅍ', sample:'파', roman:'p', hint:'파' }, { letter:'ㅊ', sample:'차', roman:'ch', hint:'차' },
        { letter:'ㅎ', sample:'하', roman:'h', hint:'하' },
      ],
      compare: [['가','까','카'],['다','따','타'],['바','빠','파'],['자','짜','차']],
    },
    {
      id: 'resonants', number: '05', minutes: 7, title: '鼻音／流音', kicker: '讓聲音延續',
      goal: '學會 ㄴ、ㅁ、ㅇ、ㄹ，並知道 ㅇ、ㄹ 放前面和下面不一樣。',
      note: '初聲 ㅇ 不發音，只負責承接母音；ㄹ 在開頭是短促彈舌，放在收尾時接近 l。',
      sounds: [
        { letter:'ㄴ', sample:'나', roman:'n', hint:'舌尖頂上齒齦' }, { letter:'ㅁ', sample:'마', roman:'m', hint:'雙唇閉合' },
        { letter:'ㅇ', sample:'아', roman:'silent', hint:'初聲不發音' }, { letter:'ㄹ', sample:'라', roman:'r/l', hint:'舌尖輕彈' },
      ],
      compare: [['나','마','아','라'],['아','앙'],['라','알']],
    },
    {
      id: 'basic-vowels', number: '06', minutes: 9, title: '六個基本母音', kicker: '口型比注音重要',
      goal: '聽出 ㅏ、ㅓ、ㅗ、ㅜ、ㅡ、ㅣ 的核心口型。',
      note: 'ㅓ、ㅡ 在華語沒有一對一對應；把注音當起點，最後以真人音檔為準。',
      sounds: [
        { letter:'ㅏ', sample:'아', roman:'a', hint:'嘴自然張開' }, { letter:'ㅓ', sample:'어', roman:'eo', hint:'嘴放鬆張開' },
        { letter:'ㅗ', sample:'오', roman:'o', hint:'嘴圓、舌位較高' }, { letter:'ㅜ', sample:'우', roman:'u', hint:'嘴圓向前' },
        { letter:'ㅡ', sample:'으', roman:'eu', hint:'嘴角拉平' }, { letter:'ㅣ', sample:'이', roman:'i', hint:'嘴角微拉' },
      ],
      compare: [['아','어'],['오','우'],['으','이']],
    },
    {
      id: 'y-vowels', number: '07', minutes: 6, title: 'Y 系母音', kicker: '多一短橫，多一個 y',
      goal: '用基本母音推導 ㅑ、ㅕ、ㅛ、ㅠ。',
      note: '不要重新背四個孤立符號；把它們理解成 ya、yeo、yo、yu。',
      sounds: [
        { letter:'ㅑ', sample:'야', roman:'ya', hint:'ㅏ → ㅑ' }, { letter:'ㅕ', sample:'여', roman:'yeo', hint:'ㅓ → ㅕ' },
        { letter:'ㅛ', sample:'요', roman:'yo', hint:'ㅗ → ㅛ' }, { letter:'ㅠ', sample:'유', roman:'yu', hint:'ㅜ → ㅠ' },
      ],
      compare: [['아','야'],['어','여'],['오','요'],['우','유']],
    },
    {
      id: 'compound-vowels', number: '08', minutes: 8, title: 'W 系與複合母音', kicker: '從兩個動作滑成一個音',
      goal: '認出 ㅐ／ㅔ 系與 ㅘ、ㅝ、ㅟ 等複合母音。',
      note: '現代首爾音裡有些母音已很接近；看字仍要分，聽音測驗不會把同音組硬拿來互考。',
      sounds: [
        { letter:'ㅐ', sample:'애', roman:'ae', hint:'現代音近 ㅔ' }, { letter:'ㅔ', sample:'에', roman:'e', hint:'現代音近 ㅐ' },
        { letter:'ㅘ', sample:'와', roman:'wa', hint:'ㅗ＋ㅏ' }, { letter:'ㅝ', sample:'워', roman:'wo', hint:'ㅜ＋ㅓ' },
        { letter:'ㅚ', sample:'외', roman:'oe', hint:'現代多近 we' }, { letter:'ㅟ', sample:'위', roman:'wi', hint:'ㅜ＋ㅣ' },
      ],
      compare: [['애','에'],['와','워'],['외','위']],
    },
    {
      id: 'ui-review', number: '09', minutes: 8, title: 'ㅢ 與 40 音總整理', kicker: '最後一塊拼圖',
      goal: '知道 ㅢ 的核心音與常見位置變化，完成 40 音地圖。',
      note: 'ㅢ 在詞首、非詞首及助詞「의」可能有不同常見念法；先記標準核心音，再靠真實單字累積。',
      sounds: [
        { letter:'ㅢ', sample:'의', roman:'ui', hint:'先 ㅡ 再滑向 ㅣ' },
        { letter:'희', sample:'희', roman:'hui/hi', hint:'非詞首常靠近 i' },
        { letter:'나의', sample:'나의', roman:'na-ui', hint:'助詞 의 常可近 e' },
      ],
      compare: [['의','이','에']],
    },
  ],
  matrixGroups: [
    { id:'basic', label:'基本表', consonants:['ㄱ','ㄴ','ㄷ','ㄹ','ㅁ','ㅂ','ㅅ','ㅇ','ㅈ','ㅎ'], vowels:['ㅏ','ㅓ','ㅗ','ㅜ','ㅡ','ㅣ'] },
    { id:'y', label:'Y 系', consonants:['ㄱ','ㄴ','ㄷ','ㄹ','ㅁ','ㅂ','ㅅ','ㅇ','ㅈ','ㅎ'], vowels:['ㅑ','ㅕ','ㅛ','ㅠ'] },
    { id:'compound', label:'複合母音', consonants:['ㄱ','ㄴ','ㄷ','ㄹ','ㅁ','ㅂ','ㅅ','ㅇ','ㅈ','ㅎ'], vowels:['ㅐ','ㅔ','ㅒ','ㅖ','ㅘ','ㅙ','ㅚ','ㅝ','ㅞ','ㅟ','ㅢ'] },
    { id:'contrast', label:'鬆緊送氣', consonants:['ㄱ','ㄲ','ㅋ','ㄷ','ㄸ','ㅌ','ㅂ','ㅃ','ㅍ','ㅅ','ㅆ','ㅈ','ㅉ','ㅊ','ㅎ'], vowels:['ㅏ','ㅓ','ㅗ','ㅜ','ㅡ','ㅣ'] },
    { id:'resonants', label:'鼻／流音', consonants:['ㄴ','ㅁ','ㅇ','ㄹ'], vowels:['ㅏ','ㅓ','ㅗ','ㅜ','ㅡ','ㅣ'] },
    { id:'all', label:'完整 399', consonants:['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'], vowels:['ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅗ','ㅘ','ㅙ','ㅚ','ㅛ','ㅜ','ㅝ','ㅞ','ㅟ','ㅠ','ㅡ','ㅢ','ㅣ'] },
  ],
  // 依發音位置排序；每一張都先聽單獨音節，再進入有意思的例字。
  singleBatchim: [
    { id:'k', sound:'ㄱ', roman:'k', standalone:'악', cue:'舌根抵住軟顎，氣流停住，不把 k 爆出來。', spellings:['ㄱ','ㄲ','ㅋ'], example:{ word:'책', mean:'書' } },
    { id:'n', sound:'ㄴ', roman:'n', standalone:'안', cue:'舌尖頂住齒齦，讓鼻音 n 留在下面。', spellings:['ㄴ'], example:{ word:'손', mean:'手' } },
    { id:'m', sound:'ㅁ', roman:'m', standalone:'암', cue:'雙唇閉合，讓鼻音 m 留在下面。', spellings:['ㅁ'], example:{ word:'밤', mean:'夜晚' } },
    { id:'ng', sound:'ㅇ', roman:'ng', standalone:'앙', cue:'舌根抬起、聲音走鼻腔；ㅇ 放在下面才念 ng。', spellings:['ㅇ'], example:{ word:'강', mean:'江／河' } },
    { id:'l', sound:'ㄹ', roman:'l', standalone:'알', cue:'舌尖貼住齒齦就停下，接近英文 l，不要捲成「兒」。', spellings:['ㄹ'], example:{ word:'물', mean:'水' } },
    { id:'t', sound:'ㄷ', roman:'t', standalone:'앋', cue:'舌尖抵住齒齦，氣流停住，不把 t 爆出來。', spellings:['ㄷ','ㅅ','ㅆ','ㅈ','ㅊ','ㅌ','ㅎ'], example:{ word:'옷', mean:'衣服' } },
    { id:'p', sound:'ㅂ', roman:'p', standalone:'압', cue:'雙唇閉住，氣流停住，不把 p 爆出來。', spellings:['ㅂ','ㅍ'], example:{ word:'밥', mean:'飯' } },
  ],
  doubleBatchimGroups: [
    {
      sound:'ㄱ', label:'留下 ㄱ 音',
      items:[
        { letters:'ㄳ', word:'넋', pronounced:'넉', mean:'靈魂' },
        { letters:'ㄺ', word:'닭', pronounced:'닥', mean:'雞' },
      ],
    },
    {
      sound:'ㄴ', label:'留下 ㄴ 音',
      items:[
        { letters:'ㄵ', word:'앉다', pronounced:'안따', mean:'坐' },
        { letters:'ㄶ', word:'많다', pronounced:'만타', mean:'多；ㅎ 讓 ㄷ 送氣' },
      ],
    },
    {
      sound:'ㅁ', label:'留下 ㅁ 音',
      items:[
        { letters:'ㄻ', word:'삶', pronounced:'삼', mean:'人生' },
      ],
    },
    {
      sound:'ㄹ', label:'留下 ㄹ 音',
      items:[
        { letters:'ㄼ', word:'여덟', pronounced:'여덜', mean:'八' },
        { letters:'ㄽ', word:'외곬', pronounced:'외골', mean:'單一路向' },
        { letters:'ㄾ', word:'핥다', pronounced:'할따', mean:'舔' },
        { letters:'ㅀ', word:'싫다', pronounced:'실타', mean:'討厭；ㅎ 讓 ㄷ 送氣' },
      ],
    },
    {
      sound:'ㅂ', label:'留下 ㅂ 音',
      items:[
        { letters:'ㅄ', word:'없다', pronounced:'업따', mean:'沒有' },
        { letters:'ㄿ', word:'읊다', pronounced:'읍따', mean:'吟誦' },
      ],
    },
  ],
  doubleBatchimLiaison: [
    { letters:'ㄳ', word:'넋이', pronounced:'넉씨', note:'ㄱ 留下，ㅅ 移到下一格並念緊音' },
    { letters:'ㄵ', word:'앉아', pronounced:'안자', note:'ㄴ 留下，ㅈ 移到下一格' },
    { letters:'ㄺ', word:'닭을', pronounced:'달글', note:'ㄹ 留下，ㄱ 移到下一格' },
    { letters:'ㄻ', word:'젊어', pronounced:'절머', note:'ㄹ 留下，ㅁ 移到下一格' },
    { letters:'ㄿ', word:'읊어', pronounced:'을퍼', note:'ㄹ 留下，ㅍ 移到下一格' },
    { letters:'ㅄ', word:'없어', pronounced:'업써', note:'ㅂ 留下，ㅅ 移到下一格並念緊音' },
    { letters:'ㄶ', word:'많아', pronounced:'마나', note:'ㅎ 消失，ㄴ 接到下一格' },
    { letters:'ㅀ', word:'싫어', pronounced:'시러', note:'ㅎ 消失，ㄹ 接到下一格' },
  ],
  doubleBatchimExceptions: [
    { word:'읽고', pronounced:'일꼬', title:'ㄺ 動詞詞幹＋ㄱ', note:'읽- 後面接 ㄱ 時通常保留 ㄹ，後面的 ㄱ 再變緊音。' },
    { word:'밟다', pronounced:'밥따', title:'밟- 的特別規則', note:'밟- 接子音時多念成 ㅂ 收尾，不照一般 ㄼ 留 ㄹ。' },
  ],
  soundChanges: [
    {
      id:'liaison', label:'連音', badge:'MOVE THE BATCHIM', title:'收尾往下一格滑', article:'標準發音法第 13、14 條',
      summary:'後面音節用 ㅇ 承接母音時，前面的 받침 通常會移到下一格，照原本子音發音。雙收尾則常是一個留下、一個滑過去。',
      cue:'先把下一格的 ㅇ 想成空位：看到母音，就檢查前面的收尾能不能搬過來。',
      examples:[
        { written:'먹어', pronounced:'머거', note:'ㄱ 滑到 어 前面' },
        { written:'집에', pronounced:'지베', note:'ㅂ 滑到 에 前面' },
        { written:'읽어', pronounced:'일거', note:'雙收尾 ㄺ：ㄹ 留下、ㄱ 滑過去' },
        { written:'없어', pronounced:'업써', note:'雙收尾 ㅄ：ㅂ 留下、ㅅ 滑過去並成 ㅆ' },
      ],
    },
    {
      id:'nasal', label:'鼻音化', badge:'MAKE IT NASAL', title:'卡住的音改走鼻腔', article:'標準發音法第 18、19 條',
      summary:'ㄱ／ㄷ／ㅂ 類收尾遇到後面的 ㄴ 或 ㅁ，會順著鼻音變成 ㅇ／ㄴ／ㅁ。',
      cue:'後面出現 ㄴ、ㅁ 時先不要硬爆破；讓前面的收尾也一起變成鼻音。',
      examples:[
        { written:'국물', pronounced:'궁물', note:'ㄱ ＋ ㅁ → ㅇ ＋ ㅁ' },
        { written:'먹는', pronounced:'멍는', note:'ㄱ ＋ ㄴ → ㅇ ＋ ㄴ' },
        { written:'앞문', pronounced:'암문', note:'ㅂ 類收尾 ＋ ㅁ → ㅁ ＋ ㅁ' },
      ],
    },
    {
      id:'tense', label:'緊音化', badge:'TIGHTEN IT', title:'後面的音突然繃緊', article:'標準發音法第 23 條',
      summary:'ㄱ／ㄷ／ㅂ 類收尾後面的 ㄱ、ㄷ、ㅂ、ㅅ、ㅈ，常會變成對應緊音。',
      cue:'先把收尾卡住，再把下一個音短、緊地放出來；不是大聲，也不是多吐氣。',
      examples:[
        { written:'학교', pronounced:'학꾜', note:'ㄱ 收尾後的 ㄱ → ㄲ' },
        { written:'먹다', pronounced:'먹따', note:'ㄱ 收尾後的 ㄷ → ㄸ' },
        { written:'잡지', pronounced:'잡찌', note:'ㅂ 收尾後的 ㅈ → ㅉ' },
      ],
    },
    {
      id:'aspiration', label:'送氣化', badge:'ADD THE AIR', title:'遇到 ㅎ，合成送氣音', article:'標準發音法第 12 條',
      summary:'ㄱ／ㄷ／ㅂ／ㅈ 類音和 ㅎ 相遇時，常合成 ㅋ／ㅌ／ㅍ／ㅊ；有些 ㅎ 遇母音則會脫落。',
      cue:'看到 ㅎ 先檢查左右：它可能把鄰居推出一股氣，也可能自己消失。',
      examples:[
        { written:'좋다', pronounced:'조타', note:'ㅎ ＋ ㄷ → ㅌ' },
        { written:'축하', pronounced:'추카', note:'ㄱ ＋ ㅎ → ㅋ' },
        { written:'입학', pronounced:'이팍', note:'ㅂ ＋ ㅎ → ㅍ' },
      ],
    },
    {
      id:'palatal', label:'口蓋音化', badge:'MOVE FOR I', title:'ㄷ／ㅌ 遇 ㅣ，變成 ㅈ／ㅊ', article:'標準發音法第 17 條',
      summary:'ㄷ、ㅌ 類收尾接上以 ㅣ 開始的助詞或接尾詞時，會往 ㅣ 的位置靠近，改念 ㅈ、ㅊ。',
      cue:'看到「ㄷ／ㅌ 받침＋이」先別照普通連音念，優先檢查 ㅈ／ㅊ。',
      examples:[
        { written:'굳이', pronounced:'구지', note:'ㄷ ＋ 이 → 지' },
        { written:'같이', pronounced:'가치', note:'ㅌ ＋ 이 → 치' },
      ],
    },
  ],
};
