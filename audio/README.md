# 內建韓文語音

本資料夾收錄 korean-hangul v2.5.0 的固定教材音檔，讓母音、子音、收尾音、團名、常用句與既有歌詞不必逐次呼叫雲端 TTS。

目前共有 139 段固定教材、三套聲線，共 417 個 MP3。

- 產生工具：Supertonic 3 / `supertonic` Python package 1.3.1
- 官方專案：https://github.com/supertone-inc/supertonic
- 模型：https://huggingface.co/Supertone/supertonic-3
- 聲線：Sarah = F1、Olivia = F4、Emily = F5
- 格式：44.1 kHz mono MP3
- 授權：程式碼 MIT；模型依官方 Model Card 的 OpenRAIL-M。repo 不包含模型權重，只包含本 App 的產生音檔。

`manifest.js` 是 App 與 Service Worker 的音檔 SSOT；修改教材文字或聲線後必須重新產生並執行 `node audio-assets.test.mjs`。
