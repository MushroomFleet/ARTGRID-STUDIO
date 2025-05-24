// SVG utility functions

/**
 * Create an SVG element with proper namespace
 * @param {string} tagName - SVG element tag name
 * @param {Object} attributes - Attributes to set on the element
 * @returns {SVGElement} Created SVG element
 */
export const createSVGElement = (tagName, attributes = {}) => {
  const element = document.createElementNS("http://www.w3.org/2000/svg", tagName);
  
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
  
  return element;
};

/**
 * Create an SVG with specified dimensions and viewBox
 * @param {number} width - SVG width
 * @param {number} height - SVG height
 * @returns {SVGElement} Created SVG element
 */
export const createSVG = (width, height) => {
  return createSVGElement('svg', {
    width: `${width}px`,
    height: `${height}px`,
    viewBox: `0 0 ${width} ${height}`,
    profile: 'full'
  });
};

/**
 * Add CSS styles to SVG
 * @param {SVGElement} svg - SVG element
 * @param {string} css - CSS string to add
 */
export const addSVGStyles = (svg, css) => {
  const defs = svg.querySelector('defs') || createSVGElement('defs');
  if (!svg.querySelector('defs')) {
    svg.appendChild(defs);
  }
  
  const style = createSVGElement('style');
  style.textContent = css;
  defs.appendChild(style);
};

/**
 * Create a radial gradient
 * @param {SVGElement} svg - SVG element
 * @param {string} id - Gradient ID
 * @param {string} color1 - Inner color
 * @param {string} color2 - Outer color
 * @returns {SVGElement} Created gradient element
 */
export const createRadialGradient = (svg, id, color1, color2) => {
  const defs = svg.querySelector('defs') || createSVGElement('defs');
  if (!svg.querySelector('defs')) {
    svg.appendChild(defs);
  }
  
  const gradient = createSVGElement('radialGradient', { id });
  
  const stop1 = createSVGElement('stop', {
    offset: '0',
    'stop-color': color1
  });
  
  const stop2 = createSVGElement('stop', {
    offset: '1',
    'stop-color': color2
  });
  
  gradient.appendChild(stop1);
  gradient.appendChild(stop2);
  defs.appendChild(gradient);
  
  return gradient;
};

/**
 * Create a mask for SVG elements
 * @param {SVGElement} svg - SVG element
 * @param {string} id - Mask ID
 * @param {number} x - X position
 * @param {number} y - Y position
 * @param {number} width - Width
 * @param {number} height - Height
 * @returns {SVGElement} Created mask element
 */
export const createMask = (svg, id, x, y, width, height) => {
  const defs = svg.querySelector('defs') || createSVGElement('defs');
  if (!svg.querySelector('defs')) {
    svg.appendChild(defs);
  }
  
  const mask = createSVGElement('mask', { id });
  const rect = createSVGElement('rect', {
    x, y, width, height,
    fill: 'white'
  });
  
  mask.appendChild(rect);
  defs.appendChild(mask);
  
  return mask;
};

/**
 * Create drop shadow filter
 * @param {SVGElement} svg - SVG element
 * @param {string} id - Filter ID
 * @param {Object} options - Shadow options
 * @returns {SVGElement} Created filter element
 */
export const createDropShadowFilter = (svg, id, options = {}) => {
  const {
    dx = 2,
    dy = 2,
    stdDeviation = 1,
    floodColor = '#000000',
    floodOpacity = 0.5
  } = options;
  
  const defs = svg.querySelector('defs') || createSVGElement('defs');
  if (!svg.querySelector('defs')) {
    svg.appendChild(defs);
  }
  
  const filter = createSVGElement('filter', {
    id,
    x: '-20%',
    y: '-20%',
    width: '140%',
    height: '140%'
  });
  
  const feOffset = createSVGElement('feOffset', {
    in: 'SourceAlpha',
    dx,
    dy,
    result: 'offsetBlur'
  });
  
  const feGaussianBlur = createSVGElement('feGaussianBlur', {
    in: 'offsetBlur',
    stdDeviation,
    result: 'blurResult'
  });
  
  const feFlood = createSVGElement('feFlood', {
    'flood-color': floodColor,
    'flood-opacity': floodOpacity,
    result: 'floodResult'
  });
  
  const feComposite = createSVGElement('feComposite', {
    in: 'floodResult',
    in2: 'blurResult',
    operator: 'in',
    result: 'shadowResult'
  });
  
  const feMerge = createSVGElement('feMerge');
  
  const feMergeNode1 = createSVGElement('feMergeNode', {
    in: 'shadowResult'
  });
  
  const feMergeNode2 = createSVGElement('feMergeNode', {
    in: 'SourceGraphic'
  });
  
  feMerge.appendChild(feMergeNode1);
  feMerge.appendChild(feMergeNode2);
  
  filter.appendChild(feOffset);
  filter.appendChild(feGaussianBlur);
  filter.appendChild(feFlood);
  filter.appendChild(feComposite);
  filter.appendChild(feMerge);
  
  defs.appendChild(filter);
  
  return filter;
};

