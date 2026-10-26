import type { IStoragePort, ISettingsPort, GuardianStrikeRecord } from '@hex-aim/types';

export interface IntakeDedupInput {
  guardianId: string;
  fileIdentifier: string;
  metadata?: {
    filename?: string;
    fileSize?: number;
    mimeType?: string;
    sprintId?: string;
  };
}

export interface IntakeDedupResult {
  isDuplicate: boolean;
  strikeCount: number;
  maxStrikes: number;
  status: 'active' | 'warned' | 'rate_limited' | 'downgraded' | 'blocked';
  duplicateCount: number;
  tokensSaved: number;
  userMessage?: string;
  existingSprintId?: string;
}

export class IntakeDeduplicator {
  /**
   * Normalizes file fingerprints across Telegram unique IDs, filenames, or hashes
   */
  public static computeFingerprint(rawIdOrHash: string, filename?: string, fileSize?: number): string {
    if (rawIdOrHash && rawIdOrHash.trim().length > 0) {
      return rawIdOrHash.trim();
    }
    if (filename && fileSize) {
      return `fn_${filename.toLowerCase().replace(/[^a-z0-9_.-]/g, '_')}_${fileSize}`;
    }
    return `fp_unknown_${Date.now()}`;
  }

  /**
   * Evaluates an incoming file upload against the Guardian's ingestion history and strike policies.
   */
  public static async evaluateUpload(
    input: IntakeDedupInput,
    storage: IStoragePort,
    settings: ISettingsPort
  ): Promise<IntakeDedupResult> {
    const isEnabled = settings.get<boolean>('intake.dedup.enabled', true);
    const maxStrikes = settings.get<number>('intake.dedup.strikeLimit', 3);
    const fingerprint = this.computeFingerprint(input.fileIdentifier, input.metadata?.filename, input.metadata?.fileSize);

    // If dedup is globally disabled via settings registry, accept immediately
    if (!isEnabled) {
      return {
        isDuplicate: false,
        strikeCount: 0,
        maxStrikes,
        status: 'active',
        duplicateCount: 0,
        tokensSaved: 0,
      };
    }

    // Admin & Testing Whitelist: Developer/Admin chat is never blocked or restricted
    const isAdmin = input.guardianId.includes('5055012900') || settings.get<boolean>('intake.adminBypass', false);
    if (isAdmin) {
      return {
        isDuplicate: false,
        strikeCount: 0,
        maxStrikes,
        status: 'active',
        duplicateCount: 0,
        tokensSaved: 0,
      };
    }

    const isSeen = await storage.hasSeenFileHash(input.guardianId, fingerprint);

    if (!isSeen) {
      // First time seeing this file - record it in registry
      await storage.recordFileHash(input.guardianId, fingerprint, {
        filename: input.metadata?.filename,
        sprintId: input.metadata?.sprintId,
        timestamp: new Date().toISOString(),
      });

      const currentRecord = await storage.getGuardianStrikes(input.guardianId);

      return {
        isDuplicate: false,
        strikeCount: currentRecord?.strikeCount || 0,
        maxStrikes,
        status: currentRecord?.status || 'active',
        duplicateCount: currentRecord?.duplicateUploadCount || 0,
        tokensSaved: currentRecord?.tokensSavedEstimate || 0,
      };
    }

    // DUPLICATE DETECTED!
    let record: GuardianStrikeRecord | null = await storage.getGuardianStrikes(input.guardianId);
    if (!record) {
      record = {
        guardianId: input.guardianId,
        strikeCount: 0,
        maxStrikes,
        status: 'active',
        duplicateUploadCount: 0,
        tokensSavedEstimate: 0,
        history: [],
      };
    }

    record.duplicateUploadCount += 1;
    // Each avoided multimodal vision run saves ~3,200 tokens
    record.tokensSavedEstimate += 3200;
    record.lastDuplicateFileHash = fingerprint;
    record.lastStrikeDate = new Date().toISOString();

    if (record.strikeCount < record.maxStrikes) {
      record.strikeCount += 1;
    }

    if (record.strikeCount >= record.maxStrikes) {
      record.status = 'downgraded';
    } else {
      record.status = 'warned';
    }

    record.history.push({
      timestamp: new Date().toISOString(),
      fileIdentifier: fingerprint,
      reason: `Duplicate assessment upload detected (${input.metadata?.filename || fingerprint})`,
      strikeApplied: true,
    });

    await storage.saveGuardianStrikes(record);

    const existingMeta = await storage.getSeenFileMetadata(input.guardianId, fingerprint);
    const sprintUrl = existingMeta?.sprintId
      ? `https://aim.getvintel.com/sprint/${existingMeta.sprintId}`
      : undefined;

    let userMessage = '';
    if (record.status === 'downgraded') {
      userMessage =
        `🛡️ <b>System Guidance: Practice Run Mode</b>\n\n` +
        `We noticed these pages match previously submitted work (${record.duplicateUploadCount} duplicate uploads detected).\n` +
        `To ensure optimal progress, repeated uploads are handled in <b>Practice Run Mode</b> to preserve baseline mastery.\n\n` +
        `<i>Need to reset your upload session? Reply with</i> <code>/reset</code> <i>or tap Reset Quota in the menu.</i>`;
    } else {
      userMessage =
        `💡 <b>Parent Guidance: Repeat Upload Recognized</b>\n\n` +
        `These pages match an existing assessment. We have logged them as a <b>Practice Run</b> to preserve your child's baseline score.\n\n` +
        `📌 <b>Notice Status:</b> ${record.strikeCount} of ${record.maxStrikes} duplicate notices.\n` +
        (sprintUrl
          ? `👉 <b>Existing Sprint Pack:</b> <a href="${sprintUrl}">Open Sprint Pack</a>\n`
          : '\nTo generate a new sprint, please take a photo of a new weekly assessment.');
    }

    return {
      isDuplicate: true,
      strikeCount: record.strikeCount,
      maxStrikes: record.maxStrikes,
      status: record.status,
      duplicateCount: record.duplicateUploadCount,
      tokensSaved: record.tokensSavedEstimate,
      userMessage,
      existingSprintId: existingMeta?.sprintId,
    };
  }
}
