import type { IVisionExtractionPort } from '@hex-aim/types';
import { SettingsManager } from '@hex-aim/core';
import { GeminiVisionAdapter } from './GeminiVisionAdapter.js';
import { MockVisionAdapter } from './MockVisionAdapter.js';

export class VisionFactory {
  private static cachedInstance: IVisionExtractionPort | null = null;

  public static getVision(forceProvider?: 'gemini' | 'mock'): IVisionExtractionPort {
    if (this.cachedInstance && !forceProvider) {
      return this.cachedInstance;
    }

    const settings = SettingsManager.getInstance();
    const provider = forceProvider || settings.get<'gemini' | 'mock'>('vision.provider', 'gemini');
    const apiKey = settings.get<string>('GEMINI_API_KEY', process.env.GEMINI_API_KEY || '');

    if (provider === 'gemini' && apiKey) {
      try {
        const adapter = new GeminiVisionAdapter({ apiKey });
        this.cachedInstance = adapter;
        return adapter;
      } catch (err) {
        console.warn('[VisionFactory] Failed to initialize GeminiVisionAdapter, falling back to Mock:', err);
      }
    }

    const mockAdapter = new MockVisionAdapter();
    this.cachedInstance = mockAdapter;
    return mockAdapter;
  }

  public static reset(): void {
    this.cachedInstance = null;
  }
}
