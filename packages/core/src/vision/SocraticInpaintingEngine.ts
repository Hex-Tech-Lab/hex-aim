/**
 * SocraticInpaintingEngine (Wave 24: Socratic Multi-Modal Inpainting)
 * Generates vector bounding-box error overlays, visual scaffolds, and Socratic inpainting
 * redaction prompts directly onto scanned student classwork.
 */

import type {
  InpaintingInspectionResult,
  SocraticInpaintingOverlay,
} from '@hex-aim/types';

export class SocraticInpaintingEngine {
  private static instance: SocraticInpaintingEngine;

  private constructor() {}

  public static getInstance(): SocraticInpaintingEngine {
    if (!SocraticInpaintingEngine.instance) {
      SocraticInpaintingEngine.instance = new SocraticInpaintingEngine();
    }
    return SocraticInpaintingEngine.instance;
  }

  /**
   * Generates inpainting overlays for an ingested student assessment submission page.
   */
  public generateInpaintingOverlays(
    submissionId: string,
    pageNumber: number = 1
  ): InpaintingInspectionResult {
    // Determine student and context from submissionId
    const isMaya = submissionId.toLowerCase().includes('maya');
    const isMath = submissionId.toLowerCase().includes('math');
    const studentId = isMaya ? 'maya' : 'lara';

    const overlays: SocraticInpaintingOverlay[] = [];

    if (!isMath) {
      // Science: Sound & Mediums (Lara Y4)
      overlays.push({
        questionNumber: 'Q2',
        conceptId: 'Y4.SCI.SND.MEDIUM',
        errorTaxonomyId: 'ERR_DENSE_MEDIUM_INVERSION',
        boundingBox: {
          x: 75,
          y: 390,
          width: 650,
          height: 125,
          label: 'Q2: Acoustic Medium Misconception',
          confidence: 0.994,
        },
        misconceptionSummary:
          'Student claimed sound travels faster in air than water because water is heavier, inverting the physical particle-collision principle.',
        socraticPromptText:
          'Think of sound as dominos knocking together. If the dominos are packed tightly like in water, does the wave reach the end faster or slower than if they are far apart in air?',
        visualScaffoldType: 'particle_proximity_grid',
        svgScaffoldSnippet: this.generateParticleProximitySvg(),
        redactedQuestionText: 'Compare the speed of sound through water compared to air.',
        guidedBlankPrompt:
          'Sound travels [_______] in water than air because water molecules are packed closer together, allowing vibrations to transfer [_______].',
        remediationActionUrl: 'https://aim.getvintel.com/sprint/preview?concept=Y4.SCI.SND.MEDIUM',
      });
    } else {
      // Maths: Place-Value & Number Line Ordering (Maya / Lara)
      overlays.push({
        questionNumber: 'Q4',
        conceptId: 'Y4.MATH.NPV.5DIGIT_ORDERING',
        errorTaxonomyId: 'ERR_SHARED_PREFIX_ORDERING',
        boundingBox: {
          x: 75,
          y: 420,
          width: 650,
          height: 115,
          label: 'Q4: Shared Prefix Place-Value Error',
          confidence: 0.991,
        },
        misconceptionSummary:
          'Student misordered 42,305 and 42,053 by ignoring the hundreds zero and comparing the last two digits.',
        socraticPromptText:
          'Both numbers start with 42 thousands. Compare the hundreds digit: in 42,305 we have 3 hundreds; in 42,053 we have 0 hundreds. Which number has more hundreds?',
        visualScaffoldType: 'place_value_scale',
        svgScaffoldSnippet: this.generatePlaceValueScaleSvg(),
        redactedQuestionText: 'Order these numbers from least to greatest: 42,305 and 42,053.',
        guidedBlankPrompt:
          '42,053 has 0 hundreds, while 42,305 has 3 hundreds. Therefore, 42,053 is [_______] than 42,305.',
        remediationActionUrl: 'https://aim.getvintel.com/sprint/preview?concept=Y4.MATH.NPV.5DIGIT_ORDERING',
      });
    }

    return {
      submissionId,
      studentId,
      pageNumber,
      originalScanUrl: `/scans/${submissionId}_p${pageNumber}.png`,
      detectedErrorsCount: overlays.length,
      overlays,
    };
  }

