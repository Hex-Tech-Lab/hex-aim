import { describe, expect, it } from 'vitest';
import type { LmsSnapshot } from '@hex-aim/types';
import { percentOf, renderFamilyOverview, trendOf } from '../src/progress/familyOverview.js';

const snapshot: LmsSnapshot = {
  updated: '2026-11-11',
  subjectProgress: { 'Humanities Y4 A': { Lara: 85.43, Maya: 90.62 } },
  records: [
    { subject: 'Humanities Y4 A', item: 'S1W3 Quiz 1-2', date: '2026-09-24', kind: 'quiz', Lara: [9, 10], Maya: [8, 10] },
    { subject: 'Humanities Y4 A', item: 'S1W5 Quiz 2-3', date: '2026-10-07', kind: 'quiz', Lara: [3, 6], Maya: [5, 6] },
    { subject: 'Unlabelled', item: 'S1MID1-4', date: '2026-11-10', kind: 'exam', Lara: [25, 30], Maya: [29, 30] },
  ],
};

describe('percentOf', () => {
  it('rounds to two decimals and guards zero totals', () => {
    expect(percentOf([25, 30])).toBe(83.33);
    expect(percentOf([29, 30])).toBe(96.67);
    expect(percentOf([0, 0])).toBe(0);
  });
});

describe('trendOf', () => {
  it('takes first and latest graded item by date', () => {
    expect(trendOf(snapshot.records, 'Lara')).toEqual({ first: 90, latest: 83.33 });
    expect(trendOf(snapshot.records, 'Maya')).toEqual({ first: 80, latest: 96.67 });
  });
  it('returns null when nothing is graded', () => {
    expect(trendOf([], 'Lara')).toBeNull();
  });
});

describe('renderFamilyOverview', () => {
  it('shows stored figures, not constants', () => {
    const out = renderFamilyOverview(snapshot, 'en');
    expect(out).toContain('85%');
    expect(out).toContain('91%');
    expect(out).not.toContain('94%');
    expect(out).not.toContain('96% 🟢');
  });
  it('shows a dash and no invented figure for subjects without data', () => {
    const out = renderFamilyOverview(snapshot, 'en');
    expect(out).toContain('Science');
    expect(out).toContain('no data');
  });
  it('says so plainly when no snapshot exists', () => {
    expect(renderFamilyOverview(null, 'en')).toMatch(/No school results recorded yet/);
    expect(renderFamilyOverview(null, 'ar')).toMatch(/لا توجد نتائج/);
  });
});
