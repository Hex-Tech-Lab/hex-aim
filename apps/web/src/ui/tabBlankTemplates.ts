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

    <!-- Master Blank Templates Catalog Header & Filter Bar -->
    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 12px;">
      <h3 style="color: var(--astryx-text-contrast); display: flex; align-items: center; gap: 8px; margin: 0;">
        <svg class="w-5 h-5 text-cyan-400 inline" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
        Canonical Master Blank Template Catalog
      </h3>
      <div style="font-size: 12px; color: var(--muted);">Wave 19: Dynamic Curriculum Dependency Tracing (DAG)</div>
    </div>

    <!-- Wave 19 Dynamic Filter Pills -->
    <div class="template-filters-bar">
      <button class="filter-pill active" id="pill-tpl-all" onclick="filterBlankTemplates('all')">All Worksheets (5)</button>
      <button class="filter-pill" id="pill-tpl-recommended" onclick="filterBlankTemplates('recommended')">🎯 Priority for Lara</button>
      <button class="filter-pill" id="pill-tpl-science" onclick="filterBlankTemplates('science')">Science (2)</button>
      <button class="filter-pill" id="pill-tpl-maths" onclick="filterBlankTemplates('maths')">Maths (2)</button>
      <button class="filter-pill" id="pill-tpl-english" onclick="filterBlankTemplates('english')">English (1)</button>
    </div>

    <div class="templates-grid">
      <!-- Template 1: Science Week 8 (Priority for Lara) -->
      <div class="template-card is-priority" data-tpl-id="sci-w8" data-subject="science" data-rec-lara="true" data-rec-maya="false">
        <div class="priority-banner" id="banner-sci-w8">
          <span style="display: flex; align-items: center; gap: 6px;">
            <span>🎯</span> Recommended Root Blocker Remediation for <strong>Lara</strong>
          </span>
          <span class="badge badge-cyan">Y4 Science • 89ms</span>
        </div>

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

        <!-- Wave 19 Prerequisite Concept Flow Strip -->
        <div class="prereq-flow-strip" id="flow-sci-w8">
          <div class="flow-title">
            <svg class="w-3.5 h-3.5 inline text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v1"></path><path d="M18 8h4a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-4"></path><circle cx="8" cy="12" r="2"></circle></svg>
            Prerequisite Lineage (DAG)
          </div>
          <div class="flow-steps">
            <span class="flow-step-tag mastered" title="Mastered in Y3">✓ Y3: Senses & Ears</span>
            <span class="flow-arrow">➔</span>
            <span class="flow-step-tag mastered" title="Mastered in Y4">✓ Y4: Physical Vibrations</span>
            <span class="flow-arrow">➔</span>
            <span class="flow-step-tag blocker" title="Current Root Blocker">⚠️ Y4: Medium Transmission (Active Blocker)</span>
          </div>
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

      <!-- Template 2: Maths Week 8 (Priority for Maya) -->
      <div class="template-card" data-tpl-id="math-w8" data-subject="maths" data-rec-lara="false" data-rec-maya="true">
        <div class="priority-banner" id="banner-math-w8" style="display: none;">
          <span style="display: flex; align-items: center; gap: 6px;">
            <span>🎯</span> Recommended Root Blocker Remediation for <strong>Maya</strong>
          </span>
          <span class="badge badge-purple">Y4 Maths • 89ms</span>
        </div>

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

        <!-- Wave 19 Prerequisite Concept Flow Strip -->
        <div class="prereq-flow-strip" id="flow-math-w8" style="display: none;">
          <div class="flow-title">
            <svg class="w-3.5 h-3.5 inline text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v1"></path><path d="M18 8h4a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-4"></path><circle cx="8" cy="12" r="2"></circle></svg>
            Prerequisite Lineage (DAG)
          </div>
          <div class="flow-steps">
            <span class="flow-step-tag mastered" title="Mastered in Y3">✓ Y3: 3-Digit Partitioning</span>
            <span class="flow-arrow">➔</span>
            <span class="flow-step-tag mastered" title="Mastered in Y4">✓ Y4: Tenths & Decimals</span>
            <span class="flow-arrow">➔</span>
            <span class="flow-step-tag blocker" title="Current Root Blocker">⚠️ Y4: Zero Column Alignment (Active Blocker)</span>
          </div>
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
      <div class="template-card" data-tpl-id="eng-w7" data-subject="english" data-rec-lara="false" data-rec-maya="false">
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
      <div class="template-card" data-tpl-id="sci-w7" data-subject="science" data-rec-lara="false" data-rec-maya="false">
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
      <div class="template-card" data-tpl-id="math-w7" data-subject="maths" data-rec-lara="false" data-rec-maya="false">
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
        </div>
      </div>

      <!-- Rendered Vector Worksheet Paper Simulation -->
      <div class="clean-worksheet-paper">
        <div class="clean-worksheet-header">
          <div class="clean-school-brand">ASTEN COLLEGE • CAIRO</div>
          <div class="clean-exam-title">KEY STAGE 2 • YEAR 4 FORMATIVE ASSESSMENT • WEEK 8</div>
          <div class="clean-meta-row">
            <div>Student Name: ___________________________</div>
            <div>Class: Year 4 (Einstein)</div>
            <div>Date: ____________</div>
          </div>
        </div>

        <!-- Section 1 -->
        <div class="clean-section-header">Section A: Physical Vibrations & Acoustic Properties (10 Marks)</div>

        <div class="clean-question-card">
          <div class="clean-q-head">
            <span class="q-num">Question 1</span>
            <span class="q-marks">[2 Marks]</span>
          </div>
          <div class="clean-q-body">
            Sound is created when an object vibrates. Complete the sentences below using words from the box.
            <div style="display: flex; gap: 12px; justify-content: center; margin: 8px 0; font-family: monospace; font-size: 11px; background: #f8fafc; padding: 6px; border: 1px solid #e2e8f0; border-radius: 4px;">
              <span>[ particles ]</span>
              <span>[ vacuum ]</span>
              <span>[ energy ]</span>
              <span>[ vibrations ]</span>
            </div>
            a) All sounds are produced by rapid back-and-forth ______________________. <br/>
            b) Sound travels through materials by transferring mechanical ______________________.
          </div>
          <div class="clean-ruled-lines">
            <div class="ruled-line"></div>
            <div class="ruled-line"></div>
          </div>
        </div>

        <div class="clean-question-card">
          <div class="clean-q-head">
            <span class="q-num">Question 2</span>
            <span class="q-marks">[3 Marks]</span>
          </div>
          <div class="clean-q-body">
            Lara uses a drum and sprinkles rice grains on the surface. When she strikes the drum firmly with a drumstick:
            <br/>a) What happens to the rice grains? Explain why using the word <em>vibration</em>.
          </div>
          <div class="clean-ruled-lines">
            <div class="ruled-line"></div>
            <div class="ruled-line"></div>
            <div class="ruled-line"></div>
          </div>
        </div>

        <div class="clean-question-card">
          <div class="clean-q-head">
            <span class="q-num">Question 3</span>
            <span class="q-marks">[3 Marks]</span>
          </div>
          <div class="clean-q-body">
            Tick (✓) one box in each row to show whether sound can travel through the given medium.
            <table class="clean-preview-table">
              <thead>
                <tr>
                  <th>Medium</th>
                  <th>Can Sound Travel? (Yes)</th>
                  <th>Cannot Travel? (No)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Air (Gas)</td>
                  <td><div class="fill-box"></div></td>
                  <td><div class="fill-box"></div></td>
                </tr>
                <tr>
                  <td>Water (Liquid)</td>
                  <td><div class="fill-box"></div></td>
                  <td><div class="fill-box"></div></td>
                </tr>
                <tr>
                  <td>Outer Space (Vacuum)</td>
                  <td><div class="fill-box"></div></td>
                  <td><div class="fill-box"></div></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
`;
}
