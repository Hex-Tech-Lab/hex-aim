import type { 
  IStoragePort, 
  IVisionExtractionPort, 
  ISettingsPort, 
  CognitiveGap,
  Student 
} from '@hex-aim/types';
import { IntakeDeduplicator } from '../dedup/IntakeDeduplicator.js';
import { CanonicalDeduplicator } from '../dedup/CanonicalDeduplicator.js';

export interface IngestionFileItem {
  path?: string;
  url?: string;
  filename: string;
  fileSizeBytes: number;
  hash: string;
}

export interface IngestionResultItem {
  filename: string;
  hash: string;
  isDuplicate: boolean;
  studentId?: string;
  subjectId?: string;
  week?: number;
  score?: string;
  canonicalMasterId?: string;
  isNewMaster?: boolean;
  status: 'ingested' | 'skipped_duplicate' | 'failed';
  error?: string;
}

export interface PilotBatchIngestionReport {
  timestamp: string;
  totalFiles: number;
  processedCount: number;
  duplicatesSkipped: number;
  newMastersCount: number;
  deltasRecordedCount: number;
  results: IngestionResultItem[];
}

export class PilotBatchIngestor {
  /**
   * Processes a batch of intake assessment files across student cohorts.
   */
  public static async processBatch(
    files: IngestionFileItem[],
    options: {
      guardianId: string;
      defaultSchoolId?: string;
      defaultYearGroup?: string;
      defaultSubject?: string;
      defaultWeek?: number;
      storage: IStoragePort;
      vision: IVisionExtractionPort;
      settings: ISettingsPort;
    }
  ): Promise<PilotBatchIngestionReport> {
    const { 
      guardianId, 
      defaultSchoolId = 'asten-college', 
      defaultYearGroup = 'Y4', 
      defaultSubject = 'science', 
      defaultWeek = 8, 
      storage, 
      vision, 
      settings 
    } = options;

    const report: PilotBatchIngestionReport = {
      timestamp: new Date().toISOString(),
      totalFiles: files.length,
      processedCount: 0,
      duplicatesSkipped: 0,
      newMastersCount: 0,
      deltasRecordedCount: 0,
      results: [],
    };

    for (const file of files) {
      try {
        // 1. Evaluate file deduplication
        const dedupRes = await IntakeDeduplicator.evaluateUpload(
          {
            guardianId,
            fileIdentifier: file.hash,
            metadata: {
              filename: file.filename,
              fileSize: file.fileSizeBytes,
            },
          },
          storage,
          settings
        );

        if (dedupRes.isDuplicate) {
          report.duplicatesSkipped++;
          report.results.push({
            filename: file.filename,
            hash: file.hash,
            isDuplicate: true,
            status: 'skipped_duplicate',
          });
          continue;
        }

        // 2. Vision extraction
        const imageSource = file.url || file.path || file.filename;
        const extraction = await vision.extractAssessment([imageSource], {
          studentId: 'unknown',
          subjectId: defaultSubject,
          yearGroup: defaultYearGroup,
        });

        const studentId = (extraction.detectedStudentName || 'lara').toLowerCase();
        const subjectId = (extraction.detectedSubject || defaultSubject).toLowerCase();
        const termWeek = extraction.detectedWeek || defaultWeek;
        const yearGroup = extraction.detectedYearGroup || defaultYearGroup;

        // Fetch or create student profile
        let student = await storage.getStudent(studentId);
        if (!student) {
          student = {
            id: studentId,
            name: studentId.charAt(0).toUpperCase() + studentId.slice(1),
            schoolId: defaultSchoolId,
            yearGroup,
            curriculumTrack: 'british',
            neuroProfile: {
              hasAdhdTraits: studentId === 'lara',
              hasDyslexiaTraits: studentId === 'lara',
              workingMemoryCapacity: studentId === 'lara' ? 'vulnerable_under_time_pressure' : 'standard',
              optimalSprintDurationMins: studentId === 'lara' ? 8 : 10,
            },
          } as Student;
          await storage.saveStudent(student);
        }

        // 3. Canonical Master Deduplication & Delta Ingestion
        const dedupContext = {
          schoolId: defaultSchoolId,
          yearGroup,
          subjectId,
          termWeek,
        };

        const existingMaster = storage.findCanonicalMaster
          ? await storage.findCanonicalMaster(defaultSchoolId, yearGroup, subjectId, termWeek)
          : null;

        const percentage = Math.round((extraction.rawScore / Math.max(1, extraction.totalScore)) * 100);

        const { master, isNewMaster, submission, delta } = CanonicalDeduplicator.processSubmission(
          existingMaster,
          dedupContext,
          {
            studentId,
            guardianId,
            rawScore: extraction.rawScore,
            totalScore: extraction.totalScore,
            percentage,
            items: extraction.items,
            sourceImageUrls: [imageSource],
          }
        );

        if (isNewMaster && storage.saveCanonicalMaster) {
          await storage.saveCanonicalMaster(master);
          report.newMastersCount++;
        } else if (delta) {
          report.deltasRecordedCount++;
        }

        // 4. Save Assessment Submission
        await storage.saveAssessment(submission);

        // 5. Update Cognitive Gap Ledger
        const existingGaps = await storage.getStudentGaps(studentId);
        const gapMap = new Map<string, CognitiveGap>();
        for (const g of existingGaps) {
          gapMap.set(g.conceptCode, g);
        }

        const nowStr = new Date().toISOString().split('T')[0]!;
        for (const item of extraction.items) {
          if (item.status === 'fail' && item.errorClass) {
            const existing = gapMap.get(item.conceptCode);
            if (existing) {
              existing.lastObservedDate = nowStr;
              existing.recurrenceCount++;
              existing.status = 'active_priority';
            } else {
              gapMap.set(item.conceptCode, {
                id: `gap_${studentId}_${item.conceptCode}_${Date.now()}`,
                studentId,
                conceptCode: item.conceptCode,
                errorClass: item.errorClass,
                description: `Recurring mistake in ${item.conceptCode}`,
                firstObservedDate: nowStr,
                lastObservedDate: nowStr,
                recurrenceCount: 1,
                status: 'active_priority',
                socraticHint: `Guide the student through ${item.conceptCode} using conceptual elevator scaffolding.`,
              });
            }
          }
        }
        await storage.saveStudentGaps(studentId, Array.from(gapMap.values()));

        report.processedCount++;
        report.results.push({
          filename: file.filename,
          hash: file.hash,
          isDuplicate: false,
          studentId,
          subjectId,
          week: termWeek,
          score: `${extraction.rawScore}/${extraction.totalScore} (${percentage}%)`,
          canonicalMasterId: master.id,
          isNewMaster,
          status: 'ingested',
        });
      } catch (err: any) {
        report.results.push({
          filename: file.filename,
          hash: file.hash,
          isDuplicate: false,
          status: 'failed',
          error: err.message || String(err),
        });
      }
    }

    return report;
  }
}
