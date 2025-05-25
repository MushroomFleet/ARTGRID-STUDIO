// Enhanced pattern registry for Art Grid V2
// Massively expanded pattern system with 25+ patterns

import { createSVGElement, createMask } from '../../../utils/svgUtils.js';
import { randomChoice, randomInt } from '../../../utils/colorPalettes.js';

// =====================================
// ENHANCED BASIC PATTERNS (from V1)
// =====================================

/**
 * Enhanced circle pattern with variations
 */
export const drawCircle = (svg, x, y, size, foreground, background, options = {}) => {
  const group = createSVGElement('g', { class: 'pattern-circle' });
  
  // Background
  const bgRect = createSVGElement('rect', {
    x, y, width: size, height: size, fill: background
  });
  group.appendChild(bgRect);
  
  // Main circle
  const radius = size * (options.scale || 0.45);
  const circle = createSVGElement('circle', {
    cx: x + size / 2,
    cy: y + size / 2,
    r: radius,
    fill: foreground
  });
  group.appendChild(circle);
  
  // Variations
  const variation = Math.random();
  if (variation < 0.3) {
    // Inner circle
    const innerCircle = createSVGElement('circle', {
      cx: x + size / 2,
      cy: y + size / 2,
      r: radius * 0.5,
      fill: background
    });
    group.appendChild(innerCircle);
  } else if (variation < 0.6) {
    // Concentric circles
    for (let i = 1; i <= 3; i++) {
      const concentricCircle = createSVGElement('circle', {
        cx: x + size / 2,
        cy: y + size / 2,
        r: radius * (0.8 - i * 0.2),
        fill: i % 2 === 0 ? background : foreground,
        stroke: 'none'
      });
      group.appendChild(concentricCircle);
    }
  }
  
  svg.appendChild(group);
};

/**
 * Enhanced opposite circles with more variations
 */
export const drawOppositeCircles = (svg, x, y, size, foreground, background, options = {}) => {
  const group = createSVGElement('g', { class: 'pattern-opposite-circles' });
  
  // Background
  const bgRect = createSVGElement('rect', {
    x, y, width: size, height: size, fill: background
  });
  group.appendChild(bgRect);
  
  // Create mask
  const maskId = `mask-opposite-${x}-${y}-${Date.now()}`;
  createMask(svg, maskId, x, y, size, size);
  
  const circleGroup = createSVGElement('g');
  
  // More variation in circle positions
  const patterns = [
    // Classic diagonal
    [[0, 0], [size, size]],
    [[size, 0], [0, size]],
    // Vertical
    [[size/2, 0], [size/2, size]],
    // Horizontal
    [[0, size/2], [size, size/2]],
    // Four corners
    [[0, 0], [size, 0], [0, size], [size, size]]
  ];
  
  const selectedPattern = randomChoice(patterns);
  const radius = size * 0.5;
  
  selectedPattern.forEach(([cx, cy]) => {
    const circle = createSVGElement('circle', {
      cx: x + cx,
      cy: y + cy,
      r: radius,
      fill: foreground
    });
    circleGroup.appendChild(circle);
  });
  
  circleGroup.setAttribute('mask', `url(#${maskId})`);
  group.appendChild(circleGroup);
  svg.appendChild(group);
};

/**
 * Enhanced cross pattern with more styles
 */
