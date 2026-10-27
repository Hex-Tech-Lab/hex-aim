import type { SocraticOralEvaluation } from '@hex-aim/types';

export interface SocraticOralEvaluationInput {
  transcript: string;
  drillQuestion: string;
  targetConceptCode: string;
  expectedKeywords: string[];
  commonMisconceptions?: string[];
  studentName?: string;
}

export class SocraticOralEvaluator {
  private static instance: SocraticOralEvaluator | null = null;

  public static getInstance(): SocraticOralEvaluator {
    if (!this.instance) {
      this.instance = new SocraticOralEvaluator();
    }
    return this.instance;
  }

  public evaluateOralTurn(input: SocraticOralEvaluationInput): SocraticOralEvaluation {
    const rawTranscript = (input.transcript || '').trim();
    if (!rawTranscript) {
      return {
        transcript: '',
        conceptMasteryPct: 0,
        detectedKeyVocab: [],
        missingKeyVocab: input.expectedKeywords,
        misconceptions: [],
        affirmationPraise: 'I could not hear an answer clearly. Take a breath and try explaining again!',
        socraticFollowUpQuestion: input.drillQuestion,
        suggestedBloomAdjustment: 'scaffold',
      };
    }

    const lowerTranscript = rawTranscript.toLowerCase();
    const detectedKeyVocab: string[] = [];
    const missingKeyVocab: string[] = [];

    for (const kw of input.expectedKeywords) {
      const cleanKw = kw.toLowerCase().trim();
      if (lowerTranscript.includes(cleanKw)) {
        detectedKeyVocab.push(cleanKw);
      } else {
        missingKeyVocab.push(cleanKw);
      }
    }

    const detectedMisconceptions: string[] = [];
    if (input.commonMisconceptions && input.commonMisconceptions.length > 0) {
      for (const misc of input.commonMisconceptions) {
        if (lowerTranscript.includes(misc.toLowerCase().trim())) {
          detectedMisconceptions.push(misc);
        }
      }
    }

    // Score calculation
    const totalKeywords = Math.max(1, input.expectedKeywords.length);
    const vocabCoveragePct = Math.round((detectedKeyVocab.length / totalKeywords) * 100);
    const hasSubstance = rawTranscript.split(/\s+/).length >= 5;
    const penalty = detectedMisconceptions.length * 25;
    const conceptMasteryPct = Math.max(0, Math.min(100, (hasSubstance ? vocabCoveragePct : Math.min(vocabCoveragePct, 40)) - penalty));

    const name = input.studentName ? input.studentName.charAt(0).toUpperCase() + input.studentName.slice(1) : 'you';

    // Affirmation & Socratic feedback generation
    let affirmationPraise = '';
    let socraticFollowUp = '';
    let bloomAdjustment: 'maintain' | 'advance' | 'scaffold' = 'maintain';

    if (conceptMasteryPct >= 80) {
      affirmationPraise = `🌟 Brilliant work, ${name}! You clearly explained the concept and accurately used key terms like "${detectedKeyVocab.slice(0, 2).join('" and "')}".`;
      socraticFollowUp = `Let's take it a step further: Can you give an example of an organism that might trick someone, and explain why it fits into this category?`;
      bloomAdjustment = 'advance';
    } else if (conceptMasteryPct >= 50) {
      affirmationPraise = `👍 Good reasoning, ${name}! You hit important points like "${detectedKeyVocab[0] || 'the core idea'}".`;
      const missingHint = missingKeyVocab[0] ? `What role does the "${missingKeyVocab[0]}" play in this?` : 'Can you explain the difference in your own words?';
      socraticFollowUp = `To sharpen your answer: ${missingHint}`;
      bloomAdjustment = 'maintain';
    } else {
      affirmationPraise = `💡 Nice attempt, ${name}! You are thinking in the right direction.`;
      if (detectedMisconceptions.length > 0) {
        socraticFollowUp = `Careful with this common trap: remember, "${detectedMisconceptions[0]}" is often misunderstood. Let's look at whether it has a hard backbone inside or not. What do you think?`;
      } else {
        socraticFollowUp = `Let's break it down into a simple clue: Does a vertebrate have a backbone on the inside or on the outside?`;
      }
      bloomAdjustment = 'scaffold';
    }

    return {
      transcript: rawTranscript,
      conceptMasteryPct,
      detectedKeyVocab,
      missingKeyVocab,
      misconceptions: detectedMisconceptions,
      affirmationPraise,
      socraticFollowUpQuestion: socraticFollowUp,
      suggestedBloomAdjustment: bloomAdjustment,
    };
  }
}
