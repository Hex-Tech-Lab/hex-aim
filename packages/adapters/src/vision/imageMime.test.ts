import { describe, expect, it } from 'vitest';
import { resolveImageMime } from './imageMime.js';

const JPEG = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0, 0x10, 0x4a, 0x46]);
const PNG = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const WEBP = new Uint8Array([0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x57, 0x45, 0x42, 0x50]);
const UNKNOWN = new Uint8Array([0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07]);

describe('resolveImageMime', () => {
  it('sniffs JPEG bytes even when the server says octet-stream', () => {
    const url = 'https://api.telegram.org/file/bot123/photos/file_7';
    expect(resolveImageMime(JPEG, 'application/octet-stream', url)).toBe('image/jpeg');
  });

  it('sniffs PNG and WebP from magic bytes', () => {
    expect(resolveImageMime(PNG, null, 'https://x/a')).toBe('image/png');
    expect(resolveImageMime(WEBP, 'application/octet-stream', 'https://x/a')).toBe('image/webp');
  });

  it('uses an image Content-Type header when the bytes are not recognised', () => {
    expect(resolveImageMime(UNKNOWN, 'image/png; charset=binary', 'https://x/a')).toBe('image/png');
  });

  it('ignores a non-image Content-Type and falls back to the URL extension', () => {
    expect(resolveImageMime(UNKNOWN, 'application/octet-stream', 'https://x/photo.PNG')).toBe('image/png');
  });

  it('falls back to image/jpeg when nothing else identifies the type', () => {
    expect(resolveImageMime(UNKNOWN, 'application/octet-stream', 'https://x/file_id')).toBe('image/jpeg');
    expect(resolveImageMime(UNKNOWN, null, 'not a url')).toBe('image/jpeg');
  });
});
