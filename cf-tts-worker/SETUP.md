# 한글 TTS — 免費 Gemini + Cloudflare Worker 設定

> 目標：iPhone／電腦都使用同一個自然韓文聲線；免費額度用完或服務暫停時，App 自動改用裝置聲線。
>
> Gemini Pro／Google AI Pro 訂閱與 Gemini API 帳務是兩套系統。本專案使用獨立的 **Free API project**，不綁 Cloud Billing，避免意外扣款。

## 安全原則

- API key 不貼進聊天、不寫進 `worker.js`、不 commit 到 Git。
- API key 只存成 Cloudflare 的 encrypted secret：`GEMINI_API_KEY`。
- Google AI Studio 的 project 必須顯示 `Free`；不要按 `Set up billing`。
- App 前端只知道 Worker URL，看不到 Gemini API key。

## Step 1：建立免費 Gemini API key

1. 用要管理此 App 的 Google 帳號登入 [Google AI Studio API Keys](https://aistudio.google.com/apikey)。
2. 建立獨立 project，建議名稱：`korean-hangul-tts-free`。
3. 建立新的 API key。新 key 應使用 Google 目前預設的 Auth key 類型。
4. 確認 project 的 `Plan`／`Billing Tier` 顯示 **Free**。
5. 暫時複製 key，完成 Step 2 後不要再貼到其他地方。

> Google 官方說明：新帳號從 Free Tier 開始；要升 Paid Tier 必須另外連結 billing account。
>
> https://ai.google.dev/gemini-api/docs/billing/

## Step 2：把 key 存進 Cloudflare secret

1. 登入 [Cloudflare Dashboard](https://dash.cloudflare.com)。
2. 進入 **Compute → Workers & Pages → `hangul-tts`**。
3. 進入 **Settings → Variables and Secrets**。
4. 新增 secret：
   - Name：`GEMINI_API_KEY`
   - Value：貼上 Step 1 的 API key
   - 類型務必選 **Secret／Encrypt**，不要選一般明文 variable。
5. 儲存並 Deploy。

舊的 `AI → Workers AI` binding 已不再使用，可移除；保留也不影響新版 Worker。

## Step 3：更新 Worker code

1. 在 `hangul-tts` Worker 按 **Edit code**。
2. 用本資料夾的 [`worker.js`](./worker.js) 完整取代線上內容。
3. 按 **Deploy**，等待成功訊息。

新版 Worker 使用 `gemini-3.1-flash-tts-preview`，把 Gemini 回傳的 PCM 包成 24 kHz mono WAV，讓 iPhone Safari 可透過 Web Audio 播放。

## Step 4：驗證

先開健康檢查：

```text
https://hangul-tts.madeintw80.workers.dev/?health=1
```

成功應看到：

```json
{"ok":true,"provider":"gemini-3.1-flash-tts-preview","keyReady":true}
```

再開音訊測試：

```text
https://hangul-tts.madeintw80.workers.dev/?text=안녕하세요&rate=1
```

成功時會播放或下載 WAV，內容是完整的「안녕하세요」。慢速測試可把 `rate=1` 改為 `rate=0.6`。

## 上線順序

1. 先部署 Worker 並完成上方兩項驗證。
2. 再 push App 的 v2.3.0。

前端會核對 Worker 回傳的 `X-TTS-Provider`。如果仍是舊 MeloTTS，會拒絕截斷音訊並安全退回 iPhone／裝置聲線。

## 免費額度與隱私

- Cloudflare Workers Free：每天 100,000 requests。
- Gemini 3.1 Flash TTS Preview：官方目前標示 Free Tier 的文字輸入與音訊輸出皆免費。
- 免費額度到頂時不會由本 App 自動升級付費；Worker 會失敗，App 立即改用裝置聲線。
- Free Tier 送出的韓文可能被 Google 用於改善產品，因此不要輸入私人或機密內容。
- Preview 模型與免費規則未來可能調整；App 已保留裝置 fallback，服務變動時仍能發音。

## 故障排除

| 畫面／結果 | 處理方式 |
|---|---|
| `keyReady:false` | Cloudflare secret 名稱不是 `GEMINI_API_KEY`，或尚未 Deploy |
| `雲端語音尚未完成設定` | 回 Step 2 新增 secret |
| `雲端語音暫時忙碌` | 到 AI Studio 確認 Free project 的 quota；App 會自動用裝置聲線 |
| iPhone 第一次沒聲音 | 關閉靜音模式後再點一次；首次必須由使用者點擊解鎖音訊 |
| 懷疑 key 外洩 | 在 AI Studio 建新 key → 更新 Cloudflare secret → Deploy → 停用舊 key |
