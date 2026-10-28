import { describe, it, expect } from 'vitest';
import { ExamSimulationEngine } from '../src/simulation/ExamSimulationEngine.js';

describe('Wave 26: Adaptive Exam Simulation Engine', () => {
  const engine = new ExamSimulationEngine();

  it('retrieves seeded mock exams for Year 4 Science and Maths', () => {
    const sciExam = engine.getExam('exam_y4_sci_term1');
    expect(sciExam).not.toBeNull();
    expect(sciExam?.subject).toBe('science');
    expect(sciExam?.yearGroup).toBe('Y4');
    expect(sciExam?.totalTimeMins).toBe(15);
    expect(sciExam?.adhdPauseIntervalMins).toBe(5);
    expect(sciExam?.questions.length).toBe(4);
    expect(sciExam?.questions[0].promptTextAr).toBeDefined();

    const mathExam = engine.getExam('exam_y4_math_term1');
    expect(mathExam).not.toBeNull();
    expect(mathExam?.subject).toBe('maths');
  });

  it('grades complete exam with 100% score and positive concept deltas', () => {
    const answers = {
      q_sci_01: 'A',
      q_sci_02: 'B',
      q_sci_03: 'A',
      q_sci_04: 'A',
    };

    const result = engine.gradeExam('exam_y4_sci_term1', 'lara', answers, 420, 2);

    expect(result.score).toBe(100);
    expect(result.totalPoints).toBe(100);
    expect(result.percentage).toBe(100);
    expect(result.passed).toBe(true);
    expect(result.adhdPausesTaken).toBe(2);
    expect(result.conceptMasteryDeltas['Y4.SCI.SND.MEDIUM']).toBe(5);
    expect(result.feedback.en).toContain('Superb performance');
    expect(result.feedback.ar).toContain('أداء رائع');
  });

  it('grades mixed answers and assigns negative deltas for incorrect concepts', () => {
    const answers = {
      q_math_01: 'A', // Correct (318)
      q_math_02: 'B', // Incorrect (5/16)
      q_math_03: 'A', // Correct (-5C)
      q_math_04: 'B', // Incorrect (10)
    };

    const result = engine.gradeExam('exam_y4_math_term1', 'maya', answers, 540, 1);

    expect(result.score).toBe(50);
    expect(result.percentage).toBe(50);
    expect(result.passed).toBe(false);
    expect(result.conceptMasteryDeltas['Y4.MATH.COL.SUBTRACT']).toBe(5);
    expect(result.conceptMasteryDeltas['Y4.MATH.FRACTION.ADD']).toBe(-3);
    expect(result.feedback.en).toContain('Valuable practice');
    expect(result.feedback.ar).toContain('محاولة تدريبية');
  });

  it('lists exams filtered by subject', () => {
    const scienceOnly = engine.listExams('science');
    expect(scienceOnly.length).toBe(1);
    expect(scienceOnly[0].subject).toBe('science');

    const all = engine.listExams();
    expect(all.length).toBeGreaterThanOrEqual(2);
  });
});
