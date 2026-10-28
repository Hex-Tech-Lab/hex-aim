import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { WarmBrowserPoolCompiler } from './WarmBrowserPoolCompiler.js';

export interface TemplateQuestion {
  number: number;
  marks: number;
  prompt: string;
  subQuestions?: string[];
  wordBank?: string[];
  tableData?: { headers: string[]; rows: string[][] };
  ruledLinesCount?: number;
}

export interface CanonicalTemplateSchema {
  id: string;
  subject: string;
  title: string;
  week: number;
  yearGroup: string;
  school: string;
  curriculum: string;
  totalMarks: number;
  timeAllowedMins: number;
  sections: {
    title: string;
    questions: TemplateQuestion[];
  }[];
}

export class CanonicalTemplateGenerator {
  private static readonly TEMPLATES: Record<string, CanonicalTemplateSchema> = {
    'sci-w8': {
      id: 'sci-w8',
      subject: 'Science',
      title: 'Sound, Pitch & Auditory Vibrations',
      week: 8,
      yearGroup: 'Year 4',
      school: 'Asten College • Cairo',
      curriculum: 'British National Curriculum (KS2)',
      totalMarks: 20,
      timeAllowedMins: 25,
      sections: [
        {
          title: 'Section A: Physical Vibrations & Acoustic Properties (10 Marks)',
          questions: [
            {
              number: 1,
              marks: 2,
              prompt: 'Sound is created when an object vibrates. Complete the sentences below using words from the box.',
              wordBank: ['particles', 'vacuum', 'energy', 'vibrations'],
              subQuestions: [
                'a) All sounds are produced by rapid back-and-forth ______________________.',
                'b) Sound travels through materials by transferring mechanical ______________________.',
              ],
              ruledLinesCount: 2,
            },
            {
              number: 2,
              marks: 3,
              prompt: 'Lara uses a drum and sprinkles dry rice grains on the surface. When she strikes the drum firmly with a drumstick:\nExplain what happens to the rice grains and why, using the word "vibration".',
              ruledLinesCount: 3,
            },
            {
              number: 3,
              marks: 3,
              prompt: 'Tick (✓) one box in each row to show whether sound can travel through the given medium.',
              tableData: {
                headers: ['Medium', 'Can Sound Travel? (Yes)', 'Cannot Travel? (No)'],
                rows: [
                  ['Air (Gas)', '[   ]', '[   ]'],
                  ['Water (Liquid)', '[   ]', '[   ]'],
                  ['Outer Space (Vacuum)', '[   ]', '[   ]'],
                ],
              },
            },
            {
              number: 4,
              marks: 2,
              prompt: 'How does tightening a guitar string change the pitch of the sound produced?',
              ruledLinesCount: 2,
            },
          ],
        },
      ],
    },
    'math-w8': {
      id: 'math-w8',
      subject: 'Mathematics',
      title: 'Decimals, Negative Integers & Place Value Alignment',
      week: 8,
      yearGroup: 'Year 4',
      school: 'Asten College • Cairo',
      curriculum: 'British National Curriculum (KS2)',
      totalMarks: 20,
      timeAllowedMins: 30,
      sections: [
        {
          title: 'Section A: Number & Place Value (10 Marks)',
          questions: [
            {
              number: 1,
              marks: 3,
              prompt: 'Write each of the following numbers in figures or words. Pay careful attention to empty column rooms:',
              subQuestions: [
                'a) Twenty-four thousand, one hundred and six: ______________________',
                'b) What is the value of the digit 4 in 54,208? ______________________',
                'c) Write the number that is 1,000 more than 39,450: ______________________',
              ],
              ruledLinesCount: 2,
            },
            {
              number: 2,
              marks: 3,
              prompt: 'Sequence these numbers in ascending order from smallest to largest:\n32,450   |   32,540   |   32,045   |   32,504',
              ruledLinesCount: 2,
            },
            {
              number: 3,
              marks: 2,
              prompt: 'The temperature in Oslo is -4°C. The temperature in London is -1°C. Which city is warmer, and by how many degrees?',
              ruledLinesCount: 2,
            },
            {
              number: 4,
              marks: 2,
              prompt: 'Calculate 5,004 - 1,287 showing full column subtraction and regrouping:',
              ruledLinesCount: 3,
            },
          ],
        },
      ],
    },
    'eng-w7': {
      id: 'eng-w7',
      subject: 'English',
      title: 'Suffixes, Prefixes & Sentence Syntax',
      week: 7,
      yearGroup: 'Year 4',
      school: 'Asten College • Cairo',
      curriculum: 'British National Curriculum (KS2)',
      totalMarks: 24,
      timeAllowedMins: 25,
      sections: [
        {
          title: 'Section A: Grammar & Punctuation (12 Marks)',
          questions: [
            {
              number: 1,
              marks: 4,
              prompt: 'Add the correct prefix (un-, dis-, mis-, in-) to the words below to form their opposites:',
              subQuestions: [
                'a) ______behave',
                'b) ______appear',
                'c) ______certain',
                'd) ______correct',
              ],
              ruledLinesCount: 2,
            },
            {
              number: 2,
              marks: 4,
              prompt: 'Rewrite the following run-on sentence by separating it into two grammatically complete sentences with correct capital letters and full stops:\n"The children sprinted across the field the bell had already started ringing loudly."',
              ruledLinesCount: 3,
            },
          ],
        },
      ],
    },
    'sci-w7': {
      id: 'sci-w7',
      subject: 'Science',
      title: 'Electrical Circuits & Conductors',
      week: 7,
      yearGroup: 'Year 4',
      school: 'Asten College • Cairo',
      curriculum: 'British National Curriculum (KS2)',
      totalMarks: 20,
      timeAllowedMins: 25,
      sections: [
        {
          title: 'Section A: Simple Series Circuits (10 Marks)',
          questions: [
            {
              number: 1,
              marks: 3,
              prompt: 'Identify the three essential components required for a simple closed electric circuit to light a bulb:',
              ruledLinesCount: 3,
            },
            {
              number: 2,
              marks: 3,
              prompt: 'Classify each material as either an electrical conductor or an insulator: copper wire, plastic ruler, steel nail, rubber band.',
              ruledLinesCount: 3,
            },
          ],
        },
      ],
    },
    'math-w7': {
      id: 'math-w7',
      subject: 'Mathematics',
      title: 'Equivalent Fractions & Decimals',
      week: 7,
      yearGroup: 'Year 4',
      school: 'Asten College • Cairo',
      curriculum: 'British National Curriculum (KS2)',
      totalMarks: 20,
      timeAllowedMins: 25,
      sections: [
        {
          title: 'Section A: Fractions & Decimals (10 Marks)',
          questions: [
            {
              number: 1,
              marks: 3,
              prompt: 'Find two equivalent fractions for 3/4:',
              ruledLinesCount: 2,
            },
            {
              number: 2,
              marks: 3,
              prompt: 'Convert the following fractions to decimals: 1/2, 1/4, 7/10.',
              ruledLinesCount: 2,
            },
          ],
        },
      ],
    },
  };

