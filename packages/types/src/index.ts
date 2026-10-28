/**
 * HEX-AIM: Universal Domain Types & Hexagonal Ports (DDD-Lite)
 * Adaptive Individualized Mastery (Targeted Learning & Remediation Engine)
 */

export type CurriculumAuthority = 
  | 'british-national' 
  | 'egyptian-moe' 
  | 'second-language' 
  | 'american-diploma';

export type AssessmentType =
  | 'weekly_quiz'           // Standard weekly formative classroom quiz
  | 'unit_test'             // End-of-unit summative assessment
  | 'midterm_exam'          // Midterm examination milestone
  | 'practice_run'          // Student-completed remediation sprint or revision sheet
  | 'revision_sprint'       // Rapid revision / targeted review
  | 'diagnostic_binder'     // Comprehensive multi-unit baseline diagnostic
  | 'homework_assignment';  // Take-home assisted worksheet (SOS review only)

export type MilestoneType =
  | 'weekly_formative'
  | 'midterm_summative'
  | 'end_of_unit_summative'
  | 'end_of_year_exam'
  | 'targeted_remediation';

export interface CurriculumSubjectDefinition {
  id: string;
  name: string;
  authority: CurriculumAuthority;
  publisher?: string;
  domains: string[];
  keywords?: string[];
}

export interface DiagnosticScorecard {
  assessmentId: string;
  studentUid: string;
  studentDisplayName: string;
  subjectId: string;
  assessmentType: AssessmentType;
  milestoneType: MilestoneType;
  date: string;
  termWeek: number;
  rawScore: number;
  totalScore: number;
  percentage: number;
  status: 'mastered' | 'progressing' | 'priority_remediation';
  identifiedGapsCount: number;
  errorClasses: string[];
  cognitiveFactors: string[];
  summaryNote: string;
}

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

export interface IdentityVaultRecord {
  studentUid: string;           // Canonical opaque foreign key e.g. "stu_01j9ax8001lara"
  firstName: string;            // e.g. "Lara"
  lastName: string;             // e.g. "Bakri"
  displayName: string;          // e.g. "Lara"
  preferredTitle?: string;      // e.g. "Student Detective"
  dateOfBirth?: string;
  guardianIds: string[];        // e.g. ["guardian_5055012900"]
  preferredParentTitle: string; // e.g. "Dad" or "Mum"
  avatarUrl?: string;
  status: 'active' | 'anonymized' | 'archived';
}

export interface Student {
  id: string;                   // Legacy identifier (soft-deprecated in favor of studentUid)
  studentUid?: string;          // Canonical immutable global ID (ADR-002)
  externalId?: string;          // Anonymous public alias e.g. "AST-Y4-012"
  name: string;
  schoolId: string;
  cohortId?: string;
  yearGroup: string;            // e.g. "Y4"
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
  status?: 'active' | 'warned' | 'rate_limited' | 'downgraded' | 'blocked';
}

export interface GuardianStrikeRecord {
  guardianId: string;
  strikeCount: number;
  maxStrikes: number;
  status: 'active' | 'warned' | 'rate_limited' | 'downgraded' | 'blocked';
  lastStrikeDate?: string;
  lastDuplicateFileHash?: string;
  duplicateUploadCount: number;
  tokensSavedEstimate: number;
  history: Array<{
    timestamp: string;
    fileIdentifier: string;
    reason: string;
    strikeApplied: boolean;
  }>;
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

export type Assessment = AssessmentSubmission;

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
  pdfBuffer?: Uint8Array | ArrayBuffer;
}

export interface CoachingGuide {
  id: string;
  sprintId: string;
  studentId: string;
  studentName: string;
  language: 'en' | 'ar' | 'bilingual';
  htmlContent: string;
  pdfUrl?: string;
  pdfBuffer?: Uint8Array | ArrayBuffer;
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

  // Canonical Assessment Master (Classroom Deduplication)
  saveCanonicalMaster?(master: CanonicalAssessmentMaster): Promise<void>;
  getCanonicalMaster?(id: string): Promise<CanonicalAssessmentMaster | null>;
  findCanonicalMaster?(schoolId: string, yearGroup: string, subjectId: string, termWeek: number): Promise<CanonicalAssessmentMaster | null>;

