import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import * as http from 'http';
import { createServer } from '../src/server.js';

describe('Apps/Web HTTP Server & Console', () => {
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

  it('GET /health returns 200 OK', async () => {
    const res = await fetch(`${baseUrl}/health`);
    expect(res.status).toBe(200);
    const body = await res.json() as any;
    expect(body.status).toBe('ok');
    expect(body.service).toBe('hex-aim-web');
  });

  it('GET / returns Dashboard HTML with metrics and roster', async () => {
    const res = await fetch(`${baseUrl}/`);
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain('HEX-AIM');
    expect(html).toContain('Asten College');
    expect(html).toContain('Active Priority');
    expect(html).toContain('Lara');
    expect(html).toContain('Maya');
  });

  it('GET /sprint/preview renders 4-page adaptive print sprint', async () => {
    const res = await fetch(`${baseUrl}/sprint/preview`);
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain('Phase 1: Rapid Warmup');
    expect(html).toContain('Phase 2: Target Medicine');
    expect(html).toContain('Page 1 of 4');
    expect(html).toContain('Page 4 of 4');
  });

  it('GET /guide/preview renders parent Socratic guide', async () => {
    const res = await fetch(`${baseUrl}/guide/preview`);
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain('Socratic Coaching Guide');
    expect(html).toContain('Golden Rule: Never Give Away the Answer');
  });

  it('GET /api/students returns JSON student list', async () => {
    const res = await fetch(`${baseUrl}/api/students`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
  });
});
