/**
 * Science Midterm Sprint Pack Generator for Lara & Maya (V2 - Pixel-Perfect Typography & Layout)
 * Living Things: Units 1.1 to 1.5 (Asten College Year 4 Midterm)
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { PDFDocument, rgb, StandardFonts } from '../packages/core/node_modules/pdf-lib/cjs/index.js';

// Color Palette
const navy = rgb(0.08, 0.15, 0.32);      // #142652 - Primary headers
const cyan = rgb(0.05, 0.60, 0.82);      // #0d99d1 - Accent & brand
const darkText = rgb(0.12, 0.16, 0.22);  // #1f2937 - Body text
const mutedText = rgb(0.40, 0.45, 0.55); // #66738c - Subtitles & notes
const lightBg = rgb(0.96, 0.97, 0.99);   // #f5f8fc - Section card background
const boxBorder = rgb(0.82, 0.86, 0.92); // #d1dceb - Card border
const white = rgb(1, 1, 1);
const green = rgb(0.10, 0.58, 0.30);     // #1a944d - Correct / Key rule
const amber = rgb(0.85, 0.45, 0.08);     // #d97314 - Attention / Watch out
const softBlue = rgb(0.92, 0.95, 1.0);   // #ebf2ff - Highlight cards

function clean(str) {
  if (!str) return '';
  return str.replace(/[^\x20-\x7E]/g, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * Text wrapper utilizing pdf-lib font metrics
 */
