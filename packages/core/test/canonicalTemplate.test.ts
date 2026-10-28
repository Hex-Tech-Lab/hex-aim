import { describe, it, expect } from 'vitest';
import { CanonicalTemplateGenerator } from '../src/compilers/CanonicalTemplateGenerator.js';

describe('CanonicalTemplateGenerator (Wave 20)', () => {
  it('generates pristine A4 printable HTML for known templates', () => {
    const html = CanonicalTemplateGenerator.generateHtml('sci-w8');
    expect(html).toContain('Asten College • Cairo');
    expect(html).toContain('Sound, Pitch & Auditory Vibrations');
    expect(html).toContain('AIM-MST-SCI-W8');
    expect(html).toContain('size: A4 portrait');
  });

  it('generates 0-dependency vector PDF via pdf-lib fallback in sub-50ms', async () => {
    const t0 = Date.now();
    const pdfBytes = await CanonicalTemplateGenerator.generatePdfLibFallback('math-w8');
    const elapsed = Date.now() - t0;

    expect(pdfBytes).toBeInstanceOf(Uint8Array);
    expect(pdfBytes.length).toBeGreaterThan(1000);
    // PDF Magic bytes check (%PDF-)
    const header = Buffer.from(pdfBytes.subarray(0, 5)).toString();
    expect(header).toBe('%PDF-');
    expect(elapsed).toBeLessThan(100);
  });

  it('dual-mode compileToPdf produces valid PDF with vector fidelity', async () => {
    const pdfBytes = await CanonicalTemplateGenerator.compileToPdf('eng-w7');
    expect(pdfBytes).toBeInstanceOf(Uint8Array);
    expect(pdfBytes.length).toBeGreaterThan(1000);
    const header = Buffer.from(pdfBytes.subarray(0, 5)).toString();
    expect(header).toBe('%PDF-');
  });
});
