import type {
  StudentCognitiveProfile,
  ConceptDecayRecord,
  MasteryDecayStatus,
  SpacedRepetitionQueueItem
} from '@hex-aim/types';

export class CognitiveDecayEngine {
  private static instance: CognitiveDecayEngine | null = null;

  // Pre-configured cognitive profiles for Lara & Maya
  private readonly defaultProfiles: Record<string, StudentCognitiveProfile> = {
    lara: {
      studentId: 'lara',
      studentName: 'Lara',
      workingMemoryIndex: 0.78, // High verbal curiosity, fragile procedural working memory / ADHD profile
      adhdVisualAnchorMultiplier: 1.45, // Boosted retention when Elevator Model / visual anchor is engaged
      baseStabilityHalfLifeDays: 5.5,
      hasAdhdFocusAccommodations: true
    },
    maya: {
      studentId: 'maya',
      studentName: 'Maya',
      workingMemoryIndex: 1.18, // High working memory capacity, rapid consolidation
      adhdVisualAnchorMultiplier: 1.0,
      baseStabilityHalfLifeDays: 7.5,
      hasAdhdFocusAccommodations: false
    }
  };

  public static getInstance(): CognitiveDecayEngine {
    if (!this.instance) {
      this.instance = new CognitiveDecayEngine();
    }
    return this.instance;
  }

  public getProfile(studentId: string): StudentCognitiveProfile {
    const key = studentId.toLowerCase();
    return this.defaultProfiles[key] || {
      studentId,
      studentName: studentId.charAt(0).toUpperCase() + studentId.slice(1),
      workingMemoryIndex: 1.0,
      adhdVisualAnchorMultiplier: 1.0,
      baseStabilityHalfLifeDays: 6.0,
      hasAdhdFocusAccommodations: false
    };
  }

  /**
   * Computes the effective memory half-life S in days based on cognitive profile and review history.
   */
  public computeEffectiveHalfLife(
    profile: StudentCognitiveProfile,
    reviewStreakCount: number,
    hasVisualAnchorActive: boolean = true
  ): number {
    let halfLife = profile.baseStabilityHalfLifeDays * profile.workingMemoryIndex;

    // Apply ADHD visual anchor scaffolding boost if applicable
    if (profile.hasAdhdFocusAccommodations && hasVisualAnchorActive) {
      halfLife *= profile.adhdVisualAnchorMultiplier;
    }

    // Each spaced review expands stability exponentially: S_n = S_0 * (1.85)^n
    if (reviewStreakCount > 0) {
      const growthFactor = Math.pow(1.85, Math.min(reviewStreakCount, 4));
      halfLife *= growthFactor;
    }

    return Number(halfLife.toFixed(1));
  }

  /**
   * Calculates retention and decay status for a single concept given elapsed time.
   */
  public calculateDecay(
    studentId: string,
    conceptCode: string,
    conceptTitle: string,
    subjectId: string,
    peakMastery: number,
    lastPracticedDate: string,
    reviewStreakCount: number,
    suggestedTemplateId: string,
    now: Date = new Date()
  ): ConceptDecayRecord {
    const profile = this.getProfile(studentId);
    const lastPracticed = new Date(lastPracticedDate);
    const diffMs = Math.max(0, now.getTime() - lastPracticed.getTime());
    const elapsedDays = Number((diffMs / (1000 * 60 * 60 * 24)).toFixed(1));

    const effectiveHalfLifeDays = this.computeEffectiveHalfLife(profile, reviewStreakCount, true);

    // Ebbinghaus exponential decay: R(t) = R_0 * 2^(-t / S)
    const decayFactor = Math.pow(0.5, elapsedDays / effectiveHalfLifeDays);
    const predictedRetention = Math.max(10, Math.min(100, Math.round(peakMastery * decayFactor)));

    // Days until retention drops below critical threshold (60%)
    let daysUntilCritical = 0;
    if (peakMastery > 60) {
      // 60 = peak * 2^(-t_crit / S) => t_crit = S * log2(peak / 60)
      const totalDaysToCritical = effectiveHalfLifeDays * (Math.log(peakMastery / 60) / Math.LN2);
      daysUntilCritical = Math.max(0, Math.round(totalDaysToCritical - elapsedDays));
    }

    let decayStatus: MasteryDecayStatus = 'healthy';
    if (predictedRetention < 60) {
      decayStatus = 'critical_decay';
    } else if (predictedRetention < 80) {
      decayStatus = 'vulnerable';
    }

    // Recommended review date is at 75% retention mark or when critical approaches within 2 days
    const daysToReview = Math.max(1, Math.round(effectiveHalfLifeDays * (Math.log(peakMastery / 75) / Math.LN2) - elapsedDays));
    const recReview = new Date(now.getTime() + Math.max(0, daysToReview) * 24 * 60 * 60 * 1000);
    const recommendedReviewDate = recReview.toISOString().split('T')[0] || '';

    return {
      studentId: profile.studentId,
      conceptCode,
      conceptTitle,
      subjectId,
      peakMastery,
      predictedRetention,
      lastPracticedDate,
      elapsedDays,
      effectiveHalfLifeDays,
      reviewStreakCount,
      decayStatus,
      daysUntilCritical,
      recommendedReviewDate,
      suggestedTemplateId
    };
  }

