# 內建韓文語音

本資料夾收錄 korean-hangul v3.3.2-preview 的固定教材音檔，讓母音、子音、399 格組合表、單／雙收尾音、標準發音、團名、常用句、既有歌詞與逐字跟讀全程使用同一組內建女聲。

目前 manifest 共有 732 段、三套聲線，共 2,196 個 MP3；其中 719 段是 App 真正可點擊的固定內容，全部具備 Sarah／Olivia／Emily。v3.3.2 將測驗與歌詞使用的 511 段短音改為「完整韓文提示句＋目標字」生成，再依停頓裁出目標字，避免孤立音節讓神經 TTS 音色漂移；1,488 個課程核心 MP3 由 PWA 預先快取，歌詞逐字音檔首次使用後 cache-first。

- 產生工具：Supertonic 3 / `supertonic` Python package 1.3.1
- 官方專案：https://github.com/supertone-inc/supertonic
- 模型：https://huggingface.co/Supertone/supertonic-3
- 聲線：Sarah = F1、Olivia = F4、Emily = F5
- 格式：44.1 kHz mono MP3
- 授權：程式碼 MIT；模型依官方 Model Card 的 OpenRAIL-M。repo 不包含模型權重，只包含本 App 的產生音檔。

`manifest.js` 是 App 與 Service Worker 的音檔 SSOT；新增或修改任何固定教材文字時，必須在同一批變更中更新 Sarah／Olivia／Emily 三套 MP3、manifest 與核心離線快取，並執行 `node audio-assets.test.mjs`。測驗音節與歌詞短詞要用韓文語境生成後裁切，並列入 `contextualShortTexts`；不得再直接生成孤立短音，也不得用裝置聲線 fallback 代替任何播放內容。
