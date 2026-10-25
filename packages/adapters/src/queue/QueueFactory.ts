import type { IQueuePort } from '@hex-aim/types';
import { SettingsManager } from '@hex-aim/core';
import { QStashQueueAdapter } from './QStashQueueAdapter.js';
import { DirectExecutionQueueAdapter } from './DirectExecutionQueueAdapter.js';

export class QueueFactory {
  private static cachedInstance: IQueuePort | null = null;

  public static getQueue(forceProvider?: 'qstash' | 'direct'): IQueuePort {
    if (this.cachedInstance && !forceProvider) {
      return this.cachedInstance;
    }

    const settings = SettingsManager.getInstance();
    const provider = forceProvider || settings.get<'qstash' | 'direct'>('queue.provider', 'qstash');
    const qstashToken = settings.get<string>('QSTASH_TOKEN', '');
    const workerUrl = settings.get<string>('AIM_WORKER_URL', 'https://aim.getvintel.com/api/jobs/process-assessment');

    if (provider === 'qstash' && qstashToken) {
      try {
        const adapter = new QStashQueueAdapter({
          token: qstashToken,
          destinationUrl: workerUrl,
        });
        this.cachedInstance = adapter;
        return adapter;
      } catch (err) {
        console.warn('[QueueFactory] Failed to initialize QStashQueueAdapter, falling back to DirectExecution:', err);
      }
    }

    const directAdapter = new DirectExecutionQueueAdapter();
    this.cachedInstance = directAdapter;
    return directAdapter;
  }

  public static reset(): void {
    this.cachedInstance = null;
  }
}
