import type { 
  IVisionExtractionPort, 
  AssessmentItem 
} from '@hex-aim/types';

export class MockVisionAdapter implements IVisionExtractionPort {
  public mockItems: AssessmentItem[] = [
    {
      qNum: '1',
      conceptCode: 'Y4.MATH.NPV.EMPTY_COLUMNS',
      studentAnswer: '24,16',
      correctAnswer: '24,106',
      status: 'fail',
      errorClass: 'ERR_PHANTOM_ZERO',
      cognitiveFactor: 'empty_column_omission',
    },
    {
      qNum: '2',
      conceptCode: 'Y4.MATH.NPV.NEGATIVE_NUMBERS',
      studentAnswer: '-4, -1, 0, 3',
      correctAnswer: '-4, -1, 0, 3',
      status: 'pass',
    },
    {
      qNum: '3',
      conceptCode: 'Y4.MATH.NPV.WRITING_NUMBERS',
      studentAnswer: '03',
      correctAnswer: '30',
      status: 'fail',
      errorClass: 'ERR_TRANSPOSITION',
      cognitiveFactor: 'working_memory_rush',
    },
  ];

  public async extractAssessment(
    _imageUrls: string[],
    context: { studentId: string; subjectId: string; yearGroup: string }
  ): Promise<{
    items: AssessmentItem[];
    rawScore: number;
    totalScore: number;
    detectedStudentName?: string;
  }> {
    const passed = this.mockItems.filter(i => i.status === 'pass').length;
    return {
      detectedStudentName: `Student-${context.studentId}`,
      rawScore: passed,
      totalScore: this.mockItems.length,
      items: this.mockItems,
    };
  }
}
