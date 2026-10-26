import type { IMessagingPort } from '@hex-aim/types';
import { SettingsManager } from '@hex-aim/core';
import { TelegramMessagingAdapter } from './TelegramMessagingAdapter.js';
import { WhatsAppMessagingAdapter } from './WhatsAppMessagingAdapter.js';
import { MockMessagingAdapter } from './MockMessagingAdapter.js';

export class MessagingFactory {
  private static cachedInstance: IMessagingPort | null = null;

  public static getMessaging(forceProvider?: 'telegram' | 'whatsapp' | 'mock'): IMessagingPort {
    if (this.cachedInstance && !forceProvider) {
      return this.cachedInstance;
    }

    const settings = SettingsManager.getInstance();
    const provider = forceProvider || settings.get<'telegram' | 'whatsapp' | 'mock'>('messaging.provider', 'telegram');

    if (provider === 'whatsapp') {
      const accessToken = settings.get<string>('WHATSAPP_ACCESS_TOKEN', '');
      const phoneNumberId = settings.get<string>('WHATSAPP_PHONE_NUMBER_ID', '');
      if (accessToken && phoneNumberId) {
        try {
          const adapter = new WhatsAppMessagingAdapter({
            accessToken,
            phoneNumberId,
            appSecret: settings.get<string>('WHATSAPP_APP_SECRET', undefined),
          });
          this.cachedInstance = adapter;
          return adapter;
        } catch (err) {
          console.warn('[MessagingFactory] Failed to initialize WhatsAppMessagingAdapter, falling back to Mock:', err);
        }
      }
    }

    const token = settings.get<string>('TELEGRAM_BOT_TOKEN', '');
    if (provider === 'telegram' && token) {
      try {
        const adapter = new TelegramMessagingAdapter({ botToken: token });
        this.cachedInstance = adapter;
        return adapter;
      } catch (err) {
        console.warn('[MessagingFactory] Failed to initialize TelegramMessagingAdapter, falling back to Mock:', err);
      }
    }

    const mockAdapter = new MockMessagingAdapter();
    this.cachedInstance = mockAdapter;
    return mockAdapter;
  }

  public static reset(): void {
    this.cachedInstance = null;
  }
}
