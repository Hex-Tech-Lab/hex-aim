import type { IMessagingPort } from '@hex-aim/types';
import { SettingsManager } from '@hex-aim/core';
import { TelegramMessagingAdapter } from './TelegramMessagingAdapter.js';
import { MockMessagingAdapter } from './MockMessagingAdapter.js';

export class MessagingFactory {
  private static cachedInstance: IMessagingPort | null = null;

  public static getMessaging(forceProvider?: 'telegram' | 'mock'): IMessagingPort {
    if (this.cachedInstance && !forceProvider) {
      return this.cachedInstance;
    }

    const settings = SettingsManager.getInstance();
    const provider = forceProvider || settings.get<'telegram' | 'mock'>('messaging.provider', 'telegram');
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
