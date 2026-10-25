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

export class CanonicalDeduplicator {
  /**
   * Computes a deterministic canonical key for a classroom quiz family.
   * e.g. "asten-college:Y4:maths:w2"
   */
  public static computeMasterKey(context: DedupContext): string {
    return `${context.schoolId.toLowerCase()}:${context.yearGroup.toUpperCase()}:${context.subjectId.toLowerCase()}:w${context.termWeek}`;
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
  } {
    const masterKey = this.computeMasterKey(context);
    const submissionId = `sub_${submissionData.studentId}_${masterKey}_${Date.now()}`;
    const dateStr = new Date().toISOString().split('T')[0]!;

    let master: CanonicalAssessmentMaster;
    let isNewMaster = false;

    if (existingMaster) {
      master = existingMaster;
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
      submission
    };
  }
}
