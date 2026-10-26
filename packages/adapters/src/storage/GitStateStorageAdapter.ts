import * as fs from 'fs';
import * as path from 'path';
import type {
  IStoragePort,
  Student,
  Guardian,
  AssessmentSubmission,
  CognitiveGap,
  RemediationSprint,
  CoachingGuide,
  TrendDataPoint,
  GuardianStrikeRecord
} from '@hex-aim/types';

export class GitStateStorageAdapter implements IStoragePort {
  private baseDir: string;

  constructor(baseDir?: string) {
    this.baseDir = baseDir || path.resolve(process.cwd(), 'manifest/state');
    if (!fs.existsSync(this.baseDir)) {
      fs.mkdirSync(this.baseDir, { recursive: true });
    }
  }

  private filePath(category: string, id: string): string {
    const dir = path.join(this.baseDir, category);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    return path.join(dir, `${id}.json`);
  }

  private readJson<T>(category: string, id: string): T | null {
    const p = this.filePath(category, id);
    if (!fs.existsSync(p)) return null;
    try {
      const data = fs.readFileSync(p, 'utf-8');
      return JSON.parse(data) as T;
    } catch {
      return null;
    }
  }

  private writeJson<T>(category: string, id: string, data: T): void {
    const p = this.filePath(category, id);
    fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf-8');
  }

  public async getStudent(id: string): Promise<Student | null> {
    return this.readJson<Student>('students', id);
  }

  public async saveStudent(student: Student): Promise<void> {
    this.writeJson('students', student.id, student);
  }

  public async listStudents(schoolId?: string, yearGroup?: string): Promise<Student[]> {
    const dir = path.join(this.baseDir, 'students');
    if (!fs.existsSync(dir)) return [];
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
    const list: Student[] = [];
    for (const f of files) {
      const id = f.replace('.json', '');
      const s = await this.getStudent(id);
      if (s) {
        if (schoolId && s.schoolId !== schoolId) continue;
        if (yearGroup && s.yearGroup !== yearGroup) continue;
        list.push(s);
      }
    }
    return list;
  }

  public async getGuardian(id: string): Promise<Guardian | null> {
    return this.readJson<Guardian>('guardians', id);
  }

  public async getGuardianByChatId(chatId: string): Promise<Guardian | null> {
    const dir = path.join(this.baseDir, 'guardians');
    if (!fs.existsSync(dir)) return null;
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
    for (const f of files) {
      const id = f.replace('.json', '');
      const g = await this.getGuardian(id);
      if (g && g.chatId === chatId) return g;
    }
    return null;
  }

  public async saveGuardian(guardian: Guardian): Promise<void> {
    this.writeJson('guardians', guardian.id, guardian);
  }

  public async saveAssessment(submission: AssessmentSubmission): Promise<void> {
    const existing = (await this.getStudentAssessments(submission.studentId)) || [];
    existing.push(submission);
    this.writeJson('assessments', submission.studentId, existing);
  }

  public async getStudentAssessments(studentId: string, subjectId?: string): Promise<AssessmentSubmission[]> {
    const list = this.readJson<AssessmentSubmission[]>('assessments', studentId) || [];
    if (subjectId) {
      return list.filter(a => a.subjectId === subjectId);
    }
    return list;
  }

  public async getStudentGaps(studentId: string): Promise<CognitiveGap[]> {
    return this.readJson<CognitiveGap[]>('gaps', studentId) || [];
  }

  public async saveStudentGaps(studentId: string, gaps: CognitiveGap[]): Promise<void> {
    this.writeJson('gaps', studentId, gaps);
  }

  public async saveRemediationSprint(sprint: RemediationSprint): Promise<void> {
    this.writeJson('sprints', sprint.id, sprint);
  }

  public async getRemediationSprint(id: string): Promise<RemediationSprint | null> {
    return this.readJson<RemediationSprint>('sprints', id);
  }

  public async saveCoachingGuide(guide: CoachingGuide): Promise<void> {
    this.writeJson('guides', guide.id, guide);
  }

  public async getCoachingGuide(id: string): Promise<CoachingGuide | null> {
    return this.readJson<CoachingGuide>('guides', id);
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

  public async getGuardianStrikes(guardianId: string): Promise<GuardianStrikeRecord | null> {
    return this.readJson<GuardianStrikeRecord>('strikes', guardianId);
  }

  public async saveGuardianStrikes(record: GuardianStrikeRecord): Promise<void> {
    this.writeJson('strikes', record.guardianId, record);
  }

  public async hasSeenFileHash(guardianId: string, hash: string): Promise<boolean> {
    const meta = this.readJson<{ filename?: string; sprintId?: string; timestamp: string }>('seen_files', `${guardianId}_${hash}`);
    return meta !== null;
  }

  public async recordFileHash(
    guardianId: string,
    hash: string,
    metadata: { filename?: string; sprintId?: string; timestamp: string },
    _ttlSeconds?: number
  ): Promise<void> {
    this.writeJson('seen_files', `${guardianId}_${hash}`, metadata);
  }

  public async getSeenFileMetadata(
    guardianId: string,
    hash: string
  ): Promise<{ filename?: string; sprintId?: string; timestamp: string } | null> {
    return this.readJson<{ filename?: string; sprintId?: string; timestamp: string }>('seen_files', `${guardianId}_${hash}`);
  }

  // Wave 14: Multi-Guardian Family Unit Methods
  public async saveFamilyUnit(family: any): Promise<void> {
    this.writeJson('families', family.id, family);
    for (const g of family.guardians || []) {
      this.writeJson('family_by_chat', g.chatId, { familyId: family.id });
    }
  }

  public async getFamilyUnit(familyId: string): Promise<any | null> {
    return this.readJson<any>('families', familyId);
  }

  public async getFamilyByChatId(chatId: string): Promise<any | null> {
    const meta = this.readJson<{ familyId: string }>('family_by_chat', chatId);
    if (!meta?.familyId) return null;
    return this.getFamilyUnit(meta.familyId);
  }
}
