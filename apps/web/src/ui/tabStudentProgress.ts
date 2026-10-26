export function renderStudentProgressTab(): string {
  return `  <!-- TAB 1: Student Progress & Mastery (2/3 + 1/3 Split) -->
  <div id="tab-student-view" class="tab-pane active">
    <div class="student-pills">
      <button class="pill-btn active" id="pill-lara" onclick="setStudent('lara')">👧 Lara (Year 4)</button>
      <button class="pill-btn" id="pill-maya" onclick="setStudent('maya')">👧 Maya (Year 4)</button>
    </div>

    <div class="tab1-layout">
      <!-- Left 2/3: Progress Charts & Trend Analytics -->
      <div class="tab1-main">
        <div class="card">
          <div class="card-header">
            <div>
              <h2 id="student-name-header">Lara's Academic Trajectory & Mastery Progression</h2>
              <div style="font-size: 12px; color: var(--muted);" id="student-meta-sub">Asten College • Year 4 British Track • Term 1 Diagnostic Trajectory</div>
            </div>
            <span class="badge badge-green" id="student-overall-status">Mastery Stable (92% Avg)</span>
          </div>

          <!-- Mini KPIs -->
          <div class="mini-kpi-row">
            <div class="mini-kpi">
              <div class="kpi-label">Term Average</div>
              <div class="kpi-val" id="kpi-term-avg" style="color: var(--cyan);">92%</div>
            </div>
            <div class="mini-kpi">
              <div class="kpi-label">Science (Midterm)</div>
              <div class="kpi-val" id="kpi-science" style="color: var(--green);">94%</div>
            </div>
            <div class="mini-kpi">
              <div class="kpi-label">Maths (NPV)</div>
              <div class="kpi-val" id="kpi-maths" style="color: var(--yellow);">82%</div>
            </div>
            <div class="mini-kpi">
              <div class="kpi-label">English (Spelling)</div>
              <div class="kpi-val" id="kpi-english" style="color: var(--purple);">88%</div>
            </div>
          </div>

          <!-- Interactive SVG Trajectory Chart -->
          <div class="chart-box">
            <div class="chart-title">
              <span>Weekly Assessment Performance (Weeks 1 - 8)</span>
              <div class="chart-legend">
                <div class="legend-item"><div class="dot" style="background: var(--green);"></div> Science</div>
                <div class="legend-item"><div class="dot" style="background: var(--yellow);"></div> Maths</div>
                <div class="legend-item"><div class="dot" style="background: var(--cyan);"></div> English</div>
                <div class="legend-item"><div class="dot" style="background: #475569;"></div> 80% Mastery Goal</div>
              </div>
            </div>
            <svg class="trend-svg" viewBox="0 0 600 160" id="trajectory-svg">
              <!-- Grid Lines -->
              <line x1="40" y1="20" x2="580" y2="20" stroke="#1f2937" stroke-width="1" stroke-dasharray="2" />
              <line x1="40" y1="55" x2="580" y2="55" stroke="#1f2937" stroke-width="1" stroke-dasharray="2" />
              <line x1="40" y1="90" x2="580" y2="90" stroke="#334155" stroke-width="1" stroke-dasharray="4" />
              <line x1="40" y1="125" x2="580" y2="125" stroke="#1f2937" stroke-width="1" stroke-dasharray="2" />

              <!-- Y-Axis Labels -->
              <text x="10" y="24" fill="#64748b" font-size="10">100%</text>
              <text x="15" y="59" fill="#64748b" font-size="10">90%</text>
              <text x="15" y="94" fill="#06b6d4" font-size="10" font-weight="bold">80%</text>
              <text x="15" y="129" fill="#64748b" font-size="10">70%</text>

              <!-- X-Axis Labels -->
              <text x="60" y="150" fill="#64748b" font-size="10">W1</text>
              <text x="135" y="150" fill="#64748b" font-size="10">W2</text>
              <text x="210" y="150" fill="#64748b" font-size="10">W3</text>
              <text x="285" y="150" fill="#64748b" font-size="10">W4</text>
              <text x="360" y="150" fill="#64748b" font-size="10">W5</text>
              <text x="435" y="150" fill="#64748b" font-size="10">W6</text>
              <text x="510" y="150" fill="#64748b" font-size="10">W7</text>
              <text x="560" y="150" fill="#64748b" font-size="10" font-weight="bold">W8 (Mid)</text>

              <!-- Dynamic Curves will be rendered here by script -->
              <g id="chart-paths"></g>
            </svg>
          </div>

          <!-- Cognitive Dimension Radar/Bars -->
          <div style="margin-top: 10px;">
            <div style="font-size: 13px; font-weight: 700; color: #fff; margin-bottom: 12px;">Cognitive Domain Mastery Breakdown</div>
            <div class="dim-row">
              <span style="color: #cbd5e1;">Factual Recall & Vocabulary</span>
              <div class="bar-container"><div class="bar-fill" id="bar-recall" style="width: 98%; background: var(--green);"></div></div>
              <span style="font-weight: 700; color: var(--green);" id="val-recall">98%</span>
            </div>
            <div class="dim-row">
              <span style="color: #cbd5e1;">Conceptual Understanding</span>
              <div class="bar-container"><div class="bar-fill" id="bar-concept" style="width: 91%; background: var(--cyan);"></div></div>
              <span style="font-weight: 700; color: var(--cyan);" id="val-concept">91%</span>
            </div>
            <div class="dim-row">
              <span style="color: #cbd5e1;">Multi-Step Problem Execution</span>
              <div class="bar-container"><div class="bar-fill" id="bar-steps" style="width: 78%; background: var(--yellow);"></div></div>
              <span style="font-weight: 700; color: var(--yellow);" id="val-steps">78%</span>
            </div>
            <div class="dim-row">
              <span style="color: #cbd5e1;">Accuracy Under Timed Pressure</span>
              <div class="bar-container"><div class="bar-fill" id="bar-speed" style="width: 72%; background: var(--orange);"></div></div>
              <span style="font-weight: 700; color: var(--orange);" id="val-speed">72%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right 1/3: Materials, Scorecard & Action Trigger -->
      <div class="tab1-sidebar">
        <!-- Recent Worksheet Scorecard -->
        <div class="card">
          <div class="card-header">
            <h2>📝 Latest Ingested Scorecard</h2>
            <span class="badge badge-green">Passed</span>
          </div>
          <div class="scorecard-banner">
            <div class="top">
              <span>SCIENCE MIDTERM (UNITS 1.1–1.5)</span>
              <span>ASTEN Y4</span>
            </div>
            <div class="big-score" id="side-score">19 / 20 <span style="font-size: 16px; color: var(--green);">(95%)</span></div>
            <div style="font-size: 12px; color: #cbd5e1;" id="side-eval">
              Demonstrated complete mastery of skeletons, muscles, and medicines. 1 minor slip in negative temperature scale.
            </div>
          </div>

          <!-- Identified Misconceptions -->
          <div style="font-size: 12px; font-weight: 700; color: #fff; margin-bottom: 8px;">Active Misconceptions Detected:</div>
          <div id="misconception-list">
            <!-- Populated via script -->
          </div>

          <!-- Neuro-Profile Scaffold -->
          <div style="background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 12px; margin: 14px 0;">
            <div style="font-size: 11px; font-weight: 700; color: var(--muted); text-transform: uppercase;">Study Strategy Scaffold</div>
            <div style="font-size: 12px; color: #fff; font-weight: 600; margin-top: 4px;" id="side-strategy-title">Target: 8 Min Sprint • Visual Chunking</div>
            <div style="font-size: 11px; color: var(--muted); margin-top: 2px;" id="side-strategy-desc">ADHD & Dyslexia traits active. Visual room partitions protect place-value working memory under speed.</div>
          </div>

          <!-- Action Buttons -->
          <a href="/sprint/preview" target="_blank" class="btn">🚀 Generate Follow-up Sprint Now</a>
          <a href="/guide/preview" target="_blank" class="btn btn-outline">🧭 Open Parent Socratic Guide</a>
          <a href="https://t.me/aim_pal_bot" target="_blank" class="btn btn-outline" style="border-color: #0284c7; color: #38bdf8;">📱 Send Snapshot to Telegram Bot</a>
        </div>
      </div>
    </div>
  </div>`;
}
