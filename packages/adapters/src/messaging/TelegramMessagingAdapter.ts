import type { IMessagingPort } from '@hex-aim/types';

export interface TelegramConfig {
  botToken: string;
  apiBaseUrl?: string;
}

export class TelegramMessagingAdapter implements IMessagingPort {
  private botToken: string;
  private apiBaseUrl: string;

  constructor(config: TelegramConfig) {
    this.botToken = config.botToken;
    this.apiBaseUrl = config.apiBaseUrl || 'https://api.telegram.org';
  }

  private async callApi(method: string, body: Record<string, unknown>): Promise<any> {
    const url = `${this.apiBaseUrl}/bot${this.botToken}/${method}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error(`[TelegramMessagingAdapter] Error ${res.status} calling ${method}:`, errText);
      throw new Error(`Telegram API call failed: ${res.statusText}`);
    }

    return await res.json();
  }

  public async sendMessage(chatId: string, text: string): Promise<void> {
    await this.callApi('sendMessage', {
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
    });
  }

  public async sendConfirmationCard(chatId: string, card: {
    jobId: string;
    imageUrl: string;
    detectedStudent: string;
    detectedSubject: string;
    detectedWeek: string;
  }): Promise<void> {
    const caption = `📸 <b>Assessment Received!</b>\n\n` +
      `👤 <b>Student:</b> ${card.detectedStudent}\n` +
      `📚 <b>Subject:</b> ${card.detectedSubject}\n` +
      `🗓️ <b>Week:</b> ${card.detectedWeek}\n\n` +
      `⚡ <i>Running cognitive gap extraction now. Your targeted 4-page sprint will arrive in ~30 seconds.</i>`;

    await this.callApi('sendPhoto', {
      chat_id: chatId,
      photo: card.imageUrl,
      caption,
      parse_mode: 'HTML',
    });
  }

  public async deliverRemediationPacks(chatId: string, packs: {
    studentPackHtml: string;
    studentPackPdf?: string;
    coachingGuideHtml: string;
    coachingGuidePdf?: string;
  }): Promise<void> {
    const text = `🎉 <b>Your Targeted Sprint Pack is Ready!</b>\n\n` +
      `📄 <b>Child's 4-Page Sprint:</b>\n` +
      `🔗 <a href="${packs.studentPackHtml}">Open Printable Student Pack</a>\n\n` +
      `🧭 <b>Parent Socratic Coaching Guide:</b>\n` +
      `🔗 <a href="${packs.coachingGuideHtml}">Open 8-Minute Coaching Guide</a>\n\n` +
      `💡 <i>Tip: Open on mobile or print at home. No repetitive drill sheets!</i>`;

    await this.callApi('sendMessage', {
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
      disable_web_page_preview: false,
    });
  }
}
