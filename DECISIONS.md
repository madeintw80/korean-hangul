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
| 2026-07-15 | v2.3.0 採 Gemini 3.1 Flash TTS Free Tier＋Cloudflare Worker | 韓文支援、iPhone 可播、真人感可用 prompt 控制，且目前 Free Tier 輸入／輸出免費 | PM＋Echo |
| 2026-07-15 | Gemini Pro 訂閱不視為 Gemini API 額度 | Gemini App 訂閱與 Developer API billing tier 分開，避免誤判會由月費吸收 API 成本 | Echo（官方帳務查證） |
| 2026-07-15 | Gemini API project 維持 Free、不綁 Cloud Billing | 超額時寧可 fallback，也不要產生意外帳單 | PM＋Echo |
| 2026-07-15 | API key 只存 Cloudflare encrypted secret | 防止 key 出現在前端、Git 或聊天記錄 | Echo（安全決策） |
| 2026-07-15 | v2.3.0 本機完成後暫不部署／push | 建 key、跨服務傳遞 secret、部署 Worker 與公開發布仍需 PM 明確授權 | Echo（權限邊界） |
| 2026-07-15 | PM 授權 Free key、Cloudflare encrypted secret、Worker deploy 與 push v2.3.0 | 授權範圍明確包含 Google AI Studio、`hangul-tts` 與 GitHub `main` | PM |
| 2026-07-15 | Worker 驗收通過後發布 v2.3.0 | 健康端點與實際韓文 WAV 均確認 Gemini provider、24 kHz 與完整長度 | Echo（驗收結果） |

## 待 PM 決定

- iPhone 實機試聽後，是否保留 Gemini 預設 voice `Kore`。
