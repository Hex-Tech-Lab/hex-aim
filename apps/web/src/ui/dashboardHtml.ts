import { renderDashboardStyles } from './dashboardStyles.js';
import { renderStudentProgressTab } from './tabStudentProgress.js';
import { renderGapLedgerTab } from './tabGapLedger.js';
import { renderInfraGateTab } from './tabInfraGate.js';

export function renderDashboardHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>HEX-AIM • Adaptive Individualized Mastery Console</title>
<!-- Wave 18: PWA Manifest & App Configuration -->
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#06b6d4">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<!-- Meta Astryx & Tailwind CSS Centralized Bridge -->
<script src="https://cdn.tailwindcss.com"></script>
<!-- Chart.js Graphics & Animation Library -->
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<!-- Lucide Modern Vector Icons -->
<script src="https://unpkg.com/lucide@latest"></script>
<script>
  tailwind.config = {
    darkMode: 'class',
    theme: {
      extend: {
        colors: {
          astryx: {
            bg: '#090d16',
            surface: '#111827',
            elevated: '#1e293b',
            border: '#1f2937',
            subtle: '#334155',
            primary: '#06b6d4',
            accent: '#3b82f6',
            success: '#10b981',
            warning: '#f59e0b',
            priority: '#f97316',
            purple: '#a855f7',
            danger: '#ef4444',
          }
        },
        borderRadius: {
          'astryx-sm': '6px',
          'astryx-md': '8px',
          'astryx-lg': '12px',
        }
      }
    }
  };
