import type { IVisionExtractionPort } from '@hex-aim/types';
import { SettingsManager } from '@hex-aim/core';
import { GeminiVisionAdapter } from './GeminiVisionAdapter.js';
import { OpenRouterVisionAdapter } from './OpenRouterVisionAdapter.js';
import { MockVisionAdapter } from './MockVisionAdapter.js';

export class VisionFactory {
  private static cachedInstance: IVisionExtractionPort | null = null;

  public static getVision(forceProvider?: 'openrouter' | 'gemini' | 'mock'): IVisionExtractionPort {
    if (this.cachedInstance && !forceProvider) {
      return this.cachedInstance;
    }

    const settings = SettingsManager.getInstance();
    const provider = forceProvider || settings.get<'openrouter' | 'gemini' | 'mock'>('vision.provider', 'openrouter');
    const openRouterApiKey = settings.get<string>('OPENROUTER_API_KEY', process.env.OPENROUTER_API_KEY || '');
    const geminiApiKey = settings.get<string>('GEMINI_API_KEY', process.env.GEMINI_API_KEY || '');

    // 1. Explicit or auto-detected OpenRouter
    if ((provider === 'openrouter' || (!forceProvider && openRouterApiKey)) && openRouterApiKey) {
      try {
        const adapter = new OpenRouterVisionAdapter({ apiKey: openRouterApiKey });
        this.cachedInstance = adapter;
        return adapter;
      } catch (err) {
        console.error('[VisionFactory] Failed to initialize OpenRouterVisionAdapter:', err);
        throw err; // ZERO SILENT FALLBACK
      }
    }

    // 2. Explicit or auto-detected Gemini
    if ((provider === 'gemini' || (!forceProvider && geminiApiKey)) && geminiApiKey) {
      try {
        const adapter = new GeminiVisionAdapter({ apiKey: geminiApiKey });
        this.cachedInstance = adapter;
        return adapter;
      } catch (err) {
        console.error('[VisionFactory] Failed to initialize GeminiVisionAdapter:', err);
        throw err; // ZERO SILENT FALLBACK
      }
    }

    // 3. Mock Adapter ONLY if explicitly requested or in test environment
    if (forceProvider === 'mock' || process.env.NODE_ENV === 'test' || process.env.VITEST) {
      const mockAdapter = new MockVisionAdapter();
      this.cachedInstance = mockAdapter;
      return mockAdapter;
    }

    // 4. In production/staging, FAIL LOUDLY instead of faking a mock run!
    throw new Error(
      `[VisionFactory] Fatal: No valid Vision AI credentials found (OPENROUTER_API_KEY or GEMINI_API_KEY missing). ` +
      `Zero Silent Fallback Policy active. Ingestion aborted to protect data integrity.`
    );
  }

  public static reset(): void {
    this.cachedInstance = null;
  }
}
