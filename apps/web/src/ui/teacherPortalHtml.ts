import type { TeacherCohortMetrics } from '@hex-aim/types';

export function renderTeacherPortalHtml(metrics: TeacherCohortMetrics): string {
  return `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${metrics.schoolName} | AIM Teacher Portal</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Cairo:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #0b0f19;
      --card-bg: #111827;
      --border: #1f2937;
      --text: #f3f4f6;
      --muted: #9ca3af;
      --cyan: #06b6d4;
      --green: #10b981;
      --yellow: #eab308;
      --red: #ef4444;
      --purple: #a855f7;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
      background: var(--bg);
      color: var(--text);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    .hud {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 24px;
      background: rgba(17, 24, 39, 0.85);
      backdrop-filter: blur(8px);
      border-bottom: 1px solid var(--border);
      position: sticky;
      top: 0;
      z-index: 50;
    }
    .back-btn {
      color: var(--muted);
      text-decoration: none;
      font-size: 13px;
      padding: 6px 12px;
      border: 1px solid var(--border);
      border-radius: 6px;
      transition: all 0.2s;
    }
    .back-btn:hover {
      color: var(--text);
      border-color: var(--cyan);
    }
    .container {
      max-width: 1100px;
      width: 100%;
      margin: 28px auto;
      padding: 0 20px;
      flex: 1;
    }
    .grid-kpi {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }
    .kpi-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 18px;
    }
    .kpi-title {
      font-size: 12px;
      color: var(--muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .kpi-val {
      font-size: 1.8rem;
      font-weight: 800;
      color: #fff;
      margin-top: 4px;
    }
    .card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 24px;
    }
    .card-title {
      font-size: 1.1rem;
      font-weight: 700;
      color: #fff;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.88rem;
    }
    th {
      text-align: left;
      padding: 10px 14px;
      color: var(--muted);
      border-bottom: 1px solid var(--border);
      font-weight: 600;
      font-size: 11px;
      text-transform: uppercase;
    }
    td {
      padding: 12px 14px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
      vertical-align: middle;
    }
    .badge {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 600;
    }
    .badge-red { background: rgba(239, 68, 68, 0.15); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); }
    .badge-yellow { background: rgba(234, 179, 8, 0.15); color: #fde047; border: 1px solid rgba(234, 179, 8, 0.3); }
    .badge-green { background: rgba(16, 185, 129, 0.15); color: #6ee7b7; border: 1px solid rgba(16, 185, 129, 0.3); }
    .badge-cyan { background: rgba(6, 182, 212, 0.15); color: #67e8f9; border: 1px solid rgba(6, 182, 212, 0.3); }
    .btn-export {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(6, 182, 212, 0.12);
      border: 1px solid rgba(6, 182, 212, 0.4);
      color: var(--cyan);
      padding: 8px 16px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 700;
      text-decoration: none;
      cursor: pointer;
    }
    .btn-export:hover {
      background: rgba(6, 182, 212, 0.25);
    }
  </style>
</head>
<body>
  <div class="hud">
    <div style="display: flex; align-items: center; gap: 14px;">
      <a href="/" class="back-btn">← Console</a>
      <div>
        <strong style="font-size: 1rem;">${metrics.schoolName}</strong>
        <span style="font-size: 12px; color: var(--muted); margin-left: 8px;">Year ${metrics.yearGroup} Institutional Portal (Wave 27)</span>
      </div>
    </div>
    <a href="/api/school/${metrics.schoolId}/export.csv" class="btn-export">
      ⬇ Download MIS CSV Export
    </a>
  </div>

  <div class="container">
    <div class="grid-kpi">
      <div class="kpi-card">
        <div class="kpi-title">Cohort Mastery Avg</div>
        <div class="kpi-val" style="color: var(--green);">${metrics.cohortAverageMastery}%</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-title">Total Enrolled</div>
        <div class="kpi-val">${metrics.totalStudents}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-title">Accommodated (ADHD/Sensory)</div>
        <div class="kpi-val" style="color: var(--yellow);">${metrics.accommodatedStudentsCount}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-title">Science / Maths / English</div>
        <div class="kpi-val" style="font-size: 1.25rem; font-family: 'JetBrains Mono', monospace; color: var(--cyan); margin-top: 8px;">
          ${metrics.subjectPerformance.science}% / ${metrics.subjectPerformance.maths}% / ${metrics.subjectPerformance.english}%
        </div>
      </div>
    </div>

    <!-- Diagnostic Concept Heatmap -->
    <div class="card">
      <div class="card-title">
        <span>🗺️ Macro Diagnostic Concept Heatmap</span>
        <span class="badge badge-cyan">Topological DAG Aggregation</span>
      </div>
      <table>
        <thead>
          <tr>
            <th>Concept Code</th>
            <th>Concept Title</th>
            <th>Subject</th>
            <th>Cohort Mastery</th>
            <th>Diagnostic Status</th>
            <th>At-Risk Students</th>
          </tr>
        </thead>
        <tbody>
          ${metrics.conceptHeatmap.map(c => `
            <tr>
              <td><code style="font-family: 'JetBrains Mono', monospace; color: #38bdf8;">${c.conceptCode}</code></td>
              <td><strong>${c.conceptTitle}</strong></td>
              <td><span style="text-transform: capitalize;">${c.subject}</span></td>
              <td><strong>${c.masteryPercentage}%</strong></td>
              <td>
                ${c.status === 'critical_gap' ? '<span class="badge badge-red">Critical Gap</span>' : ''}
                ${c.status === 'stabilizing' ? '<span class="badge badge-yellow">Stabilizing</span>' : ''}
                ${c.status === 'mastered' ? '<span class="badge badge-green">Mastered</span>' : ''}
              </td>
              <td>
                ${c.studentsAtRisk.length > 0
                  ? c.studentsAtRisk.map(s => `<span class="badge badge-red" style="margin-right: 4px;">${s}</span>`).join('')
                  : '<span style="color: var(--muted); font-size: 12px;">None (Resolved)</span>'
                }
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <!-- Student Roster & Sensory Accommodations -->
    <div class="card">
      <div class="card-title">
        <span>📋 Student Roster & Sensory Scaffolds</span>
        <span style="font-size: 12px; color: var(--muted); font-weight: normal;">Individualized accommodations sync</span>
      </div>
      <table>
        <thead>
          <tr>
            <th>Student</th>
            <th>Year</th>
            <th>Avg Mastery</th>
            <th>Sensory Scaffold</th>
            <th>Active Accommodations</th>
            <th>Primary Intervention Target</th>
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
                  ? '<span class="badge badge-yellow">Yes (ADHD Sensory Support)</span>'
                  : '<span style="color: var(--muted); font-size: 12px;">Standard</span>'
                }
              </td>
              <td>
                ${s.accommodations.map(a => `<span class="badge badge-cyan" style="margin: 2px;">${a}</span>`).join('')}
              </td>
              <td><code style="font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #a78bfa;">${s.primaryInterventionConcept}</code></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  </div>
</body>
</html>`;
}
