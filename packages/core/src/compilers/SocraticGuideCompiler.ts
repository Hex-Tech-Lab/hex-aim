import type { Student, CognitiveGap, Guardian, CoachingGuide } from '@hex-aim/types';

export interface SocraticGuideOptions {
  date?: string;
  language?: 'en' | 'ar' | 'bilingual';
  guardianName?: string;
}

export class SocraticGuideCompiler {
  /**
   * Evaluates the 3-Strike Rule for Guardian language preference.
   * If a parent requests Arabic 3 times, their profile defaults permanently to Arabic.
   */
  public static resolveLanguage(
    guardian?: Guardian,
    explicitLang?: 'en' | 'ar' | 'bilingual'
  ): 'en' | 'ar' | 'bilingual' {
    if (explicitLang) return explicitLang;
    if (!guardian) return 'bilingual';

    if (guardian.arabicRequestCount >= 3) {
      return 'ar';
    }

    return guardian.preferredLanguage || 'bilingual';
  }

  /**
   * Compiles the Socratic Parent Coaching Guide in pure HTML/CSS.
   */
  public static compile(
    student: Student,
    gaps: CognitiveGap[],
    guardian?: Guardian,
    options: SocraticGuideOptions = {}
  ): CoachingGuide {
    const guideDate = options.date || new Date().toISOString().split('T')[0]!;
    const lang = this.resolveLanguage(guardian, options.language);
    const guideId = `guide_${student.id}_${guideDate}_${Date.now()}`;
    const coachName = options.guardianName || guardian?.name || 'Parent Coach';

    const isArabic = lang === 'ar';

    const htmlContent = `<!DOCTYPE html>
<html lang="${isArabic ? 'ar' : 'en'}" dir="${isArabic ? 'rtl' : 'ltr'}">
<head>
<meta charset="UTF-8">
<title>Socratic Coaching Guide - ${student.name} (${student.yearGroup})</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&family=Nunito:wght@400;600;700;800;900&display=swap');

  @page {
    size: A4 portrait;
    margin: 10mm 14mm 10mm 14mm;
  }

  * {
    box-sizing: border-box;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  body {
    font-family: ${isArabic ? "'Cairo', sans-serif" : "'Nunito', 'Cairo', sans-serif"};
    color: #1e293b;
    margin: 0;
    padding: 0;
    font-size: 10.5pt;
    line-height: 1.45;
    background-color: #ffffff;
  }

  .page {
    page-break-after: always;
    height: 275mm;
    max-height: 275mm;
    overflow: hidden;
    position: relative;
    padding-top: 2mm;
  }

  .page:last-child {
    page-break-after: avoid;
  }

  .guide-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 3px solid #1e3a8a;
    padding-bottom: 6px;
    margin-bottom: 12px;
  }

  .guide-title-group h1 {
    font-size: 16pt;
    font-weight: 800;
    color: #1e3a8a;
    margin: 0;
  }

  .guide-title-group .subtitle {
    font-size: 9.5pt;
    color: #64748b;
    font-weight: 600;
  }

  .meta-tag {
    background: #eff6ff;
    border: 1px solid #bfdbfe;
    color: #1d4ed8;
    font-size: 9.5pt;
    font-weight: 700;
    padding: 4px 10px;
    border-radius: 6px;
  }

  .socratic-card {
    background: #ffffff;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    padding: 10px 14px;
    margin-bottom: 10px;
  }

  .dialogue-box {
    background: #f8fafc;
    border-left: ${isArabic ? 'none' : '4px solid #3b82f6'};
    border-right: ${isArabic ? '4px solid #3b82f6' : 'none'};
    padding: 8px 12px;
    border-radius: 4px;
    margin: 6px 0;
  }

  .script-say {
    color: #1e40af;
    font-weight: 700;
  }

  .script-listen {
    color: #b45309;
    font-weight: 700;
  }

  .rubric-box {
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    border-radius: 6px;
    padding: 8px 12px;
    margin-top: 6px;
  }

  .bilingual-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .page-footer {
    position: absolute;
    bottom: 2mm;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    font-size: 8.5pt;
    color: #94a3b8;
    border-top: 1px solid #e2e8f0;
    padding-top: 4px;
  }
</style>
</head>
<body>

  <!-- PAGE 1: COACHING PHILOSOPHY & WARMUP SCRIPTS -->
  <div class="page">
    <div class="guide-header">
      <div class="guide-title-group">
        <h1>🧭 ${isArabic ? 'دليل التوجيه السقراطي لولي الأمر' : "Parent Socratic Coaching Guide"}</h1>
        <div class="subtitle">${isArabic ? 'جلسة دعم سريعة هادئة (6 إلى 8 دقائق)' : 'Targeted 6–8 Minute Micro-Remediation Companion'}</div>
      </div>
      <div class="meta-tag">
        ${isArabic ? `الطالب: ${student.name} • ولي الأمر: ${coachName}` : `Student: ${student.name} • Coach: ${coachName}`}
      </div>
    </div>

    <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 8px 12px; border-radius: 6px; margin-bottom: 12px;">
      <h3 style="margin: 0 0 4px 0; color: #92400e;">⚠️ ${isArabic ? 'القاعدة الذهبية: لا تعطِ الإجابة أبداً!' : 'Golden Rule: Never Give Away the Answer!'}</h3>
      <p style="margin: 0; font-size: 9.5pt; color: #78350f;">
        ${isArabic 
          ? 'الهدف ليس إنهاء الورقة بسرعة، بل مساعدة الطالب على اكتشاف الرابط بنفسه من خلال طرح الأسئلة الذكية. إذا واجه صعوبة، تنفس بعمق وابتسم.'
          : 'Our goal is not speed or finishing early. It is guiding your child to discover the conceptual bridge through gentle questioning. Keep emotional pressure at absolute zero.'}
      </p>
    </div>

    <div class="socratic-card">
      <h3 style="margin: 0 0 6px 0; color: #1e3a8a;">1. ${isArabic ? 'تنشيط البداية (Place Value Elevator)' : 'Phase 1: Warmup Socratic Bridge'}</h3>
      <div class="dialogue-box">
        <div class="script-say">${isArabic ? 'ماذا تقول لابنك/ابنتك:' : 'What You Say:'}</div>
        <p style="margin: 4px 0;">
          ${isArabic 
            ? '«تخيّل أن الأرقام تسكن في عمارة فيها غرف: آحاد، عشرات، مئات، آلاف. لو الغرفة فاضية، هل نتركها تختفي أم نضع حارساً يحجز مكانها؟»'
            : '"Imagine our number lives in an apartment with reserved rooms: Ones, Tens, Hundreds, Thousands. If a room has nothing in it, does it disappear, or do we put a 0 guard in the chair?"'}
        </p>
        <div class="script-listen">${isArabic ? 'ماذا تستمع له:' : 'What to Listen For:'}</div>
        <p style="margin: 4px 0;">
          ${isArabic
            ? 'تأكد أنه يقول «نضع الصفر حتى لا تقفز الآلاف في خانة المئات».'
            : 'Listen for them identifying that omitting the 0 causes the thousands digit to collapse into the hundreds place.'}
        </p>
      </div>
    </div>

    <div class="socratic-card">
      <h3 style="margin: 0 0 6px 0; color: #1e3a8a;">2. ${isArabic ? 'سؤال اختبار الحارس (The Phantom Zero Trap)' : 'The Phantom Zero Dialogue'}</h3>
      <div class="dialogue-box">
        <div class="script-say">${isArabic ? 'عند حل مسألة (24,006):' : 'When solving (24,006):'}</div>
        <p style="margin: 4px 0;">
          ${isArabic
            ? 'لو كتب الطالب (24,6)، اسأله: «اقرأ الرقم اللي كتبته بصوت عالي... هل هذا أربعة وعشرون ألفاً أم مئتان وستة وأربعون؟ أين ذهبت غرف المئات والعشرات؟»'
            : 'If they write 24,16 or 24,6, ask: "Read your number out loud... does that say twenty-four thousand, or two hundred and forty-six? Where did our Hundreds room go?"'}
        </p>
      </div>
      <div class="rubric-box">
        <strong>✅ ${isArabic ? 'الإجابة الصحيحة النموذجية:' : 'Model Answer:'}</strong> 24,006 (2 Ten-Thousands, 4 Thousands, 0 Hundreds, 0 Tens, 6 Ones).
      </div>
    </div>

    <div class="page-footer">
      <span>HEX-AIM Socratic Guide • Confidential Parent Resource</span>
      <span>Page 1 of 2</span>
    </div>
  </div>

  <!-- PAGE 2: TARGETED GAPS & NEGATIVE NUMBERS RUBRIC -->
  <div class="page">
    <div class="guide-header">
      <div class="guide-title-group">
        <h1>🎯 ${isArabic ? 'معالجة الثغرات والحلول النموذجية' : 'Target Gaps & Model Rubrics'}</h1>
        <div class="subtitle">${isArabic ? 'خطوة بخطوة للثغرات النشطة' : 'Step-by-Step Resolution for Active Priority Gaps'}</div>
      </div>
      <div class="meta-tag">
        ${isArabic ? `الثغرات النشطة: ${gaps.length}` : `Active Gaps: ${gaps.length}`}
      </div>
    </div>

    ${gaps.map((gap, i) => `
    <div class="socratic-card">
      <h3 style="margin: 0 0 6px 0; color: #0f172a;">Gap #${i + 1}: ${gap.conceptCode}</h3>
      <p style="margin: 4px 0; color: #475569;"><strong>${isArabic ? 'الوصف التربوي:' : 'Pedagogical Context:'}</strong> ${gap.description}</p>
      <div class="dialogue-box">
        <div class="script-say">${isArabic ? 'السؤال السقراطي الموجه:' : 'Guiding Socratic Question:'}</div>
        <p style="margin: 4px 0;">
          ${gap.errorClass === 'ERR_NEGATIVE_MAGNITUDE_INVERSION' 
            ? (isArabic 
                ? '«تخيّل أنك في الشتاء في القاهرة ودرجة الحرارة 14°، ثم دخلت فريزر المعمل ودرجته -6°. هل -6 أدفأ أم أبرد من -1؟ تذكر: كلما نزلنا تحت الصفر، زاد البرد!»'
                : '"Imagine a winter day. Is -8°C warmer or colder than -2°C? Remember: on the negative elevator, going deeper underground makes it colder, even though the digit 8 looks big!"')
            : gap.errorClass === 'ERR_INTERVAL_DECODE'
            ? (isArabic
                ? '«انظر لخط الأعداد: من 0 إلى 100 كم شرطة بينهما؟ هل نعد بالواحدات أم بالعشرات؟»'
                : '"Look at the marks between 0 and 100. Are they single steps, or is each jump +10?"')
            : (isArabic
                ? '«تأكد من قراءة كل كلمة وفصل الآلاف عن المئات قبل كتابة أي رقم.»'
                : '"Decompose the spoken number into room values before writing down the digits."')}
        </p>
      </div>
      <div class="rubric-box">
        <strong>${isArabic ? 'الحل النموذجي والتبرير:' : 'Model Rubric & Reasoning:'}</strong><br>
        ${gap.socraticHint || 'Guide the student to verify their solution by reading the finished number backwards.'}
      </div>
    </div>
    `).join('')}

    <div class="socratic-card" style="background: #f8fafc; margin-top: 10px;">
      <h4 style="margin: 0 0 4px 0; color: #334155;">${isArabic ? 'ملاحظة نهاية الجلسة:' : 'Closing the 8-Minute Session:'}</h4>
      <p style="margin: 0; font-size: 9.5pt; color: #64748b;">
        ${isArabic
          ? 'بمجرد انتهاء الـ 8 دقائق، امتدح المجهود والتركيز أياً كانت النتيجة. اضغط على رابط التقرير وسجل أن الثغرة قيد التحسن.'
          : 'When the 8-minute timer dings, celebrate your child’s effort and focus regardless of score. Log the completion to update their zero-alarm progress record.'}
      </p>
    </div>

    <div class="page-footer">
      <span>HEX-AIM Adaptive Mastery Engine</span>
      <span>Page 2 of 2</span>
    </div>
  </div>

</body>
</html>`;

    return {
      id: guideId,
      sprintId: `sprint_${student.id}_${guideDate}`,
      studentId: student.id,
      studentName: student.name,
      language: lang,
      htmlContent,
    };
  }
}