  public static getTemplate(id: string): CanonicalTemplateSchema {
    return this.TEMPLATES[id] || this.TEMPLATES['sci-w8']!;
  }

  public static listTemplateIds(): string[] {
    return Object.keys(this.TEMPLATES);
  }

  /**
   * Generates standalone, pixel-perfect A4 printable HTML for the template.
   */
  public static generateHtml(templateId: string): string {
    const t = this.getTemplate(templateId);

    const questionsHtml = t.sections.map(sec => `
      <div class="section-title">${sec.title}</div>
      ${sec.questions.map(q => `
        <div class="question-box">
          <div class="q-header">
            <span class="q-num">Question ${q.number}</span>
            <span class="q-marks">[${q.marks} Mark${q.marks > 1 ? 's' : ''}]</span>
          </div>
          <div class="q-prompt">${q.prompt.replace(/\n/g, '<br/>')}</div>
          
          ${q.wordBank ? `
            <div class="word-bank">
              ${q.wordBank.map(w => `<span class="word-chip">[ ${w} ]</span>`).join('')}
            </div>
          ` : ''}

          ${q.subQuestions ? `
            <div class="sub-questions">
              ${q.subQuestions.map(sq => `<div class="sub-q">${sq}</div>`).join('')}
            </div>
          ` : ''}

          ${q.tableData ? `
            <table class="q-table">
              <thead>
                <tr>${q.tableData.headers.map(h => `<th>${h}</th>`).join('')}</tr>
              </thead>
              <tbody>
                ${q.tableData.rows.map(row => `
                  <tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>
                `).join('')}
              </tbody>
            </table>
          ` : ''}

          ${q.ruledLinesCount ? `
            <div class="ruled-lines">
              ${Array.from({ length: q.ruledLinesCount }).map(() => `<div class="ruled-line"></div>`).join('')}
            </div>
          ` : ''}
        </div>
      `).join('')}
    `).join('');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${t.school} • ${t.title}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 14mm 16mm 14mm 16mm;
    }
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      background: #ffffff;
      margin: 0;
      padding: 0;
      font-size: 13px;
      line-height: 1.5;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .header-sheet {
      border-bottom: 2px solid #0f172a;
      padding-bottom: 12px;
      margin-bottom: 16px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .school-name {
      font-size: 16px;
      font-weight: 800;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: #0f172a;
    }
    .assessment-title {
      font-size: 14px;
      font-weight: 700;
      color: #0891b2;
      margin-top: 2px;
    }
    .meta-subtitle {
      font-size: 11px;
      color: #64748b;
      margin-top: 2px;
    }
    .batch-stamp {
      text-align: right;
      font-family: monospace;
      font-size: 10px;
      color: #64748b;
      background: #f1f5f9;
      padding: 4px 8px;
      border: 1px solid #cbd5e1;
      border-radius: 4px;
    }
    .student-fields {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr;
      gap: 12px;
      padding: 8px 12px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 4px;
      font-size: 12px;
      margin-bottom: 16px;
    }
    .student-field {
      border-bottom: 1px dotted #94a3b8;
      padding-bottom: 2px;
    }
    .section-title {
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      background: #e0f2fe;
      color: #0369a1;
      padding: 5px 10px;
      border-left: 4px solid #0284c7;
      margin: 14px 0 10px 0;
      border-radius: 2px;
    }
    .question-box {
      margin-bottom: 16px;
      page-break-inside: avoid;
    }
    .q-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 700;
      font-size: 12px;
      margin-bottom: 4px;
      color: #1e293b;
    }
    .q-marks {
      font-family: monospace;
      color: #0284c7;
    }
    .q-prompt {
      font-size: 12.5px;
      color: #1e293b;
      margin-bottom: 8px;
    }
    .word-bank {
      display: flex;
      gap: 8px;
      justify-content: center;
      margin: 8px 0;
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      padding: 6px;
      border-radius: 4px;
      font-family: monospace;
      font-size: 11px;
    }
    .word-chip {
      color: #0f172a;
      font-weight: 600;
    }
    .sub-questions {
      margin-left: 8px;
      margin-top: 6px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      font-size: 12px;
    }
    .q-table {
      width: 100%;
      border-collapse: collapse;
      margin: 8px 0;
      font-size: 11.5px;
    }
    .q-table th, .q-table td {
      border: 1px solid #cbd5e1;
      padding: 6px 10px;
      text-align: left;
    }
    .q-table th {
      background: #f1f5f9;
      font-weight: 600;
      color: #334155;
    }
    .ruled-lines {
      margin-top: 8px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .ruled-line {
      width: 100%;
      border-bottom: 1px solid #cbd5e1;
      height: 2px;
    }
    .footer-sheet {
      margin-top: 24px;
      border-top: 1px solid #cbd5e1;
      padding-top: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 10px;
      color: #64748b;
    }
  </style>
</head>
<body>
  <div class="header-sheet">
    <div>
      <div class="school-name">${t.school}</div>
      <div class="assessment-title">${t.yearGroup} • ${t.subject}: ${t.title}</div>
      <div class="meta-subtitle">${t.curriculum} • Week ${t.week} Formative Milestone</div>
    </div>
    <div class="batch-stamp">
      AIM-MST-${t.id.toUpperCase()}<br/>
      Time: ${t.timeAllowedMins}m | Max: ${t.totalMarks} Marks
    </div>
  </div>

  <div class="student-fields">
    <div class="student-field"><strong>Student Name:</strong> ___________________________</div>
    <div class="student-field"><strong>Class:</strong> Year 4 (Einstein)</div>
    <div class="student-field"><strong>Date:</strong> __________________</div>
  </div>

  ${questionsHtml}

  <div class="footer-sheet">
    <div>⚡ Compiled via HEX-AIM Vector Engine • 0 Inpainting Smudges • 100% Vector Fidelity</div>
    <div>Verification: https://aim.getvintel.com/verify?tid=${t.id} • Page 1 of 1</div>
  </div>
</body>
</html>`;
  }

  /**
   * Fast, serverless vector PDF synthesis via pdf-lib (0-browser dependency).
   */
  public static async generatePdfLibFallback(templateId: string): Promise<Uint8Array> {
    const t = this.getTemplate(templateId);
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 dimensions in points
    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontMono = await pdfDoc.embedFont(StandardFonts.Courier);

    let y = 800;

    // Header Title
    const cleanSchool = t.school.replace(/•/g, '|').toUpperCase();
    page.drawText(cleanSchool, { x: 40, y, size: 13, font: fontBold, color: rgb(0.06, 0.09, 0.16) });
    y -= 18;
    const cleanTitle = `${t.yearGroup} | ${t.subject}: ${t.title}`.replace(/•/g, '|').replace(/°C/g, ' deg C');
    page.drawText(cleanTitle, { x: 40, y, size: 11, font: fontBold, color: rgb(0.03, 0.57, 0.70) });
    y -= 14;
    page.drawText(`${t.curriculum} | Week ${t.week} Formative Milestone`.replace(/•/g, '|'), { x: 40, y, size: 9, font: fontRegular, color: rgb(0.39, 0.45, 0.55) });

    // Stamp
    page.drawText(`AIM-MST-${t.id.toUpperCase()} | Max: ${t.totalMarks} Marks`, { x: 380, y: y + 28, size: 8, font: fontMono, color: rgb(0.39, 0.45, 0.55) });

    // Divider Line
    y -= 12;
    page.drawLine({ start: { x: 40, y }, end: { x: 555, y }, thickness: 1.5, color: rgb(0.06, 0.09, 0.16) });
    y -= 20;

    // Student Meta Row
    page.drawText('Student Name: _________________________________', { x: 40, y, size: 9, font: fontRegular });
    page.drawText('Class: Year 4 (Einstein)', { x: 320, y, size: 9, font: fontRegular });
    page.drawText('Date: ____________', { x: 450, y, size: 9, font: fontRegular });
    y -= 25;

    // Sections & Questions
    for (const sec of t.sections) {
      page.drawRectangle({ x: 40, y: y - 4, width: 515, height: 16, color: rgb(0.88, 0.95, 0.99) });
      const cleanSecTitle = sec.title.replace(/•/g, '|').toUpperCase();
      page.drawText(cleanSecTitle, { x: 46, y, size: 8.5, font: fontBold, color: rgb(0.01, 0.41, 0.63) });
      y -= 24;

      for (const q of sec.questions) {
        if (y < 80) break; // prevent overflowing page 1
        page.drawText(`Question ${q.number} [${q.marks} Marks]`, { x: 40, y, size: 9, font: fontBold, color: rgb(0.12, 0.16, 0.23) });
        y -= 14;

        const cleanPrompt = q.prompt.replace(/\n/g, ' ').replace(/•/g, '|').replace(/°C/g, ' deg C');
        const promptLines = cleanPrompt.match(/.{1,75}(\s|$)/g) || [cleanPrompt];
        for (const line of promptLines) {
          page.drawText(line.trim(), { x: 40, y, size: 8.5, font: fontRegular, color: rgb(0.06, 0.09, 0.16) });
          y -= 12;
        }

        if (q.subQuestions) {
          for (const sq of q.subQuestions) {
            const cleanSq = sq.replace(/•/g, '|').replace(/°C/g, ' deg C');
            page.drawText(cleanSq, { x: 50, y, size: 8, font: fontRegular, color: rgb(0.12, 0.16, 0.23) });
            y -= 14;
          }
        }

        const linesToDraw = q.ruledLinesCount || 2;
        for (let l = 0; l < linesToDraw; l++) {
          y -= 10;
          page.drawLine({ start: { x: 40, y }, end: { x: 555, y }, thickness: 0.5, color: rgb(0.79, 0.83, 0.88) });
        }
        y -= 16;
      }
    }

    // Footer
    page.drawLine({ start: { x: 40, y: 35 }, end: { x: 555, y: 35 }, thickness: 0.8, color: rgb(0.79, 0.83, 0.88) });
    page.drawText('[*] Compiled via HEX-AIM Vector Engine | 0 Inpainting Smudges | 100% Vector Fidelity', { x: 40, y: 22, size: 7.5, font: fontRegular, color: rgb(0.39, 0.45, 0.55) });
    page.drawText('Page 1 of 1', { x: 510, y: 22, size: 7.5, font: fontRegular, color: rgb(0.39, 0.45, 0.55) });

    return await pdfDoc.save();
  }

  /**
   * Dual-mode compiler: Tries Chromium warm pool first (Approach C), falls back to pdf-lib.
   */
  public static async compileToPdf(templateId: string): Promise<Uint8Array> {
    const html = this.generateHtml(templateId);
    try {
      const pool = WarmBrowserPoolCompiler.getInstance();
      return await pool.compileHtmlToPdf(html);
    } catch (err) {
      console.warn(`[CanonicalTemplateGenerator] WarmBrowserPool unavailable, using vector fallback:`, err);
      return await this.generatePdfLibFallback(templateId);
    }
  }
}
