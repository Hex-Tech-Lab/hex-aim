import {
  StorageFactory,
  VisionFactory,
  MessagingFactory,
  DubLinkAdapter
} from '@hex-aim/adapters';
import {
  CanonicalDeduplicator,
  AdaptiveSprintCompiler,
  SocraticGuideCompiler,
  PdfPackCompiler,
  SettingsManager,
  CurriculumTaxonomyService
} from '@hex-aim/core';
import type {
  CognitiveGap,
  Student
} from '@hex-aim/types';

export interface ProcessAssessmentPayload {
  studentId?: string;
  guardianId?: string;
  chatId: string;
  imageUrls: string[];
  subjectId?: string;
  yearGroup?: string;
  termWeek?: number;
  schoolId?: string;
  skipMenu?: boolean;
  autoCompileSprint?: boolean;
}

export interface CompileSprintOptions {
  studentId: string;
  guardianId?: string;
  chatId: string;
  subjectId?: string;
  termWeek?: number;
  schoolId?: string;
}

/**
 * Stage 2 Execution: Compiles and delivers 4-Page Student Sprint & Parent Guide
 */
export async function compileAndDeliverSprint(options: CompileSprintOptions): Promise<{
  sprintId: string;
  guideId: string;
}> {
  const storage = StorageFactory.getStorage();
  const messaging = MessagingFactory.getMessaging();
  const settings = SettingsManager.getInstance();

  const student = await storage.getStudent(options.studentId) || {
    id: options.studentId,
    name: options.studentId.charAt(0).toUpperCase() + options.studentId.slice(1),
    schoolId: options.schoolId || settings.get<string>('curriculum.default_school', 'asten-college'),
    yearGroup: settings.get<string>('curriculum.default_year_group', 'Y4'),
    curriculumTrack: 'british' as const,
    neuroProfile: {
      hasAdhdTraits: true,
      hasDyslexiaTraits: true,
      workingMemoryCapacity: 'vulnerable_under_time_pressure',
      optimalSprintDurationMins: 8,
    },
  } as Student;

  const subjectId = (options.subjectId || settings.get<string>('curriculum.default_subject', 'science')).toLowerCase();
  const week = options.termWeek || settings.get<number>('curriculum.default_term_week', 8);
  const guardian = options.guardianId ? await storage.getGuardian(options.guardianId) : null;

  const existingGaps = await storage.getStudentGaps(options.studentId);
  const targetGaps = existingGaps.filter(g => g.status === 'active_priority').slice(0, 4);

  const sprint = AdaptiveSprintCompiler.compile(student, targetGaps, {
    subjectTitle: subjectId.toUpperCase(),
    sprintNumber: week,
  });
  const sprintPdfBytes = await PdfPackCompiler.compileSprintPdf(student, targetGaps, {
    subjectTitle: subjectId.toUpperCase(),
    week,
  });
  sprint.pdfBuffer = sprintPdfBytes;
  await storage.saveRemediationSprint(sprint);

  const guide = SocraticGuideCompiler.compile(student, targetGaps, guardian || undefined);
  const guidePdfBytes = await PdfPackCompiler.compileGuidePdf(student, targetGaps, guardian || undefined, {
    subjectTitle: subjectId.toUpperCase(),
    week,
  });
  guide.pdfBuffer = guidePdfBytes;
  await storage.saveCoachingGuide(guide);

  const rawSprintUrl = `https://aim.getvintel.com/sprint/preview?id=${sprint.id}`;
  const rawGuideUrl = `https://aim.getvintel.com/guide/preview?id=${guide.id}`;

  const dub = new DubLinkAdapter();
  const sprintUrl = await dub.createShortLink(rawSprintUrl);
  const guideUrl = await dub.createShortLink(rawGuideUrl);

  await messaging.deliverRemediationPacks(options.chatId, {
    studentPackHtml: sprintUrl,
    studentPackPdf: sprintPdfBytes,
    coachingGuideHtml: guideUrl,
    coachingGuidePdf: guidePdfBytes,
    summaryUrl: 'https://aim.getvintel.com',
    studentName: student.name,
    subject: subjectId,
    week,
  });

  return { sprintId: sprint.id, guideId: guide.id };
}

