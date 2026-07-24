# 內建韓文語音

本資料夾收錄 korean-hangul v3.3.0-preview 的固定教材音檔，讓母音、子音、單／雙收尾音、標準發音、團名、常用句與既有歌詞不必逐次呼叫雲端 TTS。

目前共有 221 段固定教材、三套聲線，共 663 個 MP3；v3.3 新增 39 個標準發音教材詞與 4 個歌曲標準讀音，共 129 個新音檔，均列入 PWA 核心離線快取。核心快取目前共 408 個 MP3。

- 產生工具：Supertonic 3 / `supertonic` Python package 1.3.1
- 官方專案：https://github.com/supertone-inc/supertonic
- 模型：https://huggingface.co/Supertone/supertonic-3
- 聲線：Sarah = F1、Olivia = F4、Emily = F5
- 格式：44.1 kHz mono MP3
- 授權：程式碼 MIT；模型依官方 Model Card 的 OpenRAIL-M。repo 不包含模型權重，只包含本 App 的產生音檔。

`manifest.js` 是 App 與 Service Worker 的音檔 SSOT；新增或修改任何固定教材文字時，必須在同一批變更中更新 Sarah／Olivia／Emily 三套 MP3、manifest 與核心離線快取，並執行 `node audio-assets.test.mjs`。不得用裝置聲線 fallback 代替固定教材的正式音檔。