  getStudentGaps(studentId: string): Promise<CognitiveGap[]>;
  saveStudentGaps(studentId: string, gaps: CognitiveGap[]): Promise<void>;

  saveRemediationSprint(sprint: RemediationSprint): Promise<void>;
  getRemediationSprint(id: string): Promise<RemediationSprint | null>;

  saveCoachingGuide(guide: CoachingGuide): Promise<void>;
  getCoachingGuide(id: string): Promise<CoachingGuide | null>;

  getTrends(studentId: string, subjectId?: string): Promise<TrendDataPoint[]>;

  // Deduplication & Strike Management Port Methods
  getGuardianStrikes(guardianId: string): Promise<GuardianStrikeRecord | null>;
  saveGuardianStrikes(record: GuardianStrikeRecord): Promise<void>;
  hasSeenFileHash(guardianId: string, hash: string): Promise<boolean>;
  recordFileHash(guardianId: string, hash: string, metadata: { filename?: string; sprintId?: string; timestamp: string }, ttlSeconds?: number): Promise<void>;
  getSeenFileMetadata(guardianId: string, hash: string): Promise<{ filename?: string; sprintId?: string; timestamp: string } | null>;

  // Multi-Image Album / Batch Buffer Methods
  addIntakeBatchItem?(batchId: string, item: { url: string; fileUniqueId: string; messageId?: number }): Promise<void>;
  getIntakeBatchItems?(batchId: string): Promise<Array<{ url: string; fileUniqueId: string; messageId?: number }>>;
  clearIntakeBatch?(batchId: string): Promise<void>;
  getIntakeLastSeen?(batchId: string): Promise<number>;

  // Instruction Loop & Chat History
  recordChatMessage?(chatId: string, message: { role: 'user' | 'assistant'; text: string; timestamp: string; messageId?: number }): Promise<void>;
  getRecentChatTurns?(chatId: string, limit?: number): Promise<Array<{ role: 'user' | 'assistant'; text: string; timestamp: string; messageId?: number }>>;
  trackBotMessage?(chatId: string, messageId: number): Promise<void>;
  getBotMessages?(chatId: string): Promise<number[]>;
  clearBotMessages?(chatId: string): Promise<void>;

  // Wave 14: Multi-Guardian Family Unit Methods
  saveFamilyUnit?(family: FamilyUnit): Promise<void>;
  getFamilyUnit?(familyId: string): Promise<FamilyUnit | null>;
  getFamilyByChatId?(chatId: string): Promise<FamilyUnit | null>;
}

export type GuardianRole = 
  | 'primary_coach'      // Head guardian / parent with full administration & intake rights
  | 'co_guardian'        // Co-parent / second guardian with intake & review rights
  | 'observer'           // Read-only family observer (receives weekly executive digests)
  | 'teacher'            // School classroom teacher (cohort heatmap, curriculum alignment, intake)
  | 'head_of_year'       // Year Group Lead / Academic Coordinator (cross-class gradebook & milestone reporting)
  | 'sen_coordinator'    // Special Educational Needs Coordinator / SENCO (ADHD/Dyslexia accommodations)
  | 'private_tutor'      // External private tutor (targeted Socratic drills & gap remediation)
  | 'therapist';         // Speech / Occupational / Behavioral therapist (focus & executive function telemetry)

export interface FamilyGuardianMember {
  guardianId: string;
  chatId: string;
  channel: 'telegram' | 'whatsapp';
  name: string;
  role: GuardianRole;
}

