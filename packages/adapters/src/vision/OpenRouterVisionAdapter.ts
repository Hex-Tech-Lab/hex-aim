import type { 
  IVisionExtractionPort, 
  AssessmentItem 
} from '@hex-aim/types';
import { SettingsManager, CurriculumTaxonomyService } from '@hex-aim/core';

export interface OpenRouterVisionConfig {
  apiKey?: string;
  model?: string;
  baseUrl?: string;
}

export class OpenRouterVisionAdapter implements IVisionExtractionPort {
  private apiKey: string;
  private model: string;
  private baseUrl: string;

  constructor(config?: OpenRouterVisionConfig) {
    const settings = SettingsManager.getInstance();
    this.apiKey = config?.apiKey || settings.get<string>('OPENROUTER_API_KEY', '');
    this.model = config?.model || settings.get<string>('OPENROUTER_VISION_MODEL', 'google/gemini-2.5-flash');
    this.baseUrl = config?.baseUrl || 'https://openrouter.ai/api/v1';

    if (!this.apiKey) {
      throw new Error('[OpenRouterVisionAdapter] Fatal: OPENROUTER_API_KEY is not configured. Zero silent fallback enforced.');
    }
  }

  public async extractAssessment(
    imageUrls: string[],
    context: { studentId: string; subjectId: string; yearGroup: string }
  ): Promise<{
    items: AssessmentItem[];
    rawScore: number;
    totalScore: number;
    detectedStudentName?: string;
    detectedSubject?: string;
    detectedWeek?: number;
    detectedYearGroup?: string;
  }> {
    if (!this.apiKey) {
      throw new Error('[OpenRouterVisionAdapter] Cannot extract assessment: OPENROUTER_API_KEY is missing.');
    }

    if (!imageUrls || imageUrls.length === 0) {
      throw new Error('[OpenRouterVisionAdapter] Cannot extract assessment: imageUrls array is empty.');
    }

    const taxonomy = CurriculumTaxonomyService.getInstance();
    const prompt = taxonomy.buildVisionInstructionPrompt('Asten College', context.yearGroup || 'Year 4');

    const contentParts: Array<{ type: string; text?: string; image_url?: { url: string } }> = [
      { type: 'text', text: prompt }
    ];

    for (const rawUrl of imageUrls) {
      let finalUrl = rawUrl;
      // In-line buffer remote images (e.g. Telegram CDN) to base64 data URIs.
      // This prevents upstream OpenRouter providers from failing when fetching from Telegram CDN
      // and prevents leaking Telegram bot tokens in transit.
      if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) {
        try {
          const imgRes = await fetch(rawUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0 (compatible; HEX-AIM-Intake/1.0)' },
            signal: AbortSignal.timeout(15000),
          });
          if (imgRes.ok) {
            const mimeType = imgRes.headers.get('content-type') || 'image/jpeg';
            const arrayBuf = await imgRes.arrayBuffer();
            const base64 = Buffer.from(arrayBuf).toString('base64');
            finalUrl = `data:${mimeType};base64,${base64}`;
          }
        } catch (fetchErr) {
          console.warn('[OpenRouterVisionAdapter] Unable to inline image buffer to base64, using raw URL:', fetchErr);
        }
      }

      if (finalUrl.startsWith('data:') || finalUrl.startsWith('http://') || finalUrl.startsWith('https://')) {
        contentParts.push({
          type: 'image_url',
          image_url: { url: finalUrl }
        });
      } else {
        contentParts.push({
          type: 'text',
          text: `[Image reference: ${finalUrl}]`
        });
      }
    }

    const endpoint = `${this.baseUrl}/chat/completions`;
    const candidateModels = [this.model];
    if (this.model !== 'google/gemini-2.5-flash') {
      candidateModels.push('google/gemini-2.5-flash');
    }

    let lastError = '';
    let data: any = null;

    for (const modelCandidate of candidateModels) {
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://aim.getvintel.com',
            'X-Title': 'HEX-AIM Cognitive Intake'
          },
          body: JSON.stringify({
            model: modelCandidate,
            messages: [
              {
                role: 'user',
                content: contentParts
              }
            ],
            temperature: 0.1,
            response_format: { type: 'json_object' }
          }),
          signal: AbortSignal.timeout(35000),
        });

        if (!res.ok) {
          const errText = await res.text();
          console.warn(`[OpenRouterVisionAdapter] Model ${modelCandidate} failed with HTTP ${res.status}:`, errText);
          lastError = `Status ${res.status}: ${errText}`;
          continue;
        }

        data = await res.json() as any;
        if (data?.choices?.[0]?.message?.content) {
          break; // successfully got completion
        }
      } catch (reqErr: any) {
        lastError = String(reqErr?.message || reqErr);
        console.warn(`[OpenRouterVisionAdapter] Model ${modelCandidate} request error:`, lastError);
      }
    }

    if (!data?.choices?.[0]?.message?.content) {
      console.error(`[OpenRouterVisionAdapter] All candidate models failed. Last error:`, lastError);
      throw new Error(`OpenRouter Vision API failed across models [${candidateModels.join(', ')}]: ${lastError}`);
    }
    const rawContent = data?.choices?.[0]?.message?.content;
    if (!rawContent) {
      throw new Error('[OpenRouterVisionAdapter] Empty response content received from OpenRouter API.');
    }

    try {
      const cleaned = rawContent.replace(/```json\s*/gi, '').replace(/```\s*$/gi, '').trim();
      const parsed = JSON.parse(cleaned);

      return {
        detectedStudentName: parsed.detectedStudentName || (context.studentId ? `Student-${context.studentId}` : undefined),
        detectedSubject: parsed.detectedSubject || context.subjectId,
        detectedWeek: typeof parsed.detectedWeek === 'number' ? parsed.detectedWeek : 3,
        detectedYearGroup: parsed.detectedYearGroup || context.yearGroup || 'Y4',
        rawScore: typeof parsed.rawScore === 'number' ? parsed.rawScore : 0,
        totalScore: typeof parsed.totalScore === 'number' ? parsed.totalScore : Math.max(1, parsed.items?.length || 0),
        items: Array.isArray(parsed.items) ? parsed.items : []
      };
    } catch (parseErr) {
      console.error('[OpenRouterVisionAdapter] JSON parse error on response:', rawContent);
      throw new Error(`Failed to parse diagnostic JSON from OpenRouter Vision: ${String(parseErr)}`);
    }
  }
}
