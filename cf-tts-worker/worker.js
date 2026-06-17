/* =====================================================================
   Cloudflare Worker — 韓文真人語音「中轉站」
   ---------------------------------------------------------------------
   作用：前端網頁把要唸的韓文丟過來，這支 Worker 呼叫 Cloudflare
        Workers AI 的 MeloTTS 模型，回傳 MP3 音檔。
   為什麼要這支：金鑰 / AI 權限藏在 Cloudflare 內部（env.AI binding），
        不會外露到前端原始碼，安全。
   ---------------------------------------------------------------------
   用法（前端）：GET https://<你的worker網址>/?text=안녕하세요
   回傳：audio/mpeg（MP3 音檔）
   ===================================================================== */

export default {
  async fetch(request, env) {
    // ---- CORS：允許 GitHub Pages 的前端跨網域呼叫這支 Worker ----
    const cors = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };
    // 瀏覽器送出正式請求前會先送一個 OPTIONS「預檢」，直接放行
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: cors });
    }

    // ---- 取出要唸的文字 ----
    const url = new URL(request.url);
    const text = url.searchParams.get('text');
    // 韓文語言代碼：先用 'ko'。若部署後沒聲音，改成 'kr' 或 'KR' 再部署一次
    const lang = url.searchParams.get('lang') || 'ko';

    if (!text) {
      return new Response('缺少 text 參數', { status: 400, headers: cors });
    }

    try {
      // ---- 呼叫 MeloTTS，拿到 base64 編碼的 MP3 ----
      const res = await env.AI.run('@cf/myshell-ai/melotts', {
        prompt: text,
        lang: lang,
      });

      // base64 字串 → 二進位 bytes（瀏覽器才能當音檔播）
      const binary = Uint8Array.from(atob(res.audio), (c) => c.charCodeAt(0));

      return new Response(binary, {
        headers: {
          ...cors,
          'Content-Type': 'audio/mpeg',
          // 讓瀏覽器把同一句的音檔快取一天，少打 API、省額度
          'Cache-Control': 'public, max-age=86400',
        },
      });
    } catch (err) {
      // 出錯就回 500 + 原因，方便除錯
      return new Response('TTS 失敗：' + (err && err.message ? err.message : err), {
        status: 500,
        headers: cors,
      });
    }
  },
};
