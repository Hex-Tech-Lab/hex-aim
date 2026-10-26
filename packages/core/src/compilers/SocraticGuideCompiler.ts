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

    if ((guardian.arabicRequestCount || 0) >= 3) {
      return 'ar';
    }

    return guardian.preferredLanguage || 'bilingual';
  }

  /**
   * Records a language request from a parent and updates strike count and permanent preference.
   */
  public static recordLanguageRequest(
    guardian: Guardian,
    requestedLang: 'en' | 'ar' | 'bilingual'
  ): Guardian {
    const updated = { ...guardian };
    if (requestedLang === 'ar') {
      updated.arabicRequestCount = (updated.arabicRequestCount || 0) + 1;
      if (updated.arabicRequestCount >= 3) {
        updated.preferredLanguage = 'ar';
      }
    }
    return updated;
  }

  /**
   * Normalizes Egyptian Ministry of Education (MoE) clitic prefixes and diacritics.
   * Handles proclitics ("بـ", "فـ", "كـ", "لـ", "والـ", "وبـ") and tatweel characters
   * to ensure stable text layout and search tokenization without word mutilation.
   */
  public static normalizeMoEClitics(text: string): string {
    if (!text) return '';
    return text
      // Remove tatweel / kashida (\u0640)
      .replace(/\u0640+/g, '')
      // Normalize common Arabic hamzas for resilient token matching
      .replace(/[إأآ]/g, 'ا')
      .replace(/ة/g, 'ه')
      .replace(/ى/g, 'ي')
      // Standardize whitespace around clitic conjunctions
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Compiles the Socratic Parent Coaching Guide in pure HTML/CSS.
   * Supports English ('en'), Arabic ('ar'), and Side-by-Side Bilingual ('bilingual').
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

    const isArabicOnly = lang === 'ar';
    const isBilingual = lang === 'bilingual';
    const docDir = isArabicOnly ? 'rtl' : 'ltr';
    const docLang = isArabicOnly ? 'ar' : (isBilingual ? 'en' : 'en');

    const htmlContent = `<!DOCTYPE html>
<html lang="${docLang}" dir="${docDir}">
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
    font-family: 'Nunito', 'Cairo', sans-serif;
    color: #1e293b;
    margin: 0;
    padding: 0;
    font-size: 10pt;
    line-height: 1.45;
    background-color: #ffffff;
  }

  .ar-text {
    font-family: 'Cairo', sans-serif;
    direction: rtl;
    text-align: right;
  }

  .en-text {
    font-family: 'Nunito', sans-serif;
    direction: ltr;
    text-align: left;
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
    margin-bottom: 10px;
  }

  .guide-title-group h1 {
    font-size: 15pt;
    font-weight: 800;
    color: #1e3a8a;
    margin: 0;
  }

  .guide-title-group .subtitle {
    font-size: 9pt;
    color: #64748b;
    font-weight: 600;
  }

  .meta-tag {
    background: #eff6ff;
    border: 1px solid #bfdbfe;
    color: #1d4ed8;
    font-size: 9pt;
    font-weight: 700;
    padding: 4px 10px;
    border-radius: 6px;
  }

  .socratic-card {
    background: #ffffff;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    padding: 9px 12px;
    margin-bottom: 8px;
    page-break-inside: avoid;
  }

  .bilingual-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    align-items: start;
  }

  .bilingual-col-en {
    border-right: 1px dashed #cbd5e1;
    padding-right: 10px;
  }

  .bilingual-col-ar {
    padding-left: 10px;
    direction: rtl;
    text-align: right;
    font-family: 'Cairo', sans-serif;
  }

  .dialogue-box {
    background: #f8fafc;
    border-left: 4px solid #3b82f6;
    padding: 7px 10px;
    border-radius: 4px;
    margin: 4px 0;
  }

  .dialogue-box.ar {
    border-left: none;
    border-right: 4px solid #f59e0b;
  }

  .script-say {
    color: #1e40af;
    font-weight: 700;
    font-size: 9.5pt;
  }

  .script-say.ar {
    color: #b45309;
  }

  .script-listen {
    color: #047857;
    font-weight: 700;
    font-size: 9.5pt;
  }

  .rubric-box {
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    border-radius: 6px;
    padding: 6px 10px;
    margin-top: 4px;
    font-size: 9pt;
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
        <h1>🧭 ${isArabicOnly ? 'دليل التوجيه السقراطي لولي الأمر' : (isBilingual ? '🧭 Parent Socratic Guide • دليل التوجيه السقراطي' : '🧭 Parent Socratic Coaching Guide')}</h1>
        <div class="subtitle">${isArabicOnly ? 'جلسة دعم سريعة هادئة (6 إلى 8 دقائق)' : 'Targeted 6–8 Minute Micro-Remediation Companion • جلسة دعم سريعة'}</div>
      </div>
      <div class="meta-tag">
        ${isArabicOnly ? `الطالب: ${student.name} • ولي الأمر: ${coachName}` : `Student: ${student.name} • Coach: ${coachName}`}
      </div>
    </div>

    <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 7px 12px; border-radius: 6px; margin-bottom: 10px;">
      <h3 style="margin: 0 0 3px 0; color: #92400e; font-size: 10pt;">⚠️ ${isArabicOnly ? 'القاعدة الذهبية: لا تعطِ الإجابة أبداً!' : 'Golden Rule: Never Give Away the Answer! • القاعدة الذهبية: لا تعطِ الإجابة أبداً'}</h3>
      <p style="margin: 0; font-size: 9pt; color: #78350f;">
        ${isArabicOnly 
          ? 'الهدف ليس إنهاء الورقة بسرعة، بل مساعدة الطالب على اكتشاف الرابط بنفسه من خلال طرح الأسئلة الذكية. إذا واجه صعوبة، تنفس بعمق وابتسم.'
          : 'Our goal is not speed. Guide your child to discover the conceptual bridge through gentle questioning. Keep pressure at absolute zero.'}
      </p>
    </div>

    <!-- WARMUP SECTION -->
    <div class="socratic-card">
      <h3 style="margin: 0 0 6px 0; color: #1e3a8a; font-size: 11pt;">1. Warmup Socratic Bridge • تنشيط البداية الحواري</h3>
      ${isBilingual ? `
      <div class="bilingual-grid">
        <div class="bilingual-col-en">
          <div class="dialogue-box">
            <div class="script-say">What You Say:</div>
            <p style="margin: 3px 0; font-size: 9pt;">"Imagine our number lives in an apartment with reserved rooms: Ones, Tens, Hundreds, Thousands. If a room has nothing in it, does it disappear, or do we put a 0 guard in the chair?"</p>
            <div class="script-listen">What to Listen For:</div>
            <p style="margin: 3px 0; font-size: 9pt;">Listen for them identifying that omitting the 0 causes the thousands digit to collapse into hundreds.</p>
          </div>
        </div>
        <div class="bilingual-col-ar">
          <div class="dialogue-box ar">
            <div class="script-say ar">ماذا تقول لابنك/ابنتك:</div>
            <p style="margin: 3px 0; font-size: 9pt;">«تخيّل أن الأرقام تسكن في عمارة فيها غرف: آحاد، عشرات، مئات، آلاف. لو الغرفة فاضية، هل نتركها تختفي أم نضع حارساً (صفر) يحجز مكانها؟»</p>
            <div class="script-listen">ماذا تستمع له:</div>
            <p style="margin: 3px 0; font-size: 9pt;">تأكد أنه يقول «نضع الصفر حتى لا تقفز الآلاف في خانة المئات».</p>
          </div>
        </div>
      </div>
      ` : `
      <div class="dialogue-box ${isArabicOnly ? 'ar' : ''}">
        <div class="script-say ${isArabicOnly ? 'ar' : ''}">${isArabicOnly ? 'ماذا تقول لابنك/ابنتك:' : 'What You Say:'}</div>
        <p style="margin: 3px 0; font-size: 9pt;">
          ${isArabicOnly 
            ? '«تخيّل أن الأرقام تسكن في عمارة فيها غرف: آحاد، عشرات، مئات، آلاف. لو الغرفة فاضية، هل نتركها تختفي أم نضع حارساً يحجز مكانها؟»'
            : '"Imagine our number lives in an apartment with reserved rooms: Ones, Tens, Hundreds, Thousands. If a room has nothing in it, does it disappear, or do we put a 0 guard in the chair?"'}
        </p>
        <div class="script-listen">${isArabicOnly ? 'ماذا تستمع له:' : 'What to Listen For:'}</div>
        <p style="margin: 3px 0; font-size: 9pt;">
          ${isArabicOnly
            ? 'تأكد أنه يقول «نضع الصفر حتى لا تقفز الآلاف في خانة المئات».'
            : 'Listen for them identifying that omitting the 0 causes the thousands digit to collapse into the hundreds place.'}
        </p>
      </div>
      `}
    </div>

    <!-- DIALOGUE TRAP -->
    <div class="socratic-card">
      <h3 style="margin: 0 0 6px 0; color: #1e3a8a; font-size: 11pt;">2. The Phantom Zero Trap • فخ الصفر الشبح</h3>
      ${isBilingual ? `
      <div class="bilingual-grid">
        <div class="bilingual-col-en">
          <div class="dialogue-box">
            <div class="script-say">When solving (24,006):</div>
            <p style="margin: 3px 0; font-size: 9pt;">If they write 24,6, ask: "Read your number out loud... does that say twenty-four thousand, or two hundred and forty-six? Where did our Hundreds room go?"</p>
          </div>
          <div class="rubric-box">
            <strong>Model:</strong> 24,006 (2 Ten-Thous, 4 Thous, 0 Hund, 0 Tens, 6 Ones).
          </div>
        </div>
        <div class="bilingual-col-ar">
          <div class="dialogue-box ar">
            <div class="script-say ar">عند حل مسألة (24,006):</div>
            <p style="margin: 3px 0; font-size: 9pt;">لو كتب الطالب (24,6)، اسأله: «اقرأ الرقم اللي كتبته بصوت عالي... هل هذا أربعة وعشرون ألفاً أم مئتان وستة وأربعون؟ أين ذهبت غرف المئات والعشرات؟»</p>
          </div>
          <div class="rubric-box" style="direction: rtl; text-align: right;">
            <strong>الحل النموذجي:</strong> 24,006 (2 عشرات ألوف، 4 ألوف، 0 مئات، 0 عشرات، 6 آحاد).
          </div>
        </div>
      </div>
      ` : `
      <div class="dialogue-box ${isArabicOnly ? 'ar' : ''}">
        <div class="script-say ${isArabicOnly ? 'ar' : ''}">${isArabicOnly ? 'عند حل مسألة (24,006):' : 'When solving (24,006):'}</div>
        <p style="margin: 3px 0; font-size: 9pt;">
          ${isArabicOnly
            ? 'لو كتب الطالب (24,6)، اسأله: «اقرأ الرقم اللي كتبته بصوت عالي... هل هذا أربعة وعشرون ألفاً أم مئتان وستة وأربعون؟ أين ذهبت غرف المئات والعشرات؟»'
            : 'If they write 24,6, ask: "Read your number out loud... does that say twenty-four thousand, or two hundred and forty-six? Where did our Hundreds room go?"'}
        </p>
      </div>
      <div class="rubric-box">
        <strong>✅ ${isArabicOnly ? 'الإجابة النموذجية:' : 'Model Answer:'}</strong> 24,006 (2 Ten-Thousands, 4 Thousands, 0 Hundreds, 0 Tens, 6 Ones).
      </div>
      `}
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
        <h1>🎯 ${isArabicOnly ? 'معالجة الثغرات والحلول النموذجية' : (isBilingual ? '🎯 Target Gaps & Model Rubrics • معالجة الثغرات' : '🎯 Target Gaps & Model Rubrics')}</h1>
        <div class="subtitle">${isArabicOnly ? 'خطوة بخطوة للثغرات النشطة' : 'Step-by-Step Resolution for Active Priority Gaps • خطوة بخطوة'}</div>
      </div>
      <div class="meta-tag">
        ${isArabicOnly ? `الثغرات النشطة: ${gaps.length}` : `Active Gaps: ${gaps.length}`}
      </div>
    </div>

    ${gaps.slice(0, 3).map((gap, i) => `
    <div class="socratic-card">
      <h3 style="margin: 0 0 4px 0; color: #0f172a; font-size: 10.5pt;">Gap #${i + 1}: ${gap.conceptCode}</h3>
      <p style="margin: 2px 0 6px 0; color: #475569; font-size: 8.5pt;"><strong>Context:</strong> ${gap.description}</p>
      ${isBilingual ? `
      <div class="bilingual-grid">
        <div class="bilingual-col-en">
          <div class="dialogue-box">
            <div class="script-say">Guiding Question:</div>
            <p style="margin: 2px 0; font-size: 8.5pt;">
              ${gap.errorClass === 'ERR_NEGATIVE_MAGNITUDE_INVERSION'
                ? '"Imagine a winter day. Is -8°C warmer or colder than -2°C? Remember: on the negative elevator, going deeper underground makes it colder, even though 8 looks big!"'
                : gap.errorClass === 'ERR_INTERVAL_DECODE'
                ? '"Look at the marks between 0 and 100. Are they single steps, or is each jump +10?"'
                : '"Decompose the spoken number into room values before writing down the digits."'}
            </p>
          </div>
          <div class="rubric-box">
            <strong>Model:</strong> ${gap.socraticHint || 'Verify solution by decomposing digits backwards.'}
          </div>
        </div>
        <div class="bilingual-col-ar">
          <div class="dialogue-box ar">
            <div class="script-say ar">السؤال السقراطي الموجه:</div>
            <p style="margin: 2px 0; font-size: 8.5pt;">
              ${gap.errorClass === 'ERR_NEGATIVE_MAGNITUDE_INVERSION'
                ? '«تخيّل أنك في الشتاء في القاهرة والحرارة 14°، ثم دخلت فريزر درجته -6°. هل -6 أدفأ أم أبرد من -1؟ تذكر: كلما نزلنا تحت الصفر، زاد البرد!»'
                : gap.errorClass === 'ERR_INTERVAL_DECODE'
                ? '«انظر لخط الأعداد: من 0 إلى 100 كم شرطة بينهما؟ هل نعد بالواحدات أم بالعشرات؟»'
                : '«تأكد من قراءة كل كلمة وفصل الآلاف عن المئات قبل كتابة أي رقم.»'}
            </p>
          </div>
          <div class="rubric-box" style="direction: rtl; text-align: right;">
            <strong>الحل النموذجي:</strong> ${gap.socraticHint || 'وجّه الطالب لقراءة الرقم مجزأ والتأكد من حارس الصفر.'}
          </div>
        </div>
      </div>
      ` : `
      <div class="dialogue-box ${isArabicOnly ? 'ar' : ''}">
        <div class="script-say ${isArabicOnly ? 'ar' : ''}">${isArabicOnly ? 'السؤال السقراطي الموجه:' : 'Guiding Socratic Question:'}</div>
        <p style="margin: 2px 0; font-size: 9pt;">
          ${gap.errorClass === 'ERR_NEGATIVE_MAGNITUDE_INVERSION' 
            ? (isArabicOnly 
                ? '«تخيّل أنك في الشتاء في القاهرة ودرجة الحرارة 14°، ثم دخلت فريزر المعمل ودرجته -6°. هل -6 أدفأ أم أبرد من -1؟ تذكر: كلما نزلنا تحت الصفر، زاد البرد!»'
                : '"Imagine a winter day. Is -8°C warmer or colder than -2°C? Remember: on the negative elevator, going deeper underground makes it colder, even though the digit 8 looks big!"')
            : gap.errorClass === 'ERR_INTERVAL_DECODE'
            ? (isArabicOnly
                ? '«انظر لخط الأعداد: من 0 إلى 100 كم شرطة بينهما؟ هل نعد بالواحدات أم بالعشرات؟»'
                : '"Look at the marks between 0 and 100. Are they single steps, or is each jump +10?"')
            : (isArabicOnly
                ? '«تأكد من قراءة كل كلمة وفصل الآلاف عن المئات قبل كتابة أي رقم.»'
                : '"Decompose the spoken number into room values before writing down the digits."')}
        </p>
      </div>
      <div class="rubric-box">
        <strong>${isArabicOnly ? 'الحل النموذجي والتبرير:' : 'Model Rubric & Reasoning:'}</strong><br>
        ${gap.socraticHint || 'Guide the student to verify their solution by reading the finished number backwards.'}
      </div>
      `}
    </div>
    `).join('')}

    <div class="socratic-card" style="background: #f8fafc; margin-top: 8px;">
      <h4 style="margin: 0 0 3px 0; color: #334155; font-size: 9.5pt;">${isArabicOnly ? 'ملاحظة نهاية الجلسة:' : 'Closing the Micro-Session • ختام الجلسة'}</h4>
      <p style="margin: 0; font-size: 8.5pt; color: #64748b;">
        ${isArabicOnly
          ? 'بمجرد انتهاء الـ 8 دقائق، امتدح المجهود والتركيز أياً كانت النتيجة. اضغط على رابط التقرير وسجل أن الثغرة قيد التحسن.'
          : 'When the timer dings, celebrate your child’s effort and focus regardless of score. Log completion to update zero-alarm mastery.'}
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
