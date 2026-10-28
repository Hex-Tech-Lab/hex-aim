import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { CanonicalTemplateGenerator } from '../packages/core/dist/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, '../apps/web/public');

async function main() {
  const templateIds = ['sci-w8', 'math-w8', 'eng-w7', 'sci-w7', 'math-w7'];
  console.log(`📦 Pre-generating vector PDFs and standalone HTML for ${templateIds.length} templates...`);

  for (const tid of templateIds) {
    const tplDir = path.join(publicDir, 'api/template', tid);
    fs.mkdirSync(tplDir, { recursive: true });

    // 1. Generate HTML preview
    const html = CanonicalTemplateGenerator.generateHtml(tid);
    fs.writeFileSync(path.join(tplDir, 'html'), html, 'utf8');
    fs.writeFileSync(path.join(tplDir, 'index.html'), html, 'utf8');

    // 2. Generate vector PDF (via pdf-lib fallback)
    const pdfBytes = await CanonicalTemplateGenerator.generatePdfLibFallback(tid);
    fs.writeFileSync(path.join(tplDir, 'pdf'), Buffer.from(pdfBytes));

    console.log(`  ✓ Generated /api/template/${tid}/html (${html.length} B) and /pdf (${pdfBytes.length} B)`);
  }

  // Pre-generate sample sprint PDF
  const sprintDir = path.join(publicDir, 'api/sprint/sprint_3');
  fs.mkdirSync(sprintDir, { recursive: true });
  const samplePdf = await CanonicalTemplateGenerator.generatePdfLibFallback('math-w8');
  fs.writeFileSync(path.join(sprintDir, 'pdf'), Buffer.from(samplePdf));
  console.log(`  ✓ Generated /api/sprint/sprint_3/pdf (${samplePdf.length} B)`);

  console.log('✅ All template and sprint assets pre-generated into public directory.');
}

main().catch(err => {
  console.error('Error pre-generating templates:', err);
  process.exit(1);
});
