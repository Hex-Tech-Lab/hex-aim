import type { IMessagingPort } from '@hex-aim/types';

export interface WhatsAppConfig {
  accessToken: string;
  phoneNumberId: string;
  apiVersion?: string;
  appSecret?: string;
  apiBaseUrl?: string;
  fetchFn?: typeof fetch;
}

export class WhatsAppMessagingAdapter implements IMessagingPort {
  private accessToken: string;
  private phoneNumberId: string;
  private apiVersion: string;
  private appSecret?: string;
  private apiBaseUrl: string;
  private fetchFn: typeof fetch;

  constructor(config: WhatsAppConfig) {
    if (!config.accessToken) {
      throw new Error('[WhatsAppMessagingAdapter] accessToken is required.');
    }
    if (!config.phoneNumberId) {
      throw new Error('[WhatsAppMessagingAdapter] phoneNumberId is required.');
    }
    this.accessToken = config.accessToken;
    this.phoneNumberId = config.phoneNumberId;
    this.apiVersion = config.apiVersion || 'v21.0';
    this.appSecret = config.appSecret;
    this.apiBaseUrl = config.apiBaseUrl || 'https://graph.facebook.com';
    this.fetchFn = config.fetchFn || fetch;
  }

  /**
   * Helper to execute authenticated requests to Meta WhatsApp Cloud API.
   */
  private async postGraph(endpoint: string, payload: Record<string, unknown>): Promise<any> {
    const url = `${this.apiBaseUrl}/${this.apiVersion}/${this.phoneNumberId}/${endpoint}`;
    const res = await this.fetchFn(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errBody = await res.text();
      let parsedErr: any;
      try {
        parsedErr = JSON.parse(errBody);
      } catch {
        parsedErr = null;
      }
      const message = parsedErr?.error?.message || errBody || res.statusText;
      console.error(`[WhatsAppMessagingAdapter] Meta Graph API Error ${res.status}:`, message);
      throw new Error(`WhatsApp API call failed (${res.status}): ${message}`);
    }

    return await res.json();
  }

  /**
   * Formats phone numbers into E.164 without '+' or leading zeros for WhatsApp Cloud API.
   * e.g. "+20 100 123 4567" -> "201001234567"
   */
  public cleanRecipient(chatId: string): string {
    return chatId.replace(/[^0-9]/g, '');
  }

  /**
   * Send plain text message or interactive message.
   */
  public async sendMessage(
    chatId: string,
    text: string,
    replyToMessageId?: number,
    replyMarkup?: Record<string, unknown>
  ): Promise<any> {
    const recipient = this.cleanRecipient(chatId);

    // If custom interactive markup is provided
    if (replyMarkup && replyMarkup.interactive) {
      const payload = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: recipient,
        type: 'interactive',
        interactive: replyMarkup.interactive,
      };
      return await this.postGraph('messages', payload);
    }

