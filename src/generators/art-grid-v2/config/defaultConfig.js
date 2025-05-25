// Enhanced configuration for Art Grid V2
// Significantly expanded from the original with new features

export const defaultConfig = {
  // Grid settings - Enhanced with new grid types
  gridType: 'rectangular', // rectangular, hexagonal, triangular, voronoi, radial, irregular
  rows: null, // null means random 4-8
  cols: null, // null means random 4-8
  squareSize: 100,
  gridSpacing: 2, // Space between grid elements
  gridRotation: 0, // Overall grid rotation in degrees
  
  // Multi-layer system - NEW FEATURE
  layers: [
    {
      id: 'layer1',
      name: 'Base Layer',
      visible: true,
      opacity: 1.0,
      blendMode: 'normal',
      patterns: ['circle', 'cross', 'diagonal_square'],
      locked: false
    }
  ],
  activeLayer: 'layer1',
  
  // Color settings - Enhanced
  paletteIndex: null,
  seed: null,
  customPalette: [], // User-defined colors
  colorHarmony: 'complementary', // triadic, analogous, complementary, monochromatic
  colorTemperature: 0, // -1 to 1 (cool to warm bias)
  colorSaturation: 1.0, // Global saturation multiplier
  colorBrightness: 1.0, // Global brightness adjustment
  
  // Advanced background system
  backgroundType: 'gradient', // solid, gradient, pattern, texture
  backgroundGradient: {
    type: 'radial', // radial, linear, conical
    stops: [], // Will be populated from color palette
    angle: 0 // For linear gradients
  },
  
  // Pattern settings - Massively expanded
  blockStyles: [
    // Original V1 patterns (enhanced)
    'circle', 'opposite_circles', 'cross', 'half_square',
    'diagonal_square', 'quarter_circle', 'dots', 'letter_block',
    
    // New organic patterns
    'spiral', 'wave', 'organic_blob', 'cellular',
    
    // New geometric patterns
    'hexagon', 'triangle', 'star', 'diamond', 'islamic_pattern',
    
    // New artistic patterns
    'brush_stroke', 'watercolor', 'stippling', 'crosshatch',
    
    // New gradient patterns
    'radial_gradient', 'linear_gradient', 'conical_gradient',
    
    // New texture patterns
    'wood_grain', 'marble', 'fabric', 'digital_glitch'
  ],
  
  // Pattern behavior - NEW FEATURES
  patternDistribution: 'random', // random, clustered, flow, symmetric
  patternConnectivity: false, // Patterns connect across boundaries
  patternScale: 1.0, // Global pattern scaling
  patternDensity: 1.0, // How densely patterns fill their space
  
  // Big block settings - Enhanced
  bigBlock: true,
  bigBlockCount: 1, // Number of big blocks
  bigBlockSize: null,
  bigBlockShape: 'square', // square, circle, organic
  bigBlockPatterns: [], // Specific patterns for big blocks
  
  // Advanced effects system
  effects: {
    // Shadow system
    dropShadow: {
      enabled: false,
      layers: [
        {
          dx: 2,
          dy: 2,
          blur: 4,
          color: '#000000',
          opacity: 0.5
        }
      ]
    },
    
    // Inner shadow/glow
    innerShadow: {
      enabled: false,
      dx: 1,
      dy: 1,
      blur: 2,
      color: '#ffffff',
      opacity: 0.3
    },
    
    // Noise and texture
    noise: {
      enabled: false,
      amount: 0.8,
      frequency: 0.02,
      octaves: 3, // Multiple noise layers
      type: 'turbulence' // turbulence, fractal
    },
    
    // Distortion effects
    distortion: {
      enabled: false,
      type: 'wave', // wave, ripple, perspective
      strength: 0.1,
      frequency: 0.05
    },
    
    // 3D-like effects
    bevel: {
      enabled: false,
      size: 2,
      softness: 1,
      highlight: '#ffffff',
      shadow: '#000000'
    },
    
    // Texture overlays
    texture: {
      enabled: false,
      type: 'paper', // paper, canvas, metal, fabric
      opacity: 0.3,
      scale: 1.0
    }
  },
  
  // Animation system - NEW FEATURE
  animation: {
    enabled: false,
    duration: 3000, // milliseconds
    easing: 'ease-in-out',
    type: 'color_cycle', // color_cycle, rotation, scale, pattern_morph
    direction: 'forward', // forward, reverse, alternate
    delay: 0,
    iterations: 'infinite' // number or 'infinite'
  },
  
  // Interactive features - NEW
  interactive: {
    hoverEffects: true,
    clickToEdit: true,
    selectionMode: false,
    brushMode: false,
    brushPattern: 'circle',
    brushSize: 1
  },
  
  // Export settings - Enhanced
  export: {
    format: 'svg', // svg, png, pdf, gif, mp4
    quality: 'high', // low, medium, high, print
    resolution: 1, // Multiplier for raster exports
    includeBackground: true,
    optimizeForWeb: true,
    filename: 'art_grid_v2'
  },
  
  // Smart generation - NEW AI-ASSISTED FEATURES
  smartGeneration: {
    enabled: false,
    style: 'balanced', // balanced, chaotic, minimal, dense
    colorHarmonyStrength: 0.7,
    patternFlowEnabled: false,
    compositionGuides: false, // Golden ratio, rule of thirds
    avoidAdjacent: false // Prevent same patterns from being adjacent
  },
  
  // Performance settings
  performance: {
    renderQuality: 'high', // low, medium, high
    enableGPUAcceleration: true,
    maxAnimationFPS: 60,
    previewMode: false // Lower quality for real-time editing
  }
};

