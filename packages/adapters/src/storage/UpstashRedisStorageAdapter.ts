import { Redis } from '@upstash/redis';
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

export interface UpstashRedisConfig {
  url: string;
  token: string;
  prefix?: string;
}

export class UpstashRedisStorageAdapter implements IStoragePort {
  private redis: Redis;
  private prefix: string;

  constructor(config: UpstashRedisConfig) {
    this.prefix = config.prefix || 'aim:';
    this.redis = new Redis({
      url: config.url,
      token: config.token,
    });
  }

  private k(subKey: string): string {
    return `${this.prefix}${subKey}`;
  }

  public async getStudent(id: string): Promise<Student | null> {
    return await this.redis.get<Student>(this.k(`student:${id}`));
  }

  public async saveStudent(student: Student): Promise<void> {
    await this.redis.set(this.k(`student:${student.id}`), student);
    await this.redis.sadd(this.k('students:index'), student.id);
  }

  public async listStudents(schoolId?: string, yearGroup?: string): Promise<Student[]> {
    const ids = await this.redis.smembers(this.k('students:index'));
    if (!ids || ids.length === 0) return [];

    const keys = ids.map(id => this.k(`student:${id}`));
    const students: Student[] = [];
    
    // Fetch in batches if necessary
    for (const key of keys) {
      const s = await this.redis.get<Student>(key);
      if (s) {
        if (schoolId && s.schoolId !== schoolId) continue;
        if (yearGroup && s.yearGroup !== yearGroup) continue;
        students.push(s);
      }
    }
    return students;
  }

  public async getGuardian(id: string): Promise<Guardian | null> {
    return await this.redis.get<Guardian>(this.k(`guardian:${id}`));
  }

  public async getGuardianByChatId(chatId: string): Promise<Guardian | null> {
    const guardianId = await this.redis.get<string>(this.k(`guardian_by_chat:${chatId}`));
    if (!guardianId) return null;
    return await this.getGuardian(guardianId);
  }

  public async saveGuardian(guardian: Guardian): Promise<void> {
    await this.redis.set(this.k(`guardian:${guardian.id}`), guardian);
    await this.redis.set(this.k(`guardian_by_chat:${guardian.chatId}`), guardian.id);
  }

  public async saveAssessment(submission: AssessmentSubmission): Promise<void> {
    const key = this.k(`assessments:${submission.studentId}`);
    const existing = (await this.redis.get<AssessmentSubmission[]>(key)) || [];
    existing.push(submission);
    await this.redis.set(key, existing);
  }

  public async getStudentAssessments(studentId: string, subjectId?: string): Promise<AssessmentSubmission[]> {
    const list = (await this.redis.get<AssessmentSubmission[]>(this.k(`assessments:${studentId}`))) || [];
    if (subjectId) {
      return list.filter(a => a.subjectId === subjectId);
    }
    return list;
  }

  public async getStudentGaps(studentId: string): Promise<CognitiveGap[]> {
    return (await this.redis.get<CognitiveGap[]>(this.k(`gaps:${studentId}`))) || [];
  }

  public async saveStudentGaps(studentId: string, gaps: CognitiveGap[]): Promise<void> {
    await this.redis.set(this.k(`gaps:${studentId}`), gaps);
  }

  public async saveRemediationSprint(sprint: RemediationSprint): Promise<void> {
    await this.redis.set(this.k(`sprint:${sprint.id}`), sprint);
  }

  public async getRemediationSprint(id: string): Promise<RemediationSprint | null> {
    return await this.redis.get<RemediationSprint>(this.k(`sprint:${id}`));
  }

  public async saveCoachingGuide(guide: CoachingGuide): Promise<void> {
    await this.redis.set(this.k(`guide:${guide.id}`), guide);
  }

  public async getCoachingGuide(id: string): Promise<CoachingGuide | null> {
    return await this.redis.get<CoachingGuide>(this.k(`guide:${id}`));
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
    return await this.redis.get<GuardianStrikeRecord>(this.k(`strikes:${guardianId}`));
  }

  public async saveGuardianStrikes(record: GuardianStrikeRecord): Promise<void> {
    await this.redis.set(this.k(`strikes:${record.guardianId}`), record);
  }

  public async hasSeenFileHash(guardianId: string, hash: string): Promise<boolean> {
    const exists = await this.redis.exists(this.k(`seen_files:${guardianId}:${hash}`));
    return exists === 1;
  }

  public async recordFileHash(
    guardianId: string,
    hash: string,
    metadata: { filename?: string; sprintId?: string; timestamp: string }
  ): Promise<void> {
    await this.redis.set(this.k(`seen_files:${guardianId}:${hash}`), metadata, { ex: 86400 });
  }

  public async getSeenFileMetadata(
    guardianId: string,
    hash: string
  ): Promise<{ filename?: string; sprintId?: string; timestamp: string } | null> {
    return await this.redis.get<{ filename?: string; sprintId?: string; timestamp: string }>(
      this.k(`seen_files:${guardianId}:${hash}`)
    );
  }

  public async addIntakeBatchItem(batchId: string, item: { url: string; fileUniqueId: string; messageId?: number }): Promise<void> {
    await this.redis.rpush(this.k(`intake_batch:${batchId}`), item);
    await this.redis.expire(this.k(`intake_batch:${batchId}`), 3600);
    await this.redis.set(this.k(`intake_last_seen:${batchId}`), Date.now(), { ex: 3600 });
  }

  public async getIntakeLastSeen(batchId: string): Promise<number> {
    const ts = await this.redis.get<number>(this.k(`intake_last_seen:${batchId}`));
    return ts ? Number(ts) : 0;
  }

  public async getIntakeBatchItems(batchId: string): Promise<Array<{ url: string; fileUniqueId: string; messageId?: number }>> {
    const items = await this.redis.lrange<any>(this.k(`intake_batch:${batchId}`), 0, -1);
    return items || [];
  }

  public async clearIntakeBatch(batchId: string): Promise<void> {
    await this.redis.del(this.k(`intake_batch:${batchId}`));
  }

  public async recordChatMessage(
    chatId: string,
    message: { role: 'user' | 'assistant'; text: string; timestamp: string; messageId?: number }
  ): Promise<void> {
    const key = this.k(`chat_history:${chatId}`);
    await this.redis.lpush(key, message);
    await this.redis.ltrim(key, 0, 19);
    await this.redis.expire(key, 86400 * 7);
  }

  public async getRecentChatTurns(
    chatId: string,
    limit: number = 5
  ): Promise<Array<{ role: 'user' | 'assistant'; text: string; timestamp: string; messageId?: number }>> {
    const items = await this.redis.lrange<any>(this.k(`chat_history:${chatId}`), 0, limit - 1);
    return items || [];
  }

  public async trackBotMessage(chatId: string, messageId: number): Promise<void> {
    const key = this.k(`bot_messages:${chatId}`);
    await this.redis.sadd(key, messageId);
    await this.redis.expire(key, 86400 * 7);
  }

  public async getBotMessages(chatId: string): Promise<number[]> {
    const ids = await this.redis.smembers(this.k(`bot_messages:${chatId}`));
    return (ids || []).map(id => Number(id)).filter(id => !isNaN(id));
  }

  public async clearBotMessages(chatId: string): Promise<void> {
    await this.redis.del(this.k(`bot_messages:${chatId}`));
  }
}
