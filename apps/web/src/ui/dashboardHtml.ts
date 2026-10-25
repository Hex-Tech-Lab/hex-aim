export function renderDashboardHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>HEX-AIM • Adaptive Individualized Mastery Console</title>
<style>
  :root {
    --bg: #090d16;
    --card: #111827;
    --card-border: #1f2937;
    --cyan: #06b6d4;
    --accent: #3b82f6;
    --text: #f3f4f6;
    --muted: #9ca3af;
    --green: #10b981;
    --yellow: #f59e0b;
    --orange: #f97316;
    --purple: #a855f7;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: var(--bg);
    color: var(--text);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    line-height: 1.5;
    padding: 20px;
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--card-border);
    padding-bottom: 16px;
    margin-bottom: 24px;
  }

  .logo-group h1 {
    font-size: 20px;
    font-weight: 800;
    color: #fff;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .logo-group h1 span { color: var(--cyan); }
  .logo-group .sub { font-size: 13px; color: var(--muted); }

  .school-tag {
    background: #1e293b;
    border: 1px solid #334155;
    padding: 6px 14px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
  }

  /* Metric Grid */
  .grid-metrics {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    margin-bottom: 24px;
  }

  .metric-card {
    background: var(--card);
    border: 1px solid var(--card-border);
    border-radius: 12px;
    padding: 16px;
    position: relative;
    overflow: hidden;
  }

  .metric-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; height: 3px;
  }

  .m-green::before { background: var(--green); }
  .m-yellow::before { background: var(--yellow); }
  .m-orange::before { background: var(--orange); }
  .m-purple::before { background: var(--purple); }

  .metric-card .title { font-size: 12px; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: 0.5px; }
  .metric-card .value { font-size: 28px; font-weight: 800; color: #fff; margin: 4px 0; }
  .metric-card .desc { font-size: 12px; color: var(--muted); }

  /* Main Workspace */
  .workspace {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 20px;
  }

  /* Student Roster */
  .roster {
    background: var(--card);
    border: 1px solid var(--card-border);
    border-radius: 12px;
    padding: 16px;
  }

  .roster h2 { font-size: 15px; font-weight: 700; margin-bottom: 12px; color: #fff; }
  .student-list { list-style: none; display: flex; flex-direction: column; gap: 8px; }

  .student-item {
    background: #1e293b;
    border: 1px solid #334155;
    padding: 10px 12px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .student-item:hover, .student-item.active {
    border-color: var(--cyan);
    background: #0f172a;
    box-shadow: 0 0 10px rgba(6, 182, 212, 0.15);
  }

  .student-item .name { font-weight: 700; font-size: 14px; color: #fff; }
  .student-item .meta { font-size: 11px; color: var(--muted); margin-top: 2px; }

  /* Detail Panel */
  .detail-panel {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .card {
    background: var(--card);
    border: 1px solid var(--card-border);
    border-radius: 12px;
    padding: 20px;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    border-bottom: 1px solid var(--card-border);
    padding-bottom: 12px;
  }

  .card-header h2 { font-size: 16px; font-weight: 700; color: #fff; }

  /* Gap Ledger Table */
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th { text-align: left; padding: 10px; color: var(--muted); font-size: 11px; text-transform: uppercase; border-bottom: 1px solid var(--card-border); }
  td { padding: 12px 10px; border-bottom: 1px solid #1f2937; }

  .badge {
    display: inline-block;
    padding: 3px 8px;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 700;
  }

  .badge-orange { background: rgba(249, 115, 22, 0.2); color: var(--orange); border: 1px solid rgba(249, 115, 22, 0.3); }
  .badge-yellow { background: rgba(245, 158, 11, 0.2); color: var(--yellow); border: 1px solid rgba(245, 158, 11, 0.3); }
  .badge-green { background: rgba(16, 185, 129, 0.2); color: var(--green); border: 1px solid rgba(16, 185, 129, 0.3); }
  .badge-purple { background: rgba(168, 85, 247, 0.2); color: var(--purple); border: 1px solid rgba(168, 85, 247, 0.3); }

  /* Actions */
  .btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: var(--cyan);
    color: #000;
    font-weight: 700;
    font-size: 13px;
    padding: 8px 16px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    text-decoration: none;
    transition: opacity 0.2s;
  }

  .btn:hover { opacity: 0.9; }
  .btn-outline { background: transparent; color: var(--text); border: 1px solid var(--card-border); }
  .btn-outline:hover { background: #1e293b; }

  /* Sandbox */
  .sandbox-dropzone {
    border: 2px dashed #374151;
    border-radius: 8px;
    padding: 24px;
    text-align: center;
    cursor: pointer;
    transition: border-color 0.2s;
  }

  .sandbox-dropzone:hover { border-color: var(--cyan); }
</style>
</head>
<body>

  <header>
    <div class="logo-group">
      <h1>HEX-AIM <span>Mastery Console</span></h1>
      <div class="sub">Adaptive Individualized Mastery • Cognitive Gap Remediation Engine</div>
    </div>
    <div class="school-tag">
      🏫 Asten College • Year 4 British Primary
    </div>
  </header>

  <div class="grid-metrics">
    <div class="metric-card m-orange">
      <div class="title">Active Priority (🟠)</div>
      <div class="value" id="val-orange">2</div>
      <div class="desc">Active cognitive bottlenecks</div>
    </div>
    <div class="metric-card m-yellow">
      <div class="title">Progressing (🟡)</div>
      <div class="value" id="val-yellow">3</div>
      <div class="desc">Stabilizing under rush/pressure</div>
    </div>
    <div class="metric-card m-green">
      <div class="title">Mastered (🟢)</div>
      <div class="value" id="val-green">14</div>
      <div class="desc">Fully resolved curriculum targets</div>
    </div>
    <div class="metric-card m-purple">
      <div class="title">Emerging (🟣)</div>
      <div class="value" id="val-purple">1</div>
      <div class="desc">Newly introduced concepts</div>
    </div>
  </div>

  <div class="workspace">
    <!-- Left: Student List -->
    <div class="roster">
      <h2>Pilot Cohort (Year 4)</h2>
      <ul class="student-list" id="student-list">
        <li class="student-item active" onclick="selectStudent('lara')">
          <div class="name">Lara (Y4)</div>
          <div class="meta">ADHD/Dyslexia traits • 8 min target</div>
        </li>
        <li class="student-item" onclick="selectStudent('maya')">
          <div class="name">Maya (Y4)</div>
          <div class="meta">Verbal execution • 10 min target</div>
        </li>
        <li class="student-item" onclick="selectStudent('student_003')">
          <div class="name">Omar (Y4)</div>
          <div class="meta">Standard working memory • 10 min target</div>
        </li>
      </ul>
    </div>

    <!-- Right: Student Details & Gaps -->
    <div class="detail-panel">
      <div class="card">
        <div class="card-header">
          <div>
            <h2 id="active-student-title">Lara's Cognitive Gap Ledger</h2>
            <div style="font-size: 12px; color: var(--muted);" id="active-student-meta">Target: 8 min sprint • Twin study routine active</div>
          </div>
          <div style="display: flex; gap: 8px;">
            <a href="/sprint/preview" target="_blank" class="btn" id="btn-sprint">📄 Open 4-Page Sprint</a>
            <a href="/guide/preview" target="_blank" class="btn btn-outline" id="btn-guide">🧭 Parent Socratic Guide</a>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Concept Code</th>
              <th>Error Class</th>
              <th>Pedagogical Description</th>
              <th>Recurrence</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody id="gaps-tbody">
            <tr>
              <td><code>Y4.MATH.NPV.EMPTY_COLUMNS</code></td>
              <td><code>ERR_PHANTOM_ZERO</code></td>
              <td>Omits zero in unmentioned place-value rooms (writes 24,16 for 24,106)</td>
              <td>3x</td>
              <td><span class="badge badge-orange">Active Priority</span></td>
            </tr>
            <tr>
              <td><code>Y4.MATH.NPV.NEGATIVE_NUMBERS</code></td>
              <td><code>ERR_NEGATIVE_MAGNITUDE_INVERSION</code></td>
              <td>Orders -4°C as warmer than -1°C</td>
              <td>2x</td>
              <td><span class="badge badge-yellow">Progressing</span></td>
            </tr>
            <tr>
              <td><code>Y4.MATH.NPV.WRITING_NUMBERS</code></td>
              <td><code>ERR_TRANSPOSITION</code></td>
              <td>Transposing digits under time pressure (writes 03 for thirty)</td>
              <td>2x</td>
              <td><span class="badge badge-yellow">Progressing</span></td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Live Intake Sandbox -->
      <div class="card">
        <div class="card-header">
          <h2>⚡ Live Diagnostic Ingest Sandbox</h2>
          <button class="btn btn-outline" onclick="triggerSampleDiagnostic()">Run Sample Assessment Diagnostic</button>
        </div>
        <div class="sandbox-dropzone" onclick="triggerSampleDiagnostic()">
          <div style="font-size: 24px; margin-bottom: 8px;">📸</div>
          <div style="font-weight: 700; color: #fff;">Drop milestone quiz photo here or click to test intake</div>
          <div style="font-size: 12px; color: var(--muted); margin-top: 4px;">Simulates WhatsApp/Telegram webhook intake & QStash asynchronous background processing</div>
        </div>
      </div>
    </div>
  </div>

  <script>
    function selectStudent(id) {
      document.querySelectorAll('.student-item').forEach(el => el.classList.remove('active'));
      event.currentTarget.classList.add('active');

      if (id === 'maya') {
        document.getElementById('active-student-title').innerText = "Maya's Cognitive Gap Ledger";
        document.getElementById('active-student-meta').innerText = "Target: 10 min sprint • Verbal strengths active";
        document.getElementById('gaps-tbody').innerHTML = \`
          <tr>
            <td><code>Y4.MATH.NPV.NUMBER_LINE_SCALES</code></td>
            <td><code>ERR_INTERVAL_DECODE</code></td>
            <td>Counting tick marks by 1s instead of decoding jump size (+2, +5, +10)</td>
            <td>1x</td>
            <td><span class="badge badge-yellow">Progressing</span></td>
          </tr>
          <tr>
            <td><code>Y4.MATH.NPV.CROSSING_ZERO</code></td>
            <td><code>ERR_FENCEPOST_COUNT</code></td>
            <td>Counting the starting tick mark instead of jumps across zero bridge</td>
            <td>1x</td>
            <td><span class="badge badge-yellow">Progressing</span></td>
          </tr>
          <tr>
            <td><code>Y4.MATH.NPV.5DIGIT_ORDERING</code></td>
            <td><code>ERR_SHARED_PREFIX_ORDERING</code></td>
            <td>Difficulty sequencing 5-digit numbers that share leading digits</td>
            <td>1x</td>
            <td><span class="badge badge-orange">Active Priority</span></td>
          </tr>
        \`;
      } else if (id === 'student_003') {
        document.getElementById('active-student-title').innerText = "Omar's Cognitive Gap Ledger";
        document.getElementById('active-student-meta').innerText = "Target: 10 min sprint • Standard working memory";
        document.getElementById('gaps-tbody').innerHTML = \`
          <tr>
            <td><code>Y4.MATH.NPV.ROUNDING</code></td>
            <td><code>ERR_PLACE_VALUE_ALIGNMENT</code></td>
            <td>Rounding to nearest 1,000 using tens digit instead of hundreds</td>
            <td>1x</td>
            <td><span class="badge badge-orange">Active Priority</span></td>
          </tr>
        \`;
      } else {
        document.getElementById('active-student-title').innerText = "Lara's Cognitive Gap Ledger";
        document.getElementById('active-student-meta').innerText = "Target: 8 min sprint • Twin study routine active";
        document.getElementById('gaps-tbody').innerHTML = \`
          <tr>
            <td><code>Y4.MATH.NPV.EMPTY_COLUMNS</code></td>
            <td><code>ERR_PHANTOM_ZERO</code></td>
            <td>Omits zero in unmentioned place-value rooms (writes 24,16 for 24,106)</td>
            <td>3x</td>
            <td><span class="badge badge-orange">Active Priority</span></td>
          </tr>
          <tr>
            <td><code>Y4.MATH.NPV.NEGATIVE_NUMBERS</code></td>
            <td><code>ERR_NEGATIVE_MAGNITUDE_INVERSION</code></td>
            <td>Orders -4°C as warmer than -1°C</td>
            <td>2x</td>
            <td><span class="badge badge-yellow">Progressing</span></td>
          </tr>
        \`;
      }
    }

    async function triggerSampleDiagnostic() {
      alert("Triggering simulated assessment diagnostic intake via API... Sprints and coaching guides are dynamically compiled.");
      window.open('/sprint/preview', '_blank');
    }
  </script>
</body>
</html>`;
}
