import { describe, it, expect } from 'vitest';
import { PrivacyVaultEngine } from '../src/privacy/PrivacyVaultEngine.js';
import type { StudentPiiRecord } from '@hex-aim/types';

describe('Wave 28: Zero-Knowledge Student Privacy Vault', () => {
  const vault = new PrivacyVaultEngine();

  const laraPii: StudentPiiRecord = {
    studentId: 'lara',
    fullName: 'Lara Sherif',
    guardianName: 'Sherif Kelly',
    guardianPhone: '+201001234567',
    nationalIdMasked: '2980101******8',
    schoolName: 'Asten College',
    dateOfBirth: '2016-04-12',
  };

  it('encrypts student PII with AES-256-GCM and decrypts back accurately', async () => {
    const encrypted = await vault.encryptPii(laraPii);

    expect(encrypted.algorithm).toBe('AES-256-GCM');
    expect(encrypted.ciphertext).toBeDefined();
    expect(encrypted.iv).toBeDefined();
    expect(encrypted.salt).toBeDefined();
    expect(encrypted.tag).toBeDefined();
    expect(encrypted.ciphertext).not.toContain('Lara Sherif');

    const decrypted = await vault.decryptPii(encrypted);
    expect(decrypted.fullName).toBe('Lara Sherif');
    expect(decrypted.guardianPhone).toBe('+201001234567');
    expect(decrypted.schoolName).toBe('Asten College');
  });

  it('fails decryption if ciphertext is tampered or corrupted', async () => {
    const encrypted = await vault.encryptPii(laraPii);
    const tampered = {
      ...encrypted,
      ciphertext: encrypted.ciphertext.slice(0, -4) + 'AAAA',
    };

    await expect(vault.decryptPii(tampered)).rejects.toThrow();
  });

  it('generates pseudonymized student profile for third-party AI inference', async () => {
    const neuroProfile = {
      hasAdhdTraits: true,
      optimalSprintDurationMins: 8,
      workingMemoryCapacity: 'vulnerable_under_time_pressure',
    };

    const pseudonymized = await vault.pseudonymizeProfile(laraPii, neuroProfile, 'Y4');

    expect(pseudonymized.pseudonymToken).toMatch(/^stu_anon_[a-f0-9]{16}$/);
    expect(pseudonymized.yearGroup).toBe('Y4');
    expect(pseudonymized.neuroProfile.hasAdhdTraits).toBe(true);
    expect(pseudonymized.encryptedPii.ciphertext).toBeDefined();
  });

  it('redacts student PII from natural language prompt before sending to LLM', () => {
    const rawPrompt = 'Evaluate worksheet for Lara Sherif. Contact Sherif Kelly at +201001234567 if assistance is needed.';
    const token = 'stu_anon_9f8a1234b5c67890';

    const redacted = vault.redactPromptForLlm(rawPrompt, laraPii, token);

    expect(redacted).not.toContain('Lara Sherif');
    expect(redacted).not.toContain('Sherif Kelly');
    expect(redacted).not.toContain('+201001234567');
    expect(redacted).toContain(token);
    expect(redacted).toContain('[GUARDIAN_COACH]');
    expect(redacted).toContain('[REDACTED_PHONE]');
  });

  it('maintains tamper-evident cryptographic hash chain across all audit events', () => {
    const logs = vault.getAuditLogs();
    expect(logs.length).toBeGreaterThan(1);
    expect(vault.verifyAuditTrailIntegrity()).toBe(true);

    const status = vault.getStatus();
    expect(status.vaultInitialized).toBe(true);
    expect(status.auditTrailIntegrity).toBe('intact');
    expect(status.complianceStandards).toContain('Egyptian Data Protection Law No. 151/2020');
  });
});
