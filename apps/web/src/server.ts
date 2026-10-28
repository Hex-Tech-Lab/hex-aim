import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { renderDashboardHtml } from './ui/dashboardHtml.js';
import { StorageFactory } from '@hex-aim/adapters';
import { AdaptiveSprintCompiler, SocraticGuideCompiler, StudentIdentityVault, CanonicalTemplateGenerator, WarmBrowserPoolCompiler, SocraticOralEvaluator, CognitiveDecayEngine } from '@hex-aim/core';
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

    // Wave 20 (Approach C): Live Vector PDF Micro-Service for Blank Templates
    if (url.pathname.startsWith('/api/template/') && url.pathname.endsWith('/pdf')) {
      const templateId = url.pathname.replace('/api/template/', '').replace('/pdf', '').trim();
      const t0 = Date.now();
      try {
        const pdfBytes = await CanonicalTemplateGenerator.compileToPdf(templateId);
        const duration = Date.now() - t0;
        res.writeHead(200, {
          'Content-Type': 'application/pdf',
          'Content-Length': pdfBytes.length,
          'Content-Disposition': `inline; filename="aim_worksheet_${templateId}.pdf"`,
          'X-AIM-Compiler-Latency-Ms': duration.toString(),
          'Access-Control-Allow-Origin': '*',
        });
        res.end(Buffer.from(pdfBytes));
      } catch (err: any) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, error: err?.message || String(err) }));
      }
      return;
    }

    // Wave 20: Standalone HTML Vector Preview for Blank Templates
    if (url.pathname.startsWith('/api/template/') && url.pathname.endsWith('/html')) {
      const templateId = url.pathname.replace('/api/template/', '').replace('/html', '').trim();
      const html = CanonicalTemplateGenerator.generateHtml(templateId);
      res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Length': Buffer.byteLength(html, 'utf8'),
        'Access-Control-Allow-Origin': '*',
      });
      res.end(html);
      return;
    }

    // Wave 20: Live Vector PDF Compilation for Adaptive Remediation Sprints
    if (url.pathname.startsWith('/api/sprint/') && url.pathname.endsWith('/pdf')) {
      const sprintId = url.pathname.replace('/api/sprint/', '').replace('/pdf', '').trim();
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
      ];

      const sprint = AdaptiveSprintCompiler.compile(student, gaps, {
        sprintNumber: 3,
        subjectTitle: 'Mathematics',
      });

      const t0 = Date.now();
      try {
        const pool = WarmBrowserPoolCompiler.getInstance();
        const pdfBytes = await pool.compileHtmlToPdf(sprint.htmlContent);
        const duration = Date.now() - t0;
        res.writeHead(200, {
          'Content-Type': 'application/pdf',
          'Content-Length': pdfBytes.length,
          'Content-Disposition': `inline; filename="aim_sprint_${sprintId || 'practice'}.pdf"`,
          'X-AIM-Compiler-Latency-Ms': duration.toString(),
          'Access-Control-Allow-Origin': '*',
        });
        res.end(Buffer.from(pdfBytes));
      } catch (err) {
        const pdfBytes = await CanonicalTemplateGenerator.generatePdfLibFallback('math-w8');
        res.writeHead(200, {
          'Content-Type': 'application/pdf',
          'Content-Length': pdfBytes.length,
          'Content-Disposition': `inline; filename="aim_sprint_${sprintId || 'practice'}.pdf"`,
          'Access-Control-Allow-Origin': '*',
        });
        res.end(Buffer.from(pdfBytes));
      }
      return;
    }

    // Wave 21: Socratic Oral Evaluation Endpoint
    if (url.pathname === '/api/socratic/evaluate-oral' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const payload = JSON.parse(body || '{}');
          const evaluator = SocraticOralEvaluator.getInstance();
          const evaluation = evaluator.evaluateOralTurn({
            transcript: payload.transcript || 'Zero guards the hundreds chair so the thousands room does not crash into tens.',
            drillQuestion: payload.drillQuestion || 'If there are zero hundreds in 24,106, who is guarding the hundreds chair?',
            targetConceptCode: payload.targetConceptCode || 'Y4.MATH.NPV.EMPTY_COLUMNS',
            expectedKeywords: payload.expectedKeywords || ['zero', 'guards', 'chair', 'hundreds', 'place-value'],
            commonMisconceptions: payload.commonMisconceptions || ['skip zero', 'no number'],
            studentName: payload.studentName || 'Lara',
          });

          res.writeHead(200, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          });
          res.end(JSON.stringify({ ok: true, evaluation }));
        } catch (err: any) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: false, error: err?.message || String(err) }));
        }
      });
      return;
    }

    // Wave 21: Socratic Audio Coaching Prompts (Bilingual Egyptian Arabic + English)
    if (url.pathname === '/api/socratic/audio-prompts') {
      const prompts = [
        {
          id: 'prompt_1',
          conceptCode: 'Y4.MATH.NPV.EMPTY_COLUMNS',
          title: 'Place Value Room Guard (Hundreds Chair)',
          targetStudent: 'lara',
          english: {
            title: 'Hundreds Chair Guard Script',
            hintText: 'Ask Lara: "If there are zero hundreds in 24,106, who is guarding the hundreds chair? Can the thousands room simply crash into the tens room?"',
            drillQuestion: 'Why must we write a zero in the hundreds column even if no hundreds are spoken?',
            expectedKeywords: ['zero', 'guards', 'chair', 'column', 'room', 'place-value'],
          },
          arabic: {
            title: 'حارس خانة المئات (نموذج الكرسي المحجوز)',
            hintText: 'قول للارا: "لو مفيش مئات في العدد ٢٤,١٠٦، مين اللي حارس كرسي المئات؟ هل ينفع خانة الآلاف تدخل في خانة العشرات على طول من غير حارس؟"',
            drillQuestion: 'ليه لازم نكتب صفر في خانة المئات حتى لو مش بننطقه؟',
            expectedKeywords: ['صفر', 'حارس', 'كرسي', 'خانة', 'مكان'],
          }
        },
        {
          id: 'prompt_2',
          conceptCode: 'Y4.MATH.NPV.5DIGIT_ORDERING',
          title: 'Prefix Ordering & Leading Digit Tie-Breakers',
          targetStudent: 'maya',
          english: {
            title: 'Prefix Comparison Strategy',
            hintText: 'Ask Maya: "When comparing 32,540 and 32,450, both start with 32 thousand. Which room breaks the tie?"',
            drillQuestion: 'How do you decide which 5-digit number is larger when their first two digits are identical?',
            expectedKeywords: ['hundreds', 'tie-breaker', 'prefix', 'compare', 'digits'],
          },
          arabic: {
            title: 'مقارنة الأرقام ذات البادئة المتطابقة',
            hintText: 'اسأل مايا: "لما نقارن ٣٢,٥٤٠ و ٣٢,٤٥٠، الاتنين بيبدأوا بـ ٣٢ ألف. أنهي خانة اللي بتحدد مين الأكبر؟"',
            drillQuestion: 'إزاي بنحدد الرقم الأكبر لما أول رقمين يكونوا متطابقين؟',
            expectedKeywords: ['مئات', 'مقارنة', 'خانة', 'أكبر'],
          }
        }
      ];
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      });
      res.end(JSON.stringify(prompts));
      return;
    }

    // Wave 22: Predictive Cognitive Mastery Decay API
    if (url.pathname.startsWith('/api/decay/')) {
      const parts = url.pathname.replace('/api/decay/', '').split('/');
      const studentId = parts[0] || 'lara';
      const isQueue = parts[1] === 'queue';
      const decayEngine = CognitiveDecayEngine.getInstance();

      if (isQueue) {
        const queue = decayEngine.generateSpacedRepetitionQueue(studentId);
        res.writeHead(200, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        });
        res.end(JSON.stringify({ studentId, queue, totalItems: queue.length }));
        return;
      }

      const records = decayEngine.getStudentDecayLedger(studentId);
      const profile = decayEngine.getProfile(studentId);
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      });
      res.end(JSON.stringify({ studentId, profile, records }));
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
