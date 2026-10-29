export function renderStudentProgressTab(): string {
  return `  <!-- TAB 1: Student Progress & Mastery (2/3 + 1/3 Split) -->
  <div id="tab-student-view" class="tab-pane active">
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
              <div class="kpi-label">
                <span class="lang-en-only">Term Average</span>
                <span class="lang-ar-only">المعدل العام</span>
              </div>
              <div class="kpi-val" id="kpi-term-avg" style="color: var(--cyan);">92%</div>
            </div>
            <div class="mini-kpi">
              <div class="kpi-label">
                <span class="lang-en-only">Science (Midterm)</span>
                <span class="lang-ar-only">العلوم (المنتصف)</span>
              </div>
              <div class="kpi-val" id="kpi-science" style="color: var(--green);">94%</div>
            </div>
            <div class="mini-kpi">
              <div class="kpi-label">
                <span class="lang-en-only">Maths (NPV)</span>
                <span class="lang-ar-only">الرياضيات (القيمة المكانية)</span>
              </div>
              <div class="kpi-val" id="kpi-maths" style="color: var(--yellow);">82%</div>
            </div>
            <div class="mini-kpi">
              <div class="kpi-label">
                <span class="lang-en-only">English (Spelling)</span>
                <span class="lang-ar-only">الإنجليزية (الإملاء)</span>
              </div>
              <div class="kpi-val" id="kpi-english" style="color: var(--purple);">88%</div>
            </div>
          </div>

          <!-- Interactive Animated Chart.js Trajectory -->
          <div class="chart-box">
            <div class="chart-title">
              <span class="flex items-center gap-2">
                <i data-lucide="trending-up" class="w-4 h-4 text-cyan-400"></i>
                <span class="lang-en-only">Weekly Assessment Performance (Weeks 1 - 8)</span>
                <span class="lang-ar-only">أداء التقييم الأسبوعي (الأسابيع ١ - ٨)</span>
              </span>
              <div class="chart-legend">
                <div class="legend-item"><div class="dot" style="background: var(--green);"></div> <span class="lang-en-only">Science</span><span class="lang-ar-only">العلوم</span></div>
                <div class="legend-item"><div class="dot" style="background: var(--yellow);"></div> <span class="lang-en-only">Maths</span><span class="lang-ar-only">الرياضيات</span></div>
                <div class="legend-item"><div class="dot" style="background: var(--purple);"></div> <span class="lang-en-only">English</span><span class="lang-ar-only">الإنجليزية</span></div>
                <div class="legend-item"><div class="dot" style="background: #64748b;"></div> <span class="lang-en-only">80% Benchmark</span><span class="lang-ar-only">حد الإتقان ٨٠٪</span></div>
              </div>
            </div>
            <div style="position: relative; height: 210px; width: 100%;">
              <canvas id="trajectoryCanvas"></canvas>
            </div>
          </div>

          <!-- Dual Animated Visual Graphics: Cognitive Radar & Confidence Gauge -->
          <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 16px; margin-top: 16px;">
            <!-- Chart.js Cognitive Domain Radar -->
            <div style="background: var(--card-elevated); border: 1px solid var(--card-border); border-radius: 8px; padding: 14px; position: relative;">
              <div style="font-size: 12px; font-weight: 700; color: var(--astryx-text-contrast); margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between;">
                <span class="flex items-center gap-1.5"><i data-lucide="brain" class="w-3.5 h-3.5 text-cyan-400"></i> <span class="lang-en-only">Cognitive Domain Radar</span><span class="lang-ar-only">رادار النطاقات المعرفية</span></span>
                <span style="font-size: 10px; color: var(--cyan); font-family: monospace;">ASTEN Y4 RADAR</span>
              </div>
              <div style="position: relative; height: 180px; width: 100%;">
                <canvas id="cognitiveRadarCanvas"></canvas>
              </div>
            </div>

            <!-- Chart.js Mastery Gauge / Doughnut -->
            <div style="background: var(--card-elevated); border: 1px solid var(--card-border); border-radius: 8px; padding: 14px; position: relative;">
              <div style="font-size: 12px; font-weight: 700; color: var(--astryx-text-contrast); margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between;">
                <span class="flex items-center gap-1.5"><i data-lucide="shield-check" class="w-3.5 h-3.5 text-emerald-400"></i> <span class="lang-en-only">Zero-Alarm Confidence</span><span class="lang-ar-only">مؤشر الثقة دون قلق</span></span>
                <span class="badge badge-green" id="gauge-badge">
                  <span class="lang-en-only">High</span>
                  <span class="lang-ar-only">مرتفع</span>
                </span>
              </div>
              <div style="position: relative; height: 140px; width: 100%; display: flex; align-items: center; justify-content: center;">
                <canvas id="masteryGaugeCanvas"></canvas>
                <div id="gauge-center-text" style="position: absolute; top: 58%; left: 50%; transform: translate(-50%, -50%); text-align: center; pointer-events: none;">
                  <div id="gauge-val" style="font-size: 22px; font-weight: 800; color: var(--astryx-text-contrast); font-family: monospace;">94%</div>
                  <div style="font-size: 9px; color: var(--muted); text-transform: uppercase;">
                    <span class="lang-en-only">Retention</span>
                    <span class="lang-ar-only">تثبيت المفاهيم</span>
                  </div>
                </div>
              </div>
              <div style="font-size: 10px; color: var(--muted); text-align: center; margin-top: 4px;" id="gauge-sub">
                <span class="lang-en-only">Working memory load protected under sprint timer</span>
                <span class="lang-ar-only">حماية الذاكرة العاملة تحت توقيت التمرين القصير</span>
              </div>
            </div>
          </div>

          <!-- Misconceptions Summary -->
          <div style="margin-top: 16px;">
            <div style="font-size: 12px; font-weight: 700; color: var(--astryx-text-contrast); margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
              <i data-lucide="alert-triangle" class="w-4 h-4 text-amber-400"></i>
              <span class="lang-en-only">Active Priority Cognitive Errors (Targeted in Sprints)</span>
              <span class="lang-ar-only">الأخطاء المعرفية ذات الأولوية (المستهدفة في التمارين)</span>
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
            <h2 class="flex items-center gap-1.5">
              <i data-lucide="file-check-2" class="w-4 h-4 text-emerald-400"></i>
              <span class="lang-en-only">Latest Intake Scorecard</span>
              <span class="lang-ar-only">بطاقة درجات التقييم الأخير</span>
            </h2>
            <span class="badge badge-green">
              <span class="lang-en-only">Passed</span>
              <span class="lang-ar-only">تم الاجتياز</span>
            </span>
          </div>
          <div class="scorecard-banner">
            <div class="top">
              <span class="lang-en-only">SCIENCE MIDTERM (UNITS 1.1–1.5)</span>
              <span class="lang-ar-only">اختبار منتصف الفصل - علوم (الوحدات ١.١-١.٥)</span>
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
              <i data-lucide="zap" class="inline w-4 h-4 mr-1"></i>
              <span class="lang-en-only">🚀 Generate Targeted Practice Pack</span>
              <span class="lang-ar-only">🚀 توليد حزمة تمارين مخصصة</span>
            </button>
          </div>
        </div>

        <!-- Socratic Guide Preview Card -->
        <div class="card">
          <div class="card-header">
            <h2 class="flex items-center gap-1.5">
              <i data-lucide="compass" class="w-4 h-4 text-cyan-400"></i>
              <span class="lang-en-only">Parent Coaching Script</span>
              <span class="lang-ar-only">سيناريو الحوار الإرشادي للوالدين</span>
            </h2>
            <span class="badge badge-blue">
              <span class="lang-en-only">Socratic</span>
              <span class="lang-ar-only">سقراطي</span>
            </span>
          </div>
          <div style="font-size: 12px; color: var(--muted); margin-bottom: 8px;">
            <span class="lang-en-only">"Imagine our number lives in an apartment with reserved rooms: Ones, Tens, Hundreds, Thousands. If a room has nothing in it, does it disappear, or do we put a 0 guard in the chair?"</span>
            <span class="lang-ar-only">"تخيلي أن الأرقام تعيش في شقة بغرف محجوزة: آحاد، عشرات، مئات، آلاف. لو الغرفة مفيهاش حد، هل بتختفي، ولا بنحط الصفر حارس على الكرسي؟"</span>
          </div>
          <a href="/guide/preview" target="_blank" style="display: block; text-align: center; background: #1e293b; border: 1px solid #334155; color: var(--cyan); padding: 8px; border-radius: 6px; font-size: 12px; font-weight: 700; text-decoration: none;">
            <span class="lang-en-only">🧭 Open Socratic Guide Companion (2-Page A4)</span>
            <span class="lang-ar-only">🧭 فتح دليل التوجيه السقراطي (صفحتان A4)</span>
          </a>
        </div>

        <!-- Wave 30: Socratic Voice Dialogue Agent Quick Launch -->
        <div class="card" style="border-left: 3px solid var(--purple, #8b5cf6); background: linear-gradient(135deg, rgba(139, 92, 246, 0.08), rgba(6, 182, 212, 0.04));">
          <div class="card-header">
            <h2 class="flex items-center gap-1.5">
              <span style="font-size: 16px;">🎙️</span>
              <span class="lang-en-only">Socratic Voice Dialogue (Wave 30)</span>
              <span class="lang-ar-only">الحوار الصوتي السقراطي (الموجة ٣٠)</span>
            </h2>
            <span class="badge badge-purple" style="background: rgba(139, 92, 246, 0.2); color: #c084fc; border: 1px solid rgba(139, 92, 246, 0.4);">
              <span class="lang-en-only">Screen-Free</span>
              <span class="lang-ar-only">بدون شاشات</span>
            </span>
          </div>
          <div style="font-size: 12px; color: var(--muted); margin-bottom: 12px;">
            <span class="lang-en-only">Spoken 3-minute oral retrieval drill with bilingual Egyptian Arabic / English Socratic cues for ADHD/Dyslexia learners.</span>
            <span class="lang-ar-only">تدريب استرجاع شفهي مدته ٣ دقائق بدون شاشة مع توجيه سقراطي بالعامية المصرية والإنجليزية للأطفال ذوي صعوبات القراءة وفرط الحركة.</span>
          </div>
          <button class="btn" style="width: 100%; background: #8b5cf6; color: #fff; font-weight: 700; border: none; padding: 10px; border-radius: 6px; cursor: pointer; display: flex; justify-content: center; align-items: center; gap: 8px;" onclick="openVoiceModal()">
            <span>🎙️</span>
            <span class="lang-en-only">Start 3-Minute Voice Drill</span>
            <span class="lang-ar-only">بدء تدريب صوتي لمدة ٣ دقائق</span>
          </button>
        </div>

        <!-- Wave 26: Adaptive Exam Simulator Quick Launch -->
        <div class="card" style="border-left: 3px solid var(--accent-cyan, #06b6d4);">
          <div class="card-header">
            <h2 class="flex items-center gap-1.5">
              <i data-lucide="timer" class="w-4 h-4 text-cyan-400"></i>
              <span class="lang-en-only">Exam Simulator (Wave 26)</span>
              <span class="lang-ar-only">محاكي الامتحانات التجريبية</span>
            </h2>
            <span class="badge badge-cyan">
              <span class="lang-en-only">ADHD Paced</span>
              <span class="lang-ar-only">فترات راحة ADHD</span>
            </span>
          </div>
          <div style="font-size: 12px; color: var(--muted); margin-bottom: 12px;">
            <span class="lang-en-only">High-fidelity Year 4 mock testing environment with sensory-friendly countdowns and 5m 'Pause & Breathe' pacing breaks.</span>
            <span class="lang-ar-only">بيئة اختبارات تجريبية مطابقة للصف الرابع مع مؤقتات مريحة للحواس واستراحات تنفس كل ٥ دقائق.</span>
          </div>
          <div style="display: grid; gap: 8px;">
            <a href="/exam/exam_y4_sci_term1?student=lara" target="_blank" style="display: flex; justify-content: space-between; align-items: center; background: rgba(6, 182, 212, 0.08); border: 1px solid rgba(6, 182, 212, 0.3); color: var(--text-primary, #f1f5f9); padding: 8px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; text-decoration: none;">
              <span>
                <span class="lang-en-only">🔬 Science Mock: Sound & Matter</span>
                <span class="lang-ar-only">🔬 امتحان علوم تجريبي: الصوت والمادة</span>
              </span>
              <span style="color: var(--cyan); font-family: 'JetBrains Mono', monospace; font-size: 11px;">
                <span class="lang-en-only">15m • Start →</span>
                <span class="lang-ar-only">١٥ دقيقة • ابدأ ←</span>
              </span>
            </a>
            <a href="/exam/exam_y4_math_term1?student=lara" target="_blank" style="display: flex; justify-content: space-between; align-items: center; background: rgba(168, 85, 247, 0.08); border: 1px solid rgba(168, 85, 247, 0.3); color: var(--text-primary, #f1f5f9); padding: 8px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; text-decoration: none;">
              <span>
                <span class="lang-en-only">📐 Maths Mock: Columns & Fractions</span>
                <span class="lang-ar-only">📐 امتحان رياضيات تجريبي: الأعمدة والكسور</span>
              </span>
              <span style="color: var(--purple, #a855f7); font-family: 'JetBrains Mono', monospace; font-size: 11px;">
                <span class="lang-en-only">15m • Start →</span>
                <span class="lang-ar-only">١٥ دقيقة • ابدأ ←</span>
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>`;
}
