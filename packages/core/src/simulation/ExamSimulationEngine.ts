import type {
  ExamSimulationConfig,
  ExamSimulationQuestion,
  ExamSubmissionResult,
} from '@hex-aim/types';

/**
 * Wave 26: Adaptive Exam Simulation Engine
 *
 * Provides a high-fidelity Year 4 mock exam simulation environment with:
 * - Sensory-friendly visual countdown timer.
 * - ADHD "Pause & Breathe" interval pacing to prevent cognitive overload.
 * - Automatic grading, concept delta recalculation, and bilingual feedback.
 */
export class ExamSimulationEngine {
  private static instance: ExamSimulationEngine | null = null;
  private exams: Map<string, ExamSimulationConfig> = new Map();

  public constructor() {
    this.seedExams();
  }

  public static getInstance(): ExamSimulationEngine {
    if (!this.instance) {
      this.instance = new ExamSimulationEngine();
    }
    return this.instance;
  }

  public getExam(examId: string): ExamSimulationConfig | null {
    return this.exams.get(examId) || null;
  }

  public registerExam(exam: ExamSimulationConfig): void {
    this.exams.set(exam.examId, exam);
  }

  public listExams(subject?: string): ExamSimulationConfig[] {
    const all = Array.from(this.exams.values());
    if (!subject) return all;
    return all.filter((e) => e.subject === subject);
  }

  /**
   * Automatically grades an exam submission and returns mastery deltas and feedback.
   */
  public gradeExam(
    examId: string,
    studentId: string,
    answers: Record<string, string>,
    timeSpentSeconds: number,
    adhdPausesTaken: number = 0
  ): ExamSubmissionResult {
    const exam = this.getExam(examId);
    if (!exam) {
      throw new Error(`Exam not found: ${examId}`);
    }

    let score = 0;
    let totalPoints = 0;
    const conceptMasteryDeltas: Record<string, number> = {};

    for (const q of exam.questions) {
      totalPoints += q.points;
      const studentAns = (answers[q.id] || '').trim().toLowerCase();
      const isCorrect = studentAns === q.correctAnswer.trim().toLowerCase();

      if (isCorrect) {
        score += q.points;
        conceptMasteryDeltas[q.conceptCode] = (conceptMasteryDeltas[q.conceptCode] || 0) + 5;
      } else {
        conceptMasteryDeltas[q.conceptCode] = (conceptMasteryDeltas[q.conceptCode] || 0) - 3;
      }
    }

    const percentage = totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 0;
    const passed = percentage >= 70;

    const studentName = studentId.toLowerCase() === 'maya' ? 'Maya' : 'Lara';

    const feedback = {
      en: passed
        ? `Superb performance, ${studentName}! You achieved ${percentage}% (${score}/${totalPoints}) with ${adhdPausesTaken} mindful pacing breaks.`
        : `Valuable practice, ${studentName}. You scored ${percentage}%. Let's review the questions together in your Socratic sprint!`,
      ar: passed
        ? `أداء رائع يا ${studentName}! حققتِ ${percentage}٪ (${score}/${totalPoints}) مع الاستفادة من ${adhdPausesTaken} فترات استراحة وتنفس ذهني.`
        : `محاولة تدريبية قيّمة يا ${studentName}. حصلتِ على ${percentage}٪. سنراجع معاً المفاهيم في جلسة الممارسة القادمة!`,
    };

    return {
      examId,
      studentId,
      score,
      totalPoints,
      percentage,
      timeSpentSeconds,
      adhdPausesTaken,
      passed,
      answers,
      conceptMasteryDeltas,
      feedback,
    };
  }

