import { describe, expect, it } from 'vitest';
import type { AssessmentSubmission, LmsSnapshot } from '@hex-aim/types';
import {
  dedupeAssessments,
  lmsSubjectKey,
  renderSubjectOverview,
  subjectStats,
  topErrors,
} from '../src/progress/subjectOverview.js';

// Same test uploaded again under a new photo URL: identical content, new source.
function maths(photo: number): AssessmentSubmission {
  return {
    id: `sub_lara_maths_${photo}`,
    canonicalMasterId: 'master_asten-college:Y4:maths:w3',
    studentId: 'lara',
    subjectId: 'maths',
    date: '2026-10-25',
    termWeek: 3,
    rawScore: 1,
    totalScore: 3,
    percentage: 33,
    items: [
      { qNum: '1', conceptCode: 'Y4.MATH.NPV.EMPTY_COLUMNS', studentAnswer: '24,16', correctAnswer: '24,106', status: 'fail', errorClass: 'ERR_PHANTOM_ZERO', cognitiveFactor: 'empty_column_omission' },
      { qNum: '2', conceptCode: 'Y4.MATH.NPV.NEGATIVE_NUMBERS', studentAnswer: '-4, -1, 0, 3', correctAnswer: '-4, -1, 0, 3', status: 'pass', errorClass: 'NONE', cognitiveFactor: 'none' },
      { qNum: '3', conceptCode: 'Y4.MATH.NPV.WRITING_NUMBERS', studentAnswer: '03', correctAnswer: '30', status: 'fail', errorClass: 'ERR_TRANSPOSITION', cognitiveFactor: 'working_memory_rush' },
    ],
    sourceImageUrls: [`https://example.test/photos/file_${photo}.jpg`],
  };
}

const englishTest: AssessmentSubmission = {
  id: 'sub_maya_english_1',
  canonicalMasterId: 'master_asten-college:Y4:english:w1',
  studentId: 'maya',
  subjectId: 'english',
  date: '2026-10-26',
  termWeek: 1,
  rawScore: 14,
  totalScore: 15,
  percentage: 93,
  items: [
    { qNum: 'Vocab.B.3', conceptCode: 'Y4.ENG.VOCAB.CONTEXT', studentAnswer: 'braid', correctAnswer: 'braided', status: 'fail', errorClass: 'ERR_GRAMMAR_INFLECTION', cognitiveFactor: 'tense_agreement_omission' },
  ],
  sourceImageUrls: ['https://example.test/photos/maya_1.jpg'],
};

const snapshot: LmsSnapshot = {
  updated: '2026-11-11',
  subjectProgress: {
    'Maths Y4 A': { Lara: 82.7, Maya: 0 },
    'Humanities Y4 A': { Lara: 85.43, Maya: 90.62 },
  },
  records: [],
};

describe('dedupeAssessments', () => {
  it('counts 12 copies of one test as one test and keeps every photo URL', () => {
    const copies = Array.from({ length: 12 }, (_, i) => maths(i + 3));
    const unique = dedupeAssessments(copies);
    expect(unique).toHaveLength(1);
    expect(unique[0]?.sourceImageUrls).toHaveLength(12);
  });

  it('keeps tests on different dates separate', () => {
    const later = { ...maths(99), date: '2026-10-30' };
    expect(dedupeAssessments([maths(1), later])).toHaveLength(2);
  });
});

describe('subjectStats', () => {
  it('reports Lara maths as one test at 33%, not 12 tests', () => {
    const stats = subjectStats(Array.from({ length: 12 }, (_, i) => maths(i + 3)));
    expect(stats.maths).toEqual({ tests: 1, avgPct: 33.33, latestPct: 33.33, latestDate: '2026-10-25' });
  });
});

describe('lmsSubjectKey', () => {
  it('maps LMS labels to assessment subject ids', () => {
    expect(lmsSubjectKey('Maths Y4 A')).toBe('maths');
    expect(lmsSubjectKey('Arabic Social Studies Y4 A')).toBe('arabic social studies');
  });
});

describe('renderSubjectOverview', () => {
  it('shows real maths and English figures instead of "no data"', () => {
    const text = renderSubjectOverview(snapshot, Array.from({ length: 12 }, (_, i) => maths(i + 3)), [englishTest], 'en');
    const maths_row = text.split('\n').find((l) => l.startsWith('Maths'));
    expect(maths_row).toBeDefined();
    expect(maths_row).toContain('82.7%');
    expect(maths_row).toContain('1 · 33%');
    expect(text).not.toContain('no data');
    const english_row = text.split('\n').find((l) => l.startsWith('English'));
    expect(english_row).toContain('1 · 93%');
  });

  it('shows a dash where there is no figure, never an invented value', () => {
    const text = renderSubjectOverview(snapshot, [], [], 'en');
    const maths_row = text.split('\n').find((l) => l.startsWith('Maths'));
    expect(maths_row).toContain('—');
  });
});

describe('topErrors', () => {
  it('counts failing concepts once per test copy group', () => {
    const errs = topErrors(Array.from({ length: 12 }, (_, i) => maths(i + 3)));
    expect(errs[0]).toEqual({ code: 'Y4.MATH.NPV.EMPTY_COLUMNS', errorClass: 'ERR_PHANTOM_ZERO', count: 1 });
    expect(errs.find((e) => e.errorClass === 'NONE')).toBeUndefined();
  });
});
