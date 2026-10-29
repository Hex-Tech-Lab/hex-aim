import { describe, it, expect } from 'vitest';
import { GenerativeMockEngine } from '../src/simulation/GenerativeMockEngine.js';
import { ExamSimulationEngine } from '../src/simulation/ExamSimulationEngine.js';

describe('Wave 31: GenerativeMockEngine', () => {
  const engine = GenerativeMockEngine.getInstance();
  const simEngine = ExamSimulationEngine.getInstance();

  it('predicts exam readiness score with cognitive decay and confidence interval', () => {
    const laraMaths = engine.predictReadiness('lara', 'maths', 'gl_assessment');
    expect(laraMaths.studentId).toBe('lara');
    expect(laraMaths.predictedExamPercentage).toBeGreaterThanOrEqual(70);
    expect(laraMaths.predictedExamPercentage).toBeLessThanOrEqual(95);
    expect(laraMaths.confidenceInterval[0]).toBeLessThan(laraMaths.predictedExamPercentage);
    expect(laraMaths.confidenceInterval[1]).toBeGreaterThan(laraMaths.predictedExamPercentage);
    expect(laraMaths.anxietyRiskIndex).toBe('moderate_rush_risk');
    expect(laraMaths.recommendedPacingMins).toBe(18);
    expect(laraMaths.criticalInterventionConcepts.length).toBeGreaterThan(0);

    const mayaScience = engine.predictReadiness('maya', 'science', 'cambridge_primary');
    expect(mayaScience.studentId).toBe('maya');
    expect(mayaScience.predictedExamPercentage).toBeGreaterThanOrEqual(90);
    expect(mayaScience.anxietyRiskIndex).toBe('optimal_flow');
    expect(mayaScience.recommendedPacingMins).toBe(15);
  });

  it('generates an isomorphic mock exam along graduated anxiety curve', () => {
    const mock = engine.generateMockExam({
      studentId: 'lara',
      subject: 'maths',
      examBoardSpec: 'gl_assessment',
      targetQuestionCount: 4,
    });

    expect(mock.examId).toContain('mock_lara_maths');
    expect(mock.questions.length).toBe(4);
    expect(mock.difficultyCurve[0]).toBe('warmup_recall');
    expect(mock.difficultyCurve).toContain('targeted_challenge');
    expect(mock.totalPoints).toBe(100);

    for (const q of mock.questions) {
      expect(q.promptText.length).toBeGreaterThan(5);
      expect(q.promptTextAr.length).toBeGreaterThan(5);
      expect(q.options.length).toBe(4);
      expect(['A', 'B', 'C', 'D']).toContain(q.correctAnswer);
      expect(q.explanation.length).toBeGreaterThan(10);
      expect(q.explanationAr.length).toBeGreaterThan(10);
    }
  });

  it('automatically registers the generated mock in ExamSimulationEngine for immediate sitting', () => {
    const mock = engine.generateMockExam({
      studentId: 'maya',
      subject: 'science',
      examBoardSpec: 'cambridge_primary',
      targetQuestionCount: 3,
    });

    const registered = simEngine.getExam(mock.examId);
    expect(registered).not.toBeNull();
    expect(registered?.examId).toBe(mock.examId);
    expect(registered?.questions.length).toBe(3);

    // End-to-end test: sit and grade the generated exam
    const submission = simEngine.gradeExam(
      mock.examId,
      'maya',
      {
        [mock.questions[0]!.id]: mock.questions[0]!.correctAnswer,
        [mock.questions[1]!.id]: mock.questions[1]!.correctAnswer,
        [mock.questions[2]!.id]: mock.questions[2]!.correctAnswer,
      },
      320,
      1
    );

    expect(submission.passed).toBe(true);
    expect(submission.percentage).toBe(100);
    expect(submission.adhdPausesTaken).toBe(1);
    expect(submission.feedback.en).toContain('Maya');
  });

  it('allows retrieval and filtering of generated exams by student', () => {
    const laraExams = engine.listGeneratedExams('lara');
    expect(laraExams.length).toBeGreaterThanOrEqual(1);
    expect(laraExams.every((e) => e.studentId === 'lara')).toBe(true);

    const first = laraExams[0]!;
    const fetched = engine.getGeneratedExam(first.examId);
    expect(fetched?.examId).toBe(first.examId);
  });
});
