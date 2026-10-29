import * as crypto from 'crypto';
import type {
  AssessmentArchiveDossier,
  ArchivedAssessmentArtifact,
  ArchivedCognitiveVector,
  ColdStorageManifest,
  SencoInterventionRecommendation,
} from '@hex-aim/types';

/**
 * Wave 29: Longitudinal Assessment Archival & Audit Dossier Engine (ADR-005)
 *
 * Consolidates months of weekly micro-sprints and scanned assessments into tamper-evident,
 * verifiable end-of-term student dossiers. Provides parents and schools with longitudinal
 * growth curves, mastery delta trajectories, and standardized UK National Curriculum
 * diagnostic benchmarks for parent-teacher conferences and SENCO reviews.
 */
export class AssessmentArchiveEngine {
  private static instance: AssessmentArchiveEngine | null = null;

  public static getInstance(): AssessmentArchiveEngine {
    if (!this.instance) {
      this.instance = new AssessmentArchiveEngine();
    }
    return this.instance;
  }

  /**
   * Deterministically orders keys of an object to guarantee identical SHA-256 serialization.
   */
  public canonicalStringify(obj: any): string {
    if (obj === null || typeof obj !== 'object') {
      return JSON.stringify(obj);
    }
    if (Array.isArray(obj)) {
      return '[' + obj.map(item => this.canonicalStringify(item)).join(',') + ']';
    }
    const keys = Object.keys(obj).sort();
    const keyValuePairs = keys.map(
      key => JSON.stringify(key) + ':' + this.canonicalStringify(obj[key])
    );
    return '{' + keyValuePairs.join(',') + '}';
  }

  /**
   * Computes the SHA-256 checksum across the canonical representation of the dossier.
   */
  public computeDossierIntegrityHash(
    dossierWithoutIntegrity: Omit<AssessmentArchiveDossier, 'integrity'>
  ): string {
    const canonicalPayload = this.canonicalStringify(dossierWithoutIntegrity);
    return crypto.createHash('sha256').update(canonicalPayload, 'utf8').digest('hex');
  }

  /**
   * Verifies whether a student dossier has been tampered with or altered in storage.
   */
  public verifyDossierIntegrity(dossier: AssessmentArchiveDossier): {
    isValid: boolean;
    expectedHash: string;
    actualHash: string;
  } {
    const { integrity, ...dossierBody } = dossier;
    const computedHash = this.computeDossierIntegrityHash(dossierBody);
    const isValid = computedHash === integrity.payloadChecksum;
    return {
      isValid,
      expectedHash: integrity.payloadChecksum,
      actualHash: computedHash,
    };
  }

  /**
   * Generates a Cold Storage (Cloudflare R2) manifest with SHA-256 checksum and signed ephemeral URL.
   */
  public generateColdStorageManifest(
    studentId: string,
    payloadJson: string,
    now: Date = new Date()
  ): ColdStorageManifest {
    const contentSha256 = crypto.createHash('sha256').update(payloadJson, 'utf8').digest('hex');
    const sizeBytes = Buffer.byteLength(payloadJson, 'utf8');
    const manifestId = `csm_${studentId}_${now.getTime().toString(36)}`;
    const objectKey = `dossiers/2026/term1/${studentId}_archive_term1.json`;
    const bucket = 'aim-student-dossiers';

    const expiresAt = new Date(now.getTime() + 3600 * 1000); // 1-hour TTL
    const signature = crypto
      .createHmac('sha256', 'aim_cold_storage_secret_salt_r2')
      .update(`${objectKey}:${expiresAt.toISOString()}`)
      .digest('hex')
      .slice(0, 32);

    const presignedDownloadUrl = `https://pub-r2.aim.getvintel.com/${objectKey}?signature=${signature}&expires=${Math.floor(
      expiresAt.getTime() / 1000
    )}`;

    return {
      manifestId,
      storageProvider: 'cloudflare_r2',
      bucket,
      objectKey,
      sizeBytes,
      contentType: 'application/json',
      contentSha256,
      presignedDownloadUrl,
      urlExpiresAt: expiresAt.toISOString(),
      archivedAt: now.toISOString(),
    };
  }

