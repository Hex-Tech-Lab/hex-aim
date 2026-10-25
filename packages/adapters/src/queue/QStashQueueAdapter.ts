import { Client } from '@upstash/qstash';
import type { IQueuePort } from '@hex-aim/types';

export interface QStashConfig {
  token: string;
  destinationUrl: string;
}

export class QStashQueueAdapter implements IQueuePort {
  private client: Client;
  private destinationUrl: string;

  constructor(config: QStashConfig) {
    this.client = new Client({ token: config.token });
    this.destinationUrl = config.destinationUrl;
  }

  public async enqueueJob<T>(jobName: string, payload: T, delaySeconds: number = 0): Promise<string> {
    const res = await this.client.publishJSON({
      url: this.destinationUrl,
      body: {
        jobName,
        payload,
        enqueuedAt: new Date().toISOString(),
      },
      delay: delaySeconds > 0 ? delaySeconds : undefined,
      headers: {
        'x-aim-job-name': jobName,
      },
    });

    return res.messageId;
  }
}
