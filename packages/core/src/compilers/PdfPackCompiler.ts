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

export class PdfPackCompiler {
  /**
   * Generates a 4-page ADHD-friendly printable Student Sprint PDF.
   * Fully self-contained, < 15ms execution time, returns binary Uint8Array.
   */
  public static async compileSprintPdf(
    student: Student,
    gaps: CognitiveGap[],
    options: PdfCompilerOptions = {}
  ): Promise<Uint8Array> {
    const doc = await PDFDocument.create();
    const boldFont = await doc.embedFont(StandardFonts.HelveticaBold);
    const regularFont = await doc.embedFont(StandardFonts.Helvetica);
    const obliqueFont = await doc.embedFont(StandardFonts.HelveticaOblique);

    const sprintDate = options.date || new Date().toISOString().split('T')[0]!;
    const subject = clean((options.subjectTitle || 'English').toUpperCase());
    const week = options.week || 3;
    const duration = student.neuroProfile.optimalSprintDurationMins || 8;
    const studentName = clean(student.name || 'Student');

    const cyan = rgb(0.02, 0.71, 0.83); // #06b6d4
    const darkNavy = rgb(0.12, 0.23, 0.54); // #1e3a8a
    const textDark = rgb(0.12, 0.16, 0.24); // #1e293b
    const textMuted = rgb(0.39, 0.45, 0.55); // #64748b
    const cardBorder = rgb(0.89, 0.91, 0.94); // #e2e8f0
    const lightBg = rgb(0.95, 0.96, 0.98); // #f1f5f9
    const accentBlue = rgb(0.15, 0.39, 0.92); // #2563eb

    // Helper: draw page header
    const drawHeader = (page: PDFPage, pageNum: number, pageTitle: string, subtitle: string) => {
      // Header brand
      page.drawText(clean('HEX-AIM  -  ADAPTIVE INDIVIDUALIZED MASTERY'), {
        x: 40,
        y: 805,
        size: 8.5,
        font: boldFont,
        color: cyan,
      });

      // Title & Subtitle
      page.drawText(clean(pageTitle), {
        x: 40,
        y: 785,
        size: 16,
        font: boldFont,
        color: darkNavy,
      });
      page.drawText(clean(subtitle), {
        x: 40,
        y: 770,
        size: 9.5,
        font: regularFont,
        color: textMuted,
      });

      // Student Meta Box
      page.drawRectangle({
        x: 410,
        y: 768,
        width: 145,
        height: 38,
        color: lightBg,
        borderColor: cardBorder,
        borderWidth: 1,
      });
      page.drawText(clean(`Student: ${studentName}`), {
        x: 418,
        y: 792,
        size: 9,
        font: boldFont,
        color: textDark,
      });
      page.drawText(clean(`Yr ${student.yearGroup} | ${subject} W${week} | ${duration}m`), {
        x: 418,
        y: 778,
        size: 8,
        font: regularFont,
        color: textMuted,
      });

      // Dividing bar
      page.drawLine({
        start: { x: 40, y: 758 },
        end: { x: 555, y: 758 },
        thickness: 2,
        color: accentBlue,
      });

      // Footer
      page.drawLine({
        start: { x: 40, y: 35 },
        end: { x: 555, y: 35 },
        thickness: 0.5,
        color: cardBorder,
      });
      page.drawText(clean(`HEX-AIM Sprint  -  ${studentName}  -  ${subject} W${week}  -  ${sprintDate}`), {
        x: 40,
        y: 24,
        size: 8,
        font: regularFont,
        color: textMuted,
      });
      page.drawText(clean(`Page ${pageNum} of 4`), {
        x: 505,
        y: 24,
        size: 8,
        font: boldFont,
        color: textMuted,
      });
    };

    // Helper: draw question card
    const drawCard = (page: PDFPage, x: number, y: number, w: number, h: number, qNum: string, title: string, prompt: string, boxText: string = 'Write answer here...') => {
      page.drawRectangle({
        x,
        y,
        width: w,
        height: h,
        color: rgb(1, 1, 1),
        borderColor: cardBorder,
        borderWidth: 1.5,
      });

      // Q number circle
      page.drawCircle({
        x: x + 18,
        y: y + h - 18,
        size: 11,
        color: accentBlue,
      });
      page.drawText(clean(qNum), {
        x: x + 14,
        y: y + h - 22,
        size: 9.5,
        font: boldFont,
        color: rgb(1, 1, 1),
      });

      // Title
      page.drawText(clean(title), {
        x: x + 36,
        y: y + h - 22,
        size: 11,
        font: boldFont,
        color: darkNavy,
      });

      // Prompt
      page.drawText(clean(prompt), {
        x: x + 16,
        y: y + h - 42,
        size: 9.5,
        font: regularFont,
        color: textDark,
      });

      // Answer write-in box
      page.drawRectangle({
        x: x + 16,
        y: y + 14,
        width: w - 32,
        height: h - 68,
        color: lightBg,
        borderColor: rgb(0.8, 0.85, 0.9),
        borderWidth: 1,
      });
      page.drawText(clean(boxText), {
        x: x + 24,
        y: y + 26,
        size: 8.5,
        font: obliqueFont,
        color: rgb(0.65, 0.7, 0.78),
      });
    };

    // PAGE 1: Core Concept Anchor & Warm-Up
    const page1 = doc.addPage([595.28, 841.89]);
    drawHeader(page1, 1, 'Page 1: Concept Anchor & Warm-Up', 'Notice the pattern - Build intuitive confidence');

    // Focus banner
    page1.drawRectangle({
      x: 40,
      y: 675,
      width: 515,
      height: 65,
      color: rgb(0.94, 0.97, 1),
      borderColor: rgb(0.75, 0.85, 0.98),
      borderWidth: 1.5,
    });
    page1.drawText('TARGET COGNITIVE GOAL', {
      x: 54,
      y: 720,
      size: 10,
      font: boldFont,
      color: accentBlue,
    });
    const mainGap = gaps[0]?.description || 'Master regular/irregular verb patterns and precision spelling.';
    page1.drawText(clean(mainGap.slice(0, 85)), {
      x: 54,
      y: 704,
      size: 9.5,
      font: boldFont,
      color: textDark,
    });
    page1.drawText('Tip: Break the word into roots and endings. Read aloud before writing!', {
      x: 54,
      y: 688,
      size: 9,
      font: regularFont,
      color: textMuted,
    });

    // 2 Practice Questions
    drawCard(
      page1,
      40,
      500,
      515,
      155,
      '1',
      'Warm-Up: Spot the Rule',
      'Identify the correct past-tense spelling for the action shown:',
      'Example: jump -> jumped. Now write the past tense for: walk, clean, and open.'
    );

    drawCard(
      page1,
      40,
      325,
      515,
      155,
      '2',
      'Pattern Application: Guided Sentence',
      'Complete the sentence using the past-tense form of the verb in brackets:',
      'Yesterday, we [bake] ________ a delicious cake and [watch] ________ our favourite movie.'
    );

    page1.drawText('Speed Check: If you finish before 3 minutes, put a star next to your favourite sentence!', {
      x: 40,
      y: 295,
      size: 9,
      font: obliqueFont,
      color: textMuted,
    });

    // PAGE 2: Scaffolding & Deep Practice
    const page2 = doc.addPage([595.28, 841.89]);
    drawHeader(page2, 2, 'Page 2: Deep Practice & Irregular Verbs', 'Apply rules independently - Spot tricky exceptions');

    drawCard(
      page2,
      40,
      570,
      515,
      165,
      '3',
      'Irregular Verb Hunt: No "-ed" Allowed!',
      'Some verbs change completely in the past. Fill in the missing forms:',
      'run -> ________   |   come -> ________   |   drink -> ________   |   see -> ________'
    );

    drawCard(
      page2,
      40,
      385,
      515,
      165,
      '4',
      'Detective Challenge: Find & Fix the Error',
      'Read the passage below. Circle the 2 incorrect verb spellings and rewrite them correctly:',
      '"Lara runned all the way to school, but she forgetted her English notebook on the table."'
    );

    drawCard(
      page2,
      40,
      200,
      515,
      165,
      '5',
      'Sentence Builder Challenge',
      'Write 2 original sentences using one regular verb and one irregular verb from above:',
      'Sentence 1: _________________________________________________________________\nSentence 2: _________________________________________________________________'
    );

    // PAGE 3: Fluency & Speed Challenge
    const page3 = doc.addPage([595.28, 841.89]);
    drawHeader(page3, 3, 'Page 3: Fluency & Speed Challenge', '2-Minute Rapid Fire - Build muscle memory');

    page3.drawRectangle({
      x: 40,
      y: 685,
      width: 515,
      height: 55,
      color: rgb(0.98, 0.95, 1),
      borderColor: rgb(0.85, 0.75, 0.98),
      borderWidth: 1.5,
    });
    page3.drawText('RAPID-FIRE SPRINT (Set a 2-Minute Timer!)', {
      x: 54,
      y: 720,
      size: 10,
      font: boldFont,
      color: rgb(0.55, 0.15, 0.85),
    });
    page3.drawText('Write the past tense as fast as you can. No erasures needed - trust your first instinct!', {
      x: 54,
      y: 702,
      size: 9,
      font: regularFont,
      color: textDark,
    });

    const items = [
      { q: '1. play -> ________', x: 50, y: 640 },
      { q: '2. eat -> ________', x: 220, y: 640 },
      { q: '3. write -> ________', x: 390, y: 640 },
      { q: '4. jump -> ________', x: 50, y: 590 },
      { q: '5. go -> ________', x: 220, y: 590 },
      { q: '6. sing -> ________', x: 390, y: 590 },
      { q: '7. smile -> ________', x: 50, y: 540 },
      { q: '8. take -> ________', x: 220, y: 540 },
      { q: '9. catch -> ________', x: 390, y: 540 },
    ];

    for (const it of items) {
      page3.drawRectangle({
        x: it.x - 6,
        y: it.y - 10,
        width: 155,
        height: 34,
        color: lightBg,
        borderColor: cardBorder,
        borderWidth: 1,
      });
      page3.drawText(clean(it.q), {
        x: it.x,
        y: it.y + 4,
        size: 10,
        font: boldFont,
        color: darkNavy,
      });
    }

    drawCard(
      page3,
      40,
      320,
      515,
      175,
      '10',
      'Mastery Synthesis: Mini-Story',
      'Combine at least 3 verbs from above into a short 2-sentence story:',
      'Yesterday, _________________________________________________________________\nAnd then, __________________________________________________________________'
    );

    // PAGE 4: Metacognitive Check & Sibling Collaboration
    const page4 = doc.addPage([595.28, 841.89]);
    drawHeader(page4, 4, 'Page 4: Brain Reflection & Parent Sign-Off', 'Celebrate effort - Wire the learning permanently');

    // Brain feelings box
    page4.drawRectangle({
      x: 40,
      y: 610,
      width: 515,
      height: 130,
      color: rgb(0.98, 0.98, 0.95),
      borderColor: rgb(0.9, 0.85, 0.6),
      borderWidth: 1.5,
    });
    page4.drawText('HOW DID YOUR BRAIN FEEL TODAY?', {
      x: 54,
      y: 715,
      size: 11,
      font: boldFont,
      color: rgb(0.7, 0.45, 0.05),
    });
    page4.drawText('Check the box that best describes your sprint:', {
      x: 54,
      y: 698,
      size: 9.5,
      font: regularFont,
      color: textDark,
    });

    page4.drawRectangle({ x: 54, y: 660, width: 14, height: 14, color: rgb(1, 1, 1), borderColor: cardBorder, borderWidth: 1.5 });
    page4.drawText('[  ] Felt super smooth & easy! (Ready to level up)', { x: 76, y: 663, size: 9.5, font: boldFont, color: rgb(0.1, 0.6, 0.3) });

    page4.drawRectangle({ x: 54, y: 635, width: 14, height: 14, color: rgb(1, 1, 1), borderColor: cardBorder, borderWidth: 1.5 });
    page4.drawText('[  ] Had to pause and think, but got there myself!', { x: 76, y: 638, size: 9.5, font: boldFont, color: rgb(0.8, 0.5, 0.05) });

    // Peer Explainer Challenge (Non-punitive Sibling Collaboration)
    page4.drawRectangle({
      x: 40,
      y: 450,
      width: 515,
      height: 140,
      color: rgb(0.99, 0.95, 0.97),
      borderColor: rgb(0.95, 0.75, 0.85),
      borderWidth: 1.5,
    });
    page4.drawText('THE PEER EXPLAINER CHALLENGE (Zero Competition!)', {
      x: 54,
      y: 565,
      size: 11,
      font: boldFont,
      color: rgb(0.75, 0.1, 0.45),
    });
    page4.drawText('Explain Question #3 irregular verb trick to Maya or a study buddy in 1 minute.', {
      x: 54,
      y: 548,
      size: 9.5,
      font: regularFont,
      color: textDark,
    });
    page4.drawText('Remember: When you teach someone else, your own brain wires it 2x faster!', {
      x: 54,
      y: 534,
      size: 8.5,
      font: obliqueFont,
      color: textMuted,
    });
    page4.drawText('I explained it by saying: ___________________________________________________________', {
      x: 54,
      y: 490,
      size: 9,
      font: regularFont,
      color: textDark,
    });

    // Parent Sign-off
    page4.drawRectangle({
      x: 40,
      y: 310,
      width: 515,
      height: 115,
      color: rgb(1, 1, 1),
      borderColor: cardBorder,
      borderWidth: 1.5,
    });
    page4.drawText('PARENT / COACH ENDORSEMENT', {
      x: 54,
      y: 395,
      size: 11,
      font: boldFont,
      color: darkNavy,
    });
    page4.drawText('Celebrate specific effort and persistence, not speed or perfection.', {
      x: 54,
      y: 378,
      size: 9,
      font: regularFont,
      color: textMuted,
    });
    page4.drawText('Coach Signature: _________________________________    Date: ____________________', {
      x: 54,
      y: 340,
      size: 10,
      font: boldFont,
      color: textDark,
    });

    return await doc.save();
  }

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