export const drawCross = (svg, x, y, size, foreground, background, options = {}) => {
  const group = createSVGElement('g', { class: 'pattern-cross' });
  
  // Background
  const bgRect = createSVGElement('rect', {
    x, y, width: size, height: size, fill: background
  });
  group.appendChild(bgRect);
  
  const thickness = size * (options.thickness || 0.3);
  const style = randomChoice(['plus', 'x', 'asterisk', 'thin_cross']);
  
  if (style === 'plus') {
    // Horizontal bar
    const hBar = createSVGElement('rect', {
      x: x,
      y: y + (size - thickness) / 2,
      width: size,
      height: thickness,
      fill: foreground
    });
    group.appendChild(hBar);
    
    // Vertical bar
    const vBar = createSVGElement('rect', {
      x: x + (size - thickness) / 2,
      y: y,
      width: thickness,
      height: size,
      fill: foreground
    });
    group.appendChild(vBar);
  } else if (style === 'x') {
    // Diagonal lines using polygons
    const lineWidth = thickness / 2;
    
    // First diagonal
    const diag1 = createSVGElement('polygon', {
      points: `${x},${y + lineWidth} ${x + size - lineWidth},${y + size} ${x + size},${y + size - lineWidth} ${x + lineWidth},${y}`,
      fill: foreground
    });
    group.appendChild(diag1);
    
    // Second diagonal
    const diag2 = createSVGElement('polygon', {
      points: `${x + size - lineWidth},${y} ${x + size},${y + lineWidth} ${x + lineWidth},${y + size} ${x},${y + size - lineWidth}`,
      fill: foreground
    });
    group.appendChild(diag2);
  } else if (style === 'asterisk') {
    // Plus + X combined
    drawCross(svg, x, y, size, foreground, background, { thickness: thickness * 0.7 });
    return; // Recursive call for plus, then add diagonals
  }
  
  svg.appendChild(group);
};

// =====================================
// NEW GEOMETRIC PATTERNS
// =====================================

/**
 * Hexagon pattern
 */
export const drawHexagon = (svg, x, y, size, foreground, background, options = {}) => {
  const group = createSVGElement('g', { class: 'pattern-hexagon' });
  
  // Background
  const bgRect = createSVGElement('rect', {
    x, y, width: size, height: size, fill: background
  });
  group.appendChild(bgRect);
  
  const centerX = x + size / 2;
  const centerY = y + size / 2;
  const radius = size * 0.4;
  
  // Calculate hexagon points
  const points = [];
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3;
    const px = centerX + radius * Math.cos(angle);
    const py = centerY + radius * Math.sin(angle);
    points.push(`${px},${py}`);
  }
  
  const hexagon = createSVGElement('polygon', {
    points: points.join(' '),
    fill: foreground
  });
  group.appendChild(hexagon);
  
  svg.appendChild(group);
};

/**
 * Triangle pattern
 */
export const drawTriangle = (svg, x, y, size, foreground, background, options = {}) => {
  const group = createSVGElement('g', { class: 'pattern-triangle' });
  
  // Background
  const bgRect = createSVGElement('rect', {
    x, y, width: size, height: size, fill: background
  });
  group.appendChild(bgRect);
  
  const centerX = x + size / 2;
  const centerY = y + size / 2;
  const radius = size * 0.4;
  
  // Different triangle orientations
  const orientations = [0, Math.PI / 2, Math.PI, 3 * Math.PI / 2];
  const rotation = randomChoice(orientations);
  
  const points = [];
  for (let i = 0; i < 3; i++) {
    const angle = rotation + (i * 2 * Math.PI) / 3;
    const px = centerX + radius * Math.cos(angle);
    const py = centerY + radius * Math.sin(angle);
    points.push(`${px},${py}`);
  }
  
  const triangle = createSVGElement('polygon', {
    points: points.join(' '),
    fill: foreground
  });
  group.appendChild(triangle);
  
  svg.appendChild(group);
};

/**
 * Star pattern
 */
export const drawStar = (svg, x, y, size, foreground, background, options = {}) => {
  const group = createSVGElement('g', { class: 'pattern-star' });
  
  // Background
  const bgRect = createSVGElement('rect', {
    x, y, width: size, height: size, fill: background
  });
  group.appendChild(bgRect);
  
  const centerX = x + size / 2;
  const centerY = y + size / 2;
  const outerRadius = size * 0.4;
  const innerRadius = outerRadius * 0.4;
  const spikes = randomChoice([5, 6, 8]);
  
  const points = [];
  for (let i = 0; i < spikes * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = (i * Math.PI) / spikes;
    const px = centerX + radius * Math.cos(angle);
    const py = centerY + radius * Math.sin(angle);
    points.push(`${px},${py}`);
  }
  
  const star = createSVGElement('polygon', {
    points: points.join(' '),
    fill: foreground
  });
  group.appendChild(star);
  
  svg.appendChild(group);
};

