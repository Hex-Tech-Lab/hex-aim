import { describe, it, expect, beforeEach } from 'vitest';
import worker from '../src/worker.js';
import { StorageFactory, QueueFactory, MessagingFactory, VisionFactory, MockMessagingAdapter } from '@hex-aim/adapters';

describe('Apps/Bot Worker & Intake Pipeline', () => {
  beforeEach(() => {
    StorageFactory.reset();
    QueueFactory.reset();
    MessagingFactory.reset();
    VisionFactory.reset();
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

    expect(messaging.sentConfirmationCards).toHaveLength(1);
    expect(messaging.sentConfirmationCards[0]?.chatId).toBe('987654');
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
  });
});
