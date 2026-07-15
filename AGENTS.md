# AGENTS — korean-hangul 協作規則

本 repo 是 **Batnini × Echo 雙腦協作專案**。最高規則見 `C:/Users/User/agent-workspace/brain/PROTOCOL.md`。

## 動態主導

- PM 把工作交給哪一邊，哪一邊就是該回合 Task Lead；另一邊為 Support／Reviewer。
- 同一時間只允許一位 agent 修改；接手前先讀 `PROJECT.md → CHECKPOINT.md → TASKS.md → DECISIONS.md`，再查 `git status` 與 `git log -5`。
- 發現 working tree 有不明變更、對方仍 `in_progress` 或 merge conflict，立即停手回報 PM。

## 收尾

- 更新 CHECKPOINT、TASKS 與必要的 DECISIONS，記錄測試結果，建立清楚 commit。
- Push、GitHub Pages 發布與其他對外動作需 PM 授權；2026-07-15 的 A 版 UI 任務已獲 PM 明確授權修改與 push。
- 機密禁止入 repo；不得讀取 `.env`、`auth.json`、token、密碼或 secrets 類檔案。
- 不 force push、不改寫歷史、不任意更換既有 vanilla JS PWA 架構。

## 專案慣例

- 使用 vanilla HTML／CSS／JavaScript，無 build step。
- 每次改版同步更新 `sw.js` CACHE 與 `index.html` footer 版本。
- UI 變更必測 390×844 與 1280×720、鍵盤操作、七個 tab、TTS、測驗、歌詞與離線資源。
- 程式碼註解以簡短繁體中文說明「為什麼」。
