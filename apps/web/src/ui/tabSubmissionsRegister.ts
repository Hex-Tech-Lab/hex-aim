export function renderSubmissionsRegisterTab(): string {
  return `  <!-- TAB 4: Scanned Submissions Register & De-skew Gallery -->
  <div id="tab-submissions-register" class="tab-pane">
    <!-- Top Overview KPIs -->
    <div class="grid-metrics">
      <div class="metric-card m-cyan">
        <div class="title">Physical Pages Ingested (📄)</div>
        <div class="value" id="kpi-total-pages">52</div>
        <div class="desc">Physical pages processed & de-skewed</div>
      </div>
      <div class="metric-card m-green">
        <div class="title">Assessment Packets (📦)</div>
        <div class="value">8</div>
        <div class="desc">Classified test batches (4-6 pages each)</div>
      </div>
      <div class="metric-card m-yellow">
        <div class="title">Mean De-skew Tilt (📐)</div>
        <div class="value">1.4°</div>
        <div class="desc">Automatic rotation & warp correction</div>
      </div>
      <div class="metric-card m-purple">
        <div class="title">OCR Layout Alignment (🎯)</div>
        <div class="value">99.3%</div>
        <div class="desc">Question anchor bounding precision</div>
      </div>
    </div>

    <!-- Controls Bar: Filter by Student, Subject, and View Mode -->
    <div class="card" style="margin-bottom: 20px;">
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">
        <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
          <label style="font-size: 12px; font-weight: 700; color: var(--muted); text-transform: uppercase;">Student Filter:</label>
          <div class="filter-pill-group">
            <button class="filter-pill active" onclick="filterSubmissions('all', null)">All (52)</button>
            <button class="filter-pill" onclick="filterSubmissions('lara', null)">👧 Lara (30)</button>
            <button class="filter-pill" onclick="filterSubmissions('maya', null)">👧 Maya (22)</button>
          </div>

          <label style="font-size: 12px; font-weight: 700; color: var(--muted); text-transform: uppercase; margin-left: 10px;">Subject:</label>
          <div class="filter-pill-group">
            <button class="filter-pill active" onclick="filterSubmissions(null, 'all')">All</button>
            <button class="filter-pill" onclick="filterSubmissions(null, 'science')">Science</button>
            <button class="filter-pill" onclick="filterSubmissions(null, 'maths')">Maths</button>
            <button class="filter-pill" onclick="filterSubmissions(null, 'english')">English</button>
          </div>
        </div>

        <!-- View Switcher: Grouped Packets vs Flat Physical Gallery -->
        <div class="view-toggle">
          <button id="view-mode-grouped" class="view-toggle-btn active" onclick="setSubmissionsView('grouped')">
            <svg class="w-4 h-4 inline mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
            Grouped by Test Packet (8)
          </button>
          <button id="view-mode-flat" class="view-toggle-btn" onclick="setSubmissionsView('flat')">
            <svg class="w-4 h-4 inline mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
            Flat Physical Pages (52)
          </button>
        </div>
      </div>
    </div>

    <!-- VIEW 1: GROUPED BY ASSESSMENT PACKET (Default) -->
    <div id="submissions-grouped-container" class="packets-list">
      <!-- Packet 1: Science W8 Lara -->
      <div class="packet-card" data-student="lara" data-subject="science">
        <div class="packet-header">
          <div class="packet-meta">
            <div class="packet-title">
              <span class="badge badge-cyan">Science</span>
              <h3>Y4 Science Week 8: Sound & Auditory Vibrations</h3>
              <span class="badge badge-green">Lara (Year 4)</span>
            </div>
            <div class="packet-sub">
              <span>📅 Submitted: <strong>2026-10-24</strong></span> •
              <span>📄 <strong>4 Physical Pages</strong> (Q1 to Q8)</span> •
              <span>🎯 Score: <strong>14/20 (70%)</strong></span> •
              <span style="color: var(--cyan);">📐 De-skew: <strong>+1.8° tilt corrected</strong></span> •
              <span style="color: var(--green);">✨ Contrast: <strong>Normalized 100%</strong></span>
            </div>
          </div>
          <div class="packet-actions">
            <button class="btn btn-outline" style="width: auto; padding: 6px 14px; font-size: 12px;" onclick="openScanModal('pkt-sci-w8', 0)">
              🔍 Inspect High-Res Pages
            </button>
          </div>
        </div>

        <div class="pages-carousel">
          <!-- Page 1 -->
          <div class="page-thumb-card" onclick="openScanModal('pkt-sci-w8', 0)">
            <div class="page-thumb-badge">Page 1 / 4</div>
            <div class="page-canvas-preview">
              <div class="doc-header-line"></div>
              <div class="doc-line w-80"></div>
              <div class="doc-line w-60"></div>
              <div class="doc-box">
                <span class="doc-stamp-pass">Q1: 2/2 ✓</span>
                <span class="doc-ink-mark">Handwritten: "Vibrations in air"</span>
              </div>
              <div class="doc-box">
                <span class="doc-stamp-fail">Q2: 0/2 ✗</span>
                <span class="doc-ink-mark">Handwritten: "Sound travels faster in air than water"</span>
              </div>
            </div>
            <div class="page-meta-footer">
              <span>Q1 – Q3</span>
              <span class="deskew-tag">📐 +1.8° • 99.4% OCR</span>
            </div>
          </div>

          <!-- Page 2 -->
          <div class="page-thumb-card" onclick="openScanModal('pkt-sci-w8', 1)">
            <div class="page-thumb-badge">Page 2 / 4</div>
            <div class="page-canvas-preview">
              <div class="doc-line w-90"></div>
              <div class="doc-line w-70"></div>
              <div class="doc-box">
                <span class="doc-stamp-pass">Q3: 2/2 ✓</span>
                <span class="doc-ink-mark">Diagram: Tuning fork labeled</span>
              </div>
              <div class="doc-box">
                <span class="doc-stamp-pass">Q4: 2/2 ✓</span>
                <span class="doc-ink-mark">Handwritten: "Decibels measurement"</span>
              </div>
            </div>
            <div class="page-meta-footer">
              <span>Q4 – Q5</span>
              <span class="deskew-tag">📐 +1.6° • 99.5% OCR</span>
            </div>
          </div>

          <!-- Page 3 -->
          <div class="page-thumb-card" onclick="openScanModal('pkt-sci-w8', 2)">
            <div class="page-thumb-badge">Page 3 / 4</div>
            <div class="page-canvas-preview">
              <div class="doc-line w-75"></div>
              <div class="doc-box">
                <span class="doc-stamp-fail">Q6: 1/2 ⚠️</span>
                <span class="doc-ink-mark">Graph: Amplitude vs Pitch confusion</span>
              </div>
            </div>
            <div class="page-meta-footer">
              <span>Q6 – Q7</span>
              <span class="deskew-tag">📐 +1.9° • 99.2% OCR</span>
            </div>
          </div>

          <!-- Page 4 -->
          <div class="page-thumb-card" onclick="openScanModal('pkt-sci-w8', 3)">
            <div class="page-thumb-badge">Page 4 / 4</div>
            <div class="page-canvas-preview">
              <div class="doc-line w-60"></div>
              <div class="doc-box">
                <span class="doc-stamp-pass">Q8: 3/4 ✓</span>
                <span class="doc-ink-mark">Summary: Ear canal & eardrum</span>
              </div>
              <div class="doc-teacher-grade">Teacher Mark: 14/20</div>
            </div>
            <div class="page-meta-footer">
              <span>Q8 (Final)</span>
              <span class="deskew-tag">📐 +1.7° • 99.6% OCR</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Packet 2: Maths W8 Lara -->
      <div class="packet-card" data-student="lara" data-subject="maths">
        <div class="packet-header">
          <div class="packet-meta">
            <div class="packet-title">
              <span class="badge badge-yellow">Maths</span>
              <h3>Y4 Maths Week 8: Decimals & Place Value Alignment</h3>
              <span class="badge badge-green">Lara (Year 4)</span>
            </div>
            <div class="packet-sub">
              <span>📅 Submitted: <strong>2026-10-21</strong></span> •
              <span>📄 <strong>5 Physical Pages</strong> (Q1 to Q10)</span> •
              <span>🎯 Score: <strong>16/20 (80%)</strong></span> •
              <span style="color: var(--cyan);">📐 De-skew: <strong>-0.9° tilt corrected</strong></span> •
              <span style="color: var(--green);">✨ Contrast: <strong>Normalized 100%</strong></span>
            </div>
          </div>
          <div class="packet-actions">
            <button class="btn btn-outline" style="width: auto; padding: 6px 14px; font-size: 12px;" onclick="openScanModal('pkt-math-w8', 0)">
              🔍 Inspect High-Res Pages
            </button>
          </div>
        </div>

        <div class="pages-carousel">
          <div class="page-thumb-card" onclick="openScanModal('pkt-math-w8', 0)">
            <div class="page-thumb-badge">Page 1 / 5</div>
            <div class="page-canvas-preview">
              <div class="doc-header-line"></div>
              <div class="doc-box">
                <span class="doc-stamp-pass">Q1: 2/2 ✓</span>
                <span class="doc-ink-mark">0.45 < 0.54</span>
              </div>
              <div class="doc-box">
                <span class="doc-stamp-pass">Q2: 2/2 ✓</span>
                <span class="doc-ink-mark">3.08 tenths = 0</span>
              </div>
            </div>
            <div class="page-meta-footer"><span>Q1 – Q2</span><span class="deskew-tag">📐 -0.9° • 99.1%</span></div>
          </div>

          <div class="page-thumb-card" onclick="openScanModal('pkt-math-w8', 1)">
            <div class="page-thumb-badge">Page 2 / 5</div>
            <div class="page-canvas-preview">
              <div class="doc-box">
                <span class="doc-stamp-fail">Q3: 0/2 ✗</span>
                <span class="doc-ink-mark">Column Shift: 4.5 + 0.08 = 4.13</span>
              </div>
            </div>
            <div class="page-meta-footer"><span>Q3 – Q4</span><span class="deskew-tag">📐 -1.1° • 98.8%</span></div>
          </div>

          <div class="page-thumb-card" onclick="openScanModal('pkt-math-w8', 2)">
            <div class="page-thumb-badge">Page 3 / 5</div>
            <div class="page-canvas-preview">
              <div class="doc-box"><span class="doc-stamp-pass">Q5: 2/2 ✓</span><span class="doc-ink-mark">Number line 0.7</span></div>
              <div class="doc-box"><span class="doc-stamp-pass">Q6: 2/2 ✓</span><span class="doc-ink-mark">Rounding to nearest tenth</span></div>
            </div>
            <div class="page-meta-footer"><span>Q5 – Q6</span><span class="deskew-tag">📐 -0.8° • 99.3%</span></div>
          </div>

          <div class="page-thumb-card" onclick="openScanModal('pkt-math-w8', 3)">
            <div class="page-thumb-badge">Page 4 / 5</div>
            <div class="page-canvas-preview">
              <div class="doc-box"><span class="doc-stamp-pass">Q7: 2/2 ✓</span><span class="doc-ink-mark">Decimal word problems</span></div>
              <div class="doc-box"><span class="doc-stamp-fail">Q8: 0/2 ✗</span><span class="doc-ink-mark">Omitted trailing zero 1.20</span></div>
            </div>
            <div class="page-meta-footer"><span>Q7 – Q8</span><span class="deskew-tag">📐 -1.0° • 98.6%</span></div>
          </div>

          <div class="page-thumb-card" onclick="openScanModal('pkt-math-w8', 4)">
            <div class="page-thumb-badge">Page 5 / 5</div>
            <div class="page-canvas-preview">
              <div class="doc-box"><span class="doc-stamp-pass">Q9: 3/3 ✓</span><span class="doc-ink-mark">Currency calculation £4.35</span></div>
              <div class="doc-teacher-grade">Teacher Mark: 16/20</div>
            </div>
            <div class="page-meta-footer"><span>Q9 – Q10</span><span class="deskew-tag">📐 -0.7° • 99.2%</span></div>
          </div>
        </div>
      </div>

      <!-- Packet 3: English W7 Lara -->
      <div class="packet-card" data-student="lara" data-subject="english">
        <div class="packet-header">
          <div class="packet-meta">
            <div class="packet-title">
              <span class="badge badge-purple">English</span>
              <h3>Y4 English Week 7: Suffixes, Prefixes & Sentence Syntax</h3>
              <span class="badge badge-green">Lara (Year 4)</span>
            </div>
            <div class="packet-sub">
              <span>📅 Submitted: <strong>2026-10-18</strong></span> •
              <span>📄 <strong>4 Physical Pages</strong> (Q1 to Q12)</span> •
              <span>🎯 Score: <strong>18/20 (90%)</strong></span> •
              <span style="color: var(--cyan);">📐 De-skew: <strong>+0.4° tilt corrected</strong></span> •
              <span style="color: var(--green);">✨ Contrast: <strong>Normalized 100%</strong></span>
            </div>
          </div>
          <div class="packet-actions">
            <button class="btn btn-outline" style="width: auto; padding: 6px 14px; font-size: 12px;" onclick="openScanModal('pkt-eng-w7', 0)">
              🔍 Inspect High-Res Pages
            </button>
          </div>
        </div>

        <div class="pages-carousel">
          <div class="page-thumb-card" onclick="openScanModal('pkt-eng-w7', 0)"><div class="page-thumb-badge">Page 1 / 4</div><div class="page-canvas-preview"><div class="doc-header-line"></div><div class="doc-box"><span class="doc-stamp-pass">Q1-3: 6/6 ✓</span><span class="doc-ink-mark">Suffixes -ation, -ous</span></div></div><div class="page-meta-footer"><span>Q1 – Q3</span><span class="deskew-tag">📐 +0.4°</span></div></div>
          <div class="page-thumb-card" onclick="openScanModal('pkt-eng-w7', 1)"><div class="page-thumb-badge">Page 2 / 4</div><div class="page-canvas-preview"><div class="doc-box"><span class="doc-stamp-pass">Q4-6: 6/6 ✓</span><span class="doc-ink-mark">Prefixes auto-, anti-</span></div></div><div class="page-meta-footer"><span>Q4 – Q6</span><span class="deskew-tag">📐 +0.3°</span></div></div>
          <div class="page-thumb-card" onclick="openScanModal('pkt-eng-w7', 2)"><div class="page-thumb-badge">Page 3 / 4</div><div class="page-canvas-preview"><div class="doc-box"><span class="doc-stamp-fail">Q7: 1/2 ⚠️</span><span class="doc-ink-mark">Homophone misidentification</span></div></div><div class="page-meta-footer"><span>Q7 – Q9</span><span class="deskew-tag">📐 +0.5°</span></div></div>
          <div class="page-thumb-card" onclick="openScanModal('pkt-eng-w7', 3)"><div class="page-thumb-badge">Page 4 / 4</div><div class="page-canvas-preview"><div class="doc-box"><span class="doc-stamp-pass">Q10-12: 5/6 ✓</span><span class="doc-ink-mark">Paragraph syntax</span></div><div class="doc-teacher-grade">Teacher Mark: 18/20</div></div><div class="page-meta-footer"><span>Q10 – Q12</span><span class="deskew-tag">📐 +0.4°</span></div></div>
        </div>
      </div>

      <!-- Packet 4: Science W7 Maya -->
      <div class="packet-card" data-student="maya" data-subject="science">
        <div class="packet-header">
          <div class="packet-meta">
            <div class="packet-title">
              <span class="badge badge-cyan">Science</span>
              <h3>Y4 Science Week 7: Electrical Circuits & Conductors</h3>
              <span class="badge badge-purple">Maya (Year 4)</span>
            </div>
            <div class="packet-sub">
              <span>📅 Submitted: <strong>2026-10-17</strong></span> •
              <span>📄 <strong>4 Physical Pages</strong> (Q1 to Q9)</span> •
              <span>🎯 Score: <strong>19/20 (95%)</strong></span> •
              <span style="color: var(--cyan);">📐 De-skew: <strong>+1.2° tilt corrected</strong></span> •
              <span style="color: var(--green);">✨ Contrast: <strong>Normalized 100%</strong></span>
            </div>
          </div>
          <div class="packet-actions">
            <button class="btn btn-outline" style="width: auto; padding: 6px 14px; font-size: 12px;" onclick="openScanModal('pkt-sci-w7-maya', 0)">
              🔍 Inspect High-Res Pages
            </button>
          </div>
        </div>

        <div class="pages-carousel">
          <div class="page-thumb-card" onclick="openScanModal('pkt-sci-w7-maya', 0)"><div class="page-thumb-badge">Page 1 / 4</div><div class="page-canvas-preview"><div class="doc-header-line"></div><div class="doc-box"><span class="doc-stamp-pass">Q1-2: 4/4 ✓</span><span class="doc-ink-mark">Closed vs open circuit</span></div></div><div class="page-meta-footer"><span>Q1 – Q2</span><span class="deskew-tag">📐 +1.2°</span></div></div>
          <div class="page-thumb-card" onclick="openScanModal('pkt-sci-w7-maya', 1)"><div class="page-thumb-badge">Page 2 / 4</div><div class="page-canvas-preview"><div class="doc-box"><span class="doc-stamp-pass">Q3-4: 5/5 ✓</span><span class="doc-ink-mark">Switch operation & battery polarity</span></div></div><div class="page-meta-footer"><span>Q3 – Q4</span><span class="deskew-tag">📐 +1.1°</span></div></div>
          <div class="page-thumb-card" onclick="openScanModal('pkt-sci-w7-maya', 2)"><div class="page-thumb-badge">Page 3 / 4</div><div class="page-canvas-preview"><div class="doc-box"><span class="doc-stamp-pass">Q5-7: 6/6 ✓</span><span class="doc-ink-mark">Conductors vs Insulators</span></div></div><div class="page-meta-footer"><span>Q5 – Q7</span><span class="deskew-tag">📐 +1.4°</span></div></div>
          <div class="page-thumb-card" onclick="openScanModal('pkt-sci-w7-maya', 3)"><div class="page-thumb-badge">Page 4 / 4</div><div class="page-canvas-preview"><div class="doc-box"><span class="doc-stamp-pass">Q8-9: 4/5 ✓</span><span class="doc-ink-mark">Circuit schematic drawing</span></div><div class="doc-teacher-grade">Teacher Mark: 19/20</div></div><div class="page-meta-footer"><span>Q8 – Q9</span><span class="deskew-tag">📐 +1.0°</span></div></div>
        </div>
      </div>

      <!-- Additional Packets (Packets 5 to 8) -->
      <div class="packet-card" data-student="maya" data-subject="maths">
        <div class="packet-header">
          <div class="packet-meta">
            <div class="packet-title">
              <span class="badge badge-yellow">Maths</span>
              <h3>Y4 Maths Week 7: Fractions & Decimals Equivalence</h3>
              <span class="badge badge-purple">Maya (Year 4)</span>
            </div>
            <div class="packet-sub">
              <span>📅 Submitted: <strong>2026-10-14</strong></span> •
              <span>📄 <strong>5 Physical Pages</strong> (Q1 to Q10)</span> •
              <span>🎯 Score: <strong>18/20 (90%)</strong></span> •
              <span style="color: var(--cyan);">📐 De-skew: <strong>-1.5° tilt corrected</strong></span>
            </div>
          </div>
          <div class="packet-actions">
            <button class="btn btn-outline" style="width: auto; padding: 6px 14px; font-size: 12px;" onclick="openScanModal('pkt-math-w7-maya', 0)">🔍 Inspect High-Res Pages</button>
          </div>
        </div>
      </div>

      <div class="packet-card" data-student="lara" data-subject="science">
        <div class="packet-header">
          <div class="packet-meta">
            <div class="packet-title">
              <span class="badge badge-cyan">Science</span>
              <h3>Y4 Science Week 6: Living Things & Habitats</h3>
              <span class="badge badge-green">Lara (Year 4)</span>
            </div>
            <div class="packet-sub">
              <span>📅 Submitted: <strong>2026-10-10</strong></span> •
              <span>📄 <strong>6 Physical Pages</strong> (Q1 to Q11)</span> •
              <span>🎯 Score: <strong>13/20 (65%)</strong></span> •
              <span style="color: var(--cyan);">📐 De-skew: <strong>+2.1° tilt corrected</strong></span>
            </div>
          </div>
          <div class="packet-actions">
            <button class="btn btn-outline" style="width: auto; padding: 6px 14px; font-size: 12px;" onclick="openScanModal('pkt-sci-w6-lara', 0)">🔍 Inspect High-Res Pages</button>
          </div>
        </div>
      </div>

      <div class="packet-card" data-student="lara" data-subject="maths">
        <div class="packet-header">
          <div class="packet-meta">
            <div class="packet-title">
              <span class="badge badge-yellow">Maths</span>
              <h3>Y4 Maths Week 6: Multi-digit Column Addition</h3>
              <span class="badge badge-green">Lara (Year 4)</span>
            </div>
            <div class="packet-sub">
              <span>📅 Submitted: <strong>2026-10-07</strong></span> •
              <span>📄 <strong>5 Physical Pages</strong> (Q1 to Q10)</span> •
              <span>🎯 Score: <strong>15/20 (75%)</strong></span> •
              <span style="color: var(--cyan);">📐 De-skew: <strong>+0.7° tilt corrected</strong></span>
            </div>
          </div>
          <div class="packet-actions">
            <button class="btn btn-outline" style="width: auto; padding: 6px 14px; font-size: 12px;" onclick="openScanModal('pkt-math-w6-lara', 0)">🔍 Inspect High-Res Pages</button>
          </div>
        </div>
      </div>

      <div class="packet-card" data-student="maya" data-subject="english">
        <div class="packet-header">
          <div class="packet-meta">
            <div class="packet-title">
              <span class="badge badge-purple">English</span>
              <h3>Y4 English Week 6: Reading Comprehension & Inferences</h3>
              <span class="badge badge-purple">Maya (Year 4)</span>
            </div>
            <div class="packet-sub">
              <span>📅 Submitted: <strong>2026-10-03</strong></span> •
              <span>📄 <strong>4 Physical Pages</strong> (Q1 to Q8)</span> •
              <span>🎯 Score: <strong>20/20 (100%)</strong></span> •
              <span style="color: var(--cyan);">📐 De-skew: <strong>+0.2° tilt corrected</strong></span>
            </div>
          </div>
          <div class="packet-actions">
            <button class="btn btn-outline" style="width: auto; padding: 6px 14px; font-size: 12px;" onclick="openScanModal('pkt-eng-w6-maya', 0)">🔍 Inspect High-Res Pages</button>
          </div>
        </div>
      </div>
    </div>

    <!-- VIEW 2: FLAT PHYSICAL PAGES GALLERY (Hidden by default) -->
    <div id="submissions-flat-container" class="flat-pages-grid" style="display: none;">
      <!-- Dynamically filled or pre-rendered flat page grid -->
      ${renderFlatPagesGrid()}
    </div>
  </div>

  <!-- Physical Image Modal Inspector -->
  <div id="scan-inspector-modal" class="modal-backdrop" style="display: none;" onclick="closeScanModal(event)">
    <div class="modal-card" onclick="event.stopPropagation()">
      <div class="modal-header">
        <div>
          <h3 id="modal-title">Physical Processed Sheet Inspector</h3>
          <div id="modal-subtitle" style="font-size: 12px; color: var(--muted);">Asten College • De-skewed at +1.8° • Contrast 100% Normalized</div>
        </div>
        <button class="modal-close" onclick="closeScanModal()">✕</button>
      </div>

      <div class="modal-body-split">
        <!-- Left: High-Res Enhanced Physical Scan -->
        <div class="scan-display-frame">
          <div class="scan-overlay-tools">
            <span class="scan-tool-badge">🟢 De-skewed (+1.8°)</span>
            <span class="scan-tool-badge">✨ Contrast 100%</span>
            <span class="scan-tool-badge">🔍 OCR Anchors: ON</span>
            <span class="scan-tool-badge" style="background: rgba(245,158,11,0.15); color: var(--orange); border: 1px solid var(--orange);">🎯 Socratic Inpainting: ACTIVE</span>
          </div>

          <div class="scan-paper-simulation">
            <div class="sim-header">
              <div class="sim-title">ASTEN COLLEGE • YEAR 4 FORMATIVE SCIENCE</div>
              <div class="sim-meta">Name: <u>Lara</u> &nbsp;&nbsp;&nbsp; Date: <u>24 Oct 2026</u> &nbsp;&nbsp;&nbsp; Score: <u>14 / 20</u></div>
            </div>

            <div class="sim-question-box ocr-box-green">
              <div class="sim-q-num">Q1 [2 Marks] (Concept: Y4.SCI.SND.VIBRATIONS)</div>
              <div class="sim-q-text">Explain what causes sound when an acoustic guitar string is plucked.</div>
              <div class="sim-student-handwriting">The string vibrates rapidly back and forth, pushing the air molecules to create sound waves that reach our ears.</div>
              <div class="sim-grade-tag grade-pass">✓ 2/2 Marks (Handwriting OCR: 99.8% Confidence)</div>
            </div>

            <div class="sim-question-box ocr-box-orange" style="position: relative;">
              <div class="sim-q-num">Q2 [2 Marks] (Concept: Y4.SCI.SND.MEDIUM)</div>
              <div class="sim-q-text">Compare the speed of sound through water compared to air.</div>
              <div class="sim-student-handwriting" style="text-decoration: line-through; opacity: 0.65;">Sound travels faster in air than water because water is heavier and slows it down.</div>
              <div class="sim-grade-tag grade-fail">✗ 0/2 Marks (Misconception: Dense Medium Acceleration Inversion)</div>

              <!-- Wave 24: Socratic Multi-Modal Inpainting Vector Overlay -->
              <div class="inpainting-vector-box" style="margin-top: 10px; border: 1.5px dashed var(--orange); background: rgba(245,158,11,0.06); padding: 10px; border-radius: 6px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                  <span style="font-size: 11px; font-weight: 700; color: var(--orange);">🎯 Socratic Vector Inpainting Overlay (bbox: [75, 390, 650, 125])</span>
                  <span class="badge badge-yellow" style="font-size: 9px;">99.4% OCR Confidence</span>
                </div>
                <div style="font-size: 11px; color: var(--astryx-text-contrast); margin-bottom: 6px;">
                  <strong>Parent Socratic Prompt:</strong> <em>"Think of sound as dominos knocking together. If dominos are packed tightly like in water, does the wave reach the end faster or slower than in air?"</em>
                </div>
                <!-- Inline SVG Particle Proximity Scaffold -->
                <svg viewBox="0 0 460 70" style="width: 100%; max-height: 70px; background: rgba(0,0,0,0.2); border-radius: 4px; margin-bottom: 6px;">
                  <g transform="translate(10, 10)">
                    <text x="0" y="12" fill="#8892b0" font-size="9" font-weight="700">AIR (343 m/s) • Widely Spaced Particles</text>
                    <circle cx="15" cy="30" r="4" fill="#4ade80" />
                    <circle cx="55" cy="30" r="4" fill="#4ade80" />
                    <circle cx="95" cy="30" r="4" fill="#4ade80" />
                    <circle cx="135" cy="30" r="4" fill="#4ade80" />
                    <path d="M 20 30 L 50 30" stroke="#64748b" stroke-dasharray="2 2" stroke-width="1.5" />
                  </g>
                  <g transform="translate(240, 10)">
                    <text x="0" y="12" fill="#00e5ff" font-size="9" font-weight="700">WATER (1,480 m/s) • Close Domino Effect 🚀</text>
                    <circle cx="10" cy="30" r="4" fill="#00e5ff" />
                    <circle cx="25" cy="30" r="4" fill="#00e5ff" />
                    <circle cx="40" cy="30" r="4" fill="#00e5ff" />
                    <circle cx="55" cy="30" r="4" fill="#00e5ff" />
                    <circle cx="70" cy="30" r="4" fill="#00e5ff" />
                    <path d="M 10 30 L 70 30" stroke="#00e5ff" stroke-width="1.5" />
                  </g>
                </svg>
                <div style="background: rgba(0,0,0,0.3); padding: 6px 8px; border-radius: 4px; font-size: 11px; font-family: monospace; color: var(--cyan);">
                  ✏️ <strong>Guided Student Inpainting:</strong> Sound travels <u>[_______]</u> in water than air because molecules are <u>[closer / further]</u>.
                </div>
              </div>
            </div>

            <div class="sim-question-box ocr-box-green">
              <div class="sim-q-num">Q3 [2 Marks] (Concept: Y4.SCI.SND.PITCH)</div>
              <div class="sim-q-text">How does tightening a guitar string change its pitch?</div>
              <div class="sim-student-handwriting">Tightening makes it vibrate faster, which makes the pitch higher.</div>
              <div class="sim-grade-tag grade-pass">✓ 2/2 Marks</div>
            </div>
          </div>
        </div>

        <!-- Right: Vision Telemetry & Question Deltas -->
        <div class="scan-telemetry-panel">
          <h4 style="margin-bottom: 10px; color: var(--astryx-text-contrast);">Vision Pipeline Telemetry</h4>
          <div class="telemetry-item">
            <span class="t-label">Camera Angle Distortion:</span>
            <span class="t-val text-green">1.8° Clockwise (Corrected)</span>
          </div>
          <div class="telemetry-item">
            <span class="t-label">Shadow/Lighting Compensation:</span>
            <span class="t-val text-cyan">Bilateral Adaptive Threshold</span>
          </div>
          <div class="telemetry-item">
            <span class="t-label">Paper Warp / Keystoning:</span>
            <span class="t-val text-green">Homography Matrix 4-Point Rectified</span>
          </div>
          <div class="telemetry-item">
            <span class="t-label">Student Delta Anchor:</span>
            <span class="t-val text-cyan"><code>master_asten-college:Y4:science:w8</code></span>
          </div>

          <h4 style="margin-top: 20px; margin-bottom: 10px; color: var(--astryx-text-contrast);">Handwriting Extraction Delta</h4>
          <div class="delta-box">
            <div style="font-size: 11px; font-weight: 700; color: var(--orange); margin-bottom: 4px;">Identified Cognitive Gap:</div>
            <div style="font-size: 12px; color: var(--astryx-text-contrast); margin-bottom: 8px;">
              <strong>ERR_DENSE_MEDIUM_INVERSION</strong>: Student inverted the acoustic density principle. Sound travels ~4.3x faster in water (1,480 m/s) than air (343 m/s) due to particle proximity.
            </div>
            <div style="font-size: 11px; color: var(--muted);">
              Preserved in Cognitive Gap Ledger and queued for Socratic Remediation Sprint.
            </div>
          </div>

          <div style="margin-top: 20px;">
            <button class="btn" onclick="closeScanModal()">Done Reviewing</button>
          </div>
        </div>
      </div>
    </div>
  </div>`;
}