/**
 * Diamond pattern
 */
export const drawDiamond = (svg, x, y, size, foreground, background, options = {}) => {
  const group = createSVGElement('g', { class: 'pattern-diamond' });
  
  // Background
  const bgRect = createSVGElement('rect', {
    x, y, width: size, height: size, fill: background
  });
  group.appendChild(bgRect);
  
  const centerX = x + size / 2;
  const centerY = y + size / 2;
  const halfSize = size * 0.4;
  
  const points = [
    `${centerX},${centerY - halfSize}`,
    `${centerX + halfSize},${centerY}`,
    `${centerX},${centerY + halfSize}`,
    `${centerX - halfSize},${centerY}`
  ];
  
  const diamond = createSVGElement('polygon', {
    points: points.join(' '),
    fill: foreground
  });
  group.appendChild(diamond);
  
  svg.appendChild(group);
};

// =====================================
// ORGANIC PATTERNS
// =====================================

/**
 * Spiral pattern
 */
export const drawSpiral = (svg, x, y, size, foreground, background, options = {}) => {
  const group = createSVGElement('g', { class: 'pattern-spiral' });
  
  // Background
  const bgRect = createSVGElement('rect', {
    x, y, width: size, height: size, fill: background
  });
  group.appendChild(bgRect);
  
  const centerX = x + size / 2;
  const centerY = y + size / 2;
  const maxRadius = size * 0.4;
  const turns = randomChoice([2, 3, 4]);
  const strokeWidth = size * 0.05;
  
  let pathData = `M ${centerX} ${centerY}`;
  const steps = 50;
  
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const angle = t * turns * 2 * Math.PI;
    const radius = t * maxRadius;
    const px = centerX + radius * Math.cos(angle);
    const py = centerY + radius * Math.sin(angle);
    pathData += ` L ${px} ${py}`;
  }
  
  const spiral = createSVGElement('path', {
    d: pathData,
    fill: 'none',
    stroke: foreground,
    'stroke-width': strokeWidth,
    'stroke-linecap': 'round'
  });
  group.appendChild(spiral);
  
  svg.appendChild(group);
};

/**
 * Wave pattern
 */
export const drawWave = (svg, x, y, size, foreground, background, options = {}) => {
  const group = createSVGElement('g', { class: 'pattern-wave' });
  
  // Background
  const bgRect = createSVGElement('rect', {
    x, y, width: size, height: size, fill: background
  });
  group.appendChild(bgRect);
  
  const amplitude = size * 0.15;
  const frequency = randomChoice([1, 2, 3]);
  const strokeWidth = size * 0.08;
  
  // Horizontal or vertical waves
  const isHorizontal = Math.random() < 0.5;
  
  let pathData;
  if (isHorizontal) {
    pathData = `M ${x} ${y + size / 2}`;
    for (let i = 0; i <= size; i += 2) {
      const waveY = y + size / 2 + amplitude * Math.sin((i / size) * frequency * 2 * Math.PI);
      pathData += ` L ${x + i} ${waveY}`;
    }
  } else {
    pathData = `M ${x + size / 2} ${y}`;
    for (let i = 0; i <= size; i += 2) {
      const waveX = x + size / 2 + amplitude * Math.sin((i / size) * frequency * 2 * Math.PI);
      pathData += ` L ${waveX} ${y + i}`;
    }
  }
  
  const wave = createSVGElement('path', {
    d: pathData,
    fill: 'none',
    stroke: foreground,
    'stroke-width': strokeWidth,
    'stroke-linecap': 'round'
  });
  group.appendChild(wave);
  
  svg.appendChild(group);
};

