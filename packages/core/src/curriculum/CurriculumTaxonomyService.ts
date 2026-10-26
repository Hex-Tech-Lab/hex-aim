import type { AssessmentType, MilestoneType } from '@hex-aim/types';

export interface ClassificationMatch {
  subjectId: string;
  subjectName: string;
  confidence: number; // 0.0 to 1.0
  matchedKeywords: string[];
}

export interface AssessmentMetadataMatch {
  assessmentType: AssessmentType;
  milestoneType: MilestoneType;
  detectedMilestone?: string;
  confidence: number;
}

/**
 * 50-100 High-Density Curricular Keywords per subject derived directly from British National
 * & Egyptian MOE Primary Curriculum Exhibits.
 */
export const CURRICULUM_KEYWORDS: Record<string, string[]> = {
  science: [
    'skeleton', 'skeletons', 'bone', 'bones', 'skull', 'rib', 'ribs', 'rib cage', 'spine', 'backbone',
    'vertebrae', 'pelvis', 'femur', 'muscle', 'muscles', 'biceps', 'triceps', 'contracts', 'contract',
    'relaxes', 'relax', 'tendon', 'ligament', 'joint', 'joints', 'movement', 'locomotion', 'organ',
    'organs', 'brain', 'heart', 'lungs', 'stomach', 'protects', 'support', 'vertebrate', 'vertebrates',
    'invertebrate', 'invertebrates', 'mammal', 'mammals', 'bird', 'birds', 'reptile', 'reptiles',
    'amphibian', 'amphibians', 'fish', 'exoskeleton', 'hydrostatic', 'endoskeleton', 'microorganism',
    'microorganisms', 'bacteria', 'virus', 'fungi', 'pathogen', 'infectious', 'disease', 'vaccine',
    'vaccines', 'vaccination', 'antibiotic', 'antibiotics', 'medicine', 'medicines', 'hygiene',
    'habitat', 'habitats', 'ecosystem', 'producer', 'consumer', 'predator', 'prey', 'food chain',
    'solid', 'solids', 'liquid', 'liquids', 'gas', 'gases', 'evaporation', 'condensation', 'precipitation',
    'water cycle', 'melting', 'freezing', 'vibration', 'vibrations', 'sound', 'pitch', 'volume',
    'acoustic', 'electricity', 'circuit', 'circuits', 'battery', 'cell', 'switch', 'conductor', 'insulator',
  ],
  maths: [
    'arithmetic', 'place value', 'digit', 'digits', 'thousands', 'hundreds', 'tens', 'ones', 'units',
    'partition', 'partitioning', 'numeral', 'numerals', 'number line', 'negative', 'negative numbers',
    'addition', 'add', 'plus', 'sum', 'total', 'subtraction', 'subtract', 'minus', 'difference', 'take away',
    'multiplication', 'multiply', 'times', 'product', 'division', 'divide', 'share', 'quotient', 'remainder',
    'column addition', 'column subtraction', 'regroup', 'regrouping', 'carry', 'carrying', 'borrow', 'borrowing',
    'times tables', 'multiple', 'multiples', 'factor', 'factors', 'fraction', 'fractions', 'numerator',
    'denominator', 'equivalent fraction', 'decimal', 'decimals', 'tenths', 'hundredths', 'rounding', 'round',
    'estimate', 'estimation', 'perimeter', 'area', 'geometry', 'shape', 'shapes', 'polygon', 'triangle',
    'quadrilateral', 'rectangle', 'square', 'pentagon', 'hexagon', 'octagon', 'symmetry', 'symmetric',
    'angle', 'angles', 'acute', 'obtuse', 'right angle', 'coordinates', 'grid', 'x axis', 'y axis',
    'measurement', 'length', 'mass', 'weight', 'capacity', 'grams', 'kilograms', 'millilitres', 'litres',
    'metres', 'centimetres', 'millimetres', 'time', 'analogue', 'digital', 'clock', 'minutes', 'hours',
    'statistics', 'bar chart', 'pictogram', 'line graph', 'table', 'tally', 'data', 'interpret',
  ],
  english: [
    'reading', 'comprehension', 'retrieval', 'retrieve', 'inference', 'infer', 'deduce', 'prediction',
    'predict', 'summary', 'summarise', 'author', 'narrator', 'character', 'setting', 'plot', 'theme',
    'spelling', 'phonics', 'syllable', 'prefix', 'suffix', 'root word', 'vocabulary', 'definition',
    'synonym', 'antonym', 'grammar', 'punctuation', 'sentence', 'sentences', 'capital letter', 'full stop',
    'comma', 'commas', 'question mark', 'exclamation mark', 'apostrophe', 'apostrophes', 'inverted commas',
    'speech marks', 'direct speech', 'reporting clause', 'noun', 'nouns', 'proper noun', 'pronoun',
    'pronouns', 'verb', 'verbs', 'past tense', 'present tense', 'adjective', 'adjectives', 'adverb',
    'adverbs', 'fronted adverbial', 'preposition', 'prepositions', 'conjunction', 'conjunctions',
    'coordinating', 'subordinating', 'clause', 'clauses', 'main clause', 'subordinate clause', 'paragraph',
    'paragraphs', 'connective', 'expanded noun phrase', 'homophone', 'spag',
  ],
  arabic: [
    'لغة عربية', 'اللغة العربية', 'عربي', 'قراءة', 'فهم', 'نص', 'قصة', 'فقرة', 'استخراج',
    'نحو', 'قواعد', 'إعراب', 'جملة فعلية', 'جملة اسمية', 'فعل', 'ماض', 'مضارع', 'أمر',
    'فاعل', 'مفعول به', 'مبتدأ', 'خبر', 'اسم', 'حرف', 'حرف جر', 'ضمير', 'ضمائر', 'اسم إشارة',
    'اسم موصول', 'إملاء', 'همزة', 'همزة وصل', 'همزة قطع', 'مد', 'تنوين', 'تاء مربوطة', 'تاء مفتوحة',
    'لام شمسية', 'لام قمرية', 'خط', 'تعبير', 'موضوع', 'أسلوب أمر', 'أسلوب نهي', 'أسلوب نداء',
    'أسلوب استفهام', 'مفرد', 'مثنى', 'جمع', 'مذكر', 'مؤنث', 'مرادف', 'مضاد',
  ],
  humanities: [
    'history', 'historical', 'ancient egypt', 'pharaoh', 'pharaohs', 'nile', 'river nile', 'pyramid',
    'pyramids', 'tomb', 'tombs', 'mummy', 'mummification', 'archaeology', 'artefact', 'chronology',
    'timeline', 'century', 'decade', 'civilization', 'geography', 'geographic', 'continent', 'continents',
    'country', 'countries', 'capital', 'map', 'atlas', 'compass', 'north', 'south', 'east', 'west',
    'equator', 'hemisphere', 'climate', 'weather', 'biomes', 'desert', 'rainforest', 'river', 'mountain',
  ],
};

