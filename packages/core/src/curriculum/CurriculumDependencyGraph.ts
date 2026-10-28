import type {
  CurriculumConceptNode,
  ConceptDependencyChain,
  StudentCurriculumRecommendation,
} from '@hex-aim/types';

/**
 * Wave 19: Dynamic Curriculum Year-Group & Concept Dependency Graph Engine
 * 
 * Implements a directed acyclic graph (DAG) representing British Primary Curriculum
 * concept dependencies. Traces surface misconceptions back to root prerequisite gaps
 * across Years 3 to 6, and dynamically recommends targeted master worksheets.
 */
export class CurriculumDependencyGraph {
  private static instance: CurriculumDependencyGraph | null = null;
  private nodes: Map<string, CurriculumConceptNode> = new Map();

  public constructor() {
    this.seedGraph();
  }

  public static getInstance(): CurriculumDependencyGraph {
    if (!this.instance) {
      this.instance = new CurriculumDependencyGraph();
    }
    return this.instance;
  }

  public registerNode(node: CurriculumConceptNode): void {
    this.nodes.set(node.code, node);
  }

  public getNode(code: string): CurriculumConceptNode | undefined {
    return this.nodes.get(code);
  }

  public getAllNodes(): CurriculumConceptNode[] {
    return Array.from(this.nodes.values());
  }

  /**
   * Returns all immediate prerequisite nodes for a given concept code.
   */
  public getPrerequisites(code: string): CurriculumConceptNode[] {
    const node = this.nodes.get(code);
    if (!node || !node.prerequisites) return [];
    return node.prerequisites
      .map((pCode) => this.nodes.get(pCode))
      .filter((n): n is CurriculumConceptNode => n !== undefined);
  }

  /**
   * Recursively traces the full prerequisite lineage back to the root foundational concept.
   */
  public traceDependencyPath(targetCode: string): CurriculumConceptNode[] {
    const path: CurriculumConceptNode[] = [];
    const visited = new Set<string>();

    const dfs = (code: string) => {
      if (visited.has(code)) return;
      visited.add(code);
      const node = this.nodes.get(code);
      if (!node) return;

      for (const prereqCode of node.prerequisites) {
        dfs(prereqCode);
      }
      path.push(node);
    };

    dfs(targetCode);
    return path;
  }

  /**
   * Identifies the earliest unmet root prerequisite blocking student progress.
   */
  public traceRootBlocker(
    targetCode: string,
    studentMasteredCodes: Set<string> = new Set()
  ): ConceptDependencyChain {
    const targetNode = this.nodes.get(targetCode);
    const targetTitle = targetNode ? targetNode.title : targetCode;
    const lineage = this.traceDependencyPath(targetCode);

    const prerequisitePath = lineage.map((node) => ({
      code: node.code,
      title: node.title,
      yearGroup: node.yearGroup,
      isMastered: studentMasteredCodes.has(node.code),
    }));

    // Earliest unmastered node in the topological chain is the root blocker
    const rootUnmastered = prerequisitePath.find((step) => !step.isMastered);
    const rootBlockerCode = rootUnmastered ? rootUnmastered.code : targetCode;

    return {
      targetCode,
      targetTitle,
      prerequisitePath,
      rootBlockerCode,
    };
  }

  /**
   * Computes an individualized recommendation tailored to a specific student's active gaps.
   */
  public getStudentRecommendation(
    studentId: string,
    studentName: string,
    yearGroup: string,
    activeMisconceptions: string[],
    studentMasteredCodes: Set<string> = new Set()
  ): StudentCurriculumRecommendation {
    // If student has active misconceptions, trace the primary one
    const primaryGap: string = (activeMisconceptions.length > 0 && activeMisconceptions[0])
      ? activeMisconceptions[0]
      : 'Y4.SCI.SND.MEDIUM';

    const chain = this.traceRootBlocker(primaryGap, studentMasteredCodes);
    const rootCode: string = chain.rootBlockerCode || primaryGap;
    const rootNode = this.nodes.get(rootCode) || this.nodes.get(primaryGap);

    const templateId = (rootNode && rootNode.recommendedTemplateIds && rootNode.recommendedTemplateIds[0])
      ? rootNode.recommendedTemplateIds[0]
      : 'sci-w8';
    const templateTitle = this.resolveTemplateTitle(templateId);

    return {
      studentId,
      studentName,
      yearGroup,
      primaryRootBlocker: {
        code: rootCode,
        title: rootNode ? rootNode.title : rootCode,
        yearGroup: rootNode ? rootNode.yearGroup : yearGroup,
        prerequisiteFor: primaryGap,
      },
      recommendedTemplateId: templateId,
      recommendedTemplateTitle: templateTitle,
      dependencyChain: chain,
    };
  }

