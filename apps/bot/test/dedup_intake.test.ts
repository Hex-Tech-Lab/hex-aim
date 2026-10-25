import { describe, it, expect, beforeEach } from 'vitest';
import worker from '../src/worker.js';
import { StorageFactory } from '@hex-aim/adapters';
import { SettingsManager } from '@hex-aim/core';

describe('Telegram Bot Intake Deduplication & Strike Pipeline', () => {
  beforeEach(() => {
    // Reset settings & mock providers for deterministic isolation
    process.env.STORAGE_PROVIDER = 'memory';
    process.env.MESSAGING_PROVIDER = 'mock';
    process.env.QUEUE_PROVIDER = 'direct';
    process.env.VISION_PROVIDER = 'mock';

    const settings = SettingsManager.getInstance();
    settings.set('storage.provider', 'memory');
    settings.set('messaging.provider', 'mock');
    settings.set('queue.provider', 'direct');
    settings.set('vision.provider', 'mock');
    settings.set('intake.dedup.enabled', true);
    settings.set('intake.dedup.strikeLimit', 3);
  });

  it('permits initial quiz upload without strikes', async () => {
    const telegramPhotoUpdate = {
      update_id: 10001,
      message: {
        message_id: 1,
        chat: { id: 778899, type: 'private' },
        date: Math.floor(Date.now() / 1000),
        photo: [
          { file_id: 'thumb_001', file_unique_id: 'unique_math_quiz_w3', file_size: 1024, width: 320, height: 240 },
          { file_id: 'full_001', file_unique_id: 'unique_math_quiz_w3', file_size: 8192, width: 1280, height: 960 },
        ],
      },
    };

    const req = new Request('https://aim-bot.getvintel.com/webhook/telegram', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(telegramPhotoUpdate),
    });

    const res = await worker.fetch(req, {}, {} as any);
    expect(res.status).toBe(200);

    const json = await res.json() as any;
    expect(json.ok).toBe(true);
    expect(json.queued).toBe(true);
  });

  it('intercepts duplicate upload, burns zero tokens, and logs Strike 1', async () => {
    const telegramPhotoUpdate = {
      update_id: 10002,
      message: {
        message_id: 2,
        chat: { id: 778899, type: 'private' },
        date: Math.floor(Date.now() / 1000),
        photo: [
          { file_id: 'full_001', file_unique_id: 'unique_math_quiz_w3', file_size: 8192, width: 1280, height: 960 },
        ],
      },
    };

    const req = new Request('https://aim-bot.getvintel.com/webhook/telegram', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(telegramPhotoUpdate),
    });

    const res = await worker.fetch(req, {}, {} as any);
    expect(res.status).toBe(200);

    const json = await res.json() as any;
    expect(json.ok).toBe(true);
    expect(json.dedup_action).toBe('intercepted_duplicate');
    expect(json.strikeCount).toBe(1);
    expect(json.status).toBe('warned');
    expect(json.tokensSaved).toBe(3200);
  });

  it('escalates repeated uploads to Strike 2, then Strike 3 with downgraded status', async () => {
    const telegramPhotoUpdate = {
      update_id: 10003,
      message: {
        message_id: 3,
        chat: { id: 778899, type: 'private' },
        date: Math.floor(Date.now() / 1000),
        photo: [
          { file_id: 'full_001', file_unique_id: 'unique_math_quiz_w3', file_size: 8192, width: 1280, height: 960 },
        ],
      },
    };

    // Strike 2
    const req2 = new Request('https://aim-bot.getvintel.com/webhook/telegram', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(telegramPhotoUpdate),
    });
    const res2 = await worker.fetch(req2, {}, {} as any);
    const json2 = await res2.json() as any;
    expect(json2.strikeCount).toBe(2);
    expect(json2.status).toBe('warned');

    // Strike 3 (Downgrade threshold reached)
    const req3 = new Request('https://aim-bot.getvintel.com/webhook/telegram', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(telegramPhotoUpdate),
    });
    const res3 = await worker.fetch(req3, {}, {} as any);
    const json3 = await res3.json() as any;
    expect(json3.strikeCount).toBe(3);
    expect(json3.status).toBe('downgraded');
    expect(json3.tokensSaved).toBe(3200 * 3);
  });
});