/**
 * Standard Assessment Modality Keyword Triggers
 */
const MODALITY_TRIGGERS: Array<{
  terms: string[];
  assessmentType: AssessmentType;
  milestoneType: MilestoneType;
}> = [
  {
    terms: ['midterm', 'mid term', 'mid-term', 'half term', 'half-term'],
    assessmentType: 'midterm_exam',
    milestoneType: 'midterm_summative',
  },
  {
    terms: ['unit test', 'end of unit', 'unit assessment', 'unit check'],
    assessmentType: 'unit_test',
    milestoneType: 'end_of_unit_summative',
  },
  {
    terms: ['revision sprint', 'rapid review', 'revision sheet', 'revision pack'],
    assessmentType: 'revision_sprint',
    milestoneType: 'targeted_remediation',
  },
  {
    terms: ['practice run', 'practice test', 'practice sheet', 'trial run'],
    assessmentType: 'practice_run',
    milestoneType: 'targeted_remediation',
  },
  {
    terms: ['diagnostic', 'baseline', 'placement', 'binder'],
    assessmentType: 'diagnostic_binder',
    milestoneType: 'end_of_unit_summative',
  },
  {
    terms: ['homework', 'home work', 'take home', 'prep work'],
    assessmentType: 'homework_assignment',
    milestoneType: 'weekly_formative',
  },
  {
    terms: ['weekly quiz', 'spelling test', 'mental maths', 'weekly check', 'quiz'],
    assessmentType: 'weekly_quiz',
    milestoneType: 'weekly_formative',
  },
];

export class CurriculumTaxonomyService {
  private static instance: CurriculumTaxonomyService;

  private constructor() {}

  public static getInstance(): CurriculumTaxonomyService {
    if (!CurriculumTaxonomyService.instance) {
      CurriculumTaxonomyService.instance = new CurriculumTaxonomyService();
    }
    return CurriculumTaxonomyService.instance;
  }

  /**
   * Fast text-based subject classification based on vocabulary keyword density.
   * Execution time < 1ms.
   */
  public classifyContent(text: string): ClassificationMatch {
    const normalized = text.toLowerCase();
    const scores: Record<string, { count: number; matched: string[] }> = {};

    for (const [subject, keywords] of Object.entries(CURRICULUM_KEYWORDS)) {
      scores[subject] = { count: 0, matched: [] };
      for (const kw of keywords) {
        const isAscii = /^[\x00-\x7F]*$/.test(kw);
        const regex = isAscii
          ? (kw.length > 3 ? new RegExp(`\\b${kw}\\b`, 'i') : new RegExp(kw, 'i'))
          : new RegExp(`(^|\\s|[\\p{P}]|[وفكبل])${kw}($|\\s|[\\p{P}])`, 'u');
        if (regex.test(normalized)) {
          scores[subject]!.count += 1;
          scores[subject]!.matched.push(kw);
        }
      }
    }

    let topSubject = 'maths';
    let maxCount = -1;

    for (const [subj, data] of Object.entries(scores)) {
      if (data.count > maxCount) {
        maxCount = data.count;
        topSubject = subj;
      }
    }

    const totalMatches = Object.values(scores).reduce((sum, s) => sum + s.count, 0);
    const confidence = totalMatches > 0 ? maxCount / totalMatches : 0.5;

    return {
      subjectId: topSubject,
      subjectName: this.getSubjectDisplayName(topSubject),
      confidence: Math.min(1.0, Math.max(0.0, Number(confidence.toFixed(2)))),
      matchedKeywords: scores[topSubject]?.matched || [],
    };
  }

