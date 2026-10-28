import * as fs from 'fs';
import * as path from 'path';
import { renderDashboardHtml } from './ui/dashboardHtml.js';
import { renderTeacherPortalHtml } from './ui/teacherPortalHtml.js';
import { renderExamSimulationHtml } from './ui/examSimulationHtml.js';
import { TeacherPortalEngine, ExamSimulationEngine } from '@hex-aim/core';

export function compileAllStaticPages(publicDir: string = './public'): void {
  // 1. Compile Main Dashboard Console
  fs.writeFileSync(path.join(publicDir, 'index.html'), renderDashboardHtml());
  console.log('✓ Compiled public/index.html');

  // 2. Compile Teacher Institutional Portal
  const schoolDir = path.join(publicDir, 'school');
  if (!fs.existsSync(schoolDir)) fs.mkdirSync(schoolDir, { recursive: true });

  const teacherEngine = TeacherPortalEngine.getInstance();
  const astenMetrics = teacherEngine.getCohortMetrics('asten-college', 'Y4');
  const teacherHtml = renderTeacherPortalHtml(astenMetrics);

  fs.writeFileSync(path.join(schoolDir, 'asten-college.html'), teacherHtml);
  fs.writeFileSync(path.join(schoolDir, 'index.html'), teacherHtml);
  console.log('✓ Compiled public/school/asten-college.html and public/school/index.html');

  // 3. Compile Exam Simulation Interfaces
  const examDir = path.join(publicDir, 'exam');
  if (!fs.existsSync(examDir)) fs.mkdirSync(examDir, { recursive: true });

  const examEngine = ExamSimulationEngine.getInstance();
  const sciExam = examEngine.getExam('exam_y4_sci_term1')!;
  const mathExam = examEngine.getExam('exam_y4_math_term1')!;

  fs.writeFileSync(path.join(examDir, 'exam_y4_sci_term1.html'), renderExamSimulationHtml(sciExam, 'lara'));
  fs.writeFileSync(path.join(examDir, 'exam_y4_math_term1.html'), renderExamSimulationHtml(mathExam, 'lara'));
  console.log('✓ Compiled public/exam/exam_y4_sci_term1.html and public/exam/exam_y4_math_term1.html');
}

// Auto-run if executed directly
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('compileStaticPages.js')) {
  compileAllStaticPages();
}
