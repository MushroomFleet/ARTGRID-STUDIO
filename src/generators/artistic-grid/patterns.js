// Pattern drawing functions for the artistic grid generator
// Converted from the Python SVG_ArtGrid.py script

import { createSVGElement, createMask } from '../../utils/svgUtils.js';
import { randomChoice } from '../../utils/colorPalettes.js';

/**
 * Draw a circle block
 * @param {SVGElement} svg - SVG element to draw on
 * @param {number} x - X position
 * @param {number} y - Y position  
 * @param {number} squareSize - Size of the square
 * @param {string} foreground - Foreground color
 * @param {string} background - Background color
 */
export const drawCircle = (svg, x, y, squareSize, foreground, background) => {
  // Create group
  const group = createSVGElement('g', { class: 'draw-circle' });
  
  // Draw background
  const bgRect = createSVGElement('rect', {
    x, y,
    width: squareSize,
    height: squareSize,
    fill: background
  });
  group.appendChild(bgRect);
  
  // Draw foreground circle
  const circle = createSVGElement('circle', {
    cx: x + squareSize / 2,
    cy: y + squareSize / 2,
    r: squareSize / 2,
    fill: foreground
  });
  group.appendChild(circle);
  
  // Add variation: sometimes add an inner circle
  if (Math.random() < 0.3) {
    const innerCircle = createSVGElement('circle', {
      cx: x + squareSize / 2,
      cy: y + squareSize / 2,
      r: squareSize / 4,
      fill: background
    });
    group.appendChild(innerCircle);
  }
  
  svg.appendChild(group);
};

/**
 * Draw opposite circles block
 * @param {SVGElement} svg - SVG element to draw on
 * @param {number} x - X position
 * @param {number} y - Y position  
 * @param {number} squareSize - Size of the square
 * @param {string} foreground - Foreground color
 * @param {string} background - Background color
 */
export const drawOppositeCircles = (svg, x, y, squareSize, foreground, background) => {
  const group = createSVGElement('g', { class: 'opposite-circles' });
  const circleGroup = createSVGElement('g');
  
  // Draw background
  const bgRect = createSVGElement('rect', {
    x, y,
    width: squareSize,
    height: squareSize,
    fill: background
  });
  group.appendChild(bgRect);
  
  // Create mask
  const maskId = `mask-${x}-${y}`;
  createMask(svg, maskId, x, y, squareSize, squareSize);
  
  // Choose one of these options for circle positions
  const options = [
    // top left + bottom right
    [0, 0, squareSize, squareSize],
    // top right + bottom left
    [squareSize, 0, 0, squareSize]
  ];
  const offset = randomChoice(options);
  
  // Draw circles
  const circle1 = createSVGElement('circle', {
    cx: x + offset[0],
    cy: y + offset[1],
    r: squareSize / 2,
    fill: foreground
  });
  
  const circle2 = createSVGElement('circle', {
    cx: x + offset[2],
    cy: y + offset[3],
    r: squareSize / 2,
    fill: foreground
  });
  
  circleGroup.appendChild(circle1);
  circleGroup.appendChild(circle2);
  
  // Apply mask to circle group
  circleGroup.setAttribute('mask', `url(#${maskId})`);
  
  group.appendChild(circleGroup);
  svg.appendChild(group);
};

/**
 * Draw a cross or X block
 * @param {SVGElement} svg - SVG element to draw on
 * @param {number} x - X position
 * @param {number} y - Y position  
 * @param {number} squareSize - Size of the square
 * @param {string} foreground - Foreground color
 * @param {string} background - Background color
 */
