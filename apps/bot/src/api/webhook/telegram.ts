import type { IncomingMessage, ServerResponse } from 'http';
import worker from '../../worker.js';

/**
 * Vercel Serverless Node Route Fallback for Telegram Webhook
 */
export default async function handler(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const url = `https://${req.headers.host || 'localhost'}${req.url || '/webhook/telegram'}`;
  
  // Buffer body
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  const body = Buffer.concat(chunks).toString('utf-8');

  const headers = new Headers();
  for (const [k, v] of Object.entries(req.headers)) {
    if (v) headers.set(k, Array.isArray(v) ? v.join(',') : v);
  }

  const workerReq = new Request(url, {
    method: req.method || 'POST',
    headers,
    body: req.method !== 'GET' && req.method !== 'HEAD' ? body : undefined,
  });

  const workerRes = await worker.fetch(workerReq, {}, {} as any);

  res.statusCode = workerRes.status;
  workerRes.headers.forEach((v, k) => {
    res.setHeader(k, v);
  });

  const resText = await workerRes.text();
  res.end(resText);
}
