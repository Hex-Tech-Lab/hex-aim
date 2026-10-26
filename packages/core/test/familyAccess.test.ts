import { describe, it, expect, beforeEach } from 'vitest';
import { FamilyAccessManager } from '../src/family/FamilyAccessManager.js';
import type { FamilyUnit, IStoragePort } from '@hex-aim/types';

describe('Wave 14: Multi-Guardian Role-Based Access Control (RBAC) & Synchronized Profiles', () => {
  let mockStorage: IStoragePort;
  let familiesMap: Map<string, FamilyUnit>;
  let chatMap: Map<string, string>;
  const manager = FamilyAccessManager.getInstance();

  beforeEach(() => {
    familiesMap = new Map();
    chatMap = new Map();

    mockStorage = {
      saveStudent: async () => {},
      getStudent: async () => null,
      saveAssessment: async () => {},
      getAssessment: async () => null,
      getStudentAssessments: async () => [],
      saveRemediationSprint: async () => {},
      getRemediationSprint: async () => null,
      saveCoachingGuide: async () => {},
      getCoachingGuide: async () => null,
      saveGuardian: async () => {},
      getGuardian: async () => null,
      saveCognitiveGap: async () => {},
      getStudentGaps: async () => [],
      getTrends: async () => [],
      getGuardianStrikes: async () => null,
      saveGuardianStrikes: async () => {},
      hasSeenFileHash: async () => false,
      recordFileHash: async () => {},
      getSeenFileMetadata: async () => null,

      saveFamilyUnit: async (family: FamilyUnit) => {
        familiesMap.set(family.id, family);
        for (const g of family.guardians) {
          chatMap.set(g.chatId, family.id);
        }
      },
      getFamilyUnit: async (id: string) => familiesMap.get(id) || null,
      getFamilyByChatId: async (chatId: string) => {
        const fId = chatMap.get(chatId);
        return fId ? familiesMap.get(fId) || null : null;
      },
    };
  });

  const sampleFamily: FamilyUnit = {
    id: 'family_asten_401',
    name: 'Future Family (Asten College)',
    studentIds: ['lara', 'maya'],
    guardians: [
      {
        guardianId: 'guardian_dad',
        chatId: '5055012900',
        channel: 'telegram',
        name: 'Dad',
        role: 'primary_coach',
      },
      {
        guardianId: 'guardian_mom',
        chatId: '987654321',
        channel: 'telegram',
        name: 'Mom',
        role: 'co_guardian',
      },
      {
        guardianId: 'guardian_tutor',
        chatId: '1122334455',
        channel: 'whatsapp',
        name: 'Science Tutor',
        role: 'observer',
      },
    ],
    createdAt: new Date().toISOString(),
  };

  it('registers family unit and resolves access by Telegram or WhatsApp chat ID', async () => {
    await manager.registerFamily(sampleFamily, mockStorage);

    const resolvedDad = await manager.getFamilyForChat('5055012900', mockStorage);
    expect(resolvedDad).not.toBeNull();
    expect(resolvedDad?.name).toBe('Future Family (Asten College)');
    expect(resolvedDad?.studentIds).toEqual(['lara', 'maya']);

    const resolvedMom = await manager.getFamilyForChat('987654321', mockStorage);
    expect(resolvedMom?.id).toBe('family_asten_401');

    const resolvedTutor = await manager.getFamilyForChat('1122334455', mockStorage);
    expect(resolvedTutor?.id).toBe('family_asten_401');

    const unknownChat = await manager.getFamilyForChat('999999999', mockStorage);
    expect(unknownChat).toBeNull();
  });

  it('enforces RBAC permissions: primary_coach vs co_guardian vs observer', () => {
    // Primary Coach has full rights
    expect(manager.canPerformAction('primary_coach', 'intake')).toBe(true);
    expect(manager.canPerformAction('primary_coach', 'review')).toBe(true);
    expect(manager.canPerformAction('primary_coach', 'admin')).toBe(true);
    expect(manager.canPerformAction('primary_coach', 'reset')).toBe(true);

    // Co-Guardian can do intake and review, but cannot reset or admin
    expect(manager.canPerformAction('co_guardian', 'intake')).toBe(true);
    expect(manager.canPerformAction('co_guardian', 'review')).toBe(true);
    expect(manager.canPerformAction('co_guardian', 'admin')).toBe(false);
    expect(manager.canPerformAction('co_guardian', 'reset')).toBe(false);

    // Observer has read-only review rights
    expect(manager.canPerformAction('observer', 'intake')).toBe(false);
    expect(manager.canPerformAction('observer', 'review')).toBe(true);
    expect(manager.canPerformAction('observer', 'admin')).toBe(false);
    expect(manager.canPerformAction('observer', 'reset')).toBe(false);
  });

  it('selectively targets notification broadcast channels based on event type', () => {
    // Sprint Ready: coaches and co-guardians (Dad and Mom)
    const sprintRecipients = manager.getBroadcastRecipients(sampleFamily, 'sprint_ready');
    expect(sprintRecipients.map(r => r.name)).toEqual(['Dad', 'Mom']);

    // Digest: all family members including tutor
    const digestRecipients = manager.getBroadcastRecipients(sampleFamily, 'digest');
    expect(digestRecipients.map(r => r.name)).toEqual(['Dad', 'Mom', 'Science Tutor']);

    // Critical Alerts: primary coach only
    const alertRecipients = manager.getBroadcastRecipients(sampleFamily, 'alert');
    expect(alertRecipients.map(r => r.name)).toEqual(['Dad']);
  });
});
