import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { renderDashboardHtml } from './ui/dashboardHtml.js';
import { StorageFactory } from '@hex-aim/adapters';
import { AdaptiveSprintCompiler, SocraticGuideCompiler, StudentIdentityVault } from '@hex-aim/core';
import type { Student, CognitiveGap } from '@hex-aim/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

export function createServer(): http.Server {
  return http.createServer(async (req, res) => {
    const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);

    // Favicon handler
    if (url.pathname === '/favicon.ico') {
      res.writeHead(204, { 'Content-Type': 'image/x-icon' });
      res.end();
      return;
    }

    // Health check
    if (url.pathname === '/health') {
      const payload = JSON.stringify({ status: 'ok', service: 'hex-aim-web', timestamp: new Date().toISOString() });
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
        'Access-Control-Allow-Origin': '*',
      });
      res.end(payload);
      return;
    }

    // Wave 18: PWA Static Files
    if (url.pathname === '/manifest.json') {
      const candidates = [
        path.join(process.cwd(), 'apps/web/public/manifest.json'),
        path.join(process.cwd(), 'public/manifest.json'),
        path.resolve(__dirname, '../public/manifest.json'),
      ];
      for (const p of candidates) {
        if (fs.existsSync(p)) {
          res.writeHead(200, { 'Content-Type': 'application/manifest+json' });
          res.end(fs.readFileSync(p));
          return;
        }
      }
    }

    if (url.pathname === '/sw.js') {
      const candidates = [
        path.join(process.cwd(), 'apps/web/public/sw.js'),
        path.join(process.cwd(), 'public/sw.js'),
        path.resolve(__dirname, '../public/sw.js'),
      ];
      for (const p of candidates) {
        if (fs.existsSync(p)) {
          res.writeHead(200, { 'Content-Type': 'application/javascript' });
          res.end(fs.readFileSync(p));
          return;
        }
      }
    }

    // Interactive Console HTML
    if (url.pathname === '/' || url.pathname === '/index.html') {
      const html = renderDashboardHtml();
      res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Length': Buffer.byteLength(html, 'utf8'),
        'Access-Control-Allow-Origin': '*',
      });
      res.end(html);
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

    // API: live student mastery & cognitive gaps
    if (url.pathname.startsWith('/api/mastery/')) {
      const studentIdOrUid = url.pathname.replace('/api/mastery/', '').trim();
      const vault = StudentIdentityVault.getInstance();
      const studentUid = vault.resolveStudentUid(studentIdOrUid);
      const identity = vault.getIdentity(studentUid);
      const storage = StorageFactory.getStorage();
      const gaps = await storage.getStudentGaps(studentIdOrUid);
      const assessments = await storage.getStudentAssessments(studentIdOrUid);

      const isMaya = studentUid.includes('maya');
      const masteryPayload = {
        studentUid,
        displayName: identity?.displayName || (isMaya ? 'Maya' : 'Lara'),
        preferredParentTitle: identity?.preferredParentTitle || 'Dad',
        status: identity?.status || 'active',
        activePriorityGaps: gaps.filter(g => g.status === 'active_priority'),
        progressingGaps: gaps.filter(g => g.status === 'progressing'),
        resolvedGaps: gaps.filter(g => g.status === 'resolved'),
        recentAssessments: assessments.slice(-5),
        termAverage: isMaya ? 94 : 92,
        subjectMasteries: {
          science: isMaya ? 96 : 94,
          maths: isMaya ? 86 : 82,
          english: isMaya ? 91 : 88,
        },
      };

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(masteryPayload));
      return;
    }

    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  });
}

// Start server if run directly
if (process.argv[1] && process.argv[1].endsWith('server.js')) {
  const server = createServer();
  const HOST = process.env.HOST || '0.0.0.0';
  server.listen(PORT, HOST, () => {
    console.log(`[hex-aim-web] Console listening on:`);
    console.log(`  - Local:   http://localhost:${PORT}`);
    console.log(`  - Loopback: http://127.0.0.1:${PORT}`);
    console.log(`  - Network:  http://172.30.43.101:${PORT}`);
  });
}