export const drawCross = (svg, x, y, squareSize, foreground, background) => {
  const group = createSVGElement('g', { class: 'draw-cross' });
  
  // Draw background
  const bgRect = createSVGElement('rect', {
    x, y,
    width: squareSize,
    height: squareSize,
    fill: background
  });
  group.appendChild(bgRect);
  
  // Determine if it's a + or ×
  const isPlus = Math.random() < 0.5;
  
  if (isPlus) {
    // Horizontal line
    const hLine = createSVGElement('rect', {
      x,
      y: y + squareSize / 3,
      width: squareSize,
      height: squareSize / 3,
      fill: foreground
    });
    group.appendChild(hLine);
    
    // Vertical line
    const vLine = createSVGElement('rect', {
      x: x + squareSize / 3,
      y,
      width: squareSize / 3,
      height: squareSize,
      fill: foreground
    });
    group.appendChild(vLine);
  } else {
    // For the X, we use a polygon with two triangles
    // First diagonal line (top-left to bottom-right)
    const width = squareSize / 6; // Width of the line
    
    // Calculate points for diagonal line
    const x1 = x, y1 = y;
    const x2 = x + squareSize, y2 = y + squareSize;
    
    // Calculate points for the polygon (a thick line)
    const dx = x2 - x1;
    const dy = y2 - y1;
    const length = Math.sqrt(dx * dx + dy * dy);
    
    // Normalize and rotate to get perpendicular vector
    const nx = -dy / length;
    const ny = dx / length;
    
    // Calculate corners of the polygon
    const p1 = [x1 + nx * width / 2, y1 + ny * width / 2];
    const p2 = [x2 + nx * width / 2, y2 + ny * width / 2];
    const p3 = [x2 - nx * width / 2, y2 - ny * width / 2];
    const p4 = [x1 - nx * width / 2, y1 - ny * width / 2];
    
    const line1 = createSVGElement('polygon', {
      points: `${p1[0]},${p1[1]} ${p2[0]},${p2[1]} ${p3[0]},${p3[1]} ${p4[0]},${p4[1]}`,
      fill: foreground
    });
    group.appendChild(line1);
    
    // Second diagonal line (top-right to bottom-left)
    const x3 = x + squareSize, y3 = y;
    const x4 = x, y4 = y + squareSize;
    
    // Calculate points for the polygon (a thick line)
    const dx2 = x4 - x3;
    const dy2 = y4 - y3;
    const length2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
    
    // Normalize and rotate to get perpendicular vector
    const nx2 = -dy2 / length2;
    const ny2 = dx2 / length2;
    
    // Calculate corners of the polygon
    const p5 = [x3 + nx2 * width / 2, y3 + ny2 * width / 2];
    const p6 = [x4 + nx2 * width / 2, y4 + ny2 * width / 2];
    const p7 = [x4 - nx2 * width / 2, y4 - ny2 * width / 2];
    const p8 = [x3 - nx2 * width / 2, y3 - ny2 * width / 2];
    
    const line2 = createSVGElement('polygon', {
      points: `${p5[0]},${p5[1]} ${p6[0]},${p6[1]} ${p7[0]},${p7[1]} ${p8[0]},${p8[1]}`,
      fill: foreground
    });
    group.appendChild(line2);
  }
  
  svg.appendChild(group);
};

/**
 * Draw a half square block
 * @param {SVGElement} svg - SVG element to draw on
 * @param {number} x - X position
 * @param {number} y - Y position  
 * @param {number} squareSize - Size of the square
 * @param {string} foreground - Foreground color
 * @param {string} background - Background color
 */
export const drawHalfSquare = (svg, x, y, squareSize, foreground, background) => {
  const group = createSVGElement('g', { class: 'draw-half-square' });
  
  // Draw background
  const bgRect = createSVGElement('rect', {
    x, y,
    width: squareSize,
    height: squareSize,
    fill: background
  });
  group.appendChild(bgRect);
  
  // Determine which half to fill
  const direction = randomChoice(['top', 'right', 'bottom', 'left']);
  
  let points;
  if (direction === 'top') {
    points = `${x},${y} ${x + squareSize},${y} ${x + squareSize},${y + squareSize / 2} ${x},${y + squareSize / 2}`;
  } else if (direction === 'right') {
    points = `${x + squareSize / 2},${y} ${x + squareSize},${y} ${x + squareSize},${y + squareSize} ${x + squareSize / 2},${y + squareSize}`;
  } else if (direction === 'bottom') {
    points = `${x},${y + squareSize / 2} ${x + squareSize},${y + squareSize / 2} ${x + squareSize},${y + squareSize} ${x},${y + squareSize}`;
  } else { // left
    points = `${x},${y} ${x + squareSize / 2},${y} ${x + squareSize / 2},${y + squareSize} ${x},${y + squareSize}`;
  }
  
  const polygon = createSVGElement('polygon', {
    points,
    fill: foreground
  });
  group.appendChild(polygon);
  
  svg.appendChild(group);
};

/**
 * Draw a diagonal square block
 * @param {SVGElement} svg - SVG element to draw on
 * @param {number} x - X position
 * @param {number} y - Y position  
 * @param {number} squareSize - Size of the square
 * @param {string} foreground - Foreground color
 * @param {string} background - Background color
 */
export const drawDiagonalSquare = (svg, x, y, squareSize, foreground, background) => {
  const group = createSVGElement('g', { class: 'draw-diagonal-square' });
  
  // Draw background
  const bgRect = createSVGElement('rect', {
    x, y,
    width: squareSize,
    height: squareSize,
    fill: background
  });
  group.appendChild(bgRect);
  
  // Determine which diagonal to fill
  const isTopLeftToBottomRight = Math.random() < 0.5;
  
  let points;
  if (isTopLeftToBottomRight) {
    points = `${x},${y} ${x + squareSize},${y + squareSize} ${x},${y + squareSize}`;
  } else {
    points = `${x + squareSize},${y} ${x + squareSize},${y + squareSize} ${x},${y}`;
  }
  
  const polygon = createSVGElement('polygon', {
    points,
    fill: foreground
  });
  group.appendChild(polygon);
  
  svg.appendChild(group);
};

/**
 * Draw a quarter circle block
 * @param {SVGElement} svg - SVG element to draw on
 * @param {number} x - X position
 * @param {number} y - Y position  
 * @param {number} squareSize - Size of the square
 * @param {string} foreground - Foreground color
 * @param {string} background - Background color
 */
