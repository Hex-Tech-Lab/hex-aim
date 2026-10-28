import type { ExamSimulationConfig } from '@hex-aim/types';

export function renderExamSimulationHtml(exam: ExamSimulationConfig, studentId: string = 'lara'): string {
  const studentName = studentId.toLowerCase() === 'maya' ? 'Maya' : 'Lara';
  const isLara = studentName === 'Lara';

  return `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${exam.title} | AIM Exam Simulator</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Cairo:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #0b0f19;
      --card-bg: #111827;
      --border: #1f2937;
      --text: #f3f4f6;
      --muted: #9ca3af;
      --cyan: #06b6d4;
      --green: #10b981;
      --purple: #a855f7;
      --orange: #f97316;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
      background: var(--bg);
      color: var(--text);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    body.lang-ar {
      font-family: 'Cairo', 'Plus Jakarta Sans', sans-serif;
    }
    .hud {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 24px;
      background: rgba(17, 24, 39, 0.85);
      backdrop-filter: blur(8px);
      border-bottom: 1px solid var(--border);
      position: sticky;
      top: 0;
      z-index: 50;
    }
    .hud-left {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .back-btn {
      color: var(--muted);
      text-decoration: none;
      font-size: 13px;
      padding: 6px 12px;
      border: 1px solid var(--border);
      border-radius: 6px;
      transition: all 0.2s;
    }
    .back-btn:hover {
      color: var(--text);
      border-color: var(--cyan);
    }
    .timer-badge {
      font-family: 'JetBrains Mono', monospace;
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--cyan);
      background: rgba(6, 182, 212, 0.1);
      border: 1px solid rgba(6, 182, 212, 0.3);
      padding: 6px 14px;
      border-radius: 8px;
    }
    .timer-badge.warning {
      color: var(--orange);
      background: rgba(249, 115, 22, 0.1);
      border-color: rgba(249, 115, 22, 0.3);
    }
    .btn-pause {
      background: rgba(168, 85, 247, 0.15);
      border: 1px solid rgba(168, 85, 247, 0.4);
      color: #d8b4fe;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .btn-pause:hover {
      background: rgba(168, 85, 247, 0.25);
    }
    .container {
      max-width: 840px;
      width: 100%;
      margin: 32px auto;
      padding: 0 20px;
      flex: 1;
    }
    .exam-header {
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--border);
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .exam-title {
      font-size: 1.4rem;
      font-weight: 800;
      color: #fff;
    }
    .exam-subtitle {
      font-size: 0.88rem;
      color: var(--muted);
      margin-top: 4px;
    }
    .q-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 24px;
      transition: border-color 0.2s;
    }
    .q-card.answered {
      border-color: rgba(16, 185, 129, 0.4);
    }
    .q-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 14px;
    }
    .q-num {
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      font-weight: 700;
      color: var(--cyan);
      background: rgba(6, 182, 212, 0.1);
      padding: 4px 8px;
      border-radius: 4px;
    }
    .q-points {
      font-size: 12px;
      color: var(--muted);
    }
    .q-prompt {
      font-size: 1.05rem;
      font-weight: 600;
      line-height: 1.5;
      margin-bottom: 16px;
    }
    .q-prompt-ar {
      font-size: 0.95rem;
      color: #38bdf8;
      margin-top: 6px;
      display: block;
    }
    .options-grid {
      display: grid;
      gap: 10px;
    }
    .opt-label {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      background: #0b0f19;
      border: 1px solid var(--border);
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.95rem;
      transition: all 0.15s;
    }
    .opt-label:hover {
      border-color: #374151;
      background: #131b2e;
    }
    .opt-label input[type="radio"] {
      appearance: none;
      width: 18px;
      height: 18px;
      border: 2px solid var(--muted);
      border-radius: 50%;
      outline: none;
      cursor: pointer;
      position: relative;
    }
    .opt-label input[type="radio"]:checked {
      border-color: var(--cyan);
      background: var(--cyan);
    }
    .opt-label.selected {
      border-color: var(--cyan);
      background: rgba(6, 182, 212, 0.08);
    }
    .btn-submit {
      display: block;
      width: 100%;
      padding: 16px;
      background: linear-gradient(135deg, #06b6d4, #0284c7);
      color: #fff;
      font-size: 1.05rem;
      font-weight: 700;
      border: none;
      border-radius: 10px;
      cursor: pointer;
      transition: opacity 0.2s;
      margin-bottom: 48px;
    }
    .btn-submit:hover {
      opacity: 0.92;
    }
    /* ADHD Calm Breathing Modal */
    .breathe-modal {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(11, 15, 25, 0.94);
      backdrop-filter: blur(12px);
      z-index: 100;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      text-align: center;
      padding: 24px;
    }
    .breathe-modal.active {
      display: flex;
    }
    .breathe-circle {
      width: 160px;
      height: 160px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(6, 182, 212, 0.3) 0%, rgba(168, 85, 247, 0.1) 70%);
      border: 3px solid rgba(6, 182, 212, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 32px 0;
      animation: breatheAnim 8s infinite ease-in-out;
      font-size: 1.1rem;
      font-weight: 700;
      color: #a5f3fc;
    }
    @keyframes breatheAnim {
      0%, 100% { transform: scale(0.85); border-color: rgba(6, 182, 212, 0.4); }
      50% { transform: scale(1.25); border-color: rgba(168, 85, 247, 0.8); }
    }
  </style>
</head>
<body>
  <div class="hud">
    <div class="hud-left">
      <a href="/" class="back-btn">← Console</a>
      <div>
        <strong style="font-size: 0.95rem;">${exam.title}</strong>
        <span style="font-size: 11px; color: var(--muted); margin-left: 8px;">Year ${exam.yearGroup} • ${isLara ? '👧 Lara' : '👧 Maya'}</span>
      </div>
    </div>
    <div style="display: flex; align-items: center; gap: 12px;">
      <button class="btn-pause" onclick="triggerBreathePause()">🧘 Pause & Breathe</button>
      <div id="exam-timer" class="timer-badge">15:00</div>
    </div>
  </div>

  <div class="container">
    <div class="exam-header">
      <div>
        <h1 class="exam-title">${exam.title}</h1>
        <p class="exam-subtitle">${exam.titleAr}</p>
      </div>
      <span style="font-size: 12px; background: rgba(16, 185, 129, 0.1); color: var(--green); padding: 4px 10px; border-radius: 20px; border: 1px solid rgba(16, 185, 129, 0.3);">
        ✓ ADHD Paced: 5m Breaks
      </span>
    </div>

    <form id="exam-form" onsubmit="submitExam(event)">
      ${exam.questions.map(q => `
        <div class="q-card" id="card-${q.id}">
          <div class="q-header">
            <span class="q-num">Question ${q.questionNumber}</span>
            <span class="q-points">${q.points} Points</span>
          </div>
          <div class="q-prompt">
            ${q.promptText}
            ${q.promptTextAr ? `<span class="q-prompt-ar">🇸🇦 ${q.promptTextAr}</span>` : ''}
          </div>
          <div class="options-grid">
            ${(q.options || []).map(opt => `
              <label class="opt-label" id="label-${q.id}-${opt.key}">
                <input type="radio" name="${q.id}" value="${opt.key}" onchange="selectOption('${q.id}', '${opt.key}')">
                <span><strong>${opt.key}.</strong> ${opt.text} ${opt.textAr ? `<em style="color: #94a3b8; font-size: 0.85rem;">(${opt.textAr})</em>` : ''}</span>
              </label>
            `).join('')}
          </div>
        </div>
      `).join('')}

      <button type="submit" class="btn-submit" id="btn-submit">
        ✓ Complete & Submit Exam
      </button>
    </form>
  </div>

  <!-- ADHD Pause & Breathe Modal -->
  <div id="breathe-modal" class="breathe-modal">
    <h2 style="font-size: 1.8rem; font-weight: 800; color: #fff;">Calm Sensory Break</h2>
    <p style="color: var(--muted); margin-top: 8px;">Take a slow breath. Your exam timer is safely paused.</p>
    <div class="breathe-circle" id="breathe-text">Breathe In...</div>
    <div style="font-family: 'JetBrains Mono', monospace; font-size: 1.2rem; color: var(--cyan); margin-bottom: 24px;" id="breathe-countdown">30s remaining</div>
    <button class="back-btn" style="padding: 10px 24px; font-size: 14px; font-weight: 700; color: #fff; background: var(--cyan); border: none;" onclick="resumeExam()">
      Resume Exam
    </button>
  </div>

  <script>
    const examId = '${exam.examId}';
    const studentId = '${studentId}';
    let totalSeconds = ${exam.totalTimeMins * 60};
    let timeSpent = 0;
    let isPaused = false;
    let pausesCount = 0;
    let answers = {};

    // Auto-restore saved answers
    try {
      const saved = localStorage.getItem('aim_exam_' + examId);
      if (saved) {
        answers = JSON.parse(saved);
        Object.keys(answers).forEach(qid => {
          selectOption(qid, answers[qid], false);
          const radio = document.querySelector('input[name="' + qid + '"][value="' + answers[qid] + '"]');
          if (radio) radio.checked = true;
        });
      }
    } catch (e) {}

    // Countdown Timer Loop
    const timerInterval = setInterval(() => {
      if (isPaused) return;
      totalSeconds--;
      timeSpent++;

      const mins = Math.floor(totalSeconds / 60);
      const secs = totalSeconds % 60;
      const timerEl = document.getElementById('exam-timer');
      if (timerEl) {
        timerEl.innerText = String(mins).padStart(2, '0') + ':' + String(secs).padStart(2, '0');
        if (totalSeconds < 180) timerEl.classList.add('warning');
      }

      // ADHD 5-minute automatic mindful pause
      if (timeSpent > 0 && timeSpent % 300 === 0) {
        triggerBreathePause();
      }

      if (totalSeconds <= 0) {
        clearInterval(timerInterval);
        submitExam(new Event('submit'));
      }
    }, 1000);

    function selectOption(qid, val, save = true) {
      answers[qid] = val;
      if (save) {
        try { localStorage.setItem('aim_exam_' + examId, JSON.stringify(answers)); } catch (e) {}
      }
      const card = document.getElementById('card-' + qid);
      if (card) card.classList.add('answered');

      const labels = card.querySelectorAll('.opt-label');
      labels.forEach(l => l.classList.remove('selected'));
      const activeLabel = document.getElementById('label-' + qid + '-' + val);
      if (activeLabel) activeLabel.classList.add('selected');
    }

    let breatheTimer = null;
    function triggerBreathePause() {
      isPaused = true;
      pausesCount++;
      const modal = document.getElementById('breathe-modal');
      modal.classList.add('active');

      let remaining = 30;
      const countEl = document.getElementById('breathe-countdown');
      const textEl = document.getElementById('breathe-text');

      clearInterval(breatheTimer);
      breatheTimer = setInterval(() => {
        remaining--;
        if (countEl) countEl.innerText = remaining + 's remaining';
        if (remaining % 8 >= 4) {
          if (textEl) textEl.innerText = 'Breathe Out...';
        } else {
          if (textEl) textEl.innerText = 'Breathe In...';
        }
        if (remaining <= 0) {
          resumeExam();
        }
      }, 1000);
    }

    function resumeExam() {
      clearInterval(breatheTimer);
      isPaused = false;
      const modal = document.getElementById('breathe-modal');
      modal.classList.remove('active');
    }

    async function submitExam(e) {
      if (e) e.preventDefault();
      clearInterval(timerInterval);

      const btn = document.getElementById('btn-submit');
      if (btn) btn.innerText = 'Submitting Assessment...';

      try {
        const res = await fetch('/api/exam/' + examId + '/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            studentId,
            answers,
            timeSpentSeconds: timeSpent,
            adhdPausesTaken: pausesCount
          })
        });

        const data = await res.json();
        if (data.ok && data.result) {
          localStorage.removeItem('aim_exam_' + examId);
          alert('🎉 Exam Completed!\\n\\nScore: ' + data.result.percentage + '% (' + data.result.score + '/' + data.result.totalPoints + ')\\nPauses Taken: ' + data.result.adhdPausesTaken + '\\n\\n' + data.result.feedback.en);
          window.location.href = '/';
        }
      } catch (err) {
        alert('Assessment submitted locally. Returning to console.');
        window.location.href = '/';
      }
    }
  </script>
</body>
</html>`;
}
