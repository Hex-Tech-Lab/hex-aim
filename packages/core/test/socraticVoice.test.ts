import { describe, it, expect } from 'vitest';
import { SocraticVoiceEngine } from '../src/voice/SocraticVoiceEngine.js';

describe('Wave 30: Real-Time Socratic Voice Dialogue & Oral Tutoring Agent', () => {
  const voiceEngine = SocraticVoiceEngine.getInstance();

  it('initializes a spoken Socratic dialogue session with bilingual prompts and 3-minute ceiling', () => {
    const session = voiceEngine.startSession({
      studentId: 'lara',
      conceptCode: 'Y4.SCI.SND.MEDIUM',
      language: 'bilingual',
    });

    expect(session.sessionId).toMatch(/^vsession_lara_/);
    expect(session.studentDisplayName).toBe('Lara');
    expect(session.conceptCode).toBe('Y4.SCI.SND.MEDIUM');
    expect(session.state).toBe('agent_speaking');
    expect(session.remainingSeconds).toBe(180); // Strict 3m ADHD ceiling
    expect(session.turns.length).toBe(1);

    const initialTurn = session.turns[0];
    expect(initialTurn.speaker).toBe('agent');
    expect(initialTurn.transcript).toContain('underwater in a swimming pool');
    expect(initialTurn.transcriptAr).toContain('تحت المية في حمام السباحة');
    expect(initialTurn.audioPromptUrl).toContain('Y4.SCI.SND.MEDIUM');
  });

  it('evaluates Voice Activity Detection (VAD) energy thresholds and silence windows', () => {
    const config = voiceEngine.getDefaultVADConfig();

    // 1. Below threshold (silence/ambient room noise)
    const silentCheck = voiceEngine.evaluateVAD(0.005, 500, config);
    expect(silentCheck.isSpeaking).toBe(false);
    expect(silentCheck.shouldCommitTurn).toBe(false);

    // 2. Active vocal speech
    const speechCheck = voiceEngine.evaluateVAD(0.045, 0, config);
    expect(speechCheck.isSpeaking).toBe(true);
    expect(speechCheck.shouldCommitTurn).toBe(false);

    // 3. Post-speech silence window exceeded (1400ms) -> triggers turn commitment
    const committedCheck = voiceEngine.evaluateVAD(0.008, 1500, config);
    expect(committedCheck.isSpeaking).toBe(false);
    expect(committedCheck.shouldCommitTurn).toBe(true);
  });

  it('processes student speech response and synthesizes Socratic follow-up', () => {
    const session = voiceEngine.startSession({
      studentId: 'lara',
      conceptCode: 'Y4.SCI.SND.MEDIUM',
    });

    const studentSpeech =
      'I think sound travels faster in water because the particles are packed closer together than in air so they vibrate each other quickly.';

    const result = voiceEngine.processStudentTurn(session.sessionId, studentSpeech, 4000);

    expect(result.session.turns.length).toBe(3); // Initial agent + Student + Agent follow-up
    const studentTurn = result.session.turns[1];
    expect(studentTurn.speaker).toBe('student');
    expect(studentTurn.evaluation?.masteryPercentage).toBeGreaterThanOrEqual(70);
    expect(studentTurn.evaluation?.detectedKeywords).toContain('water');
    expect(studentTurn.evaluation?.detectedKeywords).toContain('particles');

    const followUpTurn = result.nextAgentTurn!;
    expect(followUpTurn.speaker).toBe('agent');
    expect(followUpTurn.transcript).toContain('iron railing');
    expect(followUpTurn.transcriptAr).toContain('حديد صلب');
  });

  it('completes session and confirms zero-alarm consolidation on second student turn', () => {
    const session = voiceEngine.startSession({
      studentId: 'lara',
      conceptCode: 'Y4.SCI.SND.MEDIUM',
    });

    // Turn 1
    voiceEngine.processStudentTurn(
      session.sessionId,
      'Sound travels faster in water because particles are crowded closer.',
      3500
    );

    // Turn 2
    const finalResult = voiceEngine.processStudentTurn(
      session.sessionId,
      'In a solid iron railing the particles are even closer together, so it vibrates the fastest!',
      4000
    );

    expect(finalResult.session.state).toBe('session_completed');
    expect(finalResult.session.metrics.zeroAlarmConsolidation).toBe(true);
    expect(finalResult.session.metrics.cumulativeMastery).toBeGreaterThanOrEqual(75);
    expect(finalResult.nextAgentTurn?.transcript).toContain('Zero-alarm victory');
    expect(finalResult.nextAgentTurn?.transcriptAr).toContain('انتصار كامل وبلا أي قلق');
  });

  it('gently scaffolds misconceptions without punitive zero-scores', () => {
    const session = voiceEngine.startSession({
      studentId: 'lara',
      conceptCode: 'Y4.SCI.SND.MEDIUM',
    });

    const studentMisconception = 'Air is faster because air is lighter and water slows down sound.';
    const result = voiceEngine.processStudentTurn(session.sessionId, studentMisconception);

    const studentTurn = result.session.turns[1];
    expect(studentTurn.evaluation?.detectedMisconceptions.length).toBeGreaterThan(0);
    expect(studentTurn.evaluation?.sensoryPraise).toContain('Let us visual-anchor this together');
  });

  it('respects 3-minute ceiling and completes session when timer expires', () => {
    const startTime = new Date('2026-10-29T08:00:00Z');
    const session = voiceEngine.startSession({ studentId: 'lara' }, startTime);

    // 190 seconds later (past 180s ceiling)
    const expiredTime = new Date('2026-10-29T08:03:10Z');
    const result = voiceEngine.processStudentTurn(
      session.sessionId,
      'Testing after timeout',
      2000,
      expiredTime
    );

    expect(result.session.state).toBe('session_completed');
    expect(result.session.remainingSeconds).toBe(0);
  });
});
