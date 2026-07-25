# PROJECT — korean-hangul

建立：2026-07-15（雙腦 SSOT）  
狀態：Active

## 目標

- 用約 60 分鐘的順序課程，讓完全初學者先建立韓文 40 音、母子組合、七種代表收尾音與雙收音規則的拼讀能力。
- 課後以 K-pop 女團、團名與歌詞繼續練韓文字母、發音與變音。
- 成功標準：手機能順著課程快速學習、桌面可清楚瀏覽完整組合表，發音、進度與離線 PWA 穩定。

## 架構

- `index.html`：頁面骨架、學習分類、發音控制台。
- `style.css`：responsive UI 與互動狀態。
- `app.js`：資料、Sarah／Olivia／Emily 內建發音、變音、測驗、歌詞與 DOM render。
- `course-data.js`：九關 40 音課程、組合表分類、七種可單獨播放的代表收尾音、11 個雙收音規則與 12 類標準發音資料。
- `course.js`：課程進度、19 × 21 組合表、單／雙收音與音變教材，以及四種自動朗讀測驗。
- `audio/`：Sarah／Olivia／Emily 固定教材 MP3 與唯一對應表 `manifest.js`。
- `sw.js`／`manifest.json`：PWA、離線快取與更新。
- 技術：vanilla HTML／CSS／JavaScript；Supertonic 3 預生成音檔。前端不呼叫 Cloudflare／Gemini，也不使用 Web Speech API。

## 執行方式

- 本機：在 repo 根目錄啟動任意靜態 HTTP server，再開啟首頁。
- 不需 build、不需安裝相依；本機可直接測 UI 與三個內建女聲。
- 內建自然女聲不需金鑰；自由貼上的教材外文字只做發音拆解，不自動合成語音。

## 測試

- 靜態結構、732 段 manifest／2,196 個 MP3、719 段可點擊固定內容三聲線全覆蓋、核心離線快取與版本一致性檢查。
- 課程資料：九關、399 個母子組合、七種有獨立發音的代表收尾音、11 個雙收音及其連音／例外、12 類標準發音與四種自動朗讀測驗模式。
- Browser smoke：390×844、1280×720、六個主學習區、K-pop 兩個 tab、TTS、進度、組合表、音變、測驗與 console error。
- PWA：manifest、service worker assets 與 CACHE 版本。

## 部署

- Push `main` 後由 GitHub Pages 自動發布：`https://madeintw80.github.io/korean-hangul/`。
- Push／發布屬對外動作，需 PM 明確授權。

## 已知風險 / 注意事項

- 固定內容若漏進 manifest，App 會明確顯示缺檔，不會改用裝置女聲；`audio-assets.test.mjs` 會直接阻擋這類回歸。
- 歌詞逐字音檔採首次連線載入後 cache-first；課程核心音檔則由 Service Worker 預先快取。
- Service worker 若未 bump CACHE，舊使用者可能看不到更新。

## 固定教材語音更新規則

- 新增或修改任何固定教材文字時，Sarah／Olivia／Emily 三套預生成 MP3、`audio/manifest.js`、Service Worker 核心快取與 `audio-assets.test.mjs` 必須同批更新。
- 固定教材不可把 Web Speech／裝置聲線 fallback 當作完成；教材外的自由文字也不 fallback，只提供文字拆解。
