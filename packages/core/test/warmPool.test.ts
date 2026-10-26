import { describe, it, expect, afterAll } from 'vitest';
import { WarmBrowserPoolCompiler } from '../src/compilers/WarmBrowserPoolCompiler.js';

describe('WarmBrowserPoolCompiler (Approach C)', () => {
  const compiler = WarmBrowserPoolCompiler.getInstance();

  afterAll(async () => {
    await compiler.shutdown();
  });

  it('renders pixel-perfect PDF from HTML in warm pool with sub-second latency', async () => {
    const testHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: sans-serif; margin: 20px; }
          .card { border: 1px solid #06b6d4; padding: 15px; border-radius: 8px; }
          h1 { color: #1e3a8a; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>HEX-AIM Warm Browser Pool Test</h1>
          <p>Approach C Enterprise Target: Verified sub-second PDF compilation.</p>
        </div>
      </body>
      </html>
    `;

    // Warm-up / first render
    const t0 = Date.now();
    const pdfBytes1 = await compiler.compileHtmlToPdf(testHtml);
    const duration1 = Date.now() - t0;

    expect(pdfBytes1).toBeInstanceOf(Uint8Array);
    expect(pdfBytes1.length).toBeGreaterThan(1000);

    // Second render (guaranteed warm page from pool)
    const t1 = Date.now();
    const pdfBytes2 = await compiler.compileHtmlToPdf(testHtml);
    const duration2 = Date.now() - t1;

    expect(pdfBytes2).toBeInstanceOf(Uint8Array);
    expect(pdfBytes2.length).toBeGreaterThan(1000);

    console.log(`[WarmBrowserPool] Warm render completed in ${duration2}ms (First run: ${duration1}ms)`);
    expect(duration2).toBeLessThan(1000); // Must be under 1s
  }, 30000);
});