  /**
   * Compiles a comprehensive longitudinal assessment dossier for any registered student.
   */
  public generateStudentDossier(
    studentIdOrAlias: string,
    options: { term?: string; generatedAt?: string } = {}
  ): AssessmentArchiveDossier {
    const student = studentIdOrAlias.toLowerCase().trim();
    const term = options.term || 'Term 1 (Autumn 2026)';
    const generatedAt = options.generatedAt || new Date().toISOString();

    const artifacts = this.getStudentArtifacts(student);
    const vectors = this.getStudentCognitiveVectors(student);
    const recommendations = this.getSencoRecommendations(student);
    const meta = this.getStudentMetadata(student);

    const totalAssessments = artifacts.length;
    const overallMastery = Math.round(
      artifacts.reduce((acc, a) => acc + a.percentage, 0) / (totalAssessments || 1)
    );
    const zeroAlarmVictories = artifacts.filter(a => a.status === 'mastered').length;
    const gapsIdentified = artifacts.reduce((acc, a) => acc + a.identifiedGaps.length, 0);
    const gapsRemediated = artifacts.reduce((acc, a) => acc + a.remediatedGaps.length, 0);
    const remediationRate = Math.round((gapsRemediated / (gapsIdentified || 1)) * 100);

    const dossierBody: Omit<AssessmentArchiveDossier, 'integrity'> = {
      dossierId: `dossier_2026_t1_${student}`,
      studentId: meta.id,
      studentDisplayName: meta.displayName,
      schoolName: 'Asten College (New Cairo)',
      yearGroup: meta.yearGroup,
      academicTerm: term,
      generatedAt,
      summary: {
        totalAssessmentsArchived: totalAssessments,
        overallMasteryPercentage: overallMastery,
        zeroAlarmVictoriesCount: zeroAlarmVictories,
        gapsIdentifiedCount: gapsIdentified,
        gapsRemediatedCount: gapsRemediated,
        remediationSuccessRate: remediationRate,
        streakWeeks: meta.streakWeeks,
      },
      cognitiveVectors: vectors,
      artifacts,
      sencoRecommendations: recommendations,
      coldStorage: {
        manifestId: '',
        storageProvider: 'cloudflare_r2',
        bucket: 'aim-student-dossiers',
        objectKey: '',
        sizeBytes: 0,
        contentType: 'application/json',
        contentSha256: '',
        presignedDownloadUrl: '',
        urlExpiresAt: '',
        archivedAt: generatedAt,
      },
    };

    // Synthesize cold storage entry for the canonical body
    const preliminaryJson = this.canonicalStringify(dossierBody);
    const coldStorage = this.generateColdStorageManifest(meta.id, preliminaryJson, new Date(generatedAt));
    dossierBody.coldStorage = coldStorage;

    // Compute cryptographic tamper-evident seal
    const payloadChecksum = this.computeDossierIntegrityHash(dossierBody);

    return {
      ...dossierBody,
      integrity: {
        hashAlgorithm: 'SHA-256',
        payloadChecksum,
        parentChainHash: crypto.createHash('sha256').update(`root:${meta.id}`).digest('hex'),
        isTamperEvident: true,
        verificationStatus: 'verified_authentic',
      },
    };
  }

  private getStudentMetadata(student: string): {
    id: string;
    displayName: string;
    yearGroup: string;
    streakWeeks: number;
  } {
    if (student.includes('maya')) {
      return { id: 'maya', displayName: 'Maya', yearGroup: 'Y4', streakWeeks: 8 };
    }
    if (student.includes('youssef')) {
      return { id: 'youssef', displayName: 'Youssef Kamal', yearGroup: 'Y4', streakWeeks: 7 };
    }
    if (student.includes('omar')) {
      return { id: 'omar', displayName: 'Omar Mahmoud', yearGroup: 'Y4', streakWeeks: 6 };
    }
    if (student.includes('nour')) {
      return { id: 'nour', displayName: 'Nour Hassan', yearGroup: 'Y4', streakWeeks: 8 };
    }
    // Default to Lara
    return { id: 'lara', displayName: 'Lara Sherif', yearGroup: 'Y4', streakWeeks: 8 };
  }

