import { MessagingFactory, StorageFactory, TelegramMessagingAdapter } from '@hex-aim/adapters';
import { IntakeDeduplicator, SettingsManager } from '@hex-aim/core';
import { processAssessmentJob, processBatchAssessmentJob, type ProcessAssessmentPayload } from './jobs/processAssessment.js';

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
        const messaging = env.TELEGRAM_BOT_TOKEN 
          ? new TelegramMessagingAdapter({ botToken: env.TELEGRAM_BOT_TOKEN }) 
          : MessagingFactory.getMessaging();
        const storage = StorageFactory.getStorage();

        // 0. Handle Inline Callback Queries from Menu Buttons
        const callbackQuery = body?.callback_query;
        if (callbackQuery) {
          const callbackData = String(callbackQuery.data || '');
          const cbChatId = String(callbackQuery.message?.chat?.id || '');

          // Answer callback to dismiss Telegram client spinner
          if (env.TELEGRAM_BOT_TOKEN) {
            await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/answerCallbackQuery`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ callback_query_id: callbackQuery.id }),
            }).catch(() => {});
          }

          if (callbackData === 'reset_quota') {
            const redisStorage = storage as any;
            if (redisStorage.redis) {
              await redisStorage.redis.del(`aim:strikes:guardian_${cbChatId}`);
              const keys = await redisStorage.redis.keys(`aim:seen_files:guardian_${cbChatId}:*`);
              for (const k of keys || []) {
                await redisStorage.redis.del(k);
              }
            }
            await messaging.sendMessage(cbChatId, `🟢 <b>Ingestion Session Reset:</b> Upload quota cleared. You are free to test and upload.`);
          } else if (callbackData === 'view_sprint_lara') {
            await messaging.sendMessage(cbChatId, `📄 <b>Lara's Latest Sprint Pack:</b>\n🔗 https://aim.getvintel.com/sprint/preview`);
          } else if (callbackData === 'view_sprint_maya') {
            await messaging.sendMessage(cbChatId, `📄 <b>Maya's Latest Sprint Pack:</b>\n🔗 https://aim.getvintel.com/sprint/preview`);
          } else if (callbackData === 'view_guide_lara') {
            await messaging.sendMessage(cbChatId, `🧭 <b>Lara's Parent Socratic Guide:</b>\n🔗 https://aim.getvintel.com/guide/preview`);
          } else if (callbackData === 'view_guide_maya') {
            await messaging.sendMessage(cbChatId, `🧭 <b>Maya's Parent Socratic Guide:</b>\n🔗 https://aim.getvintel.com/guide/preview`);
          } else if (callbackData === 'menu_change_week') {
            const weekKeyboard = {
              inline_keyboard: [
                [
                  { text: 'Lara: W1', callback_data: 'set_week_lara_1' },
                  { text: 'Lara: W2', callback_data: 'set_week_lara_2' },
                  { text: 'Lara: W3', callback_data: 'set_week_lara_3' },
                  { text: 'Lara: W4', callback_data: 'set_week_lara_4' },
                ],
                [
                  { text: 'Maya: W5', callback_data: 'set_week_maya_5' },
                  { text: 'Maya: W6', callback_data: 'set_week_maya_6' },
                  { text: 'Maya: W7', callback_data: 'set_week_maya_7' },
                  { text: 'Maya: W8', callback_data: 'set_week_maya_8' },
                ],
                [
                  { text: '🔙 Back to Menu', callback_data: 'open_main_menu' }
                ]
              ]
            };
            await (messaging as TelegramMessagingAdapter).sendMessage(cbChatId, `📅 <b>Select Target Week to Recompile Sprint:</b>`, undefined, weekKeyboard);
          } else if (callbackData.startsWith('set_week_')) {
            const parts = callbackData.split('_');
            const sName = parts[2]!;
            const wNum = Number(parts[3]!);
            await messaging.sendMessage(cbChatId, `🔄 <b>Recompiling for ${sName.toUpperCase()} (Week ${wNum})...</b>`);
            await processAssessmentJob({
              studentId: sName,
              guardianId: `guardian_${cbChatId}`,
              chatId: cbChatId,
              imageUrls: [],
              subjectId: 'english',
              yearGroup: 'Y4',
              termWeek: wNum,
              schoolId: 'asten-college',
            });
          } else if (callbackData === 'open_main_menu') {
            if (messaging.sendInteractiveMenu) {
              await messaging.sendInteractiveMenu(cbChatId);
            }
          }

          return new Response(JSON.stringify({ ok: true, action: 'callback_handled' }), {
            headers: { 'Content-Type': 'application/json' },
          });
        }

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

        // 1. Direct AGY Instruction Loop (#I: ...)
        if (/^#I\s*:/i.test(text)) {
          const instructionText = text.replace(/^#I\s*:\s*/i, '').trim();
          const redisStorage = storage as any;
          if (redisStorage.redis) {
            const item = {
              chatId,
              text: instructionText,
              timestamp: new Date().toISOString(),
            };
            await redisStorage.redis.set('aim:instructions:latest', item);
            await redisStorage.redis.rpush('aim:instructions:log', item);
          }

          console.log(`[Worker] AGY Instruction logged from ${chatId}: "${instructionText}"`);

          await messaging.sendMessage(chatId,
            `📝 <b>Instruction Received & Logged for AGY:</b>\n` +
            `<i>"${instructionText}"</i>\n\n` +
            `✅ <i>Stored in state ledger. Antigravity will ingest this directly on the next loop.</i>`,
            messageId
          );

          return new Response(JSON.stringify({ ok: true, action: 'instruction_captured', text: instructionText }), {
            headers: { 'Content-Type': 'application/json' },
          });
        }

        // 2. Menu and Control Commands
        if (text.startsWith('/menu')) {
          if (messaging.sendInteractiveMenu) {
            await messaging.sendInteractiveMenu(chatId);
          }
          return new Response(JSON.stringify({ ok: true, action: 'menu_sent' }), {
            headers: { 'Content-Type': 'application/json' },
          });
        }

        if (text.startsWith('/reset')) {
          const redisStorage = storage as any;
          if (redisStorage.redis) {
            await redisStorage.redis.del(`aim:strikes:guardian_${chatId}`);
            const keys = await redisStorage.redis.keys(`aim:seen_files:guardian_${chatId}:*`);
            for (const k of keys || []) {
              await redisStorage.redis.del(k);
            }
          }
          await messaging.sendMessage(chatId, `🟢 <b>Ingestion Session Reset:</b> Upload quota cleared. You are free to test and upload.`);
          return new Response(JSON.stringify({ ok: true, action: 'quota_reset' }), {
            headers: { 'Content-Type': 'application/json' },
          });
        }

        if (text.startsWith('/start')) {
          await messaging.sendMessage(chatId, 
            `👋 <b>Welcome to HEX-AIM (Adaptive Individualized Mastery)!</b>\n\n` +
            `We turn weekly school quizzes into <b>targeted 4-page sprints (6–10 mins)</b> for your child.\n\n` +
            `📸 <b>To begin:</b> Take a clear photo of your child's marked worksheet (or send an album of pages) and send it here!\n\n` +
            `📄 <b>Direct PDF delivery:</b> Printable PDFs are delivered directly to your chat.\n` +
            `📱 <b>Mini-App:</b> Tap the <b>AIM Console</b> button at the bottom left to view the interactive dashboard anytime.`
          );
          if (messaging.sendInteractiveMenu) {
            await messaging.sendInteractiveMenu(chatId);
          }
          return new Response(JSON.stringify({ ok: true, action: 'welcome_sent' }), {
            headers: { 'Content-Type': 'application/json' },
          });
        }

        if (text.startsWith('/edit')) {
          const match = text.match(/\/edit\s+(\w+)\s+(?:week\s+)?(\d+)/i);
          if (match) {
            const studentName = match[1]!;
            const newWeek = Number(match[2]!);
            const sId = studentName.toLowerCase().includes('maya') ? 'maya' : 'lara';
            
            await messaging.sendMessage(chatId, `🔄 <b>Re-generating sprint for ${studentName} (Week ${newWeek})...</b>`);
            const payload: ProcessAssessmentPayload = {
              studentId: sId,
              guardianId: `guardian_${chatId}`,
              chatId,
              imageUrls: [],
              subjectId: 'english',
              yearGroup: 'Y4',
              termWeek: newWeek,
              schoolId: 'asten-college',
            };
            await processAssessmentJob(payload);
            return new Response(JSON.stringify({ ok: true, action: 'recompiled_edited_week' }), {
              headers: { 'Content-Type': 'application/json' },
            });
          } else {
            await messaging.sendMessage(chatId, `💡 <i>Usage:</i> <code>/edit [Maya|Lara] Week [N]</code>\n<i>Example:</i> <code>/edit Maya Week 3</code>`);
            return new Response(JSON.stringify({ ok: true, action: 'usage_sent' }), {
              headers: { 'Content-Type': 'application/json' },
            });
          }
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

          // UNIFIED CHAT-LEVEL INTAKE BATCH BUFFER (Aggregates split albums e.g. 10 + 2 photos)
          const activeBatchKey = `intake_active:${chatId}`;
          const isFirstPhoto = !(await storage.hasSeenFileHash('intake_active_seen', chatId));

          // Record this photo URL into the active intake batch
          if (storage.addIntakeBatchItem) {
            await storage.addIntakeBatchItem(activeBatchKey, {
              url: resolvedImageUrl,
              fileUniqueId,
              messageId,
            });
          }

          const jobId = `job_${Date.now()}`;

          if (isFirstPhoto) {
            await storage.recordFileHash('intake_active_seen', chatId, { timestamp: new Date().toISOString() });

            // Send confirmation card acknowledging receipt
            await messaging.sendConfirmationCard(chatId, {
              jobId,
              imageUrl: resolvedImageUrl,
              detectedStudent: 'Student',
              detectedSubject: 'Worksheet',
              detectedWeek: 'Week 3',
            });

            // Debounce 4.5s for all photos (across multiple Telegram albums like 10+2) to arrive
            const runUnifiedBatch = async () => {
              try {
                await new Promise(resolve => setTimeout(resolve, 4500));
                
                // Clear active seen marker so subsequent batches start clean
                const redisStorage = storage as any;
                if (redisStorage.redis) {
                  await redisStorage.redis.del(`aim:seen_files:intake_active_seen:${chatId}`);
                }

                let batchImages: string[] = [resolvedImageUrl];
                if (storage.getIntakeBatchItems) {
                  const items = await storage.getIntakeBatchItems(activeBatchKey);
                  if (items && items.length > 0) {
                    batchImages = items.map(it => it.url);
                  }
                }

                if (storage.clearIntakeBatch) {
                  await storage.clearIntakeBatch(activeBatchKey);
                }

                console.log(`[Worker] Processing unified batch for ${chatId} with ${batchImages.length} images`);

                if (batchImages.length > 1) {
                  await processBatchAssessmentJob({
                    chatId,
                    guardianId,
                    imageUrls: batchImages,
                    schoolId: 'asten-college',
                  });
                } else {
                  await processAssessmentJob({
                    studentId: 'auto',
                    guardianId,
                    chatId,
                    imageUrls: batchImages,
                    subjectId: 'auto',
                    yearGroup: 'Y4',
                    termWeek: 3,
                    schoolId: 'asten-college',
                  });
                }
              } catch (err: any) {
                console.error('[Worker] Batch processing error:', err);
                // FAIL LOUD: never swallow errors!
                await messaging.sendMessage(chatId,
                  `⚠️ <b>Assessment Diagnostic Failed:</b>\n${err?.message || String(err)}\n\n` +
                  `<i>Zero Silent Fallback Active. Error logged to telemetry.</i>`
                );
              }
            };

            if (_ctx && typeof _ctx.waitUntil === 'function') {
              _ctx.waitUntil(runUnifiedBatch());
            } else {
              runUnifiedBatch();
            }

            return new Response(JSON.stringify({ ok: true, queued: true, batchLeader: true, messageId: jobId }), {
              headers: { 'Content-Type': 'application/json' },
            });
          } else {
            // Sibling photo in the same batch: aggregated silently into the batch leader
            return new Response(JSON.stringify({ ok: true, batched: true }), {
              headers: { 'Content-Type': 'application/json' },
            });
          }
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
