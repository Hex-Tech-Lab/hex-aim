import type { IStoragePort } from '@hex-aim/types';
import { SettingsManager } from '@hex-aim/core';
import { UpstashRedisStorageAdapter } from './UpstashRedisStorageAdapter.js';
import { GitStateStorageAdapter } from './GitStateStorageAdapter.js';
import { InMemoryStorageAdapter } from './InMemoryStorageAdapter.js';

export class StorageFactory {
  private static cachedInstance: IStoragePort | null = null;

  public static getStorage(forceProvider?: 'upstash' | 'git' | 'memory'): IStoragePort {
    if (this.cachedInstance && !forceProvider) {
      return this.cachedInstance;
    }

    const settings = SettingsManager.getInstance();
    const provider = forceProvider || settings.get<'upstash' | 'git' | 'memory'>('storage.provider', 'upstash');
    const redisUrl = settings.get<string>('UPSTASH_REDIS_REST_URL', '');
    const redisToken = settings.get<string>('UPSTASH_REDIS_REST_TOKEN', '');
    const prefix = settings.get<string>('redis.prefix', 'aim:');

    if (provider === 'upstash' && redisUrl && redisToken) {
      try {
        const adapter = new UpstashRedisStorageAdapter({
          url: redisUrl,
          token: redisToken,
          prefix,
        });
        this.cachedInstance = adapter;
        return adapter;
      } catch (err) {
        console.warn('[StorageFactory] Failed to initialize UpstashRedisStorageAdapter, falling back to Git/Memory:', err);
      }
    }

    if (provider === 'git') {
      const adapter = new GitStateStorageAdapter();
      this.cachedInstance = adapter;
      return adapter;
    }

    // Default resilient fallback
    const memoryAdapter = new InMemoryStorageAdapter();
    this.cachedInstance = memoryAdapter;
    return memoryAdapter;
  }

  public static reset(): void {
    this.cachedInstance = null;
  }
}
