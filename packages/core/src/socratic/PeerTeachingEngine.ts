import type {
  PeerTeachingDialogueCard,
  SiblingCollaborationPairing,
} from '@hex-aim/types';
import { CognitiveDecayEngine } from '../decay/CognitiveDecayEngine.js';

/**
 * Wave 25: Sibling Cross-Teaching Collaboration Mode
 *
 * Implements peer-to-peer Socratic dialogue orchestration between siblings.
 * Leverages complementary cognitive profiles (e.g. Lara's conceptual clarity
 * in physical science paired with Maya's number-sense precision in arithmetic),
 * fostering metacognitive consolidation through teaching.
 */
export class PeerTeachingEngine {
  private static instance: PeerTeachingEngine | null = null;
  protected decayEngine: CognitiveDecayEngine;

  public constructor(decayEngine?: CognitiveDecayEngine) {
    this.decayEngine = decayEngine || CognitiveDecayEngine.getInstance();
  }

  public getDecayEngine(): CognitiveDecayEngine {
    return this.decayEngine;
  }

  public static getInstance(): PeerTeachingEngine {
    if (!this.instance) {
      this.instance = new PeerTeachingEngine();
    }
    return this.instance;
  }

  /**
   * Generates a bidirectional sibling pairing card set for Lara and Maya.
   */
  public generatePairing(
    studentAId: string = 'lara',
    studentBId: string = 'maya',
    now: Date = new Date()
  ): SiblingCollaborationPairing {
    const scienceCard = this.generateDialogueCard(
      studentAId,
      studentBId,
      'science',
      'Y4.SCI.SND.MEDIUM',
      now
    );

    const mathsCard = this.generateDialogueCard(
      studentBId,
      studentAId,
      'maths',
      'Y4.MATH.COL.SUBTRACT',
      now
    );

    return {
      sessionId: `peer_sess_${now.toISOString().slice(0, 10)}_${studentAId}_${studentBId}`,
      createdAt: now.toISOString(),
      primaryPairing: {
        scienceLead: scienceCard,
        mathsLead: mathsCard,
      },
      collaborationRationale: {
        en: 'Reciprocal peer-teaching reinforces long-term memory: Lara consolidates physics principles through verbal instruction, while Maya solidifies procedural arithmetic by scaffolding column exchanges.',
        ar: 'التعليم التبادلي بين الأخوات يرسخ الذاكرة طويلة المدى: لارا تعزز فهمها للعلوم من خلال الشرح اللفظي، بينما مايا ترسخ العمليات الحسابية عبر التوجيه التدريجي.',
      },
      activeCardsCount: 2,
    };
  }

