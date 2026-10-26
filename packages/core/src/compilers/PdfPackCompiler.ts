import type { Student, CognitiveGap, Guardian } from '@hex-aim/types';
import { SprintPdfCompiler, type PdfCompilerOptions } from './SprintPdfCompiler.js';
import { GuidePdfCompiler } from './GuidePdfCompiler.js';

export type { PdfCompilerOptions };

/**
 * Universal PDF Pack Compiler for HEX-AIM.
 * Delegates to specialized Sprint and Socratic Guide compilers.
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
    return GuidePdfCompiler.compileGuidePdf(student, gaps, guardian, options);
  }
}
