import type { BloomLevel, BloomDifficultyRecord, Student } from '@hex-aim/types';

export const BLOOM_HIERARCHY: BloomLevel[] = [
  'remember',
  'understand',
  'apply',
  'analyze',
  'evaluate',
  'create'
];

export interface CalibratedQuestionPrompt {
  originalQuestion: string;
  calibratedPrompt: string;
  bloomLevel: BloomLevel;
  isDecomposed: boolean;
  subSteps?: string[];
  recommendedTimeSeconds: number;
}

export class BloomTaxonomyEngine {
  private static instance: BloomTaxonomyEngine | null = null;

  public static getInstance(): BloomTaxonomyEngine {
    if (!this.instance) {
      this.instance = new BloomTaxonomyEngine();
    }
    return this.instance;
  }

  public getNextLevel(current: BloomLevel): BloomLevel {
    const idx = BLOOM_HIERARCHY.indexOf(current);
    if (idx === -1 || idx >= BLOOM_HIERARCHY.length - 1) {
      return current;
    }
    return BLOOM_HIERARCHY[idx + 1]!;
  }

  public getPreviousLevel(current: BloomLevel): BloomLevel {
    const idx = BLOOM_HIERARCHY.indexOf(current);
    if (idx <= 0) {
      return current;
    }
    return BLOOM_HIERARCHY[idx - 1]!;
  }

  public updateDifficultyProgression(
    record: BloomDifficultyRecord,
    scorePct: number
  ): BloomDifficultyRecord {
    const updated = { ...record, lastAttemptAt: new Date().toISOString() };

    if (scorePct >= 80) {
      updated.levelStreakCount += 1;
      updated.needsScaffolding = false;

      // 2 consecutive mastery attempts triggers Bloom advancement
      if (updated.levelStreakCount >= 2) {
        updated.currentBloomLevel = this.getNextLevel(updated.currentBloomLevel);
        updated.levelStreakCount = 0;
      }
    } else if (scorePct < 50) {
      updated.levelStreakCount = 0;
      updated.needsScaffolding = true;

      // Drop 1 level if struggling at apply or above to restore confidence
      const currentIdx = BLOOM_HIERARCHY.indexOf(updated.currentBloomLevel);
      if (currentIdx >= 2) {
        updated.currentBloomLevel = this.getPreviousLevel(updated.currentBloomLevel);
      }
    } else {
      // Maintain current level
      updated.levelStreakCount = Math.max(0, updated.levelStreakCount - 1);
    }

    return updated;
  }

  public calibrateCognitiveLoad(
    questionText: string,
    bloomLevel: BloomLevel,
    neuroProfile?: Student['neuroProfile']
  ): CalibratedQuestionPrompt {
    const hasAdhd = Boolean(neuroProfile?.hasAdhdTraits);
    const isVulnerableMemory = neuroProfile?.workingMemoryCapacity === 'vulnerable_under_time_pressure';

    if (!hasAdhd && !isVulnerableMemory) {
      return {
        originalQuestion: questionText,
        calibratedPrompt: questionText,
        bloomLevel,
        isDecomposed: false,
        recommendedTimeSeconds: 180,
      };
    }

    // ADHD / Working Memory Scaffolding:
    // Decompose compound multi-step questions into distinct visual anchors
    const isCompound = questionText.includes(' and ') || questionText.includes('; ') || questionText.length > 100;

    if (isCompound) {
      const parts = questionText.split(/(?:;|\band\s+explain\b|\band\s+classify\b|\band\s+then\b)/i)
        .map(p => p.trim())
        .filter(p => p.length > 0);

      const subSteps = parts.length > 1 
        ? parts.map((part, i) => `Step ${i + 1}: ${part.charAt(0).toUpperCase() + part.slice(1)}`)
        : [questionText];

      const formatted = `🧩 <b>[Step-by-Step Micro Drill]</b>\n` +
        subSteps.map(s => `• <b>${s}</b>`).join('\n') +
        `\n\n⏱️ <i>Take your time. Solve Step 1 first!</i>`;

      return {
        originalQuestion: questionText,
        calibratedPrompt: formatted,
        bloomLevel,
        isDecomposed: true,
        subSteps,
        recommendedTimeSeconds: 120, // Short burst
      };
    }

    // Single step with visual focus frame
    const formatted = `🎯 <b>Focus Question:</b>\n${questionText}\n\n💡 <i>One clean sentence is all you need.</i>`;
    return {
      originalQuestion: questionText,
      calibratedPrompt: formatted,
      bloomLevel,
      isDecomposed: false,
      recommendedTimeSeconds: 90,
    };
  }
}
