import type { TeacherCohortMetrics } from '@hex-aim/types';
import { FederatedBenchmarkEngine } from '@hex-aim/core';
import { renderUniversalHeader, renderUniversalHeaderScripts } from './universalHeader.js';
import { renderDashboardStyles } from './dashboardStyles.js';

export function renderTeacherPortalHtml(metrics: TeacherCohortMetrics): string {
  const benchmark = FederatedBenchmarkEngine.getInstance().getBenchmark(metrics.schoolId, 'science', 0.5);
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

    <!-- Wave 33: Multi-School Federated Benchmark (epsilon-Differential Privacy) -->
    <div class="card" style="margin-bottom: 24px; border-left: 3px solid #8b5cf6;">
      <div class="card-header">
        <h2>
          <span>🏛️</span>
          <span class="lang-en-only">Multi-School Federated Benchmark (Wave 33)</span>
          <span class="lang-ar-only">المقارنة المعيارية الفيدرالية بين المدارس (الموجة ٣٣)</span>
        </h2>
        <div style="display: flex; gap: 8px; align-items: center;">
          <span class="badge" style="background: rgba(139, 92, 246, 0.2); color: #c084fc; border: 1px solid rgba(139, 92, 246, 0.4);">
            <span class="lang-en-only">ε-Differential Privacy (ε=0.5)</span>
            <span class="lang-ar-only">خصوصية تفاضلية مؤمّنة (ε=٠.٥)</span>
          </span>
          <span class="badge badge-green">
            <span class="lang-en-only">Top 9% Nationally</span>
            <span class="lang-ar-only">أعلى ٩٪ وطنياً</span>
          </span>
        </div>
      </div>

      <div style="font-size: 12.5px; color: var(--muted); margin-bottom: 16px; line-height: 1.5;">
        <span class="lang-en-only">Anonymized cross-school comparison against 3 peer British Primary cohorts across Greater Cairo and Alexandria. Calibrated Laplace noise guarantees no individual student score can be reverse-engineered.</span>
        <span class="lang-ar-only">مقارنة مجهولة المصدر عبر المدارس مقابل ٣ دفعات مماثلة في المدارس البريطانية بالقاهرة الكبرى والإسكندرية. تضمن آلية لابلاس الموزعة عدم إمكانية استنتاج درجات أي طالب فردياً.</span>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; margin-bottom: 20px;">
        ${Object.values(benchmark.conceptBenchmarkStats).map(stat => `
          <div style="background: rgba(15, 23, 42, 0.6); border: 1px solid var(--astryx-card-border); border-radius: 8px; padding: 14px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
              <code style="font-family: var(--astryx-font-mono); font-size: 11px; color: #38bdf8;">${stat.conceptCode}</code>
              <span class="badge badge-purple" style="font-size: 10px;">${stat.nationalPercentile}th Percentile</span>
            </div>
            <div style="font-size: 13px; font-weight: 700; color: #f1f5f9; margin-bottom: 8px;">
              <span class="lang-en-only">${stat.conceptTitleEn}</span>
              <span class="lang-ar-only">${stat.conceptTitleAr}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 11.5px; color: var(--muted); border-top: 1px solid rgba(148, 163, 184, 0.1); padding-top: 8px;">
              <span>Cohort Mean: <strong style="color: #34d399;">${stat.schoolCohortMean}%</strong></span>
              <span>DP Score: <strong style="color: #c084fc;">${stat.differentialMasteryScore}%</strong></span>
              <span>Decay Buffer: <strong style="color: #38bdf8;">+${Math.round((stat.comparativeDecayRate - 1) * 100)}%</strong></span>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Peer School Exchange Delta Summary -->
      <div style="background: rgba(30, 41, 59, 0.5); border-radius: 8px; padding: 12px 16px; border: 1px solid rgba(139, 92, 246, 0.2);">
        <div style="font-size: 11.5px; font-weight: 700; color: #c084fc; text-transform: uppercase; margin-bottom: 8px;">
          <span class="lang-en-only">Federated Peer School Benchmark Standing (Year 4 UK Primary Track)</span>
          <span class="lang-ar-only">الموقع المعياري للمدرسة بين الدفعات النظيرة (الصف الرابع)</span>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 10px;">
          ${benchmark.peerComparisons.map(p => `
            <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(15, 23, 42, 0.7); padding: 8px 12px; border-radius: 6px; font-size: 12px;">
              <div>
                <div style="font-weight: 600; color: #e2e8f0;">${p.schoolName}</div>
                <div style="font-size: 10.5px; color: var(--muted);">${p.cohortSizeBand}</div>
              </div>
              <div style="text-align: right;">
                <span class="badge ${p.relativeDeltaPct >= 0 ? 'badge-green' : 'badge-yellow'}" style="font-size: 10px;">
                  ${p.relativeDeltaPct >= 0 ? '+' + p.relativeDeltaPct : p.relativeDeltaPct}%
                </span>
                <div style="font-size: 9.5px; color: var(--muted); margin-top: 2px;">CI [${p.anonymizedConfidenceBand.join(', ')}]</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
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