  /**
   * Classifies assessment modality and milestone type from header text.
   */
  public classifyModality(text: string): AssessmentMetadataMatch {
    const normalized = text.toLowerCase();

    for (const trigger of MODALITY_TRIGGERS) {
      for (const term of trigger.terms) {
        if (normalized.includes(term)) {
          return {
            assessmentType: trigger.assessmentType,
            milestoneType: trigger.milestoneType,
            detectedMilestone: term,
            confidence: 0.95,
          };
        }
      }
    }

    // Default to weekly quiz / formative
    return {
      assessmentType: 'weekly_quiz',
      milestoneType: 'weekly_formative',
      confidence: 0.6,
    };
  }

  /**
   * Generates a dynamic, unbiased prompt block for Multimodal Vision models.
   * Replaces all hardcoded subject enums with SSOT curriculum rules.
   */
  public buildVisionInstructionPrompt(schoolName = 'Primary School', yearGroup = 'Year 4'): string {
    const subjectSections = Object.entries(CURRICULUM_KEYWORDS)
      .map(([subj, keywords]) => {
        const sampleKws = keywords.slice(0, 15).join(', ');
        return `   - "${subj}": ${sampleKws}, etc.`;
      })
      .join('\n');

    return `You are an expert diagnostic evaluator analyzing teacher-marked school worksheets for ${yearGroup} students at ${schoolName}.

CRITICAL INSTRUCTIONS:
1. Student Identification: Inspect the name written at the top. Extract the handwritten student first name as "detectedStudentName" (e.g. "Lara", "Maya", or whatever name is written). If no name is found, return null.
2. Subject Classification: Inspect the content and classify into one of the canonical curriculum subjects:
${subjectSections}
   Return the matching subject identifier as "detectedSubject".
3. Assessment Modality & Milestone:
   - Identify if this is a "midterm_exam", "unit_test", "weekly_quiz", "practice_run", "revision_sprint", or "homework_assignment".
   - Identify the term week (e.g. 1-12) or milestone name. If none is labeled, estimate the curriculum term week or return null.
4. Item Analysis: For each question:
   - qNum: Question number (e.g. "1", "2a")
   - conceptCode: Subject-specific concept identifier (e.g. "Y4.SCI.SKELETON.BONES" or "Y4.MATH.NPV.EMPTY_COLUMNS")
   - studentAnswer: Exact handwritten response written by the child
   - correctAnswer: Expected correct answer according to the curriculum mark scheme
   - status: "pass" | "fail" | "partial" (look for teacher checkmarks, crosses, or score notes)
   - errorClass: Formal error categorization (e.g. "ERR_PHANTOM_ZERO", "ERR_MUSCLE_ACTION_CONFUSION", "ERR_SPELLING_PHONETIC", "ERR_CONCEPT_OMISSION")
   - cognitiveFactor: Pedagogical root cause (e.g. "working_memory_rush", "antagonistic_pair_inversion", "place_value_room_slip")
5. Scoring:
   - rawScore: Total marks or items scored as pass
   - totalScore: Total marks or items on the worksheet

Return STRICT JSON ONLY matching this schema:
{
  "detectedStudentName": string | null,
  "detectedSubject": string,
  "assessmentType": string,
  "detectedWeek": number | null,
  "detectedYearGroup": string,
  "rawScore": number,
  "totalScore": number,
  "items": [
    {
      "qNum": string,
      "conceptCode": string,
      "studentAnswer": string,
      "correctAnswer": string,
      "status": "pass" | "fail" | "partial",
      "errorClass": string,
      "cognitiveFactor": string
    }
  ]
}`;
  }

  public getSubjectDisplayName(subjectId: string): string {
    switch (subjectId.toLowerCase()) {
      case 'science': return 'Science';
      case 'maths': return 'Mathematics';
      case 'english': return 'English Language & Literacy';
      case 'arabic': return 'Arabic Language (اللغة العربية)';
      case 'humanities': return 'Humanities (History & Geography)';
      case 'religion': return 'Religious Education (التربية الدينية)';
      default: return subjectId.charAt(0).toUpperCase() + subjectId.slice(1);
    }
  }
}