  /**
   * Generates a curated decay ledger for Lara and Maya based on their real curriculum history.
   */
  public getStudentDecayLedger(studentId: string, now: Date = new Date()): ConceptDecayRecord[] {
    const key = studentId.toLowerCase();

    // Baseline historical records reflecting current curriculum progress
    if (key === 'lara') {
      return [
        this.calculateDecay(
          'lara',
          'Y4.SCI.SND.MEDIUM',
          'Sound Transmission Through States of Matter',
          'science',
          92,
          '2026-10-18T00:00:00Z', // 10 days ago -> vulnerable decay
          1,
          'sci-w8',
          now
        ),
        this.calculateDecay(
          'lara',
          'Y4.MATH.COL.SUBTRACT',
          'Column Subtraction with Decomposition',
          'maths',
          95,
          '2026-10-24T00:00:00Z', // 4 days ago -> healthy
          2,
          'math-w8',
          now
        ),
        this.calculateDecay(
          'lara',
          'Y4.ENG.FRONTED.ADV',
          'Fronted Adverbials with Punctuation Guards',
          'english',
          88,
          '2026-10-14T00:00:00Z', // 14 days ago -> critical decay
          0,
          'eng-w7',
          now
        ),
        this.calculateDecay(
          'lara',
          'Y4.SCI.DIGEST.PATH',
          'Human Digestive System & Enzyme Action',
          'science',
          90,
          '2026-10-22T00:00:00Z', // 6 days ago -> healthy
          2,
          'sci-w7',
          now
        )
      ];
    } else {
      // Maya
      return [
        this.calculateDecay(
          'maya',
          'Y4.MATH.FRACTION.ADD',
          'Fractions with Same Denominator',
          'maths',
          96,
          '2026-10-25T00:00:00Z', // 3 days ago -> healthy
          3,
          'math-w8',
          now
        ),
        this.calculateDecay(
          'maya',
          'Y4.SCI.SND.VIBRATION',
          'Sound Wave Pitch & Frequency',
          'science',
          94,
          '2026-10-20T00:00:00Z', // 8 days ago -> vulnerable
          1,
          'sci-w8',
          now
        ),
        this.calculateDecay(
          'maya',
          'Y4.ENG.DIALOGUE.INVERTED',
          'Speech Marks & Reported Dialogue Rules',
          'english',
          92,
          '2026-10-23T00:00:00Z', // 5 days ago -> healthy
          2,
          'eng-w7',
          now
        )
      ];
    }
  }

  /**
   * Produces an ordered queue of concepts that require immediate spaced-repetition micro-sprints.
   */
  public generateSpacedRepetitionQueue(studentId: string, now: Date = new Date()): SpacedRepetitionQueueItem[] {
    const records = this.getStudentDecayLedger(studentId, now);
    const profile = this.getProfile(studentId);

    const queue: SpacedRepetitionQueueItem[] = [];

    // Filter vulnerable or critical items
    const decayingItems = records.filter(r => r.decayStatus === 'critical_decay' || r.decayStatus === 'vulnerable');

    // Sort by retention ascending (lowest retention first)
    decayingItems.sort((a, b) => a.predictedRetention - b.predictedRetention);

    for (const item of decayingItems) {
      let priority: 'high' | 'medium' | 'low' = 'low';
      let urgencyReason = '';

      if (item.decayStatus === 'critical_decay') {
        priority = 'high';
        urgencyReason = `Mastery decayed to ${item.predictedRetention}% (${item.elapsedDays}d since practice). Immediate 8m micro-sprint required.`;
      } else {
        priority = 'medium';
        urgencyReason = `Mastery at ${item.predictedRetention}% (approaching ${item.daysUntilCritical}d to critical threshold). Spaced booster recommended.`;
      }

      const recommendedDurationMins = profile.hasAdhdFocusAccommodations ? 8 : 12;

      queue.push({
        conceptCode: item.conceptCode,
        conceptTitle: item.conceptTitle,
        subjectId: item.subjectId,
        currentRetention: item.predictedRetention,
        urgency: priority,
        urgencyReason,
        recommendedDurationMins,
        suggestedTemplateId: item.suggestedTemplateId
      });
    }

    return queue;
  }
}
