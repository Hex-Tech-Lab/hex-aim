import { describe, it, expect } from 'vitest';
import { CognitiveDecayEngine } from '../src/decay/CognitiveDecayEngine.js';

describe('CognitiveDecayEngine (Wave 22: Spaced Repetition & ADHD Decay Modeling)', () => {
  const engine = CognitiveDecayEngine.getInstance();

  it('correctly loads divergent cognitive profiles for Lara vs Maya', () => {
    const laraProfile = engine.getProfile('lara');
    const mayaProfile = engine.getProfile('maya');

    expect(laraProfile.hasAdhdFocusAccommodations).toBe(true);
    expect(laraProfile.workingMemoryIndex).toBeLessThan(1.0);
    expect(laraProfile.adhdVisualAnchorMultiplier).toBeGreaterThan(1.0);

    expect(mayaProfile.hasAdhdFocusAccommodations).toBe(false);
    expect(mayaProfile.workingMemoryIndex).toBeGreaterThan(1.0);
  });

  it('computes effective half-life reflecting visual anchors and review streaks', () => {
    const laraProfile = engine.getProfile('lara');

    // Base with visual anchor
    const s0 = engine.computeEffectiveHalfLife(laraProfile, 0, true);
    expect(s0).toBeGreaterThan(5.0);

    // Spaced review streak increases stability
    const s2 = engine.computeEffectiveHalfLife(laraProfile, 2, true);
    expect(s2).toBeGreaterThan(s0 * 2.5);
  });

  it('calculates retention decay adhering to Ebbinghaus forgetting curve', () => {
    const mockNow = new Date('2026-10-28T12:00:00Z');

    // Freshly practiced concept (2 days ago)
    const healthy = engine.calculateDecay(
      'lara',
      'Y4.MATH.TEST',
      'Math Test',
      'maths',
      95,
      '2026-10-26T12:00:00Z',
      2,
      'math-w8',
      mockNow
    );
    expect(healthy.decayStatus).toBe('healthy');
    expect(healthy.predictedRetention).toBeGreaterThanOrEqual(80);

    // Stale concept (20 days ago with 0 review streak)
    const decayed = engine.calculateDecay(
      'lara',
      'Y4.ENG.TEST',
      'English Test',
      'english',
      85,
      '2026-10-08T12:00:00Z',
      0,
      'eng-w7',
      mockNow
    );
    expect(decayed.decayStatus).toBe('critical_decay');
    expect(decayed.predictedRetention).toBeLessThan(60);
  });

  it('generates prioritized spaced repetition queue with ADHD duration accommodations', () => {
    const mockNow = new Date('2026-10-28T12:00:00Z');
    const queue = engine.generateSpacedRepetitionQueue('lara', mockNow);

    expect(queue.length).toBeGreaterThan(0);
    // Lara gets 8-minute micro-sprint accommodation
    expect(queue[0].recommendedDurationMins).toBe(8);
    // Highest urgency (lowest retention) is at head of queue
    expect(queue[0].urgency).toBe('high');
  });
});