</script>
${renderDashboardStyles()}
</head>
<body>

  <header>
    <div class="logo-group">
      <h1>HEX-AIM <span>Mastery Console</span></h1>
      <div class="sub">Adaptive Individualized Mastery • Cognitive Gap Remediation & Intake Gate</div>
    </div>
    <div class="header-badges">
      <div class="badge-tag badge-region">
        <i data-lucide="server" class="inline w-3.5 h-3.5 mr-1"></i> cdg1 (Paris) • fra1 (Frankfurt)
      </div>
      <div class="badge-tag">
        <i data-lucide="graduation-cap" class="inline w-3.5 h-3.5 mr-1"></i> Asten College • Y4 British Primary
      </div>
      <button id="theme-toggle-btn" class="theme-toggle-btn" onclick="toggleTheme()" title="Switch Light / Dark Theme">
        <i id="theme-icon" data-lucide="sun" class="w-4 h-4"></i>
        <span id="theme-label">Light Mode</span>
      </button>
    </div>
  </header>

  <!-- Navigation Tabs -->
  <div class="nav-tabs">
    <button class="nav-tab active" onclick="switchTab('tab-student-view', this)">
      <i data-lucide="line-chart" class="w-4 h-4"></i> Student Progress & Mastery
    </button>
    <button class="nav-tab" onclick="switchTab('tab-gap-ledger', this)">
      <i data-lucide="brain-circuit" class="w-4 h-4"></i> Cognitive Gap Ledger
    </button>
    <button class="nav-tab" onclick="switchTab('tab-infra-gate', this)">
      <i data-lucide="shield-alert" class="w-4 h-4"></i> Ingestion Gate & Infrastructure
    </button>
  </div>

  ${renderStudentProgressTab()}
  ${renderGapLedgerTab()}
  ${renderInfraGateTab()}

  <script>
    // Tab Switching
    function switchTab(tabId, el) {
      document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));

      if (el) el.classList.add('active');
      const pane = document.getElementById(tabId);
      if (pane) pane.classList.add('active');
      if (window.lucide) lucide.createIcons();
    }

    // Dynamic Student Telemetry
    const studentsData = {
      lara: {
        name: "Lara",
        meta: "Asten College • Year 4 British Track • ADHD/Dyslexia traits active",
        termAvg: "92%",
        science: "94%",
        maths: "82%",
        english: "88%",
        status: "Mastery Stable (92% Avg)",
        score: "19 / 20",
        scorePct: "(95%)",
        eval: "Science Midterm: Mastered skeletons, muscles, and medicines. Working memory slipped on negative scale.",
        strategyTitle: "Target: 8 Min Sprint • Visual Chunking",
        strategyDesc: "ADHD & Dyslexia traits active. Visual room partitions protect place-value working memory under speed.",
        radar: [98, 91, 78, 72],
        gaugeVal: 94,
        series: {
          science: [52, 64, 72, 80, 85, 88, 91, 94],
          maths:   [45, 55, 62, 70, 75, 78, 80, 82],
          english: [60, 68, 75, 80, 82, 85, 86, 88]
        },
        misconceptions: [
          { code: "Y4.MATH.NPV.EMPTY_COLUMNS", class: "ERR_PHANTOM_ZERO", desc: "Omits zero in unmentioned place-value rooms (writes 24,16 for 24,106)", priority: "orange" },
          { code: "Y4.MATH.NPV.NEGATIVE_NUMBERS", class: "ERR_NEGATIVE_MAGNITUDE_INVERSION", desc: "Orders -4°C as warmer than -1°C", priority: "yellow" },
          { code: "Y4.MATH.NPV.WRITING_NUMBERS", class: "ERR_TRANSPOSITION", desc: "Transposing digits under time rush (writes 03 for thirty)", priority: "yellow" }
        ]
      },
      maya: {
        name: "Maya",
        meta: "Asten College • Year 4 British Track • Verbal strengths & peer teacher",
        termAvg: "94%",
        science: "96%",
        maths: "86%",
        english: "91%",
        status: "Mastery Advanced (94% Avg)",
        score: "20 / 20",
        scorePct: "(100%)",
        eval: "Science Midterm: Perfect classification keys and vertebrate traits. Clear methodical execution.",
        strategyTitle: "Target: 10 Min Sprint • Verbal Peer Teaching",
        strategyDesc: "High verbal retention and methodical steps. Explaining concepts aloud to Lara reinforces long-term schemas.",
        radar: [99, 95, 86, 84],
        gaugeVal: 96,
        series: {
          science: [60, 72, 80, 85, 89, 92, 94, 96],
          maths:   [50, 62, 70, 76, 80, 82, 84, 86],
          english: [65, 75, 82, 86, 88, 89, 90, 91]
        },
        misconceptions: [
          { code: "Y4.MATH.NPV.5DIGIT_ORDERING", class: "ERR_SHARED_PREFIX_ORDERING", desc: "Sequencing 5-digit numbers that share leading prefix digits", priority: "orange" },
          { code: "Y4.MATH.NPV.NUMBER_LINE_SCALES", class: "ERR_INTERVAL_DECODE", desc: "Counting tick marks by 1s instead of decoding jump size (+2, +5, +10)", priority: "yellow" },
          { code: "Y4.MATH.NPV.CROSSING_ZERO", class: "ERR_FENCEPOST_COUNT", desc: "Counting the starting tick mark across zero bridge", priority: "yellow" }
        ]
      }
    };

    // Chart.js References
    let trajectoryChart = null;
    let cognitiveRadarChart = null;
    let masteryGaugeChart = null;

    function initCharts() {
      // 1. Trajectory Multi-Line Chart
      const trajCtx = document.getElementById('trajectoryCanvas')?.getContext('2d');
      if (trajCtx) {
        trajectoryChart = new Chart(trajCtx, {
          type: 'line',
          data: {
            labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8 (Mid)'],
            datasets: [
              {
                label: 'Science',
                data: studentsData.lara.series.science,
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.12)',
                fill: true,
                tension: 0.38,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBackgroundColor: '#10b981',
              },
              {
                label: 'Maths',
                data: studentsData.lara.series.maths,
                borderColor: '#f59e0b',
                borderDash: [4, 4],
                fill: false,
                tension: 0.38,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBackgroundColor: '#f59e0b',
              },
              {
                label: 'English',
                data: studentsData.lara.series.english,
                borderColor: '#a855f7',
                fill: false,
                tension: 0.38,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBackgroundColor: '#a855f7',
              },
              {
                label: '80% Goal',
                data: [80, 80, 80, 80, 80, 80, 80, 80],
                borderColor: '#64748b',
                borderDash: [6, 6],
                borderWidth: 1.5,
                pointRadius: 0,
                fill: false,
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 900, easing: 'easeOutQuart' },
            interaction: { mode: 'index', intersect: false },
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: '#111827',
                titleColor: '#f3f4f6',
                bodyColor: '#9ca3af',
                borderColor: '#374151',
                borderWidth: 1,
                padding: 10,
                callbacks: {
                  label: ctx => \` \${ctx.dataset.label}: \${ctx.parsed.y}%\`
                }
              }
            },
            scales: {
              x: {
                grid: { color: '#1f2937' },
                ticks: { color: '#9ca3af', font: { size: 10 } }
              },
              y: {
                min: 40,
                max: 100,
                grid: { color: '#1f2937' },
                ticks: {
                  color: '#9ca3af',
                  font: { size: 10 },
                  callback: v => v + '%'
                }
              }
            }
          }
        });
      }

      // 2. Cognitive Domain Radar Chart
      const radarCtx = document.getElementById('cognitiveRadarCanvas')?.getContext('2d');
      if (radarCtx) {
        cognitiveRadarChart = new Chart(radarCtx, {
          type: 'radar',
          data: {
            labels: ['Recall', 'Concepts', 'Multi-Step', 'Pressure'],
            datasets: [{
              label: 'Mastery Level',
              data: studentsData.lara.radar,
              borderColor: '#06b6d4',
              backgroundColor: 'rgba(6, 182, 212, 0.25)',
              pointBackgroundColor: '#06b6d4',
              pointBorderColor: '#fff',
              pointRadius: 3,
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 800, easing: 'easeOutCubic' },
            plugins: { legend: { display: false } },
            scales: {
              r: {
                min: 50,
                max: 100,
                grid: { color: '#1f2937' },
                angleLines: { color: '#334155' },
                pointLabels: { color: '#cbd5e1', font: { size: 10, weight: 'bold' } },
                ticks: { display: false }
              }
            }
          }
        });
      }

      // 3. Zero-Alarm Mastery Gauge (Doughnut)
      const gaugeCtx = document.getElementById('masteryGaugeCanvas')?.getContext('2d');
      if (gaugeCtx) {
        masteryGaugeChart = new Chart(gaugeCtx, {
          type: 'doughnut',
          data: {
            datasets: [{
              data: [94, 6],
              backgroundColor: ['#10b981', '#1e293b'],
              borderWidth: 0,
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            circumference: 240,
            rotation: 240,
            cutout: '76%',
            plugins: { tooltip: { enabled: false }, legend: { display: false } },
            animation: { duration: 1000, easing: 'easeOutBack' }
          }
        });
      }
    }

    function setStudent(studentId) {
      document.querySelectorAll('.pill-btn').forEach(btn => btn.classList.remove('active'));
      const activeBtn = document.getElementById('pill-' + studentId);
      if (activeBtn) activeBtn.classList.add('active');

      const data = studentsData[studentId] || studentsData.lara;

      document.getElementById('student-name-header').innerText = data.name + "'s Academic Trajectory & Mastery Progression";
      document.getElementById('student-meta-sub').innerText = data.meta;
      document.getElementById('student-overall-status').innerText = data.status;

      document.getElementById('kpi-term-avg').innerText = data.termAvg;
      document.getElementById('kpi-science').innerText = data.science;
      document.getElementById('kpi-maths').innerText = data.maths;
      document.getElementById('kpi-english').innerText = data.english;

      document.getElementById('side-score').innerHTML = data.score + ' <span style="font-size: 16px; color: var(--green);">' + data.scorePct + '</span>';
      document.getElementById('side-eval').innerText = data.eval;
      document.getElementById('side-strategy-title').innerText = data.strategyTitle;
      document.getElementById('side-strategy-desc').innerText = data.strategyDesc;

      // Update Animated Chart.js Trajectory
      if (trajectoryChart) {
        trajectoryChart.data.datasets[0].data = data.series.science;
        trajectoryChart.data.datasets[1].data = data.series.maths;
        trajectoryChart.data.datasets[2].data = data.series.english;
        trajectoryChart.update();
      }

      // Update Animated Chart.js Radar
      if (cognitiveRadarChart) {
        cognitiveRadarChart.data.datasets[0].data = data.radar;
        cognitiveRadarChart.update();
      }

      // Update Animated Chart.js Gauge
      if (masteryGaugeChart) {
        masteryGaugeChart.data.datasets[0].data = [data.gaugeVal, 100 - data.gaugeVal];
        masteryGaugeChart.update();
        document.getElementById('gauge-val').innerText = data.gaugeVal + '%';
      }

      // Misconceptions
      const misContainer = document.getElementById('misconception-list');
      if (misContainer) {
        misContainer.innerHTML = data.misconceptions.map(m => \`
          <div class="misconception-item \${m.priority === 'yellow' ? 'yellow' : ''}">
            <div class="misconception-title">
              <span><code>\${m.code}</code></span>
              <span class="badge badge-\${m.priority}">\${m.priority === 'orange' ? 'Priority' : 'Progressing'}</span>
            </div>
            <div class="misconception-desc">\${m.desc}</div>
          </div>
        \`).join('');
      }

      if (window.lucide) lucide.createIcons();
    }

    // Meta Astryx Dynamic Light / Dark Theme Controller
    function applyTheme(theme) {
      const isLight = theme === 'light';
      if (isLight) {
        document.body.classList.add('theme-light');
      } else {
        document.body.classList.remove('theme-light');
      }
      localStorage.setItem('aim_theme', theme);

      const icon = document.getElementById('theme-icon');
      const label = document.getElementById('theme-label');
      if (icon && label) {
        icon.setAttribute('data-lucide', isLight ? 'moon' : 'sun');
        label.innerText = isLight ? 'Dark Mode' : 'Light Mode';
        if (window.lucide) lucide.createIcons();
      }

      updateChartThemes(isLight);
    }

    function toggleTheme() {
      const isCurrentlyLight = document.body.classList.contains('theme-light');
      applyTheme(isCurrentlyLight ? 'dark' : 'light');
    }

    function updateChartThemes(isLight) {
      const gridColor = isLight ? '#e2e8f0' : '#1f2937';
      const tickColor = isLight ? '#64748b' : '#9ca3af';
      const tooltipBg = isLight ? '#ffffff' : '#111827';
      const tooltipTitle = isLight ? '#0f172a' : '#f3f4f6';
      const tooltipBody = isLight ? '#64748b' : '#9ca3af';
      const tooltipBorder = isLight ? '#cbd5e1' : '#374151';

      if (trajectoryChart && trajectoryChart.options && trajectoryChart.options.scales) {
        if (trajectoryChart.options.scales.x) {
          trajectoryChart.options.scales.x.grid.color = gridColor;
          trajectoryChart.options.scales.x.ticks.color = tickColor;
        }
        if (trajectoryChart.options.scales.y) {
          trajectoryChart.options.scales.y.grid.color = gridColor;
          trajectoryChart.options.scales.y.ticks.color = tickColor;
        }
        if (trajectoryChart.options.plugins && trajectoryChart.options.plugins.tooltip) {
          trajectoryChart.options.plugins.tooltip.backgroundColor = tooltipBg;
          trajectoryChart.options.plugins.tooltip.titleColor = tooltipTitle;
          trajectoryChart.options.plugins.tooltip.bodyColor = tooltipBody;
          trajectoryChart.options.plugins.tooltip.borderColor = tooltipBorder;
        }
        trajectoryChart.update();
      }

      if (cognitiveRadarChart && cognitiveRadarChart.options && cognitiveRadarChart.options.scales && cognitiveRadarChart.options.scales.r) {
        cognitiveRadarChart.options.scales.r.grid.color = gridColor;
        cognitiveRadarChart.options.scales.r.angleLines.color = gridColor;
        cognitiveRadarChart.options.scales.r.pointLabels.color = tickColor;
        cognitiveRadarChart.update();
      }

      if (masteryGaugeChart && masteryGaugeChart.data && masteryGaugeChart.data.datasets && masteryGaugeChart.data.datasets[0]) {
        masteryGaugeChart.data.datasets[0].backgroundColor[1] = isLight ? '#e2e8f0' : '#1e293b';
        masteryGaugeChart.update();
      }
    }

    // Initialize on window load
    window.addEventListener('DOMContentLoaded', () => {
      initCharts();
      setStudent('lara');
      const savedTheme = localStorage.getItem('aim_theme') || 'dark';
      applyTheme(savedTheme);
      if (window.lucide) lucide.createIcons();
    });

    // Intake Simulator
    let simStrikeCount = 0;
    let simDupCount = 0;

    function simulateNewUpload() {
      const log = document.getElementById('sim-log');
      log.style.display = 'block';
      log.innerHTML = '🟢 [Intake Gate] Unique test file received. Fingerprint registered. Enqueued to QStash (cdg1/eu-west-3) for asynchronous vision extraction. (Tokens spent: Standard)';
    }

    function simulateDuplicateUpload() {
      simDupCount += 1;
      if (simStrikeCount < 3) simStrikeCount += 1;

      const log = document.getElementById('sim-log');
      log.style.display = 'block';

      const badge = document.getElementById('sim-badge');
      const strikesEl = document.getElementById('sim-strikes');
      strikesEl.innerText = simStrikeCount + '/3';

      if (simStrikeCount >= 3) {
        badge.className = 'badge badge-red';
        badge.innerText = 'Downgraded';
        log.innerHTML = '🚫 [Intake Intercepted] REPEATED UPLOAD DETECTED (' + simDupCount + ' duplicates). STRIKE 3 APPLIED. Quota downgraded. Zero LLM tokens wasted. Message sent to parent.';
      } else {
        badge.className = 'badge badge-yellow';
        badge.innerText = 'Warned';
        log.innerHTML = '⚠️ [Intake Intercepted] REPEATED UPLOAD DETECTED. Strike ' + simStrikeCount + ' of 3 recorded. Saved 3,200 vision tokens. Educational warning dispatched to parent.';
      }
    }

    function resetSimulatedStrikes() {
      simStrikeCount = 0;
      simDupCount = 0;
      document.getElementById('sim-strikes').innerText = '0/3';
      const badge = document.getElementById('sim-badge');
      badge.className = 'badge badge-green';
      badge.innerText = 'Active';
      const log = document.getElementById('sim-log');
      log.innerHTML = '🟢 Guardian strikes reset to 0/3. Normal priority restored.';
    }

    // Wave 18: Progressive Web App (PWA) Offline Synchronization Registration
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(function(reg) {
          console.log('[AIM-PWA] ServiceWorker registered with scope:', reg.scope);
        }).catch(function(err) {
          console.warn('[AIM-PWA] ServiceWorker registration warning:', err);
        });
      });
    }
  </script>
</body>
</html>`;
}