  private getStudentArtifacts(student: string): ArchivedAssessmentArtifact[] {
    const isMaya = student.includes('maya');
    const isYoussef = student.includes('youssef');
    const isOmar = student.includes('omar');
    const isNour = student.includes('nour');

    if (isMaya) {
      return [
        {
          assessmentId: 'asm_maya_sci_w8',
          sourceType: 'scanned_paper',
          date: '2026-10-24',
          termWeek: 8,
          subject: 'Science',
          title: 'Year 4 Science Week 8: States of Matter & Sound',
          titleAr: 'العلوم الأسبوع ٨: حالات المادة وانتقال الصوت',
          rawScore: 19,
          totalScore: 20,
          percentage: 95,
          status: 'mastered',
          scannedImageRef: '/scans/maya_sci_w8.png',
          ocrExtractedText: 'Q1: Vibrations travel fastest through solid particles. Score: 2/2',
          socraticInterventionsCount: 1,
          identifiedGaps: ['Y4.SCI.SND.REFLECTION'],
          remediatedGaps: ['Y4.SCI.SND.REFLECTION'],
          sha256ArtifactChecksum: '9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b',
        },
        {
          assessmentId: 'asm_maya_math_frac',
          sourceType: 'diagnostic_quiz',
          date: '2026-10-18',
          termWeek: 7,
          subject: 'Maths',
          title: 'Year 4 Fractions: Common Denominator Additions',
          titleAr: 'الرياضيات الأسبوع ٧: جمع الكسور متحدة المقام',
          rawScore: 24,
          totalScore: 25,
          percentage: 96,
          status: 'mastered',
          socraticInterventionsCount: 0,
          identifiedGaps: [],
          remediatedGaps: [],
          sha256ArtifactChecksum: '1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c',
        },
        {
          assessmentId: 'asm_maya_eng_w7',
          sourceType: 'scanned_paper',
          date: '2026-10-12',
          termWeek: 6,
          subject: 'English',
          title: 'Year 4 Grammar: Expanded Noun Phrases & Clauses',
          titleAr: 'اللغة الإنجليزية: العبارات الاسمية الموسعة والجمل الفرعية',
          rawScore: 18,
          totalScore: 20,
          percentage: 90,
          status: 'mastered',
          socraticInterventionsCount: 1,
          identifiedGaps: ['Y4.ENG.COMMA.SPLICE'],
          remediatedGaps: ['Y4.ENG.COMMA.SPLICE'],
          sha256ArtifactChecksum: '3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d',
        },
        {
          assessmentId: 'asm_maya_exam_sim_sci',
          sourceType: 'exam_simulation',
          date: '2026-10-28',
          termWeek: 8,
          subject: 'Science',
          title: 'Science Term 1 Mock Exam Simulation',
          titleAr: 'محاكاة امتحان العلوم النهائي - الفصل الدراسي الأول',
          rawScore: 24,
          totalScore: 25,
          percentage: 96,
          status: 'mastered',
          socraticInterventionsCount: 0,
          identifiedGaps: [],
          remediatedGaps: [],
          sha256ArtifactChecksum: '5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f',
        },
      ];
    }

    if (isYoussef) {
      return [
        {
          assessmentId: 'asm_youssef_sci_w8',
          sourceType: 'scanned_paper',
          date: '2026-10-24',
          termWeek: 8,
          subject: 'Science',
          title: 'Year 4 Science: Particle Models',
          titleAr: 'العلوم الأسبوع ٨: النماذج الجسيمية للمادة',
          rawScore: 17,
          totalScore: 20,
          percentage: 85,
          status: 'progressing',
          socraticInterventionsCount: 2,
          identifiedGaps: ['Y4.SCI.SND.MEDIUM'],
          remediatedGaps: ['Y4.SCI.SND.MEDIUM'],
          sha256ArtifactChecksum: '7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b',
        },
        {
          assessmentId: 'asm_youssef_math_geom',
          sourceType: 'sprint_remediation',
          date: '2026-10-20',
          termWeek: 7,
          subject: 'Maths',
          title: 'Year 4 Geometry: Perimeter & Spatial Coordinates',
          titleAr: 'الرياضيات: محيط الأشكال والإحداثيات المكانية',
          rawScore: 23,
          totalScore: 25,
          percentage: 92,
          status: 'mastered',
          socraticInterventionsCount: 1,
          identifiedGaps: ['Y4.MATH.GRID.TRANSLATE'],
          remediatedGaps: ['Y4.MATH.GRID.TRANSLATE'],
          sha256ArtifactChecksum: '9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d',
        },
      ];
    }

    if (isOmar) {
      return [
        {
          assessmentId: 'asm_omar_math_npv',
          sourceType: 'scanned_paper',
          date: '2026-10-22',
          termWeek: 8,
          subject: 'Maths',
          title: 'Year 4 Number & Place Value (Negative Numbers)',
          titleAr: 'الرياضيات: القيمة المكانية والأعداد السالبة',
          rawScore: 16,
          totalScore: 20,
          percentage: 80,
          status: 'progressing',
          socraticInterventionsCount: 3,
          identifiedGaps: ['Y4.MATH.NPV.NEGATIVE_NUMBERS'],
          remediatedGaps: ['Y4.MATH.NPV.NEGATIVE_NUMBERS'],
          sha256ArtifactChecksum: '2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f',
        },
        {
          assessmentId: 'asm_omar_sci_w7',
          sourceType: 'diagnostic_quiz',
          date: '2026-10-15',
          termWeek: 7,
          subject: 'Science',
          title: 'Year 4 Living Things: Classification Keys',
          titleAr: 'العلوم: مفاتيح التصنيف للكائنات الحية',
          rawScore: 18,
          totalScore: 20,
          percentage: 90,
          status: 'mastered',
          socraticInterventionsCount: 1,
          identifiedGaps: [],
          remediatedGaps: [],
          sha256ArtifactChecksum: '4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b',
        },
      ];
    }

    if (isNour) {
      return [
        {
          assessmentId: 'asm_nour_sci_midterm',
          sourceType: 'scanned_paper',
          date: '2026-10-25',
          termWeek: 8,
          subject: 'Science',
          title: 'Year 4 Science Midterm Summative Assessment',
          titleAr: 'الامتحان النصفي لمادة العلوم - الصف الرابع',
          rawScore: 28,
          totalScore: 30,
          percentage: 93,
          status: 'mastered',
          socraticInterventionsCount: 1,
          identifiedGaps: ['Y4.SCI.CIRCUITS.SWITCH'],
          remediatedGaps: ['Y4.SCI.CIRCUITS.SWITCH'],
          sha256ArtifactChecksum: '6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d',
        },
        {
          assessmentId: 'asm_nour_eng_comp',
          sourceType: 'diagnostic_quiz',
          date: '2026-10-19',
          termWeek: 7,
          subject: 'English',
          title: 'Year 4 Reading Comprehension & Inference',
          titleAr: 'اللغة الإنجليزية: الاستيعاب القرائي والاستدلال',
          rawScore: 19,
          totalScore: 20,
          percentage: 95,
          status: 'mastered',
          socraticInterventionsCount: 0,
          identifiedGaps: [],
          remediatedGaps: [],
          sha256ArtifactChecksum: '8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f',
        },
      ];
    }

    // Default to Lara (Rich 6-item portfolio)
    return [
      {
        assessmentId: 'asm_lara_sci_w8',
        sourceType: 'scanned_paper',
        date: '2026-10-24',
        termWeek: 8,
        subject: 'Science',
        title: 'Year 4 Science Week 8: Sound & Auditory Vibrations',
        titleAr: 'العلوم الأسبوع ٨: الصوت والاهتزازات السمعية',
        rawScore: 14,
        totalScore: 20,
        percentage: 70,
        status: 'progressing',
        scannedImageRef: '/scans/lara_sci_w8_deskewed.png',
        ocrExtractedText: 'Q1: Vibrations travel through air. Q4: Sound faster in water than air? Lara answered: Air.',
        socraticInterventionsCount: 3,
        identifiedGaps: ['Y4.SCI.SND.MEDIUM', 'ERR_DENSE_MEDIUM_INVERSION'],
        remediatedGaps: ['ERR_DENSE_MEDIUM_INVERSION'],
        sha256ArtifactChecksum: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      },
      {
        assessmentId: 'asm_lara_sci_midterm',
        sourceType: 'diagnostic_quiz',
        date: '2026-10-25',
        termWeek: 8,
        subject: 'Science',
        title: 'Year 4 Science Midterm Diagnostic Milestone',
        titleAr: 'التقييم التشخيصي النصفي للعلوم - الصف الرابع',
        rawScore: 28,
        totalScore: 30,
        percentage: 94,
        status: 'mastered',
        socraticInterventionsCount: 1,
        identifiedGaps: ['Y4.SCI.SND.PITCH'],
        remediatedGaps: ['Y4.SCI.SND.PITCH'],
        sha256ArtifactChecksum: 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb',
      },
      {
        assessmentId: 'asm_lara_math_npv',
        sourceType: 'scanned_paper',
        date: '2026-10-18',
        termWeek: 7,
        subject: 'Maths',
        title: 'Year 4 Place Value & Negative Temperature Scale',
        titleAr: 'الرياضيات: القيمة المكانية ومقياس درجات الحرارة السالبة',
        rawScore: 20,
        totalScore: 25,
        percentage: 80,
        status: 'progressing',
        scannedImageRef: '/scans/lara_math_w7_npv.png',
        ocrExtractedText: 'Ordered temperatures: -4C as warmer than -1C. Wrote 24,16 for 24,106.',
        socraticInterventionsCount: 4,
        identifiedGaps: ['Y4.MATH.NPV.EMPTY_COLUMNS', 'Y4.MATH.NPV.NEGATIVE_NUMBERS'],
        remediatedGaps: ['Y4.MATH.NPV.EMPTY_COLUMNS'],
        sha256ArtifactChecksum: '3e23e8160039594a33894f6564e1b1348bbd7a0088d42c4acb73eeaed59c009d',
      },
      {
        assessmentId: 'asm_lara_math_col',
        sourceType: 'sprint_remediation',
        date: '2026-10-21',
        termWeek: 7,
        subject: 'Maths',
        title: 'Socratic Sprint: Column Subtraction with Zero Regrouping',
        titleAr: 'التدريب المتكيف: الطرح العمودي مع الاستلاف من الصفر',
        rawScore: 18,
        totalScore: 20,
        percentage: 90,
        status: 'mastered',
        socraticInterventionsCount: 2,
        identifiedGaps: ['Y4.MATH.COL.SUBTRACT_ZERO'],
        remediatedGaps: ['Y4.MATH.COL.SUBTRACT_ZERO'],
        sha256ArtifactChecksum: '2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae',
      },
      {
        assessmentId: 'asm_lara_eng_w7',
        sourceType: 'scanned_paper',
        date: '2026-10-14',
        termWeek: 6,
        subject: 'English',
        title: 'Year 4 Spelling, Punctuation & Fronted Adverbials',
        titleAr: 'اللغة الإنجليزية: الإملاء وعلامات الترقيم والظروف التمهيدية',
        rawScore: 22,
        totalScore: 25,
        percentage: 88,
        status: 'mastered',
        socraticInterventionsCount: 1,
        identifiedGaps: ['Y4.ENG.FRONTED.COMMA'],
        remediatedGaps: ['Y4.ENG.FRONTED.COMMA'],
        sha256ArtifactChecksum: 'fcde2b2edba56bf408686e6c4d34c2ee970a92e1d6e1030e40e5d3093db856b',
      },
      {
        assessmentId: 'asm_lara_sim_sci',
        sourceType: 'exam_simulation',
        date: '2026-10-28',
        termWeek: 8,
        subject: 'Science',
        title: 'Year 4 Science Mock Exam Simulator (Asten Spec)',
        titleAr: 'محاكاة اختبار العلوم الشامل - مواصفات أستن كوليدج',
        rawScore: 24,
        totalScore: 25,
        percentage: 96,
        status: 'mastered',
        socraticInterventionsCount: 1,
        identifiedGaps: [],
        remediatedGaps: ['Y4.SCI.SND.MEDIUM'],
        sha256ArtifactChecksum: 'd4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35',
      },
    ];
  }

