import type { IStoragePort, IMessagingPort } from '@hex-aim/types';
import { renderSubjectOverview, topErrors } from '@hex-aim/core';
import { purgeAndResetSession, resetSessionOnly, getChatLanguage, setChatLanguage, type SessionContext } from './sessionHandler.js';
import { processAssessmentJob } from '../jobs/processAssessment.js';
import { PERSISTENT_REPLY_KEYBOARD_EN, PERSISTENT_REPLY_KEYBOARD_AR } from '../keyboards.js';

export interface CallbackHandlerContext extends SessionContext {
  storage: IStoragePort;
  messaging: IMessagingPort;
  telegramBotToken?: string;
}

export async function handleCallbackQuery(
  callbackQuery: any,
  ctx: CallbackHandlerContext
): Promise<Response> {
  const { storage, messaging, telegramBotToken, sendAndTrack } = ctx;
  const callbackData = String(callbackQuery.data || '');
  const cbChatId = String(callbackQuery.message?.chat?.id || '');

  // Answer callback to dismiss Telegram client spinner
  if (telegramBotToken) {
    await fetch(`https://api.telegram.org/bot${telegramBotToken}/answerCallbackQuery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ callback_query_id: callbackQuery.id }),
      signal: AbortSignal.timeout(5000),
    }).catch(err => {
      console.warn('[handleCallbackQuery] answerCallbackQuery failed:', err);
    });
  }

  // 1. Session and Chat Management
  if (callbackData === 'clear_chat') {
    await purgeAndResetSession(cbChatId, callbackQuery.message?.message_id, ctx);
  } else if (callbackData === 'reset_session' || callbackData === 'reset_quota') {
    await resetSessionOnly(cbChatId, ctx);
  }
  // 1.5 Language Switching Callbacks
  else if (callbackData.startsWith('set_lang:') || callbackData === 'toggle_lang') {
    let targetLang: 'en' | 'ar' = 'ar';
    if (callbackData === 'set_lang:en') {
      targetLang = 'en';
    } else if (callbackData === 'set_lang:ar') {
      targetLang = 'ar';
    } else {
      const current = await getChatLanguage(storage, cbChatId);
      targetLang = current === 'ar' ? 'en' : 'ar';
    }

    await setChatLanguage(storage, cbChatId, targetLang);

    const toastMsg = targetLang === 'ar'
      ? `🌐 تم تحويل لغة البوت إلى <b>العربية 🇪🇬</b> بنجاح!`
      : `🌐 Bot language switched to <b>English 🇬🇧</b> successfully!`;

    const targetReplyKeyboard = targetLang === 'ar' ? PERSISTENT_REPLY_KEYBOARD_AR : PERSISTENT_REPLY_KEYBOARD_EN;
    await messaging.sendMessage(cbChatId, toastMsg, undefined, targetReplyKeyboard);

    if (messaging.sendInteractiveMenu) {
      await messaging.sendInteractiveMenu(cbChatId, undefined, targetLang);
    }
    return new Response(JSON.stringify({ ok: true, action: 'language_switched', lang: targetLang }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
  // 2. Sprint & Guide Deep-Link Previews
  else if (callbackData === 'view_sprint_lara') {
    await sendAndTrack(cbChatId, `📄 <b>Lara's Latest Sprint Pack:</b>\n🔗 https://aim.getvintel.com/sprint/preview`);
  } else if (callbackData === 'view_sprint_maya') {
    await sendAndTrack(cbChatId, `📄 <b>Maya's Latest Sprint Pack:</b>\n🔗 https://aim.getvintel.com/sprint/preview`);
  } else if (callbackData === 'view_guide_lara') {
    await sendAndTrack(cbChatId, `🧭 <b>Lara's Parent Socratic Guide:</b>\n🔗 https://aim.getvintel.com/guide/preview`);
  } else if (callbackData === 'view_guide_maya') {
    await sendAndTrack(cbChatId, `🧭 <b>Maya's Parent Socratic Guide:</b>\n🔗 https://aim.getvintel.com/guide/preview`);
  }
  // 2.5 On-Demand Student Mastery & Progress Snapshot Card
  else if (callbackData.startsWith('view_progress:')) {
    const [, studentId] = callbackData.split(':');
    const isAll = studentId?.toLowerCase() === 'all';
    const lang = await getChatLanguage(storage, cbChatId);
    const isAr = lang === 'ar';

    const snapshot = (await storage.getLmsProgress?.()) ?? null;
    const laraSubs = await storage.getStudentAssessments('lara');
    const mayaSubs = await storage.getStudentAssessments('maya');
    if (isAll) {
      const table = renderSubjectOverview(snapshot, laraSubs, mayaSubs, lang);
      const updated = snapshot ? ` • ${snapshot.updated}` : '';
      const comparativeCard = isAr
        ? `📊 <b>ملخص التميز الأكاديمي الشامل • جميع الأطفال</b>${updated}\n` +
          `👨‍👧‍👧 <i>نظرة عائلية: لارا ومايا (الصف الرابع الابتدائي)</i>\n` +
          `🏫 <i>مدرسة أستن كوليدج • المنهاج البريطاني</i>\n\n` +
          `<pre>\n${table}\n</pre>\n\n` +
          `💡 <i>اضغط على اسم الطفل لعرض السجل التشخيصي المفصل:</i>`
        : `📊 <b>Comparative Academic Snapshot • All Children</b>${updated}\n` +
          `👨‍👧‍👧 <i>Family Overview: Lara & Maya (Year 4)</i>\n\n` +
          `<pre>\n${table}\n</pre>\n\n` +
          `💡 <i>Tap a child below to view individual diagnostic ledger:</i>`;

      const comparativeKeyboard = {
        inline_keyboard: isAr ? [
          [
            { text: '👧 بطاقة لارا التشخيصية', callback_data: 'view_progress:lara' },
            { text: '👧 بطاقة مايا التشخيصية', callback_data: 'view_progress:maya' },
          ],
          [
            { text: '📱 لوحة تحكم AIM', web_app: { url: 'https://aim.getvintel.com' } },
            { text: '🌐 English 🇬🇧', callback_data: 'set_lang:en' },
          ],
          [
            { text: '↩️ العودة للقائمة', callback_data: 'open_main_menu' }
          ]
        ] : [
          [
            { text: '👧 Lara Diagnostic Card', callback_data: 'view_progress:lara' },
            { text: '👧 Maya Diagnostic Card', callback_data: 'view_progress:maya' },
          ],
          [
            { text: '📱 Open AIM Console', web_app: { url: 'https://aim.getvintel.com' } },
            { text: '🌐 العربية 🇪🇬', callback_data: 'set_lang:ar' },
          ],
          [
            { text: '↩️ Back to Menu', callback_data: 'open_main_menu' }
          ]
        ]
      };

      await sendAndTrack(cbChatId, comparativeCard, undefined, comparativeKeyboard);
      return new Response(JSON.stringify({ ok: true, action: 'progress_all_rendered' }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const isMaya = studentId?.toLowerCase() === 'maya';
    const studentName = isMaya ? 'Maya' : 'Lara';

    const table = renderSubjectOverview(snapshot, laraSubs, mayaSubs, lang);
    const childSubs = isMaya ? mayaSubs : laraSubs;
    const errors = topErrors(childSubs, 3);
    const errorLines = errors.length
      ? errors.map((e) => `🟠 <code>${e.code}</code> (<code>${e.errorClass}</code>) — ${e.count}x`).join('\n')
      : (isAr ? 'لا توجد أخطاء مسجلة بعد.' : 'No recorded errors yet.');
    const progressCard = isAr
      ? `📊 <b>ملخص الإتقان الأكاديمي لـ ${isMaya ? 'مايا' : 'لارا'} (الصف الرابع الابتدائي)</b>\n` +
        `🏫 <i>مدرسة أستن كوليدج • المنهاج البريطاني</i>\n\n` +
        `<pre>\n${table}\n</pre>\n\n` +
        `⚠️ <b>أكثر الأخطاء تكرارًا:</b>\n${errorLines}`
      : `📊 <b>${studentName}'s Academic Mastery Snapshot (Year 4)</b>\n` +
        `🏫 <i>Asten College • British Primary Curriculum</i>\n\n` +
        `<pre>\n${table}\n</pre>\n\n` +
        `⚠️ <b>Most frequent errors:</b>\n${errorLines}`;

    const actionKeyboard = {
      inline_keyboard: isAr ? [
        [
          { text: `🚀 توليد تمرين ${isMaya ? 'مايا' : 'لارا'} الآن`, callback_data: `gen_sprint:${studentId}:science:8` }
        ],
        [
          { text: '🧭 دليل الوالدين السقراطي', callback_data: `view_guide_${studentId}` },
          { text: '📱 لوحة تحكم AIM', web_app: { url: 'https://aim.getvintel.com' } }
        ],
        [
          { text: '🌐 English 🇬🇧', callback_data: 'set_lang:en' },
          { text: '↩️ خطوة للخلف', callback_data: 'open_main_menu' }
        ]
      ] : [
        [
          { text: `🚀 Generate ${studentName}'s Sprint Now`, callback_data: `gen_sprint:${studentId}:science:8` }
        ],
        [
          { text: '🧭 Parent Socratic Guide', callback_data: `view_guide_${studentId}` },
          { text: '📱 Open AIM Console', web_app: { url: 'https://aim.getvintel.com' } }
        ],
        [
          { text: '🌐 العربية 🇪🇬', callback_data: 'set_lang:ar' },
          { text: '↩️ Return 1 Step Back', callback_data: 'open_main_menu' }
        ]
      ]
    };

    await sendAndTrack(cbChatId, progressCard, undefined, actionKeyboard);
  }
  // 3. ADR-003 Stage 2: On-Demand Sprint Generation Trigger
  else if (callbackData.startsWith('gen_sprint:')) {
    const [, sId, subjId, wNum] = callbackData.split(':');
    const studentId = sId || 'lara';
    const subjectId = subjId || 'science';
    const week = Number(wNum) || 8;

    await sendAndTrack(
      cbChatId,
      `🚀 <b>Generating Targeted Remediation Sprint...</b>\n\n` +
      `<i>Formatting ADHD-friendly visual chunks for ${studentId.toUpperCase()} (${subjectId.toUpperCase()} Week ${week})...</i>`
    );

    await processAssessmentJob({
      studentId,
      guardianId: `guardian_${cbChatId}`,
      chatId: cbChatId,
      imageUrls: [],
      subjectId,
      termWeek: week,
      autoCompileSprint: true,
    });
  }
  // 4. ADR-003 Stage 1: Defer to Portfolio
  else if (callbackData.startsWith('save_portfolio:')) {
    const [, sId] = callbackData.split(':');
    const studentDisplayName = sId ? sId.charAt(0).toUpperCase() + sId.slice(1) : 'Student';
    const portfolioKeyboard = {
      inline_keyboard: [
        [
          { text: `🚀 Generate ${studentDisplayName}'s Sprint`, callback_data: `gen_sprint:${sId || 'lara'}:science:8` }
        ],
        [
          { text: '🧹 Clear Chat', callback_data: 'clear_chat' },
          { text: '↩️ Return 1 Step Back', callback_data: 'open_main_menu' }
        ]
      ]
    };
    await sendAndTrack(
      cbChatId,
      `📁 <b>Saved to ${studentDisplayName}'s Portfolio!</b>\n\n` +
      `All assessment metrics and concept masteries have been committed to the cognitive history ledger.\n\n` +
      `<i>Whenever you are ready for tonight's practice session, tap <b>🎛️ Menu</b> or use /sprint.</i>`,
      undefined,
      portfolioKeyboard
    );
  }
  // 5. Week Selection Menu
  else if (callbackData === 'menu_change_week') {
    const weekKeyboard = {
      inline_keyboard: [
        [
          { text: 'Lara: W1', callback_data: 'set_week_lara_1' },
          { text: 'Lara: W2', callback_data: 'set_week_lara_2' },
          { text: 'Lara: W3', callback_data: 'set_week_lara_3' },
          { text: 'Lara: W4', callback_data: 'set_week_lara_4' },
        ],
        [
          { text: 'Maya: W5', callback_data: 'set_week_maya_5' },
          { text: 'Maya: W6', callback_data: 'set_week_maya_6' },
          { text: 'Maya: W7', callback_data: 'set_week_maya_7' },
          { text: 'Maya: W8', callback_data: 'set_week_maya_8' },
        ],
        [
          { text: '🧹 Clear Chat', callback_data: 'clear_chat' },
          { text: '↩️ Return 1 Step Back', callback_data: 'open_main_menu' }
        ]
      ]
    };
    await sendAndTrack(cbChatId, `📅 <b>Select Target Week to Recompile Sprint:</b>`, undefined, weekKeyboard);
  } else if (callbackData.startsWith('set_week_')) {
    const parts = callbackData.split('_');
    const sName = parts[2]!;
    const wNum = Number(parts[3]!);
    await sendAndTrack(cbChatId, `🔄 <b>Recompiling for ${sName.toUpperCase()} (Week ${wNum})...</b>`);
    await processAssessmentJob({
      studentId: sName,
      guardianId: `guardian_${cbChatId}`,
      chatId: cbChatId,
      imageUrls: [],
      subjectId: 'english',
      yearGroup: 'Y4',
      termWeek: wNum,
      schoolId: 'asten-college',
      autoCompileSprint: true,
    });
  } else if (callbackData === 'open_main_menu') {
    if (messaging.sendInteractiveMenu) {
      const menuRes = (await messaging.sendInteractiveMenu(cbChatId)) as any;
      if (menuRes?.result?.message_id && storage.trackBotMessage) {
        await storage.trackBotMessage(cbChatId, menuRes.result.message_id);
      }
    }
  } else if (callbackData === 'close_menu') {
    const msgId = callbackQuery.message?.message_id;
    if (msgId && (messaging as any).deleteMessage) {
      await (messaging as any).deleteMessage(cbChatId, msgId).catch(() => {});
    }
  }

  return new Response(JSON.stringify({ ok: true, action: 'callback_handled' }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
