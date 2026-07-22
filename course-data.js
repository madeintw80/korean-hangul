/* 한글 Studio v3 課程資料：內容與互動引擎分離，之後擴課不必改主程式。 */
window.HANGUL_COURSE_DATA = {
  version: '3.0.0-preview',
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
  batchimFamilies: [
    { id:'k', title:'ㄱ 家族', sound:'ㄱ', tone:'喉後卡住，不爆破', spellings:['ㄱ','ㄲ','ㅋ'], samples:['악','밖','부엌'] },
    { id:'t', title:'ㄷ 家族', sound:'ㄷ', tone:'舌尖卡住，不爆破', spellings:['ㄷ','ㅅ','ㅆ','ㅈ','ㅊ','ㅌ','ㅎ'], samples:['옷','낮','꽃'] },
    { id:'p', title:'ㅂ 家族', sound:'ㅂ', tone:'雙唇閉住，不爆破', spellings:['ㅂ','ㅍ'], samples:['밥','앞'] },
  ],
  resonantBatchim: [
    { letter:'ㄴ', roman:'n', sample:'안', word:'손', mean:'手', cue:'舌尖頂住，鼻音還在' },
    { letter:'ㅁ', roman:'m', sample:'암', word:'밤', mean:'夜晚', cue:'雙唇閉合，鼻音還在' },
    { letter:'ㅇ', roman:'ng', sample:'앙', word:'공', mean:'球／零', cue:'放下面才念 ng' },
    { letter:'ㄹ', roman:'l', sample:'알', word:'말', mean:'話／馬', cue:'舌尖停住，接近 l' },
  ],
  doubleBatchim: ['ㄳ','ㄵ','ㄶ','ㄺ','ㄻ','ㄼ','ㄽ','ㄾ','ㄿ','ㅀ','ㅄ'],
};