// Grid type constraints and settings
export const gridTypeConfigs = {
  rectangular: {
    minRows: 3, maxRows: 20,
    minCols: 3, maxCols: 20,
    supportsBigBlocks: true,
    supportsRotation: true
  },
  hexagonal: {
    minRows: 3, maxRows: 15,
    minCols: 3, maxCols: 15,
    supportsBigBlocks: true,
    supportsRotation: true,
    aspectRatio: 0.866 // Height factor for hexagons
  },
  triangular: {
    minRows: 4, maxRows: 16,
    minCols: 4, maxCols: 16,
    supportsBigBlocks: false,
    supportsRotation: true
  },
  voronoi: {
    minCells: 10, maxCells: 50,
    supportsBigBlocks: false,
    supportsRotation: false,
    irregular: true
  },
  radial: {
    minRings: 3, maxRings: 8,
    minSegments: 6, maxSegments: 24,
    supportsBigBlocks: false,
    supportsRotation: true
  },
  irregular: {
    minCells: 8, maxCells: 30,
    supportsBigBlocks: false,
    supportsRotation: false,
    handDrawn: true
  }
};

// Enhanced constraints
export const constraints = {
  grid: {
    squareSize: { min: 30, max: 300 },
    spacing: { min: 0, max: 20 },
    rotation: { min: -45, max: 45 }
  },
  
  effects: {
    shadowOffset: { min: -20, max: 20 },
    shadowBlur: { min: 0, max: 50 },
    shadowOpacity: { min: 0, max: 1, step: 0.05 },
    noiseAmount: { min: 0, max: 3, step: 0.1 },
    noiseFrequency: { min: 0.001, max: 0.2, step: 0.001 },
    distortionStrength: { min: 0, max: 1, step: 0.05 },
    textureOpacity: { min: 0, max: 1, step: 0.05 }
  },
  
  animation: {
    duration: { min: 500, max: 10000, step: 100 },
    delay: { min: 0, max: 5000, step: 100 }
  },
  
  layers: {
    maxLayers: 5,
    opacity: { min: 0, max: 1, step: 0.05 }
  }
};

// Big block constraints - Enhanced
export const bigBlockConstraints = {
  size: { min: 2, max: 6 },
  count: { min: 1, max: 3 }
};

