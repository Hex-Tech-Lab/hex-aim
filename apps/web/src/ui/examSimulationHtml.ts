import type { ExamSimulationConfig } from '@hex-aim/types';
import { renderUniversalHeader, renderUniversalHeaderScripts } from './universalHeader.js';
import { renderDashboardStyles } from './dashboardStyles.js';

export function renderExamSimulationHtml(exam: ExamSimulationConfig, studentId: string = 'lara'): string {
  const studentName = studentId.toLowerCase() === 'maya' ? 'Maya' : 'Lara';
  const isLara = studentName === 'Lara';

  const universalHeaderHtml = renderUniversalHeader({
    activePortal: 'exam',
    breadcrumb: {
      returnUrl: '/',
      returnLabelEn: '← Console',
      returnLabelAr: '→ لوحة التحكم',
      currentEn: `${exam.title} • Year ${exam.yearGroup} (${studentName})`,
      currentAr: `${exam.title} • الصف الرابع (${isLara ? 'لارا' : 'مايا'})`,
      badgeTextEn: 'Wave 26 Simulator',
      badgeTextAr: 'المرحلة ٢٦ محاكي',
      actions: [
        {
          labelEn: '🌿 Pause & Breathe',
          labelAr: '🌿 استراحة وتنفس',
          onClick: 'triggerMindfulBreak()',
          primary: false,
          icon: 'coffee'
        }
      ]
    }
  });

  return `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${exam.title} | AIM Exam Simulator</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Cairo:wght@400;600;700&display=swap" rel="stylesheet">
  <script src="https://unpkg.com/lucide@latest"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            'astryx-bg': '#090d16',
            'astryx-surface': '#0e1526',
            'astryx-card': '#131b2e',
            'astryx-cyan': '#00e5ff',
          }
        }
      }
    };
  </script>
  ${renderDashboardStyles()}
  <style>
    .timer-badge {
      font-family: var(--astryx-font-mono, monospace);
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--cyan);
      background: rgba(6, 182, 212, 0.1);
      border: 1px solid rgba(6, 182, 212, 0.3);
      padding: 4px 12px;
      border-radius: 6px;
      display: inline-flex;
      align-items: center;
    }
    .timer-badge.warning {
      color: var(--orange, #f97316);
      background: rgba(249, 115, 22, 0.1);
      border-color: rgba(249, 115, 22, 0.3);
    }
    .exam-container {
      max-width: 860px;
      width: 100%;
      margin: 24px auto 48px auto;
      padding: 0 20px;
      flex: 1;
    }
    .exam-header {
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--card-border, #1f2937);
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .exam-title {
      font-size: 1.4rem;
      font-weight: 800;
      color: var(--astryx-text-contrast, #fff);
    }
    .exam-subtitle {
      font-size: 0.88rem;
      color: var(--muted);
      margin-top: 4px;
    }
    .q-card {
      background: var(--card-bg, #111827);
      border: 1px solid var(--card-border, #1f2937);
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
      font-family: var(--astryx-font-mono, monospace);
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
    .options-grid {
      display: grid;
      gap: 10px;
    }
    .opt-label {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      background: var(--card-elevated, #0b0f19);
      border: 1px solid var(--card-border, #1f2937);
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.95rem;
      transition: all 0.15s;
    }
    .opt-label:hover {
      border-color: var(--cyan);
      background: rgba(6, 182, 212, 0.05);
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
    .btn-submit {
      width: 100%;
      padding: 16px;
      background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);
      color: #fff;
      font-size: 1.05rem;
      font-weight: 700;
      border: none;
      border-radius: 10px;
      cursor: pointer;
      box-shadow: 0 4px 15px rgba(6, 182, 212, 0.3);
      transition: all 0.2s;
    }
    .btn-submit:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(6, 182, 212, 0.45);
    }
    /* ADHD Mindful Break Modal */
    .breathe-modal {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(5, 8, 15, 0.92);
      backdrop-filter: blur(12px);
      z-index: 100;
      align-items: center;
      justify-content: center;
      flex-direction: column;
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
  ${universalHeaderHtml}

  <div class="exam-container">
    <div class="exam-header">
      <div>
        <div class="exam-title">${exam.title}</div>
        <div class="exam-subtitle">
          <span class="lang-en-only">Year ${exam.yearGroup} British Curriculum • Term 1 Diagnostic Assessment</span>
          <span class="lang-ar-only">المنهاج البريطاني للصف الرابع • تقييم تشخيصي لمنتصف الفصل الأول</span>
        </div>
      </div>
      <div style="display: flex; align-items: center; gap: 12px;">
        <div class="timer-badge" id="exam-timer">${Math.floor(exam.totalTimeMins)}:00</div>
      </div>
    </div>

    <form id="exam-form" onsubmit="submitExam(event)">
      ${exam.questions.map(q => `
        <div class="q-card" id="card-${q.id}">
          <div class="q-header">
            <span class="q-num"><span class="lang-en-only">Question ${q.questionNumber}</span><span class="lang-ar-only">السؤال ${q.questionNumber}</span></span>
            <span class="q-points">${q.points} <span class="lang-en-only">Points</span><span class="lang-ar-only">درجات</span></span>
          </div>
          <div class="q-prompt">
            <span class="lang-en-only">${q.promptText}</span>
            <span class="lang-ar-only">${q.promptTextAr || q.promptText}</span>
          </div>

          <div class="options-grid">
            ${(q.options || []).map(opt => `
              <label class="opt-label" id="label-${q.id}-${opt.key}">
                <input type="radio" name="${q.id}" value="${opt.key}" onchange="selectOption('${q.id}', '${opt.key}')">
                <span>
                  <strong>${opt.key}.</strong>
                  <span class="lang-en-only">${opt.text}</span>
                  <span class="lang-ar-only">${opt.textAr || opt.text}</span>
                </span>
              </label>
            `).join('')}
          </div>
        </div>
      `).join('')}

      <button type="submit" class="btn-submit" id="btn-submit">
        <span class="lang-en-only">✓ Submit Completed Assessment</span>
        <span class="lang-ar-only">✓ إرسال التقييم النهائي والتصحيح</span>
      </button>
    </form>
  </div>

  <!-- ADHD Mindful Break Overlay Modal -->
  <div class="breathe-modal" id="breathe-modal">
    <div style="text-align: center; max-width: 480px; padding: 20px;">
      <h2 style="font-size: 1.5rem; font-weight: 800; color: #fff;">
        <span class="lang-en-only">Mindful Sensory Break</span>
        <span class="lang-ar-only">استراحة تنفس وتركيز</span>
      </h2>
      <p style="color: var(--muted); font-size: 0.95rem; margin-top: 8px;">
        <span class="lang-en-only">5-minute interval reached. Reset your focus before continuing.</span>
        <span class="lang-ar-only">وصلت إلى استراحة الـ ٥ دقائق المخصصة لتصفية الذهن قبل المتابعة.</span>
      </p>

      <div class="breathe-circle" id="breathe-text">
        <span class="lang-en-only">Breathe In...</span>
        <span class="lang-ar-only">شهيق هادئ...</span>
      </div>

      <div style="color: var(--cyan); font-family: var(--astryx-font-mono, monospace); font-size: 1.25rem; font-weight: 700; margin-bottom: 24px;" id="breathe-countdown">30s remaining</div>

      <button onclick="resumeExam()" style="background: transparent; border: 1px solid var(--card-border, #374151); color: var(--muted); padding: 8px 16px; border-radius: 6px; font-size: 12px; cursor: pointer;">
        <span class="lang-en-only">Skip Break & Continue</span>
        <span class="lang-ar-only">تخطي الاستراحة والمتابعة</span>
      </button>
    </div>
  </div>

  <script>
    ${renderUniversalHeaderScripts()}

    const examId = '${exam.examId}';
    const studentId = '${studentId}';
    let durationSeconds = ${exam.totalTimeMins * 60};
    let timeSpent = 0;
    let isPaused = false;
    let pausesCount = 0;
    let answers = {};

    const timerEl = document.getElementById('exam-timer');
    const timerInterval = setInterval(() => {
      if (isPaused) return;
      durationSeconds--;
      timeSpent++;

      const mins = Math.floor(durationSeconds / 60);
      const secs = durationSeconds % 60;
      if (timerEl) {
        timerEl.innerText = mins + ':' + (secs < 10 ? '0' : '') + secs;
        if (durationSeconds <= 300) {
          timerEl.classList.add('warning');
        }
      }

      // Check for 5m ADHD Mindful Pause Interval
      if (timeSpent > 0 && timeSpent % 300 === 0) {
        triggerMindfulBreak();
      }

      if (durationSeconds <= 0) {
        clearInterval(timerInterval);
        submitExam();
      }
    }, 1000);

    function selectOption(qId, key) {
      answers[qId] = key;
      const card = document.getElementById('card-' + qId);
      if (card) card.classList.add('answered');
    }

    let breatheTimer = null;
    function triggerMindfulBreak() {
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
          alert('🎉 Exam Completed!\\n\\nScore: ' + data.result.percentage + '% (' + data.result.score + '/' + data.result.totalPoints + ')\\nPauses Taken: ' + data.result.adhdPausesTaken + '\\n\\n' + (data.result.feedback.en || ''));
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
