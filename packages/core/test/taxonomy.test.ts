import { describe, it, expect } from 'vitest';
import { CurriculumTaxonomyService } from '../src/curriculum/CurriculumTaxonomyService.js';

describe('CurriculumTaxonomyService', () => {
  const taxonomy = CurriculumTaxonomyService.getInstance();

  it('correctly classifies Year 4 Science worksheet on muscles and skeleton', () => {
    const scienceText = `
      Year 4 Midterm Science Revision
      Name: Lara
      Q1: What bone protects the brain? Skull.
      Q2: When bending the arm, the biceps contracts and gets shorter, pulling the forearm up.
      Q3: Are rabbits vertebrates or invertebrates? Vertebrates (they have an internal skeleton).
      Q4: How do vaccines protect against infectious diseases caused by microorganisms?
    `;

    const match = taxonomy.classifyContent(scienceText);
    expect(match.subjectId).toBe('science');
    expect(match.confidence).toBeGreaterThan(0.7);
    expect(match.matchedKeywords).toContain('skull');
    expect(match.matchedKeywords).toContain('biceps');
    expect(match.matchedKeywords).toContain('contracts');
    expect(match.matchedKeywords).toContain('vertebrates');
  });

  it('correctly classifies Year 4 Mathematics worksheet on column addition & place value', () => {
    const mathsText = `
      Mathematics Weekly Check - Place Value & Addition
      Q1: Partition the digits in 24,106 into thousands, hundreds, tens, and units.
      Q2: Solve using column addition with regrouping and carrying: 4,582 + 3,849.
      Q3: Place -4°C and -1°C on the negative number line.
    `;

    const match = taxonomy.classifyContent(mathsText);
    expect(match.subjectId).toBe('maths');
    expect(match.confidence).toBeGreaterThan(0.7);
    expect(match.matchedKeywords).toContain('place value');
    expect(match.matchedKeywords).toContain('column addition');
    expect(match.matchedKeywords).toContain('regrouping');
  });

  it('correctly classifies Year 4 English comprehension text', () => {
    const englishText = `
      English Reading Comprehension & SPaG
      Read the story and answer the questions.
      Q1: Retrieve the character's reaction when she entered the forest.
      Q2: Infer why the narrator used an exclamation mark in paragraph 2.
      Q3: Add inverted commas and a comma for direct speech: "Stop!" shouted Tom.
    `;

    const match = taxonomy.classifyContent(englishText);
    expect(match.subjectId).toBe('english');
    expect(match.confidence).toBeGreaterThan(0.7);
    expect(match.matchedKeywords).toContain('comprehension');
    expect(match.matchedKeywords).toContain('infer');
    expect(match.matchedKeywords).toContain('direct speech');
  });

  it('correctly classifies Arabic grammar and comprehension text', () => {
    const arabicText = `
      اختبار اللغة العربية - الصف الرابع
      اقرأ الفقرة ثم استخرج ما يلي:
      1. فاعل مرفوع بالضمة
      2. فعل ماض ومفعول به
      3. جملة فعلية تبدأ بحرف جر
    `;

    const match = taxonomy.classifyContent(arabicText);
    expect(match.subjectId).toBe('arabic');
    expect(match.confidence).toBeGreaterThan(0.7);
    expect(match.matchedKeywords).toContain('فاعل');
    expect(match.matchedKeywords).toContain('مفعول به');
  });

  it('correctly classifies assessment modalities and milestones', () => {
    expect(taxonomy.classifyModality('Year 4 Science Midterm Exam').assessmentType).toBe('midterm_exam');
    expect(taxonomy.classifyModality('Year 4 Science Midterm Exam').milestoneType).toBe('midterm_summative');

    expect(taxonomy.classifyModality('Unit 1 Living Things End of Unit Assessment').assessmentType).toBe('unit_test');
    expect(taxonomy.classifyModality('Practice Run #2 Place Value').assessmentType).toBe('practice_run');
    expect(taxonomy.classifyModality('Take home homework sheet').assessmentType).toBe('homework_assignment');
    expect(taxonomy.classifyModality('Weekly spelling test').assessmentType).toBe('weekly_quiz');
  });
});
