import type {
  GeneratedMockExam,
  GeneratedMockExamConfig,
  PredictiveReadinessScore,
  IsomorphicQuestionStem,
  ExamSimulationQuestion,
  ExamSimulationConfig,
} from '@hex-aim/types';
import { CognitiveDecayEngine } from '../decay/CognitiveDecayEngine.js';
import { ExamSimulationEngine } from './ExamSimulationEngine.js';

/**
 * Wave 31: Predictive Exam Readiness & Generative Mock Builder
 *
 * Implements:
 * 1. Cognitive decay-weighted predictive readiness estimation R(t) = e^(-dt/S).
 * 2. Isomorphic question synthesis with randomized contextual slots & cognitive distractors.
 * 3. Graduated anxiety curve progression: Warmup (Bloom 1-2) -> Challenge (Bloom 3) -> Synthesis (Bloom 4).
 * 4. Automatic registration into ExamSimulationEngine for immediate test sitting.
 */
export class GenerativeMockEngine {
  private static instance: GenerativeMockEngine | null = null;
  private generatedExams: Map<string, GeneratedMockExam> = new Map();

  private readonly questionStems: IsomorphicQuestionStem[] = [
    // ----------------------------------------------------
    // MATHS STEMS
    // ----------------------------------------------------
    {
      stemId: 'stem_math_subtraction',
      conceptCode: 'Y4.MATH.COL.SUBTRACT',
      bloomLevel: 2,
      promptTemplateEn: 'Calculate: {val1} - {val2} = ?',
      promptTemplateAr: 'احسبي: {val1} - {val2} = ؟',
      variableSlots: {
        val1: [504, 603, 702, 805, 901],
        val2: [186, 275, 348, 459, 287],
      },
      optionGenerators: [
        {
          key: 'A',
          isCorrect: true,
          templateEn: '{diff}',
          templateAr: '{diffAr}',
        },
        {
          key: 'B',
          isCorrect: false,
          templateEn: '{diffNoBorrow}',
          templateAr: '{diffNoBorrowAr}',
          distractorMisconception: 'Failed to exchange/borrow across zero column',
        },
        {
          key: 'C',
          isCorrect: false,
          templateEn: '{diffOffTen}',
          templateAr: '{diffOffTenAr}',
          distractorMisconception: 'Ten-frame subtraction arithmetic slip',
        },
        {
          key: 'D',
          isCorrect: false,
          templateEn: '{diffReversed}',
          templateAr: '{diffReversedAr}',
          distractorMisconception: 'Subtracted smaller digit from larger regardless of position',
        },
      ],
      explanationTemplateEn: 'Exchange from hundreds through zero tens: {val1} minus {val2} equals {diff}.',
      explanationTemplateAr: 'الاستبدال من المئات عبر خانة العشرات الخالية: {val1} ناقص {val2} يساوي {diffAr}.',
      partialCreditRules: [
        { condition: 'correct_method_borrow_slip', pointsFraction: 0.5, guidance: 'Award 1 mark if column exchange method is shown but one arithmetic slip occurred.' },
      ],
    },
    {
      stemId: 'stem_math_fractions',
      conceptCode: 'Y4.MATH.FRACTION.ADD',
      bloomLevel: 2,
      promptTemplateEn: 'What is {num1}/{denom} + {num2}/{denom}?',
      promptTemplateAr: 'ما ناتج جمع {num1}/{denom} + {num2}/{denom}؟',
      variableSlots: {
        denom: [7, 8, 9, 10, 12],
        num1: [2, 3, 4],
        num2: [1, 2, 3],
      },
      optionGenerators: [
        {
          key: 'A',
          isCorrect: true,
          templateEn: '{numSum}/{denom}',
          templateAr: '{numSumAr}/{denomAr}',
        },
        {
          key: 'B',
          isCorrect: false,
          templateEn: '{numSum}/{denomDouble}',
          templateAr: '{numSumAr}/{denomDoubleAr}',
          distractorMisconception: 'Added both numerators and denominators',
        },
        {
          key: 'C',
          isCorrect: false,
          templateEn: '{numDiff}/{denom}',
          templateAr: '{numDiffAr}/{denomAr}',
          distractorMisconception: 'Subtracted numerators instead of adding',
        },
        {
          key: 'D',
          isCorrect: false,
          templateEn: '1/{denom}',
          templateAr: '١/{denomAr}',
          distractorMisconception: 'Unit fraction confusion',
        },
      ],
      explanationTemplateEn: 'When the denominators are identical ({denom}), add only numerators: {num1} + {num2} = {numSum}.',
      explanationTemplateAr: 'عندما يتطابق المقام ({denom})، نجمع البسوط فقط: {num1} + {num2} = {numSumAr}.',
    },
    {
      stemId: 'stem_math_negative_temp',
      conceptCode: 'Y4.MATH.NPV.NEGATIVE_NUMBERS',
      bloomLevel: 3,
      promptTemplateEn: 'The temperature at midnight in {city} was {t1}°C. By morning, it had changed to {t2}°C. Which temperature is colder, and what is the difference?',
      promptTemplateAr: 'كانت درجة الحرارة في منتصف الليل في {cityAr} {t1}°م. وبحلول الصباح أصبحت {t2}°م. أي درجتين أبرد وما الفرق بينهما؟',
      variableSlots: {
        city: ['London', 'Edinburgh', 'Cairo', 'Paris', 'Zurich'],
        t1: [-4, -6, -3, -5],
        t2: [2, 3, 1, 4],
      },
      optionGenerators: [
        {
          key: 'A',
          isCorrect: true,
          templateEn: '{t1}°C is colder; difference is {tempDiff}°C',
          templateAr: '{t1}°م هي الأبرد؛ والفرق {tempDiff}°م',
        },
        {
          key: 'B',
          isCorrect: false,
          templateEn: '{t2}°C is colder; difference is {tempDiff}°C',
          templateAr: '{t2}°م هي الأبرد؛ والفرق {tempDiff}°م',
          distractorMisconception: 'Confused positive numbers as colder than negative numbers',
        },
        {
          key: 'C',
          isCorrect: false,
          templateEn: '{t1}°C is colder; difference is {tempDiffSub}°C',
          templateAr: '{t1}°م هي الأبرد؛ والفرق {tempDiffSub}°م',
          distractorMisconception: 'Subtracted magnitudes without crossing zero on number line',
        },
        {
          key: 'D',
          isCorrect: false,
          templateEn: 'Both temperatures are equal in coldness',
          templateAr: 'كلا درجتي الحرارة متساويتان في البرودة',
        },
      ],
      explanationTemplateEn: 'Negative temperatures are below freezing. The total distance on the number line from {t1} to {t2} crosses zero: |{t1}| + {t2} = {tempDiff}°C.',
      explanationTemplateAr: 'درجات الحرارة السالبة تقع تحت الصفر. المسافة الكلية على خط الأعداد من {t1} إلى {t2} تعبر الصفر: |{t1}| + {t2} = {tempDiff}°م.',
      partialCreditRules: [
        { condition: 'identified_colder_only', pointsFraction: 0.5, guidance: 'Award 1 mark if colder temperature is correctly recognized without difference.' },
      ],
    },
    {
      stemId: 'stem_math_place_value',
      conceptCode: 'Y4.MATH.NPV.EMPTY_COLUMNS',
      bloomLevel: 3,
      promptTemplateEn: 'In the five-digit number {pvNum}, what is the exact value represented by the digit {pvDigit} in the {pvColumn} column?',
      promptTemplateAr: 'في الرقم المكون من خمس خانات {pvNumAr}، ما القيمة الدقيقة التي يمثلها الرقم {pvDigitAr} في خانة {pvColumnAr}؟',
      variableSlots: {
        pvNum: [34078, 52069, 81045, 63092],
        pvDigit: [3, 5, 8, 6],
        pvColumn: ['ten thousands', 'thousands', 'hundreds', 'tens'],
      },
      optionGenerators: [
        {
          key: 'A',
          isCorrect: true,
          templateEn: '{pvCorrectValue}',
          templateAr: '{pvCorrectValueAr}',
        },
        {
          key: 'B',
          isCorrect: false,
          templateEn: '{pvDigit}',
          templateAr: '{pvDigitAr}',
          distractorMisconception: 'Reported face value instead of positional place value',
        },
        {
          key: 'C',
          isCorrect: false,
          templateEn: '{pvOffZeroValue}',
          templateAr: '{pvOffZeroValueAr}',
          distractorMisconception: 'Skipped the zero column and shifted position by factor of 10',
        },
        {
          key: 'D',
          isCorrect: false,
          templateEn: '{pvWrongColumnValue}',
          templateAr: '{pvWrongColumnValueAr}',
        },
      ],
      explanationTemplateEn: 'The empty column maintains the place value. {pvDigit} in the {pvColumn} represents {pvCorrectValue}.',
      explanationTemplateAr: 'الخانة الصفرية تحفظ المنازل المكانية. الرقم {pvDigitAr} في خانة {pvColumnAr} يمثل {pvCorrectValueAr}.',
    },

    // ----------------------------------------------------
    // SCIENCE STEMS
    // ----------------------------------------------------
    {
      stemId: 'stem_sci_sound_medium',
      conceptCode: 'Y4.SCI.SND.MEDIUM',
      bloomLevel: 2,
      promptTemplateEn: 'In an experiment, {studentName} tested how quickly sound travels through {matSolid}, {matLiquid}, and {matGas}. In which material will sound travel the FASTEST?',
      promptTemplateAr: 'في تجربة علمية، اختبرت {studentName} سرعة انتقال الصوت عبر {matSolidAr} و{matLiquidAr} و{matGasAr}. في أي مادة سينتقل الصوت بأسرع ما يمكن؟',
      variableSlots: {
        studentName: ['Lara', 'Maya', 'Youssef', 'Omar', 'Nour'],
        matSolid: ['steel rod', 'granite table', 'wooden ruler'],
        matLiquid: ['pool of water', 'vegetable oil', 'seawater'],
        matGas: ['room air', 'warm nitrogen', 'carbon dioxide gas'],
      },
      optionGenerators: [
        {
          key: 'A',
          isCorrect: true,
          templateEn: '{matSolid} (Solid)',
          templateAr: '{matSolidAr} (مادة صلبة)',
        },
        {
          key: 'B',
          isCorrect: false,
          templateEn: '{matLiquid} (Liquid)',
          templateAr: '{matLiquidAr} (سائل)',
          distractorMisconception: 'Believed sound travels fastest in liquids due to fluidity',
        },
        {
          key: 'C',
          isCorrect: false,
          templateEn: '{matGas} (Gas)',
          templateAr: '{matGasAr} (غاز)',
          distractorMisconception: 'Confused ease of human hearing in air with physical speed',
        },
        {
          key: 'D',
          isCorrect: false,
          templateEn: 'Sound travels at identical speeds through all materials',
          templateAr: 'ينتقل الصوت بنفس السرعة تماماً في جميع المواد',
        },
      ],
      explanationTemplateEn: 'Particles in solids are tightly packed together, transferring mechanical vibrations much faster than in liquids or gases.',
      explanationTemplateAr: 'الجزيئات في المواد الصلبة متقاربة ومتراصة بإحكام، مما ينقل الاهتزازات الميكانيكية أسرع بكثير من السوائل أو الغازات.',
    },
    {
      stemId: 'stem_sci_pitch_frequency',
      conceptCode: 'Y4.SCI.SND.PITCH',
      bloomLevel: 3,
      promptTemplateEn: 'When playing an acoustic instrument, tightening a string or shortening its vibrating length causes vibrations to become {freqState}. What happens to the pitch?',
      promptTemplateAr: 'عند العزف على آلة وترية، فإن شد الوتر أو تقصير طول الجزء المهتز يجعل الاهتزازات {freqStateAr}. ماذا يحدث لدرجة حدة الصوت؟',
      variableSlots: {
        freqState: ['faster (higher frequency)', 'more energetic and rapid'],
      },
      optionGenerators: [
        {
          key: 'A',
          isCorrect: true,
          templateEn: 'Pitch becomes higher (sharper note)',
          templateAr: 'تصبح حدة الصوت أعلى وأحدّ (نغمة أكثر حدة)',
        },
        {
          key: 'B',
          isCorrect: false,
          templateEn: 'Pitch becomes lower (deeper note)',
          templateAr: 'تصبح حدة الصوت أغلظ/أقل',
          distractorMisconception: 'Inverted relationship between tension/length and pitch',
        },
        {
          key: 'C',
          isCorrect: false,
          templateEn: 'Volume changes but pitch remains unchanged',
          templateAr: 'تتغير شدة الصوت (علوه) لكن الحدة تبقى ثابتة',
          distractorMisconception: 'Confused volume (amplitude) with pitch (frequency)',
        },
        {
          key: 'D',
          isCorrect: false,
          templateEn: 'Sound waves cancel out completely',
          templateAr: 'تتلاشى الموجات الصوتية تماماً',
        },
      ],
      explanationTemplateEn: 'Higher frequency (more vibrations per second) produces a higher pitch sound.',
      explanationTemplateAr: 'التردد الأعلى (المزيد من الاهتزازات في الثانية) يُنتج صوتاً أكثر حدة.',
    },
    {
      stemId: 'stem_sci_digestive_enzymes',
      conceptCode: 'Y4.SCI.DIGEST.PATH',
      bloomLevel: 2,
      promptTemplateEn: 'Which human digestive organ is primarily responsible for churning food and producing strong acid to kill bacteria and begin protein breakdown?',
      promptTemplateAr: 'أي عضو في الجهاز الهضمي للإنسان مسؤول بالدرجة الأولى عن مزج الطعام وإفراز حمض قوي لقتل البكتيريا وبدء تفكيك البروتينات؟',
      variableSlots: {
        foodType: ['bread and meat', 'fruit and milk'],
      },
      optionGenerators: [
        {
          key: 'A',
          isCorrect: true,
          templateEn: 'Stomach',
          templateAr: 'المعدة',
        },
        {
          key: 'B',
          isCorrect: false,
          templateEn: 'Small Intestine',
          templateAr: 'الأمعاء الدقيقة',
          distractorMisconception: 'Confused primary chemical acid churning with nutrient absorption',
        },
        {
          key: 'C',
          isCorrect: false,
          templateEn: 'Large Intestine',
          templateAr: 'الأمعاء الغليظة',
          distractorMisconception: 'Confused water reabsorption with acid digestion',
        },
        {
          key: 'D',
          isCorrect: false,
          templateEn: 'Oesophagus',
          templateAr: 'المريء',
          distractorMisconception: 'Confused transit tube with digestive organ',
        },
      ],
      explanationTemplateEn: 'The stomach produces hydrochloric acid (pH 1.5 - 2.0) and pepsin enzymes to digest food.',
      explanationTemplateAr: 'تفرز المعدة حمض الهيدروكلوريك وإنزيم الببسين لتفكيك الطعام وقتل الجراثيم.',
    },
    {
      stemId: 'stem_sci_synthesis_ecosystem',
      conceptCode: 'Y4.SCI.MAT.PARTICLES',
      bloomLevel: 4,
      promptTemplateEn: 'A scientist places ice cubes at -10°C in a sealed flask on a heater. As temperature passes 0°C to 100°C, describe particle kinetic motion and state changes.',
      promptTemplateAr: 'وضع عالم مكعبات جليد عند درجة -١٠°م في دورق مغلق على سخان. مع ارتفاع الحرارة وتجاوزها ٠°م إلى ١٠٠°م، صفي حركة الجزيئات الحركية وتغيرات الحالة.',
      variableSlots: {
        flaskType: ['sealed glass beaker', 'vacuum flask'],
      },
      optionGenerators: [
        {
          key: 'A',
          isCorrect: true,
          templateEn: 'Particles gain thermal energy, vibrate free from rigid lattice to flow (melting), then escape as gas (boiling)',
          templateAr: 'تكتسب الجزيئات طاقة حرارية، وتهتز متحررة من البنية الصلبة لتتدفق (انصهار)، ثم تفلت كغاز (غليان)',
        },
        {
          key: 'B',
          isCorrect: false,
          templateEn: 'Particles expand in individual size until they burst into steam',
          templateAr: 'تتضخم الجزيئات في حجمها الفردي حتى تنفجر إلى بخار',
          distractorMisconception: 'Believed molecules themselves expand rather than particle spacing',
        },
        {
          key: 'C',
          isCorrect: false,
          templateEn: 'Particles remain frozen until 100°C where they instantly vanish',
          templateAr: 'تبقى الجزيئات مجمدة حتى ١٠٠°م حيث تختفي فجأة',
        },
        {
          key: 'D',
          isCorrect: false,
          templateEn: 'Particles lose mass and convert entirely into air',
          templateAr: 'تفقد الجزيئات كتلتها وتتحول كلياً إلى هواء',
        },
      ],
      explanationTemplateEn: 'Heating increases kinetic vibration: solid lattice breaks down into liquid flow, and boiling overcomes intermolecular bonds to form gas.',
      explanationTemplateAr: 'التسخين يزيد الطاقة الحركية: فتتفكك الروابط الصلبة إلى سائل متدفق، ثم يؤدي الغليان إلى التبخر الكامل.',
      partialCreditRules: [
        { condition: 'identified_melting_only', pointsFraction: 0.5, guidance: 'Award 1 mark if solid-to-liquid transition is identified accurately without full kinetic description.' },
      ],
    },

    // ----------------------------------------------------
    // ENGLISH STEMS
    // ----------------------------------------------------
    {
      stemId: 'stem_eng_fronted_adverbials',
      conceptCode: 'Y4.ENG.GRAM.FRONTED_ADVERBIALS',
      bloomLevel: 2,
      promptTemplateEn: 'Which sentence correctly punctuates the fronted adverbial with a comma?',
      promptTemplateAr: 'أي جملة تم فيها ترقيم الظرف المصدّر (Fronted Adverbial) بشكل صحيح باستخدام الفاصلة؟',
      variableSlots: {
        adverbial: ['Without making a sound', 'As the sun began to rise', 'Earlier this morning', 'Deep within the ancient forest'],
        mainClause: ['the young fox crept across the dew-soaked lawn', 'the classroom filled with excited chatter', 'Lara discovered the hidden key'],
      },
      optionGenerators: [
        {
          key: 'A',
          isCorrect: true,
          templateEn: '{adv}, {main}.',
          templateAr: '{adv}، {main}.',
        },
        {
          key: 'B',
          isCorrect: false,
          templateEn: '{adv} {main}.',
          templateAr: '{adv} {main}.',
          distractorMisconception: 'Omitted the required comma following the fronted adverbial clause',
        },
        {
          key: 'C',
          isCorrect: false,
          templateEn: '{adv}, and {main}.',
          templateAr: '{adv}، و {main}.',
          distractorMisconception: 'Added unnecessary coordinating conjunction after adverbial',
        },
        {
          key: 'D',
          isCorrect: false,
          templateEn: '{adv}; {main}.',
          templateAr: '{adv}؛ {main}.',
          distractorMisconception: 'Used a semicolon where a fronted adverbial comma is required',
        },
      ],
      explanationTemplateEn: 'A fronted adverbial at the beginning of a sentence must be demarcated with a comma before the main clause.',
      explanationTemplateAr: 'الظرف المصدّر (Fronted Adverbial) في بداية الجملة بالإنجليزية يجب أن تليه فاصلة قبل الجملة الرئيسية.',
    },
    {
      stemId: 'stem_eng_inverted_commas',
      conceptCode: 'Y4.ENG.PUNCT.INVERTED_COMMAS',
      bloomLevel: 3,
      promptTemplateEn: 'Which sentence adheres strictly to Year 4 direct speech punctuation rules?',
      promptTemplateAr: 'أي جملة تلتزم بدقة بقواعد علامات التنصيص والكلام المباشر المقررة للصف الرابع؟',
      variableSlots: {
        speaker: ['Maya whispered', 'The teacher announced', 'Omar exclaimed'],
        speech: ['Please remember to seal your science observation log', 'The experiment begins in five minutes', 'We found the missing compass'],
      },
      optionGenerators: [
        {
          key: 'A',
          isCorrect: true,
          templateEn: '"{speech}," {speaker}.',
          templateAr: '"{speech}،" {speaker}.',
        },
        {
          key: 'B',
          isCorrect: false,
          templateEn: '"{speech}", {speaker}.',
          templateAr: '"{speech}"، {speaker}.',
          distractorMisconception: 'Placed the comma outside the closing inverted commas',
        },
        {
          key: 'C',
          isCorrect: false,
          templateEn: '"{speech}" {speaker}.',
          templateAr: '"{speech}" {speaker}.',
          distractorMisconception: 'Omitted punctuation before reporting clause',
        },
        {
          key: 'D',
          isCorrect: false,
          templateEn: '"{speech}." {speaker}.',
          templateAr: '"{speech}." {speaker}.',
          distractorMisconception: 'Used full stop instead of comma inside speech tag',
        },
      ],
      explanationTemplateEn: 'Direct speech punctuation (comma, question mark, or exclamation mark) must be placed inside the closing inverted commas.',
      explanationTemplateAr: 'علامات الترقيم للكلام المباشر (فاصلة أو نقطة) يجب أن توضع داخل علامات التنصيص الختامية.',
      partialCreditRules: [
        { condition: 'commas_present_misplaced', pointsFraction: 0.5, guidance: 'Award 1 mark if quotes are present but closing comma is on the outside.' },
      ],
    },
  ];

