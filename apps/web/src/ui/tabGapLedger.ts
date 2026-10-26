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
  </div>`;
}