/**
 * Create noise filter
 * @param {SVGElement} svg - SVG element
 * @param {string} id - Filter ID
 * @param {Object} options - Noise options
 * @returns {SVGElement} Created filter element
 */
export const createNoiseFilter = (svg, id, options = {}) => {
  const {
    baseFrequency = 0.02,
    numOctaves = 2,
    scale = 2.4,
    seed = Math.floor(Math.random() * 100)
  } = options;
  
  const defs = svg.querySelector('defs') || createSVGElement('defs');
  if (!svg.querySelector('defs')) {
    svg.appendChild(defs);
  }
  
  const filter = createSVGElement('filter', {
    id,
    x: '-30%',
    y: '-30%',
    width: '160%',
    height: '160%'
  });
  
  const turbulence = createSVGElement('feTurbulence', {
    type: 'turbulence',
    baseFrequency,
    numOctaves,
    seed,
    result: 'turbulence'
  });
  
  const displacementMap = createSVGElement('feDisplacementMap', {
    in: 'SourceGraphic',
    in2: 'turbulence',
    scale,
    xChannelSelector: 'R',
    yChannelSelector: 'G'
  });
  
  filter.appendChild(turbulence);
  filter.appendChild(displacementMap);
  
  defs.appendChild(filter);
  
  return filter;
};

/**
 * Clear SVG container and prepare for new content
 * @param {HTMLElement} container - Container element
 */
export const clearSVGContainer = (container) => {
  if (container) {
    container.innerHTML = '';
  }
};

/**
 * Get SVG data as string for export
 * @param {SVGElement} svg - SVG element to export
 * @returns {string} SVG data as string
 */
export const getSVGData = (svg) => {
  const serializer = new XMLSerializer();
  return serializer.serializeToString(svg);
};

/**
 * Download SVG as file
 * @param {SVGElement} svg - SVG element to download
 * @param {string} filename - Filename for download
 */
export const downloadSVG = async (svg, filename = 'artwork.svg') => {
  const svgData = getSVGData(svg);
  
  // Check if running in Electron
  if (window.isElectron && window.electronAPI) {
    try {
      const result = await window.electronAPI.saveSVG(svgData, filename);
      if (result.success && !result.canceled) {
        // Optionally show success message
        console.log('SVG saved successfully to:', result.filePath);
      } else if (result.error) {
        console.error('Error saving SVG:', result.error);
        await window.electronAPI.showError('Save Error', `Failed to save SVG: ${result.error}`);
      }
      return result;
    } catch (error) {
      console.error('Error saving SVG:', error);
      await window.electronAPI.showError('Save Error', `Failed to save SVG: ${error.message}`);
      return { success: false, error: error.message };
    }
  } else {
    // Fallback to browser download
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    return { success: true };
  }
};

/**
 * Convert degrees to radians
 * @param {number} degrees - Angle in degrees
 * @returns {number} Angle in radians
 */
export const degreesToRadians = (degrees) => {
  return degrees * (Math.PI / 180);
};

/**
 * Calculate distance between two points
 * @param {number} x1 - First point X
 * @param {number} y1 - First point Y
 * @param {number} x2 - Second point X
 * @param {number} y2 - Second point Y
 * @returns {number} Distance between points
 */
export const distance = (x1, y1, x2, y2) => {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};
