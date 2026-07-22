# TASKS — korean-hangul

## In progress

- PM 本機審閱 v3.0.2-preview 課程版；尚未 push／deploy。

## Todo（依優先順序）

1. [ ] PM 依本機預覽決定 v3 要調整、保留或授權公開發布。
2. [ ] PM 在 iPhone 更新目前公開的 v2.5.0 PWA；若仍顯示舊圖示，移除舊主畫面捷徑再重新加入。

## Done

- [x] PM 選定 A 版視覺方向。
- [x] Echo 建立完整互動 prototype 並通過 build／responsive 檢查。
- [x] Echo 將 A 版整合至 vanilla JS PWA，保留既有功能。
- [x] Echo 完成手機／桌面、測驗、拼字、PWA 靜態檢查與無障礙補強。
- [x] Echo commit `63836d4`、push `main` 並驗證 GitHub Pages v2.1.0 已公開。
- [x] Batnini 已把 korean-hangul 更新為 ✅ dual-agent，`brain/BRAIN.md` 可查。
- [x] Echo 改善裝置最佳聲線排序、1.00x 自然語速與完整句試聽。
- [x] Echo 全面修正台灣注音近似規則與 ㅢ 標準發音，新增 3,192 組合回歸測試。
- [x] Echo 建立功能 commit `555a0de`；未 push。
- [x] Echo 將 Cloudflare Worker 改接免費 Gemini 3.1 Flash TTS，加入 WAV、語速指令與安全 fallback。
- [x] Echo 新增 Worker mock 測試並建立本機 commit `bf28d38`；未部署、未 push。
- [x] Echo 建立獨立 AI Studio Free project／API key，解除 Cloud Billing 連結並確認 Free tier。
- [x] Echo 將 key 存為 Cloudflare `GEMINI_API_KEY` encrypted secret，部署 Worker v2.3.0。
- [x] 線上健康檢查與完整韓文 WAV 測試通過：Gemini provider、24 kHz、4.44 秒。
- [x] Echo push `main` 並驗證公開 GitHub Pages 為 v2.3.0、HTTP 200、Gemini 標示已上線。
- [x] PM 決定 Sarah／Olivia／Emily 三個免費聲線全部上架。
- [x] Echo 產生 134 段固定教材 × 3 聲線，共 402 個 44.1 kHz mono MP3。
- [x] Echo 將內建聲線改為預設，Gemini 降為每日限額的自由句選用模式。
- [x] PM 明確授權 push v2.4.0。
- [x] Echo push `main`，驗證 GitHub Pages v2.4.0、manifest 與三聲線 MP3 皆 HTTP 200。
- [x] Echo 新增 4 首 NMIXX、每首 2 句，共 8 句教材；NMIXX 內建歌曲增至 9 首。
- [x] Echo 移除 3 句全英文歌詞與 9 個對應 MP3，並加入「內建歌詞必須含韓文」回歸測試。
- [x] Echo 完成 editorial 客製 PWA／Apple／favicon／maskable 圖示與 v2.5.0 本機驗收；未 push。
- [x] PM 明確授權直接 push v2.5.0。
- [x] Echo push `main`，驗證 GitHub Pages v2.5.0、9 首 NMIXX、圖示與三聲線新 MP3 皆正常。
- [x] Echo 完成 v3.0.0-preview：九關 40 音、399 母子組合、七種代表收尾音、鼻音／流音收尾章節與本機進度。
- [x] Echo 依 PM 回饋移除簡單的組字測驗；拆字、聽音、收尾三種題型全部自動朗讀並可重播，版本更新為 v3.0.1-preview。
- [x] PM 拍板工具箱只保留女團與歌詞拼音；Echo 將七頁工具箱收斂成兩頁「K-pop 實戰」，移除五個重複入口及其初始化接線。
- [x] Echo 修正拆字干擾項重複問題，確保每題固定四個不同選項；版本更新為 v3.0.2-preview。
- [x] Echo 完成 v3 桌機／手機 Browser smoke、既有工具箱七頁回歸與完整自動測試；僅本機、未 push／deploy。

## Backlog / 之後再說

- 依實際使用回饋評估錯題複習與自適應出題；目前只做本機弱點計數。
- 收集 PM 的 iPhone 實機試聽回饋，再決定是否更換 Gemini 預設 voice（目前 `Kore`）。
