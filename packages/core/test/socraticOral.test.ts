import { describe, it, expect } from 'vitest';
import { SocraticOralEvaluator } from '../src/socratic/SocraticOralEvaluator.js';

describe('Wave 15: Voice-First Socratic Oral Coaching & Audio Evaluation', () => {
  const evaluator = SocraticOralEvaluator.getInstance();

  it('evaluates high-mastery verbal explanation and awards advance recommendation', () => {
    const result = evaluator.evaluateOralTurn({
      transcript: 'Vertebrates have an internal backbone and an endoskeleton to support their body, whereas invertebrates have no backbone and often have an exoskeleton.',
      drillQuestion: 'Explain the difference between vertebrates and invertebrates.',
      targetConceptCode: 'ASTEN.Y4.SCI.VERTEBRATES.1',
      expectedKeywords: ['vertebrates', 'invertebrates', 'backbone', 'endoskeleton', 'exoskeleton'],
      studentName: 'Lara',
    });

    expect(result.conceptMasteryPct).toBe(100);
    expect(result.detectedKeyVocab).toContain('backbone');
    expect(result.detectedKeyVocab).toContain('endoskeleton');
    expect(result.detectedKeyVocab).toContain('exoskeleton');
    expect(result.missingKeyVocab).toHaveLength(0);
    expect(result.suggestedBloomAdjustment).toBe('advance');
    expect(result.affirmationPraise).toContain('Brilliant work, Lara');
  });

  it('detects common misconceptions and suggests pedagogical scaffolding', () => {
    const result = evaluator.evaluateOralTurn({
      transcript: 'All insects have bones and they are vertebrates like us.',
      drillQuestion: 'Are insects vertebrates?',
      targetConceptCode: 'ASTEN.Y4.SCI.VERTEBRATES.1',
      expectedKeywords: ['invertebrates', 'backbone', 'exoskeleton'],
      commonMisconceptions: ['insects have bones'],
      studentName: 'Maya',
    });

    expect(result.misconceptions).toContain('insects have bones');
    expect(result.conceptMasteryPct).toBeLessThan(50);
    expect(result.suggestedBloomAdjustment).toBe('scaffold');
    expect(result.socraticFollowUpQuestion).toContain('Careful with this common trap');
  });

  it('handles empty or inaudible transcript gracefully with encouraging prompt', () => {
    const result = evaluator.evaluateOralTurn({
      transcript: '   ',
      drillQuestion: 'Can you describe what an endoskeleton is?',
      targetConceptCode: 'ASTEN.Y4.SCI.VERTEBRATES.1',
      expectedKeywords: ['internal', 'skeleton', 'support'],
    });

    expect(result.conceptMasteryPct).toBe(0);
    expect(result.suggestedBloomAdjustment).toBe('scaffold');
    expect(result.affirmationPraise).toContain('I could not hear an answer clearly');
  });
});
