# 內建韓文語音

本資料夾收錄 korean-hangul v3.3.1-preview 的固定教材音檔，讓母音、子音、399 格組合表、單／雙收尾音、標準發音、團名、常用句、既有歌詞與逐字跟讀全程使用同一組內建女聲。

目前 manifest 共有 732 段、三套聲線，共 2,196 個 MP3；其中 719 段是 App 真正可點擊的固定內容，全部具備 Sarah／Olivia／Emily。v3.3.1 補上原本會掉到裝置女聲的 511 段，共新增 1,533 個 MP3；1,488 個課程核心 MP3 由 PWA 預先快取，歌詞逐字音檔首次使用後 cache-first。

- 產生工具：Supertonic 3 / `supertonic` Python package 1.3.1
- 官方專案：https://github.com/supertone-inc/supertonic
- 模型：https://huggingface.co/Supertone/supertonic-3
- 聲線：Sarah = F1、Olivia = F4、Emily = F5
- 格式：44.1 kHz mono MP3
- 授權：程式碼 MIT；模型依官方 Model Card 的 OpenRAIL-M。repo 不包含模型權重，只包含本 App 的產生音檔。

`manifest.js` 是 App 與 Service Worker 的音檔 SSOT；新增或修改任何固定教材文字時，必須在同一批變更中更新 Sarah／Olivia／Emily 三套 MP3、manifest 與核心離線快取，並執行 `node audio-assets.test.mjs`。測試會從實際可點擊資料反推完整清單；不得用裝置聲線 fallback 代替任何播放內容。
