import type { 
  IVisionExtractionPort, 
  AssessmentItem 
} from '@hex-aim/types';
import { SettingsManager } from '@hex-aim/core';

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
    this.model = config?.model || settings.get<string>('OPENROUTER_VISION_MODEL', 'google/gemini-3.5-flash-lite');
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

    const prompt = `You are an expert British curriculum primary school diagnostic evaluator analyzing teacher-marked handwritten school worksheets for Year 4 students at Asten College.
Context hint provided by parent: studentId=${context.studentId}, subjectId=${context.subjectId}, yearGroup=${context.yearGroup}.

CRITICAL INSTRUCTIONS:
1. Student Identification: Inspect the name header written on the worksheet. Is this child "Lara" or "Maya"? Return "Lara" or "Maya" as detectedStudentName.
2. Subject Classification: Inspect the content. Is this "English" (reading comprehension, spelling, vocabulary, grammar, punctuation) or "Mathematics" (arithmetic, place value, number lines, calculations)? Return "english" or "maths" as detectedSubject.
3. Term Week: Inspect any week label (e.g. "Week 3", "Week 4", "October 2026"). Return the integer week number as detectedWeek.
4. Item Analysis: For each question, extract:
   - qNum: e.g. "1", "2a"
   - conceptCode: e.g. "Y4.ENG.COMP.INFERENCE" or "Y4.MATH.NPV.EMPTY_COLUMNS"
   - studentAnswer: exact handwritten text child wrote
   - correctAnswer: expected correct answer
   - status: "pass" | "fail" | "partial" (look for teacher green/red checkmarks and crosses)
   - errorClass: standard error classification (e.g. "ERR_COMPREHENSION_LITERAL", "ERR_PUNCTUATION_MISSING", "ERR_SPELLING_PHONETIC", "ERR_PHANTOM_ZERO", "ERR_TRANSPOSITION")
   - cognitiveFactor: cognitive reason (e.g. "working_memory_rush", "context_clue_omission", "phonetic_overgeneralization")
5. Scoring: Calculate total items, rawScore (items marked pass), and percentage.

Return STRICT JSON ONLY with NO MARKDOWN FENCES matching this exact schema:
{
  "detectedStudentName": "Lara" | "Maya" | null,
  "detectedSubject": "english" | "maths",
  "detectedWeek": 3,
  "detectedYearGroup": "Y4",
  "rawScore": number,
  "totalScore": number,
  "items": [
    {
      "qNum": "1",
      "conceptCode": "string",
      "studentAnswer": "string",
      "correctAnswer": "string",
      "status": "pass" | "fail" | "partial",
      "errorClass": "string",
      "cognitiveFactor": "string"
    }
  ]
}`;

    const contentParts: Array<{ type: string; text?: string; image_url?: { url: string } }> = [
      { type: 'text', text: prompt }
    ];

    for (const url of imageUrls) {
      if (url.startsWith('data:') || url.startsWith('http://') || url.startsWith('https://')) {
        contentParts.push({
          type: 'image_url',
          image_url: { url }
        });
      } else {
        contentParts.push({
          type: 'text',
          text: `[Image reference: ${url}]`
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
          })
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
