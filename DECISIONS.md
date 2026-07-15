# DECISIONS — korean-hangul

| 日期 | 決策 | 理由 / 背景 | 拍板 |
|------|------|-------------|------|
| 2026-07-15 | UI 採 A 版 `K-pop Editorial Studio` | PM 認為黑／乳白／電光粉的高對比雜誌感「很有感覺」 | PM |
| 2026-07-15 | Echo 直接完成正式修改與 push | PM 明確要求由 Echo 直接處理 | PM |
| 2026-07-15 | 保留 vanilla JS PWA，不導入 prototype framework | 降低功能、離線與部署回歸風險 | Echo（實作假設） |
| 2026-07-15 | v2.2.0 不重新啟用 Cloudflare MeloTTS | `ko`／`KR` 的韓文整句都只產生約 0.85 秒音訊，會截斷 | Echo（實測） |
| 2026-07-15 | 零金鑰模式優先 Natural／Neural／Google 聲線，整句預設 1.00x | 過慢的 0.85x 會增加合成感；Chrome 實測可取得 Google 韓文聲線 | Echo（實作決策） |
| 2026-07-15 | 注音明確定位為近似提示，以韓國標準發音與真人音檔優先 | ㅓ／ㅡ／ㅢ、三組塞音與收尾音無法用國語注音一對一表示 | Echo（教學決策） |
| 2026-07-15 | v2.2.0 先完成本機 commit，不 push | 本回合未取得新的對外發布授權 | Echo（權限邊界） |

## 待 PM 決定

- 是否 push v2.2.0 並觸發 GitHub Pages 發布。
- 是否另建需金鑰的跨裝置高擬真雲端 TTS。
