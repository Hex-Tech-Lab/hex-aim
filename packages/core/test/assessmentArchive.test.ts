import { describe, it, expect } from 'vitest';
import { AssessmentArchiveEngine } from '../src/archival/AssessmentArchiveEngine.js';
import type { AssessmentArchiveDossier } from '@hex-aim/types';

describe('Wave 29: Longitudinal Assessment Archival & Audit Dossier Engine (ADR-005)', () => {
  const archiveEngine = AssessmentArchiveEngine.getInstance();

  it('compiles full longitudinal assessment dossier for Lara with tamper-evident seal', () => {
    const dossier = archiveEngine.generateStudentDossier('lara');

    expect(dossier.dossierId).toBe('dossier_2026_t1_lara');
    expect(dossier.studentDisplayName).toBe('Lara Sherif');
    expect(dossier.schoolName).toBe('Asten College (New Cairo)');
    expect(dossier.academicTerm).toBe('Term 1 (Autumn 2026)');

    // Summary validation
    expect(dossier.summary.totalAssessmentsArchived).toBe(6);
    expect(dossier.summary.overallMasteryPercentage).toBeGreaterThanOrEqual(85);
    expect(dossier.summary.gapsRemediatedCount).toBeGreaterThan(0);
    expect(dossier.summary.remediationSuccessRate).toBeGreaterThan(0);
    expect(dossier.summary.streakWeeks).toBe(8);

    // Cryptographic seal
    expect(dossier.integrity.hashAlgorithm).toBe('SHA-256');
    expect(dossier.integrity.payloadChecksum).toMatch(/^[a-f0-9]{64}$/);
    expect(dossier.integrity.isTamperEvident).toBe(true);
    expect(dossier.integrity.verificationStatus).toBe('verified_authentic');
  });

  it('verifies authenticity and detects tampering when payload is modified', () => {
    const dossier = archiveEngine.generateStudentDossier('lara');

    // 1. Untampered check
    const pristineCheck = archiveEngine.verifyDossierIntegrity(dossier);
    expect(pristineCheck.isValid).toBe(true);
    expect(pristineCheck.expectedHash).toBe(pristineCheck.actualHash);

    // 2. Tampered check: grade inflation attempt (e.g. changing percentage from 70 to 100)
    const tamperedDossier: AssessmentArchiveDossier = JSON.parse(JSON.stringify(dossier));
    tamperedDossier.artifacts[0].percentage = 100;
    tamperedDossier.artifacts[0].rawScore = 20;

    const tamperedCheck = archiveEngine.verifyDossierIntegrity(tamperedDossier);
    expect(tamperedCheck.isValid).toBe(false);
    expect(tamperedCheck.actualHash).not.toBe(tamperedCheck.expectedHash);

    // 3. Tampered check: altering summary metric
    const tamperedSummary: AssessmentArchiveDossier = JSON.parse(JSON.stringify(dossier));
    tamperedSummary.summary.overallMasteryPercentage = 99;

    const summaryCheck = archiveEngine.verifyDossierIntegrity(tamperedSummary);
    expect(summaryCheck.isValid).toBe(false);
  });

  it('generates Cloudflare R2 cold storage manifest with 1h TTL presigned URL and checksum', () => {
    const dossier = archiveEngine.generateStudentDossier('lara');
    const { coldStorage } = dossier;

    expect(coldStorage.storageProvider).toBe('cloudflare_r2');
    expect(coldStorage.bucket).toBe('aim-student-dossiers');
    expect(coldStorage.objectKey).toBe('dossiers/2026/term1/lara_archive_term1.json');
    expect(coldStorage.contentSha256).toMatch(/^[a-f0-9]{64}$/);
    expect(coldStorage.presignedDownloadUrl).toContain('https://pub-r2.aim.getvintel.com/');
    expect(coldStorage.presignedDownloadUrl).toContain('signature=');
    expect(coldStorage.presignedDownloadUrl).toContain('expires=');

    // Expiration should be within ~3600 seconds of generation
    const expires = new Date(coldStorage.urlExpiresAt).getTime();
    const created = new Date(coldStorage.archivedAt).getTime();
    expect(expires - created).toBe(3600 * 1000);
  });

  it('compiles valid dossiers for all 5 canonical students (Lara, Maya, Youssef, Omar, Nour)', () => {
    const students = ['lara', 'maya', 'youssef', 'omar', 'nour'];

    for (const stu of students) {
      const dossier = archiveEngine.generateStudentDossier(stu);
      expect(dossier.studentId).toBe(stu);
      expect(dossier.artifacts.length).toBeGreaterThanOrEqual(2);
      expect(dossier.cognitiveVectors.length).toBeGreaterThanOrEqual(1);

      const check = archiveEngine.verifyDossierIntegrity(dossier);
      expect(check.isValid).toBe(true);
    }
  });

  it('renders printable standalone HTML dossier in English and Arabic', () => {
    const dossier = archiveEngine.generateStudentDossier('lara');

    // English render
    const htmlEn = archiveEngine.renderDossierHtml(dossier, 'en');
    expect(htmlEn).toContain('<!DOCTYPE html>');
    expect(htmlEn).toContain('dir="ltr"');
    expect(htmlEn).toContain('Longitudinal Assessment Dossier');
    expect(htmlEn).toContain('Lara Sherif');
    expect(htmlEn).toContain(dossier.integrity.payloadChecksum);
    expect(htmlEn).toContain('SENCO & ADHD Sensory Scaffold Recommendations');

    // Arabic render
    const htmlAr = archiveEngine.renderDossierHtml(dossier, 'ar');
    expect(htmlAr).toContain('dir="rtl"');
    expect(htmlAr).toContain('الملف التراكمي الشامل');
    expect(htmlAr).toContain('مسارات النمو المعرفي');
    expect(htmlAr).toContain('توصيات الدعم التعليمي وتكييف ADHD');
  });
});
