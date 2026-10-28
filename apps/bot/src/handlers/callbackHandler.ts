import type { IStoragePort, IMessagingPort } from '@hex-aim/types';
import { purgeAndResetSession, resetSessionOnly, type SessionContext } from './sessionHandler.js';
import { processAssessmentJob } from '../jobs/processAssessment.js';

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

    if (isAll) {
      const comparativeCard =
        `📊 <b>Comparative Academic Snapshot • All Children</b>\n` +
        `👨‍👧‍👧 <i>Family Overview: Lara & Maya (Year 4)</i>\n\n` +
        `<pre>\n` +
        `┌──────────────┬────────┬────────┐\n` +
        `│ Dimension    │  Lara  │  Maya  │\n` +
        `├──────────────┼────────┼────────┤\n` +
        `│ Overall Mast.│ 94% 🟢 │ 96% 🟢 │\n` +
        `│ Learn. Vel.  │ +14% 🚀│ +11% 🚀│\n` +
        `│ Conf. Index  │  91%   │  95%   │\n` +
        `│ Sprint Mode  │ 8m Vis │10m Vrb │\n` +
        `├──────────────┴────────┴────────┤\n` +
        `│ SUBJECT MASTERY BREAKDOWN      │\n` +
        `├──────────────┬────────┬────────┤\n` +
        `│ 🔬 Science   │ 94% 🟢 │ 96% 🟢 │\n` +
        `│ 📐 Maths     │ 82% 🟡 │ 86% 🟡 │\n` +
        `│ 📖 English   │ 88% 🟢 │ 91% 🟢 │\n` +
        `└──────────────┴────────┴────────┘\n` +
        `</pre>\n\n` +
        `⚠️ <b>Active Cognitive Priority:</b>\n` +
        `• <b>Lara:</b> <code>Y4.SCI.SND.MEDIUM</code> (Sound Transmission)\n` +
        `• <b>Maya:</b> <code>Y4.MATH.NPV.5DIGIT</code> (5-Digit Prefix Ordering)\n\n` +
        `💡 <i>Tap a child below to view individual diagnostic ledger:</i>`;

      const comparativeKeyboard = {
        inline_keyboard: [
          [
            { text: '👧 Lara Diagnostic Card', callback_data: 'view_progress:lara' },
            { text: '👧 Maya Diagnostic Card', callback_data: 'view_progress:maya' },
          ],
          [
            { text: '📱 Open AIM Console', web_app: { url: 'https://aim.getvintel.com' } },
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
    const duration = isMaya ? '10 min' : '8 min';
    const traits = isMaya ? 'Verbal explanation role • Methodical' : 'ADHD/Dyslexia traits • Visual scaffolds active';

    const progressCard = isMaya
      ? `📊 <b>Maya's Academic Mastery Snapshot (Year 4)</b>\n` +
        `🏫 <i>Asten College • British Primary Curriculum</i>\n\n` +
        `<pre>\n` +
        `┌──────────────┬─────┬───┬──────────────┐\n` +
        `│ Subject      │ %   │St.│ Trajectory   │\n` +
        `├──────────────┼─────┼───┼──────────────┤\n` +
        `│ 🔬 Science   │ 96% │ 🟢│ [▰▰▰▰▰▰▰▰▰▰] │\n` +
        `│ 📐 Maths     │ 86% │ 🟡│ [▰▰▰▰▰▰▰▰▱▱] │\n` +
        `│ 📖 English   │ 91% │ 🟢│ [▰▰▰▰▰▰▰▰▰▱] │\n` +
        `├──────────────┴─────┴───┴──────────────┤\n` +
        `│ LEARNING VELOCITY (WEEKS 1–8)         │\n` +
        `├──────────────┬─────┬───┬──────────────┤\n` +
        `│ W1 Intake    │ 60% │ 🟡│ [▰▰▰▰▰▱▱▱▱▱] │\n` +
        `│ W4 Threshold │ 85% │ 🟢│ [▰▰▰▰▰▰▰▰▱▱] │\n` +
        `│ W8 Midterm   │ 96% │ 🟢│ [▰▰▰▰▰▰▰▰▰▰] │\n` +
        `└──────────────┴─────┴───┴──────────────┘\n` +
        `</pre>\n\n` +
        `⚠️ <b>Active Cognitive Focus Areas:</b>\n` +
        `🟠 <code>Y4.MATH.NPV.5DIGIT_ORDERING</code> (<code>ERR_SHARED_PREFIX_ORDERING</code>) — 1x\n` +
        `🟡 <code>Y4.MATH.NPV.NUMBER_LINE_SCALES</code> (<code>ERR_INTERVAL_DECODE</code>) — 1x\n\n` +
        `💡 <b>Sprint Strategy:</b>\n` +
        `• Target: ${duration} (${traits})\n` +
        `• Peer Teaching: Explaining concepts to Lara solidifies retention.`
      : `📊 <b>Lara's Academic Mastery Snapshot (Year 4)</b>\n` +
        `🏫 <i>Asten College • British Primary Curriculum</i>\n\n` +
        `<pre>\n` +
        `┌──────────────┬─────┬───┬──────────────┐\n` +
        `│ Subject      │ %   │St.│ Trajectory   │\n` +
        `├──────────────┼─────┼───┼──────────────┤\n` +
        `│ 🔬 Science   │ 94% │ 🟢│ [▰▰▰▰▰▰▰▰▰▱] │\n` +
        `│ 📐 Maths     │ 82% │ 🟡│ [▰▰▰▰▰▰▰▱▱▱] │\n` +
        `│ 📖 English   │ 88% │ 🟢│ [▰▰▰▰▰▰▰▰▱▱] │\n` +
        `├──────────────┴─────┴───┴──────────────┤\n` +
        `│ LEARNING VELOCITY (WEEKS 1–8)         │\n` +
        `├──────────────┬─────┬───┬──────────────┤\n` +
        `│ W1 Baseline  │ 52% │ 🔴│ [▰▰▰▰▱▱▱▱▱▱] │\n` +
        `│ W4 Threshold │ 80% │ 🟡│ [▰▰▰▰▰▰▰▰▱▱] │\n` +
        `│ W8 Midterm   │ 94% │ 🟢│ [▰▰▰▰▰▰▰▰▰▱] │\n` +
        `└──────────────┴─────┴───┴──────────────┘\n` +
        `</pre>\n\n` +
        `⚠️ <b>Active Cognitive Focus Areas:</b>\n` +
        `🟠 <code>Y4.MATH.NPV.EMPTY_COLUMNS</code> (<code>ERR_PHANTOM_ZERO</code>) — 3x\n` +
        `🟡 <code>Y4.MATH.NPV.NEGATIVE_NUMBERS</code> (<code>ERR_NEGATIVE_MAGNITUDE_INVERSION</code>) — 2x\n` +
        `🟡 <code>Y4.MATH.NPV.WRITING_NUMBERS</code> (<code>ERR_TRANSPOSITION</code>) — 2x\n\n` +
        `💡 <b>Sprint Strategy:</b>\n` +
        `• Target: ${duration} (${traits})\n` +
        `• Scaffold: Elevator model & place-value rooms protect working memory.`;

    const actionKeyboard = {
      inline_keyboard: [
        [
          { text: `🚀 Generate ${studentName}'s Sprint Now`, callback_data: `gen_sprint:${studentId}:science:8` }
        ],
        [
          { text: '🧭 Parent Socratic Guide', callback_data: `view_guide_${studentId}` },
          { text: '📱 Open AIM Console', web_app: { url: 'https://aim.getvintel.com' } }
        ],
        [
          { text: '🧹 Clear Chat', callback_data: 'clear_chat' },
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
