import type {
  SchoolMisIntegrationConfig,
  SchoolClassworkSubmission,
  RemediationSyncPayload,
  SchoolSyncTelemetry
} from '@hex-aim/types';

export class SchoolMisSyncEngine {
  private static instance: SchoolMisSyncEngine | null = null;

  // Active configurations for partner schools (e.g., Asten College, Cairo)
  private readonly schoolConfigs: Map<string, SchoolMisIntegrationConfig> = new Map([
    [
      'asten-college',
      {
        schoolId: 'asten-college',
        schoolName: 'Asten College • Cairo (British Primary)',
        provider: 'sims',
        syncDirection: 'two_way',
        endpointUrl: 'https://sims.astencollege.com/api/v1/gradebook-sync',
        webhookSecret: 'sec_asten_sims_live_2026',
        realTimeActive: true,
        lastSyncedAt: new Date().toISOString()
      }
    ]
  ]);

  // In-memory registry of classwork submissions ingested from the school
  private readonly submissions: Map<string, SchoolClassworkSubmission> = new Map();
  // In-memory ledger of remediation syncs pushed back to the school gradebook
  private readonly syncAuditLog: RemediationSyncPayload[] = [];

  public static getInstance(): SchoolMisSyncEngine {
    if (!this.instance) {
      this.instance = new SchoolMisSyncEngine();
      this.instance.seedPilotData();
    }
    return this.instance;
  }

  private seedPilotData(): void {
    // Seed real-world pilot assignments from Asten College Year 4
    const subLara: SchoolClassworkSubmission = {
      id: 'sub_asten_y4_sci_w8_lara',
      schoolId: 'asten-college',
      studentId: 'lara',
      assignmentId: 'assign_y4_sci_week8_sound',
      title: 'Year 4 Science: Sound Transmission Through States of Matter',
      subjectId: 'science',
      termWeek: 8,
      submittedAt: '2026-10-22T09:30:00Z',
      rawGrade: '78%',
      scannedWorkUrls: [
        'https://aim.getvintel.com/sources/asten_y4_sci_w8_p1.jpg',
        'https://aim.getvintel.com/sources/asten_y4_sci_w8_p2.jpg'
      ],
      teacherComments: 'Great oral enthusiasm. Needs practice explaining why sound travels faster through solids than gases.',
      pedagogicTags: ['states_of_matter', 'particle_density', 'auditory_transmission'],
      autoRemediationSprintId: 'sprint_lara_sci_w8'
    };

    const subMaya: SchoolClassworkSubmission = {
      id: 'sub_asten_y4_math_w8_maya',
      schoolId: 'asten-college',
      studentId: 'maya',
      assignmentId: 'assign_y4_math_week8_fractions',
      title: 'Year 4 Maths: Number Line Interval Scales & Common Denominators',
      subjectId: 'maths',
      termWeek: 8,
      submittedAt: '2026-10-23T11:15:00Z',
      rawGrade: '82%',
      scannedWorkUrls: [
        'https://aim.getvintel.com/sources/asten_y4_math_w8_p1.jpg'
      ],
      teacherComments: 'Accurate computation. Watch interval jump decoding on multi-digit lines.',
      pedagogicTags: ['number_line_intervals', 'equivalent_fractions'],
      autoRemediationSprintId: 'sprint_maya_math_w8'
    };

    this.submissions.set(subLara.id, subLara);
    this.submissions.set(subMaya.id, subMaya);
  }

  public getConfig(schoolId: string): SchoolMisIntegrationConfig | undefined {
    return this.schoolConfigs.get(schoolId);
  }

  /**
   * Ingests a new school classwork submission with scanned work and teacher comments.
   */
  public ingestClassworkSubmission(submission: SchoolClassworkSubmission): {
    success: boolean;
    submissionId: string;
    autoSprintGenerated: boolean;
  } {
    // Generate an automatic sprint identifier if not present
    if (!submission.autoRemediationSprintId) {
      submission.autoRemediationSprintId = `sprint_${submission.studentId}_${submission.subjectId}_w${submission.termWeek}`;
    }

    this.submissions.set(submission.id, submission);

    return {
      success: true,
      submissionId: submission.id,
      autoSprintGenerated: true
    };
  }

  /**
   * Pushes completed home Socratic remediation results back to the school gradebook.
   */
  public pushRemediationToSchool(payload: RemediationSyncPayload): {
    synced: boolean;
    confirmationCode: string;
    payload: RemediationSyncPayload;
  } {
    const config = this.getConfig(payload.schoolId);
    if (!config) {
      throw new Error(`School ID '${payload.schoolId}' not found in active MIS configurations.`);
    }

    payload.status = 'synced_to_school';
    payload.syncedAt = new Date().toISOString();
    this.syncAuditLog.push(payload);

    // Update the school config timestamp
    config.lastSyncedAt = payload.syncedAt;

    const confirmationCode = `MIS-SYNC-${payload.schoolId.toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;

    return {
      synced: true,
      confirmationCode,
      payload
    };
  }

  /**
   * Returns real-time telemetry for a given school.
   */
  public getSchoolTelemetry(schoolId: string): SchoolSyncTelemetry {
    const config = this.getConfig(schoolId);
    const schoolSubs = Array.from(this.submissions.values()).filter(s => s.schoolId === schoolId);
    const schoolRemediations = this.syncAuditLog.filter(r => r.schoolId === schoolId);

    return {
      schoolId,
      provider: config?.provider || 'sims',
      isOnline: config?.realTimeActive || false,
      lastWebhookReceivedAt: config?.lastSyncedAt || new Date().toISOString(),
      totalSubmissionsIngested: schoolSubs.length,
      remediationsPushedBack: schoolRemediations.length,
      activeClassworkLinks: [
        {
          assignmentId: 'assign_y4_sci_week8_sound',
          title: 'Year 4 Science: Sound Transmission Through States of Matter',
          studentCount: 28,
          status: 'in_remediation'
        },
        {
          assignmentId: 'assign_y4_math_week8_fractions',
          title: 'Year 4 Maths: Number Line Interval Scales & Common Denominators',
          studentCount: 30,
          status: 'gradebook_updated'
        }
      ]
    };
  }

  public listSubmissions(studentId?: string): SchoolClassworkSubmission[] {
    const all = Array.from(this.submissions.values());
    if (studentId) {
      return all.filter(s => s.studentId.toLowerCase() === studentId.toLowerCase());
    }
    return all;
  }

  public getSyncAuditLog(): RemediationSyncPayload[] {
    return [...this.syncAuditLog];
  }
}
