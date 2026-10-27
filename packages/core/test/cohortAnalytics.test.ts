import { describe, it, expect } from 'vitest';
import { MultiSubjectCurriculumService } from '../src/curriculum/MultiSubjectCurriculumService.js';
import { CohortAnalyticsEngine } from '../src/curriculum/CohortAnalyticsEngine.js';
import type { Student, Assessment } from '@hex-aim/types';

describe('Wave 17: Multi-Subject Expansion & Cohort Analytics Heatmaps', () => {
  const curriculum = MultiSubjectCurriculumService.getInstance();
  const analytics = CohortAnalyticsEngine.getInstance();

  it('serves multi-subject British curriculum concepts across KS2 Year 4', () => {
    const science = curriculum.getConceptsBySubject('science', 'Y4');
    expect(science.length).toBeGreaterThanOrEqual(2);
    expect(science[0]?.strand).toBe('Living Things & Their Habitats');

    const maths = curriculum.getConceptsBySubject('maths', 'Y4');
    expect(maths.length).toBeGreaterThanOrEqual(2);
    expect(maths[0]?.code).toBe('ASTEN.Y4.MATH.PLACE_VALUE.1');

    const english = curriculum.getConceptsBySubject('english', 'Y4');
    expect(english[0]?.title).toContain('Fronted Adverbials');

    const arabic = curriculum.getConceptsBySubject('arabic', 'Y4');
    expect(arabic[0]?.title).toContain('Attached Pronoun Clitics');

    const humanities = curriculum.getConceptsBySubject('humanities', 'Y4');
    expect(humanities[0]?.title).toContain('Ancient Egypt');
  });

  it('generates 2D Class Mastery Heatmap and identifies critical intervention clusters', () => {
    const mockStudents: Student[] = [
      { id: 'lara', name: 'Lara', schoolId: 'asten', yearGroup: 'Y4', curriculumTrack: 'british' },
      { id: 'maya', name: 'Maya', schoolId: 'asten', yearGroup: 'Y4', curriculumTrack: 'british' },
      { id: 'youssef', name: 'Youssef', schoolId: 'asten', yearGroup: 'Y4', curriculumTrack: 'british' },
    ];

    const mockAssessments: Assessment[] = [
      {
        id: 'ass_lara_1',
        studentId: 'lara',
        subjectId: 'science',
        termWeek: 8,
        date: new Date().toISOString(),
        rawScore: 8,
        totalScore: 10,
        percentage: 80,
        sourceImageUrls: [],
        items: [
          { qNum: 'Q1', conceptCode: 'ASTEN.Y4.SCI.VERTEBRATES.1', studentAnswer: 'Backbone', correctAnswer: 'Backbone', status: 'pass' },
          { qNum: 'Q2', conceptCode: 'ASTEN.Y4.SCI.STATES_OF_MATTER.2', studentAnswer: 'Gas', correctAnswer: 'Liquid', status: 'fail' },
        ],
      },
      {
        id: 'ass_maya_1',
        studentId: 'maya',
        subjectId: 'science',
        termWeek: 8,
        date: new Date().toISOString(),
        rawScore: 10,
        totalScore: 10,
        percentage: 100,
        sourceImageUrls: [],
        items: [
          { qNum: 'Q1', conceptCode: 'ASTEN.Y4.SCI.VERTEBRATES.1', studentAnswer: 'Backbone', correctAnswer: 'Backbone', status: 'pass' },
          { qNum: 'Q2', conceptCode: 'ASTEN.Y4.SCI.STATES_OF_MATTER.2', studentAnswer: 'Liquid', correctAnswer: 'Liquid', status: 'pass' },
        ],
      },
      {
        id: 'ass_youssef_1',
        studentId: 'youssef',
        subjectId: 'science',
        termWeek: 8,
        date: new Date().toISOString(),
        rawScore: 4,
        totalScore: 10,
        percentage: 40,
        sourceImageUrls: [],
        items: [
          { qNum: 'Q1', conceptCode: 'ASTEN.Y4.SCI.VERTEBRATES.1', studentAnswer: 'No', correctAnswer: 'Backbone', status: 'fail' },
          { qNum: 'Q2', conceptCode: 'ASTEN.Y4.SCI.STATES_OF_MATTER.2', studentAnswer: 'Solid', correctAnswer: 'Liquid', status: 'fail' },
        ],
      },
    ];

    const heatmap = analytics.generateClassHeatmap(
      'class_4a',
      'Y4',
      'science',
      mockStudents,
      mockAssessments
    );

    expect(heatmap.totalStudents).toBe(3);
    expect(heatmap.matrix.length).toBe(6); // 3 students * 2 science concepts

    // Check critical intervention clusters
    expect(heatmap.criticalInterventionClusters).toBeDefined();
    // Youssef is critical gap in states of matter (<60%) and Lara is 60%
    const statesCluster = heatmap.criticalInterventionClusters.find(c => c.conceptCode === 'ASTEN.Y4.SCI.STATES_OF_MATTER.2');
    expect(statesCluster).toBeDefined();
    expect(statesCluster?.studentNames).toContain('Youssef');
  });
});
