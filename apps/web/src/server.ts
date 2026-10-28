import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { renderDashboardHtml } from './ui/dashboardHtml.js';
import { renderExamSimulationHtml } from './ui/examSimulationHtml.js';
import { renderTeacherPortalHtml } from './ui/teacherPortalHtml.js';
import { StorageFactory } from '@hex-aim/adapters';
import { AdaptiveSprintCompiler, SocraticGuideCompiler, StudentIdentityVault, CanonicalTemplateGenerator, WarmBrowserPoolCompiler, SocraticOralEvaluator, CognitiveDecayEngine, SchoolMisSyncEngine, SocraticInpaintingEngine, PeerTeachingEngine, ExamSimulationEngine, TeacherPortalEngine, PrivacyVaultEngine } from '@hex-aim/core';
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

    // Wave 26: Full-Screen Adaptive Exam Simulation Interface
    if (url.pathname.startsWith('/exam/')) {
      const examId = url.pathname.replace('/exam/', '').trim() || 'exam_y4_sci_term1';
      const studentId = url.searchParams.get('student') || 'lara';
      const examEngine = ExamSimulationEngine.getInstance();
      const exam = examEngine.getExam(examId) || examEngine.getExam('exam_y4_sci_term1')!;

      const html = renderExamSimulationHtml(exam, studentId);
      res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Length': Buffer.byteLength(html, 'utf8'),
        'Access-Control-Allow-Origin': '*',
      });
      res.end(html);
      return;
    }

    // Wave 27: Teacher Institutional Analytics Portal Interface
    if (url.pathname.startsWith('/school/') && !url.pathname.startsWith('/school/api/')) {
      const schoolId = url.pathname.replace('/school/', '').trim() || 'asten-college';
      const yearGroup = url.searchParams.get('year') || 'Y4';
      const teacherEngine = TeacherPortalEngine.getInstance();
      const metrics = teacherEngine.getCohortMetrics(schoolId, yearGroup);

      const html = renderTeacherPortalHtml(metrics);
      res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Length': Buffer.byteLength(html, 'utf8'),
        'Access-Control-Allow-Origin': '*',
      });
      res.end(html);
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

    // Wave 23: 2-Way School MIS Integration & Telemetry API
    if (url.pathname.startsWith('/api/school/telemetry/')) {
      const schoolId = url.pathname.replace('/api/school/telemetry/', '').trim() || 'asten-college';
      const misEngine = SchoolMisSyncEngine.getInstance();
      const telemetry = misEngine.getSchoolTelemetry(schoolId);
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      });
      res.end(JSON.stringify(telemetry));
      return;
    }

    // Wave 27: Teacher Institutional Metrics & CSV Export APIs
    if (url.pathname.startsWith('/api/school/') && url.pathname.endsWith('/metrics')) {
      const schoolId = url.pathname.replace('/api/school/', '').replace('/metrics', '').trim() || 'asten-college';
      const yearGroup = url.searchParams.get('year') || 'Y4';
      const teacherEngine = TeacherPortalEngine.getInstance();
      const metrics = teacherEngine.getCohortMetrics(schoolId, yearGroup);

      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      });
      res.end(JSON.stringify({ ok: true, metrics }));
      return;
    }

    if (url.pathname.startsWith('/api/school/') && url.pathname.endsWith('/export.csv')) {
      const schoolId = url.pathname.replace('/api/school/', '').replace('/export.csv', '').trim() || 'asten-college';
      const yearGroup = url.searchParams.get('year') || 'Y4';
      const teacherEngine = TeacherPortalEngine.getInstance();
      const csv = teacherEngine.exportCohortCsv(schoolId, yearGroup);

      res.writeHead(200, {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${schoolId}_${yearGroup}_cohort_mastery.csv"`,
        'Access-Control-Allow-Origin': '*',
      });
      res.end(csv);
      return;
    }

    if (url.pathname.startsWith('/api/school/') && url.pathname.endsWith('/observation') && req.method === 'POST') {
      const schoolId = url.pathname.replace('/api/school/', '').replace('/observation', '').trim() || 'asten-college';
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const payload = body ? JSON.parse(body) : {};
          const teacherEngine = TeacherPortalEngine.getInstance();
          const result = teacherEngine.recordTeacherObservation(
            schoolId,
            payload.studentId || 'lara',
            payload.conceptCode || 'Y4.SCI.SND.MEDIUM',
            payload.observationNote || ''
          );
          res.writeHead(200, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          });
          res.end(JSON.stringify({ ok: true, result }));
        } catch (e: any) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: e.message }));
        }
      });
      return;
    }


    if (url.pathname === '/api/school/submissions') {
      const studentId = url.searchParams.get('studentId') || undefined;
      const misEngine = SchoolMisSyncEngine.getInstance();
      const submissions = misEngine.listSubmissions(studentId);
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      });
      res.end(JSON.stringify({ submissions, count: submissions.length }));
      return;
    }

    if (url.pathname.startsWith('/api/school/webhook/')) {
      const provider = url.pathname.replace('/api/school/webhook/', '').trim();
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const payload = body ? JSON.parse(body) : {};
          const misEngine = SchoolMisSyncEngine.getInstance();
          const result = misEngine.ingestClassworkSubmission({
            id: payload.id || `sub_ext_${Date.now()}`,
            schoolId: payload.schoolId || 'asten-college',
            studentId: payload.studentId || 'lara',
            assignmentId: payload.assignmentId || 'assign_ext',
            title: payload.title || 'External School Assignment',
            subjectId: payload.subjectId || 'science',
            termWeek: payload.termWeek || 8,
            submittedAt: new Date().toISOString(),
            rawGrade: payload.rawGrade || '80%',
            scannedWorkUrls: payload.scannedWorkUrls || [],
            teacherComments: payload.teacherComments || 'Ingested via School MIS Webhook'
          });
          res.writeHead(200, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          });
          res.end(JSON.stringify({ provider, ...result }));
        } catch (e: any) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: e.message }));
        }
      });
      return;
    }

    if (url.pathname === '/api/school/push-remediation' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const payload = body ? JSON.parse(body) : {};
          const misEngine = SchoolMisSyncEngine.getInstance();
          const syncResult = misEngine.pushRemediationToSchool({
            submissionId: payload.submissionId || 'sub_asten_y4_sci_w8_lara',
            studentId: payload.studentId || 'lara',
            schoolId: payload.schoolId || 'asten-college',
            remediationSprintId: payload.remediationSprintId || 'sprint_lara_sci_w8',
            resolvedConcepts: payload.resolvedConcepts || ['Y4.SCI.SND.MEDIUM'],
            postRemediationScore: payload.postRemediationScore || 94,
            homeFeedbackNotes: payload.homeFeedbackNotes || 'Socratic remediation completed at home.',
            syncedAt: '',
            status: 'pending'
          });
          res.writeHead(200, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          });
          res.end(JSON.stringify(syncResult));
        } catch (e: any) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: e.message }));
        }
      });
      return;
    }

    // Wave 24: Socratic Multi-Modal Inpainting API
    if (url.pathname.startsWith('/api/vision/inpainting/')) {
      const submissionId = url.pathname.replace('/api/vision/inpainting/', '').trim() || 'pkt-sci-w8';
      const pageNumber = Number(url.searchParams.get('page') || '1');
      const inpaintingEngine = SocraticInpaintingEngine.getInstance();
      const inpainting = inpaintingEngine.generateInpaintingOverlays(submissionId, pageNumber);

      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      });
      res.end(JSON.stringify({ ok: true, inpainting }));
      return;
    }

    // Wave 25: Sibling Cross-Teaching Collaboration Mode API
    if (url.pathname === '/api/collaboration/siblings') {
      const studentA = url.searchParams.get('studentA') || 'lara';
      const studentB = url.searchParams.get('studentB') || 'maya';
      const peerEngine = PeerTeachingEngine.getInstance();
      const pairing = peerEngine.generatePairing(studentA, studentB);

      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      });
      res.end(JSON.stringify({ ok: true, pairing }));
      return;
    }

    if (url.pathname === '/api/collaboration/evaluate' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const payload = body ? JSON.parse(body) : {};
          const peerEngine = PeerTeachingEngine.getInstance();
          const evaluation = peerEngine.evaluatePeerInteraction(
            payload.cardId || 'peer_card_lara_science_Y4_SCI_SND_MEDIUM',
            payload.tutorExplanation || '',
            payload.learnerResponse || ''
          );
          res.writeHead(200, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          });
          res.end(JSON.stringify({ ok: true, evaluation }));
        } catch (e: any) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: e.message }));
        }
      });
      return;
    }

    // Wave 26: Exam Simulation APIs
    if (url.pathname.startsWith('/api/exam/')) {
      const parts = url.pathname.replace('/api/exam/', '').split('/');
      const examId = parts[0] || 'exam_y4_sci_term1';
      const isSubmit = parts[1] === 'submit';
      const examEngine = ExamSimulationEngine.getInstance();

      if (isSubmit && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
          try {
            const payload = body ? JSON.parse(body) : {};
            const result = examEngine.gradeExam(
              examId,
              payload.studentId || 'lara',
              payload.answers || {},
              Number(payload.timeSpentSeconds) || 300,
              Number(payload.adhdPausesTaken) || 0
            );
            res.writeHead(200, {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            });
            res.end(JSON.stringify({ ok: true, result }));
          } catch (e: any) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: e.message }));
          }
        });
        return;
      }

      const exam = examEngine.getExam(examId);
      if (!exam) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Exam not found' }));
        return;
      }

      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      });
      res.end(JSON.stringify({ ok: true, exam }));
      return;
    }

    // Wave 28: Zero-Knowledge Student Privacy Vault APIs
    if (url.pathname === '/api/privacy/status') {
      const vault = PrivacyVaultEngine.getInstance();
      const status = vault.getStatus();
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      });
      res.end(JSON.stringify({ ok: true, status }));
      return;
    }

    if (url.pathname === '/api/privacy/audit-logs') {
      const vault = PrivacyVaultEngine.getInstance();
      const logs = vault.getAuditLogs();
      const isIntegrityIntact = vault.verifyAuditTrailIntegrity();
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      });
      res.end(JSON.stringify({ ok: true, isIntegrityIntact, logsCount: logs.length, logs }));
      return;
    }

    if (url.pathname === '/api/privacy/pseudonymize' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', async () => {
        try {
          const payload = body ? JSON.parse(body) : {};
          const vault = PrivacyVaultEngine.getInstance();
          const pii = payload.pii || {
            studentId: 'lara',
            fullName: 'Lara Sherif',
            guardianName: 'Sherif Kelly',
            guardianPhone: '+201001234567',
            nationalIdMasked: '2980101******8',
            schoolName: 'Asten College',
            dateOfBirth: '2016-04-12'
          };
          const pseudonymized = await vault.pseudonymizeProfile(pii, payload.neuroProfile || {}, payload.yearGroup || 'Y4');
          const redactedPrompt = payload.prompt ? vault.redactPromptForLlm(payload.prompt, pii, pseudonymized.pseudonymToken) : '';

          res.writeHead(200, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          });
          res.end(JSON.stringify({ ok: true, pseudonymized, redactedPrompt }));
        } catch (e: any) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: e.message }));
        }
      });
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
