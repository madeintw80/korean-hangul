/* =====================================================================
   Cloudflare Worker — 韓文 Gemini 真人語音中轉站
   ---------------------------------------------------------------------
   - Gemini API key 只放在 Cloudflare secret：GEMINI_API_KEY
   - 回傳 iPhone Safari / Web Audio 可解碼的 24 kHz mono WAV
   - 免費額度或網路失敗時，前端會自動退回裝置韓文聲線
   ===================================================================== */

const MODEL = 'gemini-3.1-flash-tts-preview';
const VOICE = 'Kore';
const MAX_TEXT_LENGTH = 300;
const SAMPLE_RATE = 24000;

function isAllowedOrigin(origin) {
  if (!origin) return true; // 允許直接開測試網址。
  return origin === 'https://madeintw80.github.io'
    || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
}

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': origin || 'https://madeintw80.github.io',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Expose-Headers': 'X-TTS-Provider',
    Vary: 'Origin',
  };
}

function textResponse(message, status, cors) {
  return new Response(message, {
    status,
    headers: { ...cors, 'Content-Type': 'text/plain; charset=utf-8' },
  });
}

function clampRate(raw) {
  const value = Number(raw);
  return Number.isFinite(value) ? Math.min(1.2, Math.max(0.5, value)) : 1;
}

function rateDirection(rate) {
  if (rate <= 0.7) return '아주 천천히, 음절을 또렷하게 구분하되 자연스러운 높낮이를 유지하세요.';
  if (rate < 0.95) return '조금 천천히, 학습자가 따라 하기 좋은 속도로 읽으세요.';
  if (rate > 1.05) return '조금 빠르고 경쾌한 일상 대화 속도로 읽으세요.';
  return '평소의 자연스러운 일상 대화 속도로 읽으세요.';
}

function makePrompt(text, rate) {
  return [
    '# AUDIO PROFILE',
    '따뜻하고 친근한 한국인 발음 선생님. 자연스러운 한국 표준어를 사용합니다.',
    '# DIRECTOR NOTES',
    rateDirection(rate),
    '기계적으로 한 글자씩 끊지 말고 실제 대화처럼 자연스럽게 연결하세요.',
    '설명, 번역, 인사말 또는 다른 문장을 추가하지 마세요.',
    '# TRANSCRIPT',
    text,
  ].join('\n');
}

function pcmToWav(pcm, sampleRate = SAMPLE_RATE) {
  const wav = new ArrayBuffer(44 + pcm.length);
  const view = new DataView(wav);
  const writeAscii = (offset, value) => {
    for (let i = 0; i < value.length; i += 1) view.setUint8(offset + i, value.charCodeAt(i));
  };

  writeAscii(0, 'RIFF');
  view.setUint32(4, 36 + pcm.length, true);
  writeAscii(8, 'WAVE');
  writeAscii(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeAscii(36, 'data');
  view.setUint32(40, pcm.length, true);
  new Uint8Array(wav, 44).set(pcm);
  return wav;
}

function decodeBase64(value) {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const allowedOrigin = isAllowedOrigin(origin);
    const cors = corsHeaders(allowedOrigin ? origin : '');

    if (!allowedOrigin) return textResponse('不允許的來源', 403, cors);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (request.method !== 'GET') return textResponse('只接受 GET', 405, cors);

    const url = new URL(request.url);
    if (url.searchParams.get('health') === '1') {
      return new Response(JSON.stringify({ ok: true, provider: MODEL, keyReady: Boolean(env.GEMINI_API_KEY) }), {
        headers: { ...cors, 'Content-Type': 'application/json; charset=utf-8' },
      });
    }

    const text = (url.searchParams.get('text') || '').trim();
    const rate = clampRate(url.searchParams.get('rate'));
    if (!text) return textResponse('缺少 text 參數', 400, cors);
    if (text.length > MAX_TEXT_LENGTH) return textResponse(`文字不可超過 ${MAX_TEXT_LENGTH} 字`, 413, cors);
    if (!env.GEMINI_API_KEY) return textResponse('雲端語音尚未完成設定', 503, cors);

    try {
      const apiResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': env.GEMINI_API_KEY,
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: makePrompt(text, rate) }] }],
            generationConfig: {
              responseModalities: ['AUDIO'],
              speechConfig: {
                voiceConfig: { prebuiltVoiceConfig: { voiceName: VOICE } },
              },
            },
          }),
        },
      );

      if (!apiResponse.ok) return textResponse('雲端語音暫時忙碌', 503, cors);

      const payload = await apiResponse.json();
      const parts = payload.candidates?.[0]?.content?.parts || [];
      const audioPart = parts.find((part) => part.inlineData?.data);
      if (!audioPart) return textResponse('雲端語音沒有回傳音訊', 502, cors);

      const wav = pcmToWav(decodeBase64(audioPart.inlineData.data));
      return new Response(wav, {
        headers: {
          ...cors,
          'Content-Type': 'audio/wav',
          'Content-Length': String(wav.byteLength),
          'Cache-Control': 'private, max-age=86400',
          'X-TTS-Provider': MODEL,
        },
      });
    } catch (_error) {
      return textResponse('雲端語音暫時無法使用', 503, cors);
    }
  },
};
