import { describe, it, expect } from 'vitest';
import { BloomTaxonomyEngine } from '../src/taxonomy/BloomTaxonomyEngine.js';
import type { BloomDifficultyRecord, Student } from '@hex-aim/types';

describe('Wave 16: Adaptive Bloom Taxonomy Difficulty Engine & Cognitive Load Calibrator', () => {
  const engine = BloomTaxonomyEngine.getInstance();

  const initialRecord: BloomDifficultyRecord = {
    studentId: 'lara',
    subjectId: 'science',
    conceptCode: 'ASTEN.Y4.SCI.VERTEBRATES.1',
    currentBloomLevel: 'understand',
    levelStreakCount: 0,
    needsScaffolding: false,
    lastAttemptAt: new Date().toISOString(),
  };

  it('promotes student to next Bloom level after 2 consecutive mastery scores', () => {
    // 1st mastery attempt (85%) -> streak becomes 1, maintains 'understand'
    const step1 = engine.updateDifficultyProgression(initialRecord, 85);
    expect(step1.currentBloomLevel).toBe('understand');
    expect(step1.levelStreakCount).toBe(1);
    expect(step1.needsScaffolding).toBe(false);

    // 2nd consecutive mastery attempt (90%) -> promotes to 'apply'
    const step2 = engine.updateDifficultyProgression(step1, 90);
    expect(step2.currentBloomLevel).toBe('apply');
    expect(step2.levelStreakCount).toBe(0);
    expect(step2.needsScaffolding).toBe(false);
  });

  it('drops difficulty down 1 level and triggers scaffolding when struggling (<50%)', () => {
    const highRecord: BloomDifficultyRecord = {
      ...initialRecord,
      currentBloomLevel: 'apply',
      levelStreakCount: 1,
    };

    const dropped = engine.updateDifficultyProgression(highRecord, 40);
    expect(dropped.currentBloomLevel).toBe('understand');
    expect(dropped.levelStreakCount).toBe(0);
    expect(dropped.needsScaffolding).toBe(true);
  });

  it('calibrates cognitive load for ADHD students by decomposing compound multi-step questions', () => {
    const adhdStudent: Partial<Student> = {
      neuroProfile: {
        hasAdhdTraits: true,
        hasDyslexiaTraits: false,
        workingMemoryCapacity: 'vulnerable_under_time_pressure',
        optimalSprintDurationMins: 8,
      },
    };

    const compoundQuestion = 'Explain the difference between vertebrates and invertebrates and explain why crustaceans molt their exoskeleton as they grow.';
    const calibrated = engine.calibrateCognitiveLoad(compoundQuestion, 'apply', adhdStudent.neuroProfile);

    expect(calibrated.isDecomposed).toBe(true);
    expect(calibrated.subSteps).toBeDefined();
    expect(calibrated.subSteps?.length).toBeGreaterThanOrEqual(2);
    expect(calibrated.calibratedPrompt).toContain('🧩 <b>[Step-by-Step Micro Drill]</b>');
    expect(calibrated.recommendedTimeSeconds).toBeLessThanOrEqual(120);
  });

  it('leaves standard questions unchanged for students without ADHD/memory flags', () => {
    const standardQuestion = 'Name 3 mammals found in Egypt.';
    const calibrated = engine.calibrateCognitiveLoad(standardQuestion, 'remember', undefined);

    expect(calibrated.isDecomposed).toBe(false);
    expect(calibrated.calibratedPrompt).toBe(standardQuestion);
  });
});