export async function processAssessmentJob(payload: ProcessAssessmentPayload): Promise<{
  sprintId?: string;
  guideId?: string;
  studentId: string;
  subjectId: string;
  score: { raw: number; total: number; percentage: number };
}> {
  const storage = StorageFactory.getStorage();
  const vision = VisionFactory.getVision();
  const messaging = MessagingFactory.getMessaging();
  const settings = SettingsManager.getInstance();

  const defaultSchool = settings.get<string>('curriculum.default_school', 'asten-college');
  const defaultYearGroup = settings.get<string>('curriculum.default_year_group', 'Y4');
  const defaultTermWeek = settings.get<number>('curriculum.default_term_week', 8);

  const schoolId = payload.schoolId || defaultSchool;

  // 1. Run Vision Extraction (OpenRouter AI Multimodal)
  const extraction = await vision.extractAssessment(payload.imageUrls, {
    studentId: payload.studentId || 'auto',
    subjectId: payload.subjectId || 'auto',
    yearGroup: payload.yearGroup || defaultYearGroup,
  });

  // 2. Dynamic Classification via SSOT Taxonomy
  let resolvedStudentId = 'lara';
  if (extraction.detectedStudentName) {
    const lower = extraction.detectedStudentName.toLowerCase();
    if (lower.includes('maya')) resolvedStudentId = 'maya';
    else if (lower.includes('lara')) resolvedStudentId = 'lara';
    else resolvedStudentId = lower.trim().replace(/\s+/g, '_');
  } else if (payload.studentId && payload.studentId !== 'auto') {
    resolvedStudentId = payload.studentId.toLowerCase();
  }

  const resolvedSubjectId = (extraction.detectedSubject || payload.subjectId || settings.get<string>('curriculum.default_subject', 'science')).toLowerCase();
  const resolvedWeek = (typeof extraction.detectedWeek === 'number' && extraction.detectedWeek > 0)
    ? extraction.detectedWeek
    : (payload.termWeek || defaultTermWeek);
  const resolvedYearGroup = extraction.detectedYearGroup || payload.yearGroup || defaultYearGroup;

  console.log(`[processAssessment] Classified assessment: Student=${resolvedStudentId}, Subject=${resolvedSubjectId}, Week=${resolvedWeek}`);

  // Fetch or construct student profile
  let student = await storage.getStudent(resolvedStudentId);
  if (!student) {
    const isMaya = resolvedStudentId === 'maya';
    student = {
      id: resolvedStudentId,
      name: resolvedStudentId.charAt(0).toUpperCase() + resolvedStudentId.slice(1),
      schoolId,
      yearGroup: resolvedYearGroup,
      curriculumTrack: 'british' as const,
      neuroProfile: {
        hasAdhdTraits: !isMaya,
        hasDyslexiaTraits: !isMaya,
        workingMemoryCapacity: isMaya ? 'standard' : 'vulnerable_under_time_pressure',
        optimalSprintDurationMins: isMaya ? 10 : 8,
      },
    } as Student;
  }

  const percentage = Math.round((extraction.rawScore / Math.max(1, extraction.totalScore)) * 100);

  // 3. Check for Duplicate Assessment / Practice Run
  const priorAssessments = await storage.getStudentAssessments(resolvedStudentId, resolvedSubjectId);
  const isDuplicateMilestone = priorAssessments.some(a => 
    a.termWeek === resolvedWeek && (a.rawScore === extraction.rawScore || Math.abs(a.percentage - percentage) < 3)
  );

  const dedupContext = {
    schoolId,
    yearGroup: resolvedYearGroup,
    subjectId: resolvedSubjectId,
    termWeek: resolvedWeek,
  };

  let existingMaster = storage.findCanonicalMaster
    ? await storage.findCanonicalMaster(schoolId, resolvedYearGroup, resolvedSubjectId, resolvedWeek)
    : null;

  const { master, isNewMaster, submission, delta } = CanonicalDeduplicator.processSubmission(
    existingMaster,
    dedupContext,
    {
      studentId: resolvedStudentId,
      guardianId: payload.guardianId,
      rawScore: extraction.rawScore,
      totalScore: extraction.totalScore,
      percentage,
      items: extraction.items,
      sourceImageUrls: payload.imageUrls,
    }
  );

  if (isNewMaster && storage.saveCanonicalMaster) {
    await storage.saveCanonicalMaster(master);
    console.log(`[processAssessment] Registered new Canonical Master: ${master.id} with ${master.schemaQuestions.length} question schemas`);
  } else if (delta) {
    console.log(`[processAssessment] Reused Canonical Master: ${master.id}. Student delta coverage: ${delta.coveragePct}% (${delta.matchedQuestionCount}/${master.schemaQuestions.length})`);
  }

  await storage.saveAssessment(submission);

  // 4. Update Cognitive Gap Ledger
  let targetGaps: CognitiveGap[] = [];
  const existingGaps = await storage.getStudentGaps(resolvedStudentId);

  if (!isDuplicateMilestone) {
    const gapMap = new Map<string, CognitiveGap>();
    for (const g of existingGaps) {
      gapMap.set(g.conceptCode, g);
    }

    const nowStr = new Date().toISOString().split('T')[0]!;

    for (const item of extraction.items) {
      if (item.status === 'fail' && item.errorClass) {
        const existing = gapMap.get(item.conceptCode);
        if (existing) {
          existing.lastObservedDate = nowStr;
          existing.recurrenceCount += 1;
          existing.status = 'active_priority';
        } else {
          gapMap.set(item.conceptCode, {
            id: `gap_${resolvedStudentId}_${item.conceptCode}_${Date.now()}`,
            studentId: resolvedStudentId,
            conceptCode: item.conceptCode,
            errorClass: item.errorClass,
            description: `Identified error ${item.errorClass} in Question ${item.qNum}`,
            firstObservedDate: nowStr,
            lastObservedDate: nowStr,
            recurrenceCount: 1,
            status: 'active_priority',
            socraticHint: 'Guide the student through socratic prompt questions.',
          });
        }
      } else if (item.status === 'pass') {
        const existing = gapMap.get(item.conceptCode);
        if (existing && existing.status === 'active_priority') {
          existing.status = 'progressing';
        }
      }
    }

    const updatedGaps = Array.from(gapMap.values());
    await storage.saveStudentGaps(resolvedStudentId, updatedGaps);
    targetGaps = updatedGaps.filter(g => g.status === 'active_priority');
  } else {
    targetGaps = existingGaps.filter(g => g.status === 'active_priority');
    if (targetGaps.length === 0) {
      targetGaps = existingGaps.slice(0, 3);
    }
  }

  // 5. STAGE 1: Diagnostic Scorecard & Progress Snapshot
  const shouldAutoCompile = payload.autoCompileSprint || settings.get<boolean>('sprint.auto_deliver', false);

  if (!shouldAutoCompile && payload.imageUrls.length > 0) {
    const passedCount = extraction.items.filter(i => i.status === 'pass').length;
    const gapItems = extraction.items.filter(i => i.status === 'fail');
    const taxonomy = CurriculumTaxonomyService.getInstance();
    const subjectDisplayName = taxonomy.getSubjectDisplayName(resolvedSubjectId);

    const gapDetails = gapItems.slice(0, 3).map(g => 
      `• <b>Q${g.qNum}:</b> <code>${g.errorClass || 'MISCONCEPTION'}</code> — <i>${g.cognitiveFactor || 'Review recommended'}</i>`
    ).join('\n') || '• <i>Zero critical misconceptions detected. Core concepts mastered!</i>';

    const scorecardText = 
      `📊 <b>Assessment Diagnostic Scorecard: ${student.name}</b>\n` +
      `📚 <b>Subject:</b> ${subjectDisplayName} • <b>Week ${resolvedWeek}</b>\n\n` +
      `<pre>\n` +
      `Metric         │ Result       │ Status\n` +
      `───────────────┼──────────────┼──────────\n` +
      `Score          │ ${extraction.rawScore} / ${extraction.totalScore}        │ ${percentage}%\n` +
      `Mastered Items │ ${passedCount} items      │ 🟢 Pass\n` +
      `Focus Gaps     │ ${gapItems.length} items      │ ${gapItems.length > 0 ? '🟠 Active' : '🟢 None'}\n` +
      `</pre>\n\n` +
      `🔍 <b>Key Misconceptions & Focus:</b>\n` +
      `${gapDetails}\n\n` +
      `📈 <b>Mastery Progress:</b>\n` +
      `• Logged to ${student.name}'s continuous learning ledger.\n` +
      `• Total active priority gaps: <b>${targetGaps.length}</b>.\n\n` +
      `<i>Would you like to compile tonight's tailored 4-page sprint pack now?</i>`;

    const inlineKeyboard = {
      inline_keyboard: [
        [
          { text: '🚀 Generate Follow-up Sprint Now', callback_data: `gen_sprint:${resolvedStudentId}:${resolvedSubjectId}:${resolvedWeek}` },
          { text: '⏱️ Save to Portfolio / Later', callback_data: `save_portfolio:${resolvedStudentId}:${resolvedSubjectId}:${resolvedWeek}` }
        ],
        [
          { text: '📱 Open AIM Console', web_app: { url: 'https://aim.getvintel.com' } },
          { text: '↩️ Return to Menu', callback_data: 'open_main_menu' }
        ]
      ]
    };

    await messaging.sendMessage(payload.chatId, scorecardText, undefined, inlineKeyboard);

    return {
      studentId: resolvedStudentId,
      subjectId: resolvedSubjectId,
      score: {
        raw: extraction.rawScore,
        total: extraction.totalScore,
        percentage,
      },
    };
  }

  // 6. STAGE 2: Compile & Deliver Sprint and Parent Guide
  const compiled = await compileAndDeliverSprint({
    studentId: resolvedStudentId,
    guardianId: payload.guardianId,
    chatId: payload.chatId,
    subjectId: resolvedSubjectId,
    termWeek: resolvedWeek,
    schoolId,
  });

  return {
    sprintId: compiled.sprintId,
    guideId: compiled.guideId,
    studentId: resolvedStudentId,
    subjectId: resolvedSubjectId,
    score: {
      raw: extraction.rawScore,
      total: extraction.totalScore,
      percentage,
    },
  };
}

