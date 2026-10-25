import type { IncomingMessage, ServerResponse } from 'http';
import { AdaptiveSprintCompiler } from '@hex-aim/core';
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
    },
    {
      id: 'gap_2',
      studentId: 'student_001',
      conceptCode: 'Y4.MATH.NPV.NEGATIVE_NUMBERS',
      errorClass: 'ERR_NEGATIVE_MAGNITUDE_INVERSION',
      description: 'Applying positive intuition to negatives (orders -4°C as warmer than -1°C)',
      firstObservedDate: '2026-10-15',
      lastObservedDate: '2026-10-24',
      recurrenceCount: 2,
      status: 'progressing',
    },
  ];

  const sprint = AdaptiveSprintCompiler.compile(student, gaps, {
    sprintNumber: 3,
    subjectTitle: 'Mathematics',
  });

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.statusCode = 200;
  res.end(sprint.htmlContent);
}
