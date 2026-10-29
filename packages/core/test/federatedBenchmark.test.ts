import { describe, it, expect } from 'vitest';
import { FederatedBenchmarkEngine } from '../src/privacy/FederatedBenchmarkEngine.js';

describe('Wave 33: FederatedBenchmarkEngine', () => {
  const engine = FederatedBenchmarkEngine.getInstance();

  it('generates a privacy-preserved federated benchmark summary using Laplace mechanism', () => {
    const summary = engine.getBenchmark('asten-college', 'science', 0.5);

    expect(summary.schoolId).toBe('asten-college');
    expect(summary.schoolName).toContain('Asten College');
    expect(summary.yearGroup).toBe('Y4');
    expect(summary.subject).toBe('science');
    expect(summary.privacyBudgetEpsilon).toBe(0.5);
    expect(summary.privacyMechanism).toBe('laplace_mechanism');
    expect(summary.totalStudentsCohort).toBe(48);

    // Concept benchmark stats check
    const concepts = Object.keys(summary.conceptBenchmarkStats);
    expect(concepts.length).toBeGreaterThanOrEqual(4);
    expect(concepts).toContain('Y4.SCI.SND.MEDIUM');

    const soundStat = summary.conceptBenchmarkStats['Y4.SCI.SND.MEDIUM']!;
    expect(soundStat.nationalPercentile).toBe(95);
    expect(soundStat.schoolCohortMean).toBe(93);
    expect(soundStat.differentialMasteryScore).toBeGreaterThanOrEqual(10);
    expect(soundStat.differentialMasteryScore).toBeLessThanOrEqual(100);
    expect(typeof soundStat.privacyNoiseInjected).toBe('number');
    expect(soundStat.comparativeDecayRate).toBe(1.35);

    // Peer comparisons
    expect(summary.peerComparisons.length).toBe(3);
    for (const peer of summary.peerComparisons) {
      expect(peer.schoolName).toBeTruthy();
      expect(peer.anonymizedConfidenceBand.length).toBe(2);
      expect(peer.anonymizedConfidenceBand[0]).toBeLessThanOrEqual(peer.anonymizedConfidenceBand[1]!);
    }
  });

  it('samples Laplace noise with zero-centered expectation', () => {
    const samples: number[] = [];
    for (let i = 0; i < 500; i++) {
      samples.push(engine.sampleLaplaceNoise(100 / 48, 0.5));
    }

    const mean = samples.reduce((a, b) => a + b, 0) / samples.length;
    // Mean of symmetric Laplace distribution should be near 0
    expect(Math.abs(mean)).toBeLessThan(1.5);
  });
});
