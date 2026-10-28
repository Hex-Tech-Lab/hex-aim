import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import * as http from 'http';
import { createServer } from '../src/server.js';

describe('Apps/Web HTTP Server & Console', () => {
  let server: http.Server;
  let baseUrl: string;

  beforeAll(async () => {
    server = createServer();
    await new Promise<void>((resolve) => {
      server.listen(0, () => {
        const addr = server.address() as any;
        baseUrl = `http://localhost:${addr.port}`;
        resolve();
      });
    });
  });

  afterAll(async () => {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  });

  it('GET /health returns 200 OK', async () => {
    const res = await fetch(`${baseUrl}/health`);
    expect(res.status).toBe(200);
    const body = await res.json() as any;
    expect(body.status).toBe('ok');
    expect(body.service).toBe('hex-aim-web');
  });

  it('GET / returns Dashboard HTML with metrics, deduplication gate, and regional infrastructure', async () => {
    const res = await fetch(`${baseUrl}/`);
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain('HEX-AIM');
    expect(html).toContain('Asten College');
    expect(html).toContain('Active Priority');
    expect(html).toContain('Lara');
    expect(html).toContain('Maya');
    expect(html).toContain('Deduplication Gate');
    expect(html).toContain('cdg1 (Paris)');
    expect(html).toContain('aim-bot.getvintel.com');
    // Tabs 4 & 5
    expect(html).toContain('Scanned Submissions (52)');
    expect(html).toContain('Blank Templates & Dry-Runs');
    expect(html).toContain('tab-submissions-register');
    expect(html).toContain('tab-blank-templates');
    expect(html).toContain('The Blank Template Dilemma: Vector Re-Synthesis vs. Naive Inpainting');
    expect(html).toContain('Grouped by Test Packet (8)');
    expect(html).toContain('Flat Physical Pages (52)');
  });

  it('GET /sprint/preview renders 4-page adaptive print sprint', async () => {
    const res = await fetch(`${baseUrl}/sprint/preview`);
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain('Phase 1: Rapid Warmup');
    expect(html).toContain('Phase 2: Target Medicine');
    expect(html).toContain('Page 1 of 4');
    expect(html).toContain('Page 4 of 4');
  });

  it('GET /guide/preview renders parent Socratic guide', async () => {
    const res = await fetch(`${baseUrl}/guide/preview`);
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain('Socratic Coaching Guide');
    expect(html).toContain('Golden Rule: Never Give Away the Answer');
  });

  it('GET /api/students returns JSON student list', async () => {
    const res = await fetch(`${baseUrl}/api/students`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
  });

  it('GET /api/mastery/:studentUid returns live cognitive mastery payload', async () => {
    const resLara = await fetch(`${baseUrl}/api/mastery/lara`);
    expect(resLara.status).toBe(200);
    const dataLara = await resLara.json() as any;
    expect(dataLara.studentUid).toBe('stu_01j9ax8001lara');
    expect(dataLara.displayName).toBe('Lara');
    expect(dataLara.subjectMasteries.science).toBe(94);

    const resMaya = await fetch(`${baseUrl}/api/mastery/stu_01j9ax8002maya`);
    expect(resMaya.status).toBe(200);
    const dataMaya = await resMaya.json() as any;
    expect(dataMaya.studentUid).toBe('stu_01j9ax8002maya');
    expect(dataMaya.displayName).toBe('Maya');
    expect(dataMaya.subjectMasteries.science).toBe(96);
  });

  it('GET /api/decay/:studentId returns cognitive decay ledger and profile', async () => {
    const res = await fetch(`${baseUrl}/api/decay/lara`);
    expect(res.status).toBe(200);
    const data = await res.json() as any;
    expect(data.studentId).toBe('lara');
    expect(data.profile.hasAdhdFocusAccommodations).toBe(true);
    expect(Array.isArray(data.records)).toBe(true);
    expect(data.records.length).toBeGreaterThan(0);
  });

  it('GET /api/decay/:studentId/queue returns prioritized micro-sprint queue', async () => {
    const res = await fetch(`${baseUrl}/api/decay/lara/queue`);
    expect(res.status).toBe(200);
    const data = await res.json() as any;
    expect(data.studentId).toBe('lara');
    expect(Array.isArray(data.queue)).toBe(true);
    expect(data.queue[0].recommendedDurationMins).toBe(8); // Lara 8m ADHD micro-sprint
  });

  it('GET /api/school/telemetry/:schoolId returns real-time MIS status', async () => {
    const res = await fetch(`${baseUrl}/api/school/telemetry/asten-college`);
    expect(res.status).toBe(200);
    const data = await res.json() as any;
    expect(data.schoolId).toBe('asten-college');
    expect(data.isOnline).toBe(true);
    expect(data.provider).toBe('sims');
    expect(Array.isArray(data.activeClassworkLinks)).toBe(true);
  });

  it('GET /api/school/submissions lists ingested classwork papers', async () => {
    const res = await fetch(`${baseUrl}/api/school/submissions?studentId=lara`);
    expect(res.status).toBe(200);
    const data = await res.json() as any;
    expect(data.count).toBeGreaterThan(0);
    expect(data.submissions[0].studentId).toBe('lara');
    expect(data.submissions[0].teacherComments).toBeDefined();
  });

  it('POST /api/school/push-remediation pushes completed home results to gradebook', async () => {
    const res = await fetch(`${baseUrl}/api/school/push-remediation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        submissionId: 'sub_asten_y4_sci_w8_lara',
        studentId: 'lara',
        schoolId: 'asten-college',
        remediationSprintId: 'sprint_lara_sci_w8',
        resolvedConcepts: ['Y4.SCI.SND.MEDIUM'],
        postRemediationScore: 94,
        homeFeedbackNotes: 'Completed Socratic sprint with Dad'
      })
    });
    expect(res.status).toBe(200);
    const data = await res.json() as any;
    expect(data.synced).toBe(true);
    expect(data.confirmationCode).toContain('MIS-SYNC-ASTEN-COLLEGE');
  });

  it('GET /api/vision/inpainting/:submissionId returns vector bounding-box overlays and Socratic hint', async () => {
    const res = await fetch(`${baseUrl}/api/vision/inpainting/pkt-sci-w8?page=1`);
    expect(res.status).toBe(200);
    const data = await res.json() as any;
    expect(data.ok).toBe(true);
    expect(data.inpainting.detectedErrorsCount).toBeGreaterThan(0);
    expect(data.inpainting.overlays[0].conceptId).toBe('Y4.SCI.SND.MEDIUM');
    expect(data.inpainting.overlays[0].boundingBox.label).toBeDefined();
    expect(data.inpainting.overlays[0].svgScaffoldSnippet).toContain('GAS / AIR');
  });

  it('GET /api/collaboration/siblings returns reciprocal Socratic pairing for Lara & Maya', async () => {
    const res = await fetch(`${baseUrl}/api/collaboration/siblings?studentA=lara&studentB=maya`);
    expect(res.status).toBe(200);
    const data = await res.json() as any;
    expect(data.ok).toBe(true);
    expect(data.pairing.activeCardsCount).toBe(2);
    expect(data.pairing.primaryPairing.scienceLead.tutorStudentName).toBe('Lara');
    expect(data.pairing.primaryPairing.mathsLead.tutorStudentName).toBe('Maya');
    expect(data.pairing.primaryPairing.scienceLead.hookPrompt.ar).toBeDefined();
  });

  it('POST /api/collaboration/evaluate grades peer discovery interaction', async () => {
    const res = await fetch(`${baseUrl}/api/collaboration/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cardId: 'peer_card_lara_science_Y4_SCI_SND_MEDIUM',
        tutorExplanation: 'Sound waves need particles to vibrate',
        learnerResponse: 'Because sound cannot travel in a vacuum!'
      })
    });
    expect(res.status).toBe(200);
    const data = await res.json() as any;
    expect(data.ok).toBe(true);
    expect(data.evaluation.success).toBe(true);
    expect(data.evaluation.confidenceGain).toBe(15);
    expect(data.evaluation.feedback.ar).toContain('موجة ميكانيكية');
  });

  it('GET /exam/:id renders full-screen distraction-free testing environment', async () => {
    const res = await fetch(`${baseUrl}/exam/exam_y4_sci_term1?student=lara`);
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain('AIM Exam Simulator');
    expect(html).toContain('Pause & Breathe');
    expect(html).toContain('Through which of the following states of matter');
  });

  it('GET /api/exam/:id returns structured exam schema', async () => {
    const res = await fetch(`${baseUrl}/api/exam/exam_y4_sci_term1`);
    expect(res.status).toBe(200);
    const data = await res.json() as any;
    expect(data.ok).toBe(true);
    expect(data.exam.questions.length).toBe(4);
    expect(data.exam.totalTimeMins).toBe(15);
  });

  it('POST /api/exam/:id/submit grades answers and returns percentage and feedback', async () => {
    const res = await fetch(`${baseUrl}/api/exam/exam_y4_sci_term1/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId: 'lara',
        answers: { q_sci_01: 'A', q_sci_02: 'B', q_sci_03: 'A', q_sci_04: 'A' },
        timeSpentSeconds: 380,
        adhdPausesTaken: 1
      })
    });
    expect(res.status).toBe(200);
    const data = await res.json() as any;
    expect(data.ok).toBe(true);
    expect(data.result.score).toBe(100);
    expect(data.result.passed).toBe(true);
    expect(data.result.feedback.ar).toContain('أداء رائع');
  });

  it('GET /school/:id renders teacher institutional diagnostic console', async () => {
    const res = await fetch(`${baseUrl}/school/asten-college?year=Y4`);
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain('Asten College');
    expect(html).toContain('Macro Diagnostic Concept Heatmap');
    expect(html).toContain('Student Roster & Sensory Scaffolds');
  });

  it('GET /api/school/:id/metrics returns aggregated cohort metrics', async () => {
    const res = await fetch(`${baseUrl}/api/school/asten-college/metrics?year=Y4`);
    expect(res.status).toBe(200);
    const data = await res.json() as any;
    expect(data.ok).toBe(true);
    expect(data.metrics.totalStudents).toBe(5);
    expect(data.metrics.conceptHeatmap.length).toBeGreaterThan(0);
  });

  it('GET /api/school/:id/export.csv downloads formatted CSV roster', async () => {
    const res = await fetch(`${baseUrl}/api/school/asten-college/export.csv?year=Y4`);
    expect(res.status).toBe(200);
    const csv = await res.text();
    expect(csv).toContain('Student ID,Student Name,Year Group');
    expect(csv).toContain('"Lara"');
  });

  it('POST /api/school/:id/observation records teacher observation', async () => {
    const res = await fetch(`${baseUrl}/api/school/asten-college/observation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId: 'lara',
        conceptCode: 'Y4.SCI.SND.MEDIUM',
        observationNote: 'Demonstrated solid grasp during small group discussion.'
      })
    });
    expect(res.status).toBe(200);
    const data = await res.json() as any;
    expect(data.ok).toBe(true);
    expect(data.result.recorded).toBe(true);
  });

  it('GET /api/privacy/status returns cryptographic vault health and compliance standards', async () => {
    const res = await fetch(`${baseUrl}/api/privacy/status`);
    expect(res.status).toBe(200);
    const data = await res.json() as any;
    expect(data.ok).toBe(true);
    expect(data.status.vaultInitialized).toBe(true);
    expect(data.status.activeKeyAlgorithm).toBe('AES-256-GCM');
    expect(data.status.pbkdf2Iterations).toBe(100000);
    expect(data.status.auditTrailIntegrity).toBe('intact');
    expect(data.status.complianceStandards).toContain('Egyptian Data Protection Law No. 151/2020');
  });

  it('GET /api/privacy/audit-logs verifies SHA-256 tamper-evident hash chain', async () => {
    const res = await fetch(`${baseUrl}/api/privacy/audit-logs`);
    expect(res.status).toBe(200);
    const data = await res.json() as any;
    expect(data.ok).toBe(true);
    expect(data.isIntegrityIntact).toBe(true);
    expect(data.logsCount).toBeGreaterThan(0);
    expect(data.logs[0].hashChain).toBeDefined();
  });

  it('POST /api/privacy/pseudonymize generates ephemeral token and redacts PII from prompt', async () => {
    const res = await fetch(`${baseUrl}/api/privacy/pseudonymize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: 'Grade paper for Lara Sherif. Contact Sherif Kelly at +201001234567.',
        yearGroup: 'Y4'
      })
    });
    expect(res.status).toBe(200);
    const data = await res.json() as any;
    expect(data.ok).toBe(true);
    expect(data.pseudonymized.pseudonymToken).toMatch(/^stu_anon_/);
    expect(data.redactedPrompt).not.toContain('Lara Sherif');
    expect(data.redactedPrompt).toContain(data.pseudonymized.pseudonymToken);
    expect(data.redactedPrompt).toContain('[GUARDIAN_COACH]');
  });
});







