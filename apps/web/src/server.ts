import * as http from 'http';
import { renderDashboardHtml } from './ui/dashboardHtml.js';
import { StorageFactory } from '@hex-aim/adapters';
import { AdaptiveSprintCompiler, SocraticGuideCompiler } from '@hex-aim/core';
import type { Student, CognitiveGap } from '@hex-aim/types';

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

export function createServer(): http.Server {
  return http.createServer(async (req, res) => {
    const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);

    // Health check
    if (url.pathname === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', service: 'hex-aim-web', timestamp: new Date().toISOString() }));
      return;
    }

    // Interactive Console HTML
    if (url.pathname === '/' || url.pathname === '/index.html') {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(renderDashboardHtml());
      return;
    }

    // Sprint Preview / View
    if (url.pathname.startsWith('/sprint/')) {
      const student: Student = {
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
        siblingStudentIds: ['maya'],
      };

      const gaps: CognitiveGap[] = [
        {
          id: 'gap_1',
          studentId: 'lara',
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
          studentId: 'lara',
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

      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(sprint.htmlContent);
      return;
    }

    // Parent Socratic Guide Preview / View
    if (url.pathname.startsWith('/guide/')) {
      const student: Student = {
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
        siblingStudentIds: ['maya'],
      };

      const gaps: CognitiveGap[] = [
        {
          id: 'gap_1',
          studentId: 'lara',
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

      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(guide.htmlContent);
      return;
    }

    // API: list students
    if (url.pathname === '/api/students') {
      const storage = StorageFactory.getStorage();
      const students = await storage.listStudents();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(students));
      return;
    }

    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  });
}

// Start server if run directly
if (process.argv[1] && process.argv[1].endsWith('server.js')) {
  const server = createServer();
  server.listen(PORT, () => {
    console.log(`[hex-aim-web] Console listening on http://localhost:${PORT}`);
  });
}