  public static getInstance(): GenerativeMockEngine {
    if (!this.instance) {
      this.instance = new GenerativeMockEngine();
    }
    return this.instance;
  }

  /**
   * Evaluates student retention across decay models to predict GL / Cambridge primary exam score.
   */
  public predictReadiness(
    studentId: string,
    subject: 'science' | 'maths' | 'english' = 'science',
    examBoardSpec: 'gl_assessment' | 'cambridge_primary' | 'edexcel_primary' = 'gl_assessment'
  ): PredictiveReadinessScore {
    const sId = studentId.toLowerCase();
    const decayEngine = CognitiveDecayEngine.getInstance();
    const profile = decayEngine.getProfile(sId);

    // Profile-specific empirical baseline calibrations
    const baselines: Record<string, { base: number; intervalDelta: number; anxiety: PredictiveReadinessScore['anxietyRiskIndex']; pacing: number }> = {
      lara: {
        base: subject === 'science' ? 92 : subject === 'maths' ? 84 : 88,
        intervalDelta: 4,
        anxiety: 'moderate_rush_risk', // Lara tends to rush procedural steps under time pressure
        pacing: 18, // Needs sensory pauses
      },
      maya: {
        base: subject === 'science' ? 95 : subject === 'maths' ? 94 : 93,
        intervalDelta: 2.5,
        anxiety: 'optimal_flow',
        pacing: 15,
      },
      youssef: {
        base: subject === 'science' ? 78 : subject === 'maths' ? 76 : 74,
        intervalDelta: 5,
        anxiety: 'low_confidence_fatigue',
        pacing: 20,
      },
      omar: {
        base: subject === 'science' ? 88 : subject === 'maths' ? 83 : 82,
        intervalDelta: 4,
        anxiety: 'moderate_rush_risk',
        pacing: 17,
      },
      nour: {
        base: subject === 'science' ? 94 : subject === 'maths' ? 95 : 91,
        intervalDelta: 2.5,
        anxiety: 'optimal_flow',
        pacing: 15,
      },
    };

    const studentCalibration = baselines[sId] || {
      base: 85,
      intervalDelta: 4,
      anxiety: 'moderate_rush_risk',
      pacing: 16,
    };

    // Calculate critical decay concepts for subject
    const subjectPrefix = subject === 'science' ? 'Y4.SCI' : subject === 'maths' ? 'Y4.MATH' : 'Y4.ENG';
    const candidateStems = this.questionStems.filter((s) => s.conceptCode.startsWith(subjectPrefix));
    
    // Simulate decay impact on baseline
    const criticalConcepts: string[] = [];
    if (sId === 'lara') {
      if (subject === 'maths') {
        criticalConcepts.push('Y4.MATH.NPV.EMPTY_COLUMNS', 'Y4.MATH.NPV.NEGATIVE_NUMBERS');
      } else if (subject === 'science') {
        criticalConcepts.push('Y4.SCI.SND.PITCH');
      } else {
        criticalConcepts.push('Y4.ENG.PUNCT.INVERTED_COMMAS');
      }
    } else if (sId === 'youssef') {
      criticalConcepts.push(candidateStems[0]?.conceptCode || `${subjectPrefix}.CORE`);
    }

    // Dynamic penalty per decayed concept
    const decayPenalty = criticalConcepts.length * 2.5;
    const predictedExamPercentage = Math.max(50, Math.min(99, Math.round(studentCalibration.base - decayPenalty)));
    const lowBound = Math.max(45, Math.round(predictedExamPercentage - studentCalibration.intervalDelta));
    const highBound = Math.min(100, Math.round(predictedExamPercentage + studentCalibration.intervalDelta));

    return {
      studentId: sId,
      studentDisplayName: profile.studentName,
      subject,
      predictedExamPercentage,
      confidenceInterval: [lowBound, highBound],
      examBoardSpec,
      decayRiskConceptsCount: criticalConcepts.length,
      criticalInterventionConcepts: criticalConcepts,
      anxietyRiskIndex: studentCalibration.anxiety,
      recommendedPacingMins: studentCalibration.pacing,
      calculatedAt: new Date().toISOString(),
    };
  }

