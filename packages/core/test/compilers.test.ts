import { describe, it, expect } from 'vitest';
import { 
  AdaptiveSprintCompiler, 
  SocraticGuideCompiler, 
  CanonicalDeduplicator 
} from '../src/index.js';
import type { Student, CognitiveGap, Guardian } from '@hex-aim/types';

describe('AdaptiveSprintCompiler', () => {
  const mockStudent: Student = {
    id: 'student_001',
    name: 'Karim',
    schoolId: 'asten-college',
    yearGroup: 'Y4',
    curriculumTrack: 'british',
    neuroProfile: {
      hasAdhdTraits: true,
      hasDyslexiaTraits: false,
      workingMemoryCapacity: 'vulnerable_under_time_pressure',
      optimalSprintDurationMins: 7
    },
    siblingStudentIds: ['student_002']
  };

  const mockGaps: CognitiveGap[] = [
    {
      id: 'gap_1',
      studentId: 'student_001',
      conceptCode: 'Y4.MATH.NPV.EMPTY_COLUMNS',
      errorClass: 'ERR_PHANTOM_ZERO',
      description: 'Omits zeros in place-value rooms',
      firstObservedDate: '2026-10-10',
      lastObservedDate: '2026-10-24',
      recurrenceCount: 2,
      status: 'active_priority'
    }
  ];

  it('compiles a 4-page HTML sprint with student parameters and target gaps', () => {
    const sprint = AdaptiveSprintCompiler.compile(mockStudent, mockGaps, { sprintNumber: 3 });

    expect(sprint.studentId).toBe('student_001');
    expect(sprint.durationMins).toBe(7);
    expect(sprint.htmlContent).toContain('Karim');
    expect(sprint.htmlContent).toContain('Page 1 of 4');
    expect(sprint.htmlContent).toContain('Page 4 of 4');
    expect(sprint.htmlContent).toContain('Active Priority');
    expect(sprint.htmlContent).toContain('The Peer Explainer Challenge (Zero Competition!)');
  });
});

describe('SocraticGuideCompiler & 3-Strike Localization', () => {
  const mockStudent: Student = {
    id: 'student_001',
    name: 'Karim',
    schoolId: 'asten-college',
    yearGroup: 'Y4',
    curriculumTrack: 'british',
    neuroProfile: {
      hasAdhdTraits: false,
      hasDyslexiaTraits: false,
      workingMemoryCapacity: 'standard',
      optimalSprintDurationMins: 8
    }
  };

  it('defaults to preferred language when requests are below 3', () => {
    const guardian: Guardian = {
      id: 'g_1',
      name: 'Ahmed',
      studentIds: ['student_001'],
      preferredLanguage: 'en',
      arabicRequestCount: 2,
      messagingChannel: 'telegram',
      chatId: '12345'
    };

    const lang = SocraticGuideCompiler.resolveLanguage(guardian);
    expect(lang).toBe('en');

    const guide = SocraticGuideCompiler.compile(mockStudent, [], guardian);
    expect(guide.language).toBe('en');
    expect(guide.htmlContent).toContain('Parent Socratic Coaching Guide');
  });

  it('auto-promotes to Arabic permanently when arabicRequestCount reaches 3 (3-Strike Rule)', () => {
    const guardian: Guardian = {
      id: 'g_1',
      name: 'Ahmed',
      studentIds: ['student_001'],
      preferredLanguage: 'en',
      arabicRequestCount: 3,
      messagingChannel: 'telegram',
      chatId: '12345'
    };

    const lang = SocraticGuideCompiler.resolveLanguage(guardian);
    expect(lang).toBe('ar');

    const guide = SocraticGuideCompiler.compile(mockStudent, [], guardian);
    expect(guide.language).toBe('ar');
    expect(guide.htmlContent).toContain('دليل التوجيه السقراطي لولي الأمر');
    expect(guide.htmlContent).toContain('dir="rtl"');
  });
});

describe('CanonicalDeduplicator', () => {
  it('creates master on first student upload and links second student without duplicate schema', () => {
    const context = {
      schoolId: 'asten-college',
      yearGroup: 'Y4',
      subjectId: 'maths',
      termWeek: 3
    };

    const items = [
      { qNum: '1', conceptCode: 'Y4.MATH.NPV.1', studentAnswer: '24006', correctAnswer: '24006', status: 'pass' as const },
      { qNum: '2', conceptCode: 'Y4.MATH.NPV.2', studentAnswer: '-4', correctAnswer: '-8', status: 'fail' as const }
    ];

    // First student: creates master
    const res1 = CanonicalDeduplicator.processSubmission(null, context, {
      studentId: 'student_001',
      rawScore: 1,
      totalScore: 2,
      percentage: 50,
      items,
      sourceImageUrls: ['https://storage/asten/s1.jpg']
    });

    expect(res1.isNewMaster).toBe(true);
    expect(res1.master.id).toContain('master_asten-college:Y4:maths:w3');
    expect(res1.master.schemaQuestions).toHaveLength(2);

    // Second student in same class: reuses existing master
    const res2 = CanonicalDeduplicator.processSubmission(res1.master, context, {
      studentId: 'student_002',
      rawScore: 2,
      totalScore: 2,
      percentage: 100,
      items,
      sourceImageUrls: ['https://storage/asten/s2.jpg']
    });

    expect(res2.isNewMaster).toBe(false);
    expect(res2.master.id).toBe(res1.master.id);
    expect(res2.submission.canonicalMasterId).toBe(res1.master.id);
    expect(res2.submission.studentId).toBe('student_002');
  });
});
