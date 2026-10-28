export function renderGapLedgerTab(): string {
  return `  <!-- TAB 2: Cognitive Gap Ledger & Socratic Guidance -->
  <div id="tab-gap-ledger" class="tab-pane">
    <div class="grid-metrics">
      <div class="metric-card m-orange">
        <div class="title">Active Priority (🟠)</div>
        <div class="value">2</div>
        <div class="desc">Active cognitive bottlenecks</div>
      </div>
      <div class="metric-card m-yellow">
        <div class="title">Progressing (🟡)</div>
        <div class="value">3</div>
        <div class="desc">Stabilizing under rush/pressure</div>
      </div>
      <div class="metric-card m-green">
        <div class="title">Mastered (🟢)</div>
        <div class="value">14</div>
        <div class="desc">Fully resolved curriculum targets</div>
      </div>
      <div class="metric-card m-cyan">
        <div class="title">Dedup Gate Savings (🛡️)</div>
        <div class="value">9,600</div>
        <div class="desc">Tokens saved via duplicate test interception</div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <h2>Detailed Cognitive Gap Ledger (All Students)</h2>
        <div style="display: flex; gap: 8px;">
          <a href="/sprint/preview" target="_blank" class="btn" style="width: auto; margin-top: 0;">📄 Open 4-Page Sprint</a>
          <a href="/guide/preview" target="_blank" class="btn btn-outline" style="width: auto; margin-top: 0;">🧭 Parent Socratic Guide</a>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Student</th>
            <th>Concept Code</th>
            <th>Error Class</th>
            <th>Pedagogical Description</th>
            <th>Recurrence</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Lara</strong></td>
            <td><code>Y4.MATH.NPV.EMPTY_COLUMNS</code></td>
            <td><code>ERR_PHANTOM_ZERO</code></td>
            <td>Omits zero in unmentioned place-value rooms (writes 24,16 for 24,106)</td>
            <td>3x</td>
            <td><span class="badge badge-orange">Active Priority</span></td>
          </tr>
          <tr>
            <td><strong>Lara</strong></td>
            <td><code>Y4.MATH.NPV.NEGATIVE_NUMBERS</code></td>
            <td><code>ERR_NEGATIVE_MAGNITUDE_INVERSION</code></td>
            <td>Orders -4°C as warmer than -1°C</td>
            <td>2x</td>
            <td><span class="badge badge-yellow">Progressing</span></td>
          </tr>
          <tr>
            <td><strong>Lara</strong></td>
            <td><code>Y4.MATH.NPV.WRITING_NUMBERS</code></td>
            <td><code>ERR_TRANSPOSITION</code></td>
            <td>Transposing digits under time pressure (writes 03 for thirty)</td>
            <td>2x</td>
            <td><span class="badge badge-yellow">Progressing</span></td>
          </tr>
          <tr>
            <td><strong>Maya</strong></td>
            <td><code>Y4.MATH.NPV.5DIGIT_ORDERING</code></td>
            <td><code>ERR_SHARED_PREFIX_ORDERING</code></td>
            <td>Difficulty sequencing 5-digit numbers that share leading digits</td>
            <td>1x</td>
            <td><span class="badge badge-orange">Active Priority</span></td>
          </tr>
          <tr>
            <td><strong>Maya</strong></td>
            <td><code>Y4.MATH.NPV.NUMBER_LINE_SCALES</code></td>
            <td><code>ERR_INTERVAL_DECODE</code></td>
            <td>Counting tick marks by 1s instead of decoding jump size (+2, +5, +10)</td>
            <td>1x</td>
            <td><span class="badge badge-yellow">Progressing</span></td>
          </tr>
          <tr>
            <td><strong>Maya</strong></td>
            <td><code>Y4.MATH.NPV.CROSSING_ZERO</code></td>
            <td><code>ERR_FENCEPOST_COUNT</code></td>
            <td>Counting the starting tick mark instead of jumps across zero bridge</td>
            <td>1x</td>
            <td><span class="badge badge-yellow">Progressing</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Socratic Dialogue Guidance -->
    <div class="card">
      <div class="card-header">
        <h2>🧭 Socratic Dialogue Scripts for Dad</h2>
        <span class="badge badge-purple">Pedagogical Blueprint</span>
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
        <div style="background: #1e293b; padding: 16px; border-radius: 8px;">
          <div style="font-weight: 700; color: var(--green); margin-bottom: 6px;">🟢 Say This (Socratic Questioning):</div>
          <ul style="padding-left: 18px; font-size: 13px; color: #cbd5e1; display: flex; flex-direction: column; gap: 6px;">
            <li>"If there are NO hundreds mentioned in 24 thousand and sixteen, what room guardian stays in that chair?"</li>
            <li>"Think of our elevator underwater: does going deeper from -1°C to -4°C make you feel colder or warmer?"</li>
            <li>"Read that number backwards to your sister Maya and tell me what value is in the tens column."</li>
          </ul>
        </div>
        <div style="background: #1e293b; padding: 16px; border-radius: 8px;">
          <div style="font-weight: 700; color: var(--red); margin-bottom: 6px;">🔴 Avoid Saying (Working Memory Killers):</div>
          <ul style="padding-left: 18px; font-size: 13px; color: #cbd5e1; display: flex; flex-direction: column; gap: 6px;">
            <li>"No, you forgot the zero again, write a zero right there." (Destroys self-monitoring)</li>
            <li>"Hurry up, we have two minutes left!" (Induces transposition spike under ADHD pressure)</li>
            <li>"Why did you write 4 instead of 1?" (Creates cognitive freeze instead of visualization)</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Wave 21: Interactive Socratic Audio Coaching Player & Voice Diagnostic Evaluation -->
    <div class="card" style="margin-top: 24px;">
      <div class="card-header">
        <div>
          <h2>🎙️ Interactive Socratic Audio Player & Voice Drill Evaluation</h2>
          <div style="font-size: 12px; color: var(--muted);">Wave 21: Pure Vanilla JS Web Audio API & Diagnostic Reflection Engine (Zero JSX • Zero SSE)</div>
        </div>
        <div class="language-pill-group" style="display: flex; gap: 8px;">
          <button class="filter-pill active" id="btn-socratic-lang-en" onclick="setSocraticAudioLang('en')">🇬🇧 English Voice</button>
          <button class="filter-pill" id="btn-socratic-lang-ar" onclick="setSocraticAudioLang('ar')">🇪🇬 Egyptian Arabic</button>
        </div>
      </div>

      <!-- Socratic Audio Player Console -->
      <div class="socratic-player-box" style="background: rgba(15, 23, 42, 0.5); border: 1px solid var(--border); border-radius: 8px; padding: 18px; margin-bottom: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px; margin-bottom: 14px;">
          <div>
            <div style="font-weight: 700; color: var(--astryx-text-contrast); font-size: 14px;" id="socratic-prompt-title">
              Prompt 1: Place Value Room Guard (Hundreds Chair)
            </div>
            <div style="font-size: 12.5px; color: var(--muted); margin-top: 4px;" id="socratic-prompt-text">
              Ask Lara: "If there are zero hundreds in 24,106, who is guarding the hundreds chair? Can the thousands room simply crash into the tens room?"
            </div>
          </div>
          <span class="badge badge-cyan" id="socratic-student-target">Target: Lara (Y4)</span>
        </div>

        <!-- Canvas Waveform & Controls Bar -->
        <div style="display: flex; align-items: center; gap: 16px; flex-wrap: wrap;">
          <button class="btn btn-sm" id="btn-socratic-play-pause" onclick="toggleSocraticAudioPlayback()" style="width: auto; min-width: 110px; margin: 0;">
            ▶️ Play Hint
          </button>
          
          <div style="flex: 1; min-width: 240px; display: flex; flex-direction: column; gap: 4px;">
            <canvas id="socratic-waveform-canvas" width="450" height="32" style="width: 100%; height: 32px; background: rgba(0,0,0,0.2); border-radius: 4px; border: 1px solid var(--border);"></canvas>
            <div style="display: flex; justify-content: space-between; font-size: 10.5px; color: var(--muted); font-family: monospace;">
              <span id="socratic-time-current">0:00</span>
              <span id="socratic-time-duration">0:14</span>
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="font-size: 11px; color: var(--muted);">Speed:</span>
            <button class="filter-pill active" id="btn-speed-1x" onclick="setSocraticPlaybackRate(1.0)" style="padding: 2px 8px; font-size: 11px;">1.0x</button>
            <button class="filter-pill" id="btn-speed-125x" onclick="setSocraticPlaybackRate(1.25)" style="padding: 2px 8px; font-size: 11px;">1.25x</button>
          </div>
        </div>
      </div>

      <!-- Student Voice Oral Reflection Drill Canvas -->
      <div style="border-top: 1px solid var(--border); padding-top: 18px;">
        <h3 style="font-size: 14px; color: var(--astryx-text-contrast); margin-bottom: 10px; display: flex; align-items: center; gap: 8px;">
          <span>🗣️ Student Oral Response & Diagnostic Verification</span>
          <span class="badge badge-yellow">SocraticOralEvaluator</span>
        </h3>
        
        <p style="font-size: 12.5px; color: var(--muted); margin-bottom: 12px;">
          Record or transcribe the student's verbal explanation below. AIM analyzes conceptual mastery, identifies missing key vocabulary, and outputs real-time pedagogical praise or scaffolding adjustments.
        </p>

        <div style="display: flex; gap: 12px; margin-bottom: 12px; flex-wrap: wrap;">
          <button class="btn btn-outline btn-sm" id="btn-voice-record" onclick="toggleVoiceRecording()" style="width: auto; margin: 0;">
            🎙️ Simulate Voice Record
          </button>
          <button class="btn btn-sm" onclick="runOralEvaluation()" style="width: auto; margin: 0;">
            ⚡ Evaluate Conceptual Mastery
          </button>
        </div>

        <div style="margin-bottom: 14px;">
          <textarea id="oral-transcript-input" rows="2" style="width: 100%; background: var(--bg); border: 1px solid var(--border); color: var(--astryx-text-contrast); border-radius: 6px; padding: 10px; font-size: 13px; font-family: inherit; resize: vertical;" placeholder="Student transcript... (e.g. 'Zero guards the hundreds chair so the thousands do not crash into tens.')">Zero guards the hundreds chair so the thousands room does not crash into tens.</textarea>
        </div>

        <!-- Oral Evaluation Live Result Card -->
        <div id="oral-eval-result" style="display: none; background: rgba(15, 23, 42, 0.6); border: 1px solid var(--border); border-radius: 8px; padding: 16px;">
          <!-- Dynamically populated via vanilla JS -->
        </div>
      </div>
    </div>
  </div>`;
}
