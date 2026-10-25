import type { IMessagingPort } from '@hex-aim/types';

export class MockMessagingAdapter implements IMessagingPort {
  public sentMessages: Array<{ chatId: string; text: string }> = [];
  public sentConfirmationCards: Array<{ chatId: string; card: Record<string, unknown> }> = [];
  public deliveredPacks: Array<{ chatId: string; packs: Record<string, unknown> }> = [];
  public sentDocuments: Array<{ chatId: string; doc: Record<string, unknown> }> = [];

  public async sendMessage(chatId: string, text: string): Promise<void> {
    this.sentMessages.push({ chatId, text });
  }

  public async sendReceiptSummary(chatId: string, summary: { photoCount: number; mediaGroupId?: string }): Promise<void> {
    this.sentMessages.push({
      chatId,
      text: `📥 Received ${summary.photoCount} quiz pages. Analyzing now.`
    });
  }

  public async sendConfirmationCard(chatId: string, card: {
    jobId: string;
    imageUrl: string;
    detectedStudent: string;
    detectedSubject: string;
    detectedWeek: string;
  }): Promise<void> {
    this.sentConfirmationCards.push({ chatId, card });
  }

  public async sendDocument(chatId: string, doc: { buffer?: Uint8Array | ArrayBuffer; url?: string; filename: string; caption?: string }): Promise<void> {
    this.sentDocuments.push({ chatId, doc });
  }

  public async deliverRemediationPacks(chatId: string, packs: {
    studentPackHtml?: string;
    studentPackPdf?: string | Uint8Array | ArrayBuffer;
    coachingGuideHtml?: string;
    coachingGuidePdf?: string | Uint8Array | ArrayBuffer;
    summaryUrl?: string;
    studentName?: string;
    subject?: string;
    week?: number;
  }): Promise<void> {
    this.deliveredPacks.push({ chatId, packs });
  }
}
