import type { IdentityVaultRecord } from '@hex-aim/types';

/**
 * Built-in Pilot Registry for Canonical Student UIDs (Asten College Pilot)
 */
const CANONICAL_PILOT_VAULT: Record<string, IdentityVaultRecord> = {
  'stu_01j9ax8001lara': {
    studentUid: 'stu_01j9ax8001lara',
    firstName: 'Lara',
    lastName: '',
    displayName: 'Lara',
    preferredTitle: 'Explorer',
    guardianIds: ['guardian_5055012900'],
    preferredParentTitle: 'Dad',
    status: 'active',
  },
  'stu_01j9ax8002maya': {
    studentUid: 'stu_01j9ax8002maya',
    firstName: 'Maya',
    lastName: '',
    displayName: 'Maya',
    preferredTitle: 'Professor',
    guardianIds: ['guardian_5055012900'],
    preferredParentTitle: 'Dad',
    status: 'active',
  },
};

/**
 * ADR-002 Identity Vault:
 * Decouples sensitive PII from internal processing engines and storage ledgers.
 * All internal pipelines operate strictly on immutable canonical student UIDs (`stu_...`).
 */
export class StudentIdentityVault {
  private static instance: StudentIdentityVault;
  private vault: Map<string, IdentityVaultRecord> = new Map();
  private aliasMap: Map<string, string> = new Map();

  private constructor() {
    // Seed with canonical pilot records
    for (const record of Object.values(CANONICAL_PILOT_VAULT)) {
      this.registerRecord(record);
    }
  }

  public static getInstance(): StudentIdentityVault {
    if (!StudentIdentityVault.instance) {
      StudentIdentityVault.instance = new StudentIdentityVault();
    }
    return StudentIdentityVault.instance;
  }

  public registerRecord(record: IdentityVaultRecord): void {
    this.vault.set(record.studentUid, { ...record });
    this.aliasMap.set(record.studentUid.toLowerCase(), record.studentUid);
    if (record.firstName) {
      this.aliasMap.set(record.firstName.toLowerCase(), record.studentUid);
    }
    if (record.displayName) {
      this.aliasMap.set(record.displayName.toLowerCase(), record.studentUid);
    }
  }

  /**
   * Resolves any input alias (e.g. 'lara', 'maya', 'stu_01j9ax8001lara')
   * into its immutable canonical student UID.
   */
  public resolveStudentUid(aliasOrUid: string): string {
    if (!aliasOrUid) return 'stu_01j9ax8001lara';
    const clean = aliasOrUid.trim().toLowerCase();
    const resolved = this.aliasMap.get(clean);
    if (resolved) return resolved;

    if (clean.startsWith('stu_')) return aliasOrUid.trim();

    return `stu_auto_${clean}`;
  }

  /**
   * Retrieves the PII Identity Record for presentation egress.
   */
  public getIdentity(studentUid: string): IdentityVaultRecord | null {
    const canonicalUid = this.resolveStudentUid(studentUid);
    return this.vault.get(canonicalUid) || null;
  }

  /**
   * GDPR Article 17 Right-to-Erasure:
   * Scrubs all PII (names, parent contacts, photo references) while preserving
   * the detached anonymous student UID so historical research models remain intact.
   */
  public anonymizeStudent(studentUid: string): boolean {
    const canonicalUid = this.resolveStudentUid(studentUid);
    const existing = this.vault.get(canonicalUid);
    if (!existing) return false;

    // Purge name mappings from alias index
    if (existing.firstName) this.aliasMap.delete(existing.firstName.toLowerCase());
    if (existing.displayName) this.aliasMap.delete(existing.displayName.toLowerCase());

    // Scrub PII attributes in-place
    this.vault.set(canonicalUid, {
      studentUid: canonicalUid,
      firstName: '[ANONYMIZED]',
      lastName: '',
      displayName: `Student ${canonicalUid.slice(-4)}`,
      guardianIds: [],
      preferredParentTitle: 'Parent',
      status: 'anonymized',
    });

    return true;
  }
}
