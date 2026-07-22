# PROJECT — korean-hangul

建立：2026-07-15（雙腦 SSOT）  
狀態：Active

## 目標

- 用約 60 分鐘的順序課程，讓完全初學者先建立韓文 40 音、母子組合與七種代表收尾音的拼讀能力。
- 課後以 K-pop 女團、團名與歌詞繼續練韓文字母、發音與變音。
- 成功標準：手機能順著課程快速學習、桌面可清楚瀏覽完整組合表，發音、進度與離線 PWA 穩定。

## 架構

- `index.html`：頁面骨架、學習分類、發音控制台。
- `style.css`：responsive UI 與互動狀態。
- `app.js`：資料、三聲線／Gemini／裝置發音、變音、測驗、歌詞與 DOM render。
- `course-data.js`：九關 40 音課程、組合表分類、七種代表收尾音與 11 個複合收尾資料。
- `course.js`：課程進度、19 × 21 組合表、收尾音教材與三種自動朗讀測驗。
- `audio/`：Sarah／Olivia／Emily 固定教材 MP3 與唯一對應表 `manifest.js`。
- `sw.js`／`manifest.json`：PWA、離線快取與更新。
- 技術：vanilla HTML／CSS／JavaScript；Supertonic 3 預生成音檔；Cloudflare Worker 代理選用的 Gemini TTS；Web Speech API fallback。

## 執行方式

- 本機：在 repo 根目錄啟動任意靜態 HTTP server，再開啟首頁。
- 不需 build、不需安裝相依；本機可直接測 UI 與裝置語音。
- 內建自然女聲不需金鑰；只有使用者主動切換 Gemini 自由句時需要 Worker 的 encrypted secret。

## 測試

- 靜態結構、三聲線 417 個 MP3 覆蓋與版本一致性檢查。
- 課程資料：九關、399 個母子組合、七種代表收尾音、11 個複合收尾與三種自動朗讀測驗模式。
- Browser smoke：390×844、1280×720、五個主學習區、工具箱七個 tab、TTS、進度、組合表、測驗與 console error。
- PWA：manifest、service worker assets 與 CACHE 版本。

## 部署

- Push `main` 後由 GitHub Pages 自動發布：`https://madeintw80.github.io/korean-hangul/`。
- Push／發布屬對外動作，需 PM 明確授權。

## 已知風險 / 注意事項

- Web Speech 可用 voice 依裝置與瀏覽器不同；語音不可用時必須清楚顯示狀態。
- Gemini TTS 免費額度很低，只能當自由句選用功能；固定教材不得依賴逐次 API 呼叫。
- 教材外的新文字沒有預生成檔案時，內建模式會改用裝置聲線。
- Service worker 若未 bump CACHE，舊使用者可能看不到更新。
