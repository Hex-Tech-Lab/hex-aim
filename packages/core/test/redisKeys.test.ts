import { afterEach, describe, expect, it } from 'vitest';
import { SettingsManager } from '../src/settings/SettingsManager.js';
import { redisKey, redisPrefix } from '../src/settings/redisKeys.js';

const settings = () => SettingsManager.getInstance() as unknown as { set(k: string, v: unknown): void };

describe('redisKey', () => {
  afterEach(() => settings().set('redis.prefix', ''));

  it('has no prefix by default for a dedicated database', () => {
    expect(redisPrefix()).toBe('');
    expect(redisKey('instructions', 'latest')).toBe('instructions:latest');
  });

  it('follows the central setting when one is configured', () => {
    settings().set('redis.prefix', 'hexaim');
    expect(redisKey('instructions', 'latest')).toBe('hexaim:instructions:latest');
  });

  it('does not double a trailing colon in the configured prefix', () => {
    settings().set('redis.prefix', 'aim:');
    expect(redisKey('lms', 'progress')).toBe('aim:lms:progress');
  });
});
