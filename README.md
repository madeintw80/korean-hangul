# 한글 Studio — 60 分鐘韓文速通＋K-pop 練習

vanilla JS PWA（無框架、無 build step），固定教材預設使用三套內建 Supertonic 3 韓文女聲；
自由句可手動切換 Gemini，無音檔或雲端不可用時再用 Web Speech API。

**公開 Demo（目前 v3.0.2-preview）**：https://madeintw80.github.io/korean-hangul/

> v3.0.2-preview 已發布至 GitHub Pages；舊版 PWA 使用者看到更新提示時，按「立即更新」即可切換。
>
> v3.1.0-preview 已在本機加入連音＋基礎音變教材與全朗讀測驗，尚未 push／發布。

## 功能

- **60 分鐘 40 音課程**：九關依序學字塊、鬆音、緊音、送氣音與 ㅎ、鼻音／流音、基本／Y／複合母音，並保留學習進度
- **母子組合表**：可依學習階段篩選，也能展開 19 子音 × 21 母音共 399 個音節；點格子或整列播放
- **收尾音課程**：先理解 27 種寫法歸到 7 種代表音，再分開練 ㄴ／ㅁ／ㅇ 鼻音與 ㄹ 流音，並預覽 11 個複合收尾
- **連音＋基礎音變**：用 15 組例字練連音、鼻音化、緊音化、送氣化與口蓋音化，可聽標準速度、慢速與整組比較
- **四種朗讀測驗**：拆字、聽音、收尾、音變；每題自動念一次並可重播，錯題會記入本機弱點紀錄
- **女團拼讀**：aespa / NMIXX / ITZY… 團名 + 追星常用語
- **歌詞學習**：副歌逐字跟讀 + 發音變化引擎（連音/鼻音化/緊音化…自動標「實際唸法」），
  也可以貼任何韓文歌詞自動拆解
- **台灣注音輔助**：以韓國標準發音後的音節產生近似提示；清楚標出緊音與不爆破收尾，
  並提醒 ㅓ／ㅡ／ㅢ 等華語沒有精準對應的音仍要以韓文聲音與口型為準
- **三套內建自然女聲**：Sarah／Olivia／Emily 可切換；154 段固定教材共 462 個 MP3，包含 15 個音變例字
  不受 Gemini 每分鐘／每日限額影響
- **自由句雲端備援**：需要合成教材外的新句子時可手動切 Gemini；失敗會改用裝置聲線

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
- v2.4.0 起改以 Sarah／Olivia／Emily 內建音檔為預設；Gemini 降為自由句選用模式。
- v2.5.0 新增四首、共八句 NMIXX 教材；內建歌詞只保留含韓文的句子，並換成 editorial 風格的客製 PWA／Apple／maskable 圖示。
- v3.0.0-preview 改為課程優先首頁，新增九關 40 音、完整母子組合表、七種收尾音章節與本機進度；原有功能完整保留在工具箱。
- v3.0.1-preview 移除過於簡單的組字題，只留拆字、聽音、收尾；三種題目都會自動朗讀並提供重播。重複的七頁工具箱同步收斂成只含女團拼讀與歌詞拼音的「K-pop 實戰」。
- v3.0.2-preview 保證拆字題每次都有四個不同選項，避免隨機重複讓題目退化成二選一。
- v3.1.0-preview 新增獨立音變學習區，以連音為起點串接四組常見基礎音變，並加入「聽原字、選實際念法」的第四種測驗。
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
- 三聲線音檔覆蓋：`node audio-assets.test.mjs`
- PWA 圖示／manifest：`node pwa-assets.test.mjs`
- v3 課程資料與接線：`node course.test.mjs`
