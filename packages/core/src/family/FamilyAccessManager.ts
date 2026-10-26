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
    action: 'intake' | 'review' | 'admin' | 'reset'
  ): boolean {
    switch (role) {
      case 'primary_coach':
        return true; // Full access
      case 'co_guardian':
        return action !== 'admin' && action !== 'reset'; // Cannot perform nuclear resets
      case 'observer':
        return action === 'review'; // Read-only progress
      default:
        return false;
    }
  }

  public getBroadcastRecipients(
    family: FamilyUnit,
    event: 'sprint_ready' | 'digest' | 'alert'
  ): FamilyGuardianMember[] {
    if (event === 'sprint_ready') {
      return family.guardians.filter(g => g.role === 'primary_coach' || g.role === 'co_guardian');
    }
    if (event === 'digest') {
      return family.guardians; // Everyone gets weekly digest
    }
    if (event === 'alert') {
      return family.guardians.filter(g => g.role === 'primary_coach');
    }
    return family.guardians;
  }
}
