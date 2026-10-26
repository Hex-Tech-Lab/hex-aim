/**
 * Science Midterm Sprint Pack Generator for Lara & Maya
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

async function buildSprintPdf(studentName, isMaya) {
  const doc = await PDFDocument.create();
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const reg = await doc.embedFont(StandardFonts.Helvetica);
  const italic = await doc.embedFont(StandardFonts.HelveticaOblique);

  const drawHeader = (page, pageNum, pageTitle, subtitle) => {
    // Top brand banner
    page.drawText(clean('HEX-AIM  |  ADAPTIVE INDIVIDUALIZED MASTERY  |  ASTEN COLLEGE Y4 SCIENCE'), {
      x: 40,
      y: 810,
      size: 8,
      font: bold,
      color: cyan,
    });

    // Page Title
    page.drawText(clean(pageTitle), {
      x: 40,
      y: 790,
      size: 15,
      font: bold,
      color: navy,
    });

    // Subtitle
    page.drawText(clean(subtitle), {
      x: 40,
      y: 775,
      size: 8.5,
      font: reg,
      color: mutedText,
    });

    // Student Badge Box (Top Right)
    page.drawRectangle({
      x: 420,
      y: 772,
      width: 135,
      height: 38,
      color: lightBg,
      borderColor: boxBorder,
      borderWidth: 1,
    });
    page.drawText(clean(`STUDENT: ${studentName.toUpperCase()}`), {
      x: 428,
      y: 795,
      size: 8.5,
      font: bold,
      color: navy,
    });
    page.drawText(clean(`Midterm Prep | Page ${pageNum} of 6`), {
      x: 428,
      y: 781,
      size: 7.5,
      font: reg,
      color: mutedText,
    });

    // Header divider rule
    page.drawLine({
      start: { x: 40, y: 764 },
      end: { x: 555, y: 764 },
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

  // Helper: Card box
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
        size: 9.5,
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
    drawCard(page1, 40, 615, 515, 135, '1. THE THREE VITAL FUNCTIONS OF THE SKELETON');
    const f1Y = 705;
    page1.drawText(clean('* 1. SUPPORT:'), { x: 55, y: f1Y, size: 9, font: bold, color: navy });
    page1.drawText(clean('Provides an upright frame that gives the body its shape and structure. Without it, you would collapse!'), { x: 135, y: f1Y, size: 8.5, font: reg, color: darkText });

    const f2Y = 675;
    page1.drawText(clean('* 2. PROTECTION:'), { x: 55, y: f2Y, size: 9, font: bold, color: navy });
    page1.drawText(clean('Hard bone shields guard delicate, life-critical internal organs:'), { x: 155, y: f2Y, size: 8.5, font: reg, color: darkText });
    page1.drawText(clean('   - SKULL protects the BRAIN.'), { x: 70, y: f2Y - 14, size: 8.5, font: bold, color: cyan });
    page1.drawText(clean('   - RIB CAGE protects the HEART and LUNGS in the chest.'), { x: 230, y: f2Y - 14, size: 8.5, font: bold, color: cyan });

    const f3Y = 635;
    page1.drawText(clean('* 3. MOVEMENT:'), { x: 55, y: f3Y, size: 9, font: bold, color: navy });
    page1.drawText(clean('Bones act as solid levers. Muscles are attached to bones and pull them to make us walk, bend, run, and smile.'), { x: 145, y: f3Y, size: 8.5, font: reg, color: darkText });

    // Card 2: Essential Bone Vocabulary
    drawCard(page1, 40, 480, 515, 125, '2. KEY BONES YOU MUST IDENTIFY ON EXAM DIAGRAMS');
    const bones = [
      ['Skull', 'Bones of the head protecting the brain and forming the face.'],
      ['Spine / Backbone', 'Column of small vertebrae supporting your back and protecting the spinal cord.'],
      ['Rib Cage', 'Curved bones encasing the chest to protect heart & lungs.'],
      ['Pelvis / Hip Bone', 'Wide basin-shaped bone supporting body weight & attaching leg bones.'],
      ['Femur', 'The longest, strongest bone in the body (upper leg/thigh bone).'],
      ['Jaw', 'Facial bone that moves to chew food and speak clearly.'],
    ];
    let bY = 560;
    for (const [bName, bDesc] of bones) {
      page1.drawText(clean(`* ${bName}:`), { x: 55, y: bY, size: 8.5, font: bold, color: navy });
      page1.drawText(clean(bDesc), { x: 165, y: bY, size: 8, font: reg, color: darkText });
      bY -= 17;
    }

    // Card 3: The Golden Muscle Rule & Antagonistic Pairs
    drawCard(page1, 40, 310, 515, 160, '3. HOW MUSCLES MOVE BONES (ANTAGONISTIC PAIRS)');
    page1.drawText(clean('GOLDEN RULE: Muscles CANNOT push! They can ONLY pull on bones by getting shorter.'), { x: 55, y: 445, size: 8.5, font: bold, color: green });
    page1.drawText(clean('Because muscles only pull, they always work in PAIRS (Antagonistic Muscle Pairs).'), { x: 55, y: 430, size: 8.5, font: reg, color: darkText });

    // Inner Comparison Boxes for Arm Bending
    drawCard(page1, 55, 325, 235, 95, 'BENDING THE ARM (Action 1)', softBlue);
    page1.drawText(clean('1. Biceps CONTRACTS:'), { x: 65, y: 382, size: 8.5, font: bold, color: navy });
    page1.drawText(clean('   Gets shorter & fatter; pulls forearm UP.'), { x: 65, y: 370, size: 8, font: reg, color: darkText });
    page1.drawText(clean('2. Triceps RELAXES:'), { x: 65, y: 352, size: 8.5, font: bold, color: mutedText });
    page1.drawText(clean('   Gets longer & thinner; allows arm to bend.'), { x: 65, y: 340, size: 8, font: reg, color: darkText });

    drawCard(page1, 305, 325, 235, 95, 'STRAIGHTENING THE ARM (Action 2)', softBlue);
    page1.drawText(clean('1. Triceps CONTRACTS:'), { x: 315, y: 382, size: 8.5, font: bold, color: navy });
    page1.drawText(clean('   Gets shorter; pulls forearm straight DOWN.'), { x: 315, y: 370, size: 8, font: reg, color: darkText });
    page1.drawText(clean('2. Biceps RELAXES:'), { x: 315, y: 352, size: 8.5, font: bold, color: mutedText });
    page1.drawText(clean('   Gets longer; rests while triceps pulls.'), { x: 315, y: 340, size: 8, font: reg, color: darkText });

    // Card 4: Quick Self-Check Challenge
    drawCard(page1, 40, 50, 515, 250, 'QUICK CHECK CHALLENGE 1 (Fill in your answers)');
    page1.drawText(clean('Q1. Which bone protects the brain?  ___________________________________'), { x: 55, y: 260, size: 8.5, font: bold, color: darkText });
    page1.drawText(clean('Q2. Which bone protects the heart and lungs?  ___________________________________'), { x: 55, y: 235, size: 8.5, font: bold, color: darkText });
    page1.drawText(clean('Q3. When muscle 2 contracts to bend your arm, what happens to its length? (circle):'), { x: 55, y: 210, size: 8.5, font: bold, color: darkText });
    page1.drawText(clean('     A) It gets longer and pushes        B) It gets shorter and pulls on the bone'), { x: 75, y: 195, size: 8.5, font: reg, color: navy });
    page1.drawText(clean('Q4. What does the other muscle in the pair do at the same time?'), { x: 55, y: 170, size: 8.5, font: bold, color: darkText });
    page1.drawText(clean('     Answer: It ___________________ and gets _____________________.'), { x: 75, y: 155, size: 8.5, font: reg, color: darkText });
    page1.drawText(clean('Q5. Name 3 reasons why daily exercise is essential for children:'), { x: 55, y: 130, size: 8.5, font: bold, color: darkText });
    page1.drawText(clean('     1) _________________________________________________________________________________'), { x: 75, y: 112, size: 8, font: reg, color: mutedText });
    page1.drawText(clean('     2) _________________________________________________________________________________'), { x: 75, y: 95, size: 8, font: reg, color: mutedText });
    page1.drawText(clean('     3) _________________________________________________________________________________'), { x: 75, y: 78, size: 8, font: reg, color: mutedText });
  }

  // ==========================================
  // PAGE 2: CLASSIFYING ANIMALS & SKELETON TYPES (MAYA FOCUS)
  // ==========================================
  {
    const page2 = doc.addPage([595.28, 841.89]);
    drawHeader(page2, 2, 'Unit 1.4: Vertebrates vs. Invertebrates & 3 Skeleton Types', isMaya ? 'CRITICAL FOCUS FOR MAYA: Complete Animal Classification & Skeleton Mastery' : 'Mastering Animal Classification & Skeleton Types');

    // Highlight note for Maya
    if (isMaya) {
      page2.drawRectangle({ x: 40, y: 725, width: 515, height: 26, color: softBlue, borderColor: cyan, borderWidth: 1 });
      page2.drawText(clean('MAYA TARGET: Memorize the simple rule: Vertebrate = Spine/Backbone. Invertebrate = No Spine!'), {
        x: 50, y: 733, size: 8.5, font: bold, color: navy,
      });
    }

    const topCardY = isMaya ? 545 : 565;
    const topCardH = isMaya ? 170 : 185;

    // Card 1: Vertebrates vs Invertebrates Definition & 5 Classes
    drawCard(page2, 40, topCardY, 515, topCardH, '1. VERTEBRATES (HAVE A BACKBONE) - THE 5 CLASSES');
    
    const vClasses = [
      ['1. MAMMALS:', 'Warm-blooded, covered in fur or hair, breathe with lungs, give birth to live young, produce milk.'],
      ['', 'Examples: Humans, dogs, cats, lions, whales, dolphins, bats (bats are flying mammals!).'],
      ['2. BIRDS:', 'Warm-blooded, covered in feathers, have beaks and wings, lay hard-shelled eggs on land.'],
      ['', 'Examples: Eagles, parrots, penguins (flightless bird!), ostriches.'],
      ['3. REPTILES:', 'Cold-blooded, dry tough scales, breathe with lungs, lay leathery eggs on land.'],
      ['', 'Examples: Snakes, lizards, tortoises, turtles, crocodiles.'],
      ['4. AMPHIBIANS:', 'Cold-blooded, smooth wet/moist skin, lay jelly-like eggs in water, young have gills, adults live on land.'],
      ['', 'Examples: Frogs, toads, newts, salamanders.'],
      ['5. FISH:', 'Cold-blooded, wet scales, fins instead of legs, breathe through gills, live in water.'],
      ['', 'Examples: Salmon, tuna, sharks, goldfish.'],
    ];

    let vcY = topCardY + topCardH - 35;
    for (const [title, desc] of vClasses) {
      if (title) {
        page2.drawText(clean(title), { x: 55, y: vcY, size: 8.5, font: bold, color: navy });
        page2.drawText(clean(desc), { x: 135, y: vcY, size: 7.8, font: reg, color: darkText });
      } else {
        page2.drawText(clean(desc), { x: 135, y: vcY, size: 7.5, font: italic, color: mutedText });
      }
      vcY -= 13;
    }

    // Card 2: Invertebrates & The 3 Types of Skeletons
    drawCard(page2, 40, 360, 515, 175, '2. THE THREE TYPES OF SKELETONS ACROSS ALL ANIMALS');
    
    // 3 Boxes Side by Side
    // Box A: Endoskeleton
    drawCard(page2, 50, 375, 155, 135, 'ENDOSKELETON', white);
    page2.drawText(clean('Location: INSIDE body'), { x: 58, y: 475, size: 8, font: bold, color: navy });
    page2.drawText(clean('Structure: Hard bones'), { x: 58, y: 460, size: 7.5, font: reg, color: darkText });
    page2.drawText(clean('grows as animal grows.'), { x: 58, y: 448, size: 7.5, font: reg, color: darkText });
    page2.drawText(clean('Found in: All Vertebrates!'), { x: 58, y: 430, size: 7.8, font: bold, color: green });
    page2.drawText(clean('Humans, dogs, birds,'), { x: 58, y: 418, size: 7.5, font: reg, color: darkText });
    page2.drawText(clean('frogs, fish, snakes.'), { x: 58, y: 406, size: 7.5, font: reg, color: darkText });
    page2.drawText(clean('Key Advantage: Supports heavy body weight.'), { x: 58, y: 388, size: 7, font: italic, color: mutedText });

    // Box B: Exoskeleton
    drawCard(page2, 220, 375, 155, 135, 'EXOSKELETON', white);
    page2.drawText(clean('Location: OUTSIDE body'), { x: 228, y: 475, size: 8, font: bold, color: amber });
    page2.drawText(clean('Structure: Hard shell / armor;'), { x: 228, y: 460, size: 7.5, font: reg, color: darkText });
    page2.drawText(clean('does not grow (must moult).'), { x: 228, y: 448, size: 7.5, font: reg, color: darkText });
    page2.drawText(clean('Found in: Invertebrates!'), { x: 228, y: 430, size: 7.8, font: bold, color: amber });
    page2.drawText(clean('Insects (ants, beetles),'), { x: 228, y: 418, size: 7.5, font: reg, color: darkText });
    page2.drawText(clean('Crabs, lobsters, spiders.'), { x: 228, y: 406, size: 7.5, font: reg, color: darkText });
    page2.drawText(clean('Key Advantage: Armor protection & waterproof.'), { x: 228, y: 388, size: 7, font: italic, color: mutedText });

    // Box C: Hydrostatic Skeleton
    drawCard(page2, 390, 375, 155, 135, 'HYDROSTATIC SKELETON', white);
    page2.drawText(clean('Location: FLUID PRESSURE'), { x: 398, y: 475, size: 8, font: bold, color: cyan });
    page2.drawText(clean('Structure: Fluid-filled cavity'), { x: 398, y: 460, size: 7.5, font: reg, color: darkText });
    page2.drawText(clean('under pressure like a water balloon.'), { x: 398, y: 448, size: 7.5, font: reg, color: darkText });
    page2.drawText(clean('Found in: Soft Invertebrates!'), { x: 398, y: 430, size: 7.8, font: bold, color: cyan });
    page2.drawText(clean('Earthworms, jellyfish,'), { x: 398, y: 418, size: 7.5, font: reg, color: darkText });
    page2.drawText(clean('slugs, sea anemones.'), { x: 398, y: 406, size: 7.5, font: reg, color: darkText });
    page2.drawText(clean('Key Advantage: Highly flexible through tiny soil spaces.'), { x: 398, y: 388, size: 7, font: italic, color: mutedText });

    // Card 3: Identification Key Flowchart (Exam Pattern!)
    drawCard(page2, 40, 50, 515, 300, 'VERTEBRATE CLASSIFICATION FLOWCHART KEY (EXAM DRILL)');
    page2.drawText(clean('Follow the questions to identify the animal class correctly:'), { x: 55, y: 325, size: 8.5, font: bold, color: navy });

    const keySteps = [
      ['Question 1:', 'Does the animal have a backbone (spine)?', 'YES -> Go to Question 2 (Vertebrate)', 'NO -> INVERTEBRATE (e.g. beetle, worm)'],
      ['Question 2:', 'Does the animal have fur or hair and nurse with milk?', 'YES -> MAMMAL (e.g. human, whale, lion)', 'NO -> Go to Question 3'],
      ['Question 3:', 'Does the animal have feathers and wings?', 'YES -> BIRD (e.g. eagle, penguin)', 'NO -> Go to Question 4'],
      ['Question 4:', 'Does the animal have dry, waterproof scales?', 'YES -> REPTILE (e.g. snake, lizard, turtle)', 'NO -> Go to Question 5'],
      ['Question 5:', 'Does it have moist, smooth skin & start life in water?', 'YES -> AMPHIBIAN (e.g. frog, toad)', 'NO -> FISH (scales, fins, gills in water)'],
    ];

    let ky = 305;
    for (const [step, qText, yesPath, noPath] of keySteps) {
      page2.drawText(clean(`${step} ${qText}`), { x: 55, y: ky, size: 8, font: bold, color: navy });
      page2.drawText(clean(`[YES]: ${yesPath}`), { x: 75, y: ky - 13, size: 7.5, font: reg, color: green });
      page2.drawText(clean(`[NO]: ${noPath}`), { x: 310, y: ky - 13, size: 7.5, font: reg, color: amber });
      ky -= 28;
    }

    // Mini Drill at Bottom
    page2.drawRectangle({ x: 55, y: 65, width: 485, height: 75, color: white, borderColor: boxBorder, borderWidth: 1 });
    page2.drawText(clean('RAPID TEST: Classify these tricky animals:'), { x: 65, y: 125, size: 8, font: bold, color: navy });
    page2.drawText(clean('1. Whale:   Vertebrate or Invertebrate? ____________ Class: ____________ (Hint: has lungs & milk!)'), { x: 65, y: 110, size: 7.5, font: reg, color: darkText });
    page2.drawText(clean('2. Penguin: Vertebrate or Invertebrate? ____________ Class: ____________ (Hint: covered in feathers!)'), { x: 65, y: 95, size: 7.5, font: reg, color: darkText });
    page2.drawText(clean('3. Beetle:  Vertebrate or Invertebrate? ____________ Skeleton Type: _________ (Hint: hard crunchy shell!)'), { x: 65, y: 80, size: 7.5, font: reg, color: darkText });
  }

  // ==========================================
  // PAGE 3: MEDICINES, VACCINES & INFECTIOUS DISEASES (UNIT 1.5)
  // ==========================================
  {
    const page3 = doc.addPage([595.28, 841.89]);
    drawHeader(page3, 3, 'Unit 1.5: Medicines, Vaccines & Infectious Diseases', 'Mastering Germs, Disease Prevention and Safe Medicine Guidelines');

    // Card 1: Germs and Infectious Diseases
    drawCard(page3, 40, 600, 515, 150, '1. GERMS, PATHOGENS & INFECTIOUS DISEASES');
    page3.drawText(clean('* What is an Infectious Disease?'), { x: 55, y: 720, size: 9, font: bold, color: navy });
    page3.drawText(clean('An illness caused by tiny microscopic living things called germs (pathogens) that enter living organisms.'), { x: 55, y: 706, size: 8.5, font: reg, color: darkText });

    page3.drawText(clean('* Who Can Catch Infectious Diseases?'), { x: 55, y: 685, size: 9, font: bold, color: navy });
    page3.drawText(clean('HUMANS, ANIMALS, and PLANTS can ALL get infectious diseases! (Crucial exam fact: plants get sick too!)'), { x: 55, y: 671, size: 8.5, font: bold, color: amber });

    page3.drawText(clean('* How Do Germs Spread?'), { x: 55, y: 650, size: 9, font: bold, color: navy });
    page3.drawText(clean('Through coughing/sneezing droplets in the air, touching unwashed surfaces, dirty water, or spoiled food.'), { x: 55, y: 636, size: 8.5, font: reg, color: darkText });
    page3.drawText(clean('Prevention: Washing hands with warm soap and water kills germs and stops the spread.'), { x: 55, y: 622, size: 8.5, font: italic, color: green });

    // Card 2: Antibiotics vs Vaccines
    drawCard(page3, 40, 420, 515, 165, '2. MEDICINES: ANTIBIOTICS VS. VACCINES');
    
    // Sub-box 1: Vaccines
    drawCard(page3, 55, 435, 235, 125, 'VACCINATIONS (PREVENTION)', white);
    page3.drawText(clean('How Given: Injection (needle).'), { x: 65, y: 525, size: 8, font: bold, color: navy });
    page3.drawText(clean('When Given: BEFORE you get sick.'), { x: 65, y: 510, size: 8, font: bold, color: green });
    page3.drawText(clean('Purpose: Trains your immune system to make'), { x: 65, y: 495, size: 7.5, font: reg, color: darkText });
    page3.drawText(clean('antibodies so you are immune to disease.'), { x: 65, y: 483, size: 7.5, font: reg, color: darkText });
    page3.drawText(clean('Examples: Measles, Polio, Flu vaccine.'), { x: 65, y: 468, size: 7.5, font: italic, color: mutedText });
    page3.drawText(clean('Protects both humans and animals (pets/livestock).'), { x: 65, y: 450, size: 7, font: reg, color: darkText });

    // Sub-box 2: Antibiotics
    drawCard(page3, 305, 435, 235, 125, 'ANTIBIOTICS (TREATMENT)', white);
    page3.drawText(clean('How Given: Liquid medicine or pills/tablets.'), { x: 315, y: 525, size: 8, font: bold, color: navy });
    page3.drawText(clean('When Given: AFTER you are sick.'), { x: 315, y: 510, size: 8, font: bold, color: amber });
    page3.drawText(clean('Purpose: Kills harmful bacteria inside your body.'), { x: 315, y: 495, size: 7.5, font: reg, color: darkText });
    page3.drawText(clean('CRITICAL RULE: Antibiotics ONLY kill bacteria.'), { x: 315, y: 480, size: 7.5, font: bold, color: navy });
    page3.drawText(clean('They do NOT work against viruses (like colds).'), { x: 315, y: 468, size: 7.5, font: reg, color: darkText });
    page3.drawText(clean('Always complete the full course prescribed!'), { x: 315, y: 450, size: 7, font: italic, color: green });

    // Card 3: The 4 Golden Rules of Medicine Safety
    drawCard(page3, 40, 235, 515, 170, '3. THE FOUR ESSENTIAL RULES FOR TAKING MEDICINES SAFELY');
    const rules = [
      ['RULE 1: Adult Supervision Only', 'Children must NEVER take medicines by themselves. Only a trusted adult (parent, nurse, doctor) may give you medicine.'],
      ['RULE 2: Read & Follow the Label', 'Always read the exact dose and instructions written on the medicine bottle. Check the expiration date!'],
      ['RULE 3: Never Share Medicines', 'Medicine prescribed for a friend, sibling, or parent can be toxic or harmful to you. Never take someone else\'s medicine.'],
      ['RULE 4: More Does NOT Mean Faster', 'Taking a larger dose of medicine does NOT cure you faster. It can cause serious poisoning or organ damage.'],
    ];
    let rY = 375;
    for (const [rTitle, rDesc] of rules) {
      page3.drawText(clean(`* ${rTitle}:`), { x: 55, y: rY, size: 8.5, font: bold, color: navy });
      page3.drawText(clean(rDesc), { x: 55, y: rY - 12, size: 8, font: reg, color: darkText });
      rY -= 28;
    }

    // Card 4: True or False Diagnostic Check
    drawCard(page3, 40, 50, 515, 170, 'UNIT 1.5 TRUE OR FALSE EXAM DRILL');
    const tfQuestions = [
      ['a. Germs cause infectious diseases.', 'TRUE'],
      ['b. If you take more medicine, you will get better faster.', 'FALSE'],
      ['c. Always follow the instructions on the medicine label.', 'TRUE'],
      ['d. It is OK to take medicine that a friend gives you if you have the same headache.', 'FALSE'],
      ['e. Plants do not have any infectious diseases.', 'FALSE'],
      ['f. Vaccinations are injections given to prevent diseases before you get sick.', 'TRUE'],
    ];
    let tfY = 190;
    for (const [q, a] of tfQuestions) {
      page3.drawText(clean(q), { x: 55, y: tfY, size: 8, font: reg, color: darkText });
      page3.drawText(clean(`[Circle]:  TRUE  /  FALSE`), { x: 420, y: tfY, size: 8, font: bold, color: navy });
      tfY -= 20;
    }
  }

  // ==========================================
  // PAGE 4: EXAM SIMULATION (PART 1 - BIOMECHANICS & BONES)
  // ==========================================
  {
    const page4 = doc.addPage([595.28, 841.89]);
    drawHeader(page4, 4, 'Exam Simulation Part 1: Biomechanics & Anatomy', 'Realistic Midterm Exam Questions - Attempt every question independently');

    // Section 1: Definitions
    drawCard(page4, 40, 600, 515, 150, 'QUESTION 1: SCIENTIFIC VOCABULARY MATCHING (8 Marks)');
    page4.drawText(clean('Write the correct scientific word for each definition:'), { x: 55, y: 720, size: 8.5, font: bold, color: navy });
    
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
    let vy = 702;
    for (const [def, blank] of vocab) {
      page4.drawText(clean(def), { x: 55, y: vy, size: 8, font: reg, color: darkText });
      page4.drawText(clean(blank), { x: 410, y: vy, size: 8, font: bold, color: navy });
      vy -= 14;
    }

    // Section 2: Arm Bending Muscle Mechanics
    drawCard(page4, 40, 395, 515, 190, 'QUESTION 2: MUSCLE PAIRS & ARM BENDING (6 Marks)');
    page4.drawText(clean('Look at the mechanics of bending your arm at the elbow joint:'), { x: 55, y: 555, size: 8.5, font: bold, color: navy });

    page4.drawRectangle({ x: 55, y: 470, width: 485, height: 75, color: white, borderColor: boxBorder, borderWidth: 1 });
    page4.drawText(clean('ANATOMY KEY:'), { x: 65, y: 532, size: 8, font: bold, color: cyan });
    page4.drawText(clean('* Muscle 1: Triceps (back of the upper arm)'), { x: 65, y: 518, size: 8, font: reg, color: darkText });
    page4.drawText(clean('* Muscle 2: Biceps (front of the upper arm)'), { x: 65, y: 504, size: 8, font: reg, color: darkText });
    page4.drawText(clean('* Bone: Forearm (radius and ulna attached by tendons)'), { x: 65, y: 490, size: 8, font: reg, color: darkText });

    page4.drawText(clean('a. Write down the number of the muscle that gets shorter to BEND the arm:   [ ______ ]'), { x: 55, y: 450, size: 8.5, font: bold, color: navy });
    page4.drawText(clean('b. Circle the correct words in the statement:'), { x: 55, y: 432, size: 8.5, font: bold, color: navy });
    page4.drawText(clean('   "The muscle ( CONTRACTS / RELAXES ). The muscle gets ( LONGER / SHORTER ) and'), { x: 70, y: 418, size: 8, font: reg, color: darkText });
    page4.drawText(clean('   ( PUSHES / PULLS ) on the arm bone to lift it."'), { x: 70, y: 405, size: 8, font: reg, color: darkText });

    // Section 3: Rabbit Skeleton Analysis (Exact Exam Diagram question!)
    drawCard(page4, 40, 50, 515, 330, 'QUESTION 3: SKELETON DIAGRAM ANALYSIS (RABBIT SKELETON) (10 Marks)');
    page4.drawText(clean('In the science lab, students observe a complete skeleton of a rabbit:'), { x: 55, y: 350, size: 8.5, font: bold, color: navy });

    const q3Parts = [
      ['a. Label Part C: Bones of the head protecting the brain.', 'Answer: ________________________________'],
      ['b. Label Part D: The curved cage of chest bones.', 'Answer: ________________________________'],
      ['c. Label Part A: The long column running down the back.', 'Answer: ________________________________'],
      ['d. Label Part E: The wide hip bone supporting legs.', 'Answer: ________________________________'],
      ['e. Label Part F: The strong hind legs for hopping.', 'Answer: ________________________________'],
      ['f. Which specific organ does Part C protect?', 'Answer: ________________________________'],
      ['g. Name TWO vital organs that Part D protects:', 'Answer: 1) _______________ 2) ______________'],
      ['h. Name the main function of Part F:', 'Answer: ________________________________'],
      ['i. Besides protection and movement, state ONE other function of the skeleton:', 'Answer: ________________________________'],
    ];

    let q3y = 330;
    for (const [prompt, ans] of q3Parts) {
      page4.drawText(clean(prompt), { x: 55, y: q3y, size: 8, font: reg, color: darkText });
      page4.drawText(clean(ans), { x: 380, y: q3y, size: 8, font: bold, color: navy });
      q3y -= 20;
    }
  }

  // ==========================================
  // PAGE 5: EXAM SIMULATION (PART 2 - CLASSIFICATION & HEALTH)
  // ==========================================
  {
    const page5 = doc.addPage([595.28, 841.89]);
    drawHeader(page5, 5, 'Exam Simulation Part 2: Animal Classification & Data', 'Mastering the 5 Vertebrate Groups, Skeletons and Daily Activity Graphs');

    // Section 4: Classification Master Table (Maya's key drill!)
    drawCard(page5, 40, 470, 515, 280, 'QUESTION 4: CLASSIFICATION MASTER MATRIX (16 Marks)');
    page5.drawText(clean('For each animal, determine: 1) Vertebrate or Invertebrate, 2) Class (if Vertebrate), 3) Skeleton Type:'), { x: 55, y: 720, size: 8.5, font: bold, color: navy });

    // Table Header
    page5.drawRectangle({ x: 50, y: 685, width: 495, height: 20, color: navy });
    page5.drawText(clean('ANIMAL'), { x: 58, y: 692, size: 8, font: bold, color: white });
    page5.drawText(clean('BACKBONE? (Y/N)'), { x: 130, y: 692, size: 8, font: bold, color: white });
    page5.drawText(clean('VERT / INVERT'), { x: 230, y: 692, size: 8, font: bold, color: white });
    page5.drawText(clean('CLASS (If Vertebrate)'), { x: 330, y: 692, size: 8, font: bold, color: white });
    page5.drawText(clean('SKELETON TYPE'), { x: 450, y: 692, size: 8, font: bold, color: white });

    const matrixAnimals = [
      ['Human', 'Yes', 'Vertebrate', 'Mammal', 'Endoskeleton'],
      ['Earthworm', 'No', 'Invertebrate', 'None (Worm)', 'Hydrostatic'],
      ['Eagle', 'Yes', 'Vertebrate', 'Bird', 'Endoskeleton'],
      ['Beetle', 'No', 'Invertebrate', 'None (Insect)', 'Exoskeleton'],
      ['Chameleon', 'Yes', 'Vertebrate', 'Reptile', 'Endoskeleton'],
      ['Frog', 'Yes', 'Vertebrate', 'Amphibian', 'Endoskeleton'],
      ['Goldfish', 'Yes', 'Vertebrate', 'Fish', 'Endoskeleton'],
      ['Crab', 'No', 'Invertebrate', 'None (Crustacean)', 'Exoskeleton'],
    ];

    let tY = 665;
    for (const [aName] of matrixAnimals) {
      page5.drawRectangle({ x: 50, y: tY - 3, width: 495, height: 18, color: tY % 2 === 0 ? lightBg : white, borderColor: boxBorder, borderWidth: 0.5 });
      page5.drawText(clean(aName), { x: 58, y: tY + 2, size: 8, font: bold, color: navy });
      page5.drawText(clean('___________'), { x: 140, y: tY + 2, size: 8, font: reg, color: mutedText });
      page5.drawText(clean('___________'), { x: 235, y: tY + 2, size: 8, font: reg, color: mutedText });
      page5.drawText(clean('___________'), { x: 335, y: tY + 2, size: 8, font: reg, color: mutedText });
      page5.drawText(clean('___________'), { x: 455, y: tY + 2, size: 8, font: reg, color: mutedText });
      tY -= 20;
    }

    // Section 5: Arun's Daily Activity Graph Analysis
    drawCard(page5, 40, 200, 515, 255, 'QUESTION 5: ARUN\'S ACTIVITY GRAPH & PHYSICAL HEALTH (10 Marks)');
    page5.drawText(clean('Arun recorded his activities for 24 hours: Sleeping (10h), Class (6h), TV/Gaming (4h), Cycling/Soccer (2h), Eating (2h).'), { x: 55, y: 425, size: 8, font: reg, color: darkText });

    const q5Questions = [
      ['a. Which activity did Arun spend the MOST time doing?', 'Answer: _____________________________'],
      ['b. Which TWO activities did Arun do for the SHORTEST time (2h)?', 'Answer: _____________________________'],
      ['c. For how many total hours did Arun do vigorous movement?', 'Answer: _____________________________'],
      ['d. Which activities should Arun REDUCE? Explain why:', 'Answer: _____________________________'],
      ['    Reason:', '_____________________________________'],
      ['e. Suggest TWO new activities that would increase his daily movement:', 'Answer: 1) ____________ 2) ___________'],
      ['f. Give THREE reasons why exercise is essential for the human body:', '1) __________________________________'],
      ['', '2) __________________________________'],
      ['', '3) __________________________________'],
    ];

    let aY = 405;
    for (const [prompt, ans] of q5Questions) {
      page5.drawText(clean(prompt), { x: 55, y: aY, size: 7.8, font: prompt.startsWith('f.') || prompt.startsWith('d.') ? bold : reg, color: darkText });
      if (ans) {
        page5.drawText(clean(ans), { x: 370, y: aY, size: 7.8, font: bold, color: navy });
      }
      aY -= 17;
    }

    // Section 6: Exam Pep Talk
    drawCard(page5, 40, 50, 515, 135, 'YOU ARE READY! EXAM STRATEGY FOR TOMORROW MORNING', softBlue, cyan);
    page5.drawText(clean('TOP EXAM TIPS FOR TOMORROW:'), { x: 55, y: 155, size: 8.5, font: bold, color: navy });
    page5.drawText(clean('1. Read every question twice: Underline words like "VERTEBRATE", "INVERTEBRATE", "PROTECTS", and "CONTRACTS".'), { x: 55, y: 140, size: 8, font: reg, color: darkText });
    page5.drawText(clean('2. Remember: Biceps contract to BEND. Triceps contract to STRAIGHTEN. Muscles only pull!'), { x: 55, y: 125, size: 8, font: reg, color: darkText });
    page5.drawText(clean('3. Whales and bats are MAMMALS. Penguins are BIRDS. Frogs are AMPHIBIANS. All are VERTEBRATES with endoskeletons!'), { x: 55, y: 110, size: 8, font: reg, color: darkText });
    page5.drawText(clean('4. Germs cause infectious diseases. Plants get sick too. Vaccines PREVENT; antibiotics TREAT bacterial infections.'), { x: 55, y: 95, size: 8, font: reg, color: darkText });
    page5.drawText(clean(`Believe in yourself, ${studentName}! You have worked hard and know this science inside out!`), { x: 55, y: 75, size: 8.5, font: bold, color: green });
  }

  // ==========================================
  // PAGE 6: PARENT SOCRATIC COACHING GUIDE & COMPLETE ANSWER KEY
  // ==========================================
  {
    const page6 = doc.addPage([595.28, 841.89]);
    drawHeader(page6, 6, 'Parent Socratic Coaching Guide & Complete Answer Key', 'Tonight\'s 8-Minute Rapid Review Script & Exact Marking Scheme');

    // Card 1: 8-Minute Script
    drawCard(page6, 40, 590, 515, 160, 'TONIGHT\'S 8-MINUTE SOCRATIC COACHING SCRIPT');
    const script = [
      ['Minute 1-2 (Bones & Protection):', 'Ask: "Touch your head. What bone is that? (Skull). What delicate organ is inside? (Brain)."'],
      ['', 'Ask: "Put your hands on your chest. What cage is that? (Rib cage). What two organs does it guard? (Heart & lungs)."'],
      ['Minute 3-4 (Muscle Action Demo):', 'Have her bend her arm up hard like a bodybuilder. Tell her to touch her biceps.'],
      ['', 'Ask: "Is it hard or soft? (Hard/short - it CONTRACTED). What is the triceps underneath doing? (RELAXING)."'],
      ['Minute 5-6 (Vertebrate vs Invertebrate):', isMaya ? 'CRITICAL WITH MAYA: Ask "Does a shark have a backbone? (Yes - vertebrate/fish). Does a beetle? (No - exoskeleton!)."' : 'Ask: "What 5 groups are vertebrates? (Mammals, Birds, Reptiles, Amphibians, Fish). What is an earthworm? (Invertebrate, hydrostatic)."'],
      ['', 'Ask: "Can you name a mammal that swims in the sea? (Whale/dolphin). A mammal that flies? (Bat)."'],
      ['Minute 7-8 (Medicine & Health):', 'Ask: "Can plants get infectious diseases? (YES!). What is the difference between a vaccine and antibiotic?"'],
    ];
    let sY = 720;
    for (const [title, dialogue] of script) {
      if (title) {
        page6.drawText(clean(title), { x: 55, y: sY, size: 8, font: bold, color: navy });
        page6.drawText(clean(dialogue), { x: 220, y: sY, size: 7.8, font: reg, color: darkText });
      } else {
        page6.drawText(clean(dialogue), { x: 220, y: sY, size: 7.8, font: italic, color: darkText });
      }
      sY -= 17;
    }

    // Card 2: Complete Model Answer Key
    drawCard(page6, 40, 50, 515, 525, 'COMPLETE MODEL ANSWER KEY (FOR PARENT MARKING)');

    const answers = [
      ['QUESTION 1 (Definitions):', 'a) Skeleton, b) Skull, c) Model, d) Organs, e) Invertebrates, f) Muscles, g) Exoskeleton, h) Vaccination (vaccine).'],
      ['QUESTION 2 (Arm Bending):', 'a) Muscle 2 (Biceps). b) CONTRACTS, SHORTER, PULLS.'],
      ['QUESTION 3 (Rabbit Skeleton):', 'a) Skull, b) Rib cage, c) Spine / backbone, d) Pelvis / hip bone, e) Leg bones.'],
      ['', 'f) Brain. g) Heart and lungs. h) Movement / walking and hopping.'],
      ['', 'i) Support (gives body shape and upright structure).'],
      ['QUESTION 4 (Classification Matrix):', 'Human: Yes / Vertebrate / Mammal / Endoskeleton.'],
      ['', 'Earthworm: No / Invertebrate / None (Annelid) / Hydrostatic.'],
      ['', 'Eagle: Yes / Vertebrate / Bird / Endoskeleton.'],
      ['', 'Beetle: No / Invertebrate / None (Insect) / Exoskeleton.'],
      ['', 'Chameleon: Yes / Vertebrate / Reptile / Endoskeleton.'],
      ['', 'Frog: Yes / Vertebrate / Amphibian / Endoskeleton.'],
      ['', 'Goldfish: Yes / Vertebrate / Fish / Endoskeleton.'],
      ['', 'Crab: No / Invertebrate / None (Crustacean) / Exoskeleton.'],
      ['QUESTION 5 (Arun\'s Graph):', 'a) Sleeping (10 hours). b) Riding a bike and eating (2 hours each).'],
      ['', 'c) 2 hours (riding a bike + playing football).'],
      ['', 'd) TV, playing computer games, sitting in class - involve sitting still for long periods.'],
      ['', 'e) Swimming, dancing, running, martial arts, basketball.'],
      ['', 'f) 1) Strengthens muscles and bones, 2) Keeps heart healthy, 3) Improves overall fitness & energy.'],
      ['UNIT 1.5 TRUE / FALSE:', 'a) TRUE, b) FALSE, c) TRUE, d) FALSE, e) FALSE, f) TRUE.'],
    ];

    let ansY = 545;
    for (const [section, detail] of answers) {
      if (section) {
        page6.drawText(clean(section), { x: 55, y: ansY, size: 8, font: bold, color: navy });
        page6.drawText(clean(detail), { x: 235, y: ansY, size: 7.5, font: reg, color: darkText });
      } else {
        page6.drawText(clean(detail), { x: 235, y: ansY, size: 7.5, font: reg, color: darkText });
      }
      ansY -= 17;
    }
  }

  const pdfBytes = await doc.save();
  return pdfBytes;
}

async function main() {
  console.log('⚡ Generating 6-page Science Midterm Sprint Pack for Lara...');
  const laraPdfBytes = await buildSprintPdf('Lara', false);
  const laraPath = '/home/kellyb_dev/projects/hex-aim/Lara_Science_Y4_Midterm_Sprint.pdf';
  writeFileSync(laraPath, laraPdfBytes);
  console.log(`✅ Saved: ${laraPath} (${(laraPdfBytes.length / 1024).toFixed(1)} KB)`);

  console.log('⚡ Generating 6-page Science Midterm Sprint Pack for Maya (Vertebrate Deep-Dive)...');
  const mayaPdfBytes = await buildSprintPdf('Maya', true);
  const mayaPath = '/home/kellyb_dev/projects/hex-aim/Maya_Science_Y4_Midterm_Sprint.pdf';
  writeFileSync(mayaPath, mayaPdfBytes);
  console.log(`✅ Saved: ${mayaPath} (${(mayaPdfBytes.length / 1024).toFixed(1)} KB)`);

  // Deliver directly to Telegram bot
  const botToken = '8728607835:AAFegxjDk7-o6bTBsVIOhFLX8sxjiTGnoCI';
  const chatId = '5055012900';

  console.log('📡 Delivering sprint packs to Telegram chat 5055012900...');

  // Intro message
  await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: `🧬 <b>Targeted Science Midterm Sprint Packs Ready!</b>\n\n` +
        `📚 <b>Subject:</b> Year 4 Science (Living Things 1.1–1.5)\n` +
        `🎯 <b>Target Exam:</b> Tomorrow Morning (Asten College)\n\n` +
        `👧 <b>Lara:</b> ADHD-friendly visual chunking, muscle pairs & bone protection.\n` +
        `👧 <b>Maya:</b> Specialized Vertebrate vs. Invertebrate deep-dive & classification keys.\n\n` +
        `⬇️ <i>Printable 6-page PDF sprint packs (including Parent Coaching Guides) attached below:</i>`,
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
    laraPath,
    'Lara_Science_Y4_Midterm_Sprint.pdf',
    `📄 <b>Lara's 6-Page Science Midterm Sprint Pack</b>\n🎯 Units 1.1–1.5 • Bones, Muscles, Diseases & Practice Exam`
  );

  await sendPdf(
    mayaPath,
    'Maya_Science_Y4_Midterm_Sprint.pdf',
    `📄 <b>Maya's 6-Page Science Midterm Sprint Pack</b>\n🎯 Units 1.1–1.5 • Vertebrates & Invertebrates Deep-Dive, Skeletons & Practice Exam`
  );

  console.log('🎉 All Science Midterm Sprint Packs delivered successfully!');
}

main().catch(err => {
  console.error('Fatal error generating science sprint:', err);
  process.exit(1);
});
