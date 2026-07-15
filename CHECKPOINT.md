# CHECKPOINT

Updated: 2026-07-15T13:16:00+08:00
Task Lead: Echo
Status: complete
Branch: main
Last verified implementation commit: 555a0de

## PM requested

- 改善韓文語音的真人感。
- 全面檢查並修正台灣注音輔助，參考權威韓語發音資料與實際教學用法。

## Completed

- 已確認 Cloudflare MeloTTS 整句輸出仍被截斷，暫不可重新啟用。
- 裝置聲線改為 Natural／Neural／Premium 優先，其次 Google；整句預設改為 `1.00x`，新增完整句試聽鍵。
- 注音修正收尾 ㄷ、ㅊ、ㅅ＋ㅟ／ㅢ、`ㄜㄣ／ㄜㄥ` 誤合併，並加入標準發音法第 5 條的 ㅢ 強制讀法。
- 新增 `pronunciation.test.js`，涵蓋 21 母音、19 子音、變音案例、注音案例與 3,192 種組合。
- 已建立功能 commit `555a0de`。

## Current state

- 本機 `main` 已完成 v2.2.0 語音／注音改善；尚未 push，公開站仍是 v2.1.0。

## Verification

- 前置基準：Chrome 顯示 `Google 한국의`；in-app Browser 無韓文系統 voice，fallback 狀態正確。
- Cloudflare 測試句：`lang=ko` 約 0.85 秒、`lang=KR` 約 0.86 秒，兩者都不足以承載完整句子。
- `node --check app.js`、`pronunciation.test.js`、manifest／SW assets／版本同步／`git diff --check`：PASS。
- Chrome：推薦 `Google 한국의 · 線上`、試聽鍵可觸發、console error/warn 0；無 voice 環境會停用試聽。
- 390×844、1280×720：無水平溢出；桌面維持雙欄。
- 七個 tab、測驗四選一與鎖定、拼字 56 鍵與預設 `가`、貼歌詞三組注音：PASS。

## Decisions and assumptions

- 不搬入 Next/Vinext；正式站維持 vanilla JS PWA。
- 本回合可修改與 commit；未取得新的 push／GitHub Pages 發布授權。
- 注音定位為「台灣初學者近似提示」，韓國標準發音與實際聲音優先。

## Next actions

1. PM 若要公開 v2.2.0，再明確授權 push／GitHub Pages 發布。
2. 若要 iPhone 也固定有高擬真聲線，另行選擇 Google Cloud／Azure 等需金鑰的 TTS 供應商。

## Risks / blockers

- Web Speech 聲線仍依裝置與瀏覽器而異；Chrome 本機有 Google 韓文聲線，iPhone 可能仍只有 Yuna。
- 跨裝置高擬真雲端 TTS 仍需新供應商、金鑰與部署授權。