  private seedExams(): void {
    const sciQuestions: ExamSimulationQuestion[] = [
      {
        id: 'q_sci_01',
        questionNumber: 1,
        promptText: 'Through which of the following states of matter does sound travel the FASTEST?',
        promptTextAr: 'عبر أي من حالات المادة التالية ينتقل الصوت بأسرع ما يمكن؟',
        subject: 'science',
        conceptCode: 'Y4.SCI.SND.MEDIUM',
        type: 'multiple_choice',
        options: [
          { key: 'A', text: 'Solids (e.g., steel or wood)', textAr: 'المواد الصلبة (مثل الفولاذ أو الخشب)' },
          { key: 'B', text: 'Liquids (e.g., water)', textAr: 'السوائل (مثل الماء)' },
          { key: 'C', text: 'Gases (e.g., air)', textAr: 'الغازات (مثل الهواء)' },
          { key: 'D', text: 'Vacuum of space', textAr: 'الفراغ في الفضاء' },
        ],
        correctAnswer: 'A',
        explanation: 'Sound travels fastest in solids because particles are closely packed and transfer vibration quickly.',
        explanationAr: 'ينتقل الصوت أسرع ما يمكن في المواد الصلبة لأن الجزيئات متراصة وتنقل الاهتزازات بسرعة.',
        points: 25,
      },
      {
        id: 'q_sci_02',
        questionNumber: 2,
        promptText: 'What happens to the pitch of a sound when an elastic band is stretched tighter and plucked?',
        promptTextAr: 'ماذا يحدث لدرجة حدة الصوت عند شد شريط مطاطي بقوة أكبر ونقره؟',
        subject: 'science',
        conceptCode: 'Y4.SCI.SND.PITCH',
        type: 'multiple_choice',
        options: [
          { key: 'A', text: 'Pitch becomes lower', textAr: 'تصبح حدة الصوت أغلظ/أقل' },
          { key: 'B', text: 'Pitch becomes higher', textAr: 'تصبح حدة الصوت أعلى/أحد' },
          { key: 'C', text: 'Pitch does not change', textAr: 'لا تتغير حدة الصوت' },
          { key: 'D', text: 'Sound stops completely', textAr: 'يتوقف الصوت تماماً' },
        ],
        correctAnswer: 'B',
        explanation: 'Tighter tension causes faster vibrations, producing a higher pitch.',
        explanationAr: 'الشد الأكبر يزيد من سرعة الاهتزازات، مما ينتج صوتاً أكثر حدة.',
        points: 25,
      },
      {
        id: 'q_sci_03',
        questionNumber: 3,
        promptText: 'What property explains why ice melts into water when heated?',
        promptTextAr: 'ما الخاصية التي تفسر ذوبان الجليد إلى ماء عند تسخينه؟',
        subject: 'science',
        conceptCode: 'Y4.SCI.MAT.PARTICLES',
        type: 'multiple_choice',
        options: [
          { key: 'A', text: 'Particles gain thermal energy and break rigid structure', textAr: 'تكتسب الجزيئات طاقة حرارية وتتحرر من البنية الصلبة' },
          { key: 'B', text: 'Particles disappear completely', textAr: 'تختفي الجزيئات تماماً' },
          { key: 'C', text: 'Particles freeze into smaller pieces', textAr: 'تتجمد الجزيئات إلى قطع أصغر' },
          { key: 'D', text: 'Gravity stops pulling on particles', textAr: 'تتوقف الجاذبية عن جذب الجزيئات' },
        ],
        correctAnswer: 'A',
        explanation: 'Heating adds kinetic energy to particles, allowing them to flow as a liquid.',
        explanationAr: 'التسخين يكسب الجزيئات طاقة حركية تجعلها تتحرك بحرية كالسائل.',
        points: 25,
      },
      {
        id: 'q_sci_04',
        questionNumber: 4,
        promptText: 'Which organ produces acid and enzymes to break down food after swallowing?',
        promptTextAr: 'أي عضو يفرز الأحماض والإنزيمات لتفكيك الطعام بعد البلع؟',
        subject: 'science',
        conceptCode: 'Y4.SCI.DIGEST.PATH',
        type: 'multiple_choice',
        options: [
          { key: 'A', text: 'Stomach', textAr: 'المعدة' },
          { key: 'B', text: 'Large Intestine', textAr: 'الأمعاء الغليظة' },
          { key: 'C', text: 'Lungs', textAr: 'الرئتان' },
          { key: 'D', text: 'Oesophagus', textAr: 'المريء' },
        ],
        correctAnswer: 'A',
        explanation: 'The stomach churns food and secretes hydrochloric acid and digestive enzymes.',
        explanationAr: 'المعدة تمزج الطعام وتفرز حمض الهيدروكلوريك والإنزيمات الهاضمة.',
        points: 25,
      },
    ];

    const mathQuestions: ExamSimulationQuestion[] = [
      {
        id: 'q_math_01',
        questionNumber: 1,
        promptText: 'Calculate: 504 - 186 = ?',
        promptTextAr: 'احسبي: ٥٠٤ - ١٨٦ = ؟',
        subject: 'maths',
        conceptCode: 'Y4.MATH.COL.SUBTRACT',
        type: 'multiple_choice',
        options: [
          { key: 'A', text: '318', textAr: '٣١٨' },
          { key: 'B', text: '328', textAr: '٣٢٨' },
          { key: 'C', text: '418', textAr: '٤١٨' },
          { key: 'D', text: '398', textAr: '٣٩٨' },
        ],
        correctAnswer: 'A',
        explanation: 'Exchange from hundreds: 504 -> 4 hundreds, 9 tens, 14 ones. 14 - 6 = 8, 9 - 8 = 1, 4 - 1 = 3 -> 318.',
        explanationAr: 'الاستبدال من المئات: ٥٠٤ تصبح ٤ مئات، ٩ عشرات، ١٤ آحاد. ١٤ - ٦ = ٨، ٩ - ٨ = ١، ٤ - ١ = ٣ -> ٣١٨.',
        points: 25,
      },
      {
        id: 'q_math_02',
        questionNumber: 2,
        promptText: 'What is 3/8 + 2/8?',
        promptTextAr: 'ما ناتج جمع ٣/٨ + ٢/٨؟',
        subject: 'maths',
        conceptCode: 'Y4.MATH.FRACTION.ADD',
        type: 'multiple_choice',
        options: [
          { key: 'A', text: '5/8', textAr: '٥/٨' },
          { key: 'B', text: '5/16', textAr: '٥/١٦' },
          { key: 'C', text: '1/8', textAr: '١/٨' },
          { key: 'D', text: '6/8', textAr: '٦/٨' },
        ],
        correctAnswer: 'A',
        explanation: 'When denominators are the same, add only the numerators: 3 + 2 = 5, so 5/8.',
        explanationAr: 'عندما يتطابق المقام، نجمع البسوط فقط: ٣ + ٢ = ٥، فتصبح ٥/٨.',
        points: 25,
      },
      {
        id: 'q_math_03',
        questionNumber: 3,
        promptText: 'Which temperature is the COLDEST?',
        promptTextAr: 'أي درجات الحرارة التالية هي الأكثر برودة؟',
        subject: 'maths',
        conceptCode: 'Y4.MATH.NPV.NEGATIVE_NUMBERS',
        type: 'multiple_choice',
        options: [
          { key: 'A', text: '-5°C', textAr: '-٥°م' },
          { key: 'B', text: '-2°C', textAr: '-٢°م' },
          { key: 'C', text: '0°C', textAr: '٠°م' },
          { key: 'D', text: '3°C', textAr: '٣°م' },
        ],
        correctAnswer: 'A',
        explanation: 'On a number line, -5 is further to the left of 0 than -2, making it colder.',
        explanationAr: 'على خط الأعداد، الرقم -٥ يقع إلى اليسار أبعد من -٢، فهو الأكثر برودة.',
        points: 25,
      },
      {
        id: 'q_math_04',
        questionNumber: 4,
        promptText: 'In the number 24,106, what is the value of the digit 1?',
        promptTextAr: 'في الرقم ٢٤,١٠٦، ما هي القيمة المكانية للرقم ١؟',
        subject: 'maths',
        conceptCode: 'Y4.MATH.NPV.EMPTY_COLUMNS',
        type: 'multiple_choice',
        options: [
          { key: 'A', text: '100 (One Hundred)', textAr: '١٠٠ (مائة)' },
          { key: 'B', text: '10 (Ten)', textAr: '١٠ (عشرة)' },
          { key: 'C', text: '1,000 (One Thousand)', textAr: '١,٠٠٠ (ألف)' },
          { key: 'D', text: '1 (One)', textAr: '١ (واحد)' },
        ],
        correctAnswer: 'A',
        explanation: 'The digit 1 is in the hundreds position: 24,106.',
        explanationAr: 'الرقم ١ يقع في خانة المئات: ٢٤,١٠٦.',
        points: 25,
      },
    ];

    this.exams.set('exam_y4_sci_term1', {
      examId: 'exam_y4_sci_term1',
      title: 'Year 4 Science Assessment: Sound & States of Matter',
      titleAr: 'اختبار العلوم للصف الرابع: الصوت وحالات المادة',
      subject: 'science',
      yearGroup: 'Y4',
      totalTimeMins: 15,
      adhdPauseIntervalMins: 5,
      adhdPauseDurationSeconds: 30,
      questions: sciQuestions,
    });

    this.exams.set('exam_y4_math_term1', {
      examId: 'exam_y4_math_term1',
      title: 'Year 4 Maths Assessment: Arithmetic & Place Value',
      titleAr: 'اختبار الرياضيات للصف الرابع: الحساب والقيمة المكانية',
      subject: 'maths',
      yearGroup: 'Y4',
      totalTimeMins: 15,
      adhdPauseIntervalMins: 5,
      adhdPauseDurationSeconds: 30,
      questions: mathQuestions,
    });
  }
}
