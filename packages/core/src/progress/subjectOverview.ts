import type { AssessmentSubmission, LmsSnapshot } from '@hex-aim/types';

import type { OverviewLang } from './familyOverview.js';
import { percentOf } from './familyOverview.js';

export interface SubjectStat {
  tests: number;
  avgPct: number;
  latestPct: number;
  latestDate: string;
}

/**
 * Collapse repeat copies of the same test. A test photo that is re-uploaded or
 * re-processed produces several records with the same subject, date, master and
 * item results. Those are one test, so they count once. Image URLs are merged so
 * no source is lost.
 */
export function dedupeAssessments(subs: AssessmentSubmission[]): AssessmentSubmission[] {
  const byKey = new Map<string, AssessmentSubmission>();
  for (const s of subs) {
    const itemSig = s.items.map((i) => `${i.qNum}:${i.status}`).join(',');
    const key = [s.subjectId, s.date, s.canonicalMasterId ?? s.id, s.rawScore, s.totalScore, itemSig].join('|');
    const kept = byKey.get(key);
    if (!kept) {
      byKey.set(key, { ...s, sourceImageUrls: [...s.sourceImageUrls] });
    } else {
      for (const url of s.sourceImageUrls) {
        if (!kept.sourceImageUrls.includes(url)) kept.sourceImageUrls.push(url);
      }
    }
  }
  return [...byKey.values()];
}

/** Per-subject test count, average and latest percentage, from de-duplicated tests only. */
export function subjectStats(subs: AssessmentSubmission[]): Record<string, SubjectStat> {
  const sums: Record<string, { sum: number; tests: number; latestPct: number; latestDate: string }> = {};
  for (const s of dedupeAssessments(subs)) {
    const pct = percentOf([s.rawScore, s.totalScore]);
    const cur = sums[s.subjectId];
    if (!cur) {
      sums[s.subjectId] = { sum: pct, tests: 1, latestPct: pct, latestDate: s.date };
    } else {
      cur.sum += pct;
      cur.tests += 1;
      if (s.date >= cur.latestDate) {
        cur.latestDate = s.date;
        cur.latestPct = pct;
      }
    }
  }
  const out: Record<string, SubjectStat> = {};
  for (const [k, v] of Object.entries(sums)) {
    out[k] = { tests: v.tests, avgPct: Math.round((v.sum / v.tests) * 100) / 100, latestPct: v.latestPct, latestDate: v.latestDate };
  }
  return out;
}

/** Subject name from an LMS label, e.g. "Maths Y4 A" -> "maths". Matches assessment subjectId. */
export function lmsSubjectKey(label: string): string {
  return label.replace(/\s+Y4\s+A$/i, '').trim().toLowerCase();
}

const DISPLAY: Record<string, { en: string; ar: string }> = {
  maths: { en: 'Maths', ar: 'الرياضيات' },
  english: { en: 'English', ar: 'الإنجليزية' },
  science: { en: 'Science', ar: 'العلوم' },
  humanities: { en: 'Humanities', ar: 'الإنسانيات' },
};

function display(key: string, lang: OverviewLang): string {
  return DISPLAY[key]?.[lang] ?? key.charAt(0).toUpperCase() + key.slice(1);
}

function pad(text: string, width: number): string {
  return text.length >= width ? text.slice(0, width) : text + ' '.repeat(width - text.length);
}

function lmsCell(snapshot: LmsSnapshot | null, key: string, child: 'Lara' | 'Maya'): string {
  if (!snapshot) return '—';
  const entry = Object.entries(snapshot.subjectProgress).find(([label]) => lmsSubjectKey(label) === key);
  const value = entry?.[1][child];
  return value === undefined ? '—' : `${value.toFixed(1)}%`;
}

function testCell(stat: SubjectStat | undefined): string {
  return stat ? `${stat.tests} · ${stat.avgPct.toFixed(0)}%` : '—';
}

/**
 * Family table for the bot. LMS overall figures come from the snapshot; test counts
 * and averages come from the stored assessments. A missing value shows a dash.
 */
export function renderSubjectOverview(
  snapshot: LmsSnapshot | null,
  laraSubs: AssessmentSubmission[],
  mayaSubs: AssessmentSubmission[],
  lang: OverviewLang,
): string {
  const laraStats = subjectStats(laraSubs);
  const mayaStats = subjectStats(mayaSubs);
  const keys = [...new Set([
    ...(snapshot ? Object.keys(snapshot.subjectProgress).map(lmsSubjectKey) : []),
    ...Object.keys(laraStats),
    ...Object.keys(mayaStats),
  ])].sort();
  const head = lang === 'ar'
    ? `${pad('المادة', 12)}│ لارا LMS │ لارا اختبارات │ مايا LMS │ مايا اختبارات`
    : `${pad('Subject', 12)}│ Lara LMS │ Lara tests   │ Maya LMS │ Maya tests`;
  const rows = keys.map((k) => [
    pad(display(k, lang), 12),
    pad(lmsCell(snapshot, k, 'Lara'), 9),
    pad(testCell(laraStats[k]), 13),
    pad(lmsCell(snapshot, k, 'Maya'), 9),
    testCell(mayaStats[k]),
  ].join('│ ').replace(/│ $/, ''));
  if (rows.length === 0) {
    return lang === 'ar'
      ? 'لا توجد نتائج مسجلة بعد. أرسل لقطات شاشة نتائج المدرسة أو صور الاختبارات.'
      : 'No results recorded yet. Send LMS screenshots or test photos to update this table.';
  }
  return [head, ...rows].join('\n');
}

/** Top error classes for one child, counted over de-duplicated tests. */
export function topErrors(subs: AssessmentSubmission[], limit = 3): { code: string; errorClass: string; count: number }[] {
  const counts = new Map<string, { code: string; errorClass: string; count: number }>();
  for (const s of dedupeAssessments(subs)) {
    for (const item of s.items) {
      if (item.status !== 'fail' || !item.errorClass || item.errorClass === 'NONE') continue;
      const key = `${item.conceptCode}|${item.errorClass}`;
      const cur = counts.get(key) ?? { code: item.conceptCode, errorClass: item.errorClass, count: 0 };
      cur.count += 1;
      counts.set(key, cur);
    }
  }
  return [...counts.values()].sort((a, b) => b.count - a.count).slice(0, limit);
}
