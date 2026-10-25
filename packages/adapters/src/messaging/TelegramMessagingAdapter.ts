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

  public async sendMessage(chatId: string, text: string, replyToMessageId?: number): Promise<void> {
    const payload: Record<string, unknown> = {
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
    };
    if (replyToMessageId) {
      payload.reply_to_message_id = replyToMessageId;
    }
    await this.callApi('sendMessage', payload);
  }

  public async sendReceiptSummary(chatId: string, summary: { photoCount: number; mediaGroupId?: string }): Promise<void> {
    const text = `📥 <b>Batch Intake Received (${summary.photoCount} pages)</b>\n\n` +
      `⚡ <i>Running multimodal diagnostic evaluation via OpenRouter...\n` +
      `Identifying student, curriculum subject, and cognitive error classes.</i>`;
    await this.sendMessage(chatId, text);
  }

  public async sendConfirmationCard(chatId: string, card: {
    jobId: string;
    imageUrl: string;
    detectedStudent: string;
    detectedSubject: string;
    detectedWeek: string;
    replyToMessageId?: number;
  }): Promise<void> {
    const caption = `📸 <b>Worksheet Analyzed</b>\n\n` +
      `👤 <b>Student:</b> ${card.detectedStudent}\n` +
      `📚 <b>Subject:</b> ${card.detectedSubject}\n` +
      `🗓️ <b>Week:</b> ${card.detectedWeek}\n\n` +
      `🎯 <i>Compiling targeted 4-page sprint pack and parent coaching guide...</i>`;

    const payload: Record<string, unknown> = {
      chat_id: chatId,
      photo: card.imageUrl,
      caption,
      parse_mode: 'HTML',
    };
    if (card.replyToMessageId) {
      payload.reply_to_message_id = card.replyToMessageId;
    }

    try {
      await this.callApi('sendPhoto', payload);
    } catch {
      await this.sendMessage(chatId, caption, card.replyToMessageId);
    }
  }

  public async sendDocument(chatId: string, doc: {
    buffer?: Uint8Array | ArrayBuffer;
    url?: string;
    filename: string;
    caption?: string;
  }): Promise<void> {
    const endpoint = `${this.apiBaseUrl}/bot${this.botToken}/sendDocument`;

    if (doc.buffer) {
      const formData = new FormData();
      formData.append('chat_id', chatId);
      const blob = new Blob([doc.buffer as any], { type: 'application/pdf' });
      formData.append('document', blob, doc.filename);
      if (doc.caption) {
        formData.append('caption', doc.caption);
        formData.append('parse_mode', 'HTML');
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error('[TelegramMessagingAdapter] sendDocument FormData error:', errText);
        throw new Error(`Telegram sendDocument failed: ${errText}`);
      }
    } else if (doc.url) {
      await this.callApi('sendDocument', {
        chat_id: chatId,
        document: doc.url,
        caption: doc.caption || undefined,
        parse_mode: 'HTML',
      });
    }
  }

  public async sendBatchIntakeSummary(chatId: string, summary: {
    totalPhotos: number;
    students: Array<{ name: string; subject: string; week: number; pageCount: number; score?: string }>;
  }): Promise<void> {
    let text = `📥 <b>Batch Intake Evaluated (${summary.totalPhotos} pages)</b>\n\n`;
    for (const s of summary.students) {
      text += `👤 <b>${s.name}:</b> ${s.pageCount} pages • ${s.subject.toUpperCase()} Week ${s.week}${s.score ? ` (Score: ${s.score})` : ''}\n`;
    }
    text += `\n⚡ <i>Generating targeted printable sprints and parent guides...</i>\n` +
      `<i>Need to adjust child or week? Reply with:</i> <code>/edit [Name] Week [N]</code>`;

    await this.callApi('sendMessage', {
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
      link_preview_options: { is_disabled: true },
    });
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
    const name = packs.studentName || 'Student';
    const subj = packs.subject ? packs.subject.toUpperCase() : 'MASTERY';
    const week = packs.week || 3;
    const consoleUrl = packs.summaryUrl || 'https://aim.getvintel.com';

    // 1. Send clean consolidated message with overview link (NO dub link preview)
    const text = `🎉 <b>Targeted Learning Pack Ready: ${name} (${subj} W${week})</b>\n\n` +
      `✨ <b>Zero Drill Sheets:</b> Personalized micro-practice targeting specific gaps.\n\n` +
      `🌐 <b>Interactive Web Console:</b>\n` +
      `🔗 <a href="${consoleUrl}">Open ${name}'s Mastery Dashboard</a>\n\n` +
      `⬇️ <b>Printable PDF attachments:</b>`;

    await this.callApi('sendMessage', {
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
      link_preview_options: { is_disabled: true },
    });

    // 2. Deliver Student Sprint PDF
    if (packs.studentPackPdf) {
      try {
        const isBuf = typeof packs.studentPackPdf !== 'string';
        await this.sendDocument(chatId, {
          buffer: isBuf ? (packs.studentPackPdf as Uint8Array) : undefined,
          url: !isBuf ? (packs.studentPackPdf as string) : undefined,
          filename: `${name}_${subj}_Week${week}_Sprint.pdf`,
          caption: `📄 <b>${name}'s 4-Page Targeted Sprint</b> (Week ${week} • 6–10 mins micro-practice)`,
        });
      } catch (docErr) {
        console.error('[TelegramMessagingAdapter] Error sending student pack PDF:', docErr);
      }
    }

    // 3. Deliver Parent Socratic Coaching Guide PDF
    if (packs.coachingGuidePdf) {
      try {
        const isBuf = typeof packs.coachingGuidePdf !== 'string';
        await this.sendDocument(chatId, {
          buffer: isBuf ? (packs.coachingGuidePdf as Uint8Array) : undefined,
          url: !isBuf ? (packs.coachingGuidePdf as string) : undefined,
          filename: `Parent_Guide_${name}_${subj}_Week${week}.pdf`,
          caption: `🧭 <b>Parent Socratic Coaching Guide</b> (Week ${week} • 8-Minute Coaching Script)`,
        });
      } catch (docErr) {
        console.error('[TelegramMessagingAdapter] Error sending coaching guide PDF:', docErr);
      }
    }
  }
}
