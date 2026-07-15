# 한글 Studio — 用 K-pop 學韓文字母發音

vanilla JS PWA（無框架、無 build step），預設透過 Cloudflare Worker 使用 Gemini 韓文 TTS；
雲端不可用時自動改用瀏覽器內建 Web Speech API。

**Demo**：https://madeintw80.github.io/korean-hangul/

## 功能

- **母音 / 子音 / 收尾音（받침）**：分組字母卡，點卡片就唸（含羅馬拼音 + 注音提示）
- **拼字實驗室**：子音＋母音（＋收尾）即時組字並發音，體驗 한글 組字邏輯
- **聽音測驗**：聽 TTS 猜字母，自動排除同音干擾項（ㅐ/ㅔ、ㅙ/ㅚ/ㅞ 等不會同題出現）
- **女團拼讀**：aespa / NMIXX / ITZY… 團名 + 追星常用語
- **歌詞學習**：副歌逐字跟讀 + 發音變化引擎（連音/鼻音化/緊音化…自動標「實際唸法」），
  也可以貼任何韓文歌詞自動拆解
- **台灣注音輔助**：以韓國標準發音後的音節產生近似提示；清楚標出緊音與不爆破收尾，
  並提醒 ㅓ／ㅡ／ㅢ 等華語沒有精準對應的音仍要以韓文聲音與口型為準
- **跨裝置真人聲線**：Gemini 3.1 Flash TTS 產生自然韓文，iPhone／桌面共用；免費額度或網路
  暫時不可用時自動 fallback，App 不會卡住

## 加到手機主畫面

用 Safari / Chrome 開 Demo 連結 → 分享 → 「加入主畫面」，即可離線使用（PWA）。

## 開發備註

- 改版規則：每次更新需同步調整 `sw.js` 的 `CACHE` 版本與 `index.html` footer 版本號，
  使用者端才會抓到新版
- `generate_icons.py` 是 dev-time 圖示產生工具，與站點執行無關

## UI

- v2.1.0 起採 `K-pop Editorial Studio` 視覺：黑／乳白／電光粉、高對比雜誌排版。
- v2.2.0 起優先選 Natural／Neural／Google 韓文聲線，整句預設 1.00x 自然語速並提供試聽。
- v2.3.0 起以免費 Gemini TTS 作為跨裝置預設，語速由模型自然演繹，避免硬降速造成音高變形。
- 正式站仍是 vanilla JS 靜態 PWA，沒有新增 framework 或 build step。
- 手機以單欄練習為主；桌面改為學習區＋發音控制台雙欄。

## 發音依據

- 實際唸法以韓國國立國語院[《標準發音法》](https://korean.go.kr/kornorms/regltn/regltnView.do?regltn_code=0002)為主，特別是第 5 條 `ㅢ`、第 8～9 條七種收尾代表音。
- 注音只是給台灣初學者的近似入口，不是正式轉寫；遇到 ㅓ／ㅡ／ㅢ、平音／送氣音／緊音，應以韓文聲音與口型為準。
- 舊 Cloudflare MeloTTS 的韓文整句會截斷，v2.3.0 已改接 Gemini；前端會核對 provider，避免誤播舊音訊。

## 雲端語音設定與測試

- API key 只存於 Cloudflare encrypted secret，禁止放進前端或 Git；完整步驟見
  [`cf-tts-worker/SETUP.md`](./cf-tts-worker/SETUP.md)。
- Worker 測試：`node cf-tts-worker/worker.test.mjs`
- 發音／注音回歸：`node pronunciation.test.js`
