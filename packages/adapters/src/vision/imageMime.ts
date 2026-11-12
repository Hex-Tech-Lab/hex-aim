const EXTENSION_TYPES: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  webp: 'image/webp',
  heic: 'image/heic',
};

/**
 * Pick a vision-safe image MIME type for an inlined image.
 *
 * Telegram file URLs can answer with `application/octet-stream`, which vision
 * APIs reject. Trust the bytes first, then an image Content-Type header, then
 * the URL extension, and fall back to image/jpeg.
 */
export function resolveImageMime(
  bytes: Uint8Array,
  contentType: string | null,
  sourceUrl: string,
): string {
  const sniffed = sniffImageMime(bytes);
  if (sniffed) return sniffed;

  if (contentType && contentType.toLowerCase().startsWith('image/')) {
    return (contentType.split(';')[0] ?? '').trim().toLowerCase();
  }

  const ext = extensionOf(sourceUrl);
  return (ext && EXTENSION_TYPES[ext]) || 'image/jpeg';
}

function sniffImageMime(b: Uint8Array): string | null {
  const at = (i: number): number => b[i] ?? -1;
  const startsWith = (sig: number[], offset = 0): boolean =>
    b.length >= offset + sig.length && sig.every((v, i) => at(offset + i) === v);

  if (startsWith([0xff, 0xd8, 0xff])) return 'image/jpeg';
  if (startsWith([0x89, 0x50, 0x4e, 0x47])) return 'image/png';
  if (startsWith([0x47, 0x49, 0x46, 0x38])) return 'image/gif';
  if (startsWith([0x52, 0x49, 0x46, 0x46]) && startsWith([0x57, 0x45, 0x42, 0x50], 8)) return 'image/webp';
  return null;
}

function extensionOf(url: string): string | null {
  try {
    const path = new URL(url).pathname;
    const match = /\.([a-z0-9]+)$/i.exec(path);
    return match?.[1]?.toLowerCase() ?? null;
  } catch {
    return null;
  }
}
