import type { IAudioTranscriptionPort, AudioTranscriptionResult } from '@hex-aim/types';
import { SettingsManager } from '@hex-aim/core';

export interface WhisperAudioConfig {
  apiKey?: string;
  baseUrl?: string;
  model?: string;
}

export class WhisperAudioAdapter implements IAudioTranscriptionPort {
  private apiKey: string;
  private baseUrl: string;
  private model: string;

  constructor(config?: WhisperAudioConfig) {
    const settings = SettingsManager.getInstance();
    this.apiKey = config?.apiKey || settings.get<string>('OPENAI_API_KEY', '') || settings.get<string>('OPENROUTER_API_KEY', '');
    this.baseUrl = config?.baseUrl || settings.get<string>('WHISPER_BASE_URL', 'https://api.openai.com/v1');
    this.model = config?.model || settings.get<string>('WHISPER_MODEL', 'whisper-1');

    if (!this.apiKey) {
      throw new Error('[WhisperAudioAdapter] Fatal: API Key for audio transcription is not configured. Zero silent fallback enforced.');
    }
  }

  public async transcribeAudio(
    audioBuffer: Uint8Array | ArrayBuffer,
    mimeType = 'audio/ogg'
  ): Promise<AudioTranscriptionResult> {
    const bytes = audioBuffer instanceof Uint8Array ? audioBuffer : new Uint8Array(audioBuffer);
    if (bytes.length === 0) {
      throw new Error('[WhisperAudioAdapter] Cannot transcribe: Audio buffer is empty.');
    }

    const formData = new FormData();
    const blob = new Blob([bytes.buffer as ArrayBuffer], { type: mimeType });
    const ext = mimeType.includes('ogg') ? 'ogg' : mimeType.includes('mp4') || mimeType.includes('m4a') ? 'm4a' : 'mp3';
    formData.append('file', blob, `audio_input.${ext}`);
    formData.append('model', this.model);
    formData.append('temperature', '0.0');

    const res = await fetch(`${this.baseUrl}/audio/transcriptions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: formData,
      signal: AbortSignal.timeout(25000),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`[WhisperAudioAdapter] Transcription failed with HTTP ${res.status}: ${errText}`);
    }

    const data = await res.json() as any;
    if (!data?.text) {
      throw new Error('[WhisperAudioAdapter] Transcription response did not contain text.');
    }

    return {
      text: data.text.trim(),
      language: data.language || 'en',
      durationSeconds: data.duration,
      confidence: 0.95,
    };
  }
}
