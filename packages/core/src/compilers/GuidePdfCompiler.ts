import { PDFDocument, rgb, StandardFonts, PDFPage } from 'pdf-lib';
import type { Student, CognitiveGap, Guardian } from '@hex-aim/types';

export interface PdfCompilerOptions {
  date?: string;
  sprintNumber?: number;
  subjectTitle?: string;
  guardianName?: string;
  week?: number;
}

function clean(str: string): string {
  if (!str) return '';
  // Strip non-WinAnsi/non-ASCII characters to prevent font encoding errors
  return str.replace(/[^\x20-\x7E]/g, ' ').replace(/\s+/g, ' ').trim();
}

export class GuidePdfCompiler {
  /**
   * Generates a 2-page Parent Socratic Coaching Guide PDF.
   */
  public static async compileGuidePdf(
    student: Student,
    gaps: CognitiveGap[],
    guardian?: Guardian,
    options: PdfCompilerOptions = {}
  ): Promise<Uint8Array> {
    const doc = await PDFDocument.create();
    const boldFont = await doc.embedFont(StandardFonts.HelveticaBold);
    const regularFont = await doc.embedFont(StandardFonts.Helvetica);
    const obliqueFont = await doc.embedFont(StandardFonts.HelveticaOblique);

    const guideDate = options.date || new Date().toISOString().split('T')[0]!;
    const subject = clean((options.subjectTitle || 'English').toUpperCase());
    const week = options.week || 3;
    const studentName = clean(student.name || 'Student');
    const coachName = clean(options.guardianName || guardian?.name || 'Parent Coach');

    const cyan = rgb(0.02, 0.71, 0.83);
    const darkNavy = rgb(0.12, 0.23, 0.54);
    const textDark = rgb(0.12, 0.16, 0.24);
    const textMuted = rgb(0.39, 0.45, 0.55);
    const cardBorder = rgb(0.89, 0.91, 0.94);
    const lightBg = rgb(0.95, 0.96, 0.98);

    const drawGuideHeader = (page: PDFPage, pageNum: number) => {
      page.drawText('HEX-AIM  -  SOCRATIC PARENT COACHING GUIDE', {
        x: 40,
        y: 805,
        size: 8.5,
        font: boldFont,
        color: cyan,
      });
      page.drawText(clean(`8-Minute Coaching Script: ${studentName}`), {
        x: 40,
        y: 785,
        size: 16,
        font: boldFont,
        color: darkNavy,
      });
      page.drawText(clean(`Coach: ${coachName}  |  Year ${student.yearGroup}  |  ${subject} W${week}  |  ${guideDate}`), {
        x: 40,
        y: 770,
        size: 9.5,
        font: regularFont,
        color: textMuted,
      });

      page.drawLine({
        start: { x: 40, y: 758 },
        end: { x: 555, y: 758 },
        thickness: 2,
        color: darkNavy,
      });

      page.drawLine({
        start: { x: 40, y: 35 },
        end: { x: 555, y: 35 },
        thickness: 0.5,
        color: cardBorder,
      });
      page.drawText(clean(`HEX-AIM Coaching Guide  -  ${studentName}  -  Page ${pageNum} of 2`), {
        x: 40,
        y: 24,
        size: 8,
        font: regularFont,
        color: textMuted,
      });
    };

    // Page 1
    const page1 = doc.addPage([595.28, 841.89]);
    drawGuideHeader(page1, 1);

    // Rule 1: Guardrail banner
    page1.drawRectangle({
      x: 40,
      y: 670,
      width: 515,
      height: 70,
      color: rgb(0.95, 0.98, 0.95),
      borderColor: rgb(0.65, 0.85, 0.65),
      borderWidth: 1.5,
    });
    page1.drawText('THE GOLDEN GROUND RULE (Zero Shaming, 100% Curiosity)', {
      x: 54,
      y: 718,
      size: 10,
      font: boldFont,
      color: rgb(0.1, 0.55, 0.25),
    });
    page1.drawText('Never say: "We went over this already!" or "Look properly."', {
      x: 54,
      y: 702,
      size: 9.5,
      font: boldFont,
      color: textDark,
    });
    page1.drawText('Instead ask: "What does your brain see first?" Let the student spot the pattern herself.', {
      x: 54,
      y: 686,
      size: 9,
      font: regularFont,
      color: textMuted,
    });

    // Identified Gaps Review
    page1.drawText('IDENTIFIED GAPS TO TARGET IN THIS SESSION:', {
      x: 40,
      y: 640,
      size: 11,
      font: boldFont,
      color: darkNavy,
    });

    let currentY = 615;
    for (let i = 0; i < Math.min(3, gaps.length || 1); i++) {
      const gap = gaps[i];
      const desc = gap?.description || 'Past tense verb regular vs irregular confusion';
      const hint = gap?.socraticHint || 'Ask: Does this verb take "-ed" or does it transform like a chameleon?';

      page1.drawRectangle({
        x: 40,
        y: currentY - 55,
        width: 515,
        height: 60,
        color: lightBg,
        borderColor: cardBorder,
        borderWidth: 1,
      });
      page1.drawText(clean(`Gap #${i + 1}: ${desc.slice(0, 75)}`), {
        x: 52,
        y: currentY - 18,
        size: 9.5,
        font: boldFont,
        color: textDark,
      });
      page1.drawText(clean(`Socratic Key: "${hint.slice(0, 95)}"`), {
        x: 52,
        y: currentY - 36,
        size: 9,
        font: obliqueFont,
        color: rgb(0.15, 0.35, 0.75),
      });

      currentY -= 70;
    }

    // Page 2: Guided Dialogue Script
    const page2 = doc.addPage([595.28, 841.89]);
    drawGuideHeader(page2, 2);

    page2.drawText('STEP-BY-STEP SOCRATIC DIALOGUE SCRIPT', {
      x: 40,
      y: 725,
      size: 12,
      font: boldFont,
      color: darkNavy,
    });

    const dialogue = [
      {
        step: 'Step 1: The Opener (1 minute)',
        parent: 'Parent: "Hey! Let\'s do an 8-minute power sprint. Pick your favourite pencil."',
        student: 'Goal: Lower working memory tension before looking at any questions.',
      },
      {
        step: 'Step 2: When She Writes "runned" or "cleaned" (3 minutes)',
        parent: 'Parent: "Read that out loud to me. Does your ear like how that sounds?"',
        student: 'Goal: Activate auditory self-correction without pointing out the error.',
      },
      {
        step: 'Step 3: When She Hesitates or Freezes (2 minutes)',
        parent: 'Parent: "No rush at all. Pretend you are explaining this word to Maya. What would you tell her?"',
        student: 'Goal: Disarm performance anxiety and re-engage conceptual memory.',
      },
      {
        step: 'Step 4: The Celebration Close (1 minute)',
        parent: 'Parent: "I loved how you caught the tricky irregular verb on Page 2! High five!"',
        student: 'Goal: Reward strategic persistence, never raw speed.',
      },
    ];

    let dy = 690;
    for (const d of dialogue) {
      page2.drawRectangle({
        x: 40,
        y: dy - 60,
        width: 515,
        height: 65,
        color: rgb(1, 1, 1),
        borderColor: cardBorder,
        borderWidth: 1.5,
      });
      page2.drawText(clean(d.step), {
        x: 52,
        y: dy - 18,
        size: 10,
        font: boldFont,
        color: cyan,
      });
      page2.drawText(clean(d.parent), {
        x: 52,
        y: dy - 34,
        size: 9.5,
        font: boldFont,
        color: darkNavy,
      });
      page2.drawText(clean(d.student), {
        x: 52,
        y: dy - 50,
        size: 8.5,
        font: obliqueFont,
        color: textMuted,
      });
      dy -= 75;
    }

    return await doc.save();
  }
}
