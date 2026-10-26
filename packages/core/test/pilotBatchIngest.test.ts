import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PilotBatchIngestor, type IngestionFileItem } from '../src/intake/PilotBatchIngestor.js';
import { SettingsManager } from '../src/settings/SettingsManager.js';
import type { 
  IStoragePort, 
  IVisionExtractionPort, 
  Student, 
  Guardian, 
  AssessmentSubmission, 
  CognitiveGap, 
  CanonicalAssessmentMaster,
  GuardianStrikeRecord 
} from '@hex-aim/types';

describe('Wave 13: Pilot Batch Ingestion & Cohort Intake Processing', () => {
  let mockStorage: IStoragePort;
  let mockVision: IVisionExtractionPort;
  let settings: SettingsManager;

  let studentsMap: Map<string, Student>;
  let mastersMap: Map<string, CanonicalAssessmentMaster>;
  let submissionsMap: Map<string, AssessmentSubmission[]>;
  let gapsMap: Map<string, CognitiveGap[]>;
  let strikesMap: Map<string, GuardianStrikeRecord>;
  let seenFilesMap: Map<string, any>;

  beforeEach(() => {
    studentsMap = new Map();
    mastersMap = new Map();
    submissionsMap = new Map();
    gapsMap = new Map();
    strikesMap = new Map();
    seenFilesMap = new Map();

    settings = SettingsManager.getInstance();
    settings.set('intake.dedup.enabled', true);

    mockStorage = {
      async getStudent(id: string) { return studentsMap.get(id) || null; },
      async saveStudent(student: Student) { studentsMap.set(student.id, student); },
      async listStudents() { return Array.from(studentsMap.values()); },
      async getGuardian(_id: string) { return null; },
      async getGuardianByChatId(_chatId: string) { return null; },
      async saveGuardian(_g: Guardian) {},
      async saveAssessment(submission: AssessmentSubmission) {
        const list = submissionsMap.get(submission.studentId) || [];
        list.push(submission);
        submissionsMap.set(submission.studentId, list);
      },
      async getStudentAssessments(studentId: string) { return submissionsMap.get(studentId) || []; },
      async getStudentGaps(studentId: string) { return gapsMap.get(studentId) || []; },
      async saveStudentGaps(studentId: string, gaps: CognitiveGap[]) { gapsMap.set(studentId, gaps); },
      async saveRemediationSprint() {},
      async getRemediationSprint() { return null; },
      async saveCoachingGuide() {},
      async getCoachingGuide() { return null; },
      async getTrends() { return []; },
      async getGuardianStrikes(guardianId: string) { return strikesMap.get(guardianId) || null; },
      async saveGuardianStrikes(record: GuardianStrikeRecord) { strikesMap.set(record.guardianId, record); },
      async hasSeenFileHash(guardianId: string, hash: string) { return seenFilesMap.has(`${guardianId}:${hash}`); },
      async recordFileHash(guardianId: string, hash: string, meta: any) { seenFilesMap.set(`${guardianId}:${hash}`, meta); },
      async getSeenFileMetadata(guardianId: string, hash: string) { return seenFilesMap.get(`${guardianId}:${hash}`) || null; },
      async saveCanonicalMaster(master: CanonicalAssessmentMaster) { mastersMap.set(master.id, master); },
      async getCanonicalMaster(id: string) { return mastersMap.get(id) || null; },
      async findCanonicalMaster(schoolId: string, yearGroup: string, subjectId: string, termWeek: number) {
        for (const m of mastersMap.values()) {
          if (m.schoolId === schoolId && m.yearGroup === yearGroup && m.subjectId === subjectId && m.termWeek === termWeek) {
            return m;
          }
        }
        return null;
      },
    };

    mockVision = {
      extractAssessment: vi.fn().mockImplementation(async (urls: string[]) => {
        const url = urls[0] || '';
        const isMaya = url.includes('maya');
        return {
          detectedStudentName: isMaya ? 'maya' : 'lara',
          detectedSubject: 'science',
          detectedWeek: 8,
          detectedYearGroup: 'Y4',
          rawScore: isMaya ? 5 : 4,
          totalScore: 5,
          items: [
            {
              qNum: 'Q1',
              conceptCode: 'Y4.SCI.VERTEBRATES',
              studentAnswer: 'Vertebrate',
              correctAnswer: 'Vertebrate',
              status: 'pass',
            },
            {
              qNum: 'Q2',
              conceptCode: 'Y4.SCI.SKELETONS',
              studentAnswer: isMaya ? 'Endoskeleton' : 'Shell',
              correctAnswer: 'Endoskeleton',
              status: isMaya ? 'pass' : 'fail',
              errorClass: isMaya ? undefined : 'ERR_INVERTEBRATE_CONFUSION',
            },
          ],
        };
      }),
    };
  });

  it('ingests batch files, detects duplicates, registers master, and commits student deltas', async () => {
    const files: IngestionFileItem[] = [
      {
        filename: 'Lara_Science_W8.jpg',
        fileSizeBytes: 95485,
        hash: 'hash_lara_w8_unique_1',
        url: 'https://cdn.example.com/lara_science.jpg',
      },
      {
        filename: 'Maya_Science_W8.jpg',
        fileSizeBytes: 156387,
        hash: 'hash_maya_w8_unique_2',
        url: 'https://cdn.example.com/maya_science.jpg',
      },
      {
        // Duplicate re-submission of Lara's sheet
        filename: 'Lara_Science_W8_copy.jpg',
        fileSizeBytes: 95485,
        hash: 'hash_lara_w8_unique_1',
        url: 'https://cdn.example.com/lara_science_dup.jpg',
      },
    ];

    const report = await PilotBatchIngestor.processBatch(files, {
      guardianId: 'guardian_dad',
      defaultSchoolId: 'asten-college',
      defaultYearGroup: 'Y4',
      defaultSubject: 'science',
      defaultWeek: 8,
      storage: mockStorage,
      vision: mockVision,
      settings,
    });

    expect(report.totalFiles).toBe(3);
    expect(report.processedCount).toBe(2);
    expect(report.duplicatesSkipped).toBe(1);
    expect(report.newMastersCount).toBe(1);
    expect(report.deltasRecordedCount).toBe(1);

    // Verify student profiles hydrated
    expect(studentsMap.has('lara')).toBe(true);
    expect(studentsMap.has('maya')).toBe(true);

    // Verify Lara has active cognitive gap recorded
    const laraGaps = await mockStorage.getStudentGaps('lara');
    expect(laraGaps.length).toBe(1);
    expect(laraGaps[0]?.conceptCode).toBe('Y4.SCI.SKELETONS');
    expect(laraGaps[0]?.errorClass).toBe('ERR_INVERTEBRATE_CONFUSION');

    // Verify Maya has 0 gaps (she scored 100% on these questions)
    const mayaGaps = await mockStorage.getStudentGaps('maya');
    expect(mayaGaps.length).toBe(0);
  });
});
