import { describe, it, expect } from 'vitest';
import { PeerTeachingEngine } from '../src/socratic/PeerTeachingEngine.js';

describe('Wave 25: Sibling Cross-Teaching Collaboration Mode', () => {
  const engine = new PeerTeachingEngine();

  it('generates reciprocal sibling pairing between Lara and Maya', () => {
    const pairing = engine.generatePairing('lara', 'maya', new Date('2026-10-28T12:00:00Z'));

    expect(pairing.sessionId).toContain('peer_sess_2026-10-28_lara_maya');
    expect(pairing.activeCardsCount).toBe(2);
    expect(pairing.primaryPairing.scienceLead.tutorStudentName).toBe('Lara');
    expect(pairing.primaryPairing.scienceLead.learnerStudentName).toBe('Maya');
    expect(pairing.primaryPairing.scienceLead.subject).toBe('science');

    expect(pairing.primaryPairing.mathsLead.tutorStudentName).toBe('Maya');
    expect(pairing.primaryPairing.mathsLead.learnerStudentName).toBe('Lara');
    expect(pairing.primaryPairing.mathsLead.subject).toBe('maths');
  });

  it('scaffolds bilingual Socratic discovery rubrics with English and Arabic', () => {
    const card = engine.generateDialogueCard('lara', 'maya', 'science');

    expect(card.hookPrompt.en).toContain('outer space');
    expect(card.hookPrompt.ar).toContain('الفضاء الخارجي');

    expect(card.guidedAnalogy.en).toContain('dominoes');
    expect(card.guidedAnalogy.ar).toContain('الدومينو');

    expect(card.socraticDiscoveryPrompt.en).toContain('wooden desk');
    expect(card.socraticDiscoveryPrompt.ar).toContain('الطاولة الخشبية');

    expect(card.verificationCheck.en).toContain('vacuum');
    expect(card.verificationCheck.ar).toContain('الفراغ');
  });

  it('enforces ADHD-friendly micro-sprint durations of 8 minutes', () => {
    const scienceCard = engine.generateDialogueCard('lara', 'maya', 'science');
    const mathsCard = engine.generateDialogueCard('maya', 'lara', 'maths');

    expect(scienceCard.recommendedDurationMins).toBeLessThanOrEqual(8);
    expect(mathsCard.recommendedDurationMins).toBe(8);
  });

  it('evaluates peer dialogue responses and awards confidence gains', () => {
    const scienceCard = engine.generateDialogueCard('lara', 'maya', 'science');
    
    // Successful peer interaction mentioning vacuum / particles
    const resultSuccess = engine.evaluatePeerInteraction(
      scienceCard.id,
      'Sound travels as vibrations through particles',
      'Because sound cannot travel in a vacuum where there are no particles!'
    );
    expect(resultSuccess.success).toBe(true);
    expect(resultSuccess.confidenceGain).toBe(15);
    expect(resultSuccess.feedback.en).toContain('grasped that sound is a mechanical wave');
    expect(resultSuccess.feedback.ar).toContain('موجة ميكانيكية');

    // Missing key concept interaction
    const resultIncomplete = engine.evaluatePeerInteraction(
      scienceCard.id,
      'Tell me why sound travels',
      'I think it is very loud'
    );
    expect(resultIncomplete.success).toBe(false);
    expect(resultIncomplete.confidenceGain).toBe(5);
    expect(resultIncomplete.feedback.en).toContain('Prompt Maya once more');
  });
});
