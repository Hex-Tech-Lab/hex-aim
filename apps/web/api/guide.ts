import type { IncomingMessage, ServerResponse } from 'http';
import { SocraticGuideCompiler } from '@hex-aim/core';
import type { Student, CognitiveGap } from '@hex-aim/types';

export default function handler(_req: IncomingMessage, res: ServerResponse): void {
  const student: Student = {
    id: 'student_001',
    name: 'Student A',
    schoolId: 'asten-college',
    yearGroup: 'Y4',
    curriculumTrack: 'british',
    neuroProfile: {
      hasAdhdTraits: true,
      hasDyslexiaTraits: true,
      workingMemoryCapacity: 'vulnerable_under_time_pressure',
      optimalSprintDurationMins: 8,
    },
    siblingStudentIds: ['student_002'],
  };

  const gaps: CognitiveGap[] = [
    {
      id: 'gap_1',
      studentId: 'student_001',
      conceptCode: 'Y4.MATH.NPV.EMPTY_COLUMNS',
      errorClass: 'ERR_PHANTOM_ZERO',
      description: 'Omitting zeros in unmentioned place-value rooms (writes 24,16 for 24,106)',
      firstObservedDate: '2026-10-08',
      lastObservedDate: '2026-10-24',
      recurrenceCount: 3,
      status: 'active_priority',
      socraticHint: 'Ask: "If there are zero hundreds, who guards the hundreds chair?"',
    },
  ];

  const guide = SocraticGuideCompiler.compile(student, gaps, undefined, {
    language: 'bilingual',
    guardianName: 'Parent Coach',
  });

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.statusCode = 200;
  res.end(guide.htmlContent);
}
