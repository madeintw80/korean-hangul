# CHECKPOINT

Updated: 2026-07-24T16:24:44+08:00
Task Lead: Echo
Status: complete
Branch: main
Last verified implementation commit: 2919998
Last published commit: c2db777

## PM requested

- 全部補進 App：完整檢查標準發音遺漏，包含單／雙收音、ㄴ／ㄹ 流音化、其他音變與歌曲標準讀音。
- 確認固定教材是否為內建女聲，新增或修改內容仍要同步 Sarah／Olivia／Emily。
- 音變篇再加入「流音化」：ㄴ 與 ㄹ 相遇時的發音規則，並同步更新內建女聲。
- 參考三支收尾音教學影片更新收尾音篇；單收音不能只有例字，要保留七個代表音的單獨發音。
- 加入 11 種雙收音的字尾規則、接母音規則與常見例外。
- 本回合先完成本機版本；未取得新的 push／deploy 授權。
- 參考一小時學會 40 音的教學節奏，把 App 擴充或大改成課程優先版本。
- 除了母音、子音，加入母子組合表、組合念法與相對應測驗。
- ㅎ 放在送氣音章；ㄴ／ㅁ／ㅇ／ㄹ 合併為鼻音／流音。
- 鼻音／流音放到下面當收尾時另做一個章節，並補齊其他收尾音。
- 先做本機版本給 PM 看，不 push／deploy。
- 課程測驗移除過於簡單的組字；保留拆字、聽音、收尾，而且每題都要念。
- 工具箱只保留女團拼讀與歌詞拼音，其餘重複入口移除。
- PM 明確授權將 v3.0.2 push 到 GitHub `main` 並由 GitHub Pages 公開發布。
- 在收尾音之後加入連音與基礎音變練習，題目全部要念。
- 往後固定教材新增或改字時，三套離線語音也要一併更新；此規則記在專案 MD。

## Completed

- v3.3.0 將音變篇擴充為 12 類、59 組例字：連音、語素邊界代表音、鼻音化、緊音化、送氣化、口蓋音化、流音化、ㄴ 添加、사이시옷、母音規則、韓文字母名稱連音與長短音。
- 依《標準發音法》第 4～7、15～16、18～20、23～30 條補齊規則、可接受雙讀與例外；容易有多個標準答案或只差音長的 7 組保留教學但不進單選題。
- 發音引擎新增語素邊界、ㄹ／ㄴ 例外、緊音、ㄴ 添加、사이시옷、字母名稱與 `져／쪄／쳐` 規則；52 個唯一答案稽核案例全部精確命中。
- 歌曲補正 `커져가→커저가`、`겁 없이→거법씨`、`던져→던저`、`맘속→맘쏙`；慢速鍵改為降速播放原固定 MP3，維持目前選取的內建女聲。
- 為 39 個新教材詞與 4 個歌曲讀音補齊 Sarah／Olivia／Emily 共 129 個 MP3；manifest 更新為 221 段／663 個 MP3／408 個核心離線快取檔。
- 首頁、Service Worker cache、靜態資產 query 與測試版本同步更新為 `v3.3.0-preview`，維持 `LOCAL PREVIEW`、不 push／deploy。
- v3.2.1 音變篇新增第六類「流音化」，依標準發音法第 20 條說明 ㄴ 在 ㄹ 前後通常變成 ㄹ。
- 新增 `난로→날로`、`신라→실라`、`칼날→칼랄`、`물난리→물랄리`，同時涵蓋 ㄴ＋ㄹ 與 ㄹ＋ㄴ 兩個方向；四組自動納入音變測驗題庫。
- 四個新例字已補齊 Sarah／Olivia／Emily 共 12 個 MP3；manifest 更新為 178 段／534 個 MP3／279 個核心快取檔。
- 首頁、Service Worker cache 與靜態資產 query 更新為 `v3.2.1-preview`，維持 `LOCAL PREVIEW`。
- v3.2 收尾音篇改為七張單收音卡：ㄱ／ㄴ／ㅁ／ㅇ／ㄹ／ㄷ／ㅂ 都可先播放獨立音節，再播放例字。
- 11 種雙收音依字尾／子音前的五個代表音分組，另加入八組母音前連音與 `읽고`、`밟다` 兩個高頻例外。
- 雙收音教材依韓國國立國語院標準發音法第 10、11、13、14 條整理；ㄶ／ㅀ 的 ㅎ 脫落與送氣另有明確提示。
- 新增 20 段雙收音固定教材 × Sarah／Olivia／Emily，共 60 個 MP3；加上既有 `없어`，所有雙收音播放文字均納入核心離線快取。
- manifest 更新為 174 段 × 3 聲線＝522 個 MP3，其中核心快取 267 個；固定教材覆蓋測試同步更新。
- 首頁、PWA cache 與靜態資產 query 更新為 `v3.2.0-preview`，目前維持 `LOCAL PREVIEW`。
- 首頁改為六個主學習區：速通課程、組合表、收尾音、音變、測驗、K-pop 實戰。
- 新增九關、總計約 60 分鐘的 40 音課程與 localStorage 進度；聲音家族依 PM 決策重新分組。
- 新增分段篩選與完整 19 × 21＝399 格母子組合表，可播放單格或整列。
- 新增七種代表收尾音教材：ㄱ／ㄷ／ㅂ 阻塞家族，以及 ㄴ／ㅁ／ㅇ 鼻音、ㄹ 流音；另列 11 個複合收尾。
- 新增拆字、聽音、收尾、音變四種課程測驗與弱點記錄；每次出題自動朗讀韓文刺激，也能按「再聽一次」。
- 拆字題干擾項改由完整子音／母音候選池產生，固定提供四個不同選項，不再隨機退化成二選一。
- 七頁工具箱收斂為兩頁「K-pop 實戰」：只保留女團拼讀與歌詞拼音；移除母音、子音、收尾、拼字、舊字母測驗入口及初始化接線。
- 新增連音、鼻音化、緊音化、送氣化、口蓋音化五類教材，共 15 個原字／實際念法例字。
- 15 個新例字已補齊 Sarah／Olivia／Emily 共 45 個 MP3；manifest 更新為 154 段 × 3 聲線＝462 個 MP3，音變音檔納入核心離線快取。
- `PROJECT.md`、`DECISIONS.md`、`audio/README.md` 已記錄固定教材與三套離線語音必須同批更新的永久規則，覆蓋測試會攔截漏音。
- PWA manifest、Service Worker cache 與靜態測試更新為 `v3.1.0-preview`。