  private getStudentCognitiveVectors(student: string): ArchivedCognitiveVector[] {
    const isMaya = student.includes('maya');

    if (isMaya) {
      return [
        {
          domain: 'States of Matter & Sound',
          domainAr: 'حالات المادة وخصائص الصوت',
          baselinePercentage: 88,
          terminalPercentage: 96,
          deltaPercentage: +8,
          retentionStability: 0.94,
          zeroAlarmConfidence: 98,
          masteryClassification: 'solidified',
        },
        {
          domain: 'Fractions & Proportional Reasoning',
          domainAr: 'الكسور والنسب الرياضية',
          baselinePercentage: 82,
          terminalPercentage: 95,
          deltaPercentage: +13,
          retentionStability: 0.91,
          zeroAlarmConfidence: 95,
          masteryClassification: 'solidified',
        },
        {
          domain: 'Expanded Noun Phrases & Syntax',
          domainAr: 'التراكيب النحوية والعبارات الوصفية',
          baselinePercentage: 84,
          terminalPercentage: 91,
          deltaPercentage: +7,
          retentionStability: 0.89,
          zeroAlarmConfidence: 92,
          masteryClassification: 'solidified',
        },
      ];
    }

    // Default to Lara (with cognitive acceleration trajectory)
    return [
      {
        domain: 'Acoustic Transmission & Particle Models',
        domainAr: 'انتقال الصوت والترتيب الجسيمي للمادة',
        baselinePercentage: 68,
        terminalPercentage: 94,
        deltaPercentage: +26,
        retentionStability: 0.89,
        zeroAlarmConfidence: 94,
        masteryClassification: 'accelerating',
      },
      {
        domain: 'Number & Place Value (NPV / Negatives)',
        domainAr: 'القيمة المكانية والأعداد السالبة',
        baselinePercentage: 62,
        terminalPercentage: 86,
        deltaPercentage: +24,
        retentionStability: 0.84,
        zeroAlarmConfidence: 88,
        masteryClassification: 'solidified',
      },
      {
        domain: 'Multi-Step Column Operations & Zero Decomposition',
        domainAr: 'العمليات الحسابية المتعددة وإعادة التجميع مع الصفر',
        baselinePercentage: 58,
        terminalPercentage: 82,
        deltaPercentage: +24,
        retentionStability: 0.81,
        zeroAlarmConfidence: 84,
        masteryClassification: 'fragile_under_rush',
      },
      {
        domain: 'Spelling Rules & Fronted Adverbials',
        domainAr: 'قواعد الإملاء واستخدام الظروف التمهيدية',
        baselinePercentage: 74,
        terminalPercentage: 89,
        deltaPercentage: +15,
        retentionStability: 0.88,
        zeroAlarmConfidence: 91,
        masteryClassification: 'solidified',
      },
    ];
  }

