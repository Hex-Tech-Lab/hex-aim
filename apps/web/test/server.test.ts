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
});


