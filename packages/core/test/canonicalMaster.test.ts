import { describe, it, expect, beforeEach } from 'vitest';
import { CanonicalDeduplicator } from '../src/dedup/CanonicalDeduplicator.js';
import type { AssessmentItem, CanonicalAssessmentMaster } from '@hex-aim/types';

describe('Wave 10: Canonical Assessment Master Deduplication & Delta Ingestion', () => {
  // In-memory mock store adhering to hexagonal boundary
  let masterStore: Map<string, CanonicalAssessmentMaster>;

  beforeEach(() => {
    masterStore = new Map();
  });

  const mockFindCanonicalMaster = async (
    schoolId: string,
    yearGroup: string,
    subjectId: string,
    termWeek: number
  ): Promise<CanonicalAssessmentMaster | null> => {
    const targetSchool = schoolId.toLowerCase().trim();
    const targetYear = yearGroup.toUpperCase().trim();
    const targetSubject = subjectId.toLowerCase().trim();

    for (const master of masterStore.values()) {
      if (
        master.schoolId.toLowerCase().trim() === targetSchool &&
        master.yearGroup.toUpperCase().trim() === targetYear &&
        master.subjectId.toLowerCase().trim() === targetSubject &&
        master.termWeek === termWeek
      ) {
        return { ...master };
      }
    }
    return null;
  };

  const sampleItemsLara: AssessmentItem[] = [
    {
      qNum: 'Q1',
      conceptCode: 'Y4.MATH.NPV.EMPTY_COLUMNS',
      studentAnswer: '246',
      correctAnswer: '24,006',
      status: 'fail',
      errorClass: 'ERR_PHANTOM_ZERO',
    },
    {
      qNum: 'Q2',
      conceptCode: 'Y4.MATH.NPV.NEGATIVE_NUMBERS',
      studentAnswer: '-4 > -1',
      correctAnswer: '-1 > -4',
      status: 'fail',
      errorClass: 'ERR_NEGATIVE_MAGNITUDE_INVERSION',
    },
    {
      qNum: 'Q3',
      conceptCode: 'Y4.MATH.NPV.WRITING_NUMBERS',
      studentAnswer: '5,020',
      correctAnswer: '5,020',
      status: 'pass',
    },
  ];

  const sampleItemsMaya: AssessmentItem[] = [
    {
      qNum: 'Q1',
      conceptCode: 'Y4.MATH.NPV.EMPTY_COLUMNS',
      studentAnswer: '24,006',
      correctAnswer: '24,006',
      status: 'pass',
    },
    {
      qNum: 'Q2',
      conceptCode: 'Y4.MATH.NPV.NEGATIVE_NUMBERS',
      studentAnswer: '-1 > -4',
      correctAnswer: '-1 > -4',
      status: 'pass',
    },
    {
      qNum: 'Q3',
      conceptCode: 'Y4.MATH.NPV.NUMBER_LINE_SCALES',
      studentAnswer: '450',
      correctAnswer: '400',
      status: 'fail',
      errorClass: 'ERR_INTERVAL_DECODE',
    },
  ];

  it('computes deterministic canonical master keys and layout fingerprints', () => {
    const key = CanonicalDeduplicator.computeMasterKey({
      schoolId: 'Asten-College',
      yearGroup: 'y4',
      subjectId: 'Maths',
      termWeek: 8,
    });
    expect(key).toBe('asten-college:Y4:maths:w8');

    const fp1 = CanonicalDeduplicator.computeLayoutFingerprint(sampleItemsLara);
    const fp2 = CanonicalDeduplicator.computeLayoutFingerprint(sampleItemsLara);
    expect(fp1).toBe(fp2);
    expect(fp1.startsWith('fp_')).toBe(true);
  });

  it('creates a new master on initial student submission and links delta on subsequent peer submission', async () => {
    const dedupCtx = {
      schoolId: 'asten-college',
      yearGroup: 'Y4',
      subjectId: 'maths',
      termWeek: 8,
    };

    // 1. Lara submits first
    let existingMaster = await mockFindCanonicalMaster(
      dedupCtx.schoolId,
      dedupCtx.yearGroup,
      dedupCtx.subjectId,
      dedupCtx.termWeek
    );
    expect(existingMaster).toBeNull();

    const laraResult = CanonicalDeduplicator.processSubmission(existingMaster, dedupCtx, {
      studentId: 'lara',
      guardianId: 'guardian_dad',
      rawScore: 1,
      totalScore: 3,
      percentage: 33,
      items: sampleItemsLara,
      sourceImageUrls: ['https://example.com/lara_p1.jpg'],
    });

    expect(laraResult.isNewMaster).toBe(true);
    expect(laraResult.master.schemaQuestions.length).toBe(3);
    expect(laraResult.submission.canonicalMasterId).toBe(laraResult.master.id);

    // Save master to storage
    masterStore.set(laraResult.master.id, laraResult.master);

    // 2. Maya submits for same classroom assessment
    existingMaster = await mockFindCanonicalMaster(
      dedupCtx.schoolId,
      dedupCtx.yearGroup,
      dedupCtx.subjectId,
      dedupCtx.termWeek
    );
    expect(existingMaster).not.toBeNull();
    expect(existingMaster?.id).toBe(laraResult.master.id);

    const mayaResult = CanonicalDeduplicator.processSubmission(existingMaster, dedupCtx, {
      studentId: 'maya',
      guardianId: 'guardian_dad',
      rawScore: 2,
      totalScore: 3,
      percentage: 67,
      items: sampleItemsMaya,
      sourceImageUrls: ['https://example.com/maya_p1.jpg'],
    });

    expect(mayaResult.isNewMaster).toBe(false);
    expect(mayaResult.master.id).toBe(laraResult.master.id);
    expect(mayaResult.submission.canonicalMasterId).toBe(laraResult.master.id);

    // Delta verification
    expect(mayaResult.delta).toBeDefined();
    expect(mayaResult.delta?.matchedQuestionCount).toBe(3);
    expect(mayaResult.delta?.coveragePct).toBe(100);
    expect(mayaResult.delta?.deltaItems[0]?.status).toBe('pass');
    expect(mayaResult.delta?.deltaItems[2]?.errorClass).toBe('ERR_INTERVAL_DECODE');
  });

  it('correctly reports partial coverage when student sheet is incomplete', () => {
    const master: CanonicalAssessmentMaster = {
      id: 'master_test_w8',
      schoolId: 'asten',
      yearGroup: 'Y4',
      subjectId: 'maths',
      termWeek: 8,
      title: 'Maths W8 Test',
      schemaQuestions: [
        { qNum: 'Q1', conceptCode: 'C1', maxMarks: 1, promptText: 'Q1' },
        { qNum: 'Q2', conceptCode: 'C2', maxMarks: 1, promptText: 'Q2' },
        { qNum: 'Q3', conceptCode: 'C3', maxMarks: 1, promptText: 'Q3' },
        { qNum: 'Q4', conceptCode: 'C4', maxMarks: 1, promptText: 'Q4' },
      ],
    };

    const studentItems: AssessmentItem[] = [
      { qNum: 'Q1', conceptCode: 'C1', studentAnswer: '10', status: 'pass' },
      { qNum: 'Q2', conceptCode: 'C2', studentAnswer: '20', status: 'pass' },
    ];

    const delta = CanonicalDeduplicator.extractStudentDelta(master, { items: studentItems });
    expect(delta.matchedQuestionCount).toBe(2);
    expect(delta.unmatchedQuestionCount).toBe(0);
    expect(delta.coveragePct).toBe(50);
  });
});