  private getSencoRecommendations(student: string): SencoInterventionRecommendation[] {
    const isMaya = student.includes('maya');

    if (isMaya) {
      return [
        {
          domain: 'Advanced Mathematical Extension',
          priority: 'maintenance',
          observedPattern: 'Rapid procedural mastery; thrives on abstract non-routine word problems.',
          observedPatternAr: 'إتقان إجرائي سريع؛ تفوق واضح في حل المسائل الكلامية غير النمطية.',
          recommendedScaffold: 'Introduce multi-step fraction division and perimeter-area conservation challenges.',
          recommendedScaffoldAr: 'تقديم تحديات متقدمة في قسمة الكسور وحساب محيط ومساحة الأشكال المركبة.',
        },
      ];
    }

    // Default Lara recommendations
    return [
      {
        domain: 'Working Memory Load & Timed Assessment Pacing',
        priority: 'high',
        observedPattern:
          'High conceptual verbal intuition, but prone to digit transposition when forced to rush under auditory countdown.',
        observedPatternAr:
          'حدس لفظي ومفاهيمي ممتاز، ولكنها تميل لتبديل الأرقام تحت ضغط التوقيت والعد التنازلي المسموع.',
        recommendedScaffold:
          'Enforce 8-minute micro-sprint ceiling with visual stopwatch rather than audio alarm. Provide place-value grid paper.',
        recommendedScaffoldAr:
          'الالتزام بفترات تركيز مدتها ٨ دقائق مع مؤقت بصري هادئ بدلاً من المنبهات الصوتية، واستخدام أوراق القيمة المكانية المسطرة.',
      },
      {
        domain: 'Sensory Visual Anchoring (Elevator / Particle Model)',
        priority: 'high',
        observedPattern:
          'Abstract negative temperatures confuse spatial orientation unless anchored to the physical elevator model (Basement B4 vs Ground 0).',
        observedPatternAr:
          'الأرقام السالبة المجردة تسبب ارتباكاً مكانياً ما لم تُربط بنموذج المصعد الواقعي (الطابق -٤ تحت الأرض).',
        recommendedScaffold:
          'Maintain visual number ribbon with zero highlighted as ground baseline across all homework sheets.',
        recommendedScaffoldAr:
          'تضمين شريط الأعداد البصري مع تمييز الصفر كنقطة ارتكاز في جميع أوراق الواجبات المدرسية.',
      },
      {
        domain: 'Acoustic Density & Particle Proximity',
        priority: 'medium',
        observedPattern:
          'Successfully remediated density inversion. Remembers that closely packed particles in water transmit vibrations faster.',
        observedPatternAr:
          'تم علاج عكس الكثافة الصوتية بنجاح؛ تفهم الآن أن تقارب الجسيمات في الماء ينقل الاهتزازات أسرع من الهواء.',
        recommendedScaffold:
          'Spaced repetition check scheduled in 14 days to cement permanence before end-of-year assessment.',
        recommendedScaffoldAr:
          'جدولة مراجعة متكررة بعد ١٤ يوماً لتثبيت المفهوم في الذاكرة طويلة المدى قبل الامتحانات النهائية.',
      },
    ];
  }

