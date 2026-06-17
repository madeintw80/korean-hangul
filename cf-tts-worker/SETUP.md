# 한글 TTS — Cloudflare Worker 部署 Guide

> 給 Wei 一步一步跟著做。**全程用 web dashboard**，不需要裝任何工具。
> ⏱️ 預估 10 分鐘（你 BroTrip 做過一次，這次更簡單，不用 KV）
>
> 📅 對齊 CF dashboard 2025 改版後介面（Workers 在 Compute）
> 🔑 你的 subdomain：`madeintw80.workers.dev`（BroTrip 那次確認過）

---

## Step 1：建 Worker（3 分鐘）

1. 登入 https://dash.cloudflare.com
2. 左側選單 → **Compute** → **Workers & Pages**
3. 按右上 **「+ Create」** → 選 **「Start with Hello World!」**（或 Create Worker）
4. **Worker name** 輸入：`hangul-tts`
   - ⚠️ 這名字會變成你的 URL：`https://hangul-tts.madeintw80.workers.dev`
5. 按 **「Deploy」**（先把預設 Hello World 部署起來，確認能跑）
6. 部署完按 **「Continue to project」** / **「View code」** 進 Worker 詳細頁

---

## Step 2：綁定 Workers AI 給 Worker（2 分鐘）⭐ 最關鍵

讓 Worker 內部能呼叫 AI 模型（MeloTTS）。這步對應 BroTrip 那次綁 KV，只是這次綁的是 **Workers AI**。

1. 在 Worker 詳細頁 → **Settings**（設定）tab
2. 找到 **「Bindings」** 區 → 按 **「+ Add」** / **「Add binding」**
3. Type（類型）選 **「Workers AI」**
4. **Variable name**：輸入 `AI`（**全大寫兩個字母，一字不差**）
   - ⚠️ 超關鍵：code 內就靠 `env.AI` 找模型。名字不是 `AI` 就會報錯
5. 按 **Save / Deploy**
6. 看到 Bindings 區出現一筆 `AI → Workers AI` 就 OK

---

## Step 3：貼 Worker code（3 分鐘）

1. 在 Worker 詳細頁 → 按 **「Edit code」**（藍色按鈕）→ 進線上 editor（開新 tab）
2. 左邊看到預設檔 `worker.js`（Hello World 內容）
3. **點 editor → Ctrl+A 全選 → Delete 全部刪掉**
4. 打開這個資料夾的 [worker.js](./worker.js)，**整段複製 → 貼進 editor**
5. 按右上 **「Deploy」**
6. 等綠色 ✅（約 10 秒）

---

## Step 4：驗證部署成功（2 分鐘）

開瀏覽器（手機/電腦都行）貼這個網址：

```
https://hangul-tts.madeintw80.workers.dev/?text=안녕하세요
```

- ✅ **成功**：瀏覽器會**下載或播放一個 MP3**（聽到「안녕하세요」就成功了！）
- ❌ 看到「TTS 失敗」+ 一段文字 → 多半是 lang 代碼問題，把錯誤訊息截圖給 Wei，改一個字重部署即可
- ❌ 看到「Worker threw exception」/ 1101 → AI binding 沒綁好，回 Step 2 確認變數名是 `AI`

---

## Step 5：把 URL 給 Wei

把 base URL（**去掉 `/?text=...`**）給我：

```
https://hangul-tts.madeintw80.workers.dev
```

我會把 App 的發音改成走這支 Worker（同時保留系統 Yuna 當備援）+ 加「同句快取」省額度，然後 push。完成！

---

## 🆘 卡住

| 問題 | 解法 |
|------|------|
| 找不到 Workers & Pages | 左側 **Build → Compute** 分類底下 |
| Bindings 區找不到 Workers AI 選項 | 截圖給 Wei；有些介面在「Variables and Secrets」附近 |
| 要我填信用卡 | **不要填**！Workers Free + Workers AI Free 純註冊不需卡，你不小心進到付費頁了 |
| Deploy 紅字錯誤 | code 沒整段貼乾淨，確認 100% 等於 worker.js、開頭是 `export default {` |
| `/?text=` 沒聲音只下載檔 | 正常！下載的就是 MP3，用播放器打開能聽。能下載=成功 |

---

## 💰 費用

- Workers Free：每天 **100k requests**
- Workers AI Free：每天有免費 neuron 額度，學韓文點幾下根本碰不到
- MeloTTS：$0.0002/分鐘音檔（學習用幾乎 = 0）
- 真的超量 = bug 或被攻擊，告訴 Wei 立刻處理