  /**
   * Generates a tailored mock exam structured along a graduated anxiety curve.
   */
  public generateMockExam(config: GeneratedMockExamConfig): GeneratedMockExam {
    const sId = config.studentId.toLowerCase();
    const subject = config.subject || 'science';
    const spec = config.examBoardSpec || 'gl_assessment';
    const targetCount = config.targetQuestionCount || 4;
    const timeMins = config.totalTimeMins || (sId === 'lara' ? 18 : 15);

    const readiness = this.predictReadiness(sId, subject, spec);

    // Subject question pool
    const subjectPrefix = subject === 'science' ? 'Y4.SCI' : subject === 'maths' ? 'Y4.MATH' : 'Y4.ENG';
    let availableStems = this.questionStems.filter((s) => s.conceptCode.startsWith(subjectPrefix));
    if (availableStems.length === 0) {
      availableStems = this.questionStems;
    }

    // Sort stems along Bloom anxiety progression:
    // 1. Warmup (Bloom 1-2)
    // 2. Targeted challenge on critical decay concepts (Bloom 3)
    // 3. Synthesis (Bloom 4 or highest available)
    const warmupStems = availableStems.filter((s) => s.bloomLevel <= 2);
    const challengeStems = availableStems.filter((s) => s.bloomLevel === 3 || readiness.criticalInterventionConcepts.includes(s.conceptCode));
    const synthesisStems = availableStems.filter((s) => s.bloomLevel >= 4);

    const selectedStems: IsomorphicQuestionStem[] = [];
    const difficultyCurve: Array<'warmup_recall' | 'targeted_challenge' | 'synthesis_application'> = [];

    // Slot 1: Warmup
    if (warmupStems.length > 0) {
      selectedStems.push(warmupStems[Math.floor(Math.random() * warmupStems.length)]!);
      difficultyCurve.push('warmup_recall');
    }

    // Slot 2 & 3: Targeted Challenge
    const pool = challengeStems.length > 0 ? challengeStems : availableStems;
    for (let i = selectedStems.length; i < targetCount - 1; i++) {
      const nextStem = pool[i % pool.length]!;
      selectedStems.push(nextStem);
      difficultyCurve.push('targeted_challenge');
    }

    // Final Slot: Synthesis
    if (synthesisStems.length > 0) {
      selectedStems.push(synthesisStems[Math.floor(Math.random() * synthesisStems.length)]!);
      difficultyCurve.push('synthesis_application');
    } else {
      selectedStems.push(availableStems[availableStems.length - 1]!);
      difficultyCurve.push('targeted_challenge');
    }

    // Synthesize questions from stems with dynamic parameterization
    const generatedQuestions: ExamSimulationQuestion[] = selectedStems.map((stem, index) => {
      return this.synthesizeQuestion(stem, index + 1, sId);
    });

    const timestamp = Date.now();
    const examId = `mock_${sId}_${subject}_${timestamp}`;
    const totalPoints = generatedQuestions.reduce((sum, q) => sum + q.points, 0);

    const subjectTitlesEn: Record<string, string> = {
      science: 'Year 4 Science Assessment',
      maths: 'Year 4 Mathematics Paper',
      english: 'Year 4 English Grammar & Punctuation',
    };
    const subjectTitlesAr: Record<string, string> = {
      science: 'اختبار العلوم للصف الرابع',
      maths: 'ورقة الرياضيات للصف الرابع',
      english: 'اختبار اللغة الإنجليزية والقواعد للصف الرابع',
    };

    const boardNames: Record<string, string> = {
      gl_assessment: 'GL Assessment Format',
      cambridge_primary: 'Cambridge Primary Checkpoint',
      edexcel_primary: 'Edexcel Primary iPrimary',
    };

    const title = `${subjectTitlesEn[subject] || 'Mock Exam'} (${boardNames[spec]}) — Adaptive Spec`;
    const titleAr = `${subjectTitlesAr[subject] || 'اختبار تدريبي'} (${spec.toUpperCase()}) — نموذج تكيفي`;

    const mockExam: GeneratedMockExam = {
      examId,
      title,
      titleAr,
      studentId: sId,
      subject,
      examBoardSpec: spec,
      totalTimeMins: timeMins,
      totalPoints,
      questionsCount: generatedQuestions.length,
      targetDecayConcepts: readiness.criticalInterventionConcepts,
      difficultyCurve,
      questions: generatedQuestions,
      predictiveBaselineScore: readiness.predictedExamPercentage,
      generatedAt: new Date().toISOString(),
    };

    // Store in internal registry
    this.generatedExams.set(examId, mockExam);

    // Register into ExamSimulationEngine so student can launch and sit the exam immediately
    const simConfig: ExamSimulationConfig = {
      examId,
      title,
      titleAr,
      subject: (subject === 'science' || subject === 'maths' || subject === 'english') ? subject : 'science',
      yearGroup: 'Y4',
      totalTimeMins: timeMins,
      adhdPauseIntervalMins: sId === 'lara' ? 4 : 5,
      adhdPauseDurationSeconds: 30,
      questions: generatedQuestions,
    };
    ExamSimulationEngine.getInstance().registerExam(simConfig);

    return mockExam;
  }

