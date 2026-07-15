# CHECKPOINT

Updated: 2026-07-15T19:19:23+08:00
Task Lead: Echo
Status: complete
Branch: main
Last verified implementation commit: 9a41e64
Last published commit: 5c0229b

## PM requested

- 修正很多母音按了沒聲音，以及「免費語音暫時忙碌」頻繁改用 iPhone 聲線。
- 聲音要更像真人，氣質接近 ChatGPT Live 的 Sol。
- Sarah／Olivia／Emily 三個免費聲線全部放進 App，讓使用者可切換。

## Root cause

- AI Studio 專案 `korean-hangul-tts-free` 實際 Free Tier 為 3 RPM／10 RPD。
- 單次練完 21 個母音必然超過每日 10 次，因此 v2.3.0 的逐鍵 Gemini API 架構無法可靠運作。
- App 的母音資料與注音 mapping 沒漏；失聲來自 Worker 429／503 後的裝置 fallback。

## Completed locally

- 使用官方 Supertonic 3 在本機預生成 Sarah（F1）／Olivia（F4）／Emily（F5）三套韓文女聲。
- 固定教材共 134 段文字 × 3 聲線 = 402 個 44.1 kHz mono MP3，總大小約 4.02 MB。
- 54 段核心教材（21 母音、19 子音示範、7 組收尾音與例字、完整句試聽）三聲線共 162 檔納入 PWA 預快取。
- 團名、追星常用語、拼字範例與既有歌詞有預製檔時走內建聲線；其他音檔第一次使用後由 Service Worker runtime cache。
- 發音模式改為：內建自然女聲（預設／不限次數）／Gemini 自由句（每日限額）／iPhone 裝置聲線。
- Gemini 額度失敗訊息不再稱為「暫時忙碌」，改為明示免費額度可能用完。
- 內建模式的教材外新文字會退回裝置聲線，不會偷偷消耗 Gemini 額度。
- 新增 `audio-assets.test.mjs` 與 `audio/README.md`；版本更新為 v2.4.0／`hangul-v2.4.0`。

## Verification

- `node --check app.js`：PASS。
- `node --check sw.js`：PASS。
- `audio-assets.test.mjs`：134 段 × 3 聲線 = 402 檔，路徑／大小／核心覆蓋 PASS。
- 音檔解碼檢查：402 檔皆 MP3、44.1 kHz、mono；0 missing、0 bad mapping；時長 0.418～4.148 秒。
- `pronunciation.test.js`：21 母音、19 子音、11 組變音、15 組注音、3,192 組合 PASS。
- Browser 390×844：三聲線各點完 21 母音，共 63 次；console error／warning 0，無水平溢出。
- Browser 390×844：七個 tab 全可切換；Sarah／Olivia／Emily 選單與 v2.4.0 狀態正確。
- Browser 1280×720：無水平溢出，v2.4.0 與內建聲線狀態正確。
- GitHub 遠端 `main`：`5c0229b`，與本機 v2.4.0 發布 commit 一致。
- 公開 GitHub Pages 首頁：HTTP 200，顯示 v2.4.0 並載入 `audio/manifest.js`。
- 公開 manifest：v2.4.0、134 段文字、402 檔、162 核心預快取檔。
- 公開 MP3 抽驗：Sarah 5,551 bytes、Olivia 6,413 bytes、Emily 5,885 bytes，皆 HTTP 200／`audio/mp3`。

## Current state

- v2.4.0 功能 commit `9a41e64` 與發布前文件 commit `5c0229b` 已 push 至 `origin/main`。
- 正式 repo 原位完整測試與公開 GitHub Pages 驗證全部通過。
- 公開站已是 v2.4.0；Cloudflare Worker 未改動也不需重部署。
- Cloudflare Worker 可以維持現況，v2.4.0 不需要新增或搬移任何 secret。

## Decisions and assumptions

- 三聲線全部上架；預設 Sarah，保留使用者上次選擇。
- 固定教材不再依賴 Gemini Free Tier；Gemini 只保留給使用者主動選擇的自由句。
- 真正 ChatGPT Sol 不是免費公開 TTS API 聲線；Sarah 是本案最接近「沉穩放鬆」方向的免費替代。
- 新版公開發布需 PM 明確授權，不沿用 v2.3.0 的一次性部署／push 授權。

## Next actions

1. PM 在 iPhone Safari／主畫面 PWA 按「檢查 App 更新」並試聽三聲線。
2. 若仍看到舊版，可關閉主畫面 App 後重開，再按一次更新。

## Risks / blockers

- 沒有程式或發布 blocker。
- GitHub Pages 第一次載入未使用的長句需要網路；162 個核心教材音檔會隨 PWA 預快取。