## Verification

- 全套自動測試 PASS：`pronunciation.test.js`、`audio-assets.test.mjs`、`pwa-assets.test.mjs`、`course.test.mjs`、`cf-tts-worker/worker.test.mjs`。
- `pronunciation.test.js`：21 母音、19 子音、75 組變音、15 組注音與 3,192 組合 PASS。
- 規則稽核：52／52 個唯一答案案例與預期標準讀音完全一致。
- `audio-assets.test.mjs`：221 段 × 3 聲線＝663 個 MP3 PASS；59 個標準發音教材詞與四個歌曲新讀音均有三聲線且在核心快取。
- `course.test.mjs`：九關、399 音節、七個獨立單收音、11 個雙收音、12 類標準發音與四種朗讀測驗 PASS。
- Browser 一般視窗：12 個分類按鈕與新增例字正常；Sarah／Olivia／Emily 均成功試播 `맛없다`，歌曲四個新讀音與慢速固定音檔正常，console warning／error 0。
- Browser 390×844：`clientWidth`／`scrollWidth`／`bodyWidth` 均為 375，標準發音篇無整頁水平溢出。
- PWA「立即更新」實測可套用 v3.3；頁籤、footer、`app.js`、教材資料與音檔 manifest 版本一致。
- `audio-assets.test.mjs`：178 段 × 3 聲線＝534 個 MP3 PASS；四個流音化例字三聲線與核心快取覆蓋全部通過。
- `course.test.mjs`：六類音變、19 個音變例字與四種朗讀測驗模式 PASS；其餘 syntax、發音、PWA、Worker 測試全部 PASS。
- Browser 一般視窗：流音化分類、規則文字與四組例字均可見；`난로` 使用 Sarah／Olivia／Emily 各試播成功，console warning／error 0。
- Browser 390×844：流音化標題可見；`clientWidth`／`scrollWidth`／`bodyWidth` 均為 375，無整頁水平溢出。
- `node --check app.js`、`course-data.js`、`course.js`、`sw.js`：PASS。
- `pronunciation.test.js`：21 母音、19 子音、24 組變音、15 組注音與 3,192 組合 PASS。
- `audio-assets.test.mjs`：174 段 × 3 聲線＝522 個 MP3 PASS；21 個雙收音教材播放文字三聲線與核心快取覆蓋全部通過。
- `pwa-assets.test.mjs`、`course.test.mjs`、`cf-tts-worker/worker.test.mjs`：PASS；course test 確認七個獨立單收音、11 個雙收音、八組母音前連音與兩個例外。
- Browser 一般視窗：七個「先聽單獨音」按鍵、11 個雙收音字尾規則、八組連音與兩個例外皆可見；Sarah／Olivia／Emily 各抽播新舊音檔成功，console error／warning 0。
- Browser 390×844：`clientWidth`／`scrollWidth`／`bodyWidth` 均為 375，單／雙收音頁無整頁水平溢出。
- `audio-assets.test.mjs`：154 段 × 3 聲線＝462 個 MP3 PASS；15 個音變例字三聲線與核心快取覆蓋全部通過。
- `pwa-assets.test.mjs`、`course.test.mjs`、`cf-tts-worker/worker.test.mjs`：PASS；course test 確認五類音變與四種朗讀測驗。
- Browser 一般視窗：五類音變例字數 4／3／3／3／2；音變測驗四個不同選項、題目自動朗讀並可重播；console error／warning 0。
- Browser 390×844：`scrollWidth`／`clientWidth`／`bodyWidth` 均為 375，六個主區與音變測驗無整頁水平溢出。
- Browser 一般視窗：拆字、聽音、收尾三種模式各有四個選項、重播鍵可見且實際點按無錯誤；console error／warning 0。
- Browser 一般視窗：K-pop 實戰只剩女團拼讀與歌詞兩頁，舊入口數量 0；16 首歌可選、預設歌詞五張句卡正常。
- Browser 390×844：整頁寬度 375、小於 390 viewport；K-pop 兩頁各占一欄，沒有整頁水平溢出。
- Browser 重整：第一關完成進度仍為 11%；console error／warning 0。
- GitHub Pages 公開檔案驗證：首頁、`course.js`、`sw.js` 皆為 v3.0.2；HTTP 200，Service Worker cache 為 `hangul-v3.0.2-preview-public`。
- 公開版 Browser 驗證：拆字、聽音、收尾皆為四個不同選項且有重播；K-pop 僅女團／歌詞兩頁，16 首歌與預設五張歌詞卡正常；乾淨頁面 console error／warning 0。
- 舊版 PWA 升級驗證：公開頁顯示「有新版本」後按「立即更新」，可切換到 v3.0.2 並重新載入完整內容。

