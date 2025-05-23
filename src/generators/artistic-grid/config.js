// Configuration for the artistic grid generator
// Based on the Python script's default values and command line arguments

export const defaultConfig = {
  // Grid settings
  rows: null, // null means random 4-8
  cols: null, // null means random 4-8
  squareSize: 100,
  
  // Color settings
  paletteIndex: null, // null means random
  seed: null, // null means no seed (random)
  
  // Big block settings
  bigBlock: true,
  bigBlockSize: null, // null means random 2-3
  
  // Pattern settings
  blockStyles: [
    'circle',
    'opposite_circles',
    'cross',
    'half_square',
    'diagonal_square',
    'quarter_circle',
    'dots',
    'letter_block'
  ],
  
  // Visual effects
  dropShadow: false,
  shadowOffset: 2,
  shadowOpacity: 0.5,
  shadowColor: '#000000',
  
  useNoise: false,
  noiseAmount: 0.8,
  turbulenceFrequency: 0.02,
  
  // Output settings
  outputFilename: 'art_grid.svg'
};

// Grid size constraints
export const gridConstraints = {
  rows: { min: 3, max: 12 },
  cols: { min: 3, max: 12 },
  squareSize: { min: 50, max: 200 }
};

// Effect constraints
export const effectConstraints = {
  shadowOffset: { min: 1, max: 10 },
  shadowOpacity: { min: 0.1, max: 1.0, step: 0.1 },
  noiseAmount: { min: 0.1, max: 2.0, step: 0.1 },
  turbulenceFrequency: { min: 0.005, max: 0.1, step: 0.005 }
};

// Big block constraints
export const bigBlockConstraints = {
  size: { min: 2, max: 3 }
};

// Random generation helpers
export const getRandomRows = () => Math.floor(Math.random() * 5) + 4; // 4-8
export const getRandomCols = () => Math.floor(Math.random() * 5) + 4; // 4-8
export const getRandomBigBlockSize = () => Math.floor(Math.random() * 2) + 2; // 2-3

// Validation helpers
export const validateConfig = (config) => {
  const errors = [];
  
  if (config.rows !== null && (config.rows < gridConstraints.rows.min || config.rows > gridConstraints.rows.max)) {
    errors.push(`Rows must be between ${gridConstraints.rows.min} and ${gridConstraints.rows.max}`);
  }
  
  if (config.cols !== null && (config.cols < gridConstraints.cols.min || config.cols > gridConstraints.cols.max)) {
    errors.push(`Columns must be between ${gridConstraints.cols.min} and ${gridConstraints.cols.max}`);
  }
  
  if (config.squareSize < gridConstraints.squareSize.min || config.squareSize > gridConstraints.squareSize.max) {
    errors.push(`Square size must be between ${gridConstraints.squareSize.min} and ${gridConstraints.squareSize.max}`);
  }
  
  if (config.bigBlockSize !== null && (config.bigBlockSize < bigBlockConstraints.size.min || config.bigBlockSize > bigBlockConstraints.size.max)) {
    errors.push(`Big block size must be between ${bigBlockConstraints.size.min} and ${bigBlockConstraints.size.max}`);
  }
  
  return errors;
};

// Helper to merge user config with defaults
export const mergeWithDefaults = (userConfig) => {
  return { ...defaultConfig, ...userConfig };
};