  /**
   * Generates inline SVG vector scaffold for particle proximity (Sound through mediums).
   */
  public generateParticleProximitySvg(): string {
    return `<svg class="inpainting-scaffold-svg" viewBox="0 0 500 120" style="width: 100%; max-height: 120px; background: rgba(0,229,255,0.03); border: 1px dashed var(--cyan); border-radius: 6px; padding: 6px;">
      <!-- Air: Sparse Particles -->
      <g transform="translate(10, 10)">
        <text x="0" y="15" fill="#8892b0" font-size="11" font-weight="700">GAS / AIR (343 m/s) • Slow Transfer</text>
        <circle cx="20" cy="45" r="5" fill="#4ade80" />
        <circle cx="70" cy="45" r="5" fill="#4ade80" />
        <circle cx="120" cy="45" r="5" fill="#4ade80" />
        <circle cx="170" cy="45" r="5" fill="#4ade80" />
        <path d="M 28 45 L 62 45" stroke="#64748b" stroke-dasharray="2 2" stroke-width="1.5" />
        <text x="20" y="70" fill="#64748b" font-size="9">Far Apart (Collisions take time)</text>
      </g>
      <!-- Water: Dense Particles -->
      <g transform="translate(260, 10)">
        <text x="0" y="15" fill="#00e5ff" font-weight="700" font-size="11">LIQUID / WATER (1,480 m/s) • Fast Transfer 🚀</text>
        <circle cx="15" cy="45" r="5" fill="#00e5ff" />
        <circle cx="35" cy="45" r="5" fill="#00e5ff" />
        <circle cx="55" cy="45" r="5" fill="#00e5ff" />
        <circle cx="75" cy="45" r="5" fill="#00e5ff" />
        <circle cx="95" cy="45" r="5" fill="#00e5ff" />
        <circle cx="115" cy="45" r="5" fill="#00e5ff" />
        <path d="M 15 45 L 115 45" stroke="#00e5ff" stroke-width="2" />
        <text x="15" y="70" fill="#00e5ff" font-size="9">Close Proximity (Rapid Domino Effect)</text>
      </g>
    </svg>`;
  }

  /**
   * Generates inline SVG vector scaffold for 5-digit place value alignment.
   */
  public generatePlaceValueScaleSvg(): string {
    return `<svg class="inpainting-scaffold-svg" viewBox="0 0 500 120" style="width: 100%; max-height: 120px; background: rgba(245,158,11,0.03); border: 1px dashed var(--orange); border-radius: 6px; padding: 6px;">
      <g transform="translate(10, 10)">
        <text x="0" y="15" fill="#8892b0" font-size="11" font-weight="700">PLACE-VALUE COLUMNS: T-Th | Th | H | T | O</text>
        <!-- Number 1 -->
        <rect x="0" y="25" width="220" height="26" fill="rgba(255,255,255,0.05)" rx="4" />
        <text x="10" y="42" fill="#e2e8f0" font-family="monospace" font-size="12">4  2 , <tspan fill="#f59e0b" font-weight="bold">3</tspan>  0  5  (3 Hundreds)</text>
        <!-- Number 2 -->
        <rect x="0" y="58" width="220" height="26" fill="rgba(255,255,255,0.05)" rx="4" />
        <text x="10" y="75" fill="#e2e8f0" font-family="monospace" font-size="12">4  2 , <tspan fill="#4ade80" font-weight="bold">0</tspan>  5  3  (0 Hundreds)</text>
      </g>
      <g transform="translate(250, 25)">
        <text x="0" y="20" fill="#4ade80" font-size="12" font-weight="700">Step 1: Prefix '42' matches</text>
        <text x="0" y="45" fill="#f59e0b" font-size="12" font-weight="700">Step 2: Compare Hundreds column</text>
        <text x="0" y="70" fill="#00e5ff" font-size="12">3 Hundreds &gt; 0 Hundreds → 42,305 is larger!</text>
      </g>
    </svg>`;
  }

  /**
   * Generates the complete HTML fragment for the Socratic Inpainting overlay card.
   */
  public renderInpaintingOverlayHtml(overlay: SocraticInpaintingOverlay): string {
    return `
    <div class="inpainting-overlay-card" style="margin-top: 15px; border-left: 3px solid var(--orange); background: rgba(245,158,11,0.06); padding: 12px; border-radius: 4px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
        <span style="font-size: 11px; font-weight: 700; color: var(--orange); text-transform: uppercase;">
          🎯 Wave 24 Socratic Vector Inpainting • ${overlay.questionNumber}
        </span>
        <span class="badge badge-yellow" style="font-size: 10px;">${overlay.errorTaxonomyId}</span>
      </div>
      <p style="font-size: 12px; color: var(--astryx-text-contrast); margin-bottom: 8px;">
        <strong>Socratic Guardian Prompt:</strong> <em>"${overlay.socraticPromptText}"</em>
      </p>
      <div style="margin: 8px 0;">
        ${overlay.svgScaffoldSnippet}
      </div>
      <div style="background: rgba(0,0,0,0.25); padding: 8px; border-radius: 4px; font-size: 12px; font-family: monospace; color: var(--cyan); margin-top: 8px;">
        ✏️ <strong>Guided Student Inpainting Blank:</strong><br />
        ${overlay.guidedBlankPrompt}
      </div>
    </div>`;
  }
}