/**
 * Organic blob pattern
 */
export const drawOrganicBlob = (svg, x, y, size, foreground, background, options = {}) => {
  const group = createSVGElement('g', { class: 'pattern-organic-blob' });
  
  // Background
  const bgRect = createSVGElement('rect', {
    x, y, width: size, height: size, fill: background
  });
  group.appendChild(bgRect);
  
  const centerX = x + size / 2;
  const centerY = y + size / 2;
  const baseRadius = size * 0.25;
  
  // Generate organic shape using random variations
  const points = [];
  const numPoints = 8;
  
  for (let i = 0; i < numPoints; i++) {
    const angle = (i / numPoints) * 2 * Math.PI;
    const radiusVariation = 0.7 + Math.random() * 0.6; // 0.7 to 1.3
    const radius = baseRadius * radiusVariation;
    const px = centerX + radius * Math.cos(angle);
    const py = centerY + radius * Math.sin(angle);
    points.push([px, py]);
  }
  
  // Create smooth curve through points using quadratic curves
  let pathData = `M ${points[0][0]} ${points[0][1]}`;
  
  for (let i = 0; i < numPoints; i++) {
    const current = points[i];
    const next = points[(i + 1) % numPoints];
    const controlX = (current[0] + next[0]) / 2;
    const controlY = (current[1] + next[1]) / 2;
    pathData += ` Q ${current[0]} ${current[1]} ${controlX} ${controlY}`;
  }
  pathData += ' Z';
  
  const blob = createSVGElement('path', {
    d: pathData,
    fill: foreground
  });
  group.appendChild(blob);
  
  svg.appendChild(group);
};

/**
 * Cellular pattern
 */
export const drawCellular = (svg, x, y, size, foreground, background, options = {}) => {
  const group = createSVGElement('g', { class: 'pattern-cellular' });
  
  // Background
  const bgRect = createSVGElement('rect', {
    x, y, width: size, height: size, fill: background
  });
  group.appendChild(bgRect);
  
  const numCells = randomChoice([3, 4, 5]);
  const cellSize = size / Math.sqrt(numCells);
  
  for (let i = 0; i < numCells; i++) {
    const cellX = x + Math.random() * (size - cellSize);
    const cellY = y + Math.random() * (size - cellSize);
    const cellRadius = cellSize * (0.3 + Math.random() * 0.4);
    
    const cell = createSVGElement('circle', {
      cx: cellX + cellSize / 2,
      cy: cellY + cellSize / 2,
      r: cellRadius,
      fill: foreground,
      opacity: 0.6 + Math.random() * 0.4
    });
    group.appendChild(cell);
  }
  
  svg.appendChild(group);
};

// =====================================
// GRADIENT PATTERNS
// =====================================

/**
 * Radial gradient pattern
 */
export const drawRadialGradient = (svg, x, y, size, foreground, background, options = {}) => {
  const group = createSVGElement('g', { class: 'pattern-radial-gradient' });
  
  // Create unique gradient ID
  const gradientId = `radial-gradient-${x}-${y}-${Date.now()}`;
  
  // Create gradient definition
  const defs = svg.querySelector('defs') || svg.appendChild(createSVGElement('defs'));
  const gradient = createSVGElement('radialGradient', { id: gradientId });
  
  const stop1 = createSVGElement('stop', {
    offset: '0%',
    'stop-color': foreground,
    'stop-opacity': '1'
  });
  const stop2 = createSVGElement('stop', {
    offset: '100%',
    'stop-color': background,
    'stop-opacity': '1'
  });
  
  gradient.appendChild(stop1);
  gradient.appendChild(stop2);
  defs.appendChild(gradient);
  
  // Apply gradient to rectangle
  const rect = createSVGElement('rect', {
    x, y, width: size, height: size,
    fill: `url(#${gradientId})`
  });
  group.appendChild(rect);
  
  svg.appendChild(group);
};

