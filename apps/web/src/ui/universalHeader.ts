export interface BreadcrumbAction {
  labelEn: string;
  labelAr: string;
  href?: string;
  onClick?: string;
  icon?: string;
  primary?: boolean;
}

export interface UniversalHeaderOptions {
  activePortal?: 'console' | 'teacher' | 'exam' | 'sprint' | 'guide';
  breadcrumb?: {
    returnUrl?: string;
    returnLabelEn?: string;
    returnLabelAr?: string;
    currentEn: string;
    currentAr: string;
    actions?: BreadcrumbAction[];
    badgeTextEn?: string;
    badgeTextAr?: string;
  };
}

export function renderUniversalHeader(options: UniversalHeaderOptions = {}): string {
  const { breadcrumb } = options;
  const returnUrl = breadcrumb?.returnUrl || '/';
  const returnLabelEn = breadcrumb?.returnLabelEn || '← Console';
  const returnLabelAr = breadcrumb?.returnLabelAr || '→ لوحة التحكم';

  return `
  <!-- Universal System-Wide Locked Top Bar -->
  <header class="universal-system-header">
    <div class="logo-group">
      <h1>HEX-AIM <span>Mastery Console</span></h1>
      <div class="sub">
        <span class="lang-en-only">Adaptive Individualized Mastery • Cognitive Gap Remediation & Intake Gate</span>
        <span class="lang-ar-only">التعلم الفردي المتكيف • بوابة استيعاب ومعالجة الفجوات المعرفية</span>
      </div>
    </div>
    <div class="header-badges">
      <div class="badge-tag badge-region">
        <i data-lucide="server" class="inline w-3.5 h-3.5 mr-1"></i> cdg1 (Paris) • fra1
      </div>
      <div class="badge-tag" id="badge-school-meta">
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
          <a href="/school/asten-college?year=Y4" class="portal-dropdown-item">
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
          <a href="/exam/exam_y4_sci_term1?student=lara" class="portal-dropdown-item">
            <span>🔬</span>
            <div>
              <div><span class="lang-en-only">Science Exam Simulator</span><span class="lang-ar-only">امتحان العلوم التجريبي</span></div>
              <div style="font-size: 10px; color: var(--muted);"><span class="lang-en-only">Year 4 • 15m ADHD Paced</span><span class="lang-ar-only">الصف الرابع • فترات راحة ADHD</span></div>
            </div>
          </a>
          <a href="/exam/exam_y4_math_term1?student=lara" class="portal-dropdown-item">
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

      <!-- Theme & Language Group (Standard 32px height) -->
      <div class="toolbar-actions-group">
        <button id="lang-toggle-btn" class="lang-toggle-btn" onclick="toggleLanguage()" title="Switch Language / تبديل اللغة">
          <i data-lucide="globe" class="w-3.5 h-3.5"></i>
          <span id="lang-label">AR</span>
        </button>
        <button id="theme-toggle-btn" class="theme-toggle-btn" onclick="toggleTheme()" title="Toggle Light / Dark Mode">
          <i id="theme-icon" data-lucide="sun" class="w-3.5 h-3.5"></i>
        </button>
      </div>
    </div>
  </header>

  ${breadcrumb ? `
  <!-- Sub-Nav Breadcrumb with Return Button Directly Below Locked Top Bar -->
  <div class="sub-nav-breadcrumb">
    <div class="breadcrumb-container">
      <a href="${returnUrl}" class="breadcrumb-return-btn">
        <span class="lang-en-only">${returnLabelEn}</span>
        <span class="lang-ar-only">${returnLabelAr}</span>
      </a>
      <span class="breadcrumb-sep">/</span>
      <span class="breadcrumb-current">
        <span class="lang-en-only">${breadcrumb.currentEn}</span>
        <span class="lang-ar-only">${breadcrumb.currentAr}</span>
      </span>
      ${breadcrumb.badgeTextEn ? `
        <span class="badge badge-cyan" style="margin-left: 8px; font-size: 10px;">
          <span class="lang-en-only">${breadcrumb.badgeTextEn}</span>
          <span class="lang-ar-only">${breadcrumb.badgeTextAr || breadcrumb.badgeTextEn}</span>
        </span>
      ` : ''}
    </div>
    ${breadcrumb.actions && breadcrumb.actions.length > 0 ? `
    <div class="breadcrumb-actions" style="display: flex; gap: 8px; align-items: center;">
      ${breadcrumb.actions.map(act => `
        <a href="${act.href || '#'}" ${act.onClick ? `onclick="${act.onClick}"` : ''} class="${act.primary ? 'btn-export' : 'breadcrumb-return-btn'}" style="text-decoration: none;">
          ${act.icon ? `<i data-lucide="${act.icon}" class="w-3.5 h-3.5 mr-1 inline"></i>` : ''}
          <span class="lang-en-only">${act.labelEn}</span>
          <span class="lang-ar-only">${act.labelAr}</span>
        </a>
      `).join('')}
    </div>
    ` : ''}
  </div>
  ` : ''}
  `;
}

export function renderUniversalHeaderScripts(): string {
  return `
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
      }
      if (btn) {
        btn.setAttribute('title', isLight ? 'Switch to Dark Mode (🌙)' : 'Switch to Light Mode (☀️)');
      }
      if (window.lucide) lucide.createIcons();
    }

    function toggleTheme() {
      const isCurrentlyLight = document.body.classList.contains('theme-light');
      applyTheme(isCurrentlyLight ? 'dark' : 'light');
    }

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

      // If page has a dynamic student setter (Mastery Console), refresh active student
      if (typeof setStudent === 'function' && typeof currentStudentId !== 'undefined') {
        setStudent(currentStudentId);
      }

      // Tab labels localization if present
      const tab1 = document.querySelector('#tab-btn-mastery .tab-label');
      if (tab1) tab1.innerText = isAr ? '١. مسار الإتقان والتقدم' : 'Student Progress & Mastery';
      const tab2 = document.querySelector('#tab-btn-ledger .tab-label');
      if (tab2) tab2.innerText = isAr ? '٢. سجل الفجوات وخطة التدخل' : 'Cognitive Gap Ledger';
      const tab3 = document.querySelector('#tab-btn-infra .tab-label');
      if (tab3) tab3.innerText = isAr ? '٣. بوابة الاستيعاب والربط التقني' : 'Ingestion Gate & Infrastructure';
      const tab4 = document.querySelector('#tab-btn-submissions .tab-label');
      if (tab4) tab4.innerText = isAr ? '٤. إجابات الطلاب والتقييم التشخيصي' : 'Scanned Submissions (52)';
      const tab5 = document.querySelector('#tab-btn-templates .tab-label');
      if (tab5) tab5.innerText = isAr ? '٥. قوالب التمارين والتدريبات' : 'Blank Templates & Dry-Runs';

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

    // Auto-init on load
    document.addEventListener('DOMContentLoaded', () => {
      const savedTheme = localStorage.getItem('aim_theme') || 'dark';
      applyTheme(savedTheme);
      const savedLang = localStorage.getItem('aim_lang') || 'en';
      applyLanguage(savedLang);
    });
  `;
}
