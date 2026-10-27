import { describe, it, expect } from 'vitest';
import { MockAudioAdapter } from '../src/audio/MockAudioAdapter.js';
import { AudioFactory } from '../src/audio/AudioFactory.js';

describe('Wave 15: Audio Transcription Adapters (IAudioTranscriptionPort)', () => {
  it('transcribes audio buffer accurately using MockAudioAdapter', async () => {
    const adapter = new MockAudioAdapter();
    const buffer = new Uint8Array([1, 2, 3, 4, 5]);

    const result = await adapter.transcribeAudio(buffer, 'audio/ogg');
    expect(result.text).toContain('Vertebrates have an internal backbone');
    expect(result.language).toBe('en');
    expect(result.confidence).toBeGreaterThan(0.9);
  });

  it('rejects empty audio buffer with explicit zero silent fallback error', async () => {
    const adapter = new MockAudioAdapter();
    const emptyBuffer = new Uint8Array([]);

    await expect(adapter.transcribeAudio(emptyBuffer, 'audio/ogg'))
      .rejects.toThrow('Cannot transcribe empty audio buffer');
  });

  it('AudioFactory retrieves MockAudioAdapter when provider is set to mock', () => {
    AudioFactory.reset();
    const adapter = AudioFactory.getAudioTranscription('mock');
    expect(adapter).toBeInstanceOf(MockAudioAdapter);
  });
});