// Random generation helpers - Enhanced
export const getRandomRows = (gridType = 'rectangular') => {
  const config = gridTypeConfigs[gridType];
  const min = config.minRows || 4;
  const max = Math.min(config.maxRows || 8, 8); // Cap at 8 for initial random
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getRandomCols = (gridType = 'rectangular') => {
  const config = gridTypeConfigs[gridType];
  const min = config.minCols || 4;
  const max = Math.min(config.maxCols || 8, 8); // Cap at 8 for initial random
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getRandomBigBlockSize = () => Math.floor(Math.random() * 2) + 2; // 2-3

// Blend mode options
export const blendModes = [
  'normal', 'multiply', 'screen', 'overlay', 'soft-light', 
  'hard-light', 'color-dodge', 'color-burn', 'darken', 
  'lighten', 'difference', 'exclusion'
];

// Color harmony types
export const colorHarmonyTypes = [
  'complementary', 'triadic', 'analogous', 'monochromatic', 
  'tetradic', 'split-complementary', 'custom'
];

// Animation types
export const animationTypes = [
  'color_cycle', 'rotation', 'scale', 'pattern_morph', 
  'wave', 'ripple', 'fade', 'slide'
];

// Pattern categories for organization
export const patternCategories = {
  'Basic Shapes': [
    'circle', 'square', 'triangle', 'diamond', 'hexagon'
  ],
  'Complex Geometry': [
    'opposite_circles', 'cross', 'half_square', 'diagonal_square', 
    'quarter_circle', 'star', 'islamic_pattern'
  ],
  'Organic Forms': [
    'spiral', 'wave', 'organic_blob', 'cellular'
  ],
  'Artistic Effects': [
    'brush_stroke', 'watercolor', 'stippling', 'crosshatch'
  ],
  'Textures': [
    'dots', 'wood_grain', 'marble', 'fabric', 'digital_glitch'
  ],
  'Gradients': [
    'radial_gradient', 'linear_gradient', 'conical_gradient'
  ],
  'Typography': [
    'letter_block'
  ]
};

// Validation helpers - Enhanced
export const validateConfig = (config) => {
  const errors = [];
  const gridConfig = gridTypeConfigs[config.gridType];
  
  if (!gridConfig) {
    errors.push(`Invalid grid type: ${config.gridType}`);
    return errors;
  }
  
  if (config.rows !== null) {
    if (config.rows < gridConfig.minRows || config.rows > gridConfig.maxRows) {
      errors.push(`Rows must be between ${gridConfig.minRows} and ${gridConfig.maxRows} for ${config.gridType} grid`);
    }
  }
  
  if (config.cols !== null) {
    if (config.cols < gridConfig.minCols || config.cols > gridConfig.maxCols) {
      errors.push(`Columns must be between ${gridConfig.minCols} and ${gridConfig.maxCols} for ${config.gridType} grid`);
    }
  }
  
  if (config.squareSize < constraints.grid.squareSize.min || config.squareSize > constraints.grid.squareSize.max) {
    errors.push(`Square size must be between ${constraints.grid.squareSize.min} and ${constraints.grid.squareSize.max}`);
  }
  
  if (config.layers.length > constraints.layers.maxLayers) {
    errors.push(`Maximum ${constraints.layers.maxLayers} layers allowed`);
  }
  
  return errors;
};

// Helper to merge user config with defaults
export const mergeWithDefaults = (userConfig) => {
  return { ...defaultConfig, ...userConfig };
};

// Preset configurations for quick setup
export const presetConfigs = {
  classic: {
    ...defaultConfig,
    gridType: 'rectangular',
    blockStyles: ['circle', 'cross', 'diagonal_square', 'quarter_circle'],
    effects: { ...defaultConfig.effects }
  },
  
  modern: {
    ...defaultConfig,
    gridType: 'hexagonal',
    blockStyles: ['hexagon', 'triangle', 'diamond', 'linear_gradient'],
    effects: {
      ...defaultConfig.effects,
      dropShadow: { enabled: true, layers: [{ dx: 3, dy: 3, blur: 6, color: '#000000', opacity: 0.3 }] }
    }
  },
  
  organic: {
    ...defaultConfig,
    gridType: 'voronoi',
    blockStyles: ['spiral', 'wave', 'organic_blob', 'cellular'],
    effects: {
      ...defaultConfig.effects,
      noise: { enabled: true, amount: 0.5, frequency: 0.03, octaves: 2 }
    }
  },
  
  artistic: {
    ...defaultConfig,
    gridType: 'irregular',
    blockStyles: ['brush_stroke', 'watercolor', 'stippling', 'crosshatch'],
    effects: {
      ...defaultConfig.effects,
      texture: { enabled: true, type: 'paper', opacity: 0.4, scale: 1.2 }
    }
  },
  
  minimal: {
    ...defaultConfig,
    gridType: 'rectangular',
    blockStyles: ['circle', 'square', 'triangle'],
    colorHarmony: 'monochromatic',
    effects: { ...defaultConfig.effects }
  }
};

export default defaultConfig;
