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
<!-- Meta Astryx & Tailwind CSS Centralized Bridge -->
<script src="https://cdn.tailwindcss.com"></script>
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
        📍 Primary: cdg1 (Paris) • Sec: fra1 (Frankfurt)
      </div>
      <div class="badge-tag">
        🏫 Asten College • Year 4 British Primary
      </div>
    </div>
  </header>

  <!-- Navigation Tabs -->
  <div class="nav-tabs">
    <button class="nav-tab active" onclick="switchTab('tab-student-view')">
      📈 Student Progress & Mastery
    </button>
    <button class="nav-tab" onclick="switchTab('tab-gap-ledger')">
      🧠 Cognitive Gap Ledger
    </button>
    <button class="nav-tab" onclick="switchTab('tab-infra-gate')">
      🛡️ Ingestion Gate & Infrastructure
    </button>
  </div>

  ${renderStudentProgressTab()}
  ${renderGapLedgerTab()}
  ${renderInfraGateTab()}

  <script>
    // Tab Switching
    function switchTab(tabId) {
      document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));

      event.currentTarget.classList.add('active');
      const pane = document.getElementById(tabId);
      if (pane) pane.classList.add('active');
    }

    // Student Data Mock for Dynamic View
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
        radar: { recall: 98, concept: 91, steps: 78, speed: 72 },
        misconceptions: [
          { code: "Y4.MATH.NPV.EMPTY_COLUMNS", class: "ERR_PHANTOM_ZERO", desc: "Omits zero in unmentioned place-value rooms (writes 24,16 for 24,106)", priority: "orange" },
          { code: "Y4.MATH.NPV.NEGATIVE_NUMBERS", class: "ERR_NEGATIVE_MAGNITUDE_INVERSION", desc: "Orders -4°C as warmer than -1°C", priority: "yellow" },
          { code: "Y4.MATH.NPV.WRITING_NUMBERS", class: "ERR_TRANSPOSITION", desc: "Transposing digits under time rush (writes 03 for thirty)", priority: "yellow" }
        ],
        curves: {
          science: "M 60,110 L 135,100 L 210,85 L 285,75 L 360,60 L 435,45 L 510,35 L 560,25",
          maths:   "M 60,130 L 135,125 L 210,115 L 285,105 L 360,95 L 435,90 L 510,88 L 560,82",
          english: "M 60,115 L 135,110 L 210,100 L 285,90 L 360,80 L 435,70 L 510,65 L 560,55"
        }
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
        radar: { recall: 99, concept: 95, steps: 86, speed: 84 },
        misconceptions: [
          { code: "Y4.MATH.NPV.5DIGIT_ORDERING", class: "ERR_SHARED_PREFIX_ORDERING", desc: "Sequencing 5-digit numbers that share leading prefix digits", priority: "orange" },
          { code: "Y4.MATH.NPV.NUMBER_LINE_SCALES", class: "ERR_INTERVAL_DECODE", desc: "Counting tick marks by 1s instead of decoding jump size (+2, +5, +10)", priority: "yellow" },
          { code: "Y4.MATH.NPV.CROSSING_ZERO", class: "ERR_FENCEPOST_COUNT", desc: "Counting the starting tick mark across zero bridge", priority: "yellow" }
        ],
        curves: {
          science: "M 60,95 L 135,80 L 210,70 L 285,55 L 360,45 L 435,35 L 510,25 L 560,18",
          maths:   "M 60,120 L 135,110 L 210,105 L 285,95 L 360,85 L 435,80 L 510,75 L 560,70",
          english: "M 60,100 L 135,90 L 210,80 L 285,70 L 360,60 L 435,50 L 510,45 L 560,40"
        }
      }
    };

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

      // Radar bars
      document.getElementById('bar-recall').style.width = data.radar.recall + '%';
      document.getElementById('val-recall').innerText = data.radar.recall + '%';
      document.getElementById('bar-concept').style.width = data.radar.concept + '%';
      document.getElementById('val-concept').innerText = data.radar.concept + '%';
      document.getElementById('bar-steps').style.width = data.radar.steps + '%';
      document.getElementById('val-steps').innerText = data.radar.steps + '%';
      document.getElementById('bar-speed').style.width = data.radar.speed + '%';
      document.getElementById('val-speed').innerText = data.radar.speed + '%';

      // Misconceptions
      const misContainer = document.getElementById('misconception-list');
      misContainer.innerHTML = data.misconceptions.map(m => \`
        <div class="misconception-item \${m.priority === 'yellow' ? 'yellow' : ''}">
          <div class="misconception-title">
            <span><code>\${m.code}</code></span>
            <span class="badge badge-\${m.priority}">\${m.priority === 'orange' ? 'Priority' : 'Progressing'}</span>
          </div>
          <div class="misconception-desc">\${m.desc}</div>
        </div>
      \`).join('');

      // Curves in SVG
      const chartPaths = document.getElementById('chart-paths');
      chartPaths.innerHTML = \`
        <path d="\${data.curves.science}" fill="none" stroke="var(--green)" stroke-width="3" stroke-linecap="round" />
        <path d="\${data.curves.maths}" fill="none" stroke="var(--yellow)" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="3 3" />
        <path d="\${data.curves.english}" fill="none" stroke="var(--purple)" stroke-width="2" stroke-linecap="round" />
        <circle cx="560" cy="25" r="4" fill="var(--green)" />
        <circle cx="560" cy="82" r="4" fill="var(--yellow)" />
        <circle cx="560" cy="55" r="4" fill="var(--purple)" />
      \`;
    }

    // Initialize Default View (Lara)
    setStudent('lara');

    // Intake Simulator
    let simStrikeCount = 0;
    let simDupCount = 0;
    let simTokens = 9600;

    function simulateNewUpload() {
      const log = document.getElementById('sim-log');
      log.style.display = 'block';
      log.innerHTML = '🟢 [Intake Gate] Unique test file received. Fingerprint registered. Enqueued to QStash (cdg1/eu-west-3) for asynchronous vision extraction. (Tokens spent: Standard)';
    }

    function simulateDuplicateUpload() {
      simDupCount += 1;
      simTokens += 3200;

      if (simStrikeCount < 3) {
        simStrikeCount += 1;
      }

      const log = document.getElementById('sim-log');
      log.style.display = 'block';

      const badge = document.getElementById('sim-badge');
      const strikesEl = document.getElementById('sim-strikes');
      strikesEl.innerText = simStrikeCount + '/3';

      if (simStrikeCount >= 3) {
        badge.className = 'badge badge-red';
        badge.innerText = 'Downgraded';
        log.innerHTML = '🚫 [Intake Intercepted] REPEATED UPLOAD DETECTED (' + simDupCount + ' duplicates). STRIKE 3 APPLIED. Quota downgraded to delayed batch. Zero LLM tokens wasted. Message sent to parent.';
      } else {
        badge.className = 'badge badge-yellow';
        badge.innerText = 'Warned';
        log.innerHTML = '⚠️ [Intake Intercepted] REPEATED UPLOAD DETECTED. Strike ' + simStrikeCount + ' of 3 recorded. Saved 3,200 vision tokens. Educational warning & previous sprint link dispatched to parent.';
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
  </script>
</body>
</html>`;
}
