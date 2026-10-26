import type { 
  CanonicalAssessmentMaster, 
  AssessmentSubmission, 
  AssessmentItem 
} from '@hex-aim/types';

export interface DedupContext {
  schoolId: string;
  yearGroup: string;
  subjectId: string;
  termWeek: number;
}

export interface StudentDeltaExtractionResult {
  deltaItems: AssessmentItem[];
  matchedQuestionCount: number;
  unmatchedQuestionCount: number;
  coveragePct: number;
}

export class CanonicalDeduplicator {
  /**
   * Computes a deterministic canonical key for a classroom quiz family.
   * e.g. "asten-college:Y4:maths:w2"
   */
  public static computeMasterKey(context: DedupContext): string {
    return `${context.schoolId.toLowerCase().trim()}:${context.yearGroup.toUpperCase().trim()}:${context.subjectId.toLowerCase().trim()}:w${context.termWeek}`;
  }

  /**
   * Computes a deterministic structural layout fingerprint from question numbers and prompts.
   * This allows matching test sheets across different students in the same class even if
   * week metadata is missing or slightly offset.
   */
  public static computeLayoutFingerprint(
    items: Array<{ qNum: string; promptText?: string; conceptCode?: string }>
  ): string {
    const normalizedTokens = items
      .map(item => {
        const cleanQ = (item.qNum || '').trim().toLowerCase();
        const cleanConcept = (item.conceptCode || '').trim().toLowerCase();
        const cleanPrompt = (item.promptText || '')
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '')
          .slice(0, 30);
        return `${cleanQ}:${cleanConcept}:${cleanPrompt}`;
      })
      .sort()
      .join('|');

    // Simple deterministic string hash for worker / browser compatibility
    let hash = 0;
    for (let i = 0; i < normalizedTokens.length; i++) {
      const char = normalizedTokens.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0; // Convert to 32bit integer
    }
    return `fp_${Math.abs(hash).toString(16)}`;
  }

  /**
   * Evaluates whether an incoming submission can reuse an existing Canonical Master.
   * If yes, returns the linked delta submission avoiding duplicate question schemas.
   */
  public static processSubmission(
    existingMaster: CanonicalAssessmentMaster | null,
    context: DedupContext,
    submissionData: {
      studentId: string;
      guardianId?: string;
      rawScore: number;
      totalScore: number;
      percentage: number;
      items: AssessmentItem[];
      sourceImageUrls: string[];
      title?: string;
    }
  ): {
    master: CanonicalAssessmentMaster;
    isNewMaster: boolean;
    submission: AssessmentSubmission;
    delta?: StudentDeltaExtractionResult;
  } {
    const masterKey = this.computeMasterKey(context);
    const submissionId = `sub_${submissionData.studentId}_${masterKey}_${Date.now()}`;
    const dateStr = new Date().toISOString().split('T')[0]!;

    let master: CanonicalAssessmentMaster;
    let isNewMaster = false;
    let delta: StudentDeltaExtractionResult | undefined;

    if (existingMaster) {
      master = existingMaster;
      delta = this.extractStudentDelta(existingMaster, submissionData);
    } else {
      isNewMaster = true;
      master = {
        id: `master_${masterKey}`,
        schoolId: context.schoolId,
        yearGroup: context.yearGroup,
        subjectId: context.subjectId,
        termWeek: context.termWeek,
        title: submissionData.title || `${context.subjectId.toUpperCase()} Week ${context.termWeek} Milestone Assessment`,
        schemaQuestions: submissionData.items.map(item => ({
          qNum: item.qNum,
          conceptCode: item.conceptCode,
          maxMarks: 1,
          promptText: `Assessment Question ${item.qNum} covering ${item.conceptCode}`
        })),
        cleanMasterImageUrl: submissionData.sourceImageUrls[0] || undefined
      };
    }

    const submission: AssessmentSubmission = {
      id: submissionId,
      canonicalMasterId: master.id,
      studentId: submissionData.studentId,
      guardianId: submissionData.guardianId,
      subjectId: context.subjectId,
      date: dateStr,
      termWeek: context.termWeek,
      rawScore: submissionData.rawScore,
      totalScore: submissionData.totalScore,
      percentage: submissionData.percentage,
      items: submissionData.items,
      sourceImageUrls: submissionData.sourceImageUrls
    };

    return {
      master,
      isNewMaster,
      submission,
      delta
    };
  }

  /**
   * Extracts student delta responses anchored to the canonical master questions.
   * Matches question numbers (e.g. "Q1", "1", "1a") and preserves student-specific
   * handwritten marks, errors, and cognitive flags.
   */
  public static extractStudentDelta(
    master: CanonicalAssessmentMaster,
    rawSubmission: { items: AssessmentItem[] }
  ): StudentDeltaExtractionResult {
    const masterQuestionsByQNum = new Map<string, typeof master.schemaQuestions[0]>();
    for (const mq of master.schemaQuestions) {
      const normalizedQ = mq.qNum.toLowerCase().replace(/[^a-z0-9]/g, '');
      masterQuestionsByQNum.set(normalizedQ, mq);
    }

    const deltaItems: AssessmentItem[] = [];
    let matched = 0;
    let unmatched = 0;

    for (const item of rawSubmission.items) {
      const normalizedQ = item.qNum.toLowerCase().replace(/[^a-z0-9]/g, '');
      const masterQ = masterQuestionsByQNum.get(normalizedQ);

      if (masterQ) {
        matched++;
        deltaItems.push({
          ...item,
          // Inherit verified master concept code if submission was vague
          conceptCode: masterQ.conceptCode || item.conceptCode,
        });
      } else {
        unmatched++;
        deltaItems.push(item);
      }
    }

    const totalExpected = master.schemaQuestions.length;
    const coveragePct = totalExpected > 0 
      ? Math.round((matched / totalExpected) * 100) 
      : 0;

    return {
      deltaItems,
      matchedQuestionCount: matched,
      unmatchedQuestionCount: unmatched,
      coveragePct,
    };
  }
}