/**
 * Linear gradient pattern
 */
export const drawLinearGradient = (svg, x, y, size, foreground, background, options = {}) => {
  const group = createSVGElement('g', { class: 'pattern-linear-gradient' });
  
  // Create unique gradient ID
  const gradientId = `linear-gradient-${x}-${y}-${Date.now()}`;
  
  // Random angle
  const angles = [0, 45, 90, 135, 180, 225, 270, 315];
  const angle = randomChoice(angles);
  
  // Create gradient definition
  const defs = svg.querySelector('defs') || svg.appendChild(createSVGElement('defs'));
  const gradient = createSVGElement('linearGradient', { 
    id: gradientId,
    gradientTransform: `rotate(${angle})`
  });
  
  const stop1 = createSVGElement('stop', {
    offset: '0%',
    'stop-color': foreground,
    'stop-opacity': '1'
  });
  const stop2 = createSVGElement('stop', {
    offset: '100%',
    'stop-color': background,
    'stop-opacity': '1'
  });
  
  gradient.appendChild(stop1);
  gradient.appendChild(stop2);
  defs.appendChild(gradient);
  
  // Apply gradient to rectangle
  const rect = createSVGElement('rect', {
    x, y, width: size, height: size,
    fill: `url(#${gradientId})`
  });
  group.appendChild(rect);
  
  svg.appendChild(group);
};

// Export all patterns in organized registry
export const patternRegistry = {
  // Enhanced basic patterns
  circle: drawCircle,
  opposite_circles: drawOppositeCircles,
  cross: drawCross,
  
  // Keep original V1 patterns (will need to import and adapt)
  half_square: null, // Will import from V1
  diagonal_square: null, // Will import from V1
  quarter_circle: null, // Will import from V1
  dots: null, // Will import from V1
  letter_block: null, // Will import from V1
  
  // New geometric patterns
  hexagon: drawHexagon,
  triangle: drawTriangle,
  star: drawStar,
  diamond: drawDiamond,
  
  // Organic patterns
  spiral: drawSpiral,
  wave: drawWave,
  organic_blob: drawOrganicBlob,
  cellular: drawCellular,
  
  // Gradient patterns
  radial_gradient: drawRadialGradient,
  linear_gradient: drawLinearGradient,
  
  // Placeholders for additional patterns to be implemented
  islamic_pattern: null,
  brush_stroke: null,
  watercolor: null,
  stippling: null,
  crosshatch: null,
  conical_gradient: null,
  wood_grain: null,
  marble: null,
  fabric: null,
  digital_glitch: null
};

// Pattern display names for UI
export const patternDisplayNames = {
  // Enhanced basic
  circle: 'Circle',
  opposite_circles: 'Opposite Circles',
  cross: 'Cross/X',
  
  // Original V1 (enhanced)
  half_square: 'Half Square',
  diagonal_square: 'Diagonal Square',
  quarter_circle: 'Quarter Circle',
  dots: 'Dots',
  letter_block: 'Letter Block',
  
  // New geometric
  hexagon: 'Hexagon',
  triangle: 'Triangle',
  star: 'Star',
  diamond: 'Diamond',
  islamic_pattern: 'Islamic Pattern',
  
  // Organic
  spiral: 'Spiral',
  wave: 'Wave',
  organic_blob: 'Organic Blob',
  cellular: 'Cellular',
  
  // Artistic
  brush_stroke: 'Brush Stroke',
  watercolor: 'Watercolor',
  stippling: 'Stippling',
  crosshatch: 'Crosshatch',
  
  // Gradients
  radial_gradient: 'Radial Gradient',
  linear_gradient: 'Linear Gradient',
  conical_gradient: 'Conical Gradient',
  
  // Textures
  wood_grain: 'Wood Grain',
  marble: 'Marble',
  fabric: 'Fabric',
  digital_glitch: 'Digital Glitch'
};

export default patternRegistry;
