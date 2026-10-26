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

  public async sendMessage(
    chatId: string,
    text: string,
    replyToMessageId?: number,
    replyMarkup?: Record<string, unknown>
  ): Promise<void> {
    const payload: Record<string, unknown> = {
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
      link_preview_options: { is_disabled: true },
    };
    if (replyToMessageId) {
      payload.reply_to_message_id = replyToMessageId;
    }
    if (replyMarkup) {
      payload.reply_markup = replyMarkup;
    }
    await this.callApi('sendMessage', payload);
  }

  public async sendInteractiveMenu(chatId: string, customTitle?: string): Promise<void> {
    const title = customTitle || '🎛️ <b>AIM Parent Control Center</b>';
    const text = `${title}\n\n` +
      `<i>Tap any option below to view sprints, guides, or manage settings:</i>`;

    const inlineKeyboard = {
      inline_keyboard: [
        [
          { text: '👧 Lara: Latest Sprint', callback_data: 'view_sprint_lara' },
          { text: '👧 Maya: Latest Sprint', callback_data: 'view_sprint_maya' }
        ],
        [
          { text: '🧭 Lara: Coaching Guide', callback_data: 'view_guide_lara' },
          { text: '🧭 Maya: Coaching Guide', callback_data: 'view_guide_maya' }
        ],
        [
          { text: '📱 Open AIM Mastery Console (Mini-App)', web_app: { url: 'https://aim.getvintel.com' } }
        ],
        [
          { text: '📚 Change Target Week', callback_data: 'menu_change_week' },
          { text: '🔄 Reset Ingestion Session', callback_data: 'reset_quota' }
        ]
      ]
    };

    await this.sendMessage(chatId, text, undefined, inlineKeyboard);
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
    students: Array<{
      name: string;
      subject: string;
      week: number;
      pageCount: number;
      isPractice?: boolean;
      score?: string;
      fileItems?: string[];
    }>;
  }): Promise<void> {
    const today = new Date().toISOString().split('T')[0]!;
    let text = `📥 <b>Worksheet Batch Ingested (${summary.totalPhotos} Pages Received)</b>\n\n`;

    for (let i = 0; i < summary.students.length; i++) {
      const s = summary.students[i]!;
      const mode = s.isPractice ? 'Practice' : 'Worksheet';
      const subj = s.subject.toUpperCase();
      text += `<b>${s.name} (Year 4 • ${subj} • Week ${s.week} • ${s.pageCount} Pages):</b>\n`;
      
      if (s.fileItems && s.fileItems.length > 0) {
        for (const item of s.fileItems) {
          text += `• <code>${item}</code>\n`;
        }
      } else {
        for (let p = 1; p <= s.pageCount; p++) {
          text += `• <code>${s.name} | ${mode} | ${subj} | W${s.week} | ${today} | Page ${p}/${s.pageCount}</code>\n`;
        }
      }

      if (i < summary.students.length - 1) {
        text += '\n'; // visual gap between students!
      }
    }

    text += `\n💡 <i>All pages classified. Cognitive gap ledger updated & printable PDF packs compiling below...</i>`;

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
      } catch (docErr: any) {
        console.error('[TelegramMessagingAdapter] Error sending student pack PDF:', docErr);
        await this.sendMessage(chatId, `⚠️ <b>PDF Delivery Error:</b> Failed to attach student pack PDF (${docErr?.message || 'timeout'}). Link: ${packs.studentPackHtml || consoleUrl}`);
        throw docErr;
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
      } catch (docErr: any) {
        console.error('[TelegramMessagingAdapter] Error sending coaching guide PDF:', docErr);
        await this.sendMessage(chatId, `⚠️ <b>PDF Delivery Error:</b> Failed to attach coaching guide PDF (${docErr?.message || 'timeout'}). Link: ${packs.coachingGuideHtml || consoleUrl}`);
        throw docErr;
      }
    }

    // 4. Always present the Parent Control Center Interactive Menu
    await this.sendInteractiveMenu(chatId);
  }
}
