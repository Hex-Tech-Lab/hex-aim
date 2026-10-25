import type { IQueuePort } from '@hex-aim/types';

export type JobHandler<T> = (jobName: string, payload: T) => Promise<void>;

export class DirectExecutionQueueAdapter implements IQueuePort {
  private handlers = new Map<string, JobHandler<unknown>>();
  public processedJobs: Array<{ jobName: string; payload: unknown; enqueuedAt: string }> = [];

  public registerHandler<T>(jobName: string, handler: JobHandler<T>): void {
    this.handlers.set(jobName, handler as JobHandler<unknown>);
  }

  public async enqueueJob<T>(jobName: string, payload: T, _delaySeconds?: number): Promise<string> {
    const jobId = `job_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    this.processedJobs.push({
      jobName,
      payload,
      enqueuedAt: new Date().toISOString(),
    });

    const handler = this.handlers.get(jobName);
    if (handler) {
      // Async in-process execution without blocking immediate return
      setTimeout(async () => {
        try {
          await handler(jobName, payload);
        } catch (err) {
          console.error(`[DirectExecutionQueueAdapter] Job ${jobName} failed:`, err);
        }
      }, 0);
    }

    return jobId;
  }
}
