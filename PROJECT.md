# PROJECT — korean-hangul

建立：2026-07-15（雙腦 SSOT）  
狀態：Active

## 目標

- 用 K-pop 女團、團名與歌詞幫初學者練韓文字母、發音與變音。
- 成功標準：手機可快速練習、桌面可清楚瀏覽，發音與離線 PWA 穩定。

## 架構

- `index.html`：頁面骨架、學習分類、發音控制台。
- `style.css`：responsive UI 與互動狀態。
- `app.js`：資料、三聲線／Gemini／裝置發音、變音、測驗、歌詞與 DOM render。
- `audio/`：Sarah／Olivia／Emily 固定教材 MP3 與唯一對應表 `manifest.js`。
- `sw.js`／`manifest.json`：PWA、離線快取與更新。
- 技術：vanilla HTML／CSS／JavaScript；Supertonic 3 預生成音檔；Cloudflare Worker 代理選用的 Gemini TTS；Web Speech API fallback。

## 執行方式

- 本機：在 repo 根目錄啟動任意靜態 HTTP server，再開啟首頁。
- 不需 build、不需安裝相依；本機可直接測 UI 與裝置語音。
- 內建自然女聲不需金鑰；只有使用者主動切換 Gemini 自由句時需要 Worker 的 encrypted secret。

## 測試

- 靜態結構、三聲線 402 個 MP3 覆蓋與版本一致性檢查。
- Browser smoke：390×844、1280×720、七個 tab、TTS 控制、測驗、歌詞、console error。
- PWA：manifest、service worker assets 與 CACHE 版本。

## 部署

- Push `main` 後由 GitHub Pages 自動發布：`https://madeintw80.github.io/korean-hangul/`。
- Push／發布屬對外動作，需 PM 明確授權。

## 已知風險 / 注意事項

- Web Speech 可用 voice 依裝置與瀏覽器不同；語音不可用時必須清楚顯示狀態。
- Gemini TTS 免費額度很低，只能當自由句選用功能；固定教材不得依賴逐次 API 呼叫。
- 教材外的新文字沒有預生成檔案時，內建模式會改用裝置聲線。
- Service worker 若未 bump CACHE，舊使用者可能看不到更新。