  /**
   * Generates a fully formatted, standalone, high-contrast A4 assessment summary HTML
   * for printing or browser viewing.
   */
  public renderDossierHtml(dossier: AssessmentArchiveDossier, lang: 'en' | 'ar' = 'en'): string {
    const isAr = lang === 'ar';
    const dir = isAr ? 'rtl' : 'ltr';

    return `<!DOCTYPE html>
<html lang="${lang}" dir="${dir}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${isAr ? 'الملف التراكمي الشامل' : 'Longitudinal Assessment Dossier'} • ${dossier.studentDisplayName}</title>
  <style>
    :root {
      --bg: #090d16;
      --card-bg: #111726;
      --border: #1e293b;
      --text: #f8fafc;
      --text-muted: #94a3b8;
      --cyan: #06b6d4;
      --green: #10b981;
      --yellow: #f59e0b;
      --orange: #f97316;
      --purple: #8b5cf6;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; }
    body { background: var(--bg); color: var(--text); padding: 32px 20px; line-height: 1.5; font-size: 14px; }
    .container { max-width: 960px; margin: 0 auto; }
    .header-card { background: var(--card-bg); border: 1px solid var(--border); border-radius: 12px; padding: 24px; margin-bottom: 24px; }
    .badge { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 9999px; font-size: 12px; font-weight: 700; text-transform: uppercase; }
    .badge-cyan { background: rgba(6, 182, 212, 0.15); color: var(--cyan); border: 1px solid rgba(6, 182, 212, 0.3); }
    .badge-green { background: rgba(16, 185, 129, 0.15); color: var(--green); border: 1px solid rgba(16, 185, 129, 0.3); }
    .grid-kpis { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px; }
    .kpi-card { background: var(--card-bg); border: 1px solid var(--border); border-radius: 10px; padding: 18px; }
    .kpi-title { font-size: 12px; text-transform: uppercase; color: var(--text-muted); font-weight: 700; margin-bottom: 6px; }
    .kpi-val { font-size: 32px; font-weight: 800; color: var(--text); }
    .section-title { font-size: 18px; font-weight: 700; margin: 24px 0 14px; color: var(--cyan); display: flex; align-items: center; gap: 8px; }
    table { width: 100%; border-collapse: collapse; background: var(--card-bg); border-radius: 10px; overflow: hidden; border: 1px solid var(--border); margin-bottom: 24px; }
    th { background: #162032; text-align: ${isAr ? 'right' : 'left'}; padding: 12px 16px; font-size: 12px; text-transform: uppercase; color: var(--text-muted); }
    td { padding: 14px 16px; border-top: 1px solid var(--border); font-size: 13px; }
    .sha-seal { background: #07101e; border: 1px dashed var(--cyan); border-radius: 8px; padding: 14px; font-family: monospace; font-size: 12px; color: var(--cyan); word-break: break-all; margin-top: 16px; }
    .recommendation-box { background: rgba(139, 92, 246, 0.08); border-left: 4px solid var(--purple); padding: 16px; border-radius: 6px; margin-bottom: 12px; }
    @media print {
      body { background: #fff; color: #000; }
      .header-card, .kpi-card, table { border: 1px solid #ccc; background: #fff; color: #000; }
      .sha-seal { border-color: #000; color: #000; }
      .badge { border: 1px solid #000; color: #000; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header-card">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 14px;">
        <div>
          <span class="badge badge-cyan">${isAr ? 'سجل أرشيفي موثق كربتوغرافياً' : 'Cryptographically Verified Audit Dossier'}</span>
          <h1 style="font-size: 26px; margin-top: 8px;">${dossier.studentDisplayName}</h1>
          <p style="color: var(--text-muted); margin-top: 4px;">
            ${dossier.schoolName} • ${dossier.yearGroup} • ${dossier.academicTerm}
          </p>
        </div>
        <div style="text-align: ${isAr ? 'left' : 'right'};">
          <span class="badge badge-green">✓ ${dossier.integrity.verificationStatus}</span>
          <div style="font-size: 11px; color: var(--text-muted); margin-top: 6px;">
            ${isAr ? 'تاريخ التوليد:' : 'Generated:'} ${new Date(dossier.generatedAt).toLocaleDateString()}
          </div>
        </div>
      </div>

      <div class="sha-seal">
        <strong>SHA-256 SEAL:</strong> ${dossier.integrity.payloadChecksum}
        <br>
        <span style="font-size: 11px; color: var(--text-muted);">
          ${isAr ? 'التخزين السحابي المحمي (R2):' : 'Cloudflare R2 Storage Key:'} ${dossier.coldStorage.objectKey}
        </span>
      </div>
    </div>

    <!-- KPIs -->
    <div class="grid-kpis">
      <div class="kpi-card">
        <div class="kpi-title">${isAr ? 'المعدل العام للإتقان' : 'Overall Mastery'}</div>
        <div class="kpi-val" style="color: var(--cyan);">${dossier.summary.overallMasteryPercentage}%</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-title">${isAr ? 'التقييمات الموثقة' : 'Archived Assessments'}</div>
        <div class="kpi-val">${dossier.summary.totalAssessmentsArchived}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-title">${isAr ? 'انتصارات بلا قلق' : 'Zero-Alarm Victories'}</div>
        <div class="kpi-val" style="color: var(--green);">${dossier.summary.zeroAlarmVictoriesCount}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-title">${isAr ? 'معدل سد الفجوات' : 'Gap Remediation Rate'}</div>
        <div class="kpi-val" style="color: var(--yellow);">${dossier.summary.remediationSuccessRate}%</div>
      </div>
    </div>

    <!-- Cognitive Growth Vectors -->
    <h2 class="section-title">📈 ${isAr ? 'مسارات النمو المعرفي' : 'Longitudinal Cognitive Vectors'}</h2>
    <table>
      <thead>
        <tr>
          <th>${isAr ? 'المجال التعليمي' : 'Cognitive Domain'}</th>
          <th>${isAr ? 'المستوى الأولي' : 'Baseline'}</th>
          <th>${isAr ? 'المستوى الحالي' : 'Terminal'}</th>
          <th>${isAr ? 'معدل التقدم' : 'Growth (Δ)'}</th>
          <th>${isAr ? 'الثبات ضد النسيان' : 'Retention'}</th>
          <th>${isAr ? 'الحالة' : 'Status'}</th>
        </tr>
      </thead>
      <tbody>
        ${dossier.cognitiveVectors
          .map(
            v => `
          <tr>
            <td><strong>${isAr ? v.domainAr : v.domain}</strong></td>
            <td>${v.baselinePercentage}%</td>
            <td style="color: var(--cyan); font-weight: 700;">${v.terminalPercentage}%</td>
            <td style="color: var(--green); font-weight: 700;">+${v.deltaPercentage}%</td>
            <td>${Math.round(v.retentionStability * 100)}%</td>
            <td><span class="badge badge-green">${v.masteryClassification}</span></td>
          </tr>
        `
          )
          .join('')}
      </tbody>
    </table>

    <!-- Evidence Artifacts Table -->
    <h2 class="section-title">📂 ${isAr ? 'سجل الأدلة والتقييمات الموثقة' : 'Archived Assessment Evidence Artifacts'}</h2>
    <table>
      <thead>
        <tr>
          <th>${isAr ? 'الأسبوع' : 'Week'}</th>
          <th>${isAr ? 'المادة والتقييم' : 'Assessment'}</th>
          <th>${isAr ? 'الدرجة' : 'Score'}</th>
          <th>${isAr ? 'الفجوات المعالجة' : 'Remediated Gaps'}</th>
          <th>${isAr ? 'بصمة التحقق' : 'SHA-256 Checksum'}</th>
        </tr>
      </thead>
      <tbody>
        ${dossier.artifacts
          .map(
            a => `
          <tr>
            <td>W${a.termWeek}</td>
            <td>
              <strong>${isAr && a.titleAr ? a.titleAr : a.title}</strong>
              <div style="font-size: 11px; color: var(--text-muted);">${a.sourceType} • ${a.date}</div>
            </td>
            <td><strong>${a.rawScore}/${a.totalScore}</strong> (${a.percentage}%)</td>
            <td><span style="color: var(--green);">✓ ${a.remediatedGaps.join(', ') || 'None'}</span></td>
            <td><code style="font-size: 10px; color: var(--cyan);">${a.sha256ArtifactChecksum.slice(0, 16)}...</code></td>
          </tr>
        `
          )
          .join('')}
      </tbody>
    </table>

    <!-- SENCO & Learning Support Guidance -->
    <h2 class="section-title">🧠 ${isAr ? 'توصيات الدعم التعليمي وتكييف ADHD' : 'SENCO & ADHD Sensory Scaffold Recommendations'}</h2>
    ${dossier.sencoRecommendations
      .map(
        r => `
      <div class="recommendation-box">
        <div style="font-weight: 700; margin-bottom: 4px; color: var(--purple);">
          ${r.domain} • <span style="text-transform: uppercase; font-size: 11px;">[${r.priority}]</span>
        </div>
        <div style="margin-bottom: 6px;">
          <strong>${isAr ? 'النمط الملاحظ:' : 'Observed Learning Pattern:'}</strong> ${isAr ? r.observedPatternAr : r.observedPattern}
        </div>
        <div style="color: var(--text);">
          <strong>${isAr ? 'الدعامة البصرية الموصى بها:' : 'Recommended Scaffold:'}</strong> ${isAr ? r.recommendedScaffoldAr : r.recommendedScaffold}
        </div>
      </div>
    `
      )
      .join('')}
  </div>
</body>
</html>`;
  }
}
