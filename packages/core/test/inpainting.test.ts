import { describe, it, expect } from 'vitest';
import { SocraticInpaintingEngine } from '../src/vision/SocraticInpaintingEngine.js';

describe('Wave 24: Socratic Multi-Modal Inpainting Engine', () => {
  const engine = SocraticInpaintingEngine.getInstance();

  it('generates science medium inpainting overlays for Lara with particle proximity SVG', () => {
    const result = engine.generateInpaintingOverlays('pkt-sci-w8-lara', 1);

    expect(result.studentId).toBe('lara');
    expect(result.detectedErrorsCount).toBeGreaterThanOrEqual(1);

    const overlay = result.overlays[0];
    expect(overlay.questionNumber).toBe('Q2');
    expect(overlay.conceptId).toBe('Y4.SCI.SND.MEDIUM');
    expect(overlay.errorTaxonomyId).toBe('ERR_DENSE_MEDIUM_INVERSION');
    expect(overlay.boundingBox.confidence).toBeGreaterThan(0.99);
    expect(overlay.svgScaffoldSnippet).toContain('GAS / AIR');
    expect(overlay.svgScaffoldSnippet).toContain('LIQUID / WATER');
    expect(overlay.socraticPromptText).toContain('dominos');
  });

  it('generates maths place-value inpainting overlays for Maya with column alignment ladder', () => {
    const result = engine.generateInpaintingOverlays('pkt-math-w8-maya', 2);

    expect(result.studentId).toBe('maya');
    expect(result.detectedErrorsCount).toBeGreaterThanOrEqual(1);

    const overlay = result.overlays[0];
    expect(overlay.questionNumber).toBe('Q4');
    expect(overlay.conceptId).toBe('Y4.MATH.NPV.5DIGIT_ORDERING');
    expect(overlay.errorTaxonomyId).toBe('ERR_SHARED_PREFIX_ORDERING');
    expect(overlay.svgScaffoldSnippet).toContain('PLACE-VALUE COLUMNS');
    expect(overlay.guidedBlankPrompt).toContain('42,053');
  });

  it('renders valid inpainting overlay HTML with interactive blank and SVG visual scaffold', () => {
    const result = engine.generateInpaintingOverlays('pkt-sci-w8-lara', 1);
    const html = engine.renderInpaintingOverlayHtml(result.overlays[0]);

    expect(html).toContain('inpainting-overlay-card');
    expect(html).toContain('Wave 24 Socratic Vector Inpainting');
    expect(html).toContain('ERR_DENSE_MEDIUM_INVERSION');
    expect(html).toContain('Guided Student Inpainting Blank');
    expect(html).toContain('<svg class="inpainting-scaffold-svg"');
  });

  it('produces valid SVG coordinates within normalized viewBox bounds', () => {
    const airSvg = engine.generateParticleProximitySvg();
    expect(airSvg).toContain('viewBox="0 0 500 120"');
    expect(airSvg).toContain('<circle');

    const mathSvg = engine.generatePlaceValueScaleSvg();
    expect(mathSvg).toContain('viewBox="0 0 500 120"');
    expect(mathSvg).toContain('<rect');
  });
});
