import type {
  IStoragePort,
  Student,
  Guardian,
  AssessmentSubmission,
  CognitiveGap,
  RemediationSprint,
  CoachingGuide,
  TrendDataPoint
} from '@hex-aim/types';

export class InMemoryStorageAdapter implements IStoragePort {
  private students = new Map<string, Student>();
  private guardians = new Map<string, Guardian>();
  private assessments = new Map<string, AssessmentSubmission[]>();
  private gaps = new Map<string, CognitiveGap[]>();
  private sprints = new Map<string, RemediationSprint>();
  private guides = new Map<string, CoachingGuide>();

  public async getStudent(id: string): Promise<Student | null> {
    return this.students.get(id) || null;
  }

  public async saveStudent(student: Student): Promise<void> {
    this.students.set(student.id, { ...student });
  }

  public async listStudents(schoolId?: string, yearGroup?: string): Promise<Student[]> {
    let list = Array.from(this.students.values());
    if (schoolId) {
      list = list.filter(s => s.schoolId === schoolId);
    }
    if (yearGroup) {
      list = list.filter(s => s.yearGroup === yearGroup);
    }
    return list;
  }

  public async getGuardian(id: string): Promise<Guardian | null> {
    return this.guardians.get(id) || null;
  }

  public async getGuardianByChatId(chatId: string): Promise<Guardian | null> {
    for (const g of this.guardians.values()) {
      if (g.chatId === chatId) return g;
    }
    return null;
  }

  public async saveGuardian(guardian: Guardian): Promise<void> {
    this.guardians.set(guardian.id, { ...guardian });
  }

  public async saveAssessment(submission: AssessmentSubmission): Promise<void> {
    const list = this.assessments.get(submission.studentId) || [];
    list.push({ ...submission });
    this.assessments.set(submission.studentId, list);
  }

  public async getStudentAssessments(studentId: string, subjectId?: string): Promise<AssessmentSubmission[]> {
    const list = this.assessments.get(studentId) || [];
    if (subjectId) {
      return list.filter(a => a.subjectId === subjectId);
    }
    return list;
  }

  public async getStudentGaps(studentId: string): Promise<CognitiveGap[]> {
    return this.gaps.get(studentId) || [];
  }

  public async saveStudentGaps(studentId: string, gaps: CognitiveGap[]): Promise<void> {
    this.gaps.set(studentId, [...gaps]);
  }

  public async saveRemediationSprint(sprint: RemediationSprint): Promise<void> {
    this.sprints.set(sprint.id, { ...sprint });
  }

  public async getRemediationSprint(id: string): Promise<RemediationSprint | null> {
    return this.sprints.get(id) || null;
  }

  public async saveCoachingGuide(guide: CoachingGuide): Promise<void> {
    this.guides.set(guide.id, { ...guide });
  }

  public async getCoachingGuide(id: string): Promise<CoachingGuide | null> {
    return this.guides.get(id) || null;
  }

  public async getTrends(studentId: string, subjectId?: string): Promise<TrendDataPoint[]> {
    const assessments = await this.getStudentAssessments(studentId, subjectId);
    const gaps = await this.getStudentGaps(studentId);
    const activeGapCount = gaps.filter(g => g.status === 'active_priority').length;
    const resolvedGapCount = gaps.filter(g => g.status === 'resolved').length;

    return assessments.map(a => ({
      date: a.date,
      weekNumber: a.termWeek,
      subjectId: a.subjectId,
      percentageScore: a.percentage,
      activeGapCount,
      resolvedGapCount,
    }));
  }
}
