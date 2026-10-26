import type { Student, CognitiveGap, Guardian } from '@hex-aim/types';
import { SprintPdfCompiler, type PdfCompilerOptions } from './SprintPdfCompiler.js';
import { GuidePdfCompiler } from './GuidePdfCompiler.js';
import { AdaptiveSprintCompiler } from './AdaptiveSprintCompiler.js';
import { SocraticGuideCompiler } from './SocraticGuideCompiler.js';
import { WarmBrowserPoolCompiler } from './WarmBrowserPoolCompiler.js';
import { SettingsManager } from '../settings/SettingsManager.js';

export type { PdfCompilerOptions };

/**
 * Universal PDF Pack Compiler for HEX-AIM.
 * Primary: Approach C (Warm Headless Browser Pool for pixel-perfect CSS rendering in ~100ms).
 * Fallback: Approach A (pdf-lib lightweight in-memory compilation).
 */
export class PdfPackCompiler {
  /**
   * Generates a 4-page ADHD-friendly printable Student Sprint PDF.
   */
  public static async compileSprintPdf(
    student: Student,
    gaps: CognitiveGap[],
    options: PdfCompilerOptions = {}
  ): Promise<Uint8Array> {
    const settings = SettingsManager.getInstance();
    const useWarmPool = settings.get<boolean>('compiler.use_warm_pool', true);

    if (useWarmPool && typeof process !== 'undefined' && process.versions?.node) {
      try {
        const sprint = AdaptiveSprintCompiler.compile(student, gaps, {
          subjectTitle: options.subjectTitle,
          sprintNumber: options.week,
        });
        const pool = WarmBrowserPoolCompiler.getInstance();
        return await pool.compileHtmlToPdf(sprint.htmlContent);
      } catch (err) {
        console.warn('[PdfPackCompiler] Warm pool sprint compile error, using pdf-lib fallback:', err);
      }
    }

    return SprintPdfCompiler.compileSprintPdf(student, gaps, options);
  }

  /**
   * Generates a 2-page Parent Socratic Coaching Guide PDF.
   */
  public static async compileGuidePdf(
    student: Student,
    gaps: CognitiveGap[],
    guardian?: Guardian,
    options: PdfCompilerOptions = {}
  ): Promise<Uint8Array> {
    const settings = SettingsManager.getInstance();
    const useWarmPool = settings.get<boolean>('compiler.use_warm_pool', true);

    if (useWarmPool && typeof process !== 'undefined' && process.versions?.node) {
      try {
        const guide = SocraticGuideCompiler.compile(student, gaps, guardian);
        const pool = WarmBrowserPoolCompiler.getInstance();
        return await pool.compileHtmlToPdf(guide.htmlContent);
      } catch (err) {
        console.warn('[PdfPackCompiler] Warm pool guide compile error, using pdf-lib fallback:', err);
      }
    }

    return GuidePdfCompiler.compileGuidePdf(student, gaps, guardian, options);
  }
}
