import type {
  CohortAnalyticsMatrix,
  CohortMasteryCell,
  Student,
  Assessment
} from '@hex-aim/types';
import { MultiSubjectCurriculumService } from './MultiSubjectCurriculumService.js';

export class CohortAnalyticsEngine {
  private static instance: CohortAnalyticsEngine | null = null;

  public static getInstance(): CohortAnalyticsEngine {
    if (!this.instance) {
      this.instance = new CohortAnalyticsEngine();
    }
    return this.instance;
  }

  public generateClassHeatmap(
    classId: string,
    yearGroup: string,
    subjectId: string,
    students: Student[],
    assessments: Assessment[]
  ): CohortAnalyticsMatrix {
    const curriculum = MultiSubjectCurriculumService.getInstance();
    const targetConcepts = curriculum.getConceptsBySubject(subjectId, yearGroup);

    const cells: CohortMasteryCell[] = [];
    const conceptStrugglersMap = new Map<string, { title: string; names: string[] }>();

    for (const student of students) {
      const studentAssessments = assessments.filter(
        a => a.studentId.toLowerCase() === student.id.toLowerCase() && a.subjectId.toLowerCase() === subjectId.toLowerCase()
      );

      for (const concept of targetConcepts) {
        // Find matching assessment items covering this concept
        let totalItems = 0;
        let earnedMarks = 0;

        for (const ass of studentAssessments) {
          for (const item of ass.items || []) {
            if (item.conceptCode === concept.code) {
              totalItems += 1;
              if (item.status === 'pass') earnedMarks += 1;
              else if (item.status === 'partial') earnedMarks += 0.5;
            }
          }
        }

        // If no direct items, default to overall assessment average or placeholder
        const pct = totalItems > 0 
          ? Math.round((earnedMarks / totalItems) * 100) 
          : (studentAssessments.length > 0 ? studentAssessments[studentAssessments.length - 1]!.percentage : 75);

        let status: 'mastered' | 'progressing' | 'critical_gap' = 'progressing';
        if (pct >= 80) status = 'mastered';
        else if (pct < 60) status = 'critical_gap';

        cells.push({
          studentId: student.id,
          studentName: student.name,
          conceptCode: concept.code,
          conceptTitle: concept.title,
          masteryPct: pct,
          status,
        });

        if (status === 'critical_gap') {
          const entry = conceptStrugglersMap.get(concept.code) || { title: concept.title, names: [] };
          entry.names.push(student.name);
          conceptStrugglersMap.set(concept.code, entry);
        }
      }
    }

    const criticalInterventionClusters: Array<{
      conceptCode: string;
      conceptTitle: string;
      studentCount: number;
      studentNames: string[];
    }> = [];

    for (const [code, entry] of conceptStrugglersMap.entries()) {
      if (entry.names.length > 0) {
        criticalInterventionClusters.push({
          conceptCode: code,
          conceptTitle: entry.title,
          studentCount: entry.names.length,
          studentNames: entry.names,
        });
      }
    }

    // Sort clusters by urgency (highest student count first)
    criticalInterventionClusters.sort((a, b) => b.studentCount - a.studentCount);

    return {
      classId,
      yearGroup,
      subjectId,
      totalStudents: students.length,
      matrix: cells,
      criticalInterventionClusters,
    };
  }
}
