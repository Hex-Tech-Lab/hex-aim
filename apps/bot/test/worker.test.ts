import { describe, it, expect, beforeEach } from 'vitest';
import worker from '../src/worker.js';
import { StorageFactory, QueueFactory, MessagingFactory, VisionFactory, MockMessagingAdapter } from '@hex-aim/adapters';

describe('Apps/Bot Worker & Intake Pipeline', () => {
  beforeEach(() => {
    StorageFactory.reset();
    QueueFactory.reset();
    MessagingFactory.reset();
    VisionFactory.reset();
    VisionFactory.getVision('mock');
  });

  it('GET /health returns 200 OK and service metadata', async () => {
    const req = new Request('https://worker/health', { method: 'GET' });
    const res = await worker.fetch(req, {}, {} as any);
    expect(res.status).toBe(200);

    const body = await res.json() as any;
    expect(body.status).toBe('ok');
    expect(body.project).toBe('hex-aim');
  });

  it('POST /webhook/telegram handles /start command', async () => {
    const messaging = MessagingFactory.getMessaging('mock') as MockMessagingAdapter;

    const req = new Request('https://worker/webhook/telegram', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: {
          chat: { id: 987654 },
          text: '/start',
        },
      }),
    });

    const res = await worker.fetch(req, {}, {} as any);
    expect(res.status).toBe(200);

    expect(messaging.sentMessages).toHaveLength(1);
    expect(messaging.sentMessages[0]?.chatId).toBe('987654');
    expect(messaging.sentMessages[0]?.text).toContain('Welcome to HEX-AIM');
  });

  it('POST /webhook/telegram receives photo, sends confirmation card, and enqueues job', async () => {
    const messaging = MessagingFactory.getMessaging('mock') as MockMessagingAdapter;

    const req = new Request('https://worker/webhook/telegram', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: {
          chat: { id: 987654 },
          photo: [
            { file_id: 'thumb_123', width: 100, height: 100 },
            { file_id: 'full_123', width: 800, height: 1000 },
          ],
        },
      }),
    });

    const res = await worker.fetch(req, {}, {} as any);
    expect(res.status).toBe(200);

    const body = await res.json() as any;
    expect(body.ok).toBe(true);
    expect(body.queued).toBe(true);
    expect(body.messageId).toBeTruthy();

    expect(messaging.sentMessages.length).toBeGreaterThan(0);
    expect(messaging.sentMessages[0]?.chatId).toBe('987654');
  });

  it('POST /jobs/process-assessment runs full pipeline and delivers remediation packs', async () => {
    const messaging = MessagingFactory.getMessaging('mock') as MockMessagingAdapter;

    const req = new Request('https://worker/jobs/process-assessment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId: 'student_pilot_01',
        chatId: '987654',
        imageUrls: ['https://example.com/quiz_p1.jpg'],
        subjectId: 'maths',
        yearGroup: 'Y4',
        termWeek: 2,
        schoolId: 'asten-college',
      }),
    });

    const res = await worker.fetch(req, {}, {} as any);
    expect(res.status).toBe(200);

    const body = await res.json() as any;
    expect(body.ok).toBe(true);
    expect(body.result.sprintId).toBeTruthy();
    expect(body.result.guideId).toBeTruthy();
    expect(body.result.score.total).toBeGreaterThan(0);

    // Verify pack delivery via messaging adapter
    expect(messaging.deliveredPacks).toHaveLength(1);
    expect(messaging.deliveredPacks[0]?.chatId).toBe('987654');
    const pack = messaging.deliveredPacks[0]?.packs as any;
    expect(pack.studentPackHtml).toContain('https://aim.getvintel.com/sprint/');
    expect(pack.coachingGuideHtml).toContain('https://aim.getvintel.com/guide/');
  }, 15000);

  it('POST /webhook/telegram handles /progress command and view_progress callback', async () => {
    const messaging = MessagingFactory.getMessaging('mock') as MockMessagingAdapter;

    // 1. Send /progress command
    const reqProgress = new Request('https://worker/webhook/telegram', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: {
          chat: { id: 987654 },
          text: '/progress',
        },
      }),
    });

    const resProgress = await worker.fetch(reqProgress, {}, {} as any);
    expect(resProgress.status).toBe(200);
    const lastMsg = messaging.sentMessages[messaging.sentMessages.length - 1];
    expect(lastMsg?.text).toContain('On-Demand Student Mastery & Progress');

    // 2. Click callback query view_progress:lara
    const reqCallbackLara = new Request('https://worker/webhook/telegram', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        callback_query: {
          id: 'cb_123',
          data: 'view_progress:lara',
          message: {
            chat: { id: 987654 },
            message_id: 111,
          },
        },
      }),
    });

    const resCbLara = await worker.fetch(reqCallbackLara, {}, {} as any);
    expect(resCbLara.status).toBe(200);
    const laraCard = messaging.sentMessages[messaging.sentMessages.length - 1];
    expect(laraCard?.text).toContain("Lara's Academic Mastery Snapshot");
    expect(laraCard?.text).toContain('ERR_PHANTOM_ZERO');

    // 3. Click callback query view_progress:maya
    const reqCallbackMaya = new Request('https://worker/webhook/telegram', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        callback_query: {
          id: 'cb_124',
          data: 'view_progress:maya',
          message: {
            chat: { id: 987654 },
            message_id: 112,
          },
        },
      }),
    });

    const resCbMaya = await worker.fetch(reqCallbackMaya, {}, {} as any);
    expect(resCbMaya.status).toBe(200);
    const mayaCard = messaging.sentMessages[messaging.sentMessages.length - 1];
    expect(mayaCard?.text).toContain("Maya's Academic Mastery Snapshot");
    expect(mayaCard?.text).toContain('ERR_SHARED_PREFIX_ORDERING');

    // 4. Click callback query view_progress:all (Side-by-side comparative card)
    const reqCallbackAll = new Request('https://worker/webhook/telegram', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        callback_query: {
          id: 'cb_125',
          data: 'view_progress:all',
          message: {
            chat: { id: 987654 },
            message_id: 113,
          },
        },
      }),
    });

    const resCbAll = await worker.fetch(reqCallbackAll, {}, {} as any);
    expect(resCbAll.status).toBe(200);
    const allCard = messaging.sentMessages[messaging.sentMessages.length - 1];
    expect(allCard?.text).toContain('Comparative Academic Snapshot • All Children');
    expect(allCard?.text).toContain('<pre>');
    expect(allCard?.text).toContain('Overall Mast.');
    expect(allCard?.text).toContain('SUBJECT MASTERY BREAKDOWN');
    expect(allCard?.text).toContain('Lara');
    expect(allCard?.text).toContain('Maya');
  });

  it('POST /api/telegram/acknowledge sends confirmation receipt to chat', async () => {
    const messaging = MessagingFactory.getMessaging('mock') as MockMessagingAdapter;

    const req = new Request('https://worker/api/telegram/acknowledge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chatId: '987654',
        taskNumber: 'TASK-101',
        action: 'Completed & Deployed',
        summary: 'Comparative All-Kids progress snapshot card active.',
      }),
    });

    const res = await worker.fetch(req, {}, {} as any);
    expect(res.status).toBe(200);
    const body = await res.json() as any;
    expect(body.ok).toBe(true);

    const lastMsg = messaging.sentMessages[messaging.sentMessages.length - 1];
    expect(lastMsg?.chatId).toBe('987654');
    expect(lastMsg?.text).toContain('AGY Session Acknowledged Receipt');
    expect(lastMsg?.text).toContain('TASK-101');
    expect(lastMsg?.text).toContain('Comparative All-Kids progress snapshot card active.');
  });

  it('Stage 1 vs Stage 2 Ingestion: emits scorecard first, compiles sprint only on demand', async () => {
    const messaging = MessagingFactory.getMessaging('mock') as MockMessagingAdapter;

    // Stage 1: Assessment processed without auto-compile
    const reqStage1 = new Request('https://worker/jobs/process-assessment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId: 'lara',
        chatId: '987654',
        imageUrls: ['https://example.com/quiz_science_1.jpg'],
        subjectId: 'science',
        termWeek: 8,
        autoCompileSprint: false,
      }),
    });

    const resStage1 = await worker.fetch(reqStage1, {}, {} as any);
    expect(resStage1.status).toBe(200);

    // Verify Scorecard was emitted in chat
    const scorecardMsg = messaging.sentMessages.find(m => m.text.includes('Assessment Diagnostic Scorecard'));
    expect(scorecardMsg).toBeTruthy();
    expect(scorecardMsg?.text).toContain('Assessment Diagnostic Scorecard: Lara');
    expect(scorecardMsg?.text).toContain('Science');

    // In Stage 1, zero PDF packs should be delivered
    expect(messaging.deliveredPacks).toHaveLength(0);

    // Stage 2: Parent taps "Generate Follow-up Sprint Now" callback
    const reqGenSprint = new Request('https://worker/webhook/telegram', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        callback_query: {
          id: 'cb_gen_sprint_1',
          data: 'gen_sprint:lara:science:8',
          message: {
            chat: { id: 987654 },
            message_id: 301,
          },
        },
      }),
    });

    const resGenSprint = await worker.fetch(reqGenSprint, {}, {} as any);
    expect(resGenSprint.status).toBe(200);

    // Now PDF packs must be delivered
    expect(messaging.deliveredPacks.length).toBeGreaterThan(0);
    expect(messaging.deliveredPacks[0]?.chatId).toBe('987654');
  });

  it('Stage 1 Defer: save_portfolio confirms save without compiling PDFs', async () => {
    const messaging = MessagingFactory.getMessaging('mock') as MockMessagingAdapter;

    const reqSave = new Request('https://worker/webhook/telegram', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        callback_query: {
          id: 'cb_save_1',
          data: 'save_portfolio:maya:maths:8',
          message: {
            chat: { id: 987654 },
            message_id: 401,
          },
        },
      }),
    });

    const resSave = await worker.fetch(reqSave, {}, {} as any);
    expect(resSave.status).toBe(200);

    const confirmMsg = messaging.sentMessages[messaging.sentMessages.length - 1];
    expect(confirmMsg?.text).toContain("Saved to Maya's Portfolio!");
    expect(messaging.deliveredPacks).toHaveLength(0);
  });
});
