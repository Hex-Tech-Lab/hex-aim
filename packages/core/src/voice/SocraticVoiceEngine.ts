import * as crypto from 'crypto';
import type {
  SocraticVoiceSession,
  VoiceDialogueTurn,
  AudioVADConfig,
  StartVoiceSessionRequest,
} from '@hex-aim/types';

interface ConceptDialogueMetadata {
  conceptCode: string;
  conceptTitle: string;
  conceptTitleAr: string;
  subject: string;
  initialPromptEn: string;
  initialPromptAr: string;
  expectedKeywords: string[];
  misconceptions: string[];
  affirmationEn: string;
  affirmationAr: string;
  followUpPromptEn: string;
  followUpPromptAr: string;
  consolidationEn: string;
  consolidationAr: string;
}

const CANONICAL_CONCEPT_DIALOGUES: Record<string, ConceptDialogueMetadata> = {
  'Y4.SCI.SND.MEDIUM': {
    conceptCode: 'Y4.SCI.SND.MEDIUM',
    conceptTitle: 'Acoustic Transmission Through States of Matter',
    conceptTitleAr: 'انتقال الصوت عبر حالات المادة وجسيماتها',
    subject: 'science',
    initialPromptEn:
      'Hey there! Imagine you tap two stones together underwater in a swimming pool, versus tapping them in the air. In which one will the vibrations reach your ears faster?',
    initialPromptAr:
      'أهلاً يا بطل! تخيل لو خبطت حجرين في بعض تحت المية في حمام السباحة، وخبطتهم في الهوا.. تفتكر الاهتزازات وصوت الخبطة هيوصل لودنك أسرع فين؟',
    expectedKeywords: ['water', 'particles', 'closer', 'vibrate', 'solid', 'liquid', 'faster', 'together'],
    misconceptions: ['air is faster', 'air is lighter', 'water slows down sound'],
    affirmationEn:
      'Spot on! Exactly right. Because water particles are crowded much closer together than in air, they pass along the sound vibrations nearly 4 times faster.',
    affirmationAr:
      'ممتاز جداً! بالظبط كدة. لأن جسيمات المية متقاربة ومزدحمة جنب بعضها أكتر من الهوا، بتنقل اهتزازات الصوت أسرع بحوالي ٤ مرات.',
    followUpPromptEn:
      'Now, what about a solid iron railing? Are the particles even closer together than in water?',
    followUpPromptAr:
      'طب يا ترى لو حديد صلب؟ تفتكر الجسيمات بتكون أقرب لبعضها أكتر من المية كمان؟',
    consolidationEn:
      'Boom! Zero-alarm victory! You have mastered acoustic particle density. Solids transmit fastest, then liquids, then gases.',
    consolidationAr:
      'الله عليك! انتصار كامل وبلا أي قلق! أتقنت انتقال الصوت: المواد الصلبة أسرع، بعدها السوائل، وأبطأ حاجة الغازات.',
  },
  'Y4.MATH.NPV.NEGATIVE_NUMBERS': {
    conceptCode: 'Y4.MATH.NPV.NEGATIVE_NUMBERS',
    conceptTitle: 'Negative Temperature Scale & Ground Baseline',
    conceptTitleAr: 'مقياس درجات الحرارة السالبة ونقطة الصفر',
    subject: 'maths',
    initialPromptEn:
      'Welcome to the Math Elevator! If outside is minus 4 degrees, and inside the freezer is minus 1 degree, which place is colder?',
    initialPromptAr:
      'أهلاً بيك في مصعد الرياضيات! لو درجة الحرارة برة سالب ٤، وجوة الفريزر سالب ١.. تفتكر مين المكان الأبرد؟',
    expectedKeywords: ['minus 4', '-4', 'colder', 'lower', 'basement', 'zero', 'below'],
    misconceptions: ['minus 1 is colder', '-1 is colder', '1 is smaller'],
    affirmationEn:
      'Brilliant spatial reasoning! Minus 4 is deeper down into the basement below zero, so it is definitely colder.',
    affirmationAr:
      'تفكير مكاني رائع! سالب ٤ أعمق لتحت تحت الصفر في البدروم، عشان كدة هي الأبرد فعلاً.',
    followUpPromptEn:
      'If the temperature climbs up by 3 degrees from minus 4, what floor or degree do we reach?',
    followUpPromptAr:
      'لو درجة الحرارة ارتفعت ٣ درجات من سالب ٤.. هنوصل لرقم كام؟',
    consolidationEn:
      'Fantastic! Minus 1 degree! You have conquered the negative number elevator.',
    consolidationAr:
      'برافو عليك! سالب ١! أتقنت مصعد الأرقام السالبة تماماً وبكل هدوء.',
  },
  'Y4.MATH.COL.SUBTRACT': {
    conceptCode: 'Y4.MATH.COL.SUBTRACT',
    conceptTitle: 'Column Subtraction with Empty Tens Zero Regrouping',
    conceptTitleAr: 'الطرح العمودي وإعادة التجميع من الصفر',
    subject: 'maths',
    initialPromptEn:
      'Let us check column subtraction. When you need to subtract 7 from 2, but the next room is an empty zero, what does the zero do?',
    initialPromptAr:
      'تعال نراجع الطرح العمودي! لما نيجي نطرح ٧ من ٢ والخانة اللي جنبها صفر.. الصفر ده هيعمل إيه؟',
    expectedKeywords: ['hundreds', 'borrow', 'regroup', 'becomes 9', 'next door', '10'],
    misconceptions: ['subtract from zero', 'zero becomes 10 and stays 10'],
    affirmationEn:
      'Exactly right! The zero goes next door to the hundreds room, takes 1 hundred, becomes 10 tens, and then gives 1 ten away to become 9.',
    affirmationAr:
      'صح جداً وبرافو عليك! الصفر بيخبط على خانة المئات، يستلف ١ مائة ويبقى ١٠ عشرات، ويسلف جاره فيبقى ٩.',
    followUpPromptEn:
      'So what is left in the tens room after sharing? It is always 9 tens, right?',
    followUpPromptAr:
      'يعني دايماً بيتبقى كام في خانة العشرات بعد ما يسلف؟ ٩ عشرات، صح؟',
    consolidationEn:
      'High five! Column zero-decomposition mastered with zero working memory panic!',
    consolidationAr:
      'ممتاز جداً! فك الصفر في الطرح العمودي بقى ثابت في دماغك تماماً.',
  },
};

