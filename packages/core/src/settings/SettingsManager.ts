import type { ISettingsPort } from '@hex-aim/types';

export interface AppConfig {
  env: 'development' | 'production' | 'test';
  storageProvider: 'upstash' | 'neon' | 'memory' | 'git';
  messagingProvider: 'telegram' | 'whatsapp' | 'mock';
  queueProvider: 'qstash' | 'direct';
  visionProvider: 'openrouter' | 'gemini' | 'mock';
  redisPrefix: string;
  upstashRedisRestUrl?: string;
  upstashRedisRestToken?: string;
  qstashUrl?: string;
  qstashToken?: string;
  telegramBotToken?: string;
  geminiApiKey?: string;
  openRouterApiKey?: string;
}

export class SettingsManager implements ISettingsPort {
  private static instance: SettingsManager;
  private overrides: Map<string, unknown> = new Map();

  private constructor() {}

  public static getInstance(): SettingsManager {
    if (!SettingsManager.instance) {
      SettingsManager.instance = new SettingsManager();
    }
    return SettingsManager.instance;
  }

  public get<T>(key: string, defaultValue: T): T {
    if (this.overrides.has(key)) {
      return this.overrides.get(key) as T;
    }

    const envKey = key.toUpperCase().replace(/\./g, '_');
    const envVal = process.env[envKey] ?? process.env[key];

    if (envVal !== undefined) {
      if (typeof defaultValue === 'boolean') {
        return (envVal === 'true' || envVal === '1') as unknown as T;
      }
      if (typeof defaultValue === 'number') {
        const num = Number(envVal);
        return (isNaN(num) ? defaultValue : num) as unknown as T;
      }
      return envVal as unknown as T;
    }

    return defaultValue;
  }

  public set<T>(key: string, value: T): void {
    this.overrides.set(key, value);
  }

  public getAll(): Record<string, unknown> {
    const config: Record<string, unknown> = {
      env: this.get('env', process.env.NODE_ENV || 'development'),
      storageProvider: this.get('storage.provider', 'upstash'),
      messagingProvider: this.get('messaging.provider', 'telegram'),
      queueProvider: this.get('queue.provider', 'qstash'),
      visionProvider: this.get('vision.provider', 'gemini'),
      redisPrefix: this.get('redis.prefix', 'aim:'),
      upstashRedisRestUrl: this.get('UPSTASH_REDIS_REST_URL', process.env.UPSTASH_REDIS_REST_URL || ''),
      upstashRedisRestToken: this.get('UPSTASH_REDIS_REST_TOKEN', process.env.UPSTASH_REDIS_REST_TOKEN || ''),
      qstashUrl: this.get('QSTASH_URL', process.env.QSTASH_URL || 'https://qstash.upstash.io/v2/publish/'),
      qstashToken: this.get('QSTASH_TOKEN', process.env.QSTASH_TOKEN || ''),
      telegramBotToken: this.get('TELEGRAM_BOT_TOKEN', process.env.TELEGRAM_BOT_TOKEN || ''),
      geminiApiKey: this.get('GEMINI_API_KEY', process.env.GEMINI_API_KEY || ''),
      openRouterApiKey: this.get('OPENROUTER_API_KEY', process.env.OPENROUTER_API_KEY || ''),
    };

    for (const [k, v] of this.overrides.entries()) {
      config[k] = v;
    }

    return config;
  }
}
