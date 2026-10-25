import type { IMessagingPort } from '@hex-aim/types';

export class MockMessagingAdapter implements IMessagingPort {
  public sentMessages: Array<{ chatId: string; text: string }> = [];
  public sentConfirmationCards: Array<{ chatId: string; card: Record<string, unknown> }> = [];
  public deliveredPacks: Array<{ chatId: string; packs: Record<string, unknown> }> = [];

  public async sendMessage(chatId: string, text: string): Promise<void> {
    this.sentMessages.push({ chatId, text });
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

  public async deliverRemediationPacks(chatId: string, packs: {
    studentPackHtml: string;
    studentPackPdf?: string;
    coachingGuideHtml: string;
    coachingGuidePdf?: string;
  }): Promise<void> {
    this.deliveredPacks.push({ chatId, packs });
  }
}