function renderFlatPagesGrid(): string {
  // Generates 12 representative physical pages from the 52 total
  const pages = [
    { p: 1, test: 'Science W8', q: 'Q1-Q3', student: 'Lara', deg: '+1.8°', score: 'Pass', ocr: '99.4%' },
    { p: 2, test: 'Science W8', q: 'Q4-Q5', student: 'Lara', deg: '+1.6°', score: 'Pass', ocr: '99.5%' },
    { p: 3, test: 'Science W8', q: 'Q6-Q7', student: 'Lara', deg: '+1.9°', score: 'Review', ocr: '99.2%' },
    { p: 4, test: 'Science W8', q: 'Q8', student: 'Lara', deg: '+1.7°', score: 'Pass', ocr: '99.6%' },
    { p: 5, test: 'Maths W8', q: 'Q1-Q2', student: 'Lara', deg: '-0.9°', score: 'Pass', ocr: '99.1%' },
    { p: 6, test: 'Maths W8', q: 'Q3-Q4', student: 'Lara', deg: '-1.1°', score: 'Fail', ocr: '98.8%' },
    { p: 7, test: 'Maths W8', q: 'Q5-Q6', student: 'Lara', deg: '-0.8°', score: 'Pass', ocr: '99.3%' },
    { p: 8, test: 'Maths W8', q: 'Q7-Q8', student: 'Lara', deg: '-1.0°', score: 'Review', ocr: '98.6%' },
    { p: 9, test: 'Maths W8', q: 'Q9-Q10', student: 'Lara', deg: '-0.7°', score: 'Pass', ocr: '99.2%' },
    { p: 10, test: 'English W7', q: 'Q1-Q3', student: 'Lara', deg: '+0.4°', score: 'Pass', ocr: '99.7%' },
    { p: 11, test: 'Science W7', q: 'Q1-Q2', student: 'Maya', deg: '+1.2°', score: 'Pass', ocr: '99.5%' },
    { p: 12, test: 'Maths W7', q: 'Q1-Q2', student: 'Maya', deg: '-1.5°', score: 'Pass', ocr: '99.1%' },
  ];

  return pages.map(item => `
    <div class="page-thumb-card" onclick="openScanModal('pkt-page', ${item.p})">
      <div class="page-thumb-badge">${item.test} • P${item.p}</div>
      <div class="page-canvas-preview">
        <div class="doc-header-line"></div>
        <div class="doc-line w-80"></div>
        <div class="doc-box">
          <span class="doc-stamp-${item.score === 'Fail' ? 'fail' : 'pass'}">${item.q}: ${item.score}</span>
          <span class="doc-ink-mark">Handwritten: ${item.student}</span>
        </div>
      </div>
      <div class="page-meta-footer">
        <span>${item.student}</span>
        <span class="deskew-tag">📐 ${item.deg} • ${item.ocr}</span>
      </div>
    </div>
  `).join('');
}
