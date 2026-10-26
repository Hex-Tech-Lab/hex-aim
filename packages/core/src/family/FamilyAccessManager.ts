import type {
  FamilyUnit,
  FamilyGuardianMember,
  GuardianRole,
  IStoragePort
} from '@hex-aim/types';

export class FamilyAccessManager {
  private static instance: FamilyAccessManager | null = null;

  public static getInstance(): FamilyAccessManager {
    if (!this.instance) {
      this.instance = new FamilyAccessManager();
    }
    return this.instance;
  }

  public async registerFamily(family: FamilyUnit, storage: IStoragePort): Promise<void> {
    if (!storage.saveFamilyUnit) {
      throw new Error('[FamilyAccessManager] Storage port does not support saveFamilyUnit.');
    }
    await storage.saveFamilyUnit(family);
  }

  public async getFamilyForChat(chatId: string, storage: IStoragePort): Promise<FamilyUnit | null> {
    if (!storage.getFamilyByChatId) {
      return null;
    }
    return await storage.getFamilyByChatId(chatId);
  }

  public async getMemberByChatId(chatId: string, storage: IStoragePort): Promise<{
    family: FamilyUnit;
    member: FamilyGuardianMember;
  } | null> {
    const family = await this.getFamilyForChat(chatId, storage);
    if (!family) return null;
    const member = family.guardians.find(g => g.chatId === chatId);
    if (!member) return null;
    return { family, member };
  }

  public canPerformAction(
    role: GuardianRole,
    action: 'intake' | 'review' | 'admin' | 'reset' | 'curriculum_edit' | 'senco_override' | 'cohort_view'
  ): boolean {
    switch (role) {
      case 'primary_coach':
        return true; // Full access across domestic domain
      case 'co_guardian':
        return action !== 'admin' && action !== 'reset' && action !== 'senco_override';
      case 'observer':
        return action === 'review'; // Read-only progress
      case 'teacher':
        return action === 'review' || action === 'cohort_view' || action === 'curriculum_edit' || action === 'intake';
      case 'head_of_year':
        return action === 'review' || action === 'cohort_view' || action === 'curriculum_edit' || action === 'admin';
      case 'sen_coordinator':
        return action === 'review' || action === 'senco_override' || action === 'cohort_view';
      case 'private_tutor':
        return action === 'review' || action === 'intake'; // Can upload practice sheets and review assigned student
      case 'therapist':
        return action === 'review' || action === 'senco_override';
      default:
        return false;
    }
  }

  public getBroadcastRecipients(
    family: FamilyUnit,
    event: 'sprint_ready' | 'digest' | 'alert' | 'senco_update'
  ): FamilyGuardianMember[] {
    if (event === 'sprint_ready') {
      return family.guardians.filter(g => 
        g.role === 'primary_coach' || g.role === 'co_guardian' || g.role === 'private_tutor'
      );
    }
    if (event === 'digest') {
      return family.guardians; // Everyone gets weekly digest
    }
    if (event === 'alert') {
      return family.guardians.filter(g => 
        g.role === 'primary_coach' || g.role === 'head_of_year'
      );
    }
    if (event === 'senco_update') {
      return family.guardians.filter(g => 
        g.role === 'primary_coach' || g.role === 'sen_coordinator' || g.role === 'therapist'
      );
    }
    return family.guardians;
  }
}
