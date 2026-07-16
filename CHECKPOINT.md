# CHECKPOINT

Updated: 2026-07-16T13:36:12+08:00
Task Lead: Echo
Status: ready_for_review
Branch: main
Last verified implementation commit: pending
Last published commit: 5f655a2

## PM requested

- NMIXX 歌詞教材再多一些。
- 每首新增歌曲不要只有一句，改成兩句。
- 完全沒有韓文字的整句英文歌詞不放；韓文夾少量英文可以保留。
- 客製目前偏醜的 PWA 主畫面小圖。

## Completed locally

- NMIXX 新增 `Love Me Like This`、`Soñar (Breaker)`、`별별별 (See that?)`、`KNOW ABOUT ME`，每首兩句，共八句。
- NMIXX 內建歌曲由 5 首增至 9 首。
- 移除 3 句全英文內建歌詞；新增測試，要求所有內建歌詞至少含一個韓文字。
- 固定教材更新為 139 段 × Sarah／Olivia／Emily 三聲線，共 417 個 MP3；同步移除 9 個不再使用的英文句音檔。
- PWA 圖示改成符合 App 黑／乳白／電光粉 editorial 視覺的客製「한」圖示，補齊 favicon、Apple touch、192、512 與獨立 maskable 版本。
- `manifest.json`、`index.html`、Service Worker 快取與測試已同步；版本更新為 v2.5.0／`hangul-v2.5.0`。

## Verification

- `node --check app.js`、`node --check sw.js`：PASS。
- `pronunciation.test.js`：21 母音、19 子音、11 組變音、15 組注音與 3,192 組合 PASS。
- `audio-assets.test.mjs`：139 段 × 3 聲線 = 417 個 MP3；新 NMIXX 句、檔案與「禁止全英文內建句」規則 PASS。
- `pwa-assets.test.mjs`：favicon、Apple touch、PWA any 與 maskable 圖示接線 PASS。
- `cf-tts-worker/worker.test.mjs`：PASS。
- Browser 390×844：七個 tab 均可切換；4 首新增 NMIXX 歌曲各顯示 2 張句卡；新增句離線整句播放成功。
- Browser 1280×720：頁寬 1265、小於 viewport 1280，無水平溢出；console error／warning 0。

## Current state

- v2.5.0 功能已在隔離工作副本完成並通過驗收，等待寫入正式 repo 與最後文件收據。
- 公開 GitHub Pages 仍是 v2.4.0；本回合沒有 push 或部署授權，因此不會對外發布。

## Decisions and assumptions

- 新增歌曲每首兩個短句，兼顧練習量與畫面長度。
- 內建歌詞至少要含一個韓文字；混合韓英句保留，整句英文排除。
- 圖示沿用既有 editorial 設計系統，以可重現的本機生成器產出，並保留獨立 maskable safe area。
- 新版公開發布需 PM 明確授權，不沿用先前版本的一次性 push 授權。

## Next actions

1. 建立功能 commit，寫入正式 repo，再以第二個文件 commit 留下完成收據。
2. PM 檢視客製圖示與新歌詞；若要公開 v2.5.0，需另行明確確認 push。

## Risks / blockers

- 沒有程式 blocker。
- iPhone 可能保留舊主畫面圖示快取；發布後若未刷新，可能需移除舊捷徑再重新加入。
