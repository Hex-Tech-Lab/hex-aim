/**
 * HEX-AIM: Universal Domain Types & Hexagonal Ports (DDD-Lite)
 * Adaptive Individualized Mastery (Targeted Learning & Remediation Engine)
 */

export type CurriculumAuthority = 
  | 'british-national' 
  | 'egyptian-moe' 
  | 'second-language' 
  | 'american-diploma';

export type TrafficLightStatus = 
  | 'resolved'         // 🟢 Green: Fully mastered & stable
  | 'progressing'      // 🟡 Yellow: Improving, errors under speed/pressure only
  | 'active_priority'  // 🟠 Orange: Active focus (No Red! Prevents ADHD anxiety)
  | 'emerging';        // 🟣 Purple: Newly introduced concept

export type ErrorClassification =
  | 'ERR_PHANTOM_ZERO'
  | 'ERR_NEGATIVE_MAGNITUDE_INVERSION'
  | 'ERR_TRANSPOSITION'
  | 'ERR_INTERVAL_DECODE'
  | 'ERR_FENCEPOST_COUNT'
  | 'ERR_SHARED_PREFIX_ORDERING'
  | 'ERR_PLACE_VALUE_ALIGNMENT'
  | 'ERR_COLUMN_OVERFLOW'
  | 'ERR_ARABIC_ROOT_CONFUSION'
  | 'ERR_GENERAL_CALCULATION';

export interface School {
  id: string;
  name: string;
  location: string;
  academicTracks: string[];
}

export interface Cohort {
  id: string;
  schoolId: string;
  yearGroup: string; // e.g. "Y4"
  classLabel: string; // e.g. "4A", "4B"
  academicYear: string; // e.g. "2026-2027"
}

export interface StudentNeuroProfile {
  hasAdhdTraits: boolean;
  hasDyslexiaTraits: boolean;
  workingMemoryCapacity: 'standard' | 'vulnerable_under_time_pressure';
  optimalSprintDurationMins: number; // e.g. 6 to 10 mins
}

export interface Student {
  id: string;
  externalId?: string; // anonymous public alias e.g. "AST-Y4-012"
  name: string;
  schoolId: string;
  cohortId?: string;
  yearGroup: string; // e.g. "Y4"
  curriculumTrack: 'british' | 'american';
  neuroProfile: StudentNeuroProfile;
  siblingStudentIds?: string[]; // handles sibling/twin dynamics & zero competition
  strengths?: string[];
  activeGapCount?: number;
}

export interface Guardian {
  id: string;
  name: string;
  studentIds: string[];
  preferredLanguage: 'en' | 'ar' | 'bilingual';
  arabicRequestCount: number; // 3-Strike Rule: auto-sets preferredLanguage to 'ar' on 3
  messagingChannel: 'telegram' | 'whatsapp' | 'web';
  chatId: string;
  phoneNumber?: string;
}

export interface Educator {
  id: string;
  schoolId: string;
  name: string;
  email: string;
  assignedCohortIds: string[];
  assignedSubjectIds: string[];
}

export interface CurriculumNode {
  id: string;
  authority: CurriculumAuthority;
  subjectId: string; // "maths" | "english" | "science" | "arabic" | "religion" | etc.
  yearGroup: string;
  strand: string;    // e.g. "Number and Place Value"
  code: string;      // e.g. "Y4.MATH.NPV.1"
  title: string;
  descriptor: string;
  masteryCriteria?: string[];
}

export interface AssessmentItem {
  qNum: string;
  conceptCode: string;
  studentAnswer: string;
  correctAnswer: string;
  errorClass?: ErrorClassification | string;
  status: 'pass' | 'fail' | 'partial';
  confidenceScore?: number;
  cognitiveFactor?: 'working_memory_rush' | 'spatial_transposition' | 'scale_misread' | 'empty_column_omission' | 'interval_misdecode';
}

export interface CanonicalAssessmentMaster {
  id: string;
  schoolId: string;
  yearGroup: string;
  subjectId: string;
  termWeek: number;
  title: string;
  schemaQuestions: Array<{
    qNum: string;
    conceptCode: string;
    maxMarks: number;
    promptText: string;
  }>;
  cleanMasterImageUrl?: string;
}

