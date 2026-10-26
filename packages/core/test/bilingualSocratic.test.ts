import { describe, it, expect } from 'vitest';
import { SocraticGuideCompiler } from '../src/compilers/SocraticGuideCompiler.js';
import type { Student, Guardian, CognitiveGap } from '@hex-aim/types';

describe('Wave 11: Bilingual Socratic Coaching Engine & 3-Strike Language Rule', () => {
  const mockStudent: Student = {
    id: 'lara',
    name: 'Lara',
    schoolId: 'asten-college',
    yearGroup: 'Y4',
    curriculumTrack: 'british',
    neuroProfile: {
      hasAdhdTraits: true,
      hasDyslexiaTraits: true,
      workingMemoryCapacity: 'vulnerable_under_time_pressure',
      optimalSprintDurationMins: 8,
    },
  };

  const mockGaps: CognitiveGap[] = [
    {
      id: 'gap_1',
      studentId: 'lara',
      conceptCode: 'Y4.MATH.NPV.EMPTY_COLUMNS',
      errorClass: 'ERR_PHANTOM_ZERO',
      description: 'Omits zero in unmentioned place-value rooms',
      firstObservedDate: '2026-10-24',
      lastObservedDate: '2026-10-26',
      recurrenceCount: 2,
      status: 'active_priority',
      socraticHint: 'Use the place value elevator to ensure room zero has a guard.',
    },
  ];

  it('enforces the 3-Strike Rule: permanently defaults to Arabic on 3rd request', () => {
    let guardian: Guardian = {
      id: 'guardian_123',
      chatId: '5055012900',
      name: 'Dad',
      preferredLanguage: 'bilingual',
      arabicRequestCount: 0,
      students: ['lara'],
    };

    // Strike 1
    guardian = SocraticGuideCompiler.recordLanguageRequest(guardian, 'ar');
    expect(guardian.arabicRequestCount).toBe(1);
    expect(SocraticGuideCompiler.resolveLanguage(guardian)).toBe('bilingual');

    // Strike 2
    guardian = SocraticGuideCompiler.recordLanguageRequest(guardian, 'ar');
    expect(guardian.arabicRequestCount).toBe(2);
    expect(SocraticGuideCompiler.resolveLanguage(guardian)).toBe('bilingual');

    // Strike 3 (Permanent Lock)
    guardian = SocraticGuideCompiler.recordLanguageRequest(guardian, 'ar');
    expect(guardian.arabicRequestCount).toBe(3);
    expect(guardian.preferredLanguage).toBe('ar');
    expect(SocraticGuideCompiler.resolveLanguage(guardian)).toBe('ar');
  });

  it('normalizes Egyptian Ministry of Education (MoE) clitics and tatweel characters', () => {
    const raw = 'كـتب  الطـالب  بـالقلم  والمسـألة  إلـى  الآحاد';
    const normalized = SocraticGuideCompiler.normalizeMoEClitics(raw);
    
    // Tatweel removed and hamzas normalized
    expect(normalized).not.toContain('ـ');
    expect(normalized).toContain('بالقلم');
    expect(normalized).toContain('كتب');
  });

  it('compiles Side-by-Side Bilingual layout with dual columns and fonts', () => {
    const guide = SocraticGuideCompiler.compile(mockStudent, mockGaps, undefined, {
      language: 'bilingual',
    });

    expect(guide.language).toBe('bilingual');
    expect(guide.htmlContent).toContain('class="bilingual-grid"');
    expect(guide.htmlContent).toContain('class="bilingual-col-en"');
    expect(guide.htmlContent).toContain('class="bilingual-col-ar"');
    expect(guide.htmlContent).toContain('What You Say:');
    expect(guide.htmlContent).toContain('ماذا تقول لابنك/ابنتك:');
    expect(guide.htmlContent).toContain('Nunito');
    expect(guide.htmlContent).toContain('Cairo');
  });

  it('compiles pure Arabic RTL layout when preferred language is ar', () => {
    const arabicGuardian: Guardian = {
      id: 'guardian_ar',
      chatId: '5055012900',
      name: 'أحمد',
      preferredLanguage: 'ar',
      arabicRequestCount: 3,
      students: ['lara'],
    };

    const guide = SocraticGuideCompiler.compile(mockStudent, mockGaps, arabicGuardian);

    expect(guide.language).toBe('ar');
    expect(guide.htmlContent).toContain('dir="rtl"');
    expect(guide.htmlContent).toContain('lang="ar"');
    expect(guide.htmlContent).toContain('دليل التوجيه السقراطي لولي الأمر');
  });
});