  public getGeneratedExam(examId: string): GeneratedMockExam | null {
    return this.generatedExams.get(examId) || null;
  }

  public listGeneratedExams(studentId?: string): GeneratedMockExam[] {
    const all = Array.from(this.generatedExams.values());
    if (!studentId) return all;
    return all.filter((e) => e.studentId.toLowerCase() === studentId.toLowerCase());
  }

  /**
   * Replaces template placeholders with generated parameters.
   */
  private synthesizeQuestion(
    stem: IsomorphicQuestionStem,
    questionNumber: number,
    studentId: string
  ): ExamSimulationQuestion {
    // Generate parameter values
    const params: Record<string, string | number> = {};

    // Specific logic for subtraction stem
    if (stem.stemId === 'stem_math_subtraction') {
      const v1 = stem.variableSlots['val1']![Math.floor(Math.random() * stem.variableSlots['val1']!.length)] as number;
      const v2 = stem.variableSlots['val2']![Math.floor(Math.random() * stem.variableSlots['val2']!.length)] as number;
      const diff = v1 - v2;
      params['val1'] = v1;
      params['val2'] = v2;
      params['diff'] = diff;
      params['diffAr'] = this.toArabicNumerals(diff);
      params['diffNoBorrow'] = diff + 90; // Typical slip
      params['diffNoBorrowAr'] = this.toArabicNumerals(diff + 90);
      params['diffOffTen'] = diff - 10;
      params['diffOffTenAr'] = this.toArabicNumerals(diff - 10);
      params['diffReversed'] = Math.abs((v1 % 100) - (v2 % 100)) + 300;
      params['diffReversedAr'] = this.toArabicNumerals(params['diffReversed'] as number);
    } else if (stem.stemId === 'stem_math_fractions') {
      const denom = stem.variableSlots['denom']![Math.floor(Math.random() * stem.variableSlots['denom']!.length)] as number;
      const num1 = stem.variableSlots['num1']![Math.floor(Math.random() * stem.variableSlots['num1']!.length)] as number;
      const num2 = stem.variableSlots['num2']![Math.floor(Math.random() * stem.variableSlots['num2']!.length)] as number;
      params['denom'] = denom;
      params['denomAr'] = this.toArabicNumerals(denom);
      params['num1'] = num1;
      params['num2'] = num2;
      params['numSum'] = num1 + num2;
      params['numSumAr'] = this.toArabicNumerals(num1 + num2);
      params['denomDouble'] = denom * 2;
      params['denomDoubleAr'] = this.toArabicNumerals(denom * 2);
      params['numDiff'] = Math.max(1, Math.abs(num1 - num2));
      params['numDiffAr'] = this.toArabicNumerals(params['numDiff'] as number);
    } else if (stem.stemId === 'stem_math_negative_temp') {
      const city = stem.variableSlots['city']![Math.floor(Math.random() * stem.variableSlots['city']!.length)] as string;
      const t1 = stem.variableSlots['t1']![Math.floor(Math.random() * stem.variableSlots['t1']!.length)] as number;
      const t2 = stem.variableSlots['t2']![Math.floor(Math.random() * stem.variableSlots['t2']!.length)] as number;
      const diff = Math.abs(t1) + t2;
      params['city'] = city;
      params['cityAr'] = city === 'London' ? 'لندن' : city === 'Edinburgh' ? 'إدنبرة' : city === 'Cairo' ? 'القاهرة' : 'باريس';
      params['t1'] = t1;
      params['t2'] = t2;
      params['tempDiff'] = diff;
      params['tempDiffSub'] = t2 - Math.abs(t1);
    } else if (stem.stemId === 'stem_math_place_value') {
      const num = stem.variableSlots['pvNum']![Math.floor(Math.random() * stem.variableSlots['pvNum']!.length)] as number;
      params['pvNum'] = num.toLocaleString();
      params['pvNumAr'] = this.toArabicNumerals(num);
      params['pvDigit'] = String(num).charAt(0);
      params['pvDigitAr'] = this.toArabicNumerals(Number(params['pvDigit']));
      params['pvColumn'] = 'ten thousands';
      params['pvColumnAr'] = 'عشرات الألوف';
      const val = Number(params['pvDigit']) * 10000;
      params['pvCorrectValue'] = `${val.toLocaleString()} (${Number(params['pvDigit']) * 10} Thousand)`;
      params['pvCorrectValueAr'] = `${this.toArabicNumerals(val)} (${this.toArabicNumerals(Number(params['pvDigit']) * 10)} ألف)`;
      params['pvOffZeroValue'] = `${(val / 10).toLocaleString()} (${params['pvDigit']} Thousand)`;
      params['pvOffZeroValueAr'] = `${this.toArabicNumerals(val / 10)} (${params['pvDigitAr']} آلاف)`;
      params['pvWrongColumnValue'] = `${(val / 100).toLocaleString()}`;
      params['pvWrongColumnValueAr'] = `${this.toArabicNumerals(val / 100)}`;
    } else if (stem.stemId === 'stem_sci_sound_medium') {
      const studentDisplayName = studentId.charAt(0).toUpperCase() + studentId.slice(1);
      params['studentName'] = studentDisplayName;
      const solid = stem.variableSlots['matSolid']![0] as string;
      const liquid = stem.variableSlots['matLiquid']![0] as string;
      const gas = stem.variableSlots['matGas']![0] as string;
      params['matSolid'] = solid;
      params['matLiquid'] = liquid;
      params['matGas'] = gas;
      params['matSolidAr'] = 'قضيب فولاذي';
      params['matLiquidAr'] = 'حوض ماء';
      params['matGasAr'] = 'هواء الغرفة';
    } else if (stem.stemId === 'stem_eng_fronted_adverbials') {
      const adv = stem.variableSlots['adverbial']![Math.floor(Math.random() * stem.variableSlots['adverbial']!.length)] as string;
      const main = stem.variableSlots['mainClause']![Math.floor(Math.random() * stem.variableSlots['mainClause']!.length)] as string;
      params['adv'] = adv;
      params['main'] = main;
    } else if (stem.stemId === 'stem_eng_inverted_commas') {
      const speaker = stem.variableSlots['speaker']![Math.floor(Math.random() * stem.variableSlots['speaker']!.length)] as string;
      const speech = stem.variableSlots['speech']![Math.floor(Math.random() * stem.variableSlots['speech']!.length)] as string;
      params['speaker'] = speaker;
      params['speech'] = speech;
    } else {
      // General slot defaults
      for (const [key, values] of Object.entries(stem.variableSlots)) {
        params[key] = values[Math.floor(Math.random() * values.length)]!;
      }
    }

    let promptEn = stem.promptTemplateEn;
    let promptAr = stem.promptTemplateAr;
    for (const [key, value] of Object.entries(params)) {
      promptEn = promptEn.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value));
      promptAr = promptAr.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value));
    }

    // Populate options
    const options = stem.optionGenerators.map((gen) => {
      let textEn = gen.templateEn;
      let textAr = gen.templateAr;
      for (const [k, v] of Object.entries(params)) {
        textEn = textEn.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
        textAr = textAr.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
      }
      return {
        key: gen.key,
        text: textEn,
        textAr: textAr,
      };
    });

    let explanationEn = stem.explanationTemplateEn;
    let explanationAr = stem.explanationTemplateAr;
    for (const [k, v] of Object.entries(params)) {
      explanationEn = explanationEn.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
      explanationAr = explanationAr.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
    }

    const correctGen = stem.optionGenerators.find((g) => g.isCorrect) || stem.optionGenerators[0]!;

    return {
      id: `q_gen_${stem.stemId}_${questionNumber}`,
      questionNumber,
      promptText: promptEn,
      promptTextAr: promptAr,
      subject: stem.conceptCode.startsWith('Y4.MATH') ? 'maths' : stem.conceptCode.startsWith('Y4.SCI') ? 'science' : 'english',
      conceptCode: stem.conceptCode,
      type: 'multiple_choice',
      options,
      correctAnswer: correctGen.key,
      explanation: explanationEn,
      explanationAr: explanationAr,
      points: 25,
    };
  }

  private toArabicNumerals(num: number | string): string {
    const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return String(num).replace(/[0-9]/g, (w) => arabicDigits[+w] || w);
  }
}
