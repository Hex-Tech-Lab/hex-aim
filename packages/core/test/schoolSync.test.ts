import { describe, it, expect } from 'vitest';
import { SchoolMisSyncEngine } from '../src/school/SchoolMisSyncEngine.js';
import type { SchoolClassworkSubmission, RemediationSyncPayload } from '@hex-aim/types';

describe('SchoolMisSyncEngine (Wave 23: 2-Way School MIS Integration)', () => {
  const engine = SchoolMisSyncEngine.getInstance();

  it('retrieves active integration configuration for partner school', () => {
    const config = engine.getConfig('asten-college');
    expect(config).toBeDefined();
    expect(config?.schoolName).toContain('Asten College');
    expect(config?.provider).toBe('sims');
    expect(config?.syncDirection).toBe('two_way');
    expect(config?.realTimeActive).toBe(true);
  });

  it('ingests live classwork submission and auto-generates Socratic sprint ID', () => {
    const newSubmission: SchoolClassworkSubmission = {
      id: 'sub_test_001',
      schoolId: 'asten-college',
      studentId: 'lara',
      assignmentId: 'assign_y4_eng_w8',
      title: 'Year 4 English: Fronted Adverbials with Punctuation Guards',
      subjectId: 'english',
      termWeek: 8,
      submittedAt: new Date().toISOString(),
      rawGrade: '74%',
      scannedWorkUrls: ['https://aim.getvintel.com/sources/test_scan.jpg'],
      teacherComments: 'Great vocabulary, missed commas after fronted adverbials.'
    };

    const result = engine.ingestClassworkSubmission(newSubmission);
    expect(result.success).toBe(true);
    expect(result.autoSprintGenerated).toBe(true);

    const subs = engine.listSubmissions('lara');
    expect(subs.some(s => s.id === 'sub_test_001')).toBe(true);
  });

  it('pushes completed home Socratic remediation results back to school gradebook', () => {
    const remediationPayload: RemediationSyncPayload = {
      submissionId: 'sub_asten_y4_sci_w8_lara',
      studentId: 'lara',
      schoolId: 'asten-college',
      remediationSprintId: 'sprint_lara_sci_w8',
      resolvedConcepts: ['Y4.SCI.SND.MEDIUM'],
      postRemediationScore: 94,
      homeFeedbackNotes: 'Lara completed 8m Elevator Model visual sprint with Dad. Fully resolved solid vs gas transmission bottleneck.',
      syncedAt: '',
      status: 'pending'
    };

    const syncResult = engine.pushRemediationToSchool(remediationPayload);
    expect(syncResult.synced).toBe(true);
    expect(syncResult.confirmationCode).toContain('MIS-SYNC-ASTEN-COLLEGE');
    expect(syncResult.payload.status).toBe('synced_to_school');

    const auditLog = engine.getSyncAuditLog();
    expect(auditLog.some(a => a.submissionId === 'sub_asten_y4_sci_w8_lara')).toBe(true);
  });

  it('provides real-time telemetry and active assignment status for school dashboard', () => {
    const telemetry = engine.getSchoolTelemetry('asten-college');
    expect(telemetry.schoolId).toBe('asten-college');
    expect(telemetry.isOnline).toBe(true);
    expect(telemetry.totalSubmissionsIngested).toBeGreaterThanOrEqual(2);
    expect(telemetry.activeClassworkLinks.length).toBeGreaterThan(0);
    expect(telemetry.activeClassworkLinks[0].assignmentId).toBe('assign_y4_sci_week8_sound');
  });
});
