import { describe, it, expect } from 'vitest';
import { StudentIdentityVault, DynamicPresentationHydrator } from '../src/index.js';

describe('ADR-002 Decoupled Identity Vault & Dynamic Hydration', () => {
  const vault = StudentIdentityVault.getInstance();

  it('resolves raw names to immutable canonical student UIDs', () => {
    expect(vault.resolveStudentUid('lara')).toBe('stu_01j9ax8001lara');
    expect(vault.resolveStudentUid('LARA')).toBe('stu_01j9ax8001lara');
    expect(vault.resolveStudentUid('maya')).toBe('stu_01j9ax8002maya');
    expect(vault.resolveStudentUid('Maya')).toBe('stu_01j9ax8002maya');
    expect(vault.resolveStudentUid('stu_01j9ax8001lara')).toBe('stu_01j9ax8001lara');
  });

  it('retrieves student PII record from vault only at authorized boundary', () => {
    const identity = vault.getIdentity('stu_01j9ax8001lara');
    expect(identity).toBeTruthy();
    expect(identity?.displayName).toBe('Lara');
    expect(identity?.preferredParentTitle).toBe('Dad');
    expect(identity?.status).toBe('active');
  });

  it('hydrates anonymous sprint artifact into personalized egress presentation', () => {
    const egress = DynamicPresentationHydrator.hydrateSprintEgress(
      'stu_01j9ax8001lara',
      'Science',
      8
    );

    // Presentation layer has child-friendly names
    expect(egress.displayName).toBe('Lara');
    expect(egress.egressFilename).toBe('Lara_Science_Y4_Sprint_W8.pdf');
    expect(egress.egressCaption).toContain("Lara's Science Sprint Pack");
    expect(egress.internalUid).toBe('stu_01j9ax8001lara');
  });

  it('hydrates parent Socratic guide with personalized parental role (Dad)', () => {
    const egress = DynamicPresentationHydrator.hydrateGuideEgress(
      'stu_01j9ax8002maya',
      'Science',
      8
    );

    expect(egress.displayName).toBe('Maya');
    expect(egress.parentSalutation).toBe('Dad');
    expect(egress.egressFilename).toBe('Dads_Maya_Science_Socratic_Guide_W8.pdf');
    expect(egress.egressCaption).toContain("Dad's Socratic Guide for Maya");
  });

  it('supports GDPR Right-to-Erasure (anonymizes PII while retaining anonymous ID)', () => {
    const tempUid = 'stu_test_to_delete_001';
    vault.registerRecord({
      studentUid: tempUid,
      firstName: 'Tarek',
      lastName: 'Smith',
      displayName: 'Tarek',
      guardianIds: ['guardian_123'],
      preferredParentTitle: 'Mum',
      status: 'active',
    });

    expect(vault.resolveStudentUid('tarek')).toBe(tempUid);
    const anonymized = vault.anonymizeStudent(tempUid);
    expect(anonymized).toBe(true);

    const scrubbed = vault.getIdentity(tempUid);
    expect(scrubbed?.firstName).toBe('[ANONYMIZED]');
    expect(scrubbed?.displayName).toContain('Student');
    expect(scrubbed?.guardianIds).toHaveLength(0);
    expect(scrubbed?.status).toBe('anonymized');

    // Name alias is purged
    expect(vault.resolveStudentUid('tarek')).not.toBe(tempUid);
  });
});
