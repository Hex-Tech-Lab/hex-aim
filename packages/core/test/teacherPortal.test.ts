import { describe, it, expect } from 'vitest';
import { TeacherPortalEngine } from '../src/institutional/TeacherPortalEngine.js';

describe('Wave 27: Teacher Institutional Analytics Portal', () => {
  const engine = new TeacherPortalEngine();

  it('aggregates macro cohort metrics for Asten College Year 4', () => {
    const metrics = engine.getCohortMetrics('asten-college', 'Y4');

    expect(metrics.schoolName).toContain('Asten College');
    expect(metrics.yearGroup).toBe('Y4');
    expect(metrics.totalStudents).toBe(5);
    expect(metrics.accommodatedStudentsCount).toBe(2); // Lara and Youssef
    expect(metrics.cohortAverageMastery).toBeGreaterThanOrEqual(80);
    expect(metrics.subjectPerformance.science).toBeDefined();
    expect(metrics.subjectPerformance.maths).toBeDefined();
  });

  it('generates multi-concept diagnostic heatmap with at-risk students', () => {
    const metrics = engine.getCohortMetrics('asten-college', 'Y4');
    const soundConcept = metrics.conceptHeatmap.find((c) => c.conceptCode === 'Y4.SCI.SND.MEDIUM');

    expect(soundConcept).toBeDefined();
    expect(soundConcept?.status).toBe('critical_gap');
    expect(soundConcept?.masteryPercentage).toBe(68);
    expect(soundConcept?.studentsAtRisk).toContain('Lara');

    const particlesConcept = metrics.conceptHeatmap.find((c) => c.conceptCode === 'Y4.SCI.MAT.PARTICLES');
    expect(particlesConcept?.status).toBe('mastered');
  });

  it('exports formatted CSV roster for school MIS ingestion', () => {
    const csv = engine.exportCohortCsv('asten-college', 'Y4');

    expect(csv).toContain('Student ID,Student Name,Year Group');
    expect(csv).toContain('"Lara"');
    expect(csv).toContain('YES'); // Lara needs sensory scaffold
    expect(csv).toContain('"Maya"');
    expect(csv).toContain('NO'); // Maya does not need sensory scaffold
  });

  it('records teacher observation notes with ISO timestamps', () => {
    const result = engine.recordTeacherObservation(
      'asten-college',
      'lara',
      'Y4.SCI.SND.MEDIUM',
      'Lara responded very positively to the domino particle analogy.'
    );

    expect(result.recorded).toBe(true);
    expect(result.timestamp).toBeDefined();
    expect(engine.getObservationsCount()).toBeGreaterThan(0);
  });
});
