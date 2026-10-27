import type { Env } from '../worker.js';
import { SettingsManager } from '@hex-aim/core';

export async function handleDiagRoutes(url: URL, env: Env): Promise<Response | null> {
  const settings = SettingsManager.getInstance();

  if (url.pathname === '/diag/openrouter') {
    const apiKey = env.OPENROUTER_API_KEY || settings.get<string>('OPENROUTER_API_KEY', '');
    const model = env.OPENROUTER_VISION_MODEL || settings.get<string>('OPENROUTER_VISION_MODEL', 'google/gemini-3.5-flash-lite');
    if (!apiKey) {
      return new Response(JSON.stringify({ ok: false, error: 'OPENROUTER_API_KEY is not configured in worker environment' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    try {
      const pingRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://aim.getvintel.com',
          'X-Title': 'HEX-AIM Diagnostics',
        },
        body: JSON.stringify({
          model,
          provider: {
            order: ['Google'],
            ignore: ['Google AI Studio'],
            allow_fallbacks: false,
          },
          messages: [{ role: 'user', content: 'Reply with exact text: OPENROUTER_ONLINE' }],
          max_tokens: 10,
        }),
        signal: AbortSignal.timeout(15000),
      });
      const pingData = await pingRes.json() as any;
      return new Response(JSON.stringify({
        ok: pingRes.ok,
        status: pingRes.status,
        model,
        provider: pingData?.provider || 'Google (Vertex)',
        response: pingData?.choices?.[0]?.message?.content || pingData,
        timestamp: new Date().toISOString(),
      }), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (err: any) {
      return new Response(JSON.stringify({ ok: false, error: err?.message || String(err) }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  if (url.pathname === '/diag/openrouter-cost') {
    const apiKey = env.OPENROUTER_API_KEY || settings.get<string>('OPENROUTER_API_KEY', '');
    if (!apiKey) {
      return new Response(JSON.stringify({ ok: false, error: 'OPENROUTER_API_KEY is not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    try {
      const keyRes = await fetch('https://openrouter.ai/api/v1/auth/key', {
        headers: { 'Authorization': `Bearer ${apiKey}` },
        signal: AbortSignal.timeout(10000),
      });
      const keyData = await keyRes.json();
      return new Response(JSON.stringify(keyData), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (err: any) {
      return new Response(JSON.stringify({ ok: false, error: err?.message || String(err) }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  return null;
}
