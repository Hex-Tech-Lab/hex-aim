import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import * as http from 'http';
import { createServer } from '../src/server.js';

describe('Wave 21: Socratic Audio Coaching & Oral Evaluation API', () => {
  let server: http.Server;
  let baseUrl: string;

  beforeAll(async () => {
    server = createServer();
    await new Promise<void>((resolve) => {
      server.listen(0, '127.0.0.1', () => {
        const addr = server.address() as any;
        baseUrl = `http://127.0.0.1:${addr.port}`;
        resolve();
      });
    });
  });

  afterAll(async () => {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  });

  it('GET /api/socratic/audio-prompts returns bilingual prompt metadata', async () => {
    const res = await fetch(`${baseUrl}/api/socratic/audio-prompts`);
    expect(res.status).toBe(200);
    const prompts = await res.json() as any[];
    expect(Array.isArray(prompts)).toBe(true);
    expect(prompts.length).toBeGreaterThanOrEqual(2);

    const prompt1 = prompts.find(p => p.conceptCode === 'Y4.MATH.NPV.EMPTY_COLUMNS');
    expect(prompt1).toBeTruthy();
    expect(prompt1.english.title).toContain('Hundreds Chair');
    expect(prompt1.arabic.title).toContain('حارس خانة المئات');
    expect(prompt1.english.expectedKeywords).toContain('zero');
  });

  it('POST /api/socratic/evaluate-oral evaluates student transcript and returns conceptual mastery', async () => {
    const res = await fetch(`${baseUrl}/api/socratic/evaluate-oral`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        transcript: 'Zero guards the hundreds chair so the thousands room does not crash into tens.',
        drillQuestion: 'If there are zero hundreds in 24,106, who is guarding the hundreds chair?',
        targetConceptCode: 'Y4.MATH.NPV.EMPTY_COLUMNS',
        expectedKeywords: ['zero', 'guards', 'chair', 'hundreds', 'place-value'],
        studentName: 'Lara',
      }),
    });

    expect(res.status).toBe(200);
    const json = await res.json() as any;
    expect(json.ok).toBe(true);
    expect(json.evaluation.conceptMasteryPct).toBeGreaterThanOrEqual(75);
    expect(json.evaluation.detectedKeyVocab).toContain('zero');
    expect(json.evaluation.detectedKeyVocab).toContain('guards');
    expect(json.evaluation.affirmationPraise).toBeTruthy();
  });
});
