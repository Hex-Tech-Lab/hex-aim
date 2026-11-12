import { SettingsManager } from './SettingsManager.js';

/**
 * The Redis key prefix comes from the central settings registry (`redis.prefix`).
 * Empty means no prefix, which is the default for a dedicated database.
 * Change it in one place and every key in every process follows.
 */
export function redisPrefix(): string {
  return SettingsManager.getInstance().get<string>('redis.prefix', '');
}

/** Build a Redis key from parts, prefixed only when a prefix is configured. */
export function redisKey(...parts: string[]): string {
  const prefix = redisPrefix().replace(/:+$/, '');
  return [prefix, ...parts].filter((p) => p !== '').join(':');
}
