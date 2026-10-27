export function renderBlankTemplatesTab(): string {
  return `  <!-- TAB 5: Master Blank Templates & Dry-Run Engine -->
  <div id="tab-blank-templates" class="tab-pane">
    <!-- Architectural Solution Callout Banner -->
    <div class="card solution-banner" style="margin-bottom: 24px;">
      <div style="display: flex; gap: 18px; align-items: flex-start; flex-wrap: wrap;">
        <div style="font-size: 32px; line-height: 1;">💡</div>
        <div style="flex: 1; min-width: 280px;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
            <h3 style="color: var(--astryx-text-contrast); font-size: 16px;">The Blank Template Dilemma: Vector Re-Synthesis vs. Naive Inpainting</h3>
            <span class="badge badge-green">Pristine 300-DPI Engine</span>
          </div>
          <p style="font-size: 13px; color: var(--muted); margin-top: 6px; line-height: 1.6;">
            <strong>The Problem with Bleaching/Erasing Scans:</strong> Using computer vision to erase student handwriting and teacher red ink from photocopied submissions leaves behind severe visual artifacts: blurred typography, distorted fractions, phantom eraser smears, and degraded contrast that disorient students with ADHD and dyslexia.
          </p>
          <p style="font-size: 13px; color: var(--astryx-text-contrast); margin-top: 6px; line-height: 1.6;">
            <strong>The Authoritative Hexagonal Solution:</strong> Instead of cleaning dirty pixels, AIM anchors to the <code>CanonicalAssessmentMaster</code> schema extracted during Stage 1 vision intake. We re-typeset questions, mathematical formulas, and rubrics directly from structured AST into <strong>pristine vector PDF/HTML worksheets</strong> using our Warm Browser Pool (Approach C). Zero artifacts, razor-sharp vector text, ready for student dry-runs and custom curriculum reproduction.
          </p>
        </div>
      </div>
    </div>

    <!-- Template Repository Metrics -->
    <div class="grid-metrics">
      <div class="metric-card m-cyan">
        <div class="title">Canonical Masters (🏛️)</div>
        <div class="value">5</div>
        <div class="desc">Deduplicated curriculum milestone templates</div>
      </div>
      <div class="metric-card m-green">
        <div class="title">Vector Generation (⚡)</div>
        <div class="value">89ms</div>
        <div class="desc">Warm Browser Pool clean sheet compile time</div>
      </div>
      <div class="metric-card m-yellow">
        <div class="title">Question Schema Bank (📝)</div>
        <div class="value">49</div>
        <div class="desc">Structured questions ready for dry-runs</div>
      </div>
      <div class="metric-card m-purple">
        <div class="title">Curriculum Assets (📦)</div>
        <div class="value">100%</div>
        <div class="desc">Exportable as reusable British/MOE material</div>
      </div>
    </div>

    <!-- Master Blank Templates Catalog Grid -->
    <h3 style="margin-bottom: 14px; color: var(--astryx-text-contrast); display: flex; align-items: center; gap: 8px;">
      <svg class="w-5 h-5 text-cyan-400 inline" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
      Canonical Master Blank Template Catalog
    </h3>

    <div class="templates-grid">
      <!-- Template 1: Science Week 8 -->
      <div class="template-card">
        <div class="template-badge-row">
          <span class="badge badge-cyan">Science</span>
          <span class="badge badge-purple">Year 4 • Week 8</span>
          <span class="badge badge-green">8 Questions (20 Marks)</span>
        </div>
        <h4 class="template-title">Y4 Science: Sound, Pitch & Auditory Vibrations</h4>
        <div class="template-meta-list">
          <div>🏫 School: <strong>Asten College</strong> • Curriculum: <strong>British National</strong></div>
          <div>🎯 Concepts: <code>Y4.SCI.SND.VIBRATIONS</code>, <code>Y4.SCI.SND.MEDIUM</code>, <code>Y4.SCI.SND.PITCH</code></div>
          <div>📐 Pages: <strong>4 Pages</strong> • Time Allowed: <strong>25 Mins</strong></div>
        </div>

        <div class="template-actions">
          <button class="btn btn-sm" onclick="previewCleanTemplate('sci-w8')">
            👁️ Preview Vector Sheet
          </button>
          <button class="btn btn-outline btn-sm" onclick="downloadVectorPdf('sci-w8')">
            📥 Download Blank PDF
          </button>
          <button class="btn btn-outline btn-sm" onclick="launchDryRun('sci-w8')">
            🧪 Start Dry-Run
          </button>
        </div>
      </div>

      <!-- Template 2: Maths Week 8 -->
      <div class="template-card">
        <div class="template-badge-row">
          <span class="badge badge-yellow">Maths</span>
          <span class="badge badge-purple">Year 4 • Week 8</span>
          <span class="badge badge-green">10 Questions (20 Marks)</span>
        </div>
        <h4 class="template-title">Y4 Maths: Decimals & Place Value Alignment</h4>
        <div class="template-meta-list">
          <div>🏫 School: <strong>Asten College</strong> • Curriculum: <strong>British National</strong></div>
          <div>🎯 Concepts: <code>Y4.MATH.NPV.EMPTY_COLUMNS</code>, <code>Y4.MATH.NPV.DECIMALS</code></div>
          <div>📐 Pages: <strong>5 Pages</strong> • Time Allowed: <strong>30 Mins</strong></div>
        </div>

        <div class="template-actions">
          <button class="btn btn-sm" onclick="previewCleanTemplate('math-w8')">
            👁️ Preview Vector Sheet
          </button>
          <button class="btn btn-outline btn-sm" onclick="downloadVectorPdf('math-w8')">
            📥 Download Blank PDF
          </button>
          <button class="btn btn-outline btn-sm" onclick="launchDryRun('math-w8')">
            🧪 Start Dry-Run
          </button>
        </div>
      </div>

      <!-- Template 3: English Week 7 -->
      <div class="template-card">
        <div class="template-badge-row">
          <span class="badge badge-purple">English</span>
          <span class="badge badge-purple">Year 4 • Week 7</span>
          <span class="badge badge-green">12 Questions (24 Marks)</span>
        </div>
        <h4 class="template-title">Y4 English: Suffixes, Prefixes & Sentence Syntax</h4>
        <div class="template-meta-list">
          <div>🏫 School: <strong>Asten College</strong> • Curriculum: <strong>British National</strong></div>
          <div>🎯 Concepts: <code>Y4.ENG.GRM.SUFFIXES</code>, <code>Y4.ENG.GRM.PREFIXES</code></div>
          <div>📐 Pages: <strong>4 Pages</strong> • Time Allowed: <strong>25 Mins</strong></div>
        </div>

        <div class="template-actions">
          <button class="btn btn-sm" onclick="previewCleanTemplate('eng-w7')">
            👁️ Preview Vector Sheet
          </button>
          <button class="btn btn-outline btn-sm" onclick="downloadVectorPdf('eng-w7')">
            📥 Download Blank PDF
          </button>
          <button class="btn btn-outline btn-sm" onclick="launchDryRun('eng-w7')">
            🧪 Start Dry-Run
          </button>
        </div>
      </div>

      <!-- Template 4: Science Week 7 -->
      <div class="template-card">
        <div class="template-badge-row">
          <span class="badge badge-cyan">Science</span>
          <span class="badge badge-purple">Year 4 • Week 7</span>
          <span class="badge badge-green">9 Questions (20 Marks)</span>
        </div>
        <h4 class="template-title">Y4 Science: Electrical Circuits & Conductors</h4>
        <div class="template-meta-list">
          <div>🏫 School: <strong>Asten College</strong> • Curriculum: <strong>British National</strong></div>
          <div>🎯 Concepts: <code>Y4.SCI.ELEC.CIRCUITS</code>, <code>Y4.SCI.ELEC.CONDUCTORS</code></div>
          <div>📐 Pages: <strong>4 Pages</strong> • Time Allowed: <strong>25 Mins</strong></div>
        </div>

        <div class="template-actions">
          <button class="btn btn-sm" onclick="previewCleanTemplate('sci-w7')">
            👁️ Preview Vector Sheet
          </button>
          <button class="btn btn-outline btn-sm" onclick="downloadVectorPdf('sci-w7')">
            📥 Download Blank PDF
          </button>
          <button class="btn btn-outline btn-sm" onclick="launchDryRun('sci-w7')">
            🧪 Start Dry-Run
          </button>
        </div>
      </div>

      <!-- Template 5: Maths Week 7 -->
      <div class="template-card">
        <div class="template-badge-row">
          <span class="badge badge-yellow">Maths</span>
          <span class="badge badge-purple">Year 4 • Week 7</span>
          <span class="badge badge-green">10 Questions (20 Marks)</span>
        </div>
        <h4 class="template-title">Y4 Maths: Equivalent Fractions & Number Lines</h4>
        <div class="template-meta-list">
          <div>🏫 School: <strong>Asten College</strong> • Curriculum: <strong>British National</strong></div>
          <div>🎯 Concepts: <code>Y4.MATH.FRAC.EQUIV</code>, <code>Y4.MATH.FRAC.DEC_CONV</code></div>
          <div>📐 Pages: <strong>5 Pages</strong> • Time Allowed: <strong>30 Mins</strong></div>
        </div>

        <div class="template-actions">
          <button class="btn btn-sm" onclick="previewCleanTemplate('math-w7')">
            👁️ Preview Vector Sheet
          </button>
          <button class="btn btn-outline btn-sm" onclick="downloadVectorPdf('math-w7')">
            📥 Download Blank PDF
          </button>
          <button class="btn btn-outline btn-sm" onclick="launchDryRun('math-w7')">
            🧪 Start Dry-Run
          </button>
        </div>
      </div>
    </div>

    <!-- Live Pristine Vector Sheet Preview Drawer / Dry Run Canvas -->
    <div class="card" style="margin-top: 24px;">
      <div class="card-header">
        <div>
          <h3 id="clean-preview-title">Pristine Blank Practice Sheet (Vector Re-Synthesis)</h3>
          <div style="font-size: 12px; color: var(--muted);" id="clean-preview-sub">Generated from Canonical Master AST • 100% Vector Fonts • 0 Ink Artifacts</div>
        </div>
        <div style="display: flex; gap: 8px;">
          <button class="btn btn-outline" style="width: auto; font-size: 12px; margin: 0;" onclick="window.print()">
            🖨️ Print Sheet
          </button>
          <button class="btn" style="width: auto; font-size: 12px; margin: 0;" onclick="alert('Pristine Vector Blank PDF ready for download.')">
            📥 Download PDF
          </button>
        </div>
      </div>

      <!-- Realistic Clean Worksheet Simulation -->
      <div class="clean-worksheet-paper">
        <div class="clean-school-header">
          <div class="school-brand">
            <h2>ASTEN COLLEGE</h2>
            <div class="school-dept">Department of Primary Science • Year 4 British Curriculum</div>
          </div>
          <div class="worksheet-title-block">
            <h3>SOUND & ACOUSTIC VIBRATIONS</h3>
            <div>Formative Milestone Practice Sheet • Term 1</div>
          </div>
        </div>

        <div class="clean-student-box">
          <div class="student-field">Student Name: ___________________________</div>
          <div class="student-field">Date: ________________</div>
          <div class="student-field">Class: 4B</div>
          <div class="student-field">Time Allowed: 25 mins</div>
          <div class="student-score-box">Marks: &nbsp;&nbsp;&nbsp;&nbsp; / 20</div>
        </div>

        <div class="clean-instructions">
          <strong>Instructions to Candidates:</strong> Answer all questions in the spaces provided using a blue or black pen or pencil. Read each question carefully before answering. Calculators are not permitted.
        </div>

        <!-- Clean Question 1 -->
        <div class="clean-q-card">
          <div class="clean-q-header">
            <span class="q-number">Question 1</span>
            <span class="q-marks">[2 Marks]</span>
          </div>
          <div class="clean-q-body">
            An acoustic guitar player plucks a low E string. Explain clearly what physical movement the string makes to create sound, and how this movement travels to our ears.
          </div>
          <div class="clean-ruled-lines">
            <div class="ruled-line"></div>
            <div class="ruled-line"></div>
            <div class="ruled-line"></div>
          </div>
        </div>

        <!-- Clean Question 2 -->
        <div class="clean-q-card">
          <div class="clean-q-header">
            <span class="q-number">Question 2</span>
            <span class="q-marks">[2 Marks]</span>
          </div>
          <div class="clean-q-body">
            Two students test sound travel: one speaks through the air, and the other listens underwater. Compare the speed of sound through water compared to air, and give a reason based on particles.
          </div>
          <div class="clean-ruled-lines">
            <div class="ruled-line"></div>
            <div class="ruled-line"></div>
            <div class="ruled-line"></div>
          </div>
        </div>

        <!-- Clean Question 3 -->
        <div class="clean-q-card">
          <div class="clean-q-header">
            <span class="q-number">Question 3</span>
            <span class="q-marks">[3 Marks]</span>
          </div>
          <div class="clean-q-body">
            Complete the table below by matching the action to whether it changes the <strong>PITCH</strong> or the <strong>VOLUME</strong> of the sound produced.
          </div>
          <table class="clean-preview-table">
            <thead>
              <tr>
                <th>Action Performed</th>
                <th>Pitch or Volume?</th>
                <th>Reason / Particle Behavior</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Tightening the tuning peg on a violin string</td>
                <td><div class="fill-box"></div></td>
                <td><div class="fill-box"></div></td>
              </tr>
              <tr>
                <td>Hitting a drum skin with greater force</td>
                <td><div class="fill-box"></div></td>
                <td><div class="fill-box"></div></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style="text-align: center; margin-top: 20px; font-size: 11px; color: var(--muted); border-top: 1px solid var(--card-border); padding-top: 10px;">
          Page 1 of 4 • Formative Milestone • Generated by HEX-AIM Vector Re-Synthesis Engine
        </div>
      </div>
    </div>
  </div>`;
}
