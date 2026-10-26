import { TelegramMessagingAdapter } from '@hex-aim/adapters';
import type { IStoragePort, IMessagingPort } from '@hex-aim/types';

export interface SessionContext {
  storage: IStoragePort;
  messaging: IMessagingPort;
  telegramBotToken?: string;
  sendAndTrack: (chatId: string, text: string, replyToMsgId?: number, replyMarkup?: Record<string, unknown>) => Promise<any>;
}

/**
 * Cleanly purges and resets chat history and duplicate hashes.
 */
export async function purgeAndResetSession(
  targetChatId: string,
  currentMsgId: number | undefined,
  ctx: SessionContext
): Promise<void> {
  const { storage, messaging, telegramBotToken, sendAndTrack } = ctx;
  const redisStorage = storage as any;
  const idsToDelete = new Set<number>();

  if (currentMsgId) {
    idsToDelete.add(currentMsgId);
    // Scan backwards up to 300 message IDs to catch all prior sessions within Telegram API window
    for (let i = 1; i <= 300; i++) {
      if (currentMsgId - i > 0) idsToDelete.add(currentMsgId - i);
    }
  }

  if (storage.getBotMessages) {
    const tracked = await storage.getBotMessages(targetChatId);
    for (const id of tracked) idsToDelete.add(id);
  }

  if (redisStorage.redis) {
    try {
      const hist = await redisStorage.redis.lrange(`aim:chat_history:${targetChatId}`, 0, -1);
      for (const h of hist || []) {
        const parsed = typeof h === 'string' ? JSON.parse(h) : h;
        if (parsed?.messageId) idsToDelete.add(parsed.messageId);
      }
    } catch (err) {
      console.warn('[purgeAndResetSession] Error reading history message IDs:', err);
    }
  }

  const idArray = Array.from(idsToDelete);
  if (messaging instanceof TelegramMessagingAdapter) {
    await messaging.deleteMessages(targetChatId, idArray);
  } else if (telegramBotToken) {
    for (let i = 0; i < idArray.length; i += 100) {
      await fetch(`https://api.telegram.org/bot${telegramBotToken}/deleteMessages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: targetChatId, message_ids: idArray.slice(i, i + 100) }),
        signal: AbortSignal.timeout(10000),
      }).catch(err => {
        console.warn('[purgeAndResetSession] deleteMessages chunk failed:', err);
      });
    }
  }

  // Clear Redis state
  await storage.clearBotMessages?.(targetChatId);
  if (redisStorage.redis) {
    await redisStorage.redis.del(`aim:chat_history:${targetChatId}`);
    await redisStorage.redis.del(`aim:strikes:guardian_${targetChatId}`);
    const keys = await redisStorage.redis.keys(`aim:seen_files:guardian_${targetChatId}:*`);
    for (const k of keys || []) {
      await redisStorage.redis.del(k);
    }
  }

  await sendAndTrack(
    targetChatId,
    `🧹 <b>Chat Cleared.</b>\n\n` +
    `<i>Session is fresh and clean. Tap <b>🎛️ Menu</b> or <b>📱 Cons.</b> below anytime, or take a photo of your child's worksheet to begin!</i>`
  );
}

/**
 * Resets upload quotas & duplicate locks without clearing visible chat history.
 */
export async function resetSessionOnly(
  targetChatId: string,
  ctx: SessionContext
): Promise<void> {
  const { storage, sendAndTrack } = ctx;
  const redisStorage = storage as any;

  if (redisStorage.redis) {
    await redisStorage.redis.del(`aim:strikes:guardian_${targetChatId}`);
    const keys = await redisStorage.redis.keys(`aim:seen_files:guardian_${targetChatId}:*`);
    for (const k of keys || []) {
      await redisStorage.redis.del(k);
    }
  }

  await sendAndTrack(
    targetChatId,
    `🔄 <b>Session Reset Complete:</b>\n\n` +
    `• Upload quotas & duplicate file locks cleared.\n` +
    `• Chat history was preserved.\n\n` +
    `📸 <i>You can now upload new worksheets or test the pipeline freely.</i>`
  );
}
