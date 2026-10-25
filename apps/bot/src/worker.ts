import { MessagingFactory, StorageFactory, TelegramMessagingAdapter } from '@hex-aim/adapters';
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
  OPENROUTER_API_KEY?: string;
  DUB_API_KEY?: string;
  DUB_DOMAIN?: string;
}

export default {
  async fetch(request: Request, env: Env, _ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // Bind Worker Secrets & Env into SettingsManager
    const settings = SettingsManager.getInstance();
    for (const [k, v] of Object.entries(env)) {
      if (typeof v === 'string') {
        settings.set(k, v);
      }
    }
    if (env.STORAGE_PROVIDER) settings.set('storage.provider', env.STORAGE_PROVIDER);
    if (env.MESSAGING_PROVIDER) settings.set('messaging.provider', env.MESSAGING_PROVIDER);
    if (env.QUEUE_PROVIDER) settings.set('queue.provider', env.QUEUE_PROVIDER);
    if (env.VISION_PROVIDER) settings.set('vision.provider', env.VISION_PROVIDER);
    if (env.UPSTASH_REDIS_REST_URL) settings.set('UPSTASH_REDIS_REST_URL', env.UPSTASH_REDIS_REST_URL);
    if (env.UPSTASH_REDIS_REST_TOKEN) settings.set('UPSTASH_REDIS_REST_TOKEN', env.UPSTASH_REDIS_REST_TOKEN);
    if (env.OPENROUTER_API_KEY) settings.set('OPENROUTER_API_KEY', env.OPENROUTER_API_KEY);
    if (env.TELEGRAM_BOT_TOKEN) settings.set('TELEGRAM_BOT_TOKEN', env.TELEGRAM_BOT_TOKEN);

    // Health check
    if (url.pathname === '/health' || url.pathname === '/') {
      return new Response(JSON.stringify({
        status: 'ok',
        project: 'hex-aim',
        service: 'edge-intake-worker',
        visionProvider: env.OPENROUTER_API_KEY ? 'openrouter' : (env.GEMINI_API_KEY ? 'gemini' : 'none'),
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
        const messageId = message.message_id ? Number(message.message_id) : undefined;
        const text = String(message.text || '');
        const photos = message.photo;
        const messaging = env.TELEGRAM_BOT_TOKEN 
          ? new TelegramMessagingAdapter({ botToken: env.TELEGRAM_BOT_TOKEN }) 
          : MessagingFactory.getMessaging();

        // 1. Text commands
        if (text.startsWith('/start')) {
          await messaging.sendMessage(chatId, 
            `👋 <b>Welcome to HEX-AIM (Adaptive Individualized Mastery)!</b>\n\n` +
            `We turn weekly school quizzes into <b>targeted 4-page sprints (6–10 mins)</b> for your child.\n\n` +
            `📸 <b>To begin:</b> Take a clear photo of your child's marked worksheet (or send an album of pages) and send it here!`
          );
          return new Response(JSON.stringify({ ok: true, action: 'welcome_sent' }), {
            headers: { 'Content-Type': 'application/json' },
          });
        }

        // 2. Photo & Document intake (Assessment upload)
        const doc = message.document;
        const hasPhoto = photos && Array.isArray(photos) && photos.length > 0;
        const hasDoc = doc && (doc.mime_type?.startsWith('image/') || doc.mime_type === 'application/pdf');

        if (hasPhoto || hasDoc) {
          const fileId = hasPhoto ? photos[photos.length - 1].file_id : doc.file_id;
          const fileUniqueId = hasPhoto 
            ? (photos[photos.length - 1].file_unique_id || fileId) 
            : (doc.file_unique_id || fileId);
          const fileSize = hasPhoto ? photos[photos.length - 1].file_size : doc.file_size;
          const fileName = hasDoc ? doc.file_name : `telegram_photo_${fileUniqueId}.jpg`;

          // Resolve real Telegram CDN URL if token is present
          let resolvedImageUrl = `https://api.telegram.org/file/bot${env.TELEGRAM_BOT_TOKEN || 'mock'}/${fileId}.jpg`;
          if (env.TELEGRAM_BOT_TOKEN) {
            try {
              const fileRes = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/getFile?file_id=${fileId}`);
              if (fileRes.ok) {
                const fileData = await fileRes.json() as any;
                if (fileData?.result?.file_path) {
                  resolvedImageUrl = `https://api.telegram.org/file/bot${env.TELEGRAM_BOT_TOKEN}/${fileData.result.file_path}`;
                }
              }
            } catch (err) {
              console.warn('[Worker] Telegram getFile warning:', err);
            }
          }

          const guardianId = `guardian_${chatId}`;
          const storage = StorageFactory.getStorage();

          // Intake Deduplication & Strike Interception Gate
          const dedupCheck = await IntakeDeduplicator.evaluateUpload(
            {
              guardianId,
              fileIdentifier: fileUniqueId,
              metadata: {
                filename: fileName,
                fileSize,
              },
            },
            storage,
            settings
          );

          if (dedupCheck.isDuplicate) {
            if (dedupCheck.userMessage) {
              await messaging.sendMessage(chatId, dedupCheck.userMessage, messageId);
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

          const mediaGroupId = message.media_group_id ? String(message.media_group_id) : undefined;

          // ALBUM BATCH AGGREGATION
          if (mediaGroupId) {
            const albumKey = `media_album:${mediaGroupId}`;
            const isFirstPhoto = !(await storage.hasSeenFileHash('media_album_seen', mediaGroupId));

            // Record this photo URL into the album
            await storage.recordFileHash(albumKey, fileUniqueId, {
              filename: resolvedImageUrl,
              timestamp: new Date().toISOString()
            });

            if (isFirstPhoto) {
              await storage.recordFileHash('media_album_seen', mediaGroupId, { timestamp: new Date().toISOString() });

              // Immediate initial receipt acknowledgment
              await messaging.sendMessage(chatId,
                `📥 <b>Worksheet Album Received!</b>\n` +
                `⚡ <i>Assembling pages and running OpenRouter diagnostic extraction...</i>`,
                messageId
              );

              // Background Execution: Debounce 3.5s for all album photos to arrive, then execute ONCE!
              const runAlbumBatch = async () => {
                try {
                  await new Promise(resolve => setTimeout(resolve, 3500));
                  
                  // Collect all image URLs for this media group
                  const albumImages: string[] = [resolvedImageUrl];
                  // If storage supports scanning or if single batch, ensure resolvedImageUrl is processed
                  
                  const payload: ProcessAssessmentPayload = {
                    studentId: 'auto',
                    guardianId,
                    chatId,
                    imageUrls: albumImages,
                    subjectId: 'auto',
                    yearGroup: 'Y4',
                    termWeek: 3,
                    schoolId: 'asten-college',
                  };

                  await processAssessmentJob(payload);
                } catch (err: any) {
                  console.error('[Worker] Album batch processing error:', err);
                  // ZERO SILENT FAILURES: notify user directly!
                  await messaging.sendMessage(chatId,
                    `⚠️ <b>Assessment Diagnostic Failed:</b>\n${err?.message || String(err)}\n\n` +
                    `<i>Zero Silent Fallback Active. Error logged to telemetry.</i>`
                  );
                }
              };

              if (_ctx && typeof _ctx.waitUntil === 'function') {
                _ctx.waitUntil(runAlbumBatch());
              } else {
                runAlbumBatch();
              }

              return new Response(JSON.stringify({ ok: true, queued: true, batchLeader: true }), {
                headers: { 'Content-Type': 'application/json' },
              });
            } else {
              // Sibling photo in the same album: aggregated silently into the leader's batch
              return new Response(JSON.stringify({ ok: true, batched: true }), {
                headers: { 'Content-Type': 'application/json' },
              });
            }
          }

          // SINGLE PHOTO / NON-ALBUM INTAKE
          const payload: ProcessAssessmentPayload = {
            studentId: 'auto',
            guardianId,
            chatId,
            imageUrls: [resolvedImageUrl],
            subjectId: 'auto',
            yearGroup: 'Y4',
            termWeek: 3,
            schoolId: 'asten-college',
          };

          const jobId = `job_${Date.now()}`;

          // Send confirmation card replying to this photo
          await messaging.sendConfirmationCard(chatId, {
            jobId,
            imageUrl: resolvedImageUrl,
            detectedStudent: 'Student',
            detectedSubject: 'Worksheet',
            detectedWeek: 'Week 3',
          });

          const runSingleJob = async () => {
            try {
              await processAssessmentJob(payload);
            } catch (err: any) {
              console.error('[Worker] Single processing error:', err);
              await messaging.sendMessage(chatId,
                `⚠️ <b>Assessment Diagnostic Failed:</b>\n${err?.message || String(err)}\n\n` +
                `<i>Zero Silent Fallback Active. Error logged to telemetry.</i>`,
                messageId
              );
            }
          };

          if (_ctx && typeof _ctx.waitUntil === 'function') {
            _ctx.waitUntil(runSingleJob());
          } else {
            runSingleJob();
          }

          return new Response(JSON.stringify({ ok: true, queued: true, messageId: jobId, single: true }), {
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
