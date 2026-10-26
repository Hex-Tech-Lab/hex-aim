export function renderStudentProgressTab(): string {
  return `  <!-- TAB 1: Student Progress & Mastery (2/3 + 1/3 Split) -->
  <div id="tab-student-view" class="tab-pane active">
    <div class="student-pills">
      <button class="pill-btn active" id="pill-lara" onclick="setStudent('lara')">
        <i data-lucide="user" class="inline w-4 h-4 mr-1"></i> 👧 Lara (Year 4)
      </button>
      <button class="pill-btn" id="pill-maya" onclick="setStudent('maya')">
        <i data-lucide="user-check" class="inline w-4 h-4 mr-1"></i> 👧 Maya (Year 4)
      </button>
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
            <span class="badge badge-green pulse-glow" id="student-overall-status">Mastery Stable (92% Avg)</span>
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

          <!-- Interactive Animated Chart.js Trajectory -->
          <div class="chart-box">
            <div class="chart-title">
              <span class="flex items-center gap-2">
                <i data-lucide="trending-up" class="w-4 h-4 text-cyan-400"></i>
                Weekly Assessment Performance (Weeks 1 - 8)
              </span>
              <div class="chart-legend">
                <div class="legend-item"><div class="dot" style="background: var(--green);"></div> Science</div>
                <div class="legend-item"><div class="dot" style="background: var(--yellow);"></div> Maths</div>
                <div class="legend-item"><div class="dot" style="background: var(--purple);"></div> English</div>
                <div class="legend-item"><div class="dot" style="background: #64748b;"></div> 80% Benchmark</div>
              </div>
            </div>
            <div style="position: relative; height: 210px; width: 100%;">
              <canvas id="trajectoryCanvas"></canvas>
            </div>
          </div>

          <!-- Dual Animated Visual Graphics: Cognitive Radar & Confidence Gauge -->
          <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 16px; margin-top: 16px;">
            <!-- Chart.js Cognitive Domain Radar -->
            <div style="background: #0d131f; border: 1px solid var(--card-border); border-radius: 8px; padding: 14px; position: relative;">
              <div style="font-size: 12px; font-weight: 700; color: #fff; margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between;">
                <span class="flex items-center gap-1.5"><i data-lucide="brain" class="w-3.5 h-3.5 text-cyan-400"></i> Cognitive Domain Radar</span>
                <span style="font-size: 10px; color: var(--cyan); font-family: monospace;">ASTEN Y4 RADAR</span>
              </div>
              <div style="position: relative; height: 180px; width: 100%;">
                <canvas id="cognitiveRadarCanvas"></canvas>
              </div>
            </div>

            <!-- Chart.js Mastery Gauge / Doughnut -->
            <div style="background: #0d131f; border: 1px solid var(--card-border); border-radius: 8px; padding: 14px; position: relative;">
              <div style="font-size: 12px; font-weight: 700; color: #fff; margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between;">
                <span class="flex items-center gap-1.5"><i data-lucide="shield-check" class="w-3.5 h-3.5 text-emerald-400"></i> Zero-Alarm Confidence</span>
                <span class="badge badge-green" id="gauge-badge">High</span>
              </div>
              <div style="position: relative; height: 140px; width: 100%; display: flex; align-items: center; justify-content: center;">
                <canvas id="masteryGaugeCanvas"></canvas>
                <div id="gauge-center-text" style="position: absolute; top: 58%; left: 50%; transform: translate(-50%, -50%); text-align: center; pointer-events: none;">
                  <div id="gauge-val" style="font-size: 22px; font-weight: 800; color: #fff; font-family: monospace;">94%</div>
                  <div style="font-size: 9px; color: var(--muted); text-transform: uppercase;">Retention</div>
                </div>
              </div>
              <div style="font-size: 10px; color: var(--muted); text-align: center; margin-top: 4px;" id="gauge-sub">
                Working memory load protected under sprint timer
              </div>
            </div>
          </div>

          <!-- Misconceptions Summary -->
          <div style="margin-top: 16px;">
            <div style="font-size: 12px; font-weight: 700; color: #fff; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
              <i data-lucide="alert-triangle" class="w-4 h-4 text-amber-400"></i> Active Priority Cognitive Errors (Targeted in Sprints)
            </div>
            <div id="misconception-list"></div>
          </div>
        </div>
      </div>

      <!-- Right 1/3: Materials, Scorecard & Action Trigger -->
      <div class="tab1-sidebar">
        <!-- Recent Worksheet Scorecard -->
        <div class="card">
          <div class="card-header">
            <h2 class="flex items-center gap-1.5"><i data-lucide="file-check-2" class="w-4 h-4 text-emerald-400"></i> Latest Intake Scorecard</h2>
            <span class="badge badge-green">Passed</span>
          </div>
          <div class="scorecard-banner">
            <div class="top">
              <span>SCIENCE MIDTERM (UNITS 1.1–1.5)</span>
              <span>ASTEN Y4</span>
            </div>
            <div class="big-score" id="side-score">19 / 20 <span style="font-size: 16px; color: var(--green);">(95%)</span></div>
            <div class="sub-eval" id="side-eval">Science Midterm: Mastered skeletons, muscles, and medicines. Working memory slipped on negative scale.</div>
          </div>

          <!-- Action / Sprint Trigger -->
          <div class="sprint-box">
            <div class="title" id="side-strategy-title">Target: 8 Min Sprint • Visual Chunking</div>
            <div class="desc" id="side-strategy-desc">ADHD & Dyslexia traits active. Visual room partitions protect place-value working memory under speed.</div>
            <button class="btn-sprint" onclick="alert('⚡ Compiling tailored 4-page sprint pack via Warm Browser Pool (Approach C)...')">
              <i data-lucide="zap" class="inline w-4 h-4 mr-1"></i> 🚀 Generate Targeted Practice Pack
            </button>
          </div>
        </div>

        <!-- Socratic Guide Preview Card -->
        <div class="card">
          <div class="card-header">
            <h2 class="flex items-center gap-1.5"><i data-lucide="compass" class="w-4 h-4 text-cyan-400"></i> Parent Coaching Script</h2>
            <span class="badge badge-blue">Socratic</span>
          </div>
          <div style="font-size: 12px; color: var(--muted); margin-bottom: 8px;">
            "Imagine our number lives in an apartment with reserved rooms: Ones, Tens, Hundreds, Thousands. If a room has nothing in it, does it disappear, or do we put a 0 guard in the chair?"
          </div>
          <a href="/guide/preview" target="_blank" style="display: block; text-align: center; background: #1e293b; border: 1px solid #334155; color: var(--cyan); padding: 8px; border-radius: 6px; font-size: 12px; font-weight: 700; text-decoration: none;">
            🧭 Open Socratic Guide Companion (2-Page A4)
          </a>
        </div>
      </div>
    </div>
  </div>`;
}
