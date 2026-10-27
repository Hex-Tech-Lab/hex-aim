import type { 
  IVisionExtractionPort, 
  AssessmentItem 
} from '@hex-aim/types';
import { SettingsManager, CurriculumTaxonomyService, type OpenRouterRoutingConfig } from '@hex-aim/core';

export interface OpenRouterVisionConfig {
  apiKey?: string;
  model?: string;
  baseUrl?: string;
}

export class OpenRouterVisionAdapter implements IVisionExtractionPort {
  private apiKey: string;
  private model: string;
  private baseUrl: string;
  private routingConfig: OpenRouterRoutingConfig;

  constructor(config?: OpenRouterVisionConfig) {
    const settings = SettingsManager.getInstance();
    this.routingConfig = settings.getOpenRouterRoutingConfig();
    this.apiKey = config?.apiKey || settings.get<string>('ai.openrouter.api_key', settings.get<string>('OPENROUTER_API_KEY', ''));
    this.model = config?.model || this.routingConfig.primaryModel;
    this.baseUrl = config?.baseUrl || this.routingConfig.baseUrl;

    if (!this.apiKey) {
      throw new Error('[OpenRouterVisionAdapter] Fatal: OPENROUTER_API_KEY is not configured in Centralized Settings Registry. Zero silent fallback enforced.');
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
    const settings = SettingsManager.getInstance();

    if (!this.apiKey) {
      throw new Error('[OpenRouterVisionAdapter] Fatal: OPENROUTER_API_KEY is missing from Centralized Settings Registry.');
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
      // In-line buffer remote images to base64 data URIs.
      if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) {
        try {
          const imgRes = await fetch(rawUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0 (compatible; HEX-AIM-Intake/1.0)' },
            signal: AbortSignal.timeout(this.routingConfig.imageFetchTimeoutMs),
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
    const candidateModels = Array.from(new Set([this.model, ...this.routingConfig.fallbackCascade]));

    let lastError = '';
    let data: any = null;

    for (let i = 0; i < candidateModels.length; i++) {
      const modelCandidate = candidateModels[i];
      if (!modelCandidate) continue;
      const nextCandidate = i + 1 < candidateModels.length ? candidateModels[i + 1] : undefined;

      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': this.routingConfig.httpReferer,
            'X-Title': this.routingConfig.appTitle,
          },
          body: JSON.stringify({
            model: modelCandidate,
            provider: {
              order: this.routingConfig.providerOrder,
              ignore: this.routingConfig.providerIgnore,
              allow_fallbacks: this.routingConfig.allowFallbacks,
            },
            messages: [
              {
                role: 'user',
                content: contentParts
              }
            ],
            temperature: this.routingConfig.temperature,
            response_format: { type: 'json_object' }
          }),
          signal: AbortSignal.timeout(this.routingConfig.timeoutMs),
        });

        if (!res.ok) {
          const errText = await res.text();
          lastError = `Status ${res.status}: ${errText}`;
          settings.logLoudFailure('OpenRouterVisionAdapter:extractAssessment', modelCandidate, lastError, nextCandidate);
          continue;
        }

        data = await res.json() as any;
        if (data?.choices?.[0]?.message?.content) {
          break; // successfully got completion
        } else {
          lastError = 'Empty completion choices payload';
          settings.logLoudFailure('OpenRouterVisionAdapter:extractAssessment', modelCandidate, lastError, nextCandidate);
        }
      } catch (reqErr: any) {
        lastError = String(reqErr?.message || reqErr);
        settings.logLoudFailure('OpenRouterVisionAdapter:extractAssessment', modelCandidate, lastError, nextCandidate);
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
