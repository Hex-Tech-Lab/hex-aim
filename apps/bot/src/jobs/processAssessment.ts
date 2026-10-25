import {
  StorageFactory,
  VisionFactory,
  MessagingFactory,
  DubLinkAdapter
} from '@hex-aim/adapters';
import {
  CanonicalDeduplicator,
  AdaptiveSprintCompiler,
  SocraticGuideCompiler
} from '@hex-aim/core';
import type {
  CognitiveGap,
  Student
} from '@hex-aim/types';

export interface ProcessAssessmentPayload {
  studentId: string;
  guardianId?: string;
  chatId: string;
  imageUrls: string[];
  subjectId: string;
  yearGroup: string;
  termWeek: number;
  schoolId?: string;
}

export async function processAssessmentJob(payload: ProcessAssessmentPayload): Promise<{
  sprintId: string;
  guideId: string;
  score: { raw: number; total: number; percentage: number };
}> {
  const storage = StorageFactory.getStorage();
  const vision = VisionFactory.getVision();
  const messaging = MessagingFactory.getMessaging();

  const schoolId = payload.schoolId || 'asten-college';
  const student = (await storage.getStudent(payload.studentId)) || {
    id: payload.studentId,
    name: 'Student',
    schoolId,
    yearGroup: payload.yearGroup,
    curriculumTrack: 'british' as const,
    neuroProfile: {
      hasAdhdTraits: true,
      hasDyslexiaTraits: false,
      workingMemoryCapacity: 'vulnerable_under_time_pressure' as const,
      optimalSprintDurationMins: 8,
    },
  } as Student;

  const guardian = payload.guardianId ? await storage.getGuardian(payload.guardianId) : null;

  // 1. Run Vision Extraction
  const extraction = await vision.extractAssessment(payload.imageUrls, {
    studentId: payload.studentId,
    subjectId: payload.subjectId,
    yearGroup: payload.yearGroup,
  });

  const percentage = Math.round((extraction.rawScore / Math.max(1, extraction.totalScore)) * 100);

  // 2. Check for Duplicate Assessment / Practice Run
  const priorAssessments = await storage.getStudentAssessments(payload.studentId, payload.subjectId);
  const isDuplicateMilestone = priorAssessments.some(a => 
    a.termWeek === payload.termWeek && (a.rawScore === extraction.rawScore || Math.abs(a.percentage - percentage) < 3)
  );

  const dedupContext = {
    schoolId,
    yearGroup: payload.yearGroup,
    subjectId: payload.subjectId,
    termWeek: payload.termWeek,
  };

  const { submission } = CanonicalDeduplicator.processSubmission(null, dedupContext, {
    studentId: payload.studentId,
    guardianId: payload.guardianId,
    rawScore: extraction.rawScore,
    totalScore: extraction.totalScore,
    percentage,
    items: extraction.items,
    sourceImageUrls: payload.imageUrls,
  });

  await storage.saveAssessment(submission);

  // 3. Update Cognitive Gap Ledger (Only if NOT a repeated duplicate milestone)
  let targetGaps: CognitiveGap[] = [];
  const existingGaps = await storage.getStudentGaps(payload.studentId);

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
            id: `gap_${payload.studentId}_${item.conceptCode}_${Date.now()}`,
            studentId: payload.studentId,
            conceptCode: item.conceptCode,
            errorClass: item.errorClass,
            description: `Identified error ${item.errorClass} in Question ${item.qNum}`,
            firstObservedDate: nowStr,
            lastObservedDate: nowStr,
            recurrenceCount: 1,
            status: 'active_priority',
            socraticHint: 'Guide the student to check place value columns with the elevator model.',
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
    await storage.saveStudentGaps(payload.studentId, updatedGaps);
    targetGaps = updatedGaps.filter(g => g.status === 'active_priority');
  } else {
    // Practice run: use active priority gaps without skewing recurrence counts
    targetGaps = existingGaps.filter(g => g.status === 'active_priority');
    if (targetGaps.length === 0) {
      targetGaps = existingGaps.slice(0, 3);
    }
  }

  // 4. Compile 4-Page Print Sprint & Parent Socratic Guide
  const sprint = AdaptiveSprintCompiler.compile(student, targetGaps, {
    subjectTitle: payload.subjectId.toUpperCase(),
  });
  await storage.saveRemediationSprint(sprint);

  const guide = SocraticGuideCompiler.compile(student, targetGaps, guardian || undefined);
  await storage.saveCoachingGuide(guide);

  // 5. Deliver Links via Messaging Port (Telegram / WhatsApp) with Dub.co tracking
  const rawSprintUrl = `https://aim.getvintel.com/sprint/preview?id=${sprint.id}`;
  const rawGuideUrl = `https://aim.getvintel.com/guide/preview?id=${guide.id}`;

  const dub = new DubLinkAdapter();
  const sprintUrl = await dub.createShortLink(rawSprintUrl);
  const guideUrl = await dub.createShortLink(rawGuideUrl);

  if (isDuplicateMilestone) {
    await messaging.sendMessage(payload.chatId,
      `🔁 <b>Practice Run Recognized: ${payload.subjectId.toUpperCase()} Week ${payload.termWeek} (Score: ${extraction.rawScore}/${extraction.totalScore})</b>\n\n` +
      `We noticed this assessment matches your child's existing Week ${payload.termWeek} quiz score. ` +
      `This has been logged as a <b>Practice Run</b> to preserve baseline mastery data.\n\n` +
      `📄 <b>Targeted 4-Page Sprint Pack:</b>\n` +
      `🔗 <a href="${sprintUrl}">Open Printable Student Pack</a>\n\n` +
      `🧭 <b>Parent Socratic Coaching Guide:</b>\n` +
      `🔗 <a href="${guideUrl}">Open 8-Minute Coaching Script</a>\n\n` +
      `📝 <b>Blank Practice Template:</b>\n` +
      `🔗 <a href="${sprintUrl}">Download Clean Exam Template</a>\n\n` +
      `💡 <i>Baseline cognitive gap ledger is protected from duplicate score skew.</i>`
    );
  } else {
    await messaging.deliverRemediationPacks(payload.chatId, {
      studentPackHtml: sprintUrl,
      coachingGuideHtml: guideUrl,
    });
  }

  return {
    sprintId: sprint.id,
    guideId: guide.id,
    score: {
      raw: extraction.rawScore,
      total: extraction.totalScore,
      percentage,
    },
  };
}
