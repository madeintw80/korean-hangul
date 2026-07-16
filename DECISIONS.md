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
| 2026-07-15 | Sarah／Olivia／Emily 三個聲線全部放進 App | PM 不想只選一個，希望可以隨時切換 | PM |
| 2026-07-15 | v2.4.0 固定教材改用 Supertonic 3 預生成 MP3 | AI Studio 實際 Free Tier 只有 3 RPM／10 RPD，21 個母音無法靠逐鍵 API 穩定播放 | PM＋Echo |
| 2026-07-15 | Gemini 降為自由句選用模式，內建教材預設不送出文字 | 避免額度用完、改善隱私並確保 iPhone 點按穩定 | Echo（實作決策） |
| 2026-07-15 | v2.4.0 完成本機驗收後仍不自行部署／push | 新版公開發布與 Cloudflare 變更需 PM 另行確認 | Echo（權限邊界） |
| 2026-07-15 | PM 確認 push v2.4.0 | 授權範圍為 GitHub `main` 與其 GitHub Pages 自動發布；Worker 無變更不重部署 | PM |
| 2026-07-15 | v2.4.0 公開驗收通過 | 首頁、134 段 manifest、402 檔清單與三聲線 MP3 抽驗皆 HTTP 200 | Echo（驗收結果） |
| 2026-07-16 | 新增 NMIXX 歌曲每首放兩個短句；整句英文排除，韓英混合句保留 | 增加可練內容，同時讓韓文教學訊號保持清楚 | PM＋Echo |
| 2026-07-16 | PWA 圖示沿用黑／乳白／電光粉 editorial 系統，另做 maskable 安全裁切版 | 與 App 視覺一致，並避免 Android 不同 icon mask 切到主字 | Echo（視覺實作） |
| 2026-07-16 | v2.5.0 本機完成後不自行 push | 本回合只授權內容與圖示修改；公開發布仍需 PM 明確確認 | Echo（權限邊界） |

## 待 PM 決定

- 是否公開發布 v2.5.0。