/**
 * Wave 30: Real-Time Socratic Voice Dialogue & Oral Tutoring Agent
 *
 * Implements low-friction, screen-free spoken Socratic dialogue.
 * Transforms passive reading into active vocal retrieval with bilingual support
 * (English British Curriculum + Egyptian Arabic) and strict 3-minute ADHD drill pacing.
 */
export class SocraticVoiceEngine {
  private static instance: SocraticVoiceEngine | null = null;
  private activeSessions: Map<string, SocraticVoiceSession> = new Map();

  public static getInstance(): SocraticVoiceEngine {
    if (!this.instance) {
      this.instance = new SocraticVoiceEngine();
    }
    return this.instance;
  }

  /**
   * Default Voice Activity Detection (VAD) configuration.
   */
  public getDefaultVADConfig(): AudioVADConfig {
    return {
      energyThreshold: 0.015,
      silenceTimeoutMs: 1400,
      maxSpeechDurationSecs: 30,
    };
  }

  /**
   * Evaluates audio frame energy against threshold to detect speech activity or silence.
   */
  public evaluateVAD(
    frameRms: number,
    silenceDurationMs: number,
    config: AudioVADConfig = this.getDefaultVADConfig()
  ): { isSpeaking: boolean; shouldCommitTurn: boolean } {
    const isSpeaking = frameRms >= config.energyThreshold;
    const shouldCommitTurn = !isSpeaking && silenceDurationMs >= config.silenceTimeoutMs;
    return { isSpeaking, shouldCommitTurn };
  }

