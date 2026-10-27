import type { IAudioTranscriptionPort, AudioTranscriptionResult } from '@hex-aim/types';

export class MockAudioAdapter implements IAudioTranscriptionPort {
  private cannedTranscript: string;

  constructor(cannedTranscript = 'Vertebrates have an internal backbone and an endoskeleton, while invertebrates have no backbone and sometimes have an exoskeleton like crabs.') {
    this.cannedTranscript = cannedTranscript;
  }

  public setCannedTranscript(text: string): void {
    this.cannedTranscript = text;
  }

  public async transcribeAudio(
    audioBuffer: Uint8Array | ArrayBuffer,
    _mimeType: string
  ): Promise<AudioTranscriptionResult> {
    if (!audioBuffer || (audioBuffer instanceof Uint8Array ? audioBuffer.length === 0 : audioBuffer.byteLength === 0)) {
      throw new Error('[MockAudioAdapter] Cannot transcribe empty audio buffer.');
    }

    return {
      text: this.cannedTranscript,
      language: 'en',
      durationSeconds: 6.5,
      confidence: 0.98,
    };
  }
}
