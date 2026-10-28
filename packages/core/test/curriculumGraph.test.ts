import { describe, it, expect, beforeEach } from 'vitest';
import { CurriculumDependencyGraph } from '../src/curriculum/CurriculumDependencyGraph.js';

describe('Wave 19: CurriculumDependencyGraph (DAG)', () => {
  let graph: CurriculumDependencyGraph;

  beforeEach(() => {
    graph = new CurriculumDependencyGraph();
  });

  it('initializes standard KS2 British curriculum nodes across subjects', () => {
    const nodes = graph.getAllNodes();
    expect(nodes.length).toBeGreaterThanOrEqual(14);

    const sound = graph.getNode('Y4.SCI.SND.VIBRATIONS');
    expect(sound).toBeDefined();
    expect(sound?.subject).toBe('science');
    expect(sound?.yearGroup).toBe('Y4');
    expect(sound?.prerequisites).toContain('Y3.SCI.SND.EARS');
  });

  it('correctly traces full dependency lineage in topological order', () => {
    const path = graph.traceDependencyPath('Y4.MATH.NPV.EMPTY_COLUMNS');
    const codes = path.map((n) => n.code);

    expect(codes).toEqual([
      'Y3.MATH.NPV.PARTITIONING',
      'Y4.MATH.NPV.DECIMALS',
      'Y4.MATH.NPV.EMPTY_COLUMNS',
    ]);
  });

  it('discovers earliest unmastered prerequisite as root blocker', () => {
    // Case 1: Student failed Y4.MATH.NPV.EMPTY_COLUMNS, and has zero prior mastery
    const chain1 = graph.traceRootBlocker('Y4.MATH.NPV.EMPTY_COLUMNS', new Set());
    expect(chain1.rootBlockerCode).toBe('Y3.MATH.NPV.PARTITIONING');

    // Case 2: Student mastered Y3 partitioning, but hasn't mastered Y4 decimals
    const chain2 = graph.traceRootBlocker(
      'Y4.MATH.NPV.EMPTY_COLUMNS',
      new Set(['Y3.MATH.NPV.PARTITIONING'])
    );
    expect(chain2.rootBlockerCode).toBe('Y4.MATH.NPV.DECIMALS');

    // Case 3: Student mastered Y3 partitioning and Y4 decimals, so the target itself is the blocker
    const chain3 = graph.traceRootBlocker(
      'Y4.MATH.NPV.EMPTY_COLUMNS',
      new Set(['Y3.MATH.NPV.PARTITIONING', 'Y4.MATH.NPV.DECIMALS'])
    );
    expect(chain3.rootBlockerCode).toBe('Y4.MATH.NPV.EMPTY_COLUMNS');
  });

  it('generates student-tailored worksheet recommendations cascading to Tab 5', () => {
    // Lara: Active gap in Sound Transmission Medium
    const laraRec = graph.getStudentRecommendation(
      'lara',
      'Lara',
      'Y4',
      ['Y4.SCI.SND.MEDIUM'],
      new Set(['Y3.SCI.SND.EARS'])
    );
    expect(laraRec.recommendedTemplateId).toBe('sci-w8');
    expect(laraRec.recommendedTemplateTitle).toContain('Sound, Pitch & Auditory Vibrations');
    expect(laraRec.primaryRootBlocker.code).toBe('Y4.SCI.SND.VIBRATIONS');

    // Maya: Active gap in Unlike Fractions
    const mayaRec = graph.getStudentRecommendation(
      'maya',
      'Maya',
      'Y4',
      ['Y4.MATH.FRAC.UNLIKE_DENOM'],
      new Set(['Y3.MATH.FRAC.UNIT'])
    );
    expect(mayaRec.recommendedTemplateId).toBe('math-w8');
    expect(mayaRec.recommendedTemplateTitle).toContain('Decimals & Place Value Alignment');
    expect(mayaRec.primaryRootBlocker.code).toBe('Y4.MATH.FRAC.LIKE_DENOM');
  });
});
