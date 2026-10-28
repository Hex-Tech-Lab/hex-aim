import type { TeacherCohortMetrics } from '@hex-aim/types';
import { renderUniversalHeader, renderUniversalHeaderScripts } from './universalHeader.js';
import { renderDashboardStyles } from './dashboardStyles.js';

export function renderTeacherPortalHtml(metrics: TeacherCohortMetrics): string {
  const universalHeaderHtml = renderUniversalHeader({
    activePortal: 'teacher',
    breadcrumb: {
      returnUrl: '/',
      returnLabelEn: '← Console',
      returnLabelAr: '→ لوحة التحكم',
      currentEn: `${metrics.schoolName} • Year ${metrics.yearGroup} Teacher Portal`,
      currentAr: `${metrics.schoolName} • بوابة معلمي الصف الرابع`,
      badgeTextEn: 'Wave 27 Institutional',
      badgeTextAr: 'المرحلة ٢٧ مؤسسية',
      actions: [
        {
          labelEn: '⬇ Download MIS CSV Export',
          labelAr: '⬇ تصدير تقرير MIS (CSV)',
          href: `/api/school/${metrics.schoolId}/export.csv`,
          primary: true,
          icon: 'download'
        }
      ]
    }
  });

  return `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${metrics.schoolName} | AIM Teacher Portal</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Cairo:wght@400;600;700&display=swap" rel="stylesheet">
  <script src="https://unpkg.com/lucide@latest"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            'astryx-bg': '#090d16',
            'astryx-surface': '#0e1526',
            'astryx-card': '#131b2e',
            'astryx-cyan': '#00e5ff',
          }
        }
      }
    };
  </script>
  ${renderDashboardStyles()}
  <style>
    .teacher-container {
      max-width: 1280px;
      width: 100%;
      margin: 20px auto 40px auto;
      padding: 0 24px;
      flex: 1;
    }
    .grid-kpi {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }
    .kpi-card {
      background: var(--card-bg, #111827);
      border: 1px solid var(--card-border, #1f2937);
      border-radius: var(--astryx-radius-md, 8px);
      padding: 16px 20px;
      transition: all 0.2s ease;
    }
    .kpi-card:hover {
      border-color: var(--cyan);
    }
    .kpi-title {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--muted);
      margin-bottom: 8px;
    }
    .kpi-val {
      font-size: 1.75rem;
      font-weight: 800;
      color: var(--astryx-text-contrast, #f1f5f9);
      font-family: var(--astryx-font-mono, monospace);
    }
    .btn-export {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(6, 182, 212, 0.12);
      border: 1px solid rgba(6, 182, 212, 0.4);
      color: var(--cyan);
      padding: 6px 14px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 700;
      text-decoration: none;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .btn-export:hover {
      background: rgba(6, 182, 212, 0.25);
      border-color: var(--cyan);
    }
  </style>
</head>
<body>
  ${universalHeaderHtml}

  <div class="teacher-container">
    <div class="grid-kpi">
      <div class="kpi-card">
        <div class="kpi-title">
          <span class="lang-en-only">Cohort Mastery Avg</span>
          <span class="lang-ar-only">متوسط إتقان الدفعة</span>
        </div>
        <div class="kpi-val" style="color: var(--green);">${metrics.cohortAverageMastery}%</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-title">
          <span class="lang-en-only">Total Enrolled</span>
          <span class="lang-ar-only">إجمالي الطلاب المقيدين</span>
        </div>
        <div class="kpi-val">${metrics.totalStudents}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-title">
          <span class="lang-en-only">Accommodated (ADHD/Sensory)</span>
          <span class="lang-ar-only">الدعامات الحسية والتركيز</span>
        </div>
        <div class="kpi-val" style="color: var(--yellow);">${metrics.accommodatedStudentsCount}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-title">
          <span class="lang-en-only">Science / Maths / English</span>
          <span class="lang-ar-only">العلوم / الرياضيات / الإنجليزية</span>
        </div>
        <div class="kpi-val" style="font-size: 1.25rem; font-family: var(--astryx-font-mono, monospace); color: var(--cyan); margin-top: 6px;">
          ${metrics.subjectPerformance.science}% / ${metrics.subjectPerformance.maths}% / ${metrics.subjectPerformance.english}%
        </div>
      </div>
    </div>

    <!-- Diagnostic Concept Heatmap -->
    <div class="card" style="margin-bottom: 24px;">
      <div class="card-header">
        <h2>
          <span>🗺️</span>
          <span class="lang-en-only">Macro Diagnostic Concept Heatmap</span>
          <span class="lang-ar-only">خريطة المفاهيم التشخيصية العامة</span>
        </h2>
        <span class="badge badge-cyan">
          <span class="lang-en-only">Topological DAG Aggregation</span>
          <span class="lang-ar-only">تجميع المخطط التوجيهي للمفاهيم</span>
        </span>
      </div>
      <table>
        <thead>
          <tr>
            <th><span class="lang-en-only">Concept Code</span><span class="lang-ar-only">رمز المفهوم</span></th>
            <th><span class="lang-en-only">Concept Title</span><span class="lang-ar-only">عنوان المفهوم</span></th>
            <th><span class="lang-en-only">Subject</span><span class="lang-ar-only">المادة</span></th>
            <th><span class="lang-en-only">Cohort Mastery</span><span class="lang-ar-only">إتقان الدفعة</span></th>
            <th><span class="lang-en-only">Diagnostic Status</span><span class="lang-ar-only">الحالة التشخيصية</span></th>
            <th><span class="lang-en-only">At-Risk Students</span><span class="lang-ar-only">الطلاب المحتاجون لدعم</span></th>
          </tr>
        </thead>
        <tbody>
          ${metrics.conceptHeatmap.map(c => `
            <tr>
              <td><code style="font-family: var(--astryx-font-mono); color: #38bdf8;">${c.conceptCode}</code></td>
              <td><strong>${c.conceptTitle}</strong></td>
              <td>
                <span class="lang-en-only" style="text-transform: capitalize;">${c.subject}</span>
                <span class="lang-ar-only">${c.subject === 'science' ? 'العلوم' : c.subject === 'maths' ? 'الرياضيات' : 'الإنجليزية'}</span>
              </td>
              <td><strong>${c.masteryPercentage}%</strong></td>
              <td>
                ${c.status === 'critical_gap' ? '<span class="badge badge-red"><span class="lang-en-only">Critical Gap</span><span class="lang-ar-only">فجوة حرجة</span></span>' : ''}
                ${c.status === 'stabilizing' ? '<span class="badge badge-yellow"><span class="lang-en-only">Stabilizing</span><span class="lang-ar-only">قيد الاستقرار</span></span>' : ''}
                ${c.status === 'mastered' ? '<span class="badge badge-green"><span class="lang-en-only">Mastered</span><span class="lang-ar-only">تم الإتقان</span></span>' : ''}
              </td>
              <td>
                ${c.studentsAtRisk.length > 0
                  ? c.studentsAtRisk.map(s => `<span class="badge badge-red" style="margin-right: 4px;">${s}</span>`).join('')
                  : '<span style="color: var(--muted); font-size: 12px;"><span class="lang-en-only">None (Resolved)</span><span class="lang-ar-only">لا يوجد (مكتمل)</span></span>'
                }
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <!-- Student Roster & Sensory Accommodations -->
    <div class="card">
      <div class="card-header">
        <h2>
          <span>📋</span>
          <span class="lang-en-only">Student Roster & Sensory Scaffolds</span>
          <span class="lang-ar-only">قائمة الطلاب والدعامات المعرفية</span>
        </h2>
        <span style="font-size: 12px; color: var(--muted); font-weight: normal;">
          <span class="lang-en-only">Individualized accommodations sync</span>
          <span class="lang-ar-only">مزامنة التسهيلات الفردية</span>
        </span>
      </div>
      <table>
        <thead>
          <tr>
            <th><span class="lang-en-only">Student</span><span class="lang-ar-only">الطالب</span></th>
            <th><span class="lang-en-only">Year</span><span class="lang-ar-only">الصف</span></th>
            <th><span class="lang-en-only">Avg Mastery</span><span class="lang-ar-only">متوسط الإتقان</span></th>
            <th><span class="lang-en-only">Sensory Scaffold</span><span class="lang-ar-only">الدعامة الحسية</span></th>
            <th><span class="lang-en-only">Active Accommodations</span><span class="lang-ar-only">التسهيلات النشطة</span></th>
            <th><span class="lang-en-only">Primary Intervention Target</span><span class="lang-ar-only">الهدف العلاجي الأول</span></th>
          </tr>
        </thead>
        <tbody>
          ${metrics.studentsRoster.map(s => `
            <tr>
              <td><strong>${s.name}</strong></td>
              <td>${s.yearGroup}</td>
              <td><strong style="color: ${s.averageScore >= 90 ? 'var(--green)' : 'var(--yellow)'};">${s.averageScore}%</strong></td>
              <td>
                ${s.needsSensoryScaffold
                  ? '<span class="badge badge-yellow"><span class="lang-en-only">Yes (ADHD Sensory Support)</span><span class="lang-ar-only">نعم (دعم حسي ADHD)</span></span>'
                  : '<span style="color: var(--muted); font-size: 12px;"><span class="lang-en-only">Standard</span><span class="lang-ar-only">اعتيادي</span></span>'
                }
              </td>
              <td>
                ${s.accommodations.map(a => `<span class="badge badge-cyan" style="margin: 2px;">${a}</span>`).join('')}
              </td>
              <td><code style="font-family: var(--astryx-font-mono); font-size: 11px; color: #a78bfa;">${s.primaryInterventionConcept}</code></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  </div>

  <script>
    ${renderUniversalHeaderScripts()}
  </script>
</body>
</html>`;
}