## Current state

- v3.3.0-preview 已完成本機 implementation commit `2919998`；尚未 push／deploy。
- v3.2.1-preview 已完成本機 implementation commit `8b2995f`；尚未 push／deploy。
- 公開版仍是 v3.1.0-preview：https://madeintw80.github.io/korean-hangul/ ，公開版 commit 為 `c2db777`。
- 公開首頁已顯示 `PUBLIC PREVIEW`；Service Worker cache 為 `hangul-v3.1.0-preview-public`。
- 公開 manifest 為 154 段／462 個 MP3／207 個核心快取檔；Sarah／Olivia／Emily 新音變 MP3 均為 HTTP 200、`audio/mp3`。
- 本次沒有 Cloudflare Worker 程式或設定變更，因此未重部署 Worker。

## Decisions and assumptions

- 40 音採九關分段，而不是一張大表一次塞完；每關可點音、比較並標記完成。
- ㅎ 與 ㅋ／ㅌ／ㅍ／ㅊ 同章教氣流，但文字明確避免宣稱 ㅎ 是某個鬆音的正式送氣對應。
- 收尾先教 27 種寫法歸納成七種代表音，且七個代表音都保留單獨播放；雙收音再依「後面接子音或母音」分兩層學。
- 參考影片只採教學節奏與資訊架構，教材文字與畫面為原創，未複製影片內容。
- PM 已把權限擴充為 GitHub `main` push 與 GitHub Pages 自動發布；Cloudflare Worker 不在本次授權與變更範圍。
- 工具箱確實有重複：母音／子音／收尾／拼字／字母測驗已由主流程取代；依 PM 拍板全部移除，只留有獨立實戰價值的女團／歌詞。
- 固定教材不能以裝置聲線 fallback 視為完成；任何教材文字變更都要同步更新三聲線 MP3、manifest、核心快取與覆蓋測試。
- PM 先前授權只涵蓋 v3.1 push／GitHub Pages 發布；v3.2.1 尚未取得新的 push／deploy 授權。

## Next actions

1. PM 本機試用 12 類標準發音與三套聲線，再決定是否 push／deploy。

## Risks / blockers

- 沒有程式 blocker。
- 完整 399 格需要在表格容器內橫向捲動，手機版已避免讓整頁一起橫移。
- v3 尚未做真人教學影片或逐口型動畫；目前以聲音、家族比較與互動表格帶學。
