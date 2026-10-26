export function renderDashboardStyles(): string {
  return `<style>
  /* Meta Astryx Centralized Design Tokens (Theme: Neutral Dark) */
  :root {
    --astryx-bg: #090d16;
    --astryx-surface: #111827;
    --astryx-surface-elevated: #1e293b;
    --astryx-border: #1f2937;
    --astryx-border-subtle: #334155;
    --astryx-primary: #06b6d4;
    --astryx-accent: #3b82f6;
    --astryx-text: #f3f4f6;
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

    /* Token Aliases mapped to Meta Astryx */
    --bg: var(--astryx-bg);
    --card: var(--astryx-surface);
    --card-border: var(--astryx-border);
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
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--card-border);
    padding-bottom: 16px;
    margin-bottom: 20px;
    flex-wrap: wrap;
    gap: 12px;
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

  .header-badges {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .badge-tag {
    background: #1e293b;
    border: 1px solid #334155;
    padding: 6px 14px;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 600;
  }

  .badge-region {
    background: rgba(16, 185, 129, 0.15);
    border: 1px solid rgba(16, 185, 129, 0.4);
    color: var(--green);
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
    color: #fff;
  }

  .nav-tab.active {
    color: var(--cyan);
    border-bottom-color: var(--cyan);
    background: rgba(6, 182, 212, 0.05);
    border-radius: 8px 8px 0 0;
  }

  .tab-pane {
    display: none;
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
  .m-cyan::before { background: var(--cyan); }

  .metric-card .title { font-size: 11px; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: 0.5px; }
  .metric-card .value { font-size: 26px; font-weight: 800; color: #fff; margin: 4px 0; }
  .metric-card .desc { font-size: 12px; color: var(--muted); }

  /* 2/3 and 1/3 Responsive Split Layout for Tab 1 */
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
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 20px;
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

  .card-header h2 { font-size: 16px; font-weight: 700; color: #fff; }

  /* Student Selector Pills */
  .student-pills {
    display: flex;
    gap: 10px;
    margin-bottom: 18px;
  }

  .pill-btn {
    padding: 8px 18px;
    border-radius: 20px;
    border: 1px solid #334155;
    background: #1e293b;
    color: #fff;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .pill-btn:hover, .pill-btn.active {
    background: var(--cyan);
    color: #000;
    border-color: var(--cyan);
    box-shadow: 0 0 12px rgba(6, 182, 212, 0.3);
  }

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
    background: #0f172a;
    border: 1px solid #1e293b;
    border-radius: 8px;
    padding: 10px;
    text-align: center;
  }

  .mini-kpi .kpi-label { font-size: 10px; text-transform: uppercase; color: var(--muted); font-weight: 700; }
  .mini-kpi .kpi-val { font-size: 20px; font-weight: 800; color: #fff; margin-top: 2px; }

  /* Interactive SVG Chart */
  .chart-box {
    background: #0b1120;
    border: 1px solid #1e293b;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 20px;
  }

  .chart-title {
    font-size: 13px;
    font-weight: 700;
    color: #fff;
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

  svg.trend-svg {
    width: 100%;
    height: 180px;
    display: block;
    overflow: visible;
  }

  /* Dimension Bars */
  .dim-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    font-size: 12px;
  }

  .bar-container {
    width: 55%;
    background: #1e293b;
    height: 8px;
    border-radius: 4px;
    overflow: hidden;
  }

  .bar-fill {
    height: 100%;
    border-radius: 4px;
    transition: width 0.5s ease;
  }

  /* Right Pane Scorecard & Misconceptions */
  .scorecard-banner {
    background: rgba(16, 185, 129, 0.1);
    border: 1px solid rgba(16, 185, 129, 0.3);
    border-radius: 8px;
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
    color: #fff;
    margin: 4px 0;
  }

  .misconception-item {
    background: #1e293b;
    border-left: 3px solid var(--orange);
    padding: 10px;
    border-radius: 0 6px 6px 0;
    margin-bottom: 8px;
    font-size: 12px;
  }

  .misconception-item.yellow {
    border-left-color: var(--yellow);
  }

  .misconception-title {
    font-weight: 700;
    color: #fff;
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
  .badge-red { background: rgba(239, 68, 68, 0.2); color: var(--red); border: 1px solid rgba(239, 68, 68, 0.3); }
  .badge-cyan { background: rgba(6, 182, 212, 0.2); color: var(--cyan); border: 1px solid rgba(6, 182, 212, 0.3); }

  /* Buttons */
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    background: var(--cyan);
    color: #000;
    font-weight: 700;
    font-size: 13px;
    padding: 10px 18px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    text-decoration: none;
    transition: opacity 0.2s;
    width: 100%;
    margin-top: 6px;
  }

  .btn:hover { opacity: 0.9; }
  .btn-outline { background: transparent; color: var(--text); border: 1px solid var(--card-border); }
  .btn-outline:hover { background: #1e293b; }
  .btn-danger { background: rgba(239, 68, 68, 0.2); color: var(--red); border: 1px solid rgba(239, 68, 68, 0.4); }

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
    border-bottom: 1px solid #1f2937;
    font-size: 13px;
  }

  .status-row:last-child { border-bottom: none; }
  .status-row .key { font-weight: 600; color: #fff; }
  .status-row .val { color: var(--muted); display: flex; align-items: center; gap: 6px; }

  /* Sandbox */
  .sandbox-dropzone {
    border: 2px dashed #374151;
    border-radius: 8px;
    padding: 24px;
    text-align: center;
    cursor: pointer;
    transition: border-color 0.2s;
    background: rgba(17, 24, 39, 0.5);
  }

  .sandbox-dropzone:hover { border-color: var(--cyan); }
</style>`;
}