export interface FamilyUnit {
  id: string; // e.g. "family_asten_401"
  name: string; // e.g. "Future Family"
  studentIds: string[]; // ["lara", "maya"]
  guardians: FamilyGuardianMember[];
  createdAt: string;
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
    detectedSubject?: string;
    detectedWeek?: number;
    detectedYearGroup?: string;
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
  sendMessage(chatId: string, text: string, replyToMessageId?: number, replyMarkup?: Record<string, unknown>): Promise<void>;
  sendReceiptSummary(chatId: string, summary: { photoCount: number; mediaGroupId?: string }): Promise<void>;
  sendConfirmationCard(chatId: string, card: {
    jobId: string;
    imageUrl: string;
    detectedStudent: string;
    detectedSubject: string;
    detectedWeek: string;
  }): Promise<void>;
  sendDocument(chatId: string, doc: { buffer?: Uint8Array | ArrayBuffer; url?: string; filename: string; caption?: string }): Promise<void>;
  sendBatchIntakeSummary?(chatId: string, summary: {
    totalPhotos: number;
    students: Array<{
      name: string;
      subject: string;
      week: number;
      pageCount: number;
      isPractice?: boolean;
      score?: string;
      fileItems?: string[];
    }>;
  }): Promise<void>;
  sendInteractiveMenu?(chatId: string, customTitle?: string, lang?: 'en' | 'ar'): Promise<any>;
  deliverRemediationPacks(chatId: string, packs: {
    studentPackHtml?: string;
    studentPackPdf?: string | Uint8Array | ArrayBuffer;
    coachingGuideHtml?: string;
    coachingGuidePdf?: string | Uint8Array | ArrayBuffer;
    summaryUrl?: string;
    studentName?: string;
    subject?: string;
    week?: number;
    skipMenu?: boolean;
  }): Promise<void>;
}

export interface ISettingsPort {
  get<T>(key: string, defaultValue: T): T;
  set<T>(key: string, value: T): void;
  getAll(): Record<string, unknown>;
}

// Wave 15: Voice-First Socratic Audio Coaching Types
export interface AudioTranscriptionResult {
  text: string;
  language?: string;
  durationSeconds?: number;
  confidence?: number;
}

export interface IAudioTranscriptionPort {
  transcribeAudio(audioBuffer: Uint8Array | ArrayBuffer, mimeType: string): Promise<AudioTranscriptionResult>;
}

export interface SocraticOralEvaluation {
  transcript: string;
  conceptMasteryPct: number;
  detectedKeyVocab: string[];
  missingKeyVocab: string[];
  misconceptions: string[];
  affirmationPraise: string;
  socraticFollowUpQuestion: string;
  suggestedBloomAdjustment: 'maintain' | 'advance' | 'scaffold';
}

// Wave 16: Adaptive Bloom Taxonomy Types
export type BloomLevel = 'remember' | 'understand' | 'apply' | 'analyze' | 'evaluate' | 'create';

export interface BloomDifficultyRecord {
  studentId: string;
  subjectId: string;
  conceptCode: string;
  currentBloomLevel: BloomLevel;
  levelStreakCount: number;
  needsScaffolding: boolean;
  lastAttemptAt: string;
}

// Wave 17: Multi-Subject Cohort Analytics Heatmap Types
export interface CohortMasteryCell {
  studentId: string;
  studentName: string;
  conceptCode: string;
  conceptTitle: string;
  masteryPct: number;
  status: 'mastered' | 'progressing' | 'critical_gap';
}

export interface CohortAnalyticsMatrix {
  classId: string;
  yearGroup: string;
  subjectId: string;
  totalStudents: number;
  matrix: CohortMasteryCell[];
  criticalInterventionClusters: Array<{
    conceptCode: string;
    conceptTitle: string;
    studentCount: number;
    studentNames: string[];
  }>;
}

// Wave 19: Dynamic Curriculum Year-Group & Concept Dependency Graph Types
export interface CurriculumConceptNode {
  code: string;
  subject: 'science' | 'maths' | 'english' | 'humanities' | 'arabic';
  yearGroup: 'Y3' | 'Y4' | 'Y5' | 'Y6';
  title: string;
  strand: string;
  prerequisites: string[];
  coRequisites?: string[];
  recommendedTemplateIds: string[];
  bloomTarget: BloomLevel;
}

export interface ConceptDependencyChain {
  targetCode: string;
  targetTitle: string;
  prerequisitePath: Array<{
    code: string;
    title: string;
    yearGroup: string;
    isMastered: boolean;
  }>;
  rootBlockerCode?: string;
}

export interface StudentCurriculumRecommendation {
  studentId: string;
  studentName: string;
  yearGroup: string;
  primaryRootBlocker: {
    code: string;
    title: string;
    yearGroup: string;
    prerequisiteFor: string;
  };
  recommendedTemplateId: string;
  recommendedTemplateTitle: string;
  dependencyChain: ConceptDependencyChain;
}