export async function processBatchAssessmentJob(payload: {
  chatId: string;
  guardianId: string;
  imageUrls: string[];
  schoolId?: string;
}): Promise<void> {
  const messaging = MessagingFactory.getMessaging();
  const totalCount = payload.imageUrls.length;

  let laraImages: string[] = [];
  let mayaImages: string[] = [];
  let laraStatus = 'Partially Attempted';
  let mayaStatus = 'Fully Attempted';
  let detectedBatchSubject: string | undefined = undefined;
  let detectedBatchWeek: number | undefined = undefined;

  // 1. Run AI Partitioning if multiple images are present
  if (totalCount >= 2) {
    const settings = SettingsManager.getInstance();
    const routing = settings.getOpenRouterRoutingConfig();
    const apiKey = settings.get<string>('ai.openrouter.api_key', settings.get<string>('OPENROUTER_API_KEY', ''));
    const model = routing.primaryModel;

    if (apiKey) {
      try {
        const contentParts: any[] = [
          {
            type: 'text',
            text: `You are an expert curriculum evaluator analyzing ${totalCount} worksheet page photos for primary school students at Asten College.
CRITICAL CONTEXT:
- Identify the subject from the page contents based on curriculum rules (science, maths, english, arabic, humanities).
- Inspect the student name header written on each page, handwriting style, and question sequence to partition the pages between students (e.g. Lara vs Maya).
Return strict JSON matching this schema:
{
  "laraPageIndices": number[],
  "mayaPageIndices": number[],
  "detectedSubject": string,
  "detectedWeek": number | null,
  "laraAttemptStatus": string,
  "mayaAttemptStatus": string
}`
          }
        ];

        for (let i = 0; i < payload.imageUrls.length; i++) {
          const rawUrl = payload.imageUrls[i];
          if (!rawUrl) continue;
          let finalUrl = rawUrl;
          if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) {
            try {
              const imgRes = await fetch(rawUrl, {
                headers: { 'User-Agent': 'Mozilla/5.0 (compatible; HEX-AIM-Intake/1.0)' },
                signal: AbortSignal.timeout(routing.imageFetchTimeoutMs),
              });
              if (imgRes.ok) {
                const mimeType = imgRes.headers.get('content-type') || 'image/jpeg';
                const arrayBuf = await imgRes.arrayBuffer();
                const base64 = Buffer.from(arrayBuf).toString('base64');
                finalUrl = `data:${mimeType};base64,${base64}`;
              }
            } catch (fetchErr) {
              console.warn('[processBatchAssessmentJob] Unable to inline image buffer to base64; sending raw URL:', fetchErr);
            }
          }
          contentParts.push({ type: 'text', text: `PAGE INDEX ${i}:` });
          contentParts.push({ type: 'image_url', image_url: { url: finalUrl } });
        }

        const res = await fetch(routing.chatEndpoint, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': routing.httpReferer,
            'X-Title': routing.appTitle,
          },
          body: JSON.stringify({
            model,
            provider: {
              order: routing.providerOrder,
              ignore: routing.providerIgnore,
              allow_fallbacks: routing.allowFallbacks,
            },
            messages: [{ role: 'user', content: contentParts }],
            temperature: routing.temperature,
            response_format: { type: 'json_object' }
          }),
          signal: AbortSignal.timeout(routing.timeoutMs),
        });

        if (res.ok) {
          const d = await res.json() as any;
          const parsed = JSON.parse(d?.choices?.[0]?.message?.content || '{}');
          if (Array.isArray(parsed.laraPageIndices) && parsed.laraPageIndices.length > 0) {
            laraImages = parsed.laraPageIndices.map((idx: number) => payload.imageUrls[idx]).filter(Boolean);
          }
          if (Array.isArray(parsed.mayaPageIndices) && parsed.mayaPageIndices.length > 0) {
            mayaImages = parsed.mayaPageIndices.map((idx: number) => payload.imageUrls[idx]).filter(Boolean);
          }
          if (parsed.laraAttemptStatus) laraStatus = parsed.laraAttemptStatus;
          if (parsed.mayaAttemptStatus) mayaStatus = parsed.mayaAttemptStatus;
          if (parsed.detectedSubject) detectedBatchSubject = parsed.detectedSubject;
          if (typeof parsed.detectedWeek === 'number' && parsed.detectedWeek > 0) detectedBatchWeek = parsed.detectedWeek;
        } else {
          const errText = await res.text();
          settings.logLoudFailure('processBatchAssessmentJob:aiPartition', model, `HTTP ${res.status}: ${errText}`);
        }
      } catch (partErr) {
        settings.logLoudFailure('processBatchAssessmentJob:aiPartition', model, partErr);
      }
    }
  }

  // Fallback partition: if AI partition did not assign images, do NOT blindly slice 50/50.
  // Treat entire batch as belonging to the primary detected student rather than guessing.
  if (laraImages.length === 0 && mayaImages.length === 0) {
    laraImages = payload.imageUrls;
    laraStatus = 'Full Intake (Single Batch)';
  }

  const batchSettings = SettingsManager.getInstance();
  const defaultSubject = batchSettings.get<string>('curriculum.default_subject', 'science');
  const defaultWeek = batchSettings.get<number>('curriculum.default_term_week', 8);

  const batchSubject = (detectedBatchSubject || defaultSubject).toLowerCase();
  const batchWeek = detectedBatchWeek || defaultWeek;

  // 2. Deliver exactly ONE consolidated monospace intake table
  if (messaging.sendBatchIntakeSummary) {
    const studentsSummary = [];
    if (laraImages.length > 0) {
      studentsSummary.push({
        name: 'Lara',
        subject: batchSubject,
        week: batchWeek,
        pageCount: laraImages.length,
        isPractice: true,
        statusDescription: laraStatus,
      });
    }
    if (mayaImages.length > 0) {
      studentsSummary.push({
        name: 'Maya',
        subject: batchSubject,
        week: batchWeek,
        pageCount: mayaImages.length,
        isPractice: true,
        statusDescription: mayaStatus,
      });
    }

    await messaging.sendBatchIntakeSummary(payload.chatId, {
      totalPhotos: totalCount,
      students: studentsSummary,
    });
  }

  // 3. Deliver Lara's Printable Sprint Pack & Parent Guide
  if (laraImages.length > 0) {
    await processAssessmentJob({
      chatId: payload.chatId,
      guardianId: payload.guardianId,
      imageUrls: laraImages,
      studentId: 'lara',
      subjectId: batchSubject,
      termWeek: batchWeek,
      skipMenu: mayaImages.length > 0, // only show menu after Maya
    });
  }

  // 4. Deliver Maya's Printable Sprint Pack & Parent Guide
  if (mayaImages.length > 0) {
    await processAssessmentJob({
      chatId: payload.chatId,
      guardianId: payload.guardianId,
      imageUrls: mayaImages,
      studentId: 'maya',
      subjectId: batchSubject,
      termWeek: batchWeek,
      skipMenu: false, // show menu at conclusion of entire batch!
    });
  }
}
