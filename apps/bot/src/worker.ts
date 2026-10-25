import { QueueFactory, MessagingFactory, StorageFactory } from '@hex-aim/adapters';
import { IntakeDeduplicator, SettingsManager } from '@hex-aim/core';
import { processAssessmentJob, type ProcessAssessmentPayload } from './jobs/processAssessment.js';

export interface Env {
  STORAGE_PROVIDER?: string;
  MESSAGING_PROVIDER?: string;
  QUEUE_PROVIDER?: string;
  VISION_PROVIDER?: string;
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_SECRET_TOKEN?: string;
  QSTASH_TOKEN?: string;
  UPSTASH_REDIS_REST_URL?: string;
  UPSTASH_REDIS_REST_TOKEN?: string;
  GEMINI_API_KEY?: string;
}

export default {
  async fetch(request: Request, env: Env, _ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // Bind Worker Secrets & Env into SettingsManager
    const settings = SettingsManager.getInstance();
    if (env.TELEGRAM_BOT_TOKEN) settings.set('TELEGRAM_BOT_TOKEN', env.TELEGRAM_BOT_TOKEN);
    if (env.UPSTASH_REDIS_REST_URL) settings.set('UPSTASH_REDIS_REST_URL', env.UPSTASH_REDIS_REST_URL);
    if (env.UPSTASH_REDIS_REST_TOKEN) settings.set('UPSTASH_REDIS_REST_TOKEN', env.UPSTASH_REDIS_REST_TOKEN);
    if (env.QSTASH_TOKEN) settings.set('QSTASH_TOKEN', env.QSTASH_TOKEN);
    if (env.GEMINI_API_KEY) settings.set('GEMINI_API_KEY', env.GEMINI_API_KEY);
    MessagingFactory.reset(); // refresh with dynamic token

    // Health check
    if (url.pathname === '/health' || url.pathname === '/') {
      return new Response(JSON.stringify({
        status: 'ok',
        project: 'hex-aim',
        service: 'edge-intake-worker',
        timestamp: new Date().toISOString(),
      }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Telegram Webhook Intake
    if (url.pathname === '/webhook/telegram' && request.method === 'POST') {
      try {
        const body = await request.json() as any;
        const message = body?.message;

        if (!message) {
          return new Response(JSON.stringify({ ok: true, note: 'ignored_non_message' }), {
            headers: { 'Content-Type': 'application/json' },
          });
        }

        const chatId = String(message.chat?.id || '');
        const text = String(message.text || '');
        const photos = message.photo;
        const messaging = MessagingFactory.getMessaging();

        // 1. Text commands
        if (text.startsWith('/start')) {
          await messaging.sendMessage(chatId, 
            `👋 <b>Welcome to HEX-AIM (Adaptive Individualized Mastery)!</b>\n\n` +
            `We turn milestone quizzes into <b>targeted 4-page sprints (6–10 mins)</b> for your child.\n\n` +
            `📸 <b>To begin:</b> Take a clear photo of your child's marked weekly quiz and send it here!`
          );
          return new Response(JSON.stringify({ ok: true, action: 'welcome_sent' }), {
            headers: { 'Content-Type': 'application/json' },
          });
        }

        // 2. Photo intake (Assessment upload)
        if (photos && Array.isArray(photos) && photos.length > 0) {
          // Select largest photo resolution
          const largestPhoto = photos[photos.length - 1];
          const fileId = largestPhoto.file_id;
          const fileUniqueId = largestPhoto.file_unique_id || fileId;
          const dummyImageUrl = `https://api.telegram.org/file/bot/placeholder/${fileId}.jpg`;
          const guardianId = `guardian_${chatId}`;

          // Intake Deduplication & Strike Interception Gate
          const storage = StorageFactory.getStorage();
          const settings = SettingsManager.getInstance();

          const dedupCheck = await IntakeDeduplicator.evaluateUpload(
            {
              guardianId,
              fileIdentifier: fileUniqueId,
              metadata: {
                filename: `telegram_photo_${fileUniqueId}.jpg`,
                fileSize: largestPhoto.file_size,
              },
            },
            storage,
            settings
          );

          if (dedupCheck.isDuplicate) {
            // Intercepted at Edge Gate: Zero LLM / Vision Tokens burned
            if (dedupCheck.userMessage) {
              await messaging.sendMessage(chatId, dedupCheck.userMessage);
            }
            return new Response(JSON.stringify({
              ok: true,
              dedup_action: 'intercepted_duplicate',
              strikeCount: dedupCheck.strikeCount,
              status: dedupCheck.status,
              tokensSaved: dedupCheck.tokensSaved,
            }), {
              headers: { 'Content-Type': 'application/json' },
            });
          }

          const payload: ProcessAssessmentPayload = {
            studentId: 'student_001', // Default or derived from guardian session
            guardianId,
            chatId,
            imageUrls: [dummyImageUrl],
            subjectId: 'maths',
            yearGroup: 'Y4',
            termWeek: 3,
            schoolId: 'asten-college',
          };

          // Fast confirmation card (< 100ms)
          await messaging.sendConfirmationCard(chatId, {
            jobId: `job_${Date.now()}`,
            imageUrl: dummyImageUrl,
            detectedStudent: 'Student (Year 4)',
            detectedSubject: 'Mathematics',
            detectedWeek: 'Week 3',
          });

          // Enqueue to QStash asynchronously
          const queue = QueueFactory.getQueue();
          const messageId = await queue.enqueueJob('process-assessment', payload);

          return new Response(JSON.stringify({ ok: true, queued: true, messageId }), {
            headers: { 'Content-Type': 'application/json' },
          });
        }

        return new Response(JSON.stringify({ ok: true, note: 'unhandled_message_type' }), {
          headers: { 'Content-Type': 'application/json' },
        });
      } catch (err) {
        console.error('[Worker] Telegram webhook handler error:', err);
        return new Response(JSON.stringify({ ok: false, error: String(err) }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    // QStash Callback Endpoint
    if (url.pathname === '/jobs/process-assessment' && request.method === 'POST') {
      try {
        const body = await request.json() as any;
        const payload: ProcessAssessmentPayload = body.payload || body;

        const result = await processAssessmentJob(payload);

        return new Response(JSON.stringify({ ok: true, result }), {
          headers: { 'Content-Type': 'application/json' },
        });
      } catch (err) {
        console.error('[Worker] QStash assessment processing error:', err);
        return new Response(JSON.stringify({ ok: false, error: String(err) }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    return new Response('Not Found', { status: 404 });
  },
};
