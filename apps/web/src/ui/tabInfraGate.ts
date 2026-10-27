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
