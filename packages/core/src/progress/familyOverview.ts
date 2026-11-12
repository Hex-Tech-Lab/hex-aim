import type { LmsRecord, LmsSnapshot } from '@hex-aim/types';

export type OverviewLang = 'en' | 'ar';

const LABELS: Record<OverviewLang, { overall: string; trend: string; humanities: string; science: string; maths: string; english: string; noData: string }> = {
  en: { overall: 'Humanities LMS', trend: 'Trend', humanities: 'Humanities', science: 'Science', maths: 'Maths', english: 'English', noData: 'no data' },
  ar: { overall: 'LMS إنسانيات', trend: 'الاتجاه', humanities: 'إنسانيات', science: 'العلوم', maths: 'الرياضيات', english: 'الإنجليزية', noData: 'لا بيانات' },
};

/** Percentage for one score pair, rounded to two decimals. */
export function percentOf([score, total]: [number, number]): number {
  return total === 0 ? 0 : Math.round((score / total) * 10000) / 100;
}

/** First and latest graded item (quiz or exam) for one child, by date. */
export function trendOf(records: LmsRecord[], child: 'Lara' | 'Maya'): { first: number; latest: number } | null {
  const graded = records
    .filter((r) => r.kind === 'quiz' || r.kind === 'exam')
    .sort((a, b) => (a.date === b.date ? a.item.localeCompare(b.item) : a.date < b.date ? -1 : 1));
  if (graded.length === 0) return null;
  const first = graded[0];
  const latest = graded[graded.length - 1];
  if (!first || !latest) return null;
  return { first: percentOf(first[child]), latest: percentOf(latest[child]) };
}

function colour(p: number): string {
  return p >= 90 ? '🟢' : p >= 75 ? '🟡' : '🔴';
}

function cell(p: number | null, width: number): string {
  const text = p === null ? '—' : `${p.toFixed(0)}% ${colour(p)}`;
  return text.padEnd(width);
}

/**
 * Render the family overview table for the bot. Every number comes from the
 * stored LMS snapshot. A subject with no recorded data shows a dash, never an
 * invented figure.
 */
export function renderFamilyOverview(snapshot: LmsSnapshot | null, lang: OverviewLang): string {
  const L = LABELS[lang];
  if (!snapshot || snapshot.records.length === 0) {
    return lang === 'ar'
      ? 'لا توجد نتائج مسجلة بعد. أرسل لقطات شاشة نتائج المدرسة لتحديث هذا الجدول.'
      : 'No school results recorded yet. Send LMS screenshots to update this table.';
  }
  const hum = snapshot.subjectProgress['Humanities Y4 A'];
  const lara = trendOf(snapshot.records, 'Lara');
  const maya = trendOf(snapshot.records, 'Maya');
  const rows = [
    `${L.overall.padEnd(16)}│ ${cell(hum?.Lara ?? null, 9)}│ ${cell(hum?.Maya ?? null, 9)}`,
    `${L.trend.padEnd(16)}│ ${(lara ? `${lara.first.toFixed(0)}→${lara.latest.toFixed(0)}%` : '—').padEnd(9)}│ ${(maya ? `${maya.first.toFixed(0)}→${maya.latest.toFixed(0)}%` : '—').padEnd(9)}`,
    `${L.science.padEnd(16)}│ ${L.noData.padEnd(9)}│ ${L.noData.padEnd(9)}`,
    `${L.maths.padEnd(16)}│ ${L.noData.padEnd(9)}│ ${L.noData.padEnd(9)}`,
    `${L.english.padEnd(16)}│ ${L.noData.padEnd(9)}│ ${L.noData.padEnd(9)}`,
  ];
  const head = lang === 'ar' ? 'المقياس'.padEnd(16) + '│ لارا     │ مايا' : 'Measure'.padEnd(16) + '│ Lara     │ Maya';
  return [head, ...rows].join('\n');
}
