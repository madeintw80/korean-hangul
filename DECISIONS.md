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
| 2026-07-16 | PM 授權直接 push v2.5.0 | 授權範圍為 GitHub `main` 與其 GitHub Pages 自動發布；Worker 無變更不重部署 | PM |
| 2026-07-16 | v2.5.0 公開驗收通過 | 首頁、9 首 NMIXX、139 段 manifest、417 個 MP3、四類圖示與三聲線新 MP3 抽驗皆正常 | Echo（驗收結果） |
| 2026-07-22 | v3 改為約 60 分鐘的 40 音順序課程，原功能收進工具箱 | PM 看參考影片一小時學會 40 音，希望 App 從自由探索擴充成能帶著學完的課程 | PM |
| 2026-07-22 | 課程新增母子組合表與對應測驗 | 只分開背母音、子音仍不足以建立看到新字就能拼讀的能力 | PM |
| 2026-07-22 | ㅎ 放在「送氣音與 ㅎ」，ㄴ／ㅁ／ㅇ／ㄹ 合併為「鼻音／流音」 | 依 PM 希望的聲音家族教學順序整理；避免把 ㅎ 誤講成其他字母的正式送氣對應 | PM＋Echo |
| 2026-07-22 | 收尾音獨立成章：27 種寫法先歸納為 7 種代表音，再分開教鼻音／流音收尾與 11 個複合收尾 | 先讓初學者抓住真正需要分辨的收尾聲音，再逐步補寫法 | PM＋Echo |
| 2026-07-22 | v3 保留既有女團、歌詞、拼字與字母測驗，改放工具箱 | 課程負責帶路，原有自由練習與 K-pop 獎勵不需要犧牲 | PM＋Echo |
| 2026-07-22 | v3.0.0-preview 先只做本機版本，不 push／deploy | PM 要先看實際畫面再決定是否大改或發布 | PM |
| 2026-07-22 | 課程測驗移除組字，只保留拆字、聽音、收尾；三種題目都必須朗讀 | 組字只是在四個明顯選項中找答案，辨識成本太低；保留需要拆解、聽辨與收尾歸納的題型 | PM |
| 2026-07-22 | 工具箱改為「K-pop 實戰」，只保留女團拼讀與歌詞拼音 | 母音、子音、收尾、自由拼字、舊字母測驗都已與新主流程重複，入口過多反而模糊學習路徑 | PM |
| 2026-07-22 | PM 授權 push／deploy v3.0.2-preview | 授權範圍為 GitHub `main` 與 GitHub Pages 自動發布；Cloudflare Worker 無變更、不重部署 | PM |
| 2026-07-22 | v3.0.2-preview 公開驗收通過 | 三種朗讀測驗各四個不同選項且可重播；K-pop 僅女團／歌詞兩頁；舊 PWA 更新流程通過；乾淨頁面 console error／warning 0 | Echo（驗收結果） |
| 2026-07-22 | 新增連音＋基礎音變教材與第四種全朗讀測驗 | PM 希望學完收尾音後，能練實際口語中的連音、鼻音化、緊音化、送氣化與口蓋音化 | PM＋Echo |
| 2026-07-22 | 固定教材內容與三套離線語音必須同批更新 | 只新增文字會讓 Sarah／Olivia／Emily 漏音並落到不一致的裝置聲線；往後 MP3、manifest、核心快取與覆蓋測試均為完成條件 | PM＋Echo |
| 2026-07-22 | v3.1.0-preview 僅做本機版本，不自行 push／deploy | 本回合沒有新的公開發布授權；先讓 PM 本機驗收 | Echo（權限邊界） |
| 2026-07-22 | PM 授權 push／deploy v3.1.0-preview | 授權範圍為 GitHub `main` 與 GitHub Pages 自動發布；Cloudflare Worker 無變更、不重部署 | PM |
| 2026-07-22 | v3.1.0-preview 公開驗收通過 | 首頁顯示 PUBLIC PREVIEW；manifest 為 154 段／462 個 MP3／207 個核心檔；三套新音變語音皆 HTTP 200 | Echo（驗收結果） |
| 2026-07-24 | 收尾音篇改為「七個單收音獨立發音＋例字」，再教 11 個雙收音 | PM 指定參考三支教學影片，要求不能只有例字，並補齊雙收音規則 | PM |
| 2026-07-24 | 雙收音分成字尾／子音前、母音前連音與兩個高頻例外 | 依韓國國立國語院標準發音法第 10、11、13、14 條整理，讓初學者先看後方音節再判斷 | PM＋Echo |
| 2026-07-24 | v3.2.0-preview 先完成本機版本，不自行 push／deploy | 本回合只授權教材更新，沒有新的公開發布授權 | Echo（權限邊界） |

## 待 PM 決定

- PM 驗收 v3.2.0-preview 後，再決定是否 push／deploy。
