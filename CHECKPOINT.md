# CHECKPOINT

Updated: 2026-07-15T17:14:25+08:00
Task Lead: Echo
Status: complete
Branch: main
Last verified implementation commit: bf28d38
Last published commit: e3e51c7

## PM requested

- 改善韓文語音真人感並全面校正台灣注音輔助。
- iPhone 必須能使用；雲端語音要免費。
- PM 接受使用 Gemini，並告知已有 Gemini Pro／Google AI Pro 訂閱。

## Completed

- v2.2.0：完成裝置最佳聲線、自然語速、完整句試聽與注音／發音規則校正。
- v2.3.0：Cloudflare Worker 改接 `gemini-3.1-flash-tts-preview`，輸出 iPhone 可解碼的 24 kHz mono WAV。
- 免費方案使用獨立 AI Studio Free API project，不綁 Cloud Billing；API key 只允許放 Cloudflare encrypted secret。
- Gemini 依自然語速指令重新演繹，不使用會連音高一起改變的 Web Audio 硬降速。
- 前端核對 `X-TTS-Provider`；舊 MeloTTS、免費額度用完或網路失敗都自動退回裝置聲線。
- 新增 Worker mock 測試，涵蓋 CORS、輸入限制、缺 key、API request、PCM → WAV 與 provider header。
- 已建立功能 commit `bf28d38`，連同 v2.3.0 文件更新 push 至 `origin/main`。
- 已建立 Google AI Studio 專案 `korean-hangul-tts-free`，解除 Cloud Billing 連結並確認 AI Studio 顯示 Free tier。
- 已建立 Gemini API key，僅存入 Cloudflare `hangul-tts` 的 `GEMINI_API_KEY` encrypted secret；key 未寫入 repo 或前端。
- Cloudflare Worker 已部署 v2.3.0 Gemini 程式碼；Active / Latest version 為 `4f9e947f`。

## Current state

- `main` 與 `origin/main` 已完成 v2.3.0；公開 GitHub Pages 已更新並通過 HTTP 200 驗證。
- 線上 `hangul-tts` Worker 已是 Gemini 3.1 Flash TTS，encrypted secret 已生效。
- Gemini Pro／Google AI Pro 是消費者訂閱，Gemini API 的 Free／Paid tier 另行管理；本案不依賴 Pro 訂閱扣抵 API。

## Verification

- `node --check app.js`：PASS。
- `pronunciation.test.js`：21 母音、19 子音、11 組變音、15 組注音、3,192 組合 PASS。
- `cf-tts-worker/worker.test.mjs`：PASS。
- v2.3.0 footer／issue／service worker cache、cloud mode、provider guard、自然語速：PASS。
- Browser：Gemini 模式預設啟用；舊 Worker 約 6 秒後被拒絕並顯示 iPhone／裝置 fallback；console error／warning 0。
- 390×844 模擬：無水平溢出，免費與隱私提示可見，模式切換正常。
- 線上健康檢查：HTTP 200、`provider=gemini-3.1-flash-tts-preview`、`keyReady=true`。
- 線上韓文音訊：HTTP 200、`audio/wav`、RIFF/WAVE、24 kHz、213,164 bytes、4.44 秒，provider header 正確。
- 公開 GitHub Pages：HTTP 200、HTML 顯示 `v2.3.0` 且包含 Gemini 語音標示。

## Decisions and assumptions

- 使用 Gemini Developer API Free Tier，不連結 billing account，避免意外帳單。
- API key 絕不進 repo／前端／聊天；只放 Cloudflare `GEMINI_API_KEY` encrypted secret。
- 部署順序固定為 Worker → 健康／音訊驗證 → App push，避免公開站先連到舊 provider。
- Gemini TTS 仍是 Preview，必須永久保留 Web Speech fallback。

## Next actions

1. PM 用 iPhone Safari／主畫面 PWA 實機試聽，再依回饋決定是否更換預設 voice。

## Risks / blockers

- PM 已明確授權建立 Free key、Cloudflare secret、Worker deploy 與 push；帳號／部署 blocker 已解除。
- 真人聲線技術驗收已通過，音色偏好仍需 PM 在 iPhone 實際試聽。
- Free Tier 內容可能被 Google 用於改善產品；App 已在 UI 提示不要輸入私人或機密內容。
