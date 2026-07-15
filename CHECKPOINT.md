# CHECKPOINT

Updated: 2026-07-15T13:45:00+08:00
Task Lead: Echo
Status: action_required
Branch: main
Last verified implementation commit: bf28d38

## PM requested

- 改善韓文語音真人感並全面校正台灣注音輔助。
- iPhone 必須能使用；雲端語音要免費。
- PM 接受使用 Gemini，並告知已有 Gemini Pro／Google AI Pro 訂閱。

## Completed locally

- v2.2.0：完成裝置最佳聲線、自然語速、完整句試聽與注音／發音規則校正。
- v2.3.0：Cloudflare Worker 改接 `gemini-3.1-flash-tts-preview`，輸出 iPhone 可解碼的 24 kHz mono WAV。
- 免費方案使用獨立 AI Studio Free API project，不綁 Cloud Billing；API key 只允許放 Cloudflare encrypted secret。
- Gemini 依自然語速指令重新演繹，不使用會連音高一起改變的 Web Audio 硬降速。
- 前端核對 `X-TTS-Provider`；舊 MeloTTS、免費額度用完或網路失敗都自動退回裝置聲線。
- 新增 Worker mock 測試，涵蓋 CORS、輸入限制、缺 key、API request、PCM → WAV 與 provider header。
- 已建立本機功能 commit `bf28d38`；尚未 push、部署或處理任何帳號／key。

## Current state

- 本機 `main` 已完成 v2.3.0；公開 GitHub Pages 仍是 v2.1.0。
- 線上 `hangul-tts` Worker 仍是舊 MeloTTS；v2.3 前端在 Worker 更新前會安全 fallback，不會播放截斷音訊。
- Gemini Pro／Google AI Pro 是消費者訂閱，Gemini API 的 Free／Paid tier 另行管理；本案不依賴 Pro 訂閱扣抵 API。

## Verification

- `node --check app.js`：PASS。
- `pronunciation.test.js`：21 母音、19 子音、11 組變音、15 組注音、3,192 組合 PASS。
- `cf-tts-worker/worker.test.mjs`：PASS。
- v2.3.0 footer／issue／service worker cache、cloud mode、provider guard、自然語速：PASS。
- Browser：Gemini 模式預設啟用；舊 Worker 約 6 秒後被拒絕並顯示 iPhone／裝置 fallback；console error／warning 0。
- 390×844 模擬：無水平溢出，免費與隱私提示可見，模式切換正常。

## Decisions and assumptions

- 使用 Gemini Developer API Free Tier，不連結 billing account，避免意外帳單。
- API key 絕不進 repo／前端／聊天；只放 Cloudflare `GEMINI_API_KEY` encrypted secret。
- 部署順序固定為 Worker → 健康／音訊驗證 → App push，避免公開站先連到舊 provider。
- Gemini TTS 仍是 Preview，必須永久保留 Web Speech fallback。

## Next actions

1. PM 明確授權帳號與對外動作後，在 Google AI Studio 建立 Free project／Auth key。
2. 把 key 存進 Cloudflare `hangul-tts` 的 encrypted secret，部署 Worker 並驗證完整韓文音訊。
3. PM 授權 push 後發布 v2.3.0，再用 iPhone Safari／主畫面 PWA 實機試聽。

## Risks / blockers

- 尚未取得建立 Google API key、將 key 傳入 Cloudflare secret、部署 Worker 與 push 的明確授權。
- 無真實 API key，因此本機只能 mock 驗證 Gemini 成功路徑；真人聲線音色仍需部署後由 PM 實際試聽。
- Free Tier 內容可能被 Google 用於改善產品；App 已在 UI 提示不要輸入私人或機密內容。
