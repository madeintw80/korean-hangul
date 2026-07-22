# CHECKPOINT

Updated: 2026-07-22T15:47:42+08:00
Task Lead: Echo
Status: ready_for_review
Branch: main
Last verified implementation commit: b732eea
Last published commit: 6f010fe

## PM requested

- 參考一小時學會 40 音的教學節奏，把 App 擴充或大改成課程優先版本。
- 除了母音、子音，加入母子組合表、組合念法與相對應測驗。
- ㅎ 放在送氣音章；ㄴ／ㅁ／ㅇ／ㄹ 合併為鼻音／流音。
- 鼻音／流音放到下面當收尾時另做一個章節，並補齊其他收尾音。
- 先做本機版本給 PM 看，不 push／deploy。

## Completed locally

- 首頁改為五個主學習區：速通課程、組合表、收尾音、測驗、工具箱。
- 新增九關、總計約 60 分鐘的 40 音課程與 localStorage 進度；聲音家族依 PM 決策重新分組。
- 新增分段篩選與完整 19 × 21＝399 格母子組合表，可播放單格或整列。
- 新增七種代表收尾音教材：ㄱ／ㄷ／ㅂ 阻塞家族，以及 ㄴ／ㅁ／ㅇ 鼻音、ㄹ 流音；另列 11 個複合收尾。
- 新增組字、拆字、聽音、收尾四種課程測驗與弱點記錄。
- 既有母音、子音、收尾、拼字、字母測驗、女團與歌詞完整保留在工具箱。
- PWA manifest、Service Worker cache 與靜態測試更新為 `v3.0.0-preview`；音檔 manifest 維持 139 段 × 3 聲線＝417 個 MP3。

## Verification

- `node --check app.js`、`course-data.js`、`course.js`、`sw.js`：PASS。
- `pronunciation.test.js`：21 母音、19 子音、11 組變音、15 組注音與 3,192 組合 PASS。
- `audio-assets.test.mjs`：139 段 × 3 聲線＝417 個 MP3 PASS。
- `pwa-assets.test.mjs`、`course.test.mjs`、`cf-tts-worker/worker.test.mjs`：PASS。
- Browser 1280×720：五個主學習區、完整 399 格組合表、四種新測驗、工具箱七頁與進度流程均可操作；整頁無水平溢出。
- Browser 390×844：整頁寬度 375、小於內容 viewport；完整組合表在 359px 容器內獨立橫向捲動，不造成整頁爆版。
- Browser 重整：第一關完成進度仍為 11%；console error／warning 0。

## Current state

- v3.0.0-preview 已完成本機實作與驗收，功能 commit 為 `b732eea`，網址為 `http://127.0.0.1:8877/`。
- Chrome 已保留本機預覽分頁；預覽伺服器 PID 54164 正在背景執行。
- 沒有 push、沒有 GitHub Pages 發布、沒有 Cloudflare Worker 變更。

## Decisions and assumptions

- 40 音採九關分段，而不是一張大表一次塞完；每關可點音、比較並標記完成。
- ㅎ 與 ㅋ／ㅌ／ㅍ／ㅊ 同章教氣流，但文字明確避免宣稱 ㅎ 是某個鬆音的正式送氣對應。
- 收尾先教 27 種寫法歸納成七種代表音；複合收尾先辨認，不在第一輪強迫背所有規則。
- 參考影片只採教學節奏與資訊架構，教材文字與畫面為原創，未複製影片內容。
- 本回合權限僅含本機修改、測試與 commit，不含 push／deploy。

## Next actions

1. PM 打開 `http://127.0.0.1:8877/` 實際走一次課程、組合表、收尾音與測驗。
2. PM 回覆要調整的內容／畫面，或另行授權 push／deploy。

## Risks / blockers

- 沒有程式 blocker。
- 完整 399 格需要在表格容器內橫向捲動，手機版已避免讓整頁一起橫移。
- v3 尚未做真人教學影片或逐口型動畫；目前以聲音、家族比較與互動表格帶學。
