export function renderInfraGateTab(): string {
  return `  <!-- TAB 3: Ingestion Gate & Infrastructure -->
  <div id="tab-infra-gate" class="tab-pane">
    <div class="admin-grid">
      <!-- Left: Central Settings Registry & Strike Rules -->
      <div class="card">
        <div class="card-header">
          <h2>⚙️ Central Settings & Intake Strike Rules</h2>
          <span class="badge badge-green">Registry Active</span>
        </div>
        <div class="status-row">
          <span class="key">Deduplication Gate</span>
          <span class="val"><span class="badge badge-green">ENABLED</span> (Telegram & WhatsApp)</span>
        </div>
        <div class="status-row">
          <span class="key">Maximum Strike Limit</span>
          <span class="val"><code>3 Strikes</code> (Before Downgrade)</span>
        </div>
        <div class="status-row">
          <span class="key">Penalty Action on Max Strikes</span>
          <span class="val"><span class="badge badge-red">Downgrade to Batch Queue</span></span>
        </div>
        <div class="status-row">
          <span class="key">Cooldown Window</span>
          <span class="val"><code>24 Hours</code> (Rolling Fingerprint TTL)</span>
        </div>
        <div class="status-row">
          <span class="key">Fingerprint Resolution</span>
          <span class="val">Telegram <code>file_unique_id</code> + Filename + Byte Size</span>
        </div>
        <div class="status-row">
          <span class="key">Shortlink Provider</span>
          <span class="val"><span class="badge badge-cyan">Dub.co</span> (aim.getvintel.com/s/...)</span>
        </div>
      </div>

      <!-- Right: Regional Infrastructure Status -->
      <div class="card">
        <div class="card-header">
          <h2>🌍 Infrastructure & Regional Routing</h2>
          <span class="badge badge-green">All Systems Operational</span>
        </div>
        <div class="status-row">
          <span class="key">Web & API Console</span>
          <span class="val">🟢 Vercel Serverless (<code>cdg1</code> Paris Primary / <code>fra1</code> Fallback)</span>
        </div>
        <div class="status-row">
          <span class="key">Telegram Intake Worker</span>
          <span class="val">🟢 Cloudflare Worker (<code>aim-bot.getvintel.com</code> • EU Edge)</span>
        </div>
        <div class="status-row">
          <span class="key">State Storage</span>
          <span class="val">🟢 Upstash Redis (Prefix: <code>aim:*</code> • Region: <code>eu-west-3</code>)</span>
        </div>
        <div class="status-row">
          <span class="key">Warm Chromium Pool (Approach C)</span>
          <span class="val">🟢 Puppeteer Warm Pool (46ms–125ms render latency)</span>
        </div>
        <div class="status-row">
          <span class="key">Asynchronous Queue</span>
          <span class="val">🟢 Upstash QStash (Callback: <code>/jobs/process-assessment</code>)</span>
        </div>
        <div class="status-row">
          <span class="key">Audit Ledger</span>
          <span class="val">🟢 GitStateStorageAdapter (Private Repo Backup)</span>
        </div>
      </div>
    </div>

    <!-- Wave 23: 2-Way School MIS Integration & Live Gradebook Sync -->
    <div class="card" style="border-left: 4px solid var(--accent-cyan, #06b6d4); margin-top: 24px;">
      <div class="card-header">
        <div>
          <h2>🏫 Wave 23: 2-Way School MIS Integration & Real-Time Sync</h2>
          <p style="margin: 4px 0 0 0; font-size: 0.8rem; color: var(--text-muted, #94a3b8);">Bi-directional live connector with Asten College SIMS & Google Classroom. Ingests teacher-marked test papers and syncs home Socratic remediation results back to school gradebooks.</p>
        </div>
        <span class="badge badge-green">2-Way Live Sync Active</span>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; margin-top: 12px;">
        <div class="status-row" style="flex-direction: column; align-items: flex-start; gap: 4px;">
          <span class="key">Partner School</span>
          <span class="val"><strong>Asten College • Cairo</strong> (British Primary Division)</span>
        </div>
        <div class="status-row" style="flex-direction: column; align-items: flex-start; gap: 4px;">
          <span class="key">MIS Protocol Provider</span>
          <span class="val"><span class="badge badge-cyan">SIMS + Google Classroom</span> (Live Webhooks)</span>
        </div>
        <div class="status-row" style="flex-direction: column; align-items: flex-start; gap: 4px;">
          <span class="key">Bi-Directional Telemetry</span>
          <span class="val">🟢 Ingests Classwork Scans ➔ Pushes Socratic Remediation Deltas</span>
        </div>
        <div class="status-row" style="flex-direction: column; align-items: flex-start; gap: 4px;">
          <span class="key">Gradebook Endpoint</span>
          <span class="val"><code>https://sims.astencollege.com/api/v1/gradebook-sync</code></span>
        </div>
      </div>
    </div>

    <!-- Wave 27: Teacher Institutional Analytics Portal & Macro Diagnostic Heatmaps -->
    <div class="card" style="border-left: 4px solid var(--accent-purple, #a855f7); margin-top: 24px;">
      <div class="card-header">
        <div>
          <h2>📊 Wave 27: Teacher Institutional Analytics Portal</h2>
          <p style="margin: 4px 0 0 0; font-size: 0.8rem; color: var(--text-muted, #94a3b8);">Macro cohort diagnostic heatmaps, cross-class mastery matrices, sensory scaffold tracking, and MIS CSV exports for school educators.</p>
        </div>
        <div style="display: flex; gap: 8px;">
          <a href="/school/asten-college?year=Y4" target="_blank" class="btn" style="width: auto; margin-top: 0; background: var(--purple, #a855f7);">🏫 Open Teacher Portal</a>
          <a href="/api/school/asten-college/export.csv?year=Y4" class="btn btn-outline" style="width: auto; margin-top: 0;">⬇ Export CSV</a>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; margin-top: 12px;">
        <div class="status-row" style="flex-direction: column; align-items: flex-start; gap: 4px;">
          <span class="key">Active Institutional Scope</span>
          <span class="val"><strong>Asten College</strong> (Year 4 Cohort Diagnostic Matrix)</span>
        </div>
        <div class="status-row" style="flex-direction: column; align-items: flex-start; gap: 4px;">
          <span class="key">Topological Mastery Rollup</span>
          <span class="val">🟢 Class Average: <strong>89%</strong> (Science 84% • Maths 88% • English 89%)</span>
        </div>
        <div class="status-row" style="flex-direction: column; align-items: flex-start; gap: 4px;">
          <span class="key">Sensory & ADHD Accommodations</span>
          <span class="val"><span class="badge badge-yellow">2 Students Tracked</span> (8m micro-sprints & visual anchors)</span>
        </div>
        <div class="status-row" style="flex-direction: column; align-items: flex-start; gap: 4px;">
          <span class="key">Primary Systemic Bottleneck</span>
          <span class="val"><span class="badge badge-red">Y4.SCI.SND.MEDIUM</span> (Sound Transmission in Matter - 68%)</span>
        </div>
      </div>
    </div>


    <!-- Interactive Intake & Strike Simulator -->
    <div class="card">
      <div class="card-header">
        <h2>🛡️ Intake Deduplication & Strike Simulator</h2>
        <div style="display: flex; gap: 8px;">
          <button class="btn btn-outline" style="width: auto; margin-top: 0;" onclick="simulateNewUpload()">Simulate New Quiz Upload (Accept)</button>
          <button class="btn btn-outline" style="width: auto; margin-top: 0;" onclick="simulateDuplicateUpload()">Simulate Duplicate Upload (Strike)</button>
          <button class="btn btn-danger" style="width: auto; margin-top: 0;" onclick="resetSimulatedStrikes()">Reset Guardian Strikes</button>
        </div>
      </div>
      <div class="sandbox-dropzone" onclick="simulateDuplicateUpload()">
        <div style="font-size: 24px; margin-bottom: 8px;">📸</div>
        <div style="font-weight: 700; color: var(--astryx-text-contrast);" id="sim-headline">Click to simulate test upload or duplicate submission</div>
        <div style="font-size: 12px; color: var(--muted); margin-top: 4px;" id="sim-status">
          Current Guardian: <code>guardian_parent_7788</code> • Strikes: <span id="sim-strikes">0/3</span> • Status: <span class="badge badge-green" id="sim-badge">Active</span>
        </div>
      </div>
      <div id="sim-log" style="margin-top: 14px; font-family: monospace; font-size: 12px; background: #000; padding: 12px; border-radius: 6px; display: none; color: #a5f3fc;"></div>
    </div>
  </div>`;
}
