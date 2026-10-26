import { describe, it, expect, vi } from 'vitest';
import { WhatsAppMessagingAdapter } from '../src/messaging/WhatsAppMessagingAdapter.js';

describe('Wave 12: WhatsApp Cloud Messaging Adapter (IMessagingPort)', () => {
  const dummyAccessToken = 'EAABtestToken123456';
  const dummyPhoneId = '10987654321';

  it('validates required configuration on construction', () => {
    expect(() => new WhatsAppMessagingAdapter({ accessToken: '', phoneNumberId: '123' }))
      .toThrow('accessToken is required');
    expect(() => new WhatsAppMessagingAdapter({ accessToken: 'abc', phoneNumberId: '' }))
      .toThrow('phoneNumberId is required');
  });

  it('cleans phone numbers to E.164 without plus or formatting spaces', () => {
    const adapter = new WhatsAppMessagingAdapter({
      accessToken: dummyAccessToken,
      phoneNumberId: dummyPhoneId,
    });

    expect(adapter.cleanRecipient('+20 100 123 4567')).toBe('201001234567');
    expect(adapter.cleanRecipient('+44-7911-123456')).toBe('447911123456');
  });

  it('sends text messages with correct Meta Graph API payload structure', async () => {
    let capturedUrl = '';
    let capturedBody: any = null;

    const mockFetch = vi.fn().mockImplementation(async (url: string, opts: any) => {
      capturedUrl = url;
      capturedBody = JSON.parse(opts.body);
      return {
        ok: true,
        json: async () => ({ messages: [{ id: 'wamid.HBgL...' }] }),
      };
    });

    const adapter = new WhatsAppMessagingAdapter({
      accessToken: dummyAccessToken,
      phoneNumberId: dummyPhoneId,
      fetchFn: mockFetch as any,
    });

    const res = await adapter.sendMessage('+20 100 123 4567', 'Hello from AIM Bot!');

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(capturedUrl).toBe(`https://graph.facebook.com/v21.0/${dummyPhoneId}/messages`);
    expect(capturedBody.messaging_product).toBe('whatsapp');
    expect(capturedBody.to).toBe('201001234567');
    expect(capturedBody.type).toBe('text');
    expect(capturedBody.text.body).toBe('Hello from AIM Bot!');
    expect(res.messages[0].id).toBe('wamid.HBgL...');
  });

  it('sends interactive button menu for progress and sprint triggers', async () => {
    let capturedBody: any = null;

    const mockFetch = vi.fn().mockImplementation(async (_url: string, opts: any) => {
      capturedBody = JSON.parse(opts.body);
      return {
        ok: true,
        json: async () => ({ messages: [{ id: 'wamid.menu123' }] }),
      };
    });

    const adapter = new WhatsAppMessagingAdapter({
      accessToken: dummyAccessToken,
      phoneNumberId: dummyPhoneId,
      fetchFn: mockFetch as any,
    });

    await adapter.sendInteractiveMenu('+20 100 123 4567', 'AIM Parent Control');

    expect(capturedBody.type).toBe('interactive');
    expect(capturedBody.interactive.type).toBe('button');
    expect(capturedBody.interactive.action.buttons.length).toBe(3);
    expect(capturedBody.interactive.action.buttons[0].reply.id).toBe('btn_progress');
  });

  it('sends document attachments via public URL', async () => {
    let capturedBody: any = null;

    const mockFetch = vi.fn().mockImplementation(async (_url: string, opts: any) => {
      capturedBody = JSON.parse(opts.body);
      return {
        ok: true,
        json: async () => ({ messages: [{ id: 'wamid.doc123' }] }),
      };
    });

    const adapter = new WhatsAppMessagingAdapter({
      accessToken: dummyAccessToken,
      phoneNumberId: dummyPhoneId,
      fetchFn: mockFetch as any,
    });

    await adapter.sendDocument('+20 100 123 4567', {
      url: 'https://example.com/Lara_Sprint.pdf',
      filename: 'Lara_Sprint.pdf',
      caption: 'Science Midterm Sprint Pack',
    });

    expect(capturedBody.type).toBe('document');
    expect(capturedBody.document.link).toBe('https://example.com/Lara_Sprint.pdf');
    expect(capturedBody.document.filename).toBe('Lara_Sprint.pdf');
  });

  it('throws descriptive error on Meta Graph API rejection (zero silent failures)', async () => {
    const mockFetch = vi.fn().mockImplementation(async () => {
      return {
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        text: async () => JSON.stringify({
          error: {
            message: 'Invalid OAuth access token.',
            type: 'OAuthException',
            code: 190,
          },
        }),
      };
    });

    const adapter = new WhatsAppMessagingAdapter({
      accessToken: 'bad_token',
      phoneNumberId: dummyPhoneId,
      fetchFn: mockFetch as any,
    });

    await expect(adapter.sendMessage('12345678', 'test'))
      .rejects.toThrow('WhatsApp API call failed (401): Invalid OAuth access token.');
  });
});
