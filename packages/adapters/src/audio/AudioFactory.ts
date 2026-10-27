import type { IAudioTranscriptionPort } from '@hex-aim/types';
import { SettingsManager } from '@hex-aim/core';
import { MockAudioAdapter } from './MockAudioAdapter.js';
import { WhisperAudioAdapter } from './WhisperAudioAdapter.js';

export class AudioFactory {
  private static instance: IAudioTranscriptionPort | null = null;

  public static getAudioTranscription(providerOverride?: string): IAudioTranscriptionPort {
    if (this.instance && !providerOverride) {
      return this.instance;
    }

    const settings = SettingsManager.getInstance();
    const provider = providerOverride || settings.get<string>('audio.provider', 'whisper');

    if (provider === 'mock') {
      return new MockAudioAdapter();
    }

    try {
      const adapter = new WhisperAudioAdapter();
      if (!providerOverride) {
        this.instance = adapter;
      }
      return adapter;
    } catch (err) {
      console.warn('[AudioFactory] Falling back to MockAudioAdapter due to credentials:', (err as any)?.message);
      return new MockAudioAdapter();
    }
  }

  public static reset(): void {
    this.instance = null;
  }
}