  /**
   * Initializes a new spoken Socratic dialogue session.
   */
  public startSession(
    req: StartVoiceSessionRequest,
    now: Date = new Date()
  ): SocraticVoiceSession {
    const studentId = req.studentId.toLowerCase().trim();
    const conceptCode =
      req.conceptCode ||
      (studentId.includes('lara') ? 'Y4.SCI.SND.MEDIUM' : 'Y4.MATH.NPV.NEGATIVE_NUMBERS');

    const meta: ConceptDialogueMetadata =
      CANONICAL_CONCEPT_DIALOGUES[conceptCode] || CANONICAL_CONCEPT_DIALOGUES['Y4.SCI.SND.MEDIUM']!;

    const lang = req.language || (studentId.includes('lara') ? 'bilingual' : 'en');
    const sessionId = `vsession_${studentId}_${now.getTime().toString(36)}_${crypto
      .randomBytes(4)
      .toString('hex')}`;

    const maxDurationSecs = req.maxDurationSecs || 180; // 3-minute ADHD drill ceiling
    const expiresAt = new Date(now.getTime() + maxDurationSecs * 1000);

    const initialTurn: VoiceDialogueTurn = {
      turnId: `turn_${sessionId}_0`,
      turnIndex: 0,
      speaker: 'agent',
      timestamp: now.toISOString(),
      transcript: meta.initialPromptEn,
      transcriptAr: meta.initialPromptAr,
      audioPromptUrl: `/api/voice/audio/${conceptCode}_init_${lang}.mp3`,
      durationMs: 4200,
    };

    const session: SocraticVoiceSession = {
      sessionId,
      studentId,
      studentDisplayName: this.resolveStudentName(studentId),
      conceptCode: meta.conceptCode,
      conceptTitle: meta.conceptTitle,
      conceptTitleAr: meta.conceptTitleAr,
      subject: meta.subject,
      language: lang,
      state: 'agent_speaking',
      startedAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      remainingSeconds: maxDurationSecs,
      turns: [initialTurn],
      metrics: {
        totalTurns: 1,
        cumulativeMastery: 0,
        retrievalFluencyScore: 100,
        zeroAlarmConsolidation: false,
      },
      vadConfig: this.getDefaultVADConfig(),
    };

    this.activeSessions.set(sessionId, session);
    return session;
  }