  /**
   * Constructs a structured Socratic dialogue card for a specific subject and concept.
   */
  public generateDialogueCard(
    tutorId: string,
    learnerId: string,
    subject: 'science' | 'maths' | 'english',
    topicCode: string = 'Y4.SCI.SND.MEDIUM',
    _now: Date = new Date()
  ): PeerTeachingDialogueCard {
    const tutorName = tutorId.toLowerCase() === 'lara' ? 'Lara' : 'Maya';
    const learnerName = learnerId.toLowerCase() === 'lara' ? 'Lara' : 'Maya';

    if (subject === 'science') {
      return {
        id: `peer_card_${tutorId}_${subject}_${topicCode.replace(/\./g, '_')}`,
        topicCode,
        topicTitle: 'Sound Wave Transmission & Particle Density in Matter',
        subject: 'science',
        tutorStudentId: tutorId,
        tutorStudentName: tutorName,
        learnerStudentId: learnerId,
        learnerStudentName: learnerName,
        tutorStrengthScore: 94,
        learnerNeedScore: 76,
        hookPrompt: {
          en: `Ask ${learnerName}: "Can an alarm clock be heard ringing in outer space where there is no air at all? Why or why not?"`,
          ar: `اسألي ${learnerName}: "هل يمكن سماع رنين المنبه في الفضاء الخارجي حيث لا يوجد هواء على الإطلاق؟ ولماذا؟"`,
        },
        guidedAnalogy: {
          en: 'Imagine falling dominoes. For the vibration wave to travel, particles must be close enough to bump into each other. If there are no particles, the wave stops immediately!',
          ar: 'تخيلي صفاً من أحجار الدومينو المتساقطة. لكي تنتقل موجة الاهتزاز، يجب أن تكون الجزيئات متقاربة لتتصادم. وإذا لم تكن هناك جزيئات، تتوقف الموجة فوراً!',
        },
        socraticDiscoveryPrompt: {
          en: `Prompt ${learnerName} to compare sound moving through a wooden desk vs through air: "Why can you hear tapping on a wooden table so loud when your ear is pressed against it?"`,
          ar: `شجعي ${learnerName} على مقارنة انتقال الصوت عبر مكتب خشبي مقارنة بالهواء: "لماذا تسمعين النقر على الطاولة الخشبية بقوة أكبر عندما تضعين أذنك ملاصقة لها؟"`,
        },
        verificationCheck: {
          en: `${learnerName} correctly explains that sound travels fastest in solids because particles are tightly packed together, and cannot travel in a vacuum.`,
          ar: `تشرح ${learnerName} بدقة أن الصوت ينتقل أسرع في المواد الصلبة لأن الجزيئات متراصة بإحكام، ولا يمكنه الانتقال في الفراغ.`,
        },
        recommendedDurationMins: tutorId.toLowerCase() === 'lara' ? 8 : 10,
      };
    } else {
      // Maths column subtraction / decomposition card
      return {
        id: `peer_card_${tutorId}_${subject}_${topicCode.replace(/\./g, '_')}`,
        topicCode,
        topicTitle: 'Column Subtraction with Empty Tens Zero Decomposition',
        subject: 'maths',
        tutorStudentId: tutorId,
        tutorStudentName: tutorName,
        learnerStudentId: learnerId,
        learnerStudentName: learnerName,
        tutorStrengthScore: 96,
        learnerNeedScore: 78,
        hookPrompt: {
          en: `Ask ${learnerName}: "If we want to calculate 503 - 247, and the ones column needs more units, but the tens column has a 0, where do we go first?"`,
          ar: `اسألي ${learnerName}: "إذا أردنا حساب ٥٠٣ - ٢٤٧، وخانة الآحاد تحتاج للمزيد، ولكن خانة العشرات صفر، إلى أين نذهب أولاً؟"`,
        },
        guidedAnalogy: {
          en: 'Think of money exchange: you cannot get ten £1 coins from an empty wallet section, so you first exchange a £100 note into ten £10 notes, then trade one £10 into ten £1 coins!',
          ar: 'تخيلي تحويل النقود: لا يمكنك أخذ عملات معدنية من محفظة خالية، لذا تبدلين أولاً ورقة فئة ١٠٠ جنيه إلى عشر ورقات فئة ١٠، ثم تبدلين ورقة واحدة منها إلى عشر عملات آحاد!',
        },
        socraticDiscoveryPrompt: {
          en: `Guide ${learnerName} with patience: "Cross out the 5 hundreds to make 4, write 10 in tens, then cross out the 10 to make 9, giving 13 to the ones column. Watch the numbers transform!"`,
          ar: `وجّهي ${learnerName} بهدوء: "اشطبي الـ ٥ مئات لتصبح ٤، واكتبي ١٠ في العشرات، ثم اشطبي الـ ١٠ لتصبح ٩ مع نقل ١ للآحاد لتصبح ١٣. شاهدي الأرقام كيف تتغير!"`,
        },
        verificationCheck: {
          en: `${learnerName} articulates the double-exchange step clearly without skipping the intermediate 9 in the tens column.`,
          ar: `توضح ${learnerName} خطوة الاستبدال المزدوج بوضوح دون نسيان الرقم ٩ الوسيط في خانة العشرات.`,
        },
        recommendedDurationMins: 8, // ADHD friendly
      };
    }
  }

  /**
   * Evaluates the peer interaction dialogue response against educational rubric markers.
   */
  public evaluatePeerInteraction(
    cardId: string,
    _tutorExplanation: string,
    learnerResponse: string
  ): {
    success: boolean;
    confidenceGain: number;
    feedback: { en: string; ar: string };
  } {
    const isScience = cardId.includes('science');
    const lowerLearner = learnerResponse.toLowerCase();

    if (isScience) {
      const mentionsMedium =
        lowerLearner.includes('vacuum') ||
        lowerLearner.includes('particle') ||
        lowerLearner.includes('air') ||
        lowerLearner.includes('solid') ||
        lowerLearner.includes('فراغ') ||
        lowerLearner.includes('جزيئات') ||
        lowerLearner.includes('هواء');

      return {
        success: mentionsMedium,
        confidenceGain: mentionsMedium ? 15 : 5,
        feedback: {
          en: mentionsMedium
            ? 'Excellent discovery! Maya correctly grasped that sound is a mechanical wave requiring matter.'
            : 'Good start. Prompt Maya once more about what happens when all air is pumped out of a bell jar.',
          ar: mentionsMedium
            ? 'اكتشاف ممتاز! أدركت مايا بنجاح أن الصوت موجة ميكانيكية تتطلب وسطاً مادياً.'
            : 'محاولة جيدة. اسألي مايا مجدداً عما يحدث عند سحب الهواء بالكامل من الإناء الزجاجي.',
        },
      };
    } else {
      const mentionsDecomposition =
        lowerLearner.includes('exchange') ||
        lowerLearner.includes('borrow') ||
        lowerLearner.includes('9') ||
        lowerLearner.includes('hundred') ||
        lowerLearner.includes('استلاف') ||
        lowerLearner.includes('تبديل') ||
        lowerLearner.includes('مئات');

      return {
        success: mentionsDecomposition,
        confidenceGain: mentionsDecomposition ? 18 : 6,
        feedback: {
          en: mentionsDecomposition
            ? 'Fantastic peer teaching! Lara mastered the zero placeholder decomposition step with your guidance.'
            : 'Encouraging attempt. Guide Lara to write out each step on paper so the intermediate 9 stays visible.',
          ar: mentionsDecomposition
            ? 'تعليم تبادلي رائع! أتقنت لارا خطوة استبدال الصفر في العشرات بتوجيهك الصبور.'
            : 'محاولة مشجعة. وجهي لارا لكتابة الخطوات على الورق لتظل الـ ٩ واضحة أمامها.',
        },
      };
    }
  }
}
