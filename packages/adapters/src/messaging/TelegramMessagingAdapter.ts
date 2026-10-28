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
  ): Promise<any> {
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
    return await this.callApi('sendMessage', payload);
  }

  public async deleteMessage(chatId: string, messageId: number): Promise<boolean> {
    try {
      await this.callApi('deleteMessage', {
        chat_id: chatId,
        message_id: messageId,
      });
      return true;
    } catch {
      return false;
    }
  }

  public async deleteMessages(chatId: string, messageIds: number[]): Promise<boolean> {
    if (!messageIds || messageIds.length === 0) return true;
    try {
      for (let i = 0; i < messageIds.length; i += 100) {
        const slice = messageIds.slice(i, i + 100);
        await this.callApi('deleteMessages', {
          chat_id: chatId,
          message_ids: slice,
        }).catch(err => {
          console.warn('[TelegramMessagingAdapter] deleteMessages slice warning:', err);
        });
      }
      return true;
    } catch (err) {
      console.warn('[TelegramMessagingAdapter] deleteMessages failed:', err);
      return false;
    }
  }

  public async sendInteractiveMenu(chatId: string, customTitle?: string, lang: 'en' | 'ar' = 'en'): Promise<any> {
    const isAr = lang === 'ar';
    const title = customTitle || (isAr ? '🎛️ <b>مركز تحكم الوالدين • نظام AIM</b>' : '🎛️ <b>AIM Parent Control Center</b>');
    const text = isAr
      ? `${title}\n\n<i>وصول فوري لتمارين طفلك المركزة وأدلة التوجيه السقراطي المباشرة:</i>`
      : `${title}\n\n<i>Access your child's targeted sprints and coaching guides directly inside Telegram below:</i>`;

    const inlineKeyboard = {
      inline_keyboard: isAr ? [
        [
          { text: '📊 ملخص لارا الأكاديمي', callback_data: 'view_progress:lara' },
          { text: '📊 ملخص مايا الأكاديمي', callback_data: 'view_progress:maya' }
        ],
        [
          { text: '👧 تمارين لارا (تطبيق مصغر)', web_app: { url: 'https://aim.getvintel.com/sprint/preview' } },
          { text: '👧 تمارين مايا (تطبيق مصغر)', web_app: { url: 'https://aim.getvintel.com/sprint/preview' } }
        ],
        [
          { text: '🧭 دليل لارا السقراطي', web_app: { url: 'https://aim.getvintel.com/guide/preview' } },
          { text: '🧭 دليل مايا السقراطي', web_app: { url: 'https://aim.getvintel.com/guide/preview' } }
        ],
        [
          { text: '📱 لوحة تحكم AIM المباشرة', web_app: { url: 'https://aim.getvintel.com' } }
        ],
        [
          { text: '🌐 التبديل إلى الإنجليزية 🇬🇧', callback_data: 'set_lang:en' }
        ],
        [
          { text: '📚 تغيير أسبوع المراجعة', callback_data: 'menu_change_week' },
          { text: '🔄 تصفير الجلسة', callback_data: 'reset_session' }
        ],
        [
          { text: '🧹 مسح المحادثة', callback_data: 'clear_chat' },
          { text: '↩️ إغلاق القائمة', callback_data: 'close_menu' }
        ]
      ] : [
        [
          { text: '📊 Lara Progress Snapshot', callback_data: 'view_progress:lara' },
          { text: '📊 Maya Progress Snapshot', callback_data: 'view_progress:maya' }
        ],
        [
          { text: '👧 Lara Sprint (Mini-App)', web_app: { url: 'https://aim.getvintel.com/sprint/preview' } },
          { text: '👧 Maya Sprint (Mini-App)', web_app: { url: 'https://aim.getvintel.com/sprint/preview' } }
        ],
        [
          { text: '🧭 Lara Guide (Mini-App)', web_app: { url: 'https://aim.getvintel.com/guide/preview' } },
          { text: '🧭 Maya Guide (Mini-App)', web_app: { url: 'https://aim.getvintel.com/guide/preview' } }
        ],
        [
          { text: '📱 Open AIM Mastery Console', web_app: { url: 'https://aim.getvintel.com' } }
        ],
        [
          { text: '🌐 Switch to Arabic 🇪🇬', callback_data: 'set_lang:ar' }
        ],
        [
          { text: '📚 Change Target Week', callback_data: 'menu_change_week' },
          { text: '🔄 Reset Session Quota', callback_data: 'reset_session' }
        ],
        [
          { text: '🧹 Clear Chat History', callback_data: 'clear_chat' },
          { text: '↩️ Return / Close', callback_data: 'close_menu' }
        ]
      ]
    };

    return await this.sendMessage(chatId, text, undefined, inlineKeyboard);
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
      statusDescription?: string;
    }>;
  }): Promise<void> {
    let table = `<pre>`;
    table += `──────────────────────────────────────────────\n`;
    table += `STUDENT  SUBJECT  WEEK  PAGES  STATUS\n`;
    table += `──────────────────────────────────────────────\n`;

    for (const s of summary.students) {
      const nameCol = s.name.padEnd(8);
      const subjCol = s.subject.toUpperCase().slice(0, 7).padEnd(8);
      const wkCol = (`W${s.week}`).padEnd(5);
      const pagesCol = (`${s.pageCount}`).padEnd(6);
      const statusCol = s.statusDescription || (s.isPractice ? 'Practice' : 'Graded');
      table += `${nameCol} ${subjCol} ${wkCol} ${pagesCol} ${statusCol}\n`;
    }
    table += `──────────────────────────────────────────────</pre>`;

    const text = `📋 <b>Worksheet Batch Verified (${summary.totalPhotos} Pages Received)</b>\n\n` +
      table + `\n\n` +
      `💡 <i>Zero Drill Sheets: Personalized 4-page sprint packs & parent guides are attaching below...</i>`;

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
    skipMenu?: boolean;
  }): Promise<void> {
    const name = packs.studentName || 'Student';
    const subj = packs.subject ? packs.subject.toUpperCase() : 'MASTERY';
    const week = packs.week || 3;
    const sprintWebUrl = packs.studentPackHtml || 'https://aim.getvintel.com/sprint/preview';
    const guideWebUrl = packs.coachingGuideHtml || 'https://aim.getvintel.com/guide/preview';

    // 1. Send clean consolidated message with Mini-App action buttons
    const text = `🎉 <b>Targeted Learning Pack Ready: ${name} (${subj} W${week})</b>\n\n` +
      `✨ <b>Zero Drill Sheets:</b> Personalized micro-practice targeting specific gaps.\n\n` +
      `📱 <i>Tap below to open interactive views inside Telegram, or download the printable PDFs attached:</i>`;

    const inlineKeyboard = {
      inline_keyboard: [
        [
          { text: `📄 Open ${name}'s Sprint (Mini-App)`, web_app: { url: sprintWebUrl } }
        ],
        [
          { text: `🧭 Open ${name}'s Parent Guide (Mini-App)`, web_app: { url: guideWebUrl } }
        ]
      ]
    };

    await this.callApi('sendMessage', {
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
      link_preview_options: { is_disabled: true },
      reply_markup: inlineKeyboard,
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
        await this.sendMessage(chatId, `⚠️ <b>PDF Delivery Error:</b> Failed to attach student pack PDF (${docErr?.message || 'timeout'}).`);
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
        await this.sendMessage(chatId, `⚠️ <b>PDF Delivery Error:</b> Failed to attach coaching guide PDF (${docErr?.message || 'timeout'}).`);
        throw docErr;
      }
    }

    // 4. Present the Parent Control Center Interactive Menu unless skipped
    if (!packs.skipMenu) {
      await this.sendInteractiveMenu(chatId);
    }
  }
}
