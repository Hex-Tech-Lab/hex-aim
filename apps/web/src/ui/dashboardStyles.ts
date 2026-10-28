export function renderDashboardStyles(): string {
  return `<style>
  /* Meta Astryx Centralized Design Tokens (Theme: Neutral Dark - Default) */
  :root {
    --astryx-bg: #090d16;
    --astryx-surface: #111827;
    --astryx-surface-elevated: #1e293b;
    --astryx-border: #1f2937;
    --astryx-border-subtle: #334155;
    --astryx-primary: #06b6d4;
    --astryx-accent: #3b82f6;
    --astryx-text: #f3f4f6;
    --astryx-text-contrast: #ffffff;
    --astryx-text-muted: #9ca3af;
    --astryx-success: #10b981;
    --astryx-warning: #f59e0b;
    --astryx-priority: #f97316;
    --astryx-purple: #a855f7;
    --astryx-danger: #ef4444;

    /* Astryx Elevation & Radii */
    --astryx-radius-sm: 6px;
    --astryx-radius-md: 8px;
    --astryx-radius-lg: 12px;
    --astryx-radius-full: 9999px;
    --astryx-shadow-card: 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -2px rgba(0, 0, 0, 0.3);
    --astryx-shadow-glow: 0 0 15px rgba(6, 182, 212, 0.25);

    /* Token Aliases */
    --bg: var(--astryx-bg);
    --card: var(--astryx-surface);
    --card-border: var(--astryx-border);
    --card-elevated: var(--astryx-surface-elevated);
    --cyan: var(--astryx-primary);
    --accent: var(--astryx-accent);
    --text: var(--astryx-text);
    --muted: var(--astryx-text-muted);
    --green: var(--astryx-success);
    --yellow: var(--astryx-warning);
    --orange: var(--astryx-priority);
    --purple: var(--astryx-purple);
    --red: var(--astryx-danger);
  }

  /* Meta Astryx Centralized Design Tokens (Theme: Neutral Light) */
  body.theme-light {
    --astryx-bg: #f8fafc;
    --astryx-surface: #ffffff;
    --astryx-surface-elevated: #f1f5f9;
    --astryx-border: #e2e8f0;
    --astryx-border-subtle: #cbd5e1;
    --astryx-primary: #0891b2;
    --astryx-accent: #2563eb;
    --astryx-text: #0f172a;
    --astryx-text-contrast: #0f172a;
    --astryx-text-muted: #64748b;
    --astryx-success: #059669;
    --astryx-warning: #d97706;
    --astryx-priority: #ea580c;
    --astryx-purple: #9333ea;
    --astryx-danger: #dc2626;

    --astryx-shadow-card: 0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px -1px rgba(0, 0, 0, 0.05);
    --astryx-shadow-glow: 0 4px 14px 0 rgba(8, 145, 178, 0.15);

    --bg: var(--astryx-bg);
    --card: var(--astryx-surface);
    --card-border: var(--astryx-border);
    --card-elevated: var(--astryx-surface-elevated);
    --cyan: var(--astryx-primary);
    --accent: var(--astryx-accent);
    --text: var(--astryx-text);
    --muted: var(--astryx-text-muted);
    --green: var(--astryx-success);
    --yellow: var(--astryx-warning);
    --orange: var(--astryx-priority);
    --purple: var(--astryx-purple);
    --red: var(--astryx-danger);
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: var(--astryx-bg);
    color: var(--astryx-text);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    line-height: 1.5;
    padding: 20px;
    transition: background-color 0.25s ease, color 0.25s ease;
  }

  header {
    position: sticky;
    top: 0;
    z-index: 100;
    margin: -24px -24px 20px -24px;
    padding: 14px 24px;
    background: var(--bg-surface);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--card-border);
    flex-wrap: wrap;
    gap: 12px;
  }

  /* Portals Dropdown Switcher */
  .portal-dropdown {
    position: relative;
    display: inline-block;
  }

  .portal-dropdown-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: var(--card-elevated);
    border: 1px solid var(--astryx-border-subtle);
    color: var(--astryx-text-contrast);
    font-size: 11px;
    font-weight: 700;
    padding: 5px 10px;
    border-radius: var(--astryx-radius-md);
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .portal-dropdown-btn:hover {
    border-color: var(--cyan);
    color: var(--cyan);
  }

  .portal-dropdown-menu {
    display: none;
    position: absolute;
    right: 0;
    top: calc(100% + 6px);
    background: var(--card-elevated);
    border: 1px solid var(--card-border);
    border-radius: var(--astryx-radius-md);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.45);
    min-width: 260px;
    z-index: 150;
    padding: 6px 0;
  }

  .portal-dropdown-menu.show {
    display: block;
  }

  .portal-dropdown-header {
    padding: 6px 14px;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    color: var(--muted);
    letter-spacing: 0.05em;
  }

  .portal-dropdown-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 14px;
    font-size: 12px;
    font-weight: 600;
    color: var(--astryx-text-contrast);
    text-decoration: none;
    transition: background 0.15s;
  }

  .portal-dropdown-item:hover {
    background: rgba(6, 182, 212, 0.12);
    color: var(--cyan);
  }

  .portal-dropdown-divider {
    height: 1px;
    background: var(--card-border);
    margin: 4px 0;
  }

  .logo-group h1 {
    font-size: 20px;
    font-weight: 800;
    color: var(--astryx-text-contrast);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .logo-group h1 span { color: var(--cyan); }
  .logo-group .sub { font-size: 13px; color: var(--muted); }

  .header-badges {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .badge-tag {
    background: var(--card-elevated);
    border: 1px solid var(--astryx-border-subtle);
    padding: 6px 14px;
    border-radius: var(--astryx-radius-md);
    font-size: 12px;
    font-weight: 600;
    color: var(--text);
  }

  .badge-region {
    background: rgba(16, 185, 129, 0.12);
    border: 1px solid rgba(16, 185, 129, 0.35);
    color: var(--green);
  }

  /* Toolbar Actions Group */
  .toolbar-actions-group {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background: var(--card-elevated);
    border: 1px solid var(--astryx-border-subtle);
    border-radius: var(--astryx-radius-md);
    padding: 3px 4px;
  }

  /* Compact Theme Switcher Button (Icon Only: ☀️ Sun / 🌙 Moon) */
  .theme-toggle-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    padding: 0;
    border-radius: var(--astryx-radius-sm);
    background: transparent;
    border: 1px solid transparent;
    color: var(--text);
    cursor: pointer;
    transition: all 0.2s ease;
  }
  .theme-toggle-btn:hover {
    background: rgba(0, 229, 255, 0.12);
    border-color: var(--cyan);
    color: var(--cyan);
    box-shadow: var(--astryx-shadow-glow);
  }

  /* Language Switcher Button (🌐 EN / AR) */
  .lang-toggle-btn {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 4px 10px;
    height: 32px;
    border-radius: var(--astryx-radius-sm);
    background: transparent;
    border: 1px solid transparent;
    color: var(--text);
    font-size: 11px;
    font-weight: 800;
    font-family: var(--astryx-font-mono);
    letter-spacing: 0.5px;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  .lang-toggle-btn:hover {
    background: rgba(0, 229, 255, 0.12);
    border-color: var(--cyan);
    color: var(--cyan);
    box-shadow: var(--astryx-shadow-glow);
  }

  /* RTL / Arabic Mode Overrides */
  html[dir="rtl"], body.lang-ar {
    direction: rtl;
    text-align: right;
  }
  html[dir="rtl"] .logo-group {
    text-align: right;
  }
  html[dir="rtl"] .header-badges {
    margin-right: auto;
    margin-left: 0;
  }
  html[dir="rtl"] .nav-tabs {
    flex-direction: row-reverse;
  }
  html[dir="rtl"] .student-scope-bar {
    flex-direction: row-reverse;
  }

  /* Strict Language Isolation Utilities */
  .lang-ar-only {
    display: none !important;
  }
  .lang-en-only {
    display: block;
  }
  span.lang-en-only, strong.lang-en-only {
    display: inline;
  }

  body.lang-ar .lang-ar-only, html[dir="rtl"] .lang-ar-only {
    display: block !important;
  }
  body.lang-ar span.lang-ar-only, html[dir="rtl"] span.lang-ar-only,
  body.lang-ar strong.lang-ar-only, html[dir="rtl"] strong.lang-ar-only {
    display: inline !important;
  }
  body.lang-ar .lang-en-only, html[dir="rtl"] .lang-en-only,
  body.lang-ar span.lang-en-only, html[dir="rtl"] span.lang-en-only,
  body.lang-ar strong.lang-en-only, html[dir="rtl"] strong.lang-en-only {
    display: none !important;
  }

  /* Nav Tabs */
  .nav-tabs {
    display: flex;
    gap: 10px;
    border-bottom: 1px solid var(--card-border);
    margin-bottom: 24px;
  }

  .nav-tab {
    padding: 12px 20px;
    background: transparent;
    border: none;
    border-bottom: 3px solid transparent;
    color: var(--muted);
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .nav-tab:hover {
    color: var(--astryx-text-contrast);
  }

  .nav-tab.active {
    color: var(--cyan);
    border-bottom-color: var(--cyan);
    background: rgba(6, 182, 212, 0.08);
    border-radius: var(--astryx-radius-md) var(--astryx-radius-md) 0 0;
  }

  .tab-pane {
    display: none;
    contain: content;
  }

  .tab-pane.active {
    display: block;
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
    border-radius: var(--astryx-radius-lg);
    padding: 16px;
    position: relative;
    overflow: hidden;
    box-shadow: var(--astryx-shadow-card);
    transition: background-color 0.25s ease, border-color 0.25s ease;
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
  .m-cyan::before { background: var(--cyan); }

  .metric-card .title { font-size: 11px; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: 0.5px; }
  .metric-card .value { font-size: 26px; font-weight: 800; color: var(--astryx-text-contrast); margin: 4px 0; }
  .metric-card .desc { font-size: 12px; color: var(--muted); }

  /* Responsive Split Layout for Tab 1 */
  .tab1-layout {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 20px;
    margin-bottom: 24px;
  }

  @media (max-width: 1024px) {
    .tab1-layout { grid-template-columns: 1fr; }
  }

  .card {
    background: var(--card);
    border: 1px solid var(--card-border);
    border-radius: var(--astryx-radius-lg);
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: var(--astryx-shadow-card);
    transition: background-color 0.25s ease, border-color 0.25s ease;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    border-bottom: 1px solid var(--card-border);
    padding-bottom: 12px;
    flex-wrap: wrap;
    gap: 10px;
  }

  .card-header h2 { font-size: 16px; font-weight: 700; color: var(--astryx-text-contrast); }

  /* Rotating Conic Scope-Ring Primitive (from hex-yt-intel) */
  @property --hx-angle { syntax: "<angle>"; initial-value: 0deg; inherits: false; }
  @keyframes hx-rotate-ring { to { --hx-angle: 360deg; } }

  /* Global Student Scope Bar (Partition Root above Tabs) */
  .student-scope-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: var(--card);
    border: 1px solid var(--card-border);
    border-radius: var(--astryx-radius-lg);
    padding: 10px 18px;
    margin-bottom: 20px;
    flex-wrap: wrap;
    gap: 14px;
    box-shadow: var(--astryx-shadow-card);
  }

  .scope-label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.08em;
    color: var(--muted);
    text-transform: uppercase;
  }

  .scope-indicator {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--cyan);
    box-shadow: 0 0 8px var(--cyan);
  }

  .student-pills {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  /* Scope Ring Button with rotating conic-gradient edge */
  .pill-btn {
    position: relative;
    padding: 2px;
    border-radius: var(--astryx-radius-lg);
    border: 1px solid var(--card-border);
    background: var(--card-elevated);
    cursor: pointer;
    overflow: hidden;
    transition: transform 0.15s ease, border-color 0.15s ease;
    display: inline-flex;
    outline: none;
  }

  .pill-btn:hover {
    transform: translateY(-1px);
    border-color: var(--astryx-border-subtle);
  }

  .pill-ring-spin {
    display: none;
    position: absolute;
    inset: -100%;
    background: conic-gradient(from var(--hx-angle), transparent 45%, var(--cyan) 75%, transparent 95%);
    animation: hx-rotate-ring 3s linear infinite;
    z-index: 1;
  }

  .pill-btn.active .pill-ring-spin {
    display: block;
  }

  .pill-btn.active {
    border-color: transparent;
    box-shadow: 0 0 16px rgba(6, 182, 212, 0.25);
  }

  .pill-inner {
    position: relative;
    z-index: 2;
    background: var(--card);
    border-radius: calc(var(--astryx-radius-lg) - 2px);
    padding: 8px 16px;
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
  }

  .pill-btn.active .pill-inner {
    background: var(--card-elevated);
  }

  /* Pulsating Avatar Badge */
  .avatar-ring {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--card);
    border: 1.5px solid var(--card-border);
    transition: all 0.2s ease;
  }

  .avatar-lara { color: var(--cyan); }
  .avatar-maya { color: var(--purple); }

  .pill-btn.active .avatar-lara {
    border-color: var(--cyan);
    background: rgba(6, 182, 212, 0.15);
    box-shadow: 0 0 10px rgba(6, 182, 212, 0.7);
    animation: pulseGlow 2s infinite ease-in-out;
  }

  .pill-btn.active .avatar-maya {
    border-color: var(--purple);
    background: rgba(168, 85, 247, 0.15);
    box-shadow: 0 0 10px rgba(168, 85, 247, 0.7);
    animation: pulseGlow 2s infinite ease-in-out;
  }

  .student-info {
    display: flex;
    flex-direction: column;
    text-align: left;
  }

  .student-info .name {
    font-size: 13px;
    font-weight: 700;
    color: var(--astryx-text-contrast);
    line-height: 1.2;
  }

  .student-info .meta {
    font-size: 10px;
    color: var(--muted);
    line-height: 1.2;
  }

  .active-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--card-border);
    margin-left: 4px;
    transition: all 0.2s ease;
  }

  .pill-btn.active .active-dot {
    background: var(--green);
    box-shadow: 0 0 6px var(--green);
  }

  /* Non-Blocking Toast Notification Container */
  #toast-container {
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: 10px;
    pointer-events: none;
  }

  .toast {
    background: var(--card-elevated);
    color: var(--astryx-text-contrast);
    border: 1px solid var(--card-border);
    border-radius: var(--astryx-radius-md);
    padding: 12px 18px;
    font-size: 13px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.35);
    opacity: 0;
    transform: translateY(12px) scale(0.96);
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    pointer-events: auto;
    max-width: 420px;
    line-height: 1.4;
  }

  .toast.show {
    opacity: 1;
    transform: translateY(0) scale(1);
  }

  .toast-success { border-left: 4px solid var(--green); }
  .toast-cyan { border-left: 4px solid var(--cyan); }
  .toast-orange { border-left: 4px solid var(--orange); }

  /* Mini Metric Row */
  .mini-kpi-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    margin-bottom: 20px;
  }

  @media (max-width: 640px) {
    .mini-kpi-row { grid-template-columns: repeat(2, 1fr); }
  }

  .mini-kpi {
    background: var(--card-elevated);
    border: 1px solid var(--card-border);
    border-radius: var(--astryx-radius-md);
    padding: 10px;
    text-align: center;
  }

  .mini-kpi .kpi-label { font-size: 10px; text-transform: uppercase; color: var(--muted); font-weight: 700; }
  .mini-kpi .kpi-val { font-size: 20px; font-weight: 800; color: var(--astryx-text-contrast); margin-top: 2px; }

  /* Interactive Chart Boxes */
  .chart-box {
    background: var(--card-elevated);
    border: 1px solid var(--card-border);
    border-radius: var(--astryx-radius-md);
    padding: 16px;
    margin-bottom: 20px;
  }

  .chart-title {
    font-size: 13px;
    font-weight: 700;
    color: var(--astryx-text-contrast);
    margin-bottom: 12px;
    display: flex;
    justify-content: space-between;
  }

  .chart-legend {
    display: flex;
    gap: 14px;
    font-size: 11px;
    color: var(--muted);
  }

  .legend-item { display: flex; align-items: center; gap: 4px; }
  .dot { width: 8px; height: 8px; border-radius: 50%; }

  /* Right Pane Scorecard & Misconceptions */
  .scorecard-banner {
    background: rgba(16, 185, 129, 0.08);
    border: 1px solid rgba(16, 185, 129, 0.3);
    border-radius: var(--astryx-radius-md);
    padding: 14px;
    margin-bottom: 16px;
  }

  .scorecard-banner .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    color: var(--green);
    font-weight: 700;
  }

  .scorecard-banner .big-score {
    font-size: 28px;
    font-weight: 800;
    color: var(--astryx-text-contrast);
    margin: 4px 0;
  }

  .misconception-item {
    background: var(--card-elevated);
    border: 1px solid var(--card-border);
    border-left: 3px solid var(--orange);
    padding: 10px;
    border-radius: 0 var(--astryx-radius-sm) var(--astryx-radius-sm) 0;
    margin-bottom: 8px;
    font-size: 12px;
  }

  .misconception-item.yellow {
    border-left-color: var(--yellow);
  }

  .misconception-title {
    font-weight: 700;
    color: var(--astryx-text-contrast);
    display: flex;
    justify-content: space-between;
    margin-bottom: 2px;
  }

  .misconception-desc {
    color: var(--muted);
    font-size: 11px;
  }

  /* Tables */
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th { text-align: left; padding: 10px; color: var(--muted); font-size: 11px; text-transform: uppercase; border-bottom: 1px solid var(--card-border); }
  td { padding: 12px 10px; border-bottom: 1px solid var(--card-border); }

  .badge {
    display: inline-block;
    padding: 3px 8px;
    border-radius: var(--astryx-radius-sm);
    font-size: 11px;
    font-weight: 700;
  }

  .badge-orange { background: rgba(249, 115, 22, 0.15); color: var(--orange); border: 1px solid rgba(249, 115, 22, 0.3); }
  .badge-yellow { background: rgba(245, 158, 11, 0.15); color: var(--yellow); border: 1px solid rgba(245, 158, 11, 0.3); }
  .badge-green { background: rgba(16, 185, 129, 0.15); color: var(--green); border: 1px solid rgba(16, 185, 129, 0.3); }
  .badge-purple { background: rgba(168, 85, 247, 0.15); color: var(--purple); border: 1px solid rgba(168, 85, 247, 0.3); }
  .badge-red { background: rgba(239, 68, 68, 0.15); color: var(--red); border: 1px solid rgba(239, 68, 68, 0.3); }
  .badge-cyan { background: rgba(6, 182, 212, 0.15); color: var(--cyan); border: 1px solid rgba(6, 182, 212, 0.3); }

  /* Buttons */
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    background: var(--cyan);
    color: #ffffff;
    font-weight: 700;
    font-size: 13px;
    padding: 10px 18px;
    border-radius: var(--astryx-radius-md);
    border: none;
    cursor: pointer;
    text-decoration: none;
    transition: opacity 0.2s;
    width: 100%;
    margin-top: 6px;
  }

  .btn:hover { opacity: 0.9; }
  .btn-outline { background: transparent; color: var(--text); border: 1px solid var(--card-border); }
  .btn-outline:hover { background: var(--card-elevated); }
  .btn-danger { background: rgba(239, 68, 68, 0.15); color: var(--red); border: 1px solid rgba(239, 68, 68, 0.4); }

  /* Admin & Infra Grid */
  .admin-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 24px;
  }

  @media (max-width: 900px) {
    .admin-grid { grid-template-columns: 1fr; }
  }

  .status-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid var(--card-border);
    font-size: 13px;
  }

  .status-row:last-child { border-bottom: none; }
  .status-row .key { font-weight: 600; color: var(--astryx-text-contrast); }
  .status-row .val { color: var(--muted); display: flex; align-items: center; gap: 6px; }

  /* Sandbox */
  .sandbox-dropzone {
    border: 2px dashed var(--astryx-border-subtle);
    border-radius: var(--astryx-radius-md);
    padding: 24px;
    text-align: center;
    cursor: pointer;
    transition: border-color 0.2s;
    background: var(--card-elevated);
  }

  .sandbox-dropzone:hover { border-color: var(--cyan); }

  /* Submissions Register & De-skew Gallery Styles */
  .filter-pill-group {
    display: inline-flex;
    background: var(--card-elevated);
    border: 1px solid var(--card-border);
    border-radius: var(--astryx-radius-sm);
    padding: 2px;
    gap: 2px;
  }
  .filter-pill {
    background: transparent;
    border: none;
    color: var(--muted);
    font-size: 11px;
    font-weight: 600;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.15s ease;
  }
  .filter-pill.active {
    background: var(--cyan);
    color: #ffffff;
  }
  .view-toggle {
    display: inline-flex;
    background: var(--card-elevated);
    border: 1px solid var(--card-border);
    border-radius: var(--astryx-radius-md);
    padding: 3px;
    gap: 4px;
  }
  .view-toggle-btn {
    background: transparent;
    border: none;
    color: var(--muted);
    font-size: 12px;
    font-weight: 600;
    padding: 6px 14px;
    border-radius: var(--astryx-radius-sm);
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    transition: all 0.15s ease;
  }
  .view-toggle-btn.active {
    background: var(--card);
    color: var(--astryx-text-contrast);
    box-shadow: 0 1px 3px rgba(0,0,0,0.15);
  }

  .packets-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .packet-card {
    background: var(--card);
    border: 1px solid var(--card-border);
    border-radius: var(--astryx-radius-md);
    padding: 16px 20px;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }
  .packet-card:hover {
    box-shadow: var(--astryx-shadow-glow);
  }
  .packet-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 12px;
    border-bottom: 1px solid var(--card-border);
    padding-bottom: 12px;
    margin-bottom: 14px;
  }
  .packet-title {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }
  .packet-title h3 {
    font-size: 15px;
    font-weight: 700;
    color: var(--astryx-text-contrast);
  }
  .packet-sub {
    font-size: 12px;
    color: var(--muted);
    margin-top: 4px;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .pages-carousel {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
    gap: 14px;
  }
  .page-thumb-card {
    background: var(--card-elevated);
    border: 1px solid var(--card-border);
    border-radius: var(--astryx-radius-sm);
    overflow: hidden;
    cursor: pointer;
    transition: border-color 0.15s ease, transform 0.15s ease;
  }
  .page-thumb-card:hover {
    border-color: var(--cyan);
    transform: translateY(-2px);
  }
  .page-thumb-badge {
    background: rgba(0,0,0,0.3);
    font-size: 10px;
    font-weight: 700;
    color: var(--astryx-text-contrast);
    padding: 4px 8px;
    border-bottom: 1px solid var(--card-border);
  }
  .page-canvas-preview {
    height: 140px;
    padding: 10px;
    background: #ffffff;
    color: #111827;
    position: relative;
    overflow: hidden;
    font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  }
  body.theme-light .page-canvas-preview {
    background: #fdfdfd;
  }
  .doc-header-line {
    height: 6px;
    width: 60%;
    background: #0284c7;
    border-radius: 2px;
    margin-bottom: 8px;
  }
  .doc-line {
    height: 3px;
    background: #cbd5e1;
    border-radius: 1px;
    margin-bottom: 4px;
  }
  .w-90 { width: 90%; }
  .w-80 { width: 80%; }
  .w-75 { width: 75%; }
  .w-70 { width: 70%; }
  .w-60 { width: 60%; }
  .doc-box {
    border: 1px dashed #94a3b8;
    border-radius: 3px;
    padding: 4px;
    margin: 6px 0;
    font-size: 8px;
  }
  .doc-stamp-pass {
    color: #16a34a;
    font-weight: 700;
    display: block;
  }
  .doc-stamp-fail {
    color: #dc2626;
    font-weight: 700;
    display: block;
  }
  .doc-ink-mark {
    color: #1e3a8a;
    font-style: italic;
    font-family: 'Comic Sans MS', cursive, sans-serif;
    font-size: 7.5px;
    display: block;
  }
  .doc-teacher-grade {
    position: absolute;
    bottom: 6px;
    right: 8px;
    color: #dc2626;
    font-weight: 800;
    font-size: 11px;
    transform: rotate(-10deg);
  }
  .page-meta-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 8px;
    font-size: 10px;
    color: var(--muted);
    border-top: 1px solid var(--card-border);
  }
  .deskew-tag {
    font-family: var(--astryx-font-mono);
    color: var(--cyan);
    font-weight: 600;
  }

  .flat-pages-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;
  }

  /* Modal Inspector */
  .modal-backdrop {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0, 0, 0, 0.75);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
  }
  .modal-card {
    background: var(--card);
    border: 1px solid var(--card-border);
    border-radius: var(--astryx-radius-lg);
    width: 100%;
    max-width: 950px;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  }
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid var(--card-border);
  }
  .modal-close {
    background: transparent;
    border: none;
    color: var(--muted);
    font-size: 20px;
    cursor: pointer;
  }
  .modal-close:hover { color: var(--astryx-text-contrast); }
  .modal-body-split {
    display: grid;
    grid-template-columns: 3fr 2fr;
    overflow-y: auto;
    padding: 20px;
    gap: 20px;
  }
  @media (max-width: 800px) {
    .modal-body-split { grid-template-columns: 1fr; }
  }
  .scan-display-frame {
    background: #0f172a;
    border-radius: var(--astryx-radius-md);
    padding: 16px;
    display: flex;
    flex-direction: column;
  }
  .scan-overlay-tools {
    display: flex;
    gap: 8px;
    margin-bottom: 12px;
    flex-wrap: wrap;
  }
  .scan-tool-badge {
    background: rgba(255, 255, 255, 0.1);
    font-size: 11px;
    color: #f1f5f9;
    padding: 4px 8px;
    border-radius: 4px;
    font-weight: 600;
  }
  .scan-paper-simulation {
    background: #ffffff;
    color: #0f172a;
    padding: 20px;
    border-radius: 4px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    font-size: 12px;
  }
  .sim-header {
    border-bottom: 2px solid #0f172a;
    padding-bottom: 8px;
    margin-bottom: 14px;
  }
  .sim-title { font-weight: 800; font-size: 13px; color: #0284c7; }
  .sim-meta { font-size: 11px; color: #475569; margin-top: 2px; }
  .sim-question-box {
    border: 1px solid #cbd5e1;
    border-radius: 4px;
    padding: 10px;
    margin-bottom: 10px;
  }
  .ocr-box-green { border-left: 4px solid #16a34a; background: #f0fdf4; }
  .ocr-box-orange { border-left: 4px solid #ea580c; background: #fff7ed; }
  .sim-q-num { font-weight: 700; color: #0f172a; font-size: 11px; }
  .sim-q-text { font-size: 12px; margin: 4px 0; color: #1e293b; }
  .sim-student-handwriting {
    font-family: 'Comic Sans MS', cursive, sans-serif;
    color: #1e3a8a;
    font-size: 12px;
    padding: 4px 8px;
    background: rgba(30, 58, 138, 0.05);
    border-radius: 2px;
    margin: 4px 0;
  }
  .sim-grade-tag { font-size: 11px; font-weight: 700; }
  .grade-pass { color: #16a34a; }
  .grade-fail { color: #ea580c; }
  .scan-telemetry-panel {
    background: var(--card-elevated);
    border: 1px solid var(--card-border);
    border-radius: var(--astryx-radius-md);
    padding: 16px;
  }
  .telemetry-item {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    padding: 6px 0;
    border-bottom: 1px solid var(--card-border);
  }
  .telemetry-item .t-label { color: var(--muted); }
  .telemetry-item .t-val { font-weight: 600; }
  .text-green { color: var(--green); }
  .text-cyan { color: var(--cyan); }
  .delta-box {
    background: var(--card);
    border: 1px solid var(--card-border);
    border-radius: var(--astryx-radius-sm);
    padding: 12px;
    margin-top: 10px;
  }

  /* Master Blank Templates Styles */
  .solution-banner {
    border-left: 4px solid var(--cyan);
    background: linear-gradient(135deg, var(--card) 0%, var(--card-elevated) 100%);
  }
  .templates-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 16px;
    margin-bottom: 24px;
  }
  .template-card {
    background: var(--card);
    border: 1px solid var(--card-border);
    border-radius: var(--astryx-radius-md);
    padding: 18px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }
  .template-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--astryx-shadow-glow);
  }
  .template-badge-row {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
    margin-bottom: 8px;
  }
  .template-title {
    font-size: 15px;
    font-weight: 700;
    color: var(--astryx-text-contrast);
    margin-bottom: 10px;
  }
  .template-meta-list {
    font-size: 12px;
    color: var(--muted);
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-bottom: 16px;
  }
  .template-actions {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }
  .btn-sm {
    padding: 6px 12px;
    font-size: 11px;
    width: auto;
    margin-top: 0;
  }

  /* Clean Worksheet Simulation Paper */
  .clean-worksheet-paper {
    background: #ffffff;
    color: #0f172a;
    border: 1px solid #e2e8f0;
    border-radius: 4px;
    padding: 30px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    box-shadow: 0 4px 20px rgba(0,0,0,0.06);
    margin-top: 16px;
  }
  .clean-school-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid #0f172a;
    padding-bottom: 14px;
    margin-bottom: 16px;
    flex-wrap: wrap;
    gap: 12px;
  }
  .school-brand h2 {
    font-size: 20px;
    font-weight: 900;
    letter-spacing: 0.5px;
    color: #0369a1;
  }
  .school-dept { font-size: 12px; color: #475569; }
  .worksheet-title-block { text-align: right; }
  .worksheet-title-block h3 { font-size: 14px; font-weight: 800; color: #0f172a; }
  .worksheet-title-block div { font-size: 11px; color: #64748b; }
  .clean-student-box {
    display: flex;
    justify-content: space-between;
    background: #f8fafc;
    border: 1px solid #cbd5e1;
    border-radius: 4px;
    padding: 10px 14px;
    margin-bottom: 16px;
    font-size: 12px;
    flex-wrap: wrap;
    gap: 10px;
  }
  .student-score-box {
    font-weight: 800;
    color: #0369a1;
    border: 1px solid #0369a1;
    padding: 2px 10px;
    border-radius: 3px;
    background: #f0f9ff;
  }
  .clean-instructions {
    font-size: 11px;
    color: #475569;
    border-left: 3px solid #0369a1;
    padding: 6px 12px;
    background: #f8fafc;
    margin-bottom: 20px;
  }
  .clean-q-card {
    border: 1px solid #e2e8f0;
    border-radius: 4px;
    padding: 14px;
    margin-bottom: 16px;
    background: #ffffff;
  }
  .clean-q-header {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    font-weight: 700;
    color: #0369a1;
    border-bottom: 1px solid #f1f5f9;
    padding-bottom: 4px;
    margin-bottom: 8px;
  }
  .q-marks { color: #64748b; font-weight: 600; }
  .clean-q-body { font-size: 13px; color: #1e293b; line-height: 1.5; margin-bottom: 12px; }
  .clean-ruled-lines {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 8px 0;
  }
  .ruled-line {
    border-bottom: 1px solid #cbd5e1;
    height: 1px;
    width: 100%;
  }
  .clean-preview-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 12px;
    margin-top: 10px;
  }
  .clean-preview-table th {
    background: #f1f5f9;
    color: #334155;
    padding: 8px 10px;
    border: 1px solid #cbd5e1;
    text-align: left;
    font-size: 11px;
  }
  .clean-preview-table td {
    padding: 10px;
    border: 1px solid #cbd5e1;
    color: #1e293b;
  }
  .fill-box {
    border: 1px dashed #94a3b8;
    height: 24px;
    border-radius: 3px;
    background: #fafafa;
  }

  /* Fluid UI Animations - Zero Layout Thrashing */
  @keyframes pulseGlow {
    0%, 100% { box-shadow: 0 0 5px rgba(16, 185, 129, 0.3); }
    50% { box-shadow: 0 0 14px rgba(16, 185, 129, 0.7); }
  }
  .pulse-glow { animation: pulseGlow 2.5s infinite ease-in-out; }

  /* Wave 19: Dynamic Curriculum Year-Group & Concept Graph UI */
  .template-filters-bar {
    display: flex;
    gap: 8px;
    align-items: center;
    flex-wrap: wrap;
    margin-bottom: 16px;
  }
  .filter-pill {
    padding: 6px 14px;
    font-size: 12px;
    font-weight: 600;
    border-radius: 9999px;
    border: 1px solid var(--card-border);
    background: var(--card-bg);
    color: var(--muted);
    cursor: pointer;
    transition: all 0.15s ease;
  }
  .filter-pill:hover {
    color: var(--astryx-text-contrast);
    border-color: rgba(255, 255, 255, 0.2);
  }
  .filter-pill.active {
    background: rgba(6, 182, 212, 0.15);
    border-color: var(--cyan);
    color: var(--cyan);
  }
  .template-card.is-priority {
    border-color: var(--cyan);
    box-shadow: 0 0 16px rgba(6, 182, 212, 0.2);
    position: relative;
  }
  .priority-banner {
    background: linear-gradient(90deg, rgba(6, 182, 212, 0.2) 0%, rgba(168, 85, 247, 0.1) 100%);
    border: 1px solid rgba(6, 182, 212, 0.4);
    border-radius: 6px;
    padding: 6px 10px;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 11.5px;
    font-weight: 600;
    color: var(--astryx-text-contrast);
  }
  .prereq-flow-strip {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 6px;
    padding: 8px 10px;
    margin: 10px 0;
    font-size: 11px;
    line-height: 1.4;
    border: 1px dashed rgba(255, 255, 255, 0.1);
  }
  .prereq-flow-strip .flow-title {
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--muted);
    font-weight: 700;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .prereq-flow-strip .flow-steps {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 6px;
  }
  .flow-step-tag {
    background: rgba(255, 255, 255, 0.05);
    padding: 2px 6px;
    border-radius: 4px;
    font-family: monospace;
    font-size: 10.5px;
  }
  .flow-step-tag.mastered {
    color: var(--green);
    border: 1px solid rgba(16, 185, 129, 0.3);
  }
  .flow-step-tag.blocker {
    color: var(--orange);
    border: 1px solid rgba(249, 115, 22, 0.5);
    background: rgba(249, 115, 22, 0.1);
    font-weight: 700;
  }
  .flow-arrow {
    color: var(--muted);
    font-size: 10px;
  }
</style>`;
}