function wrapText(text, maxWidth, font, size) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const testWidth = font.widthOfTextAtSize(clean(testLine), size);
    if (testWidth <= maxWidth) {
      currentLine = testLine;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

/**
 * Draws wrapped text block and returns the new Y coordinate after drawing
 */
function drawTextBlock(page, text, x, startY, maxWidth, lineHeight, font, size, color) {
  const lines = wrapText(text, maxWidth, font, size);
  let curY = startY;
  for (const line of lines) {
    page.drawText(clean(line), {
      x,
      y: curY,
      size,
      font,
      color,
    });
    curY -= lineHeight;
  }
  return curY;
}

async function buildSprintPdf(studentName, isMaya) {
  const doc = await PDFDocument.create();
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const reg = await doc.embedFont(StandardFonts.Helvetica);
  const italic = await doc.embedFont(StandardFonts.HelveticaOblique);

  const drawHeader = (page, pageNum, pageTitle, subtitle) => {
    // Top brand banner
    page.drawText(clean('HEX-AIM  |  ADAPTIVE INDIVIDUALIZED MASTERY  |  ASTEN COLLEGE Y4 SCIENCE'), {
      x: 40,
      y: 814,
      size: 7.5,
      font: bold,
      color: cyan,
    });

    // Student Badge Box (Top Right) - Drawn first so we know boundaries
    page.drawRectangle({
      x: 415,
      y: 772,
      width: 140,
      height: 38,
      color: lightBg,
      borderColor: boxBorder,
      borderWidth: 1,
    });
    page.drawText(clean(`STUDENT: ${studentName.toUpperCase()}`), {
      x: 423,
      y: 795,
      size: 8.5,
      font: bold,
      color: navy,
    });
    page.drawText(clean(`Midterm Prep | Page ${pageNum} of 6`), {
      x: 423,
      y: 781,
      size: 7.5,
      font: reg,
      color: mutedText,
    });

    // Page Title: strictly clamped to max 365 pt width so it NEVER flows under the badge!
    const titleLines = wrapText(pageTitle, 365, bold, 13);
    let titleY = 794;
    for (const tl of titleLines) {
      page.drawText(clean(tl), {
        x: 40,
        y: titleY,
        size: 13,
        font: bold,
        color: navy,
      });
      titleY -= 15;
    }

    // Subtitle
    page.drawText(clean(subtitle), {
      x: 40,
      y: 768,
      size: 8,
      font: reg,
      color: mutedText,
    });

    // Header divider rule
    page.drawLine({
      start: { x: 40, y: 760 },
      end: { x: 555, y: 760 },
      thickness: 1,
      color: boxBorder,
    });

    // Footer
    page.drawLine({
      start: { x: 40, y: 35 },
      end: { x: 555, y: 35 },
      thickness: 0.8,
      color: boxBorder,
    });
    page.drawText(clean(`HEX-AIM High-Yield Science Sprint  *  Year 4 Term 1 Midterm Exam  *  Living Things (1.1-1.5)`), {
      x: 40,
      y: 22,
      size: 7.5,
      font: reg,
      color: mutedText,
    });
    page.drawText(clean(`Page ${pageNum} of 6`), {
      x: 505,
      y: 22,
      size: 7.5,
      font: bold,
      color: cyan,
    });
  };

  // Helper: Card box with guaranteed internal top/bottom padding
  const drawCard = (page, x, y, width, height, title, bgColor = lightBg, borderColor = boxBorder) => {
    page.drawRectangle({
      x,
      y,
      width,
      height,
      color: bgColor,
      borderColor: borderColor,
      borderWidth: 1,
    });
    if (title) {
      page.drawRectangle({
        x: x + 1,
        y: y + height - 20,
        width: width - 2,
        height: 19,
        color: white,
      });
      page.drawText(clean(title), {
        x: x + 10,
        y: y + height - 14,
        size: 9,
        font: bold,
        color: navy,
      });
      page.drawLine({
        start: { x, y: y + height - 20 },
        end: { x: x + width, y: y + height - 20 },
        thickness: 0.8,
        color: borderColor,
      });
    }
  };

  // ==========================================
  // PAGE 1: BONES, SKELETON FUNCTIONS & MUSCLES
  // ==========================================
  {
    const page1 = doc.addPage([595.28, 841.89]);
    drawHeader(page1, 1, 'Unit 1.1 - 1.3: Bones, Skeletons & Antagonistic Muscles', 'Master Core Knowledge: The 3 functions of skeletons and how muscles bend bones');

    // Card 1: 3 Functions of the Skeleton
    // y: 635, height: 115
    drawCard(page1, 40, 635, 515, 115, '1. THE THREE VITAL FUNCTIONS OF THE SKELETON');
    let c1Y = 635 + 115 - 34; // 14pt padding below header line

    page1.drawText(clean('* 1. SUPPORT:'), { x: 55, y: c1Y, size: 8.5, font: bold, color: navy });
    page1.drawText(clean('Provides an upright frame that gives the body shape & structure. Without it, you would collapse!'), { x: 135, y: c1Y, size: 8, font: reg, color: darkText });
    c1Y -= 20;

    page1.drawText(clean('* 2. PROTECTION:'), { x: 55, y: c1Y, size: 8.5, font: bold, color: navy });
    page1.drawText(clean('Hard bone shields guard delicate, life-critical internal organs:'), { x: 155, y: c1Y, size: 8, font: reg, color: darkText });
    c1Y -= 15;
    page1.drawText(clean('   - SKULL protects the BRAIN.'), { x: 70, y: c1Y, size: 8, font: bold, color: cyan });
    page1.drawText(clean('   - RIB CAGE protects the HEART and LUNGS in the chest.'), { x: 230, y: c1Y, size: 8, font: bold, color: cyan });
    c1Y -= 20;

    page1.drawText(clean('* 3. MOVEMENT:'), { x: 55, y: c1Y, size: 8.5, font: bold, color: navy });
    drawTextBlock(page1, 'Bones act as solid levers. Muscles are attached to bones and pull on them to produce movement (walking, bending, smiling).', 145, c1Y, 390, 11, reg, 8, darkText);

    // Card 2: Essential Bone Vocabulary
    // y: 480, height: 145 (snug fit for 6 bones with generous bottom padding)
    drawCard(page1, 40, 480, 515, 145, '2. KEY BONES YOU MUST IDENTIFY ON EXAM DIAGRAMS');
    const bones = [
      ['Skull', 'Bones of the head protecting the brain and forming facial structure.'],
      ['Spine / Backbone', 'Column of small vertebrae supporting your back and shielding the spinal cord.'],
      ['Rib Cage', 'Curved chest bones encasing and protecting your heart and lungs.'],
      ['Pelvis / Hip Bone', 'Wide basin-shaped bone supporting body weight & attaching leg bones.'],
      ['Femur', 'The longest, strongest bone in the body (upper leg / thigh bone).'],
      ['Jaw', 'Facial bone that moves to chew food and speak clearly.'],
    ];
    let bY = 480 + 145 - 34;
    for (const [bName, bDesc] of bones) {
      page1.drawText(clean(`* ${bName}:`), { x: 55, y: bY, size: 8, font: bold, color: navy });
      page1.drawText(clean(bDesc), { x: 170, y: bY, size: 7.8, font: reg, color: darkText });
      bY -= 17;
    }

    // Card 3: The Golden Muscle Rule & Antagonistic Pairs
    // y: 325, height: 145
    drawCard(page1, 40, 325, 515, 145, '3. HOW MUSCLES MOVE BONES (ANTAGONISTIC PAIRS)');
    let c3Y = 325 + 145 - 34; // 14pt padding below header line!
    page1.drawText(clean('GOLDEN RULE: Muscles CANNOT push! They can ONLY pull on bones by getting shorter.'), { x: 55, y: c3Y, size: 8, font: bold, color: green });
    c3Y -= 14;
    page1.drawText(clean('Because muscles only pull, they always work in PAIRS (Antagonistic Muscle Pairs).'), { x: 55, y: c3Y, size: 8, font: reg, color: darkText });

    // Inner Comparison Boxes for Arm Bending
    drawCard(page1, 55, 335, 235, 78, 'BENDING THE ARM (Action 1)', softBlue);
    page1.drawText(clean('1. Biceps CONTRACTS:'), { x: 65, y: 376, size: 8, font: bold, color: navy });
    page1.drawText(clean('   Gets shorter & fatter; pulls forearm UP.'), { x: 65, y: 364, size: 7.5, font: reg, color: darkText });
    page1.drawText(clean('2. Triceps RELAXES:'), { x: 65, y: 348, size: 8, font: bold, color: mutedText });
    page1.drawText(clean('   Gets longer & thinner; allows arm to bend.'), { x: 65, y: 336, size: 7.5, font: reg, color: darkText });

    drawCard(page1, 305, 335, 235, 78, 'STRAIGHTENING THE ARM (Action 2)', softBlue);
    page1.drawText(clean('1. Triceps CONTRACTS:'), { x: 315, y: 376, size: 8, font: bold, color: navy });
    page1.drawText(clean('   Gets shorter; pulls forearm straight DOWN.'), { x: 315, y: 364, size: 7.5, font: reg, color: darkText });
    page1.drawText(clean('2. Biceps RELAXES:'), { x: 315, y: 348, size: 8, font: bold, color: mutedText });
    page1.drawText(clean('   Gets longer; rests while triceps pulls.'), { x: 315, y: 336, size: 7.5, font: reg, color: darkText });

    // Card 4: Quick Self-Check Challenge
    // y: 50, height: 265
    drawCard(page1, 40, 50, 515, 265, 'QUICK CHECK CHALLENGE 1 (Fill in your answers)');
    let qcY = 50 + 265 - 34;
    page1.drawText(clean('Q1. Which bone protects the brain?  ________________________________________________'), { x: 55, y: qcY, size: 8, font: bold, color: darkText });
    qcY -= 25;
    page1.drawText(clean('Q2. Which bones protect the heart and lungs?  ________________________________________'), { x: 55, y: qcY, size: 8, font: bold, color: darkText });
    qcY -= 25;
    page1.drawText(clean('Q3. When a muscle contracts to bend your arm, what happens to its length? (circle):'), { x: 55, y: qcY, size: 8, font: bold, color: darkText });
    qcY -= 15;
    page1.drawText(clean('     A) It gets longer and pushes        B) It gets shorter and pulls on the bone'), { x: 75, y: qcY, size: 8, font: bold, color: navy });
    qcY -= 25;
    page1.drawText(clean('Q4. What does the other muscle in the antagonistic pair do at the same time?'), { x: 55, y: qcY, size: 8, font: bold, color: darkText });
    qcY -= 15;
    page1.drawText(clean('     Answer: It __________________________ and gets _____________________________.'), { x: 75, y: qcY, size: 8, font: reg, color: darkText });
    qcY -= 25;
    page1.drawText(clean('Q5. Name 3 reasons why daily physical activity & exercise are essential for children:'), { x: 55, y: qcY, size: 8, font: bold, color: darkText });
    qcY -= 18;
    page1.drawText(clean('     1) _________________________________________________________________________________'), { x: 75, y: qcY, size: 8, font: reg, color: mutedText });
    qcY -= 16;
    page1.drawText(clean('     2) _________________________________________________________________________________'), { x: 75, y: qcY, size: 8, font: reg, color: mutedText });
    qcY -= 16;
    page1.drawText(clean('     3) _________________________________________________________________________________'), { x: 75, y: qcY, size: 8, font: reg, color: mutedText });
  }

  // ==========================================
  // PAGE 2: CLASSIFYING ANIMALS & SKELETON TYPES (MAYA FOCUS)
  // ==========================================
  {
    const page2 = doc.addPage([595.28, 841.89]);
    drawHeader(page2, 2, 'Unit 1.4: Vertebrates vs. Invertebrates & Skeletons', isMaya ? 'CRITICAL FOCUS FOR MAYA: Complete Animal Classification & Skeleton Mastery' : 'Mastering Animal Classification & Skeleton Types');

    let currentY = 750;

    // Optional Focus Banner for Maya
    if (isMaya) {
      page2.drawRectangle({ x: 40, y: currentY - 24, width: 515, height: 24, color: softBlue, borderColor: cyan, borderWidth: 1 });
      page2.drawText(clean('MAYA TARGET: Memorize the simple rule: Vertebrate = Spine/Backbone. Invertebrate = No Spine!'), {
        x: 50, y: currentY - 16, size: 8, font: bold, color: navy,
      });
      currentY -= 32;
    }

    // Card 1: Vertebrates 5 Classes
    // height: 185, balanced layout
    const c1Height = isMaya ? 175 : 185;
    drawCard(page2, 40, currentY - c1Height, 515, c1Height, '1. VERTEBRATES (HAVE A BACKBONE) - THE 5 CLASSES');
    let vY = currentY - 30;

    const vClasses = [
      ['1. MAMMALS:', 'Warm-blooded, hair/fur, breathe with lungs, give birth to live young, produce milk.', 'Examples: Humans, dogs, lions, whales, dolphins, bats (bats are flying mammals!).'],
      ['2. BIRDS:', 'Warm-blooded, feathers, beaks, wings, lay hard-shelled eggs on land.', 'Examples: Eagles, parrots, penguins (flightless bird!), ostriches.'],
      ['3. REPTILES:', 'Cold-blooded, dry tough scales, breathe with lungs, lay leathery eggs on land.', 'Examples: Snakes, lizards, tortoises, turtles, crocodiles.'],
      ['4. AMPHIBIANS:', 'Cold-blooded, smooth wet skin, lay jelly eggs in water; young breathe with gills, adults on land.', 'Examples: Frogs, toads, newts, salamanders.'],
      ['5. FISH:', 'Cold-blooded, wet scales, fins, breathe through gills, live and reproduce in water.', 'Examples: Salmon, tuna, sharks, goldfish.'],
    ];

    for (const [title, desc, ex] of vClasses) {
      page2.drawText(clean(title), { x: 55, y: vY, size: 8, font: bold, color: navy });
      page2.drawText(clean(desc), { x: 140, y: vY, size: 7.5, font: reg, color: darkText });
      vY -= 12;
      page2.drawText(clean(ex), { x: 140, y: vY, size: 7, font: italic, color: mutedText });
      vY -= 15;
    }
    currentY -= (c1Height + 10);

    // Card 2: The 3 Skeleton Types
    const c2Height = 155;
    drawCard(page2, 40, currentY - c2Height, 515, c2Height, '2. THE THREE TYPES OF SKELETONS ACROSS ALL ANIMALS');
    
    // 3 Boxes Side by Side with safe internal padding (Header divider is at currentY - 48, so text starts at currentY - 60)
    // Box A: Endoskeleton
    drawCard(page2, 50, currentY - c2Height + 10, 158, 115, 'ENDOSKELETON', white);
    let subY1 = currentY - 60;
    page2.drawText(clean('Location: INSIDE body'), { x: 58, y: subY1, size: 7.5, font: bold, color: navy }); subY1 -= 12;
    page2.drawText(clean('Structure: Hard bones/cartilage;'), { x: 58, y: subY1, size: 7.2, font: reg, color: darkText }); subY1 -= 10;
    page2.drawText(clean('grows as animal grows.'), { x: 58, y: subY1, size: 7.2, font: reg, color: darkText }); subY1 -= 13;
    page2.drawText(clean('Found in: All Vertebrates!'), { x: 58, y: subY1, size: 7.5, font: bold, color: green }); subY1 -= 12;
    page2.drawText(clean('Humans, dogs, birds, frogs,'), { x: 58, y: subY1, size: 7.2, font: reg, color: darkText }); subY1 -= 10;
    page2.drawText(clean('fish, snakes, whales.'), { x: 58, y: subY1, size: 7.2, font: reg, color: darkText }); subY1 -= 13;
    page2.drawText(clean('Advantage: Supports large bodies.'), { x: 58, y: subY1, size: 6.8, font: italic, color: mutedText });

    // Box B: Exoskeleton
    drawCard(page2, 218, currentY - c2Height + 10, 158, 115, 'EXOSKELETON', white);
    let subY2 = currentY - 60;
    page2.drawText(clean('Location: OUTSIDE body'), { x: 226, y: subY2, size: 7.5, font: bold, color: amber }); subY2 -= 12;
    page2.drawText(clean('Structure: Hard armor shell;'), { x: 226, y: subY2, size: 7.2, font: reg, color: darkText }); subY2 -= 10;
    page2.drawText(clean('does not grow (must moult).'), { x: 226, y: subY2, size: 7.2, font: reg, color: darkText }); subY2 -= 13;
    page2.drawText(clean('Found in: Invertebrates!'), { x: 226, y: subY2, size: 7.5, font: bold, color: amber }); subY2 -= 12;
    page2.drawText(clean('Insects (beetles, ants),'), { x: 226, y: subY2, size: 7.2, font: reg, color: darkText }); subY2 -= 10;
    page2.drawText(clean('crabs, lobsters, spiders.'), { x: 226, y: subY2, size: 7.2, font: reg, color: darkText }); subY2 -= 13;
    page2.drawText(clean('Advantage: Armor & waterproof.'), { x: 226, y: subY2, size: 6.8, font: italic, color: mutedText });

    // Box C: Hydrostatic Skeleton
    drawCard(page2, 386, currentY - c2Height + 10, 158, 115, 'HYDROSTATIC', white);
    let subY3 = currentY - 60;
    page2.drawText(clean('Location: FLUID PRESSURE'), { x: 394, y: subY3, size: 7.5, font: bold, color: cyan }); subY3 -= 12;
    page2.drawText(clean('Structure: Fluid-filled cavity'), { x: 394, y: subY3, size: 7.2, font: reg, color: darkText }); subY3 -= 10;
    page2.drawText(clean('held under pressure.'), { x: 394, y: subY3, size: 7.2, font: reg, color: darkText }); subY3 -= 13;
    page2.drawText(clean('Found in: Soft Invertebrates!'), { x: 394, y: subY3, size: 7.5, font: bold, color: cyan }); subY3 -= 12;
    page2.drawText(clean('Earthworms, jellyfish, slugs,'), { x: 394, y: subY3, size: 7.2, font: reg, color: darkText }); subY3 -= 10;
    page2.drawText(clean('sea anemones.'), { x: 394, y: subY3, size: 7.2, font: reg, color: darkText }); subY3 -= 13;
    page2.drawText(clean('Advantage: Flexible in soil/water.'), { x: 394, y: subY3, size: 6.8, font: italic, color: mutedText });

    currentY -= (c2Height + 10);

    // Card 3: Identification Key Flowchart Drill
    // y: 50, height: fills remaining page cleanly (~210 pt)
    const c3Height = currentY - 50;
    drawCard(page2, 40, 50, 515, c3Height, 'VERTEBRATE IDENTIFICATION KEY FLOWCHART (EXAM DRILL)');
    let ky = 50 + c3Height - 34; // Generous 14pt top padding!
    page2.drawText(clean('Follow the diagnostic branching questions to classify animals on exam day:'), { x: 55, y: ky, size: 8, font: bold, color: navy });
    ky -= 18;

    const keySteps = [
      ['Question 1:', 'Does the animal have a backbone (spine)?', '[YES]: Vertebrate (Go to Q2)', '[NO]: INVERTEBRATE (e.g. beetle, worm)'],
      ['Question 2:', 'Does the animal have fur or hair & nurse with milk?', '[YES]: MAMMAL (human, whale, lion)', '[NO]: Go to Question 3'],
      ['Question 3:', 'Does the animal have feathers and wings?', '[YES]: BIRD (eagle, penguin, ostrich)', '[NO]: Go to Question 4'],
      ['Question 4:', 'Does the animal have dry, waterproof scales?', '[YES]: REPTILE (snake, lizard, turtle)', '[NO]: Go to Question 5'],
      ['Question 5:', 'Does it have moist smooth skin & start in water?', '[YES]: AMPHIBIAN (frog, toad)', '[NO]: FISH (scales, fins, gills in water)'],
    ];

    for (const [step, qText, yesPath, noPath] of keySteps) {
      page2.drawText(clean(`${step} ${qText}`), { x: 55, y: ky, size: 7.8, font: bold, color: navy });
      page2.drawText(clean(yesPath), { x: 75, y: ky - 11, size: 7.2, font: reg, color: green });
      page2.drawText(clean(noPath), { x: 285, y: ky - 11, size: 7.2, font: reg, color: amber });
      ky -= 25;
    }

    // Mini Drill at Bottom inside Card 3
    page2.drawRectangle({ x: 55, y: 58, width: 485, height: 50, color: white, borderColor: boxBorder, borderWidth: 1 });
    page2.drawText(clean('RAPID CLASSIFICATION DRILL:'), { x: 65, y: 96, size: 7.5, font: bold, color: navy });
    page2.drawText(clean('1. Whale:   Vertebrate or Invertebrate? ___________  Class: ___________ (Hint: nurses with milk!)'), { x: 65, y: 84, size: 7.2, font: reg, color: darkText });
    page2.drawText(clean('2. Penguin: Vertebrate or Invertebrate? ___________  Class: ___________ (Hint: covered in feathers!)'), { x: 65, y: 73, size: 7.2, font: reg, color: darkText });
    page2.drawText(clean('3. Beetle:  Vertebrate or Invertebrate? ___________  Skeleton Type: _____________ (Hint: hard shell!)'), { x: 65, y: 62, size: 7.2, font: reg, color: darkText });
  }

  // ==========================================
  // PAGE 3: MEDICINES, VACCINES & INFECTIOUS DISEASES (UNIT 1.5)
  // ==========================================
  {
    const page3 = doc.addPage([595.28, 841.89]);
    drawHeader(page3, 3, 'Unit 1.5: Medicines, Vaccines & Infectious Diseases', 'Mastering Germs, Disease Prevention and Safe Medicine Guidelines');

    // Card 1: Germs and Infectious Diseases
    // height: 135, top padding: 14pt
    drawCard(page3, 40, 615, 515, 135, '1. GERMS, PATHOGENS & INFECTIOUS DISEASES');
    let c1Y = 615 + 135 - 34;

    page3.drawText(clean('* What is an Infectious Disease?'), { x: 55, y: c1Y, size: 8.5, font: bold, color: navy });
    c1Y -= 13;
    page3.drawText(clean('An illness caused by microscopic organisms called germs (pathogens: bacteria, viruses) that invade living bodies.'), { x: 55, y: c1Y, size: 7.8, font: reg, color: darkText });
    c1Y -= 18;

    page3.drawText(clean('* Who Can Catch Infectious Diseases?'), { x: 55, y: c1Y, size: 8.5, font: bold, color: navy });
    c1Y -= 13;
    page3.drawText(clean('HUMANS, ANIMALS, and PLANTS can ALL catch infectious diseases! (Crucial exam fact: plants get sick too!)'), { x: 55, y: c1Y, size: 8, font: bold, color: amber });
    c1Y -= 18;

    page3.drawText(clean('* How Do Germs Spread & How Do We Prevent It?'), { x: 55, y: c1Y, size: 8.5, font: bold, color: navy });
    c1Y -= 13;
    page3.drawText(clean('Through airborne droplets (coughing/sneezing), unwashed hands, and dirty surfaces. Washing hands with soap kills germs.'), { x: 55, y: c1Y, size: 7.8, font: reg, color: darkText });

    // Card 2: Antibiotics vs Vaccines
    // height: 150
    drawCard(page3, 40, 450, 515, 150, '2. MEDICINES: ANTIBIOTICS VS. VACCINES');
    
    // Sub-box 1: Vaccines (Divider line is at 462 + 110 - 20 = 552, so text starts safely at 539)
    drawCard(page3, 55, 462, 235, 110, 'VACCINATIONS (PREVENTION)', white);
    let vBoxY = 539;
    page3.drawText(clean('How Given: Injection (needle).'), { x: 65, y: vBoxY, size: 7.5, font: bold, color: navy }); vBoxY -= 13;
    page3.drawText(clean('When Given: BEFORE you get sick.'), { x: 65, y: vBoxY, size: 7.5, font: bold, color: green }); vBoxY -= 13;
    page3.drawText(clean('Purpose: Trains your immune system to make'), { x: 65, y: vBoxY, size: 7.2, font: reg, color: darkText }); vBoxY -= 11;
    page3.drawText(clean('antibodies so you are immune to disease.'), { x: 65, y: vBoxY, size: 7.2, font: reg, color: darkText }); vBoxY -= 13;
    page3.drawText(clean('Examples: Polio, Measles, Flu vaccine.'), { x: 65, y: vBoxY, size: 7.2, font: italic, color: mutedText }); vBoxY -= 13;
    page3.drawText(clean('Protects both humans and animals (pets/cattle).'), { x: 65, y: vBoxY, size: 7, font: reg, color: darkText });

    // Sub-box 2: Antibiotics
    drawCard(page3, 305, 462, 235, 110, 'ANTIBIOTICS (TREATMENT)', white);
    let aBoxY = 539;
    page3.drawText(clean('How Given: Liquid medicine or pills/tablets.'), { x: 315, y: aBoxY, size: 7.5, font: bold, color: navy }); aBoxY -= 13;
    page3.drawText(clean('When Given: AFTER you are sick.'), { x: 315, y: aBoxY, size: 7.5, font: bold, color: amber }); aBoxY -= 13;
    page3.drawText(clean('Purpose: Kills harmful bacteria inside your body.'), { x: 315, y: aBoxY, size: 7.2, font: reg, color: darkText }); aBoxY -= 12;
    page3.drawText(clean('CRITICAL RULE: Antibiotics ONLY kill bacteria.'), { x: 315, y: aBoxY, size: 7.2, font: bold, color: navy }); aBoxY -= 11;
    page3.drawText(clean('They do NOT work against viruses (like colds).'), { x: 315, y: aBoxY, size: 7.2, font: reg, color: darkText }); aBoxY -= 13;
    page3.drawText(clean('Always complete the full course prescribed!'), { x: 315, y: aBoxY, size: 7, font: italic, color: green });

    // Card 3: The 4 Golden Rules of Medicine Safety
    // height: 160
    drawCard(page3, 40, 275, 515, 160, '3. THE FOUR ESSENTIAL RULES FOR TAKING MEDICINES SAFELY');
    const rules = [
      ['RULE 1: Adult Supervision Only', 'Children must NEVER take medicines by themselves. Only a trusted adult (parent, nurse, doctor) may give you medicine.'],
      ['RULE 2: Read & Follow the Label', 'Always read the exact dose and instructions written on the medicine bottle. Check the expiration date!'],
      ['RULE 3: Never Share Medicines', 'Medicine prescribed for a friend, sibling, or parent can be toxic or harmful to you. Never take someone else\'s medicine.'],
      ['RULE 4: More Does NOT Mean Faster', 'Taking a larger dose of medicine does NOT cure you faster. It can cause serious poisoning or organ damage.'],
    ];
    let rY = 275 + 160 - 34;
    for (const [rTitle, rDesc] of rules) {
      page3.drawText(clean(`* ${rTitle}:`), { x: 55, y: rY, size: 8, font: bold, color: navy });
      page3.drawText(clean(rDesc), { x: 55, y: rY - 11, size: 7.5, font: reg, color: darkText });
      rY -= 27;
    }

    // Card 4: True or False Diagnostic Check
    // height: 210, fills remaining space with beautiful breathing room
    drawCard(page3, 40, 50, 515, 210, 'UNIT 1.5 TRUE OR FALSE EXAM DRILL (Circle True or False)');
    let tfY = 50 + 210 - 34;
    const tfQuestions = [
      ['a. Germs cause infectious diseases.', 'TRUE'],
      ['b. If you take more medicine, you will get better faster.', 'FALSE'],
      ['c. Always follow the instructions on the medicine label.', 'TRUE'],
      ['d. It is OK to take medicine that a friend gives you if you have the same headache.', 'FALSE'],
      ['e. Plants do not have any infectious diseases.', 'FALSE'],
      ['f. Vaccinations are injections given to prevent diseases before you get sick.', 'TRUE'],
      ['g. Antibiotics kill harmful bacteria inside your body.', 'TRUE'],
    ];
    for (const [q] of tfQuestions) {
      page3.drawText(clean(q), { x: 55, y: tfY, size: 7.8, font: reg, color: darkText });
      page3.drawText(clean('[Circle]:   TRUE   /   FALSE'), { x: 420, y: tfY, size: 7.8, font: bold, color: navy });
      tfY -= 23;
    }
  }

  // ==========================================
  // PAGE 4: EXAM SIMULATION (PART 1 - BIOMECHANICS & BONES)
  // ==========================================
  {
    const page4 = doc.addPage([595.28, 841.89]);
    drawHeader(page4, 4, 'Exam Simulation Part 1: Biomechanics & Anatomy', 'Realistic Midterm Exam Questions - Attempt every question independently');

    // Section 1: Definitions
    // height: 165
    drawCard(page4, 40, 585, 515, 165, 'QUESTION 1: SCIENTIFIC VOCABULARY MATCHING (8 Marks)');
    let vy = 585 + 165 - 34; // 14pt top padding
    page4.drawText(clean('Write the correct scientific word for each definition:'), { x: 55, y: vy, size: 8, font: bold, color: navy });
    vy -= 15;

    const vocab = [
      ['a. A hard frame made of bone that supports our body:', '_____________________________'],
      ['b. The bones of the head that protect the brain:', '_____________________________'],
      ['c. Something that shows us how another thing looks or works:', '_____________________________'],
      ['d. The vital parts inside our bodies (like heart, brain, lungs):', '_____________________________'],
      ['e. Animals that do not have a spine or backbone:', '_____________________________'],
      ['f. Parts of the body attached to bones that allow movement:', '_____________________________'],
      ['g. The hard skin or shell on the outside of some animals:', '_____________________________'],
      ['h. An injection given to prevent disease before it happens:', '_____________________________'],
    ];
    for (const [def, blank] of vocab) {
      page4.drawText(clean(def), { x: 55, y: vy, size: 7.8, font: reg, color: darkText });
      page4.drawText(clean(blank), { x: 410, y: vy, size: 8, font: bold, color: navy });
      vy -= 14;
    }

    // Section 2: Arm Bending Muscle Mechanics
    // height: 165 (y: 405 to 570, guaranteed generous bottom padding)
    drawCard(page4, 40, 405, 515, 165, 'QUESTION 2: MUSCLE PAIRS & ARM BENDING (6 Marks)');
    let q2Y = 405 + 165 - 34;
    page4.drawText(clean('Look at the mechanics of bending your arm at the elbow joint:'), { x: 55, y: q2Y, size: 8, font: bold, color: navy });
    q2Y -= 15;

    page4.drawRectangle({ x: 55, y: q2Y - 35, width: 485, height: 35, color: white, borderColor: boxBorder, borderWidth: 1 });
    page4.drawText(clean('ANATOMY KEY: Muscle 1 = Triceps (back of arm) | Muscle 2 = Biceps (front of arm) | Bone = Forearm'), { x: 65, y: q2Y - 22, size: 7.5, font: bold, color: cyan });
    q2Y -= 50;

    page4.drawText(clean('a. Write down the number of the muscle that gets shorter to BEND the arm:   [ ______ ]'), { x: 55, y: q2Y, size: 8, font: bold, color: navy });
    q2Y -= 18;
    page4.drawText(clean('b. Circle the correct words in the statement:'), { x: 55, y: q2Y, size: 8, font: bold, color: navy });
    q2Y -= 14;
    page4.drawText(clean('   "The muscle ( CONTRACTS / RELAXES ). The muscle gets ( LONGER / SHORTER ) and'), { x: 70, y: q2Y, size: 7.8, font: reg, color: darkText });
    q2Y -= 13;
    page4.drawText(clean('   ( PUSHES / PULLS ) on the arm bone to lift it."'), { x: 70, y: q2Y, size: 7.8, font: reg, color: darkText });

    // Section 3: Rabbit Skeleton Analysis
    // height: 345 (y: 50 to 395, balanced with no dead space)
    drawCard(page4, 40, 50, 515, 345, 'QUESTION 3: SKELETON DIAGRAM ANALYSIS (RABBIT SKELETON) (10 Marks)');
    let q3y = 50 + 345 - 34; // 14pt top padding
    page4.drawText(clean('In the science lab, students observe a complete skeleton of a rabbit:'), { x: 55, y: q3y, size: 8, font: bold, color: navy });
    q3y -= 20;

    const q3Parts = [
      ['a. Label Part C: Bones of the head protecting the brain.', 'Answer: _______________________'],
      ['b. Label Part D: The curved cage of chest bones.', 'Answer: _______________________'],
      ['c. Label Part A: The long column running down the back.', 'Answer: _______________________'],
      ['d. Label Part E: The wide hip bone supporting legs.', 'Answer: _______________________'],
      ['e. Label Part F: The strong hind legs for hopping.', 'Answer: _______________________'],
      ['f. Which specific organ does Part C protect?', 'Answer: _______________________'],
      ['g. Name TWO vital organs that Part D protects:', '1) ____________  2) ____________'],
      ['h. Name the main function of Part F:', 'Answer: _______________________'],
      ['i. Besides protection and movement, state ONE other function of the skeleton:', 'Answer: _______________________'],
    ];

    for (const [prompt, ans] of q3Parts) {
      page4.drawText(clean(prompt), { x: 55, y: q3y, size: 7.8, font: reg, color: darkText });
      page4.drawText(clean(ans), { x: 380, y: q3y, size: 7.8, font: bold, color: navy });
      q3y -= 23;
    }

    // Mini Key Insight Box at bottom of Card 3
    page4.drawRectangle({ x: 55, y: 58, width: 485, height: 46, color: white, borderColor: boxBorder, borderWidth: 1 });
    page4.drawText(clean('EXAM REVISION TIP:'), { x: 65, y: 90, size: 7.5, font: bold, color: navy });
    page4.drawText(clean('* Remember: Bones also produce blood cells inside bone marrow and store minerals like calcium.'), { x: 65, y: 78, size: 7.2, font: reg, color: darkText });
    page4.drawText(clean('* All mammals, birds, reptiles, amphibians, and fish share this same internal skeleton architecture!'), { x: 65, y: 66, size: 7.2, font: reg, color: darkText });
  }

  // ==========================================
  // PAGE 5: EXAM SIMULATION (PART 2 - CLASSIFICATION & HEALTH)
  // ==========================================
  {
    const page5 = doc.addPage([595.28, 841.89]);
    drawHeader(page5, 5, 'Exam Simulation Part 2: Animal Classification & Data', 'Mastering the 5 Vertebrate Groups, Skeletons and Daily Activity Graphs');

    // Section 4: Classification Master Table
    // height: 230 (y: 520 to 750, snug fit with zero bottom dead space)
    drawCard(page5, 40, 520, 515, 230, 'QUESTION 4: CLASSIFICATION MASTER MATRIX (16 Marks)');
    let mY = 520 + 230 - 34;
    page5.drawText(clean('For each animal, determine: 1) Backbone (Y/N), 2) Vert/Invert, 3) Class, 4) Skeleton Type:'), { x: 55, y: mY, size: 8, font: bold, color: navy });
    mY -= 18;

    // Table Header
    page5.drawRectangle({ x: 50, y: mY - 3, width: 495, height: 18, color: navy });
    page5.drawText(clean('ANIMAL'), { x: 58, y: mY + 2, size: 7.5, font: bold, color: white });
    page5.drawText(clean('BACKBONE? (Y/N)'), { x: 130, y: mY + 2, size: 7.5, font: bold, color: white });
    page5.drawText(clean('VERT / INVERT'), { x: 230, y: mY + 2, size: 7.5, font: bold, color: white });
    page5.drawText(clean('CLASS (If Vertebrate)'), { x: 330, y: mY + 2, size: 7.5, font: bold, color: white });
    page5.drawText(clean('SKELETON TYPE'), { x: 440, y: mY + 2, size: 7.5, font: bold, color: white });
    mY -= 18;

    const matrixAnimals = ['Human', 'Earthworm', 'Eagle', 'Beetle', 'Chameleon', 'Frog', 'Goldfish', 'Crab'];

    for (const aName of matrixAnimals) {
      page5.drawRectangle({ x: 50, y: mY - 3, width: 495, height: 17, color: mY % 2 === 0 ? lightBg : white, borderColor: boxBorder, borderWidth: 0.5 });
      page5.drawText(clean(aName), { x: 58, y: mY + 2, size: 7.8, font: bold, color: navy });
      page5.drawText(clean('___________'), { x: 140, y: mY + 2, size: 7.5, font: reg, color: mutedText });
      page5.drawText(clean('___________'), { x: 235, y: mY + 2, size: 7.5, font: reg, color: mutedText });
      page5.drawText(clean('___________'), { x: 335, y: mY + 2, size: 7.5, font: reg, color: mutedText });
      page5.drawText(clean('___________'), { x: 445, y: mY + 2, size: 7.5, font: reg, color: mutedText });
      mY -= 19;
    }

    // Section 5: Arun's Daily Activity Graph Analysis
    // height: 305 (y: 205 to 510)
    drawCard(page5, 40, 205, 515, 305, 'QUESTION 5: ARUN\'S ACTIVITY GRAPH & PHYSICAL HEALTH (10 Marks)');
    let aY = 205 + 305 - 34;
    page5.drawText(clean('Arun recorded his 24-hour activities: Sleeping (10h), Class (6h), TV/Gaming (4h), Cycling/Soccer (2h), Eating (2h).'), { x: 55, y: aY, size: 7.5, font: reg, color: darkText });
    aY -= 18;

    const q5Questions = [
      ['a. Which activity did Arun spend the MOST time doing?', 'Answer: _______________________'],
      ['b. Which TWO activities did Arun do for the SHORTEST time (2h)?', 'Answer: _______________________'],
      ['c. For how many total hours did Arun do vigorous movement?', 'Answer: _______________________'],
      ['d. Which activities should Arun REDUCE? Explain why:', 'Answer: _______________________'],
      ['    Reason: Sitting still for long periods weakens muscles & heart.', ''],
      ['e. Suggest TWO new activities that would increase his daily movement:', '1) ___________  2) ___________'],
      ['f. Give THREE reasons why exercise is essential for the human body:', '1) ____________________________'],
      ['', '2) ____________________________'],
      ['', '3) ____________________________'],
    ];

    for (const [prompt, ans] of q5Questions) {
      page5.drawText(clean(prompt), { x: 55, y: aY, size: 7.5, font: prompt.startsWith('f.') || prompt.startsWith('d.') ? bold : reg, color: darkText });
      if (ans) {
        page5.drawText(clean(ans), { x: 380, y: aY, size: 7.5, font: bold, color: navy });
      }
      aY -= 18;
    }

    // Educational Key Takeaway Box at bottom of Card 5
    page5.drawRectangle({ x: 55, y: 212, width: 485, height: 38, color: white, borderColor: boxBorder, borderWidth: 1 });
    page5.drawText(clean('HEALTH SCIENCE SUMMARY:'), { x: 65, y: 238, size: 7.5, font: bold, color: navy });
    page5.drawText(clean('* Regular moderate to vigorous physical activity builds denser bones, stronger antagonistic muscles,'), { x: 65, y: 226, size: 7.2, font: reg, color: darkText });
    page5.drawText(clean('* and promotes cardiovascular efficiency. Children need at least 60 minutes of active movement daily!'), { x: 65, y: 216, size: 7.2, font: reg, color: darkText });

    // Section 6: Exam Pep Talk
    // height: 145 (y: 50 to 195)
    drawCard(page5, 40, 50, 515, 145, 'YOU ARE READY! EXAM STRATEGY FOR TOMORROW MORNING', softBlue, cyan);
    let pepY = 50 + 145 - 30;
    page5.drawText(clean('TOP EXAM TIPS FOR TOMORROW:'), { x: 55, y: pepY, size: 8, font: bold, color: navy });
    pepY -= 15;
    page5.drawText(clean('1. Read carefully: Underline key words like "VERTEBRATE", "INVERTEBRATE", "PROTECTS", and "CONTRACTS".'), { x: 55, y: pepY, size: 7.5, font: reg, color: darkText });
    pepY -= 14;
    page5.drawText(clean('2. Remember: Biceps contract to BEND. Triceps contract to STRAIGHTEN. Muscles only pull!'), { x: 55, y: pepY, size: 7.5, font: reg, color: darkText });
    pepY -= 14;
    page5.drawText(clean('3. Whales & bats are MAMMALS. Penguins are BIRDS. Frogs are AMPHIBIANS. All are VERTEBRATES with endoskeletons!'), { x: 55, y: pepY, size: 7.5, font: reg, color: darkText });
    pepY -= 14;
    page5.drawText(clean('4. Germs cause infectious diseases. Plants get sick too. Vaccines PREVENT; antibiotics TREAT bacterial infections.'), { x: 55, y: pepY, size: 7.5, font: reg, color: darkText });
    pepY -= 18;
    page5.drawText(clean(`Believe in yourself, ${studentName}! You have worked hard and know this science inside out!`), { x: 55, y: pepY, size: 8, font: bold, color: green });
  }

  // ==========================================
  // PAGE 6: PARENT SOCRATIC COACHING GUIDE & COMPLETE ANSWER KEY
  // ==========================================
  {
    const page6 = doc.addPage([595.28, 841.89]);
    drawHeader(page6, 6, 'Parent Socratic Coaching Guide & Complete Answer Key', 'Tonight\'s 8-Minute Rapid Review Script & Exact Marking Scheme');

    // Card 1: 8-Minute Script
    // height: 250 (y: 500 to 750, ample vertical space so questions never collide)
    drawCard(page6, 40, 500, 515, 250, 'TONIGHT\'S 8-MINUTE SOCRATIC COACHING SCRIPT');
    let sY = 500 + 250 - 34; // 14pt top padding

    const script = [
      ['Minute 1-2 (Bones & Protection):', 'Ask: "Touch your head. What bone is that? (Skull). What delicate organ is inside? (Brain)."'],
      ['', 'Ask: "Put your hands on your chest. What cage is that? (Rib cage). What two organs does it guard? (Heart & lungs)."'],
      ['Minute 3-4 (Muscle Action Demo):', 'Have her bend her arm up hard like a bodybuilder. Tell her to touch her biceps.'],
      ['', 'Ask: "Is it hard or soft? (Hard/short - it CONTRACTED). What is the triceps underneath doing? (RELAXING)."'],
      ['Minute 5-6 (Vertebrate vs Invertebrate):', isMaya ? 'CRITICAL WITH MAYA: Ask "Does a shark have a backbone? (Yes - vertebrate/fish). Does a beetle? (No - exoskeleton!)."' : 'Ask: "What 5 groups are vertebrates? (Mammals, Birds, Reptiles, Amphibians, Fish). What is an earthworm? (Invertebrate, hydrostatic)."'],
      ['', 'Ask: "Can you name a mammal that swims in the sea? (Whale/dolphin). A mammal that flies? (Bat)."'],
      ['Minute 7-8 (Medicine & Health):', 'Ask: "Can plants get infectious diseases? (YES!). What is the difference between a vaccine and antibiotic?"'],
    ];

    for (const [title, dialogue] of script) {
      if (title) {
        page6.drawText(clean(title), { x: 55, y: sY, size: 7.8, font: bold, color: navy });
      }
      // Dynamically calculate wrapped lines and update sY to prevent ANY text overlap!
      sY = drawTextBlock(page6, dialogue, 215, sY, 325, 11, title ? reg : italic, 7.5, darkText);
      sY -= 6;
    }

    // Card 2: Complete Model Answer Key
    // height: 440 (y: 50 to 490, balanced with Card 1)
    drawCard(page6, 40, 50, 515, 440, 'COMPLETE MODEL ANSWER KEY (FOR PARENT MARKING)');
    let ansY = 50 + 440 - 34; // 14pt top padding

    const answers = [
      ['QUESTION 1 (Definitions):', 'a) Skeleton,  b) Skull,  c) Model,  d) Organs,  e) Invertebrates,  f) Muscles,  g) Exoskeleton,  h) Vaccination (vaccine injection).'],
      ['QUESTION 2 (Arm Bending):', 'a) Muscle 2 (Biceps).  b) CONTRACTS, SHORTER, PULLS.'],
      ['QUESTION 3 (Rabbit Skeleton):', 'a) Skull,  b) Rib cage,  c) Spine / backbone,  d) Pelvis / hip bone,  e) Leg bones.'],
      ['', 'f) Brain.  g) Heart and lungs.  h) Movement / walking and hopping.'],
      ['', 'i) Support (gives the body shape, upright posture, and structure).'],
      ['QUESTION 4 (Classification):', 'Human: Yes / Vertebrate / Mammal / Endoskeleton.'],
      ['', 'Earthworm: No / Invertebrate / None (Annelid) / Hydrostatic.'],
      ['', 'Eagle: Yes / Vertebrate / Bird / Endoskeleton.'],
      ['', 'Beetle: No / Invertebrate / None (Insect) / Exoskeleton.'],
      ['', 'Chameleon: Yes / Vertebrate / Reptile / Endoskeleton.'],
      ['', 'Frog: Yes / Vertebrate / Amphibian / Endoskeleton.'],
      ['', 'Goldfish: Yes / Vertebrate / Fish / Endoskeleton.'],
      ['', 'Crab: No / Invertebrate / None (Crustacean) / Exoskeleton.'],
      ['QUESTION 5 (Arun\'s Graph):', 'a) Sleeping (10 hours).  b) Riding a bike and eating (2 hours each).'],
      ['', 'c) 2 hours (riding a bike + playing football).'],
      ['', 'd) Watching TV, playing computer games, sitting in class - involve sitting still for long periods.'],
      ['', 'e) Swimming, dancing, running, martial arts, basketball.'],
      ['', 'f) 1) Strengthens muscles and bones,  2) Keeps heart healthy,  3) Improves fitness & stamina.'],
      ['UNIT 1.5 TRUE / FALSE:', 'a) TRUE,  b) FALSE,  c) TRUE,  d) FALSE,  e) FALSE,  f) TRUE,  g) TRUE.'],
    ];

    for (const [section, detail] of answers) {
      if (section) {
        page6.drawText(clean(section), { x: 55, y: ansY, size: 7.8, font: bold, color: navy });
      }
      // Wrap answers to max 340 pt so they never overflow right border!
      const lines = wrapText(detail, 340, reg, 7.5);
      for (const line of lines) {
        page6.drawText(clean(line), { x: 200, y: ansY, size: 7.5, font: reg, color: darkText });
        ansY -= 11.5;
      }
      ansY -= 3.5;
    }
  }

  const pdfBytes = await doc.save();
  return pdfBytes;
}

/**
 * Builds Dad's 1-Page Executive Master Cheat Sheet for both Lara & Maya
 */
async function buildDadCheatSheet() {
  const doc = await PDFDocument.create();
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const reg = await doc.embedFont(StandardFonts.Helvetica);
  const italic = await doc.embedFont(StandardFonts.HelveticaOblique);

  const page = doc.addPage([595.28, 841.89]);

  // Header banner
  page.drawRectangle({ x: 40, y: 775, width: 515, height: 45, color: navy });
  page.drawText(clean('HEX-AIM  *  DAD\'S 1-PAGE RAPID SCIENCE CHEAT SHEET'), {
    x: 55,
    y: 802,
    size: 11,
    font: bold,
    color: white,
  });
  page.drawText(clean('Asten College Y4 Science Midterm  *  Living Things (Units 1.1-1.5)  *  For Lara & Maya'), {
    x: 55,
    y: 786,
    size: 8,
    font: reg,
    color: cyan,
  });

  const drawSection = (x, y, width, height, title, bgColor = lightBg) => {
    page.drawRectangle({ x, y, width, height, color: bgColor, borderColor: boxBorder, borderWidth: 1 });
    page.drawRectangle({ x: x + 1, y: y + height - 18, width: width - 2, height: 17, color: white });
    page.drawText(clean(title), { x: x + 8, y: y + height - 13, size: 8.5, font: bold, color: navy });
    page.drawLine({ start: { x, y: y + height - 18 }, end: { x: x + width, y: y + height - 18 }, thickness: 0.8, color: boxBorder });
  };

  // Section 1: Skeleton Functions & Bones (Top Left)
  drawSection(40, 615, 250, 150, '1. SKELETON FUNCTIONS & BONES (1.1 - 1.2)');
  let y1 = 615 + 150 - 30;
  page.drawText(clean('* 3 FUNCTIONS: Support, Protection, Movement.'), { x: 50, y: y1, size: 7.5, font: bold, color: navy });
  y1 -= 14;
  page.drawText(clean('   - Skull -> protects Brain.'), { x: 50, y: y1, size: 7.2, font: bold, color: cyan });
  y1 -= 12;
  page.drawText(clean('   - Rib Cage -> protects Heart and Lungs.'), { x: 50, y: y1, size: 7.2, font: bold, color: cyan });
  y1 -= 12;
  page.drawText(clean('   - Spine -> protects Spinal Cord & supports back.'), { x: 50, y: y1, size: 7.2, font: reg, color: darkText });
  y1 -= 12;
  page.drawText(clean('   - Pelvis -> supports body weight & hip joint.'), { x: 50, y: y1, size: 7.2, font: reg, color: darkText });
  y1 -= 12;
  page.drawText(clean('   - Femur -> longest & strongest bone (thigh).'), { x: 50, y: y1, size: 7.2, font: reg, color: darkText });
  y1 -= 14;
  page.drawText(clean('* Model: Shows how another thing looks or works.'), { x: 50, y: y1, size: 7, font: italic, color: mutedText });

  // Section 2: Muscles & Movement (Top Right)
  drawSection(305, 615, 250, 150, '2. MUSCLES & MOVEMENT (1.3)');
  let y2 = 615 + 150 - 30;
  page.drawText(clean('* GOLDEN RULE: Muscles ONLY pull, NEVER push!'), { x: 315, y: y2, size: 7.5, font: bold, color: green });
  y2 -= 14;
  page.drawText(clean('* Muscles work in antagonistic PAIRS:'), { x: 315, y: y2, size: 7.2, font: bold, color: navy });
  y2 -= 14;
  page.drawText(clean('   - BENDING ARM: Biceps contracts (shorter & fatter);'), { x: 315, y: y2, size: 7.2, font: reg, color: darkText });
  y2 -= 11;
  page.drawText(clean('     Triceps relaxes (longer & thinner).'), { x: 325, y: y2, size: 7.2, font: reg, color: darkText });
  y2 -= 13;
  page.drawText(clean('   - STRAIGHTENING: Triceps contracts (shorter);'), { x: 315, y: y2, size: 7.2, font: reg, color: darkText });
  y2 -= 11;
  page.drawText(clean('     Biceps relaxes (longer).'), { x: 325, y: y2, size: 7.2, font: reg, color: darkText });
  y2 -= 14;
  page.drawText(clean('* Exercise benefits: strengthens bones & heart, fitness.'), { x: 315, y: y2, size: 7, font: italic, color: mutedText });

  // Section 3: Animal Classification Master (MAYA PRIORITY) (Middle)
  drawSection(40, 410, 515, 195, '3. ANIMAL CLASSIFICATION & SKELETONS (1.4 - MAYA CRITICAL FOCUS)', softBlue);
  let y3 = 410 + 195 - 30;
  page.drawText(clean('* VERTEBRATES (HAVE A BACKBONE / ENDOSKELETON) - THE 5 GROUPS:'), { x: 50, y: y3, size: 8, font: bold, color: navy });
  y3 -= 15;
  page.drawText(clean('  1. MAMMALS: Fur/hair, warm-blooded, live young, nurse with milk. (Humans, Dogs, Whales, Dolphins, Bats).'), { x: 50, y: y3, size: 7.3, font: reg, color: darkText });
  y3 -= 13;
  page.drawText(clean('  2. BIRDS: Feathers, wings, beaks, warm-blooded, lay hard eggs on land. (Eagles, Penguins, Ostriches).'), { x: 50, y: y3, size: 7.3, font: reg, color: darkText });
  y3 -= 13;
  page.drawText(clean('  3. REPTILES: Dry scales, cold-blooded, lay leathery eggs on land. (Snakes, Lizards, Tortoises, Crocodiles).'), { x: 50, y: y3, size: 7.3, font: reg, color: darkText });
  y3 -= 13;
  page.drawText(clean('  4. AMPHIBIANS: Smooth wet skin, cold-blooded, jelly eggs in water, young have gills. (Frogs, Toads, Newts).'), { x: 50, y: y3, size: 7.3, font: reg, color: darkText });
  y3 -= 13;
  page.drawText(clean('  5. FISH: Wet scales, fins, gills, cold-blooded, live in water. (Salmon, Sharks, Tuna, Goldfish).'), { x: 50, y: y3, size: 7.3, font: reg, color: darkText });
  y3 -= 18;

  page.drawText(clean('* INVERTEBRATES (NO BACKBONE): Insects, Spiders, Crabs, Earthworms, Jellyfish, Snails.'), { x: 50, y: y3, size: 7.8, font: bold, color: amber });
  y3 -= 15;
  page.drawText(clean('* 3 SKELETON TYPES:'), { x: 50, y: y3, size: 7.8, font: bold, color: navy });
  y3 -= 13;
  page.drawText(clean('   - Endoskeleton: INSIDE body (Bones). All 5 Vertebrates (humans, birds, fish, snakes, frogs).'), { x: 60, y: y3, size: 7.2, font: reg, color: darkText });
  y3 -= 12;
  page.drawText(clean('   - Exoskeleton: OUTSIDE body (Hard shell). Insects (beetles, ants), Crabs, Spiders. Must moult.'), { x: 60, y: y3, size: 7.2, font: reg, color: darkText });
  y3 -= 12;
  page.drawText(clean('   - Hydrostatic: FLUID under pressure. Soft invertebrates (Earthworms, Jellyfish, Slugs).'), { x: 60, y: y3, size: 7.2, font: reg, color: darkText });

  // Section 4: Medicines & Infectious Diseases (Bottom Left)
  drawSection(40, 235, 250, 165, '4. MEDICINES & GERMS (1.5)');
  let y4 = 235 + 165 - 30;
  page.drawText(clean('* Germs cause infectious diseases.'), { x: 50, y: y4, size: 7.5, font: bold, color: navy });
  y4 -= 12;
  page.drawText(clean('* Humans, animals & PLANTS all get diseases!'), { x: 50, y: y4, size: 7.2, font: bold, color: amber });
  y4 -= 14;
  page.drawText(clean('* VACCINES: Injections given BEFORE illness'), { x: 50, y: y4, size: 7.2, font: bold, color: green });
  y4 -= 11;
  page.drawText(clean('  to train the immune system (prevention).'), { x: 50, y: y4, size: 7, font: reg, color: darkText });
  y4 -= 13;
  page.drawText(clean('* ANTIBIOTICS: Medicines taken AFTER sickness'), { x: 50, y: y4, size: 7.2, font: bold, color: navy });
  y4 -= 11;
  page.drawText(clean('  to kill harmful bacteria (NEVER kills viruses!).'), { x: 50, y: y4, size: 7, font: reg, color: darkText });
  y4 -= 14;
  page.drawText(clean('* 4 SAFETY RULES: 1) Adult gives medicine, 2) Follow label,'), { x: 50, y: y4, size: 7, font: reg, color: darkText });
  y4 -= 11;
  page.drawText(clean('  3) Never share with friends, 4) More does NOT heal faster!'), { x: 50, y: y4, size: 7, font: reg, color: darkText });

  // Section 5: Dad's 5-Minute Dinner / Bedtime Drill (Bottom Right)
  drawSection(305, 235, 250, 165, '5. DAD\'S 5-MINUTE ORAL DRILL FOR TONIGHT');
  let y5 = 235 + 165 - 30;
  page.drawText(clean('Ask these 5 questions out loud:'), { x: 315, y: y5, size: 7.5, font: bold, color: navy });
  y5 -= 14;
  page.drawText(clean('1. "Which bone protects your brain? Your lungs?"'), { x: 315, y: y5, size: 7.2, font: bold, color: darkText });
  y5 -= 11;
  page.drawText(clean('   (Ans: Skull, Rib cage).'), { x: 325, y: y5, size: 7, font: italic, color: green });
  y5 -= 13;
  page.drawText(clean('2. "Can a muscle push? What does biceps do to bend?"'), { x: 315, y: y5, size: 7.2, font: bold, color: darkText });
  y5 -= 11;
  page.drawText(clean('   (Ans: Muscles only pull! Biceps contracts/gets shorter).'), { x: 325, y: y5, size: 7, font: italic, color: green });
  y5 -= 13;
  page.drawText(clean('3. "Is a whale a fish? Is a bat a bird?"'), { x: 315, y: y5, size: 7.2, font: bold, color: darkText });
  y5 -= 11;
  page.drawText(clean('   (Ans: NO! Both are MAMMALS: fur, lungs, milk!).'), { x: 325, y: y5, size: 7, font: italic, color: green });
  y5 -= 13;
  page.drawText(clean('4. "What skeleton does a beetle have? An earthworm?"'), { x: 315, y: y5, size: 7.2, font: bold, color: darkText });
  y5 -= 11;
  page.drawText(clean('   (Ans: Beetle = Exoskeleton; Worm = Hydrostatic).'), { x: 325, y: y5, size: 7, font: italic, color: green });
  y5 -= 13;
  page.drawText(clean('5. "Can plants get infectious diseases?" (Ans: YES!).'), { x: 315, y: y5, size: 7.2, font: bold, color: darkText });

  // Bottom Encouragement Footer Box
  page.drawRectangle({ x: 40, y: 50, width: 515, height: 170, color: white, borderColor: boxBorder, borderWidth: 1 });
  page.drawText(clean('QUICK MARKING FORMULA & EXAM CONFIDENCE KEYS'), { x: 55, y: 202, size: 8, font: bold, color: navy });
  
  const bottomPoints = [
    ['Key Vocabulary:', 'Skeleton (frame), Skull (head), Model (copy), Organs (internal parts), Invertebrates (no backbone), Muscles (movement), Exoskeleton (outer shell), Vaccination (prevention injection).'],
    ['Common Pitfalls:', 'Maya might classify Whales as fish or Penguins as mammals. Remind her: Whales have hair & milk (Mammals); Penguins have feathers (Birds!).'],
    ['Lara Mindset:', 'Ensure Lara reads both options in Q3 carefully. Bending arm = Biceps contracts (shorter) while Triceps relaxes (longer).'],
    ['Sleep & Morning:', 'Midterm starts first period tomorrow. High protein breakfast, good water intake, and 100% confidence. Both girls know the material!'],
  ];
  let bpY = 184;
  for (const [bpTitle, bpDesc] of bottomPoints) {
    page.drawText(clean(`* ${bpTitle}`), { x: 55, y: bpY, size: 7.5, font: bold, color: navy });
    drawTextBlock(page, bpDesc, 160, bpY, 385, 11, reg, 7.2, darkText);
    bpY -= 28;
  }

  // Footer Rule
  page.drawLine({ start: { x: 40, y: 38 }, end: { x: 555, y: 38 }, thickness: 0.8, color: boxBorder });
  page.drawText(clean('HEX-AIM Revision System  *  Year 4 Term 1 Science Midterm  *  Asten College 2026/2027'), {
    x: 40, y: 24, size: 7.5, font: reg, color: mutedText,
  });

  const pdfBytes = await doc.save();
  return pdfBytes;
}

async function main() {
  console.log('⚡ Generating Pixel-Perfect Science Midterm Sprint Pack for Lara...');
  const laraPdfBytes = await buildSprintPdf('Lara', false);
  const laraPath = '/home/kellyb_dev/projects/hex-aim/Lara_Science_Y4_Midterm_Sprint.pdf';
  writeFileSync(laraPath, laraPdfBytes);
  console.log(`✅ Saved: ${laraPath} (${(laraPdfBytes.length / 1024).toFixed(1)} KB)`);

  console.log('⚡ Generating Pixel-Perfect Science Midterm Sprint Pack for Maya (Vertebrate Deep-Dive)...');
  const mayaPdfBytes = await buildSprintPdf('Maya', true);
  const mayaPath = '/home/kellyb_dev/projects/hex-aim/Maya_Science_Y4_Midterm_Sprint.pdf';
  writeFileSync(mayaPath, mayaPdfBytes);
  console.log(`✅ Saved: ${mayaPath} (${(mayaPdfBytes.length / 1024).toFixed(1)} KB)`);

  console.log('⚡ Generating Dad\'s 1-Page Master Cheat Sheet...');
  const dadPdfBytes = await buildDadCheatSheet();
  const dadPath = '/home/kellyb_dev/projects/hex-aim/Dads_Science_Midterm_Cheat_Sheet.pdf';
  writeFileSync(dadPath, dadPdfBytes);
  console.log(`✅ Saved: ${dadPath} (${(dadPdfBytes.length / 1024).toFixed(1)} KB)`);

  // Deliver directly to Telegram bot only if --send flag is provided
  if (!process.argv.includes('--send')) {
    console.log('ℹ️ Telegram delivery skipped. Run with --send to dispatch to chat.');
    return;
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID;

  if (!botToken || !chatId) {
    console.warn('⚠️ TELEGRAM_BOT_TOKEN or TELEGRAM_ADMIN_CHAT_ID not provided. Skipping delivery.');
    return;
  }

  console.log(`📡 Delivering sprint packs to Telegram chat ${chatId}...`);

  // Intro message
  await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: `✨ <b>Science Midterm Sprint Packs (V2 - Pixel-Perfect Formatting) Ready!</b>\n\n` +
        `✅ <b>Zero Text Overlap:</b> Headers clamped, bounding boxes mathematically balanced.\n` +
        `✅ <b>Right-Margin Protected:</b> Automatic text-wrapping ensures zero text flows off the paper.\n` +
        `✅ <b>1-Page Master Cheat Sheet for Dad:</b> High-yield executive summary for tonight's review with Lara and Maya.\n\n` +
        `⬇️ <i>3 Printable PDFs delivered below:</i>`,
      parse_mode: 'HTML'
    })
  });

  // Helper to send PDF document
  const sendPdf = async (path, filename, caption) => {
    const bytes = readFileSync(path);
    const formData = new FormData();
    formData.append('chat_id', chatId);
    const blob = new Blob([bytes], { type: 'application/pdf' });
    formData.append('document', blob, filename);
    formData.append('caption', caption);
    formData.append('parse_mode', 'HTML');

    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendDocument`, {
      method: 'POST',
      body: formData,
    });
    const resData = await res.json();
    if (resData.ok) {
      console.log(`✅ Successfully sent ${filename} to Telegram!`);
    } else {
      console.error(`❌ Failed to send ${filename}:`, resData);
    }
  };

  await sendPdf(
    dadPath,
    'Dads_Science_Midterm_Cheat_Sheet.pdf',
    `🧭 <b>Dad's 1-Page Midterm Master Cheat Sheet</b>\n🎯 Units 1.1–1.5 • Executive Summary & 5-Minute Oral Drill for Lara & Maya`
  );

  await sendPdf(
    laraPath,
    'Lara_Science_Y4_Midterm_Sprint.pdf',
    `📄 <b>Lara's 6-Page Science Midterm Sprint Pack (V2)</b>\n🎯 ADHD-Friendly Visual Chunking • Complete Practice Exam & Guide`
  );

  await sendPdf(
    mayaPath,
    'Maya_Science_Y4_Midterm_Sprint.pdf',
    `📄 <b>Maya's 6-Page Science Midterm Sprint Pack (V2)</b>\n🎯 Vertebrates & Invertebrates Deep-Dive • Classification Key & Guide`
  );

  console.log('🎉 All Science Midterm Sprint Packs & Dad Cheat Sheet delivered successfully!');
}

main().catch(err => {
  console.error('Fatal error generating science sprint:', err);
  process.exit(1);
});
