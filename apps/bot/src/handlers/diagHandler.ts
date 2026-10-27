import type { Env } from '../worker.js';
import { SettingsManager } from '@hex-aim/core';

export async function handleDiagRoutes(url: URL, env: Env): Promise<Response | null> {
  const settings = SettingsManager.getInstance();
  const routing = settings.getOpenRouterRoutingConfig();

  const diagOpenRouterRoute = settings.get<string>('routes.diag.openrouter', '/diag/openrouter');
  const diagOpenRouterCostRoute = settings.get<string>('routes.diag.openrouter_cost', '/diag/openrouter-cost');

  if (url.pathname === diagOpenRouterRoute) {
    const apiKey = env.OPENROUTER_API_KEY || settings.get<string>('ai.openrouter.api_key', settings.get<string>('OPENROUTER_API_KEY', ''));
    const model = env.OPENROUTER_VISION_MODEL || routing.primaryModel;

    if (!apiKey) {
      settings.logLoudFailure('handleDiagRoutes:openrouter', model, 'OPENROUTER_API_KEY is not configured in worker environment');
      return new Response(JSON.stringify({ ok: false, error: 'OPENROUTER_API_KEY is not configured in Centralized Settings Registry' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    try {
      const pingRes = await fetch(routing.chatEndpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': routing.httpReferer,
          'X-Title': routing.appTitle,
        },
        body: JSON.stringify({
          model,
          provider: {
            order: routing.providerOrder,
            ignore: routing.providerIgnore,
            allow_fallbacks: routing.allowFallbacks,
          },
          messages: [{ role: 'user', content: 'Reply with exact text: OPENROUTER_ONLINE' }],
          max_tokens: 10,
        }),
        signal: AbortSignal.timeout(routing.pingTimeoutMs),
      });

      if (!pingRes.ok) {
        const errText = await pingRes.text();
        settings.logLoudFailure('handleDiagRoutes:openrouter', model, `HTTP ${pingRes.status}: ${errText}`);
        return new Response(JSON.stringify({ ok: false, status: pingRes.status, error: errText, model }), {
          status: pingRes.status,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const pingData = await pingRes.json() as any;
      return new Response(JSON.stringify({
        ok: true,
        status: pingRes.status,
        model,
        provider: pingData?.provider || 'Google (Vertex)',
        response: pingData?.choices?.[0]?.message?.content || pingData,
        timestamp: new Date().toISOString(),
      }), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (err: any) {
      settings.logLoudFailure('handleDiagRoutes:openrouter', model, err);
      return new Response(JSON.stringify({ ok: false, error: err?.message || String(err), model }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  if (url.pathname === diagOpenRouterCostRoute) {
    const apiKey = env.OPENROUTER_API_KEY || settings.get<string>('ai.openrouter.api_key', settings.get<string>('OPENROUTER_API_KEY', ''));
    if (!apiKey) {
      return new Response(JSON.stringify({ ok: false, error: 'OPENROUTER_API_KEY is not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    try {
      const keyRes = await fetch(routing.authKeyEndpoint, {
        headers: { 'Authorization': `Bearer ${apiKey}` },
        signal: AbortSignal.timeout(routing.pingTimeoutMs),
      });
      const keyData = await keyRes.json();
      return new Response(JSON.stringify(keyData), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (err: any) {
      settings.logLoudFailure('handleDiagRoutes:cost', 'auth/key', err);
      return new Response(JSON.stringify({ ok: false, error: err?.message || String(err) }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  return null;
}