export interface AssessmentSubmission {
  id: string;
  canonicalMasterId?: string;
  studentId: string;
  guardianId?: string;
  subjectId: string;
  date: string;
  termWeek: number;
  timeAllowedMins?: number;
  timeTakenMins?: number;
  rawScore: number;
  totalScore: number;
  percentage: number;
  items: AssessmentItem[];
  sourceImageUrls: string[];
}

export interface CognitiveGap {
  id: string;
  studentId: string;
  conceptCode: string;
  errorClass: ErrorClassification | string;
  description: string;
  firstObservedDate: string;
  lastObservedDate: string;
  recurrenceCount: number;
  status: TrafficLightStatus;
  exemplarMistake?: string;
  socraticHint?: string;
}

export interface TrendDataPoint {
  date: string;
  weekNumber: number;
  subjectId: string;
  percentageScore: number;
  activeGapCount: number;
  resolvedGapCount: number;
}

export interface RemediationSprint {
  id: string;
  studentId: string;
  studentName: string;
  subjectId: string;
  date: string;
  durationMins: number;
  targetGaps: CognitiveGap[];
  htmlContent: string;
  pdfUrl?: string;
}

export interface CoachingGuide {
  id: string;
  sprintId: string;
  studentId: string;
  studentName: string;
  language: 'en' | 'ar' | 'bilingual';
  htmlContent: string;
  pdfUrl?: string;
}

/* =========================================================================
   PORTS (Hexagonal Architecture Contracts)
   ========================================================================= */

export interface IStoragePort {
  getStudent(id: string): Promise<Student | null>;
  saveStudent(student: Student): Promise<void>;
  listStudents(schoolId?: string, yearGroup?: string): Promise<Student[]>;
  
  getGuardian(id: string): Promise<Guardian | null>;
  getGuardianByChatId(chatId: string): Promise<Guardian | null>;
  saveGuardian(guardian: Guardian): Promise<void>;

  saveAssessment(submission: AssessmentSubmission): Promise<void>;
  getStudentAssessments(studentId: string, subjectId?: string): Promise<AssessmentSubmission[]>;

  getStudentGaps(studentId: string): Promise<CognitiveGap[]>;
  saveStudentGaps(studentId: string, gaps: CognitiveGap[]): Promise<void>;

  saveRemediationSprint(sprint: RemediationSprint): Promise<void>;
  getRemediationSprint(id: string): Promise<RemediationSprint | null>;

  saveCoachingGuide(guide: CoachingGuide): Promise<void>;
  getCoachingGuide(id: string): Promise<CoachingGuide | null>;

  getTrends(studentId: string, subjectId?: string): Promise<TrendDataPoint[]>;
}

export interface IVisionExtractionPort {
  extractAssessment(imageUrls: string[], context: {
    studentId: string;
    subjectId: string;
    yearGroup: string;
  }): Promise<{
    items: AssessmentItem[];
    rawScore: number;
    totalScore: number;
    detectedStudentName?: string;
  }>;
}

export interface IQueuePort {
  enqueueJob<T>(jobName: string, payload: T, delaySeconds?: number): Promise<string>;
}

export interface IVectorPort {
  upsertConceptEmbedding(conceptId: string, vector: number[], metadata: Record<string, unknown>): Promise<void>;
  querySimilarGaps(vector: number[], topK: number): Promise<Array<{ id: string; score: number; metadata: Record<string, unknown> }>>;
}

export interface IMessagingPort {
  sendMessage(chatId: string, text: string): Promise<void>;
  sendConfirmationCard(chatId: string, card: {
    jobId: string;
    imageUrl: string;
    detectedStudent: string;
    detectedSubject: string;
    detectedWeek: string;
  }): Promise<void>;
  deliverRemediationPacks(chatId: string, packs: {
    studentPackHtml: string;
    studentPackPdf?: string;
    coachingGuideHtml: string;
    coachingGuidePdf?: string;
  }): Promise<void>;
}

export interface ISettingsPort {
  get<T>(key: string, defaultValue: T): T;
  set<T>(key: string, value: T): void;
  getAll(): Record<string, unknown>;
}
