export interface CurriculumConcept {
  code: string;
  subject: 'science' | 'maths' | 'english' | 'humanities' | 'arabic';
  strand: string;
  title: string;
  yearGroup: string;
  description: string;
  keyVocabulary: string[];
}

export class MultiSubjectCurriculumService {
  private static instance: MultiSubjectCurriculumService | null = null;
  private concepts: Map<string, CurriculumConcept> = new Map();

  private constructor() {
    this.seedCurriculum();
  }

  public static getInstance(): MultiSubjectCurriculumService {
    if (!this.instance) {
      this.instance = new MultiSubjectCurriculumService();
    }
    return this.instance;
  }

  private seedCurriculum(): void {
    const defaultConcepts: CurriculumConcept[] = [
      // Science KS2 Y4
      {
        code: 'ASTEN.Y4.SCI.VERTEBRATES.1',
        subject: 'science',
        strand: 'Living Things & Their Habitats',
        title: 'Vertebrates Classification & Internal Skeletons',
        yearGroup: 'Y4',
        description: 'Classify animals into vertebrates with an internal backbone/endoskeleton versus invertebrates.',
        keyVocabulary: ['vertebrate', 'invertebrate', 'endoskeleton', 'exoskeleton', 'backbone'],
      },
      {
        code: 'ASTEN.Y4.SCI.STATES_OF_MATTER.2',
        subject: 'science',
        strand: 'States of Matter',
        title: 'Solids, Liquids, and Gases Particle Movement',
        yearGroup: 'Y4',
        description: 'Observe that materials change state when heated or cooled and explain particle arrangement.',
        keyVocabulary: ['solid', 'liquid', 'gas', 'evaporation', 'condensation', 'particles'],
      },
      // Maths KS2 Y4 (White Rose aligned)
      {
        code: 'ASTEN.Y4.MATH.PLACE_VALUE.1',
        subject: 'maths',
        strand: 'Number & Place Value',
        title: '4-Digit Place Value & The Phantom Zero Trap',
        yearGroup: 'Y4',
        description: 'Represent 4-digit numbers with zero place holders and recognize place value column positions.',
        keyVocabulary: ['thousands', 'hundreds', 'tens', 'ones', 'placeholder', 'partition'],
      },
      {
        code: 'ASTEN.Y4.MATH.FRACTIONS.2',
        subject: 'maths',
        strand: 'Fractions & Decimals',
        title: 'Equivalent Fractions & Decimal Tenths',
        yearGroup: 'Y4',
        description: 'Recognize and write decimal equivalents of any number of tenths or hundredths.',
        keyVocabulary: ['numerator', 'denominator', 'equivalent', 'tenths', 'hundredths'],
      },
      // English KS2 Y4
      {
        code: 'ASTEN.Y4.ENG.SPAG.1',
        subject: 'english',
        strand: 'Grammar & Punctuation',
        title: 'Fronted Adverbials & Comma Splice Prevention',
        yearGroup: 'Y4',
        description: 'Use fronted adverbials followed by a comma to denote time, manner, or place.',
        keyVocabulary: ['fronted adverbial', 'comma', 'clause', 'manner', 'time', 'place'],
      },
      // Humanities KS2 Y4
      {
        code: 'ASTEN.Y4.HUM.HISTORY.1',
        subject: 'humanities',
        strand: 'Ancient Civilisations',
        title: 'Ancient Egypt & Nile Irrigation Agriculture',
        yearGroup: 'Y4',
        description: 'Examine the importance of the Nile inundation, shaduf irrigation, and the silt harvest.',
        keyVocabulary: ['nile', 'inundation', 'irrigation', 'shaduf', 'silt', 'pharaoh'],
      },
      // Arabic KS2 Y4
      {
        code: 'ASTEN.Y4.ARB.CLITICS.1',
        subject: 'arabic',
        strand: 'Arabic Language Fluency',
        title: 'Attached Pronoun Clitics (الضمائر المتصلة)',
        yearGroup: 'Y4',
        description: 'Recognize possessive and objective clitic suffixes attached to nouns and verbs in formal Arabic.',
        keyVocabulary: ['ضمير متصل', 'هاء الغائب', 'ياء المتكلم', 'كاف الخطاب'],
      },
    ];

    for (const c of defaultConcepts) {
      this.concepts.set(c.code, c);
    }
  }

  public getConcept(code: string): CurriculumConcept | null {
    return this.concepts.get(code) || null;
  }

  public getConceptsBySubject(subject: string, yearGroup = 'Y4'): CurriculumConcept[] {
    return Array.from(this.concepts.values()).filter(
      c => c.subject === subject.toLowerCase() && c.yearGroup === yearGroup
    );
  }

  public getAllConcepts(): CurriculumConcept[] {
    return Array.from(this.concepts.values());
  }
}