  private resolveTemplateTitle(templateId: string): string {
    switch (templateId) {
      case 'sci-w8':
        return 'Y4 Science: Sound, Pitch & Auditory Vibrations';
      case 'math-w8':
        return 'Y4 Maths: Decimals & Place Value Alignment';
      case 'eng-w7':
        return 'Y4 English: Suffixes, Prefixes & Sentence Syntax';
      case 'sci-elec':
        return 'Y4 Science: Complete Electrical Circuits & Switches';
      case 'sci-states':
        return 'Y4 Science: States of Matter & Particle Motion';
      default:
        return 'Canonical Master Curriculum Worksheet';
    }
  }

  /**
   * Seeds the standard British Primary Key Stage 2 Curriculum Concept Graph (Years 3–6).
   */
  private seedGraph(): void {
    const nodes: CurriculumConceptNode[] = [
      // ==========================================
      // SCIENCE: SOUND, VIBRATIONS & ENERGY
      // ==========================================
      {
        code: 'Y3.SCI.SND.EARS',
        subject: 'science',
        yearGroup: 'Y3',
        title: 'Auditory Perception & How Humans Hear',
        strand: 'Sound & Senses',
        prerequisites: [],
        recommendedTemplateIds: ['sci-w8'],
        bloomTarget: 'remember',
      },
      {
        code: 'Y4.SCI.SND.VIBRATIONS',
        subject: 'science',
        yearGroup: 'Y4',
        title: 'Sound as Physical Mechanical Vibrations',
        strand: 'Physics: Sound',
        prerequisites: ['Y3.SCI.SND.EARS'],
        recommendedTemplateIds: ['sci-w8'],
        bloomTarget: 'understand',
      },
      {
        code: 'Y4.SCI.SND.MEDIUM',
        subject: 'science',
        yearGroup: 'Y4',
        title: 'Transmission of Sound Through Solids, Liquids, and Gases',
        strand: 'Physics: Sound',
        prerequisites: ['Y4.SCI.SND.VIBRATIONS'],
        coRequisites: ['Y4.SCI.SND.PITCH'],
        recommendedTemplateIds: ['sci-w8'],
        bloomTarget: 'apply',
      },
      {
        code: 'Y4.SCI.SND.PITCH',
        subject: 'science',
        yearGroup: 'Y4',
        title: 'Pitch Variation vs. Frequency of Vibration',
        strand: 'Physics: Sound',
        prerequisites: ['Y4.SCI.SND.VIBRATIONS'],
        recommendedTemplateIds: ['sci-w8'],
        bloomTarget: 'analyze',
      },

      // ==========================================
      // SCIENCE: STATES OF MATTER
      // ==========================================
      {
        code: 'Y3.SCI.MAT.STATES',
        subject: 'science',
        yearGroup: 'Y3',
        title: 'Basic Distinction Between Solids, Liquids, and Gases',
        strand: 'Chemistry: Materials',
        prerequisites: [],
        recommendedTemplateIds: ['sci-states'],
        bloomTarget: 'remember',
      },
      {
        code: 'Y4.SCI.MAT.PARTICLES',
        subject: 'science',
        yearGroup: 'Y4',
        title: 'Particle Arrangement and Thermal State Changes',
        strand: 'Chemistry: States of Matter',
        prerequisites: ['Y3.SCI.MAT.STATES'],
        recommendedTemplateIds: ['sci-states'],
        bloomTarget: 'understand',
      },

      // ==========================================
      // SCIENCE: ELECTRICITY
      // ==========================================
      {
        code: 'Y3.SCI.ELEC.SAFETY',
        subject: 'science',
        yearGroup: 'Y3',
        title: 'Electrical Safety & Mains vs. Battery Appliances',
        strand: 'Physics: Electricity',
        prerequisites: [],
        recommendedTemplateIds: ['sci-elec'],
        bloomTarget: 'remember',
      },
      {
        code: 'Y4.SCI.ELEC.CIRCUITS',
        subject: 'science',
        yearGroup: 'Y4',
        title: 'Complete Series Circuits, Cells, and Switch Controls',
        strand: 'Physics: Electricity',
        prerequisites: ['Y3.SCI.ELEC.SAFETY'],
        recommendedTemplateIds: ['sci-elec'],
        bloomTarget: 'apply',
      },

      // ==========================================
      // MATHS: PLACE VALUE & DECIMALS
      // ==========================================
      {
        code: 'Y3.MATH.NPV.PARTITIONING',
        subject: 'maths',
        yearGroup: 'Y3',
        title: '3-Digit Number Partitioning (Hundreds, Tens, Ones)',
        strand: 'Number & Place Value',
        prerequisites: [],
        recommendedTemplateIds: ['math-w8'],
        bloomTarget: 'understand',
      },
      {
        code: 'Y4.MATH.NPV.DECIMALS',
        subject: 'maths',
        yearGroup: 'Y4',
        title: 'Decimal Tenths and Hundredths Place Value Extension',
        strand: 'Fractions & Decimals',
        prerequisites: ['Y3.MATH.NPV.PARTITIONING'],
        recommendedTemplateIds: ['math-w8'],
        bloomTarget: 'apply',
      },
      {
        code: 'Y4.MATH.NPV.EMPTY_COLUMNS',
        subject: 'maths',
        yearGroup: 'Y4',
        title: 'Zero Placeholder Alignment in Decimal Operations',
        strand: 'Addition & Subtraction',
        prerequisites: ['Y4.MATH.NPV.DECIMALS'],
        recommendedTemplateIds: ['math-w8'],
        bloomTarget: 'analyze',
      },

      // ==========================================
      // MATHS: FRACTIONS
      // ==========================================
      {
        code: 'Y3.MATH.FRAC.UNIT',
        subject: 'maths',
        yearGroup: 'Y3',
        title: 'Unit Fractions and Part-Whole Representation',
        strand: 'Fractions',
        prerequisites: [],
        recommendedTemplateIds: ['math-w8'],
        bloomTarget: 'remember',
      },
      {
        code: 'Y4.MATH.FRAC.LIKE_DENOM',
        subject: 'maths',
        yearGroup: 'Y4',
        title: 'Addition & Subtraction of Fractions with Like Denominators',
        strand: 'Fractions',
        prerequisites: ['Y3.MATH.FRAC.UNIT'],
        recommendedTemplateIds: ['math-w8'],
        bloomTarget: 'understand',
      },
      {
        code: 'Y4.MATH.FRAC.UNLIKE_DENOM',
        subject: 'maths',
        yearGroup: 'Y4',
        title: 'Equivalent Fractions & Operating with Different Denominators',
        strand: 'Fractions',
        prerequisites: ['Y4.MATH.FRAC.LIKE_DENOM'],
        recommendedTemplateIds: ['math-w8'],
        bloomTarget: 'apply',
      },

      // ==========================================
      // ENGLISH: GRAMMAR, PUNCTUATION & SPELLING
      // ==========================================
      {
        code: 'Y3.ENG.GRM.ROOTS',
        subject: 'english',
        yearGroup: 'Y3',
        title: 'Base Root Words and Basic Compound Nouns',
        strand: 'Vocabulary & Morphology',
        prerequisites: [],
        recommendedTemplateIds: ['eng-w7'],
        bloomTarget: 'remember',
      },
      {
        code: 'Y4.ENG.GRM.PREFIXES',
        subject: 'english',
        yearGroup: 'Y4',
        title: 'Negative and Directional Prefixes (un-, dis-, in-, re-)',
        strand: 'Grammar & Morphology',
        prerequisites: ['Y3.ENG.GRM.ROOTS'],
        recommendedTemplateIds: ['eng-w7'],
        bloomTarget: 'understand',
      },
      {
        code: 'Y4.ENG.GRM.SUFFIXES',
        subject: 'english',
        yearGroup: 'Y4',
        title: 'Suffixes Transforming Word Class (-ation, -ous, -ly)',
        strand: 'Grammar & Morphology',
        prerequisites: ['Y4.ENG.GRM.PREFIXES'],
        recommendedTemplateIds: ['eng-w7'],
        bloomTarget: 'apply',
      },
    ];

    for (const node of nodes) {
      this.registerNode(node);
    }
  }
}
