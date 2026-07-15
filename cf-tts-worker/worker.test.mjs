import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const source = await readFile(new URL('./worker.js', import.meta.url), 'utf8');
const moduleUrl = `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`;
const worker = (await import(moduleUrl)).default;

function request(path, options = {}) {
  return new Request(`https://hangul-tts.example${path}`, {
    headers: { Origin: 'https://madeintw80.github.io', ...(options.headers || {}) },
    method: options.method || 'GET',
  });
}

assert.equal((await worker.fetch(request('/?health=1'), {})).status, 200);
assert.equal((await worker.fetch(request('/?text='), {})).status, 400);
assert.equal((await worker.fetch(request(`/?text=${'가'.repeat(301)}`), {})).status, 413);
assert.equal((await worker.fetch(request('/?text=안녕'), {})).status, 503);
assert.equal((await worker.fetch(request('/?text=안녕', { method: 'POST' }), {})).status, 405);
const forbidden = await worker.fetch(request('/?text=안녕', { headers: { Origin: 'https://example.com' } }), {});
assert.equal(forbidden.status, 403);
assert.notEqual(forbidden.headers.get('Access-Control-Allow-Origin'), 'https://example.com');
assert.equal((await worker.fetch(request('/?text=안녕', { method: 'OPTIONS' }), {})).status, 204);

const originalFetch = globalThis.fetch;
let capturedRequest;
globalThis.fetch = async (url, options) => {
  capturedRequest = { url, options };
  const pcm = Buffer.from([0, 0, 10, 0, 246, 255, 0, 0]);
  return new Response(JSON.stringify({
    candidates: [{ content: { parts: [{ inlineData: { data: pcm.toString('base64') } }] } }],
  }), { status: 200, headers: { 'Content-Type': 'application/json' } });
};

try {
  const response = await worker.fetch(request('/?text=안녕하세요&rate=0.6'), { GEMINI_API_KEY: 'test-only' });
  const bytes = new Uint8Array(await response.arrayBuffer());
  const requestBody = JSON.parse(capturedRequest.options.body);

  assert.equal(response.status, 200);
  assert.equal(response.headers.get('Content-Type'), 'audio/wav');
  assert.equal(response.headers.get('X-TTS-Provider'), 'gemini-3.1-flash-tts-preview');
  assert.equal(Buffer.from(bytes.slice(0, 4)).toString(), 'RIFF');
  assert.equal(Buffer.from(bytes.slice(8, 12)).toString(), 'WAVE');
  assert.equal(bytes.length, 52);
  assert.match(capturedRequest.url, /gemini-3\.1-flash-tts-preview:generateContent$/);
  assert.equal(capturedRequest.options.headers['x-goog-api-key'], 'test-only');
  assert.equal(requestBody.generationConfig.speechConfig.voiceConfig.prebuiltVoiceConfig.voiceName, 'Kore');
  assert.match(requestBody.contents[0].parts[0].text, /아주 천천히/);
  assert.match(requestBody.contents[0].parts[0].text, /안녕하세요$/);
} finally {
  globalThis.fetch = originalFetch;
}

console.log('Gemini TTS worker tests passed.');
