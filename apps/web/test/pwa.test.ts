import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import * as http from 'http';
import { createServer } from '../src/server.js';

describe('Wave 18: Progressive Web App (PWA) Offline Synchronization', () => {
  let server: http.Server;
  let baseUrl: string;

  beforeAll(async () => {
    server = createServer();
    await new Promise<void>((resolve) => {
      server.listen(0, () => {
        const addr = server.address() as any;
        baseUrl = `http://localhost:${addr.port}`;
        resolve();
      });
    });
  });

  afterAll(async () => {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  });

  it('serves valid PWA Web App Manifest at /manifest.json', async () => {
    const res = await fetch(`${baseUrl}/manifest.json`);
    expect(res.status).toBe(200);
    const json = await res.json() as any;
    expect(json.name).toBe('HEX-AIM Academic Mastery Console');
    expect(json.display).toBe('standalone');
    expect(json.theme_color).toBe('#06b6d4');
  });

  it('serves valid PWA ServiceWorker script at /sw.js with Cache-First & Stale-While-Revalidate rules', async () => {
    const res = await fetch(`${baseUrl}/sw.js`);
    expect(res.status).toBe(200);
    const script = await res.text();
    expect(script).toContain('CACHE_NAME');
    expect(script).toContain('self.addEventListener(\'fetch\'');
    expect(script).toContain('caches.open');
  });

  it('delivers PWA manifest and service worker meta tags inside dashboard HTML shell', async () => {
    const res = await fetch(`${baseUrl}/`);
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain('<link rel="manifest" href="/manifest.json">');
    expect(html).toContain('navigator.serviceWorker.register(\'/sw.js\')');
  });
});