// Wave 22: Predictive Cognitive Mastery Decay & Spaced Repetition Types
export interface StudentCognitiveProfile {
  studentId: string;
  studentName: string;
  workingMemoryIndex: number; // 0.7 (ADHD / fragile working memory) to 1.3 (high working memory)
  adhdVisualAnchorMultiplier: number; // e.g. 1.4x retention boost when elevator model / visual scaffolding is active
  baseStabilityHalfLifeDays: number; // standard baseline days to 50% decay (e.g. 7 days)
  hasAdhdFocusAccommodations: boolean;
}

export type MasteryDecayStatus = 'healthy' | 'vulnerable' | 'critical_decay';

export interface ConceptDecayRecord {
  studentId: string;
  conceptCode: string;
  conceptTitle: string;
  subjectId: string;
  peakMastery: number; // 0 - 100
  predictedRetention: number; // 0 - 100
  lastPracticedDate: string;
  elapsedDays: number;
  effectiveHalfLifeDays: number;
  reviewStreakCount: number;
  decayStatus: MasteryDecayStatus;
  daysUntilCritical: number; // days until retention drops below 60%
  recommendedReviewDate: string;
  suggestedTemplateId: string;
}

export interface SpacedRepetitionQueueItem {
  conceptCode: string;
  conceptTitle: string;
  subjectId: string;
  currentRetention: number;
  urgency: 'high' | 'medium' | 'low';
  urgencyReason: string;
  recommendedDurationMins: number;
  suggestedTemplateId: string;
}

// Wave 23: 2-Way School MIS & Real-Time Classwork Integration Types
export type SchoolMisProvider = 'sims' | 'google_classroom' | 'ms_teams' | 'isams' | 'arbor';

export interface SchoolMisIntegrationConfig {
  schoolId: string;
  schoolName: string;
  provider: SchoolMisProvider;
  syncDirection: 'two_way' | 'pull_only' | 'push_only';
  endpointUrl: string;
  webhookSecret: string;
  realTimeActive: boolean;
  lastSyncedAt?: string;
}

export interface SchoolClassworkSubmission {
  id: string;
  schoolId: string;
  studentId: string;
  assignmentId: string;
  title: string;
  subjectId: string;
  termWeek: number;
  submittedAt: string;
  rawGrade: string | number;
  scannedWorkUrls: string[];
  teacherComments?: string;
  pedagogicTags?: string[];
  autoRemediationSprintId?: string;
}

export interface RemediationSyncPayload {
  submissionId: string;
  studentId: string;
  schoolId: string;
  remediationSprintId: string;
  resolvedConcepts: string[];
  postRemediationScore: number;
  homeFeedbackNotes: string;
  syncedAt: string;
  status: 'synced_to_school' | 'pending' | 'failed';
}

export interface SchoolSyncTelemetry {
  schoolId: string;
  provider: SchoolMisProvider;
  isOnline: boolean;
  lastWebhookReceivedAt: string;
  totalSubmissionsIngested: number;
  remediationsPushedBack: number;
  activeClassworkLinks: Array<{
    assignmentId: string;
    title: string;
    studentCount: number;
    status: 'in_remediation' | 'gradebook_updated';
  }>;
}

// ==========================================
// WAVE 24: SOCRATIC MULTI-MODAL INPAINTING
// ==========================================

export interface InpaintingBoundingBox {
  x: number;          // Normalized or pixel x (0-1000 or px)
  y: number;          // Normalized or pixel y
  width: number;
  height: number;
  label: string;
  confidence: number;
}

export type InpaintingRedactionMode = 'redact_and_hint' | 'side_by_side_contrast' | 'scaffold_only';

export interface SocraticInpaintingOverlay {
  questionNumber: string;
  conceptId: string;
  errorTaxonomyId: string;
  boundingBox: InpaintingBoundingBox;
  misconceptionSummary: string;
  socraticPromptText: string;
  visualScaffoldType: 'particle_proximity_grid' | 'place_value_scale' | 'fraction_bar_model' | 'timeline_axis';
  svgScaffoldSnippet: string;
  redactedQuestionText: string;
  guidedBlankPrompt: string;
  remediationActionUrl: string;
}

export interface InpaintingInspectionResult {
  submissionId: string;
  studentId: string;
  pageNumber: number;
  originalScanUrl: string;
  detectedErrorsCount: number;
  overlays: SocraticInpaintingOverlay[];
}



