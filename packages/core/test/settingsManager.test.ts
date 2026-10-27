import { describe, it, expect, beforeEach } from 'vitest';
import { SettingsManager, DEFAULT_AIM_REGISTRY } from '../src/settings/SettingsManager.js';

describe('SettingsManager - Centralized Single Source of Truth', () => {
  let settings: SettingsManager;

  beforeEach(() => {
    settings = SettingsManager.getInstance();
  });

  it('contains all required canonical keys in the default registry', () => {
    expect(DEFAULT_AIM_REGISTRY['vision.model.primary']).toBe('google/gemini-3.5-flash-lite');
    expect(DEFAULT_AIM_REGISTRY['vision.model.escalation']).toBe('google/gemini-3.8-flash');
    expect(DEFAULT_AIM_REGISTRY['vision.provider.order']).toEqual(['Google']);
    expect(DEFAULT_AIM_REGISTRY['vision.provider.ignore']).toEqual(['Google AI Studio']);
    expect(DEFAULT_AIM_REGISTRY['vision.provider.allow_fallbacks']).toBe(false);
    expect(DEFAULT_AIM_REGISTRY['vision.timeout_ms']).toBe(35000);
    expect(DEFAULT_AIM_REGISTRY['vision.temperature']).toBe(0.1);
    expect(DEFAULT_AIM_REGISTRY['ai.openrouter.chat_endpoint']).toBe('https://openrouter.ai/api/v1/chat/completions');
    expect(DEFAULT_AIM_REGISTRY['intake.debounce.silence_ms']).toBe(5500);
    expect(DEFAULT_AIM_REGISTRY['routes.diag.openrouter']).toBe('/diag/openrouter');
  });

  it('correctly resolves OpenRouter routing configuration through getOpenRouterRoutingConfig', () => {
    const routing = settings.getOpenRouterRoutingConfig();
    expect(routing.primaryModel).toBe('google/gemini-3.5-flash-lite');
    expect(routing.escalationModel).toBe('google/gemini-3.8-flash');
    expect(routing.providerOrder).toEqual(['Google']);
    expect(routing.providerIgnore).toEqual(['Google AI Studio']);
    expect(routing.allowFallbacks).toBe(false);
    expect(routing.timeoutMs).toBe(35000);
    expect(routing.chatEndpoint).toBe('https://openrouter.ai/api/v1/chat/completions');
  });

  it('resolves registered environment variable aliases', () => {
    process.env.OPENROUTER_VISION_MODEL = 'google/gemini-3.5-flash-lite';
    expect(settings.get<string>('vision.model.primary')).toBe('google/gemini-3.5-flash-lite');
    delete process.env.OPENROUTER_VISION_MODEL;
  });

  it('logs loud failure aggressively without silent suppression', () => {
    const errorLogs: string[] = [];
    const origError = console.error;
    console.error = (...args: any[]) => {
      errorLogs.push(args.join(' '));
    };

    try {
      settings.logLoudFailure(
        'UnitTestGateway',
        'google/gemini-3.5-flash-lite',
        new Error('HTTP 429 Rate Limit Exceeded'),
        'google/gemini-3.8-flash'
      );

      expect(errorLogs.length).toBe(1);
      expect(errorLogs[0]).toContain('LOUD FAILURE GATEWAY');
      expect(errorLogs[0]).toContain('google/gemini-3.5-flash-lite');
      expect(errorLogs[0]).toContain('google/gemini-3.8-flash');
      expect(errorLogs[0]).toContain('HTTP 429 Rate Limit Exceeded');
    } finally {
      console.error = origError;
    }
  });
});
