import { describe, it, expect, beforeEach } from 'vitest';
import { IntakeDeduplicator } from '../src/dedup/IntakeDeduplicator.js';
import { SettingsManager } from '../src/settings/SettingsManager.js';
import type { IStoragePort, GuardianStrikeRecord } from '@hex-aim/types';

class MockStorage implements IStoragePort {
  private strikes = new Map<string, GuardianStrikeRecord>();
  private seenFiles = new Map<string, { filename?: string; sprintId?: string; timestamp: string }>();

  async getStudent(): Promise<any> { return null; }
  async saveStudent(): Promise<void> {}
  async listStudents(): Promise<any[]> { return []; }
  async getGuardian(): Promise<any> { return null; }
  async getGuardianByChatId(): Promise<any> { return null; }
  async saveGuardian(): Promise<void> {}
  async saveAssessment(): Promise<void> {}
  async getStudentAssessments(): Promise<any[]> { return []; }
  async getStudentGaps(): Promise<any[]> { return []; }
  async saveStudentGaps(): Promise<void> {}
  async saveRemediationSprint(): Promise<void> {}
  async getRemediationSprint(): Promise<any> { return null; }
  async saveCoachingGuide(): Promise<void> {}
  async getCoachingGuide(): Promise<any> { return null; }
  async getTrends(): Promise<any[]> { return []; }

  async getGuardianStrikes(guardianId: string): Promise<GuardianStrikeRecord | null> {
    return this.strikes.get(guardianId) || null;
  }
  async saveGuardianStrikes(record: GuardianStrikeRecord): Promise<void> {
    this.strikes.set(record.guardianId, { ...record });
  }
  async hasSeenFileHash(guardianId: string, hash: string): Promise<boolean> {
    return this.seenFiles.has(`${guardianId}:${hash}`);
  }
  async recordFileHash(guardianId: string, hash: string, metadata: any): Promise<void> {
    this.seenFiles.set(`${guardianId}:${hash}`, { ...metadata });
  }
  async getSeenFileMetadata(guardianId: string, hash: string): Promise<any> {
    return this.seenFiles.get(`${guardianId}:${hash}`) || null;
  }
}

describe('IntakeDeduplicator', () => {
  let storage: MockStorage;
  let settings: SettingsManager;

  beforeEach(() => {
    storage = new MockStorage();
    settings = SettingsManager.getInstance();
    settings.set('intake.dedup.enabled', true);
    settings.set('intake.dedup.strikeLimit', 3);
  });

  it('accepts first-time quiz upload without strikes', async () => {
    const result = await IntakeDeduplicator.evaluateUpload(
      {
        guardianId: 'guard_123',
        fileIdentifier: 'tg_unique_photo_001',
        metadata: { filename: 'math_w3_quiz.jpg' },
      },
      storage,
      settings
    );

    expect(result.isDuplicate).toBe(false);
    expect(result.strikeCount).toBe(0);
    expect(result.status).toBe('active');
    expect(result.tokensSaved).toBe(0);
  });

  it('detects duplicate quiz upload, logs strike 1 and returns friendly educational warning', async () => {
    // 1st upload
    await IntakeDeduplicator.evaluateUpload(
      {
        guardianId: 'guard_123',
        fileIdentifier: 'tg_unique_photo_001',
        metadata: { filename: 'math_w3_quiz.jpg', sprintId: 'sp_999' },
      },
      storage,
      settings
    );

    // 2nd upload (repeated)
    const result = await IntakeDeduplicator.evaluateUpload(
      {
        guardianId: 'guard_123',
        fileIdentifier: 'tg_unique_photo_001',
        metadata: { filename: 'math_w3_quiz.jpg' },
      },
      storage,
      settings
    );

    expect(result.isDuplicate).toBe(true);
    expect(result.strikeCount).toBe(1);
    expect(result.status).toBe('warned');
    expect(result.duplicateCount).toBe(1);
    expect(result.tokensSaved).toBe(3200);
    expect(result.userMessage).toContain('Repeated Test Submission Detected');
    expect(result.userMessage).toContain('1 of 3 strikes');
    expect(result.userMessage).toContain('https://aim.getvintel.com/sprint/sp_999');
  });

  it('escalates to strike 3 and downgrades account on repeated infractions', async () => {
    // 1st upload (accepted)
    await IntakeDeduplicator.evaluateUpload(
      { guardianId: 'guard_456', fileIdentifier: 'photo_abc' },
      storage,
      settings
    );

    // 2nd upload (strike 1)
    await IntakeDeduplicator.evaluateUpload(
      { guardianId: 'guard_456', fileIdentifier: 'photo_abc' },
      storage,
      settings
    );

    // 3rd upload (strike 2)
    await IntakeDeduplicator.evaluateUpload(
      { guardianId: 'guard_456', fileIdentifier: 'photo_abc' },
      storage,
      settings
    );

    // 4th upload (strike 3 -> downgrade)
    const result = await IntakeDeduplicator.evaluateUpload(
      { guardianId: 'guard_456', fileIdentifier: 'photo_abc' },
      storage,
      settings
    );

    expect(result.isDuplicate).toBe(true);
    expect(result.strikeCount).toBe(3);
    expect(result.status).toBe('downgraded');
    expect(result.userMessage).toContain('Intake Quota Downgraded');
    expect(result.tokensSaved).toBe(3200 * 3);
  });
});