  /**
   * Processes student speech transcript, evaluates mastery, and synthesizes the next Socratic turn.
   */
  public processStudentTurn(
    sessionId: string,
    transcript: string,
    audioDurationMs: number = 3500,
    now: Date = new Date()
  ): { session: SocraticVoiceSession; nextAgentTurn?: VoiceDialogueTurn } {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found or expired`);
    }

    // Check 3-minute ceiling
    const elapsedSecs = Math.floor(
      (now.getTime() - new Date(session.startedAt).getTime()) / 1000
    );
    session.remainingSeconds = Math.max(0, 180 - elapsedSecs);

    if (session.remainingSeconds <= 0) {
      session.state = 'session_completed';
      return { session };
    }

    const meta: ConceptDialogueMetadata =
      CANONICAL_CONCEPT_DIALOGUES[session.conceptCode] ||
      CANONICAL_CONCEPT_DIALOGUES['Y4.SCI.SND.MEDIUM']!;

    const cleanTranscript = (transcript || '').trim();
    const lowerTranscript = cleanTranscript.toLowerCase();

    // Keyword detection with stem matching
    const detectedKeywords: string[] = [];
    const missingKeywords: string[] = [];

    for (const kw of meta.expectedKeywords) {
      const cleanKw = kw.toLowerCase();
      const stem = cleanKw.length > 4 ? cleanKw.slice(0, -1) : cleanKw;
      if (lowerTranscript.includes(cleanKw) || lowerTranscript.includes(stem)) {
        detectedKeywords.push(kw);
      } else {
        missingKeywords.push(kw);
      }
    }

    // Misconceptions
    const detectedMisconceptions: string[] = [];
    for (const misc of meta.misconceptions) {
      if (lowerTranscript.includes(misc.toLowerCase())) {
        detectedMisconceptions.push(misc);
      }
    }

    // Compute turn score
    const hasMisconception = detectedMisconceptions.length > 0;
    const baseScore = (detectedKeywords.length / Math.max(1, meta.expectedKeywords.length)) * 100;
    let turnMastery = Math.min(100, Math.round(baseScore * 1.5));
    if (detectedKeywords.length >= 3 && !hasMisconception) {
      turnMastery = Math.max(turnMastery, 80);
    }
    if (hasMisconception) {
      turnMastery = Math.round(turnMastery * 0.6);
    }

    const studentTurn: VoiceDialogueTurn = {
      turnId: `turn_${sessionId}_${session.turns.length}`,
      turnIndex: session.turns.length,
      speaker: 'student',
      timestamp: now.toISOString(),
      transcript: cleanTranscript,
      durationMs: audioDurationMs,
      evaluation: {
        masteryPercentage: turnMastery,
        detectedKeywords,
        missingKeywords: missingKeywords.slice(0, 3),
        detectedMisconceptions,
        sensoryPraise:
          turnMastery >= 70
            ? 'Clear vocal explanation! High working-memory retrieval score.'
            : 'Good effort trying! Let us visual-anchor this together.',
      },
    };

    session.turns.push(studentTurn);

    // Update session metrics
    const studentTurns = session.turns.filter(t => t.speaker === 'student');
    const avgMastery = Math.round(
      studentTurns.reduce((acc, t) => acc + (t.evaluation?.masteryPercentage || 0), 0) /
        (studentTurns.length || 1)
    );
    session.metrics.cumulativeMastery = avgMastery;
    session.metrics.totalTurns = session.turns.length;

    // Synthesize next agent response
    const isFirstStudentTurn = studentTurns.length === 1;
    let nextAgentTurn: VoiceDialogueTurn | undefined;

    if (isFirstStudentTurn) {
      // Follow-up question or affirmation
      nextAgentTurn = {
        turnId: `turn_${sessionId}_${session.turns.length}`,
        turnIndex: session.turns.length,
        speaker: 'agent',
        timestamp: new Date(now.getTime() + 150).toISOString(),
        transcript: `${meta.affirmationEn} ${meta.followUpPromptEn}`,
        transcriptAr: `${meta.affirmationAr} ${meta.followUpPromptAr}`,
        audioPromptUrl: `/api/voice/audio/${meta.conceptCode}_followup.mp3`,
        durationMs: 4500,
      };
      session.turns.push(nextAgentTurn);
      session.state = 'agent_speaking';
    } else {
      // Final consolidation turn
      session.metrics.zeroAlarmConsolidation = avgMastery >= 75;
      nextAgentTurn = {
        turnId: `turn_${sessionId}_${session.turns.length}`,
        turnIndex: session.turns.length,
        speaker: 'agent',
        timestamp: new Date(now.getTime() + 150).toISOString(),
        transcript: meta.consolidationEn,
        transcriptAr: meta.consolidationAr,
        audioPromptUrl: `/api/voice/audio/${meta.conceptCode}_complete.mp3`,
        durationMs: 3800,
      };
      session.turns.push(nextAgentTurn);
      session.state = 'session_completed';
    }

    return { session, nextAgentTurn };
  }

  /**
   * Retrieves an active session by ID.
   */
  public getSession(sessionId: string): SocraticVoiceSession | undefined {
    return this.activeSessions.get(sessionId);
  }

  private resolveStudentName(studentId: string): string {
    const s = studentId.toLowerCase();
    if (s.includes('maya')) return 'Maya';
    if (s.includes('youssef')) return 'Youssef';
    if (s.includes('omar')) return 'Omar';
    if (s.includes('nour')) return 'Nour';
    return 'Lara';
  }
}
