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

export interface OpenRouterRoutingConfig {
  baseUrl: string;
  chatEndpoint: string;
  authKeyEndpoint: string;
  httpReferer: string;
  appTitle: string;
  primaryModel: string;
  escalationModel: string;
  fallbackCascade: string[];
  providerOrder: string[];
  providerIgnore: string[];
  allowFallbacks: boolean;
  timeoutMs: number;
  imageFetchTimeoutMs: number;
  pingTimeoutMs: number;
  temperature: number;
}

export const DEFAULT_AIM_REGISTRY: Record<string, unknown> = {
  // AI & OpenRouter Canonical Endpoints & Identity (SSOT)
  'ai.openrouter.base_url': 'https://openrouter.ai/api/v1',
  'ai.openrouter.chat_endpoint': 'https://openrouter.ai/api/v1/chat/completions',
  'ai.openrouter.auth_key_endpoint': 'https://openrouter.ai/api/v1/auth/key',
  'ai.openrouter.http_referer': 'https://aim.getvintel.com',
  'ai.openrouter.app_title': 'HEX-AIM Cognitive Intake',

  // Vision Models & Canonical Routing Slugs (Strict Google Vertex AI)
  'vision.model.primary': 'google/gemini-3.5-flash-lite',
  'vision.model.escalation': 'google/gemini-3.8-flash',
  'vision.model.fallback_cascade': ['google/gemini-3.5-flash-lite', 'google/gemini-3.8-flash'],
  'vision.provider.order': ['Google'],
  'vision.provider.ignore': ['Google AI Studio'],
  'vision.provider.allow_fallbacks': false,
  'vision.timeout_ms': 35000,
  'vision.temperature': 0.1,
  'network.image_fetch_timeout_ms': 15000,
  'network.ping_timeout_ms': 15000,

  // Audio Transcription Models
  'audio.model.primary': 'openai/whisper-large-v3',
  'audio.timeout_ms': 30000,
  'audio.provider.order': ['Groq', 'OpenAI'],

  // Intake & Velocity Debounce Settings
  'intake.debounce.silence_ms': 5500, // 5.5s silence gate after LAST incoming photo
  'intake.debounce.max_ceiling_ms': 45000, // 45s ceiling for large bursts
  'intake.batch.chunk_size': 12, // chunk size for multimodal vision passes
  'intake.batch.large_batch_threshold': 18, // above this, offload to background QStash pipeline

  // Deduplication & Strike Management
  'intake.dedup.max_strikes': 5,
  'intake.dedup.ttl_seconds': 86400,
  'intake.dedup.enabled': true,

  // Curriculum & Term Defaults
  'curriculum.default_school': 'asten-college',
  'curriculum.default_year_group': 'Y4',
  'curriculum.default_term_week': 3,
  'curriculum.default_subject': 'english',

  // Compiler & Browser Pool Settings
  'compiler.chrome_bin': '/usr/bin/google-chrome',
  'compiler.use_warm_pool': true,

  // Routes & Endpoints
  'routes.diag.openrouter': '/diag/openrouter',
  'routes.diag.openrouter_cost': '/diag/openrouter-cost',
  'routes.web.health': '/health',
  'routes.web.manifest': '/manifest.json',
  'routes.web.sw': '/sw.js',
};

const ENV_ALIASES: Record<string, string[]> = {
  'vision.model.primary': ['VISION_MODEL_PRIMARY', 'OPENROUTER_VISION_MODEL'],
  'ai.openrouter.api_key': ['AI_OPENROUTER_API_KEY', 'OPENROUTER_API_KEY'],
};

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

  public get<T>(key: string, defaultValue?: T): T {
    if (this.overrides.has(key)) {
      return this.overrides.get(key) as T;
    }

    const envKey = key.toUpperCase().replace(/\./g, '_');
    let envVal = process.env[envKey] ?? process.env[key];

    // Check registered aliases if primary env var is not found
    if (envVal === undefined && ENV_ALIASES[key]) {
      for (const alias of ENV_ALIASES[key]) {
        if (process.env[alias] !== undefined) {
          envVal = process.env[alias];
          break;
        }
      }
    }

    const fallback = (defaultValue !== undefined ? defaultValue : DEFAULT_AIM_REGISTRY[key]) as T;

    if (envVal !== undefined) {
      if (typeof fallback === 'boolean') {
        return (envVal === 'true' || envVal === '1') as unknown as T;
      }
      if (typeof fallback === 'number') {
        const num = Number(envVal);
        return (isNaN(num) ? fallback : num) as unknown as T;
      }
      return envVal as unknown as T;
    }

    return fallback;
  }

  public set<T>(key: string, value: T): void {
    this.overrides.set(key, value);
  }

  public getOpenRouterRoutingConfig(): OpenRouterRoutingConfig {
    return {
      baseUrl: this.get<string>('ai.openrouter.base_url', 'https://openrouter.ai/api/v1'),
      chatEndpoint: this.get<string>('ai.openrouter.chat_endpoint', 'https://openrouter.ai/api/v1/chat/completions'),
      authKeyEndpoint: this.get<string>('ai.openrouter.auth_key_endpoint', 'https://openrouter.ai/api/v1/auth/key'),
      httpReferer: this.get<string>('ai.openrouter.http_referer', 'https://aim.getvintel.com'),
      appTitle: this.get<string>('ai.openrouter.app_title', 'HEX-AIM Cognitive Intake'),
      primaryModel: this.get<string>('vision.model.primary', 'google/gemini-3.5-flash-lite'),
      escalationModel: this.get<string>('vision.model.escalation', 'google/gemini-3.8-flash'),
      fallbackCascade: this.get<string[]>('vision.model.fallback_cascade', [
        'google/gemini-3.5-flash-lite',
        'google/gemini-3.8-flash'
      ]),
      providerOrder: this.get<string[]>('vision.provider.order', ['Google']),
      providerIgnore: this.get<string[]>('vision.provider.ignore', ['Google AI Studio']),
      allowFallbacks: this.get<boolean>('vision.provider.allow_fallbacks', false),
      timeoutMs: this.get<number>('vision.timeout_ms', 35000),
      imageFetchTimeoutMs: this.get<number>('network.image_fetch_timeout_ms', 15000),
      pingTimeoutMs: this.get<number>('network.ping_timeout_ms', 15000),
      temperature: this.get<number>('vision.temperature', 0.1),
    };
  }

  public logLoudFailure(stage: string, model: string, error: unknown, nextModel?: string): void {
    const errString = error instanceof Error ? error.message : String(error);
    if (nextModel) {
      console.error(
        `🚨 [LOUD FAILURE GATEWAY][${stage}] CRITICAL: Model '${model}' failed with error: "${errString}". ` +
        `ESCALATING TO NEXT FALLBACK CANDIDATE: '${nextModel}'. Zero silent degradation policy enforced.`
      );
    } else {
      console.error(
        `🚨 [LOUD FAILURE GATEWAY][${stage}] FATAL: Model '${model}' failed with error: "${errString}". ` +
        `CASCADE EXHAUSTED. Failing loud immediately.`
      );
    }
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
