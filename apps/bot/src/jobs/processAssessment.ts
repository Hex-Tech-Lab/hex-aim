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
  SettingsManager
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
}

export async function processAssessmentJob(payload: ProcessAssessmentPayload): Promise<{
  sprintId: string;
  guideId: string;
  studentId: string;
  subjectId: string;
  score: { raw: number; total: number; percentage: number };
}> {
  const storage = StorageFactory.getStorage();
  const vision = VisionFactory.getVision();
  const messaging = MessagingFactory.getMessaging();
  const settings = SettingsManager.getInstance();

  const defaultSchool = settings.get<string>('curriculum.default_school', 'asten-college');
  const defaultSubject = settings.get<string>('curriculum.default_subject', 'english');
  const defaultYearGroup = settings.get<string>('curriculum.default_year_group', 'Y4');
  const defaultTermWeek = settings.get<number>('curriculum.default_term_week', 3);

  const schoolId = payload.schoolId || defaultSchool;

  // 1. Run Vision Extraction (OpenRouter AI Multimodal)
  const extraction = await vision.extractAssessment(payload.imageUrls, {
    studentId: payload.studentId || 'auto',
    subjectId: payload.subjectId || defaultSubject,
    yearGroup: payload.yearGroup || defaultYearGroup,
  });

  // 2. Resolve Dynamic Classification from Vision (Lara vs. Maya, English vs. Maths)
  let resolvedStudentId = 'lara';
  if (extraction.detectedStudentName) {
    const lower = extraction.detectedStudentName.toLowerCase();
    if (lower.includes('maya')) resolvedStudentId = 'maya';
    else if (lower.includes('lara')) resolvedStudentId = 'lara';
  } else if (payload.studentId && payload.studentId !== 'auto') {
    resolvedStudentId = payload.studentId.toLowerCase();
  }

  const resolvedSubjectId = (extraction.detectedSubject || payload.subjectId || defaultSubject).toLowerCase();
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
      name: isMaya ? 'Maya' : 'Lara',
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

  const guardian = payload.guardianId ? await storage.getGuardian(payload.guardianId) : null;
  const percentage = Math.round((extraction.rawScore / Math.max(1, extraction.totalScore)) * 100);

  // 3. Check for Duplicate Assessment / Practice Run (Strictly Scoped to Same Student & Subject & Week)
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

  const { submission } = CanonicalDeduplicator.processSubmission(null, dedupContext, {
    studentId: resolvedStudentId,
    guardianId: payload.guardianId,
    rawScore: extraction.rawScore,
    totalScore: extraction.totalScore,
    percentage,
    items: extraction.items,
    sourceImageUrls: payload.imageUrls,
  });

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

  // 5. Compile 4-Page Print Sprint & Parent Socratic Guide (HTML + Direct PDF Binary)
  const sprint = AdaptiveSprintCompiler.compile(student, targetGaps, {
    subjectTitle: resolvedSubjectId.toUpperCase(),
    sprintNumber: resolvedWeek,
  });
  const sprintPdfBytes = await PdfPackCompiler.compileSprintPdf(student, targetGaps, {
    subjectTitle: resolvedSubjectId.toUpperCase(),
    week: resolvedWeek,
  });
  sprint.pdfBuffer = sprintPdfBytes;
  await storage.saveRemediationSprint(sprint);

  const guide = SocraticGuideCompiler.compile(student, targetGaps, guardian || undefined);
  const guidePdfBytes = await PdfPackCompiler.compileGuidePdf(student, targetGaps, guardian || undefined, {
    subjectTitle: resolvedSubjectId.toUpperCase(),
    week: resolvedWeek,
  });
  guide.pdfBuffer = guidePdfBytes;
  await storage.saveCoachingGuide(guide);

  // 6. Deliver Links & Documents via Telegram
  const rawSprintUrl = `https://aim.getvintel.com/sprint/preview?id=${sprint.id}`;
  const rawGuideUrl = `https://aim.getvintel.com/guide/preview?id=${guide.id}`;

  const dub = new DubLinkAdapter();
  // Attempt Dub link, but if quota exhausted, gracefully falls back to raw URL
  const sprintUrl = await dub.createShortLink(rawSprintUrl);
  const guideUrl = await dub.createShortLink(rawGuideUrl);

  if (isDuplicateMilestone) {
    await messaging.sendMessage(payload.chatId,
      `🔁 <b>Practice Run Recognized: ${student.name} (${resolvedSubjectId.toUpperCase()} Week ${resolvedWeek}, Score: ${extraction.rawScore}/${extraction.totalScore})</b>\n\n` +
      `We noticed this assessment matches ${student.name}'s existing Week ${resolvedWeek} score. ` +
      `This has been logged as a <b>Practice Run</b> to protect baseline mastery data.\n\n` +
      `⬇️ <b>Printable PDF attachments are sent below:</b>`
    );
    try {
      await messaging.sendDocument(payload.chatId, {
        buffer: sprintPdfBytes,
        filename: `${student.name}_${resolvedSubjectId.toUpperCase()}_Week${resolvedWeek}_Sprint.pdf`,
        caption: `📄 <b>${student.name}'s 4-Page Targeted Sprint</b> (Practice Run • Week ${resolvedWeek})`,
      });
      await messaging.sendDocument(payload.chatId, {
        buffer: guidePdfBytes,
        filename: `Parent_Guide_${student.name}_${resolvedSubjectId.toUpperCase()}_Week${resolvedWeek}.pdf`,
        caption: `🧭 <b>Parent Socratic Coaching Guide</b> (Practice Run • Week ${resolvedWeek})`,
      });
    } catch (docErr) {
      console.warn('[processAssessment] Practice run document delivery error:', docErr);
    }
  } else {
    await messaging.deliverRemediationPacks(payload.chatId, {
      studentPackHtml: sprintUrl,
      studentPackPdf: sprintPdfBytes,
      coachingGuideHtml: guideUrl,
      coachingGuidePdf: guidePdfBytes,
      summaryUrl: 'https://aim.getvintel.com',
      studentName: student.name,
      subject: resolvedSubjectId,
      week: resolvedWeek,
    });
  }

  return {
    sprintId: sprint.id,
    guideId: guide.id,
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

  // 1. Run AI Partitioning if multiple images are present
  if (totalCount >= 2) {
    try {
      const settings = SettingsManager.getInstance();
      const apiKey = settings.get<string>('OPENROUTER_API_KEY', '');
      const model = settings.get<string>('OPENROUTER_VISION_MODEL', 'google/gemini-3.5-flash-lite');

      if (apiKey) {
        const contentParts: any[] = [
          {
            type: 'text',
            text: `You are an expert curriculum evaluator analyzing ${totalCount} worksheet page photos for Year 4 students Lara and Maya at Asten College.
CRITICAL CONTEXT:
- Both students received an identical English practice worksheet set (Vocabulary, Grammar, Punctuation, Word Classes).
- Inspect the student name header, handwriting style, and question order to separate the images into Lara and Maya.
Return strict JSON matching this schema:
{
  "laraPageIndices": number[],
  "mayaPageIndices": number[],
  "subject": "english",
  "laraAttemptStatus": string,
  "mayaAttemptStatus": string
}`
          }
        ];

      payload.imageUrls.forEach((url, i) => {
        contentParts.push({ type: 'text', text: `PAGE INDEX ${i}:` });
        contentParts.push({ type: 'image_url', image_url: { url } });
      });

      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://aim.getvintel.com',
          'X-Title': 'HEX-AIM Cognitive Intake'
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: contentParts }],
          temperature: 0.1,
          response_format: { type: 'json_object' }
        })
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
      }
    }
  } catch (partErr) {
    console.warn('[processBatchAssessmentJob] AI partition warning, falling back to sequential split:', partErr);
  }
}

  // Fallback partition: if AI partition did not assign images, do NOT blindly slice 50/50.
  // Treat entire batch as belonging to the primary detected student rather than guessing.
  if (laraImages.length === 0 && mayaImages.length === 0) {
    laraImages = payload.imageUrls;
    laraStatus = 'Full Intake (Single Batch)';
  }

  const batchSettings = SettingsManager.getInstance();
  const batchSubject = batchSettings.get<string>('curriculum.default_subject', 'english');
  const batchWeek = batchSettings.get<number>('curriculum.default_term_week', 3);

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
