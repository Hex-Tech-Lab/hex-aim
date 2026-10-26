import { describe, it, expect, beforeEach } from 'vitest';
import {
  StorageFactory,
  QueueFactory,
  MessagingFactory,
  VisionFactory,
  InMemoryStorageAdapter,
  DirectExecutionQueueAdapter,
  MockMessagingAdapter,
  MockVisionAdapter
} from '../src/index.js';
import type { Student, CognitiveGap } from '@hex-aim/types';

describe('Adapters & Factory Hierarchy', () => {
  beforeEach(() => {
    StorageFactory.reset();
    QueueFactory.reset();
    MessagingFactory.reset();
    VisionFactory.reset();
  });

  it('StorageFactory returns InMemoryStorageAdapter as resilient fallback', async () => {
    const storage = StorageFactory.getStorage('memory');
    expect(storage).toBeInstanceOf(InMemoryStorageAdapter);

    const student: Student = {
      id: 'student_123',
      name: 'Youssef',
      schoolId: 'asten-college',
      yearGroup: 'Y4',
      curriculumTrack: 'british',
      neuroProfile: {
        hasAdhdTraits: true,
        hasDyslexiaTraits: false,
        workingMemoryCapacity: 'vulnerable_under_time_pressure',
        optimalSprintDurationMins: 8
      }
    };

    await storage.saveStudent(student);
    const retrieved = await storage.getStudent('student_123');
    expect(retrieved?.name).toBe('Youssef');

    const gap: CognitiveGap = {
      id: 'g1',
      studentId: 'student_123',
      conceptCode: 'Y4.MATH.NPV.1',
      errorClass: 'ERR_PHANTOM_ZERO',
      description: 'Omits zero in thousands room',
      firstObservedDate: '2026-10-24',
      lastObservedDate: '2026-10-24',
      recurrenceCount: 1,
      status: 'active_priority'
    };

    await storage.saveStudentGaps('student_123', [gap]);
    const gaps = await storage.getStudentGaps('student_123');
    expect(gaps).toHaveLength(1);
    expect(gaps[0]?.errorClass).toBe('ERR_PHANTOM_ZERO');
  });

  it('Storage adapter saves and finds Canonical Assessment Master', async () => {
    const storage = StorageFactory.getStorage('memory');
    const master = {
      id: 'master_asten_y4_science_w8',
      schoolId: 'asten-college',
      yearGroup: 'Y4',
      subjectId: 'science',
      termWeek: 8,
      title: 'Science Midterm Sprint Exam',
      schemaQuestions: [
        { qNum: 'Q1', conceptCode: 'Y4.SCI.VERTEBRATES', maxMarks: 1, promptText: 'Classify animals' },
        { qNum: 'Q2', conceptCode: 'Y4.SCI.SKELETONS', maxMarks: 1, promptText: 'Bones and muscles' },
      ],
    };

    if (storage.saveCanonicalMaster) {
      await storage.saveCanonicalMaster(master);
    }
    const retrieved = storage.getCanonicalMaster 
      ? await storage.getCanonicalMaster(master.id) 
      : null;
    expect(retrieved?.title).toBe('Science Midterm Sprint Exam');

    const found = storage.findCanonicalMaster
      ? await storage.findCanonicalMaster('Asten-College', 'y4', 'Science', 8)
      : null;
    expect(found?.id).toBe(master.id);
  });

  it('QueueFactory returns DirectExecutionQueueAdapter as fallback', async () => {
    const queue = QueueFactory.getQueue('direct');
    expect(queue).toBeInstanceOf(DirectExecutionQueueAdapter);

    let executed = false;
    (queue as DirectExecutionQueueAdapter).registerHandler('test-job', async () => {
      executed = true;
    });

    const msgId = await queue.enqueueJob('test-job', { foo: 'bar' });
    expect(msgId).toBeTruthy();

    await new Promise(r => setTimeout(r, 50));
    expect(executed).toBe(true);
  });

  it('MessagingFactory returns MockMessagingAdapter as fallback', async () => {
    const messaging = MessagingFactory.getMessaging('mock');
    expect(messaging).toBeInstanceOf(MockMessagingAdapter);

    await messaging.sendMessage('chat_1', 'Hello parent!');
    const mock = messaging as MockMessagingAdapter;
    expect(mock.sentMessages).toHaveLength(1);
    expect(mock.sentMessages[0]?.text).toBe('Hello parent!');
  });

  it('VisionFactory returns MockVisionAdapter as fallback and extracts items', async () => {
    const vision = VisionFactory.getVision('mock');
    expect(vision).toBeInstanceOf(MockVisionAdapter);

    const result = await vision.extractAssessment(['https://example.com/quiz.jpg'], {
      studentId: 'student_123',
      subjectId: 'maths',
      yearGroup: 'Y4'
    });

    expect(result.items).toHaveLength(3);
    expect(result.rawScore).toBe(1);
    expect(result.totalScore).toBe(3);
    expect(result.items[0]?.errorClass).toBe('ERR_PHANTOM_ZERO');
  });

  it('Storage adapter saves and retrieves Multi-Guardian Family Unit', async () => {
    const storage = StorageFactory.getStorage('memory');
    const family = {
      id: 'family_101',
      name: 'Test Family',
      studentIds: ['lara', 'maya'],
      guardians: [
        { guardianId: 'g1', chatId: '12345', channel: 'telegram' as const, name: 'Dad', role: 'primary_coach' as const },
        { guardianId: 'g2', chatId: '67890', channel: 'whatsapp' as const, name: 'Mom', role: 'co_guardian' as const }
      ],
      createdAt: new Date().toISOString()
    };

    if (storage.saveFamilyUnit) {
      await storage.saveFamilyUnit(family);
      const byId = await storage.getFamilyUnit?.('family_101');
      expect(byId?.name).toBe('Test Family');

      const byChat = await storage.getFamilyByChatId?.('67890');
      expect(byChat?.id).toBe('family_101');
    }
  });
});
