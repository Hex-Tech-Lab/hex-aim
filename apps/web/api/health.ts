import type { IncomingMessage, ServerResponse } from 'http';

export default function handler(_req: IncomingMessage, res: ServerResponse): void {
  res.setHeader('Content-Type', 'application/json');
  res.statusCode = 200;
  res.end(JSON.stringify({
    status: 'ok',
    service: 'hex-aim-web',
    timestamp: new Date().toISOString(),
  }));
}