export const drawQuarterCircle = (svg, x, y, squareSize, foreground, background) => {
  const group = createSVGElement('g', { class: 'draw-quarter-circle' });
  
  // Draw background
  const bgRect = createSVGElement('rect', {
    x, y,
    width: squareSize,
    height: squareSize,
    fill: background
  });
  group.appendChild(bgRect);
  
  // Determine which corner to place the quarter circle
  const corner = randomChoice(['top-left', 'top-right', 'bottom-right', 'bottom-left']);
  
  // Create a path for the quarter circle
  const path = createSVGElement('path', { fill: foreground });
  
  let pathData;
  if (corner === 'top-left') {
    pathData = `M ${x} ${y} A ${squareSize} ${squareSize} 0 0 1 ${x + squareSize} ${y} L ${x} ${y}`;
  } else if (corner === 'top-right') {
    pathData = `M ${x + squareSize} ${y} A ${squareSize} ${squareSize} 0 0 1 ${x + squareSize} ${y + squareSize} L ${x + squareSize} ${y}`;
  } else if (corner === 'bottom-right') {
    pathData = `M ${x + squareSize} ${y + squareSize} A ${squareSize} ${squareSize} 0 0 1 ${x} ${y + squareSize} L ${x + squareSize} ${y + squareSize}`;
  } else { // bottom-left
    pathData = `M ${x} ${y + squareSize} A ${squareSize} ${squareSize} 0 0 1 ${x} ${y} L ${x} ${y + squareSize}`;
  }
  
  path.setAttribute('d', pathData);
  group.appendChild(path);
  
  svg.appendChild(group);
};

/**
 * Draw a dots block
 * @param {SVGElement} svg - SVG element to draw on
 * @param {number} x - X position
 * @param {number} y - Y position  
 * @param {number} squareSize - Size of the square
 * @param {string} foreground - Foreground color
 * @param {string} background - Background color
 */
export const drawDots = (svg, x, y, squareSize, foreground, background) => {
  const group = createSVGElement('g', { class: 'draw-dots' });
  
  // Draw background
  const bgRect = createSVGElement('rect', {
    x, y,
    width: squareSize,
    height: squareSize,
    fill: background
  });
  group.appendChild(bgRect);
  
  // Determine number of dots (4, 9, or 16)
  const numDots = randomChoice([4, 9, 16]);
  
  let rows, cols;
  if (numDots === 4) {
    rows = cols = 2;
  } else if (numDots === 9) {
    rows = cols = 3;
  } else { // 16
    rows = cols = 4;
  }
  
  const cellSize = squareSize / rows;
  const dotRadius = cellSize * 0.3;
  
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const centerX = x + (i + 0.5) * cellSize;
      const centerY = y + (j + 0.5) * cellSize;
      
      const dot = createSVGElement('circle', {
        cx: centerX,
        cy: centerY,
        r: dotRadius,
        fill: foreground
      });
      group.appendChild(dot);
    }
  }
  
  svg.appendChild(group);
};

/**
 * Draw a letter block
 * @param {SVGElement} svg - SVG element to draw on
 * @param {number} x - X position
 * @param {number} y - Y position  
 * @param {number} squareSize - Size of the square
 * @param {string} foreground - Foreground color
 * @param {string} background - Background color
 */
export const drawLetterBlock = (svg, x, y, squareSize, foreground, background) => {
  const group = createSVGElement('g', { class: 'draw-letter-block' });
  
  // Draw background
  const bgRect = createSVGElement('rect', {
    x, y,
    width: squareSize,
    height: squareSize,
    fill: background
  });
  group.appendChild(bgRect);
  
  // Select a random character
  // Using a limited set that would look good in a monospace font
  const characters = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 
    'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
    '+', '-', '*', '/', '=', '#', '@', '&', '%', '$'
  ];
  
  const character = randomChoice(characters);
  
  // Add text element
  const text = createSVGElement('text', {
    x: x + squareSize / 2,
    y: y + squareSize / 2 + squareSize * 0.3,
    'font-family': 'monospace',
    'font-size': squareSize * 0.8,
    'font-weight': 'bold',
    fill: foreground,
    'text-anchor': 'middle'
  });
  text.textContent = character;
  group.appendChild(text);
  
  svg.appendChild(group);
};

// Export all pattern functions
export const patternFunctions = {
  circle: drawCircle,
  opposite_circles: drawOppositeCircles,
  cross: drawCross,
  half_square: drawHalfSquare,
  diagonal_square: drawDiagonalSquare,
  quarter_circle: drawQuarterCircle,
  dots: drawDots,
  letter_block: drawLetterBlock
};

// Export pattern names for UI
export const patternNames = Object.keys(patternFunctions);

// Export display names for UI
export const patternDisplayNames = {
  circle: 'Circle',
  opposite_circles: 'Opposite Circles',
  cross: 'Cross/X',
  half_square: 'Half Square',
  diagonal_square: 'Diagonal Square',
  quarter_circle: 'Quarter Circle',
  dots: 'Dots',
  letter_block: 'Letter Block'
};
