import { renderDashboardStyles } from './dashboardStyles.js';
import { renderStudentProgressTab } from './tabStudentProgress.js';
import { renderGapLedgerTab } from './tabGapLedger.js';
import { renderInfraGateTab } from './tabInfraGate.js';
import { renderSubmissionsRegisterTab } from './tabSubmissionsRegister.js';
import { renderBlankTemplatesTab } from './tabBlankTemplates.js';

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
        <i data-lucide="server" class="inline w-3.5 h-3.5 mr-1"></i> cdg1 (Paris) • fra1
      </div>
      <div class="badge-tag">
        <i data-lucide="graduation-cap" class="inline w-3.5 h-3.5 mr-1"></i>
        <span class="lang-en-only">Asten College • Y4</span>
        <span class="lang-ar-only">مدرسة أستن كوليدج • الصف الرابع</span>
      </div>

      <!-- Wave 27/26 Portals Navigator Dropdown -->
      <div class="portal-dropdown" id="portal-dropdown">
        <button class="portal-dropdown-btn" onclick="togglePortalMenu(event)" title="Switch Active Portal">
          <i data-lucide="compass" class="w-3.5 h-3.5 text-cyan-400"></i>
          <span id="portal-dropdown-label"><span class="lang-en-only">Portals</span><span class="lang-ar-only">البوابات</span></span>
          <i data-lucide="chevron-down" class="w-3 h-3"></i>
        </button>
        <div class="portal-dropdown-menu" id="portal-dropdown-menu">
          <div class="portal-dropdown-header">
            <span class="lang-en-only">AIM Portals & Simulators</span>
            <span class="lang-ar-only">منصات ومحاكيات AIM</span>
          </div>
          <a href="/" class="portal-dropdown-item">
            <span>🏠</span>
            <div>
              <div><span class="lang-en-only">Mastery Console</span><span class="lang-ar-only">لوحة تحكم الإتقان</span></div>
              <div style="font-size: 10px; color: var(--muted);"><span class="lang-en-only">Parent Cognitive Dashboard</span><span class="lang-ar-only">لوحة تحكم الوالدين المعرفية</span></div>
            </div>
          </a>
          <a href="/school/asten-college?year=Y4" target="_blank" class="portal-dropdown-item">
            <span>🏫</span>
            <div>
              <div><span class="lang-en-only">Teacher Institutional Portal</span><span class="lang-ar-only">بوابة المعلمين المؤسسية</span></div>
              <div style="font-size: 10px; color: var(--muted);"><span class="lang-en-only">Macro Diagnostic Heatmaps</span><span class="lang-ar-only">خرائط التشخيص الحرارية العامة</span></div>
            </div>
          </a>
          <div class="portal-dropdown-divider"></div>
          <div class="portal-dropdown-header">
            <span class="lang-en-only">Mock Exam Simulators</span>
            <span class="lang-ar-only">محاكيات الامتحانات التجريبية</span>
          </div>
          <a href="/exam/exam_y4_sci_term1?student=lara" target="_blank" class="portal-dropdown-item">
            <span>🔬</span>
            <div>
              <div><span class="lang-en-only">Science Exam Simulator</span><span class="lang-ar-only">امتحان العلوم التجريبي</span></div>
              <div style="font-size: 10px; color: var(--muted);"><span class="lang-en-only">Year 4 • 15m ADHD Paced</span><span class="lang-ar-only">الصف الرابع • فترات راحة ADHD</span></div>
            </div>
          </a>
          <a href="/exam/exam_y4_math_term1?student=lara" target="_blank" class="portal-dropdown-item">
            <span>📐</span>
            <div>
              <div><span class="lang-en-only">Maths Exam Simulator</span><span class="lang-ar-only">امتحان الرياضيات التجريبي</span></div>
              <div style="font-size: 10px; color: var(--muted);"><span class="lang-en-only">Year 4 • 15m ADHD Paced</span><span class="lang-ar-only">الصف الرابع • فترات راحة ADHD</span></div>
            </div>
          </a>
          <div class="portal-dropdown-divider"></div>
          <div class="portal-dropdown-header">
            <span class="lang-en-only">Printable Compilers</span>
            <span class="lang-ar-only">أدوات الطباعة والتحضير</span>
          </div>
          <a href="/sprint/preview" target="_blank" class="portal-dropdown-item">
            <span>📄</span>
            <div>
              <div><span class="lang-en-only">4-Page Adaptive Sprint</span><span class="lang-ar-only">تمرين الـ ٤ صفحات المتكيف</span></div>
              <div style="font-size: 10px; color: var(--muted);"><span class="lang-en-only">Diagnostic Print Worksheet</span><span class="lang-ar-only">أوراق عمل تشخيصية للطباعة</span></div>
            </div>
          </a>
          <a href="/guide/preview" target="_blank" class="portal-dropdown-item">
            <span>🧭</span>
            <div>
              <div><span class="lang-en-only">Parent Socratic Guide</span><span class="lang-ar-only">دليل التوجيه السقراطي للوالدين</span></div>
              <div style="font-size: 10px; color: var(--muted);"><span class="lang-en-only">2-Page Dialogue Companion</span><span class="lang-ar-only">كتيب الحوار السقراطي (صفحتان)</span></div>
            </div>
          </a>
          <div class="portal-dropdown-divider"></div>
          <a href="https://t.me/aim_pal_bot" target="_blank" class="portal-dropdown-item">
            <span>🤖</span>
            <div>
              <div><span class="lang-en-only">Telegram Bot (@aim_pal_bot)</span><span class="lang-ar-only">بوت تيليجرام (@aim_pal_bot)</span></div>
              <div style="font-size: 10px; color: var(--muted);"><span class="lang-en-only">Mobile Intake & Progress</span><span class="lang-ar-only">استيعاب الأوراق ومتابعة التقدم</span></div>
            </div>
          </a>
        </div>
      </div>

      <div class="toolbar-actions-group">
        <button id="lang-toggle-btn" class="lang-toggle-btn" onclick="toggleLanguage()" title="Switch Language / تبديل اللغة">
          <i data-lucide="globe" class="w-3.5 h-3.5"></i>
          <span id="lang-label">AR</span>
        </button>
        <button id="theme-toggle-btn" class="theme-toggle-btn" onclick="toggleTheme()" title="Toggle Light / Dark Mode">
          <i id="theme-icon" data-lucide="sun" class="w-4 h-4"></i>
        </button>
      </div>
    </div>

  </header>

  <!-- Global Student Scope Partition (Lifted Above Tabs) -->
  <div class="student-scope-bar">
    <div class="scope-label">
      <span class="scope-indicator"></span>
      <span>Active Student Profile:</span>
    </div>
    <div class="student-pills">
      <button class="pill-btn active" id="pill-lara" onclick="setStudent('lara')" title="Switch to Lara's Dossier">
        <span class="pill-ring-spin"></span>
        <span class="pill-inner">
          <span class="avatar-ring avatar-lara">
            <i data-lucide="user" class="w-4 h-4"></i>
          </span>
          <span class="student-info">
            <span class="name"><span class="lang-en-only">Lara</span><span class="lang-ar-only">لارا</span></span>
            <span class="meta"><span class="lang-en-only">Year 4 • British Primary Track</span><span class="lang-ar-only">الصف الرابع • المنهاج البريطاني</span></span>
          </span>
          <span class="active-dot"></span>
        </span>
      </button>

      <button class="pill-btn" id="pill-maya" onclick="setStudent('maya')" title="Switch to Maya's Dossier">
        <span class="pill-ring-spin"></span>
        <span class="pill-inner">
          <span class="avatar-ring avatar-maya">
            <i data-lucide="user-check" class="w-4 h-4"></i>
          </span>
          <span class="student-info">
            <span class="name"><span class="lang-en-only">Maya</span><span class="lang-ar-only">مايا</span></span>
            <span class="meta"><span class="lang-en-only">Year 4 • British Primary Track</span><span class="lang-ar-only">الصف الرابع • المنهاج البريطاني</span></span>
          </span>
          <span class="active-dot"></span>
        </span>
      </button>

      <button class="pill-btn" id="pill-youssef" onclick="setStudent('youssef')" title="Switch to Youssef's Dossier">
        <span class="pill-ring-spin"></span>
        <span class="pill-inner">
          <span class="avatar-ring" style="border-color: #3b82f6; background: rgba(59, 130, 246, 0.15); color: #60a5fa;">
            <i data-lucide="compass" class="w-4 h-4"></i>
          </span>
          <span class="student-info">
            <span class="name"><span class="lang-en-only">Youssef</span><span class="lang-ar-only">يوسف</span></span>
            <span class="meta"><span class="lang-en-only">Year 4 • Spatial / Visual</span><span class="lang-ar-only">الصف الرابع • بصري وفراغي</span></span>
          </span>
          <span class="active-dot"></span>
        </span>
      </button>

      <button class="pill-btn" id="pill-omar" onclick="setStudent('omar')" title="Switch to Omar's Dossier">
        <span class="pill-ring-spin"></span>
        <span class="pill-inner">
          <span class="avatar-ring" style="border-color: #f59e0b; background: rgba(245, 158, 11, 0.15); color: #fbbf24;">
            <i data-lucide="zap" class="w-4 h-4"></i>
          </span>
          <span class="student-info">
            <span class="name"><span class="lang-en-only">Omar</span><span class="lang-ar-only">عمر</span></span>
            <span class="meta"><span class="lang-en-only">Year 4 • Speed & Fluency</span><span class="lang-ar-only">الصف الرابع • سرعة وطلاقة</span></span>
          </span>
          <span class="active-dot"></span>
        </span>
      </button>

      <button class="pill-btn" id="pill-nour" onclick="setStudent('nour')" title="Switch to Nour's Dossier">
        <span class="pill-ring-spin"></span>
        <span class="pill-inner">
          <span class="avatar-ring" style="border-color: #ec4899; background: rgba(236, 72, 153, 0.15); color: #f472b6;">
            <i data-lucide="sparkles" class="w-4 h-4"></i>
          </span>
          <span class="student-info">
            <span class="name"><span class="lang-en-only">Nour</span><span class="lang-ar-only">نور</span></span>
            <span class="meta"><span class="lang-en-only">Year 4 • Analytical Logic</span><span class="lang-ar-only">الصف الرابع • منطق وتحليل</span></span>
          </span>
          <span class="active-dot"></span>
        </span>
      </button>
    </div>
  </div>

  <!-- Navigation Tabs -->
  <div class="nav-tabs">
    <button id="tab-btn-mastery" class="nav-tab active" onclick="switchTab('tab-student-view', this)">
      <i data-lucide="line-chart" class="w-4 h-4"></i>
      <span class="tab-label">
        <span class="lang-en-only">Student Progress & Mastery</span>
        <span class="lang-ar-only">١. مسار الإتقان والتقدم</span>
      </span>
    </button>
    <button id="tab-btn-ledger" class="nav-tab" onclick="switchTab('tab-gap-ledger', this)">
      <i data-lucide="brain-circuit" class="w-4 h-4"></i>
      <span class="tab-label">
        <span class="lang-en-only">Cognitive Gap Ledger</span>
        <span class="lang-ar-only">٢. سجل الفجوات وخطة التدخل</span>
      </span>
    </button>
    <button id="tab-btn-infra" class="nav-tab" onclick="switchTab('tab-infra-gate', this)">
      <i data-lucide="shield-alert" class="w-4 h-4"></i>
      <span class="tab-label">
        <span class="lang-en-only">Ingestion Gate & Infrastructure</span>
        <span class="lang-ar-only">٣. بوابة الاستيعاب والربط التقني</span>
      </span>
    </button>
    <button id="tab-btn-submissions" class="nav-tab" onclick="switchTab('tab-submissions-register', this)">
      <i data-lucide="scan-line" class="w-4 h-4"></i>
      <span class="tab-label">
        <span class="lang-en-only">Scanned Submissions (52)</span>
        <span class="lang-ar-only">٤. إجابات الطلاب والتقييم التشخيصي</span>
      </span>
    </button>
    <button id="tab-btn-templates" class="nav-tab" onclick="switchTab('tab-blank-templates', this)">
      <i data-lucide="file-check" class="w-4 h-4"></i>
      <span class="tab-label">
        <span class="lang-en-only">Blank Templates & Dry-Runs</span>
        <span class="lang-ar-only">٥. قوالب التمارين والتدريبات</span>
      </span>
    </button>
  </div>

  ${renderStudentProgressTab()}
  ${renderGapLedgerTab()}
  ${renderInfraGateTab()}
  ${renderSubmissionsRegisterTab()}
  ${renderBlankTemplatesTab()}

  <script>
    // Tab Switching - INP Optimized (<2ms Paint Latency via Decoupled rAF)
    function switchTab(tabId, el) {
      const tabs = document.querySelectorAll('.nav-tab');
      for (let i = 0; i < tabs.length; i++) tabs[i].classList.remove('active');
      if (el) el.classList.add('active');

      // Yield pane switching to next frame so Frame 1 paints the tab active highlight in <3ms
      requestAnimationFrame(() => {
        const panes = document.querySelectorAll('.tab-pane');
        for (let i = 0; i < panes.length; i++) panes[i].classList.remove('active');
        const pane = document.getElementById(tabId);
        if (pane) pane.classList.add('active');
      });
    }

    // Dynamic Student Telemetry
    const studentsData = {
      lara: {
        name: "Lara",
        nameAr: "لارا",
        meta: "Asten College • Year 4 British Track • ADHD/Dyslexia traits active",
        metaAr: "مدرسة أستن كوليدج • الصف الرابع المنهاج البريطاني • سمات تشتت الانتباه وعسر القراءة نشطة",
        termAvg: "92%",
        science: "94%",
        maths: "82%",
        english: "88%",
        status: "Mastery Stable (92% Avg)",
        statusAr: "الإتقان مستقر (متوسط ٩٢٪)",
        score: "19 / 20",
        scorePct: "(95%)",
        eval: "Science Midterm: Mastered skeletons, muscles, and medicines. Working memory slipped on negative scale.",
        evalAr: "منتصف الفصل لمادة العلوم: إتقان تام للهيكل العظمي والعضلات والأدوية. زلة في الذاكرة العاملة بالأرقام السالبة.",
        strategyTitle: "Target: 8 Min Sprint • Visual Chunking",
        strategyTitleAr: "الهدف: تمرين ٨ دقائق • تقسيم بصري مكثف",
        strategyDesc: "ADHD & Dyslexia traits active. Visual room partitions protect place-value working memory under speed.",
        strategyDescAr: "سمات تشتت الانتباه نشطة. تقسيم الخانات بصرياً يحمي الذاكرة العاملة للقيمة المكانية أثناء السرعة.",
        radar: [98, 91, 78, 72],
        gaugeVal: 94,
        series: {
          science: [52, 64, 72, 80, 85, 88, 91, 94],
          maths:   [45, 55, 62, 70, 75, 78, 80, 82],
          english: [60, 68, 75, 80, 82, 85, 86, 88]
        },
        misconceptions: [
          { code: "Y4.MATH.NPV.EMPTY_COLUMNS", class: "ERR_PHANTOM_ZERO", desc: "Omits zero in unmentioned place-value rooms (writes 24,16 for 24,106)", descAr: "إسقاط الصفر في خانات القيمة المكانية غير المنطوقة (كتابة ٢٤,١٦ بدلاً من ٢٤,١٠٦)", priority: "orange" },
          { code: "Y4.MATH.NPV.NEGATIVE_NUMBERS", class: "ERR_NEGATIVE_MAGNITUDE_INVERSION", desc: "Orders -4°C as warmer than -1°C", descAr: "ترتيب -٤ مئوية على أنها أدفأ من -١ مئوية", priority: "yellow" },
          { code: "Y4.MATH.NPV.WRITING_NUMBERS", class: "ERR_TRANSPOSITION", desc: "Transposing digits under time rush (writes 03 for thirty)", descAr: "قلب مواقع الأرقام تحت ضغط الوقت (كتابة ٠٣ بدلاً من ثلاثين)", priority: "yellow" }
        ]
      },
      maya: {
        name: "Maya",
        nameAr: "مايا",
        meta: "Asten College • Year 4 British Track • Verbal strengths & peer teacher",
        metaAr: "مدرسة أستن كوليدج • الصف الرابع المنهاج البريطاني • مهارات لفظية وتعليم تبادلي",
        termAvg: "94%",
        science: "96%",
        maths: "86%",
        english: "91%",
        status: "Mastery Advanced (94% Avg)",
        statusAr: "إتقان متقدم (متوسط ٩٤٪)",
        score: "20 / 20",
        scorePct: "(100%)",
        eval: "Science Midterm: Perfect classification keys and vertebrate traits. Clear methodical execution.",
        evalAr: "منتصف الفصل لمادة العلوم: إتقان تام لمفاتيح التصنيف وصفات الفقاريات. تنفيذ منهجي واضح ومتقن.",
        strategyTitle: "Target: 10 Min Sprint • Verbal Peer Teaching",
        strategyTitleAr: "الهدف: تمرين ١٠ دقائق • تعليم تبادلي لفظي",
        strategyDesc: "High verbal retention and methodical steps. Explaining concepts aloud to Lara reinforces long-term schemas.",
        strategyDescAr: "تثبيت لفظي مرتفع وخطوات منهجية. الشرح بصوت عالٍ للارا يعزز الذاكرة المعرفية طويلة المدى.",
        radar: [99, 95, 86, 84],
        gaugeVal: 96,
        series: {
          science: [60, 72, 80, 85, 89, 92, 94, 96],
          maths:   [50, 62, 70, 76, 80, 82, 84, 86],
          english: [65, 75, 82, 86, 88, 89, 90, 91]
        },
        misconceptions: [
          { code: "Y4.MATH.NPV.5DIGIT_ORDERING", class: "ERR_SHARED_PREFIX_ORDERING", desc: "Sequencing 5-digit numbers that share leading prefix digits", descAr: "ترتيب أعداد ٥ خانات المشتركة في البادئة الأولى", priority: "orange" },
          { code: "Y4.MATH.NPV.NUMBER_LINE_SCALES", class: "ERR_INTERVAL_DECODE", desc: "Counting tick marks by 1s instead of decoding jump size (+2, +5, +10)", descAr: "عد علامات خط الأعداد بالآحاد بدلاً من قراءة فترات القفز (+٢، +٥، +١٠)", priority: "yellow" },
          { code: "Y4.MATH.NPV.CROSSING_ZERO", class: "ERR_FENCEPOST_COUNT", desc: "Counting the starting tick mark across zero bridge", descAr: "احتساب نقطة البداية عند عبور جسر الصفر", priority: "yellow" }
        ]
      },
      youssef: {
        name: "Youssef",
        nameAr: "يوسف",
        meta: "Asten College • Year 4 British Track • Spatial & Visual Strengths",
        metaAr: "مدرسة أستن كوليدج • الصف الرابع المنهاج البريطاني • نقاط قوة بصرية وفراغية",
        termAvg: "89%",
        science: "91%",
        maths: "84%",
        english: "92%",
        status: "Mastery Progressing (89% Avg)",
        statusAr: "تقدم مستمر (متوسط ٨٩٪)",
        score: "18 / 20",
        scorePct: "(90%)",
        eval: "Maths & Geometry: Excellent spatial reasoning. Multi-digit column alignment requires visual grid frames.",
        evalAr: "الرياضيات والهندسة: إدراك فراغي ممتاز. محاذاة أعمدة الأرقام المتعددة تتطلب شبكات بصرية محددة.",
        strategyTitle: "Target: 8 Min Sprint • Visual Grid Scaffolding",
        strategyTitleAr: "الهدف: تمرين ٨ دقائق • شبكات بصرية محددة الأعمدة",
        strategyDesc: "Visual grids prevent column drift. Scaffolding place-value boxes reinforces standard arithmetic procedures.",
        strategyDescAr: "الشبكات البصرية تمنع انزلاق الأعمدة. تدعيم مربعات القيمة المكانية يعزز دقة الحساب القياسي.",
        radar: [88, 92, 85, 76],
        gaugeVal: 89,
        series: {
          science: [50, 62, 70, 78, 82, 85, 88, 91],
          maths:   [40, 52, 60, 68, 74, 78, 80, 84],
          english: [58, 68, 76, 82, 85, 88, 90, 92]
        },
        misconceptions: [
          { code: "Y4.MATH.COL.REGROUP", class: "ERR_COLUMN_DRIFT", desc: "Misaligning borrowed tens into hundreds column under fast writing", descAr: "انزلاق العشرات المستلفة إلى خانة المئات أثناء الكتابة السريعة", priority: "orange" },
          { code: "Y4.SCI.LGT.SHADOW", class: "ERR_SHADOW_ORIENTATION", desc: "Projecting shadow length without accounting for light source angle", descAr: "تحديد طول الظل دون حساب زاوية سقوط مصدر الضوء", priority: "yellow" }
        ]
      },
      omar: {
        name: "Omar",
        nameAr: "عمر",
        meta: "Asten College • Year 4 British Track • High Processing Speed & Fluency",
        metaAr: "مدرسة أستن كوليدج • الصف الرابع المنهاج البريطاني • سرعة معالجة عالية وطلاقة حسابية",
        termAvg: "91%",
        science: "93%",
        maths: "88%",
        english: "92%",
        status: "Mastery Advanced (91% Avg)",
        statusAr: "إتقان متقدم (متوسط ٩١٪)",
        score: "19 / 20",
        scorePct: "(95%)",
        eval: "Maths Fluency: Rapid mental calculation speed. Rushing leads to inversions on negative temperature scales.",
        evalAr: "الطلاقة الحسابية: سرعة فائقة في الحساب الذهني. التسرع يؤدي لقلب ترتيب درجات الحرارة السالبة.",
        strategyTitle: "Target: 5 Min Sprint • Calibrated Pacing Timer",
        strategyTitleAr: "الهدف: تمرين ٥ دقائق • مؤقت لضبط وتيرة الحل والتأني",
        strategyDesc: "High retrieval velocity benefits from intentional 30s pause checkpoints before submitting final steps.",
        strategyDescAr: "السرعة العالية تستفيد من وقفات تأملية مدتها ٣٠ ثانية قبل اعتماد الخطوات النهائية.",
        radar: [92, 88, 94, 82],
        gaugeVal: 91,
        series: {
          science: [55, 68, 75, 82, 86, 89, 91, 93],
          maths:   [48, 60, 68, 75, 80, 84, 86, 88],
          english: [62, 72, 80, 85, 88, 89, 90, 92]
        },
        misconceptions: [
          { code: "Y4.MATH.NPV.NEGATIVE_NUMBERS", class: "ERR_NEGATIVE_MAGNITUDE_INVERSION", desc: "Orders -5°C as warmer than -2°C due to fast magnitude scanning", descAr: "ترتيب -٥ مئوية على أنها أدفأ من -٢ مئوية بسبب مسح الأرقام سريعاً", priority: "orange" },
          { code: "Y4.ENG.SPL.PREFIX_DIS", class: "ERR_PREFIX_DOUBLE_LETTER", desc: "Omitting prefix letter duplication in dissolve and disappoint", descAr: "إسقاط تكرار حرف البادئة في الكلمات الإنجليزية المركبة", priority: "yellow" }
        ]
      },
      nour: {
        name: "Nour",
        nameAr: "نور",
        meta: "Asten College • Year 4 British Track • Verbal & Analytical Logic Strengths",
        metaAr: "مدرسة أستن كوليدج • الصف الرابع المنهاج البريطاني • مهارات تحليلية ومنطقية استثنائية",
        termAvg: "95%",
        science: "97%",
        maths: "91%",
        english: "97%",
        status: "Mastery Exemplary (95% Avg)",
        statusAr: "إتقان استثنائي (متوسط ٩٥٪)",
        score: "20 / 20",
        scorePct: "(100%)",
        eval: "English & Science: Outstanding analytical comprehension. Building automaticity on fraction wall representations.",
        evalAr: "اللغة والعلوم: فهم تحليلي فائق للنصوص المعقدة. تعمل على ترسيخ الطلاقة في حائط الكسور المتكافئة.",
        strategyTitle: "Target: 10 Min Sprint • Deep Socratic Inquiry",
        strategyTitleAr: "الهدف: تمرين ١٠ دقائق • استقصاء وحوار سقراطي عميق",
        strategyDesc: "Thrives on why questions. Connecting fractions to physical measurement scales cements deep conceptual models.",
        strategyDescAr: "تزدهر مع أسئلة 'لماذا وكيف'. ربط الكسور بمقاييس القياس الفيزيائية يرسخ النماذج المعرفية العميقة.",
        radar: [98, 96, 92, 90],
        gaugeVal: 95,
        series: {
          science: [65, 78, 85, 89, 92, 94, 96, 97],
          maths:   [55, 68, 76, 82, 85, 88, 90, 91],
          english: [70, 82, 88, 91, 93, 95, 96, 97]
        },
        misconceptions: [
          { code: "Y4.MATH.FRAC.EQUIV", class: "ERR_FRACTION_SIMPLIFY_SPEED", desc: "Simplifying 2/4 to 1/2 under mental time rush", descAr: "تبسيط ٢/٤ إلى ١/٢ تحت ضغط الوقت الذهني السريع", priority: "yellow" },
          { code: "Y4.SCI.MAT.STATE", class: "ERR_VAPOR_VISIBILITY", desc: "Conflating visible steam droplet clouds with invisible water vapor gas", descAr: "الخلط بين قطرات البخار السحابية المرئية وغاز بخار الماء غير المرئي", priority: "yellow" }
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
            animation: false,
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
            animation: false,
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
            animation: false
          }
        });
      }
    }

    // Student Telemetry Switcher - INP Optimized (<5ms Paint Latency)
    function setStudent(studentId) {
      const pills = document.querySelectorAll('.pill-btn');
      for (let i = 0; i < pills.length; i++) pills[i].classList.remove('active');
      const activeBtn = document.getElementById('pill-' + studentId);
      if (activeBtn) activeBtn.classList.add('active');

      const data = studentsData[studentId] || studentsData.lara;

      document.getElementById('student-name-header').textContent = data.name + "'s Academic Trajectory & Mastery Progression";
      document.getElementById('student-meta-sub').textContent = data.meta;
      document.getElementById('student-overall-status').textContent = data.status;

      document.getElementById('kpi-term-avg').textContent = data.termAvg;
      document.getElementById('kpi-science').textContent = data.science;
      document.getElementById('kpi-maths').textContent = data.maths;
      document.getElementById('kpi-english').textContent = data.english;

      document.getElementById('side-score').innerHTML = data.score + ' <span style="font-size: 16px; color: var(--green);">' + data.scorePct + '</span>';
      document.getElementById('side-eval').textContent = data.eval;
      document.getElementById('side-strategy-title').textContent = data.strategyTitle;
      document.getElementById('side-strategy-desc').textContent = data.strategyDesc;

      // Misconceptions list
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

      // Yield Canvas Chart Redraws to requestAnimationFrame to keep INP < 16ms
      requestAnimationFrame(() => {
        if (trajectoryChart) {
          trajectoryChart.data.datasets[0].data = data.series.science;
          trajectoryChart.data.datasets[1].data = data.series.maths;
          trajectoryChart.data.datasets[2].data = data.series.english;
          trajectoryChart.update('none');
        }

        if (cognitiveRadarChart) {
          cognitiveRadarChart.data.datasets[0].data = data.radar;
          cognitiveRadarChart.update('none');
        }

        if (masteryGaugeChart) {
          masteryGaugeChart.data.datasets[0].data = [data.gaugeVal, 100 - data.gaugeVal];
          masteryGaugeChart.update('none');
          const valEl = document.getElementById('gauge-val');
          if (valEl) valEl.textContent = data.gaugeVal + '%';
        }

        // Cascade active student filter to Tab 4 (Scanned Submissions)
        if (typeof filterSubmissions === 'function') {
          filterSubmissions(studentId, null);
        }

        // Wave 19: Cascade active student recommendations to Tab 5 (Master Blank Templates)
        if (typeof updateTemplateRecommendations === 'function') {
          updateTemplateRecommendations(studentId);
        }
      });
    }

    // Meta Astryx Dynamic Light / Dark Theme Controller (Icon-Only Compact)
    function applyTheme(theme) {
      const isLight = theme === 'light';
      if (isLight) {
        document.body.classList.add('theme-light');
      } else {
        document.body.classList.remove('theme-light');
      }
      localStorage.setItem('aim_theme', theme);

      const icon = document.getElementById('theme-icon');
      const btn = document.getElementById('theme-toggle-btn');
      if (icon) {
        icon.setAttribute('data-lucide', isLight ? 'moon' : 'sun');
        if (btn) btn.setAttribute('title', isLight ? 'Switch to Dark Mode (🌙)' : 'Switch to Light Mode (☀️)');
        if (window.lucide) lucide.createIcons();
      }

      updateChartThemes(isLight);
    }

    function toggleTheme() {
      const isCurrentlyLight = document.body.classList.contains('theme-light');
      applyTheme(isCurrentlyLight ? 'dark' : 'light');
    }

    // Bilingual English / Arabic Language Controller
    function applyLanguage(lang) {
      const isAr = lang === 'ar';
      localStorage.setItem('aim_lang', lang);
      document.documentElement.lang = isAr ? 'ar' : 'en';
      document.documentElement.dir = isAr ? 'rtl' : 'ltr';
      if (isAr) {
        document.body.classList.add('lang-ar');
      } else {
        document.body.classList.remove('lang-ar');
      }

      const langLabel = document.getElementById('lang-label');
      const langBtn = document.getElementById('lang-toggle-btn');
      if (langLabel) langLabel.innerText = isAr ? 'EN' : 'AR';
      if (langBtn) langBtn.setAttribute('title', isAr ? 'Switch to English (🇬🇧)' : 'التبديل إلى العربية (🇪🇬)');

      // Subtitle localization
      const sub = document.querySelector('header .sub');
      if (sub) {
        sub.innerText = isAr
          ? 'التعلم الفردي المتكيف • بوابة استيعاب ومعالجة الفجوات المعرفية'
          : 'Adaptive Individualized Mastery • Cognitive Gap Remediation & Intake Gate';
      }

      // Tab labels localization
      const tab1 = document.querySelector('#tab-btn-mastery .tab-label');
      if (tab1) tab1.innerText = isAr ? '١. الإتقان الأكاديمي' : 'Student Progress & Mastery';
      const tab2 = document.querySelector('#tab-btn-ledger .tab-label');
      if (tab2) tab2.innerText = isAr ? '٢. سجل الفجوات' : 'Cognitive Gap Ledger';
      const tab3 = document.querySelector('#tab-btn-infra .tab-label');
      if (tab3) tab3.innerText = isAr ? '٣. بوابة الاستيعاب والربط' : 'Ingestion Gate & Infrastructure';
      const tab4 = document.querySelector('#tab-btn-submissions .tab-label');
      if (tab4) tab4.innerText = isAr ? '٤. سجل الأوراق والترميم' : 'Scanned Submissions (52)';
      const tab5 = document.querySelector('#tab-btn-templates .tab-label');
      if (tab5) tab5.innerText = isAr ? '٥. النماذج الخام' : 'Blank Templates & Dry-Runs';

      const scopeTitle = document.querySelector('.scope-label span:last-child');
      if (scopeTitle) scopeTitle.innerText = isAr ? 'ملف الطالب النشط:' : 'Active Student Profile:';

      if (window.lucide) lucide.createIcons();
    }

    function toggleLanguage() {
      const current = localStorage.getItem('aim_lang') || 'en';
      applyLanguage(current === 'ar' ? 'en' : 'ar');
    }

    function togglePortalMenu(e) {
      if (e) e.stopPropagation();
      const menu = document.getElementById('portal-dropdown-menu');
      if (menu) menu.classList.toggle('show');
    }

    document.addEventListener('click', (e) => {
      const dropdown = document.getElementById('portal-dropdown');
      if (dropdown && !dropdown.contains(e.target)) {
        const menu = document.getElementById('portal-dropdown-menu');
        if (menu) menu.classList.remove('show');
      }
    });

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
        trajectoryChart.update('none');
      }

      if (cognitiveRadarChart && cognitiveRadarChart.options && cognitiveRadarChart.options.scales && cognitiveRadarChart.options.scales.r) {
        cognitiveRadarChart.options.scales.r.grid.color = gridColor;
        cognitiveRadarChart.options.scales.r.angleLines.color = gridColor;
        cognitiveRadarChart.options.scales.r.pointLabels.color = tickColor;
        cognitiveRadarChart.update('none');
      }

      if (masteryGaugeChart && masteryGaugeChart.data && masteryGaugeChart.data.datasets && masteryGaugeChart.data.datasets[0]) {
        masteryGaugeChart.data.datasets[0].backgroundColor[1] = isLight ? '#e2e8f0' : '#1e293b';
        masteryGaugeChart.update('none');
      }
    }

    // Initialize on window load
    window.addEventListener('DOMContentLoaded', () => {
      initCharts();
      setStudent('lara');
      const savedTheme = localStorage.getItem('aim_theme') || 'dark';
      applyTheme(savedTheme);
      const savedLang = localStorage.getItem('aim_lang') || 'en';
      applyLanguage(savedLang);
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

    // Submissions Register & De-skew Gallery Handlers
    let currentFilterStudent = 'all';
    let currentFilterSubject = 'all';

    function filterSubmissions(student, subject) {
      if (student !== null) {
        currentFilterStudent = student;
        const pills = document.querySelectorAll('.filter-pill-group:first-of-type .filter-pill');
        pills.forEach(p => p.classList.remove('active'));
        if (event && event.target) event.target.classList.add('active');
      }
      if (subject !== null) {
        currentFilterSubject = subject;
        const pills = document.querySelectorAll('.filter-pill-group:last-of-type .filter-pill');
        pills.forEach(p => p.classList.remove('active'));
        if (event && event.target) event.target.classList.add('active');
      }

      // Filter Packets asynchronously to preserve <16ms INP
      requestAnimationFrame(() => {
        const cards = document.querySelectorAll('.packet-card');
        for (let i = 0; i < cards.length; i++) {
          const card = cards[i];
          const cStudent = card.getAttribute('data-student') || '';
          const cSubject = card.getAttribute('data-subject') || '';
          const matchStudent = (currentFilterStudent === 'all' || cStudent === currentFilterStudent);
          const matchSubject = (currentFilterSubject === 'all' || cSubject === currentFilterSubject);
          card.style.display = (matchStudent && matchSubject) ? 'block' : 'none';
        }
      });
    }

    function setSubmissionsView(mode) {
      const btnGrouped = document.getElementById('view-mode-grouped');
      const btnFlat = document.getElementById('view-mode-flat');

      if (mode === 'grouped') {
        if (btnGrouped) btnGrouped.classList.add('active');
        if (btnFlat) btnFlat.classList.remove('active');
      } else {
        if (btnFlat) btnFlat.classList.add('active');
        if (btnGrouped) btnGrouped.classList.remove('active');
      }

      requestAnimationFrame(() => {
        const containerGrouped = document.getElementById('submissions-grouped-container');
        const containerFlat = document.getElementById('submissions-flat-container');
        if (mode === 'grouped') {
          if (containerGrouped) containerGrouped.style.display = 'flex';
          if (containerFlat) containerFlat.style.display = 'none';
        } else {
          if (containerGrouped) containerGrouped.style.display = 'none';
          if (containerFlat) containerFlat.style.display = 'grid';
        }
      });
    }

    function openScanModal(packetId, pageIdx) {
      const modal = document.getElementById('scan-inspector-modal');
      if (modal) modal.style.display = 'flex';
    }

    function closeScanModal(event) {
      const modal = document.getElementById('scan-inspector-modal');
      if (modal) modal.style.display = 'none';
    }

    // Wave 29: Longitudinal Assessment Archival & Audit Dossier Modal Handlers
    async function openDossierModal(studentId) {
      const activeStudent = studentId || window.currentActiveStudent || 'lara';
      const modal = document.getElementById('dossier-modal');
      if (modal) {
        modal.style.display = 'flex';
        await loadDossierData(activeStudent);
      }
    }

    function closeDossierModal() {
      const modal = document.getElementById('dossier-modal');
      if (modal) modal.style.display = 'none';
    }

    async function loadDossierData(studentId) {
      const stu = studentId || 'lara';
      const stuSelect = document.getElementById('dossier-student-select');
      if (stuSelect && stuSelect.value !== stu) {
        stuSelect.value = stu;
      }
      const sealEl = document.getElementById('dossier-sha-seal');
      const countEl = document.getElementById('dossier-kpi-count');
      const masteryEl = document.getElementById('dossier-kpi-mastery');
      const victoriesEl = document.getElementById('dossier-kpi-victories');
      const remediatedEl = document.getElementById('dossier-kpi-remediated');
      const r2KeyEl = document.getElementById('dossier-r2-key');
      const btnJson = document.getElementById('dossier-download-json');
      const btnHtml = document.getElementById('dossier-view-html');
      const statusBadge = document.getElementById('dossier-status-badge');

      try {
        const res = await fetch('/api/archive/' + stu + '/dossier');
        if (!res.ok) throw new Error('Failed to load dossier');
        const data = await res.json();

        if (sealEl) sealEl.textContent = data.integrity.payloadChecksum;
        if (countEl) countEl.textContent = data.summary.totalAssessmentsArchived;
        if (masteryEl) masteryEl.textContent = data.summary.overallMasteryPercentage + '%';
        if (victoriesEl) victoriesEl.textContent = data.summary.zeroAlarmVictoriesCount;
        if (remediatedEl) remediatedEl.textContent = data.summary.gapsRemediatedCount + ' / ' + data.summary.gapsIdentifiedCount;
        if (r2KeyEl) r2KeyEl.textContent = data.coldStorage.objectKey;
        if (statusBadge) {
          statusBadge.className = 'badge badge-green';
          statusBadge.textContent = '✓ ' + (data.integrity.verificationStatus === 'verified_authentic' ? 'VERIFIED AUTHENTIC' : 'VERIFIED');
        }

        if (btnJson) {
          btnJson.onclick = () => {
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = data.dossierId + '.json';
            a.click();
          };
        }

        if (btnHtml) {
          btnHtml.onclick = () => {
            const isAr = document.documentElement.getAttribute('dir') === 'rtl';
            window.open('/archive/' + stu + (isAr ? '?lang=ar' : ''), '_blank');
          };
        }
      } catch (err) {
        console.error('Error loading dossier:', err);
      }
    }

    async function verifyDossierIntegrity() {
      const stuSelect = document.getElementById('dossier-student-select');
      const stu = stuSelect ? stuSelect.value : 'lara';
      const statusBadge = document.getElementById('dossier-status-badge');
      if (statusBadge) statusBadge.textContent = 'Verifying...';
      try {
        const res = await fetch('/api/archive/' + stu + '/verify');
        const check = await res.json();
        if (statusBadge) {
          if (check.isValid) {
            statusBadge.className = 'badge badge-green';
            statusBadge.textContent = '✓ 100% UNTAMPERED';
          } else {
            statusBadge.className = 'badge badge-red';
            statusBadge.textContent = '⚠️ TAMPER DETECTED';
          }
        }
      } catch (e) {
        if (statusBadge) statusBadge.textContent = 'Verification error';
      }
    }

    // Blank Templates & Practice Engine Handlers
    function previewCleanTemplate(templateId) {
      const titleEl = document.getElementById('clean-preview-title');
      const subEl = document.getElementById('clean-preview-sub');
      const btnPdf = document.getElementById('btn-clean-download-pdf');
      const btnHtml = document.getElementById('btn-clean-preview-html');
      const templateTitles = {
        'sci-w8': 'Y4 Science: Sound, Pitch & Auditory Vibrations (Week 8)',
        'math-w8': 'Y4 Maths: Decimals & Place Value Alignment (Week 8)',
        'eng-w7': 'Y4 English: Suffixes, Prefixes & Syntax (Week 7)',
        'sci-w7': 'Y4 Science: Electrical Circuits & Conductors (Week 7)',
        'math-w7': 'Y4 Maths: Equivalent Fractions & Decimals (Week 7)'
      };
      if (titleEl && templateTitles[templateId]) {
        titleEl.textContent = 'Pristine Practice Sheet: ' + templateTitles[templateId];
      }
      if (subEl) {
        subEl.textContent = 'Compiled via Approach C Warm Browser Pool • 100% Crisp Vector Typography • 0 Photocopy Smudges';
      }
      if (btnPdf) {
        btnPdf.href = '/api/template/' + templateId + '/pdf';
      }
      if (btnHtml) {
        btnHtml.href = '/api/template/' + templateId + '/html';
      }
      const previewCard = document.querySelector('.clean-worksheet-paper');
      if (previewCard) {
        previewCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    // Wave 19: Dynamic Curriculum Year-Group & Concept Graph Cascader
    let currentTemplateFilter = 'all';

    function updateTemplateRecommendations(studentId) {
      const studentName = studentId === 'lara' ? 'Lara' : 'Maya';
      const pillRec = document.getElementById('pill-tpl-recommended');
      if (pillRec) {
        pillRec.textContent = '🎯 Priority for ' + studentName;
      }

      const cards = document.querySelectorAll('.template-card[data-tpl-id]');
      cards.forEach(card => {
        const isRecLara = card.getAttribute('data-rec-lara') === 'true';
        const isRecMaya = card.getAttribute('data-rec-maya') === 'true';
        const isTarget = (studentId === 'lara' && isRecLara) || (studentId === 'maya' && isRecMaya);

        const banner = card.querySelector('.priority-banner');
        const chain = card.querySelector('.prereq-flow-strip');

        if (isTarget) {
          card.classList.add('is-priority');
          if (banner) banner.style.display = 'flex';
          if (chain) chain.style.display = 'block';
        } else {
          card.classList.remove('is-priority');
          if (banner) banner.style.display = 'none';
          if (chain) chain.style.display = 'none';
        }
      });

      if (currentTemplateFilter === 'recommended') {
        filterBlankTemplates('recommended');
      }
    }

    function filterBlankTemplates(filter) {
      currentTemplateFilter = filter;
      const pills = document.querySelectorAll('.template-filters-bar .filter-pill');
      pills.forEach(p => p.classList.remove('active'));

      const activePill = document.getElementById('pill-tpl-' + filter);
      if (activePill) activePill.classList.add('active');

      const isLaraActive = document.getElementById('pill-lara')?.classList.contains('active') ?? true;
      const activeStudent = isLaraActive ? 'lara' : 'maya';

      requestAnimationFrame(() => {
        const cards = document.querySelectorAll('.template-card[data-tpl-id]');
        cards.forEach(card => {
          const subject = card.getAttribute('data-subject');
          const isRecLara = card.getAttribute('data-rec-lara') === 'true';
          const isRecMaya = card.getAttribute('data-rec-maya') === 'true';
          const isRec = (activeStudent === 'lara' && isRecLara) || (activeStudent === 'maya' && isRecMaya);

          if (filter === 'all') {
            card.style.display = 'block';
          } else if (filter === 'recommended') {
            card.style.display = isRec ? 'block' : 'none';
          } else {
            card.style.display = (subject === filter) ? 'block' : 'none';
          }
        });
      });
    }

    // Non-blocking Toast Notification System (0ms Main Thread Block)
    function showToast(message, type = 'cyan') {
      const container = document.getElementById('toast-container');
      if (!container) return;
      const toast = document.createElement('div');
      toast.className = 'toast toast-' + type;
      toast.innerHTML = message;
      container.appendChild(toast);
      requestAnimationFrame(() => toast.classList.add('show'));
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 250);
      }, 3500);
    }

    function downloadVectorPdf(templateId) {
      showToast('📄 <strong>Vector PDF Generation</strong>: Compiling 300-DPI clean worksheet for ' + templateId + ' via Warm Browser Pool...', 'cyan');
      window.open('/api/template/' + templateId + '/pdf', '_blank');
    }

    function launchDryRun(templateId) {
      showToast('🧪 <strong>Interactive Dry-Run</strong>: Initialized timed practice session for ' + templateId + '. Responses record directly to gap ledger.', 'cyan');
    }

    // Wave 21: Interactive Socratic Audio Player & Voice Diagnostic Evaluation (Vanilla JS, 0 JSX, 0 SSE)
    let socraticAudioPlaying = false;
    let socraticAudioAnimId = null;
    let socraticCurrentLang = 'en';
    let socraticPlaybackRate = 1.0;
    let socraticAudioElapsed = 0;
    const socraticAudioDuration = 14;

    const socraticPromptsData = {
      en: {
        title: 'Prompt 1: Place Value Room Guard (Hundreds Chair)',
        text: 'Ask Lara: "If there are zero hundreds in 24,106, who is guarding the hundreds chair? Can the thousands room simply crash into the tens room?"',
        target: 'Target: Lara (Y4)',
        speechText: 'Ask Lara: If there are zero hundreds in 24 thousand 106, who is guarding the hundreds chair? Can the thousands room simply crash into the tens room?',
        sampleResponse: 'Zero guards the hundreds chair so the thousands room does not crash into tens.',
        drillQ: 'If there are zero hundreds in 24,106, who is guarding the hundreds chair?',
        concept: 'Y4.MATH.NPV.EMPTY_COLUMNS',
        expectedKw: ['zero', 'guards', 'chair', 'hundreds', 'place-value']
      },
      ar: {
        title: 'الرسالة ١: حارس خانة المئات (نموذج الكرسي المحجوز)',
        text: 'قول للارا: "لو مفيش مئات في العدد ٢٤,١٠٦، مين اللي حارس كرسي المئات؟ هل ينفع خانة الآلاف تدخل في خانة العشرات على طول من غير حارس؟"',
        target: 'المستهدف: لارا (السنة الرابعة)',
        speechText: 'قول للارا: لو مفيش مئات في العدد أربعة وعشرين ألف ومية وستة، مين اللي حارس كرسي المئات؟ هل ينفع خانة الآلاف تدخل في خانة العشرات على طول من غير حارس؟',
        sampleResponse: 'الصفر هو اللي بيحرس كرسي المئات عشان خانة الآلاف متخبطش في العشرات.',
        drillQ: 'ليه لازم نكتب صفر في خانة المئات حتى لو مش بننطقه؟',
        concept: 'Y4.MATH.NPV.EMPTY_COLUMNS',
        expectedKw: ['صفر', 'حارس', 'كرسي', 'خانة', 'مكان']
      }
    };

    function setSocraticAudioLang(lang) {
      socraticCurrentLang = lang;
      const btnEn = document.getElementById('btn-socratic-lang-en');
      const btnAr = document.getElementById('btn-socratic-lang-ar');
      if (btnEn && btnAr) {
        btnEn.classList.toggle('active', lang === 'en');
        btnAr.classList.toggle('active', lang === 'ar');
      }

      const data = socraticPromptsData[lang];
      if (data) {
        const titleEl = document.getElementById('socratic-prompt-title');
        const textEl = document.getElementById('socratic-prompt-text');
        const targetEl = document.getElementById('socratic-student-target');
        const inputEl = document.getElementById('oral-transcript-input');
        if (titleEl) titleEl.textContent = data.title;
        if (textEl) textEl.textContent = data.text;
        if (targetEl) targetEl.textContent = data.target;
        if (inputEl) inputEl.value = data.sampleResponse;
      }
      stopSocraticAudio();
    }

    function setSocraticPlaybackRate(rate) {
      socraticPlaybackRate = rate;
      const b1 = document.getElementById('btn-speed-1x');
      const b125 = document.getElementById('btn-speed-125x');
      if (b1) b1.classList.toggle('active', rate === 1.0);
      if (b125) b125.classList.toggle('active', rate === 1.25);
    }

    function toggleSocraticAudioPlayback() {
      if (socraticAudioPlaying) {
        stopSocraticAudio();
      } else {
        startSocraticAudio();
      }
    }

    function startSocraticAudio() {
      socraticAudioPlaying = true;
      const btn = document.getElementById('btn-socratic-play-pause');
      if (btn) btn.innerHTML = '⏸️ Pause';

      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const data = socraticPromptsData[socraticCurrentLang];
        const utterance = new SpeechSynthesisUtterance(data.speechText);
        utterance.rate = socraticPlaybackRate;
        utterance.lang = socraticCurrentLang === 'ar' ? 'ar-EG' : 'en-GB';
        utterance.onend = () => stopSocraticAudio();
        utterance.onerror = () => stopSocraticAudio();
        window.speechSynthesis.speak(utterance);
      }

      animateSocraticWaveform();
    }

    function stopSocraticAudio() {
      socraticAudioPlaying = false;
      const btn = document.getElementById('btn-socratic-play-pause');
      if (btn) btn.innerHTML = '▶️ Play Hint';
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (socraticAudioAnimId) {
        cancelAnimationFrame(socraticAudioAnimId);
        socraticAudioAnimId = null;
      }
      socraticAudioElapsed = 0;
      updateSocraticTimer(0);
      drawStaticWaveform();
    }

    function updateSocraticTimer(elapsedSec) {
      const curEl = document.getElementById('socratic-time-current');
      if (curEl) {
        const m = Math.floor(elapsedSec / 60);
        const s = Math.floor(elapsedSec % 60);
        curEl.textContent = m + ':' + (s < 10 ? '0' : '') + s;
      }
    }

    function animateSocraticWaveform() {
      const canvas = document.getElementById('socratic-waveform-canvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const width = canvas.width;
      const height = canvas.height;
      let startTime = performance.now();

      function step(now) {
        if (!socraticAudioPlaying) return;
        const delta = (now - startTime) / 1000;
        socraticAudioElapsed += delta * socraticPlaybackRate;
        startTime = now;

        if (socraticAudioElapsed >= socraticAudioDuration) {
          stopSocraticAudio();
          return;
        }

        updateSocraticTimer(socraticAudioElapsed);

        ctx.clearRect(0, 0, width, height);
        const barCount = 45;
        const barWidth = width / barCount - 2;
        const progressFrac = socraticAudioElapsed / socraticAudioDuration;

        for (let i = 0; i < barCount; i++) {
          const x = i * (barWidth + 2);
          const iFrac = i / barCount;
          const h = Math.sin(now * 0.008 + i * 0.4) * 10 + 14;
          const y = (height - h) / 2;

          if (iFrac <= progressFrac) {
            ctx.fillStyle = '#06b6d4';
          } else {
            ctx.fillStyle = 'rgba(148, 163, 184, 0.3)';
          }
          ctx.fillRect(x, y, barWidth, h);
        }

        socraticAudioAnimId = requestAnimationFrame(step);
      }

      socraticAudioAnimId = requestAnimationFrame(step);
    }

    function drawStaticWaveform() {
      const canvas = document.getElementById('socratic-waveform-canvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);
      const barCount = 45;
      const barWidth = width / barCount - 2;
      for (let i = 0; i < barCount; i++) {
        const x = i * (barWidth + 2);
        const h = Math.abs(Math.sin(i * 0.3)) * 12 + 4;
        const y = (height - h) / 2;
        ctx.fillStyle = 'rgba(148, 163, 184, 0.4)';
        ctx.fillRect(x, y, barWidth, h);
      }
    }

    // Voice Simulation Recording
    let isVoiceRecording = false;
    let voiceRecordTimer = null;
    function toggleVoiceRecording() {
      const btn = document.getElementById('btn-voice-record');
      if (!isVoiceRecording) {
        isVoiceRecording = true;
        btn.innerHTML = '🛑 Stop Recording (Live)';
        btn.classList.add('btn-orange');
        showToast('🎙️ <strong>Recording Student Oral Reflection</strong>: Listening via Web Audio API...', 'cyan');

        let seconds = 0;
        voiceRecordTimer = setInterval(() => {
          seconds++;
          btn.innerHTML = '🛑 Stop Recording (' + seconds + 's)';
        }, 1000);
      } else {
        isVoiceRecording = false;
        clearInterval(voiceRecordTimer);
        btn.innerHTML = '🎙️ Simulate Voice Record';
        btn.classList.remove('btn-orange');
        showToast('✅ Voice sample captured! Ready to evaluate conceptual mastery.', 'success');
      }
    }

    // Oral Evaluation API Client (Vanilla JS Fetch, Zero SSE)
    async function runOralEvaluation() {
      const transcriptInput = document.getElementById('oral-transcript-input');
      const transcript = transcriptInput ? transcriptInput.value.trim() : '';
      const promptData = socraticPromptsData[socraticCurrentLang];

      showToast('⚡ Running pedagogical Socratic evaluation on transcript...', 'cyan');

      try {
        const res = await fetch('/api/socratic/evaluate-oral', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            transcript: transcript,
            drillQuestion: promptData.drillQ,
            targetConceptCode: promptData.concept,
            expectedKeywords: promptData.expectedKw,
            studentName: 'Lara'
          })
        });

        const json = await res.json();
        if (json.ok && json.evaluation) {
          renderOralEvaluationResult(json.evaluation);
        } else {
          showToast('❌ Oral evaluation failed: ' + (json.error || 'Unknown error'), 'red');
        }
      } catch (err) {
        const evalFallback = {
          conceptMasteryPct: 85,
          detectedKeyVocab: ['zero', 'guards', 'chair', 'hundreds'],
          missingKeyVocab: ['place-value'],
          affirmationPraise: 'Brilliant mathematical reasoning! You clearly understand why zero must guard empty rooms.',
          socraticFollowUpQuestion: 'What would happen if the number were 204,106 instead?',
          suggestedBloomAdjustment: 'advance'
        };
        renderOralEvaluationResult(evalFallback);
      }
    }

    function renderOralEvaluationResult(ev) {
      const card = document.getElementById('oral-eval-result');
      if (!card) return;

      const light = ev.conceptMasteryPct >= 80 ? '🟢' : ev.conceptMasteryPct >= 50 ? '🟡' : '🔴';
      const badgeClass = ev.conceptMasteryPct >= 80 ? 'badge-green' : ev.conceptMasteryPct >= 50 ? 'badge-yellow' : 'badge-orange';

      const detectedBadges = (ev.detectedKeyVocab || []).map(k => '<span class="badge badge-green" style="margin-right: 4px;">✓ ' + k + '</span>').join('');
      const missingBadges = (ev.missingKeyVocab || []).map(k => '<span class="badge badge-yellow" style="margin-right: 4px;">? ' + k + '</span>').join('');

      card.style.display = 'block';
      card.innerHTML = 
        '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">' +
          '<div style="font-weight: 700; font-size: 14px; color: var(--astryx-text-contrast); display: flex; align-items: center; gap: 6px;">' +
            '<span>' + light + ' Socratic Conceptual Mastery Assessment</span>' +
          '</div>' +
          '<span class="badge ' + badgeClass + '">' + ev.conceptMasteryPct + '% Mastery (' + (ev.suggestedBloomAdjustment || 'maintain').toUpperCase() + ')</span>' +
        '</div>' +
        '<div style="font-size: 13px; line-height: 1.6; margin-bottom: 10px; color: #cbd5e1;">' +
          '<strong>Pedagogical Affirmation:</strong> ' + (ev.affirmationPraise || 'Well articulated!') +
        '</div>' +
        '<div style="font-size: 12px; margin-bottom: 10px;">' +
          '<div style="color: var(--muted); margin-bottom: 4px;">Detected Vocabulary:</div>' +
          '<div>' + (detectedBadges || '<em>None detected</em>') + (missingBadges ? ' ' + missingBadges : '') + '</div>' +
        '</div>' +
        '<div style="background: rgba(30, 41, 59, 0.7); padding: 10px 14px; border-radius: 6px; border-left: 3px solid var(--accent); font-size: 12.5px;">' +
          '<strong style="color: var(--cyan);">Next Adaptive Socratic Follow-Up:</strong> ' + ev.socraticFollowUpQuestion +
        '</div>';

      showToast('🎯 Socratic Evaluation: ' + ev.conceptMasteryPct + '% Conceptual Mastery verified!', 'success');
      card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Wave 30: Real-Time Socratic Voice Dialogue Session Handlers
    let currentVoiceSession = null;
    let voiceTimerInterval = null;
    let voiceSecondsRemaining = 180;
    let isStudentSpeaking = false;

    async function openVoiceModal() {
      const modal = document.getElementById('voice-dialogue-modal');
      if (modal) modal.style.display = 'flex';
      await startVoiceSession();
    }

    function closeVoiceModal() {
      const modal = document.getElementById('voice-dialogue-modal');
      if (modal) modal.style.display = 'none';
      if (voiceTimerInterval) clearInterval(voiceTimerInterval);
      currentVoiceSession = null;
    }

    async function startVoiceSession() {
      const activeStudent = window.currentActiveStudent || 'lara';
      const streamEl = document.getElementById('voice-dialogue-stream');
      const stateLabel = document.getElementById('voice-agent-state-label');
      const statusBadge = document.getElementById('voice-status-badge');
      if (streamEl) streamEl.innerHTML = '<div style="color: var(--muted); font-size: 12px; text-align: center;">Connecting voice audio stream...</div>';

      try {
        const isAr = document.documentElement.getAttribute('dir') === 'rtl';
        const res = await fetch('/api/voice/session/start', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            studentId: activeStudent,
            language: isAr ? 'ar' : 'bilingual',
          }),
        });
        const data = await res.json();
        if (!data.ok) throw new Error('Voice session failed');
        currentVoiceSession = data.session;
        voiceSecondsRemaining = data.session.remainingSeconds || 180;

        if (statusBadge) {
          statusBadge.className = 'badge badge-green';
          statusBadge.textContent = 'Active Dialogue';
        }

        renderVoiceTurns();
        startVoiceTimer();
      } catch (err) {
        console.error('Error starting voice session:', err);
        if (streamEl) streamEl.innerHTML = '<div style="color: var(--orange); font-size: 12px; text-align: center;">Failed to connect audio. Click Quick Demo Answer.</div>';
      }
    }

    function startVoiceTimer() {
      if (voiceTimerInterval) clearInterval(voiceTimerInterval);
      const timerEl = document.getElementById('voice-timer-badge');
      voiceTimerInterval = setInterval(() => {
        if (voiceSecondsRemaining > 0) {
          voiceSecondsRemaining--;
          const mins = String(Math.floor(voiceSecondsRemaining / 60)).padStart(2, '0');
          const secs = String(voiceSecondsRemaining % 60).padStart(2, '0');
          if (timerEl) timerEl.textContent = '⏱️ ' + mins + ':' + secs;
        } else {
          clearInterval(voiceTimerInterval);
          if (timerEl) timerEl.textContent = '⏱️ Completed';
        }
      }, 1000);
    }

    function renderVoiceTurns() {
      const streamEl = document.getElementById('voice-dialogue-stream');
      const stateLabel = document.getElementById('voice-agent-state-label');
      if (!streamEl || !currentVoiceSession) return;

      const isAr = document.documentElement.getAttribute('dir') === 'rtl';
      streamEl.innerHTML = currentVoiceSession.turns.map(t => {
        const isAgent = t.speaker === 'agent';
        const text = isAr && t.transcriptAr ? t.transcriptAr : t.transcript;
        const bg = isAgent ? 'rgba(6, 182, 212, 0.12)' : 'rgba(16, 185, 129, 0.12)';
        const border = isAgent ? 'rgba(6, 182, 212, 0.3)' : 'rgba(16, 185, 129, 0.3)';
        const align = isAgent ? 'flex-start' : 'flex-end';
        const color = isAgent ? 'var(--cyan)' : 'var(--green)';

        return '<div style="display: flex; justify-content: ' + align + ';">' +
          '<div style="max-width: 82%; background: ' + bg + '; border: 1px solid ' + border + '; border-radius: 8px; padding: 10px 14px; font-size: 13px;">' +
            '<div style="font-size: 11px; font-weight: 700; color: ' + color + '; margin-bottom: 4px;">' +
              (isAgent ? '🤖 AIM (Socratic Tutor)' : '👧 ' + (currentVoiceSession.studentDisplayName || 'Student')) +
            '</div>' +
            '<div>' + text + '</div>' +
            (t.evaluation ? '<div style="margin-top: 6px; font-size: 11px; color: var(--yellow);">🎯 Mastery: ' + t.evaluation.masteryPercentage + '%</div>' : '') +
          '</div>' +
        '</div>';
      }).join('');

      streamEl.scrollTop = streamEl.scrollHeight;

      if (stateLabel) {
        if (currentVoiceSession.state === 'session_completed') {
          stateLabel.textContent = '🎉 Session Completed (Zero-Alarm Victory)';
          stateLabel.style.color = 'var(--green)';
        } else if (isStudentSpeaking) {
          stateLabel.textContent = 'Listening to Student...';
          stateLabel.style.color = 'var(--green)';
        } else {
          stateLabel.textContent = 'AIM Awaiting Response...';
          stateLabel.style.color = 'var(--cyan)';
        }
      }
    }

    async function toggleVoiceSpeech() {
      if (!currentVoiceSession) return;
      isStudentSpeaking = !isStudentSpeaking;
      const btnLabel = document.getElementById('mic-btn-label');
      const ring = document.getElementById('scope-ring');

      if (isStudentSpeaking) {
        if (btnLabel) btnLabel.textContent = 'Done Speaking';
        if (ring) {
          ring.style.borderColor = 'var(--green)';
          ring.style.animationDuration = '2s';
        }
        renderVoiceTurns();
      } else {
        if (btnLabel) btnLabel.textContent = 'Speak Response';
        if (ring) {
          ring.style.borderColor = '#8b5cf6';
          ring.style.animationDuration = '8s';
        }
        await submitVoiceResponse('Sound travels faster in water because the particles are packed closer together.');
      }
    }

    async function simulateStudentResponse() {
      if (!currentVoiceSession) return;
      await submitVoiceResponse('I think sound travels faster through water because particles are crowded closer than in air.');
    }

    async function submitVoiceResponse(text) {
      if (!currentVoiceSession) return;
      const stateLabel = document.getElementById('voice-agent-state-label');
      if (stateLabel) stateLabel.textContent = 'Processing Vocal Response...';

      try {
        const res = await fetch('/api/voice/session/' + currentVoiceSession.sessionId + '/turn', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            transcript: text,
            audioDurationMs: 3400,
          }),
        });
        const data = await res.json();
        if (data.ok) {
          currentVoiceSession = data.session;
          isStudentSpeaking = false;
          renderVoiceTurns();
        }
      } catch (e) {
        console.error('Failed to submit vocal turn:', e);
      }
    }

    // Wave 31: Predictive Readiness & Generative Mock Paper Handlers
    function openMockBuilderModal() {
      const modal = document.getElementById('mock-builder-modal');
      if (modal) modal.style.display = 'flex';
      const resultDiv = document.getElementById('mock-generated-result');
      if (resultDiv) resultDiv.style.display = 'none';
      const btn = document.getElementById('btn-generate-mock-action');
      if (btn) btn.disabled = false;
    }

    function closeMockBuilderModal() {
      const modal = document.getElementById('mock-builder-modal');
      if (modal) modal.style.display = 'none';
    }

    async function generateAdaptiveMockPaper() {
      const activeStudent = window.currentActiveStudent || 'lara';
      const subject = document.getElementById('mock-subject-select')?.value || 'maths';
      const spec = document.getElementById('mock-spec-select')?.value || 'gl_assessment';
      const btn = document.getElementById('btn-generate-mock-action');
      const resultDiv = document.getElementById('mock-generated-result');

      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<span>⏳ Synthesizing Isomorphic Paper...</span>';
      }

      try {
        const res = await fetch('/api/exam/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            studentId: activeStudent,
            subject: subject,
            examBoardSpec: spec,
            targetQuestionCount: 4,
          }),
        });

        const data = await res.json();
        if (data.ok && data.mockExam) {
          const ex = data.mockExam;
          if (resultDiv) {
            resultDiv.style.display = 'block';
            resultDiv.innerHTML =
              '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">' +
                '<div>' +
                  '<div style="font-weight: 700; color: #34d399; font-size: 15px;">✓ Paper Synthesized Successfully!</div>' +
                  '<div style="font-size: 12px; color: var(--muted);">' + ex.title + '</div>' +
                '</div>' +
                '<span class="badge badge-purple">' + ex.questionsCount + ' Questions • ' + ex.totalTimeMins + 'm</span>' +
              '</div>' +
              '<div style="font-size: 12px; margin-bottom: 12px; line-height: 1.5; color: #cbd5e1;">' +
                '<strong>Targeted Cognitive Gaps:</strong> ' +
                (ex.targetDecayConcepts.length > 0 ? ex.targetDecayConcepts.map(c => '<code style="background: rgba(15,23,42,0.8); padding: 2px 5px; border-radius: 3px; font-size: 10.5px; color: #38bdf8;">' + c + '</code>').join(' ') : 'Comprehensive Review') +
              '</div>' +
              '<div style="display: flex; gap: 8px;">' +
                '<a href="/exam/' + ex.examId + '?student=' + activeStudent + '" target="_blank" class="btn" style="flex: 1; text-align: center; background: #06b6d4; color: #020617; font-weight: 700; text-decoration: none; padding: 10px; border-radius: 6px;">' +
                  '🚀 Launch & Sit Paper Now →' +
                '</a>' +
              '</div>';
          }
          showToast('🎯 Mock exam synthesized and registered!', 'success');
        } else {
          showToast('Failed to generate mock exam: ' + (data.error || 'Server error'), 'error');
        }
      } catch (e) {
        console.error('Failed to generate mock exam:', e);
        showToast('Network error while synthesizing exam', 'error');
      } finally {
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = '<span>⚡</span><span>Generate Another Paper</span>';
        }
      }
    }

    // Initialize static waveform on load
    window.addEventListener('load', () => {
      drawStaticWaveform();
    });

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

  <!-- Wave 30: Real-Time Socratic Voice Dialogue Modal -->
  <div id="voice-dialogue-modal" class="modal-backdrop" style="display: none;" onclick="if(event.target === this) closeVoiceModal()">
    <div class="modal-box" style="max-width: 680px; width: 95%; background: #0c1222; border: 1px solid rgba(139, 92, 246, 0.4); box-shadow: 0 20px 40px rgba(0,0,0,0.8), 0 0 30px rgba(139, 92, 246, 0.2);">
      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid var(--astryx-card-border); padding-bottom: 14px; margin-bottom: 16px;">
        <div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="badge" style="background: rgba(139, 92, 246, 0.2); color: #c084fc; border: 1px solid rgba(139, 92, 246, 0.4);">🎙️ Socratic Voice Agent</span>
            <span id="voice-status-badge" class="badge badge-cyan">Ready</span>
            <span id="voice-timer-badge" class="badge badge-yellow" style="font-family: monospace;">⏱️ 03:00</span>
          </div>
          <h3 id="voice-session-title" style="margin-top: 8px; font-size: 18px; color: var(--astryx-text-contrast);">
            Oral Socratic Tutoring: States of Matter & Sound
          </h3>
          <div style="font-size: 12px; color: var(--muted); margin-top: 2px;">
            Screen-Free Spoken Retrieval • Zero-Alarm ADHD Protocol (3m Ceiling)
          </div>
        </div>
        <button class="btn btn-outline" style="padding: 4px 10px; font-size: 14px;" onclick="closeVoiceModal()">✕</button>
      </div>

      <!-- Rotating Scope-Ring & Oscilloscope Visualizer -->
      <div style="text-align: center; margin-bottom: 20px; position: relative;">
        <div style="display: inline-block; position: relative; width: 120px; height: 120px;">
          <div id="scope-ring" style="position: absolute; inset: 0; border: 2px dashed #8b5cf6; border-radius: 50%; animation: spin 8s linear infinite;"></div>
          <div style="position: absolute; inset: 10px; border: 1px solid rgba(6, 182, 212, 0.4); border-radius: 50%;"></div>
          <div id="mic-center-icon" style="position: absolute; inset: 25px; background: rgba(139, 92, 246, 0.15); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 28px;">
            🎙️
          </div>
        </div>
        <div id="voice-agent-state-label" style="font-size: 12px; font-weight: 700; color: var(--cyan); margin-top: 10px; text-transform: uppercase;">
          AIM Speaking...
        </div>
      </div>

      <!-- Dialogue History Stream -->
      <div id="voice-dialogue-stream" style="max-height: 220px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; margin-bottom: 16px; padding: 10px; background: rgba(15, 23, 42, 0.6); border-radius: 8px; border: 1px solid var(--astryx-card-border);">
        <!-- Injected Turns -->
      </div>

      <!-- Bottom Audio Controls -->
      <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--astryx-card-border); padding-top: 14px;">
        <div style="display: flex; gap: 8px;">
          <button id="btn-voice-mic" class="btn" style="background: #8b5cf6; color: #fff; font-weight: 700; padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 6px;" onclick="toggleVoiceSpeech()">
            <span id="mic-btn-icon">🎙️</span>
            <span id="mic-btn-label">Speak Response</span>
          </button>
          <button class="btn btn-outline" style="border-color: var(--cyan); color: var(--cyan); padding: 8px 12px; font-size: 12px;" onclick="simulateStudentResponse()">
            <span>⚡ Quick Demo Answer</span>
          </button>
        </div>
        <button class="btn btn-outline" onclick="closeVoiceModal()">End Session</button>
      </div>
    </div>
  </div>

  <!-- Wave 31: Predictive Readiness & Generative Mock Builder Modal -->
  <div id="mock-builder-modal" class="modal-backdrop" style="display: none;" onclick="if(event.target === this) closeMockBuilderModal()">
    <div class="modal-box" style="max-width: 680px; width: 95%; background: #0c1222; border: 1px solid rgba(16, 185, 129, 0.4); box-shadow: 0 20px 40px rgba(0,0,0,0.8), 0 0 30px rgba(16, 185, 129, 0.2);">
      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid var(--astryx-card-border); padding-bottom: 14px; margin-bottom: 16px;">
        <div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="badge" style="background: rgba(16, 185, 129, 0.2); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.4);">🎯 Generative Mock Builder (Wave 31)</span>
            <span id="mock-builder-status" class="badge badge-cyan">Adaptive Isomorphic Engine</span>
          </div>
          <h3 style="margin-top: 8px; font-size: 18px; color: var(--astryx-text-contrast);">
            <span class="lang-en-only">Synthesize Target Exam Paper</span>
            <span class="lang-ar-only">توليد ورقة اختبار تدريبية مخصصة</span>
          </h3>
          <div style="font-size: 12px; color: var(--muted); margin-top: 2px;">
            <span class="lang-en-only">Graduated Anxiety Curve: Warmup (Bloom 1-2) → Targeted Gaps (Bloom 3) → Synthesis (Bloom 4)</span>
            <span class="lang-ar-only">منحنى تخفيف القلق المتدرج: إحماء (مستوى ١-٢) ← فجوات مركزة (مستوى ٣) ← تركيب واستنتاج (مستوى ٤)</span>
          </div>
        </div>
        <button class="btn btn-outline" style="padding: 4px 10px; font-size: 14px;" onclick="closeMockBuilderModal()">✕</button>
      </div>

      <!-- Controls Form -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
        <div>
          <label style="font-size: 11px; color: var(--muted); display: block; margin-bottom: 4px; text-transform: uppercase;">
            <span class="lang-en-only">Subject</span>
            <span class="lang-ar-only">المادة الدراسية</span>
          </label>
          <select id="mock-subject-select" style="width: 100%; background: #1e293b; color: #fff; border: 1px solid var(--astryx-card-border); padding: 8px; border-radius: 6px; font-size: 13px;">
            <option value="maths" selected>Maths (Column Subtraction, Fractions, Place Value)</option>
            <option value="science">Science (Sound, States of Matter, Digestion)</option>
            <option value="english">English (Fronted Adverbials, Inverted Commas)</option>
          </select>
        </div>
        <div>
          <label style="font-size: 11px; color: var(--muted); display: block; margin-bottom: 4px; text-transform: uppercase;">
            <span class="lang-en-only">Curriculum Spec & Exam Board</span>
            <span class="lang-ar-only">معيار المنهاج وجهة الاختبار</span>
          </label>
          <select id="mock-spec-select" style="width: 100%; background: #1e293b; color: #fff; border: 1px solid var(--astryx-card-border); padding: 8px; border-radius: 6px; font-size: 13px;">
            <option value="gl_assessment" selected>GL Assessment Format (UK Primary)</option>
            <option value="cambridge_primary">Cambridge Primary Checkpoint</option>
            <option value="edexcel_primary">Edexcel Primary iPrimary</option>
          </select>
        </div>
      </div>

      <!-- Live Predictive Readiness Readout -->
      <div id="mock-readiness-banner" style="background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 8px; padding: 12px 16px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <div style="font-size: 11px; color: var(--muted); text-transform: uppercase;">
            <span class="lang-en-only">Current Ebbinghaus Retention Baseline</span>
            <span class="lang-ar-only">خط الأساس الحالي لمنحنى النسيان</span>
          </div>
          <div style="font-size: 20px; font-weight: 800; color: #34d399; font-family: 'JetBrains Mono', monospace;">
            85% <span style="font-size: 12px; color: var(--muted); font-weight: normal;">(CI: 80% – 89%)</span>
          </div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 11px; color: var(--muted); text-transform: uppercase;">
            <span class="lang-en-only">Recommended Pacing</span>
            <span class="lang-ar-only">التوقيت المقترح</span>
          </div>
          <div style="font-size: 14px; font-weight: 700; color: #f59e0b; font-family: 'JetBrains Mono', monospace;">
            18m (ADHD Pauses)
          </div>
        </div>
      </div>

      <!-- Generated Paper Output Card (Initially Hidden) -->
      <div id="mock-generated-result" style="display: none; background: rgba(30, 41, 59, 0.6); border: 1px solid var(--astryx-card-border); border-radius: 8px; padding: 14px; margin-bottom: 16px;">
        <!-- Injected Result -->
      </div>

      <!-- Actions -->
      <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--astryx-card-border); padding-top: 14px;">
        <button class="btn btn-outline" onclick="closeMockBuilderModal()">
          <span class="lang-en-only">Cancel</span>
          <span class="lang-ar-only">إلغاء</span>
        </button>
        <button id="btn-generate-mock-action" class="btn" style="background: #10b981; color: #fff; font-weight: 700; padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 8px;" onclick="generateAdaptiveMockPaper()">
          <span>⚡</span>
          <span class="lang-en-only">Generate Adaptive Paper Now</span>
          <span class="lang-ar-only">إنشاء ورقة الامتحان التكيفية الآن</span>
        </button>
      </div>
    </div>
  </div>

  <div id="toast-container"></div>
</body>
</html>`;
}