    // Default: Plain text
    const payload: Record<string, unknown> = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: recipient,
      type: 'text',
      text: {
        preview_url: false,
        body: text,
      },
    };

    if (replyToMessageId) {
      payload.context = {
        message_id: String(replyToMessageId),
      };
    }

    return await this.postGraph('messages', payload);
  }

  /**
   * Send photo upload receipt summary.
   */
  public async sendReceiptSummary(chatId: string, summary: { photoCount: number; mediaGroupId?: string }): Promise<void> {
    const text = `📥 *AIM Worksheet Intake Receipt*\n\n` +
      `Successfully received *${summary.photoCount}* photo(s).\n` +
      `⚡ Analyzing student handwriting and British curriculum milestone alignment...`;
    await this.sendMessage(chatId, text);
  }

  /**
   * Send confirmation card after OCR extraction.
   */
  public async sendConfirmationCard(chatId: string, card: {
    jobId: string;
    imageUrl: string;
    detectedStudent: string;
    detectedSubject: string;
    detectedWeek: string;
  }): Promise<void> {
    const text = `🎯 *Milestone Intake Identified*\n\n` +
      `👤 *Student:* ${card.detectedStudent}\n` +
      `📚 *Subject:* ${card.detectedSubject}\n` +
      `📅 *Term Week:* ${card.detectedWeek}\n\n` +
      `_Diagnostic scorecard is generating below..._`;
    await this.sendMessage(chatId, text);
  }

  /**
   * Send PDF or document attachment.
   */
  public async sendDocument(chatId: string, doc: {
    buffer?: Uint8Array | ArrayBuffer;
    url?: string;
    filename: string;
    caption?: string;
  }): Promise<any> {
    const recipient = this.cleanRecipient(chatId);

    // In Meta Cloud API, sending via hosted URL or media ID
    if (doc.url) {
      const payload = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: recipient,
        type: 'document',
        document: {
          link: doc.url,
          filename: doc.filename,
          caption: doc.caption || undefined,
        },
      };
      return await this.postGraph('messages', payload);
    }

    // If buffer provided without public URL, encode or inform
    if (doc.buffer) {
      console.warn(`[WhatsAppMessagingAdapter] Direct buffer upload requires media upload endpoint. Use URL or deliverRemediationPacks.`);
      const text = `📄 *${doc.filename}*\n${doc.caption || ''}\n\n_Document compiled and stored in portfolio._`;
      return await this.sendMessage(chatId, text);
    }
  }

  /**
   * Send Batch Intake Summary breakdown across students.
   */
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
    let text = `📦 *Batch Intake Completed (${summary.totalPhotos} pages)*\n\n`;
    for (const s of summary.students) {
      text += `• *${s.name}* — ${s.subject} (W${s.week}): ${s.pageCount} page(s)\n`;
      if (s.score) text += `   Score: ${s.score}\n`;
    }
    await this.sendMessage(chatId, text);
  }

  /**
   * Send WhatsApp Interactive Menu with action buttons.
   */
  public async sendInteractiveMenu(chatId: string, customTitle?: string): Promise<any> {
    const recipient = this.cleanRecipient(chatId);
    const headerTitle = customTitle || 'AIM Adaptive Intelligence System';

    const payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: recipient,
      type: 'interactive',
      interactive: {
        type: 'button',
        header: {
          type: 'text',
          text: headerTitle,
        },
        body: {
          text: 'Choose an action to review progress or compile tonight’s micro-remediation sprint:',
        },
        action: {
          buttons: [
            {
              type: 'reply',
              reply: {
                id: 'btn_progress',
                title: '📊 Progress Card',
              },
            },
            {
              type: 'reply',
              reply: {
                id: 'btn_sprint',
                title: '🚀 Generate Sprint',
              },
            },
            {
              type: 'reply',
              reply: {
                id: 'btn_guide',
                title: '🧭 Coaching Guide',
              },
            },
          ],
        },
      },
    };

    return await this.postGraph('messages', payload);
  }

  /**
   * Deliver Remediation Packs (Student Sprint & Parent Coaching Guide).
   */
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
    const sName = packs.studentName || 'Student';
    const subj = packs.subject || 'Curriculum';
    const week = packs.week || 8;

    const intro = `✨ *${sName}'s Remediation Pack (${subj.toUpperCase()} W${week}) Ready!*\n\n` +
      `✅ *ADHD/Dyslexia Chunking:* Mathematical line-wrapping & uncluttered spacing.\n` +
      `✅ *Socratic Coaching Companion:* 6-8 minute zero-pressure dialogue scripts.`;
    await this.sendMessage(chatId, intro);

    if (packs.studentPackPdf && typeof packs.studentPackPdf === 'string') {
      await this.sendDocument(chatId, {
        url: packs.studentPackPdf,
        filename: `${sName}_${subj}_W${week}_Sprint_Pack.pdf`,
        caption: `📄 ${sName}'s Targeted Practice Pack`,
      });
    }

    if (packs.coachingGuidePdf && typeof packs.coachingGuidePdf === 'string') {
      await this.sendDocument(chatId, {
        url: packs.coachingGuidePdf,
        filename: `Parent_Coaching_Guide_${sName}.pdf`,
        caption: `🧭 Socratic Parent Coaching Guide`,
      });
    }

    if (packs.summaryUrl) {
      await this.sendMessage(chatId, `🔗 *View Interactive Analytics:* ${packs.summaryUrl}`);
    }
  }

  /**
   * Verifies the X-Hub-Signature-256 header sent by Meta Webhooks.
   */
  public verifyWebhookSignature(rawBody: string, signatureHeader: string): boolean {
    if (!this.appSecret) {
      console.warn('[WhatsAppMessagingAdapter] Cannot verify webhook signature: appSecret is not configured.');
      return false;
    }
    if (!signatureHeader || !signatureHeader.startsWith('sha256=')) {
      return false;
    }

    const expectedSig = signatureHeader.slice(7);
    // Simple verification check helper
    try {
      const crypto = require('node:crypto');
      const hmac = crypto.createHmac('sha256', this.appSecret);
      hmac.update(rawBody);
      const computedSig = hmac.digest('hex');
      return crypto.timingSafeEqual(Buffer.from(computedSig, 'utf8'), Buffer.from(expectedSig, 'utf8'));
    } catch {
      return false;
    }
  }
}
