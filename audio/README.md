# 內建韓文語音

本資料夾收錄 korean-hangul v3.1.0-preview 的固定教材音檔，讓母音、子音、收尾音、音變、團名、常用句與既有歌詞不必逐次呼叫雲端 TTS。

目前共有 154 段固定教材、三套聲線，共 462 個 MP3；其中 15 個音變例字的 45 個音檔已列入 PWA 核心離線快取。

- 產生工具：Supertonic 3 / `supertonic` Python package 1.3.1
- 官方專案：https://github.com/supertone-inc/supertonic
- 模型：https://huggingface.co/Supertone/supertonic-3
- 聲線：Sarah = F1、Olivia = F4、Emily = F5
- 格式：44.1 kHz mono MP3
- 授權：程式碼 MIT；模型依官方 Model Card 的 OpenRAIL-M。repo 不包含模型權重，只包含本 App 的產生音檔。

`manifest.js` 是 App 與 Service Worker 的音檔 SSOT；新增或修改任何固定教材文字時，必須在同一批變更中更新 Sarah／Olivia／Emily 三套 MP3、manifest 與核心離線快取，並執行 `node audio-assets.test.mjs`。不得用裝置聲線 fallback 代替固定教材的正式音檔。
