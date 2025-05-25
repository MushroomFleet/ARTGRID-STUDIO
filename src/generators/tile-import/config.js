// Default configuration for the Tile Import Generator
export const defaultConfig = {
  gridSize: 4,
  tileSize: 120,
  spacing: 2,
  strokeWeight: 2,
  strokeColor: '#000000',
  strokeOpacity: 1.0,
  strokeVariation: false,
  strokeWeightRange: [1, 4],
  colorScheme: 'original',
  applyColorScheme: false,
  fillOpacity: 1.0,
  randomOffset: 0,
  scaleVariation: 0,
  rotation: 0,
  randomRotation: false,
  applyGradients: false,
  gradientType: 'linear',
  gradientDirection: 45,
  shadowEffect: false,
  shadowBlur: 3,
  shadowOffset: 2,
  backgroundColor: '#ffffff',
  showGrid: false,
  mixSVGs: true,
  globalGradient: false,
  globalGradientOpacity: 0.5,
  recolorElements: true,
  sizeVariation: false,
  sizeVariationRange: [0.7, 1.3]
};

// Color schemes collection
export const colorSchemes = {
  original: [],
  vibrant: ['#ff3b30', '#ff9500', '#ffcc00', '#4cd964', '#5ac8fa', '#007aff', '#5856d6'],
  pastel: ['#ffb3ba', '#ffdfba', '#ffffba', '#baffc9', '#bae1ff', '#c9baff', '#ffc9e3'],
  monochrome: ['#000000', '#333333', '#666666', '#999999', '#cccccc', '#ffffff'],
  earth: ['#8b4513', '#a0522d', '#cd853f', '#daa520', '#b8860b', '#f4a460', '#d2691e'],
  ocean: ['#006994', '#13678a', '#45818e', '#76a5af', '#a7c5bd', '#0077be', '#4fb3d9'],
  sunset: ['#ff6b35', '#f7931e', '#ffd23f', '#06ffa5', '#118ab2', '#073b4c', '#ff9f1c'],
  primaryBold: ['#ff0000', '#0000ff', '#ffff00', '#ffffff', '#000000'],
  geometric: ['#e74c3c', '#3498db', '#f1c40f', '#2ecc71', '#9b59b6', '#e67e22'],
  retro: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd'],
  bauhaus: ['#d63031', '#0984e3', '#fdcb6e', '#2d3436', '#ffffff'],
  memphis: ['#ff3838', '#17c0eb', '#7bed9f', '#ffa502', '#ff6348', '#5f27cd'],
  neon: ['#ff0080', '#00ff80', '#8000ff', '#ff8000', '#0080ff', '#ffff00'],
  tropical: ['#ff6b35', '#f7931e', '#06ffa5', '#4ecdc4', '#45b7d1', '#96ceb4'],
  vintage: ['#d63447', '#f77f00', '#fcbf49', '#06d6a0', '#118ab2', '#073b4c'],
  cyberpunk: ['#ff2a6d', '#05d9e8', '#01012b', '#7209b7', '#f6019d', '#d16ba5'],
  cosmic: ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'],
  forest: ['#2d5016', '#4a7c59', '#6b9080', '#a4c3a2', '#e8f5e8', '#1e3a8a'],
  fire: ['#ff4757', '#ff3838', '#ff6348', '#ffa502', '#ffb142', '#ff7675']
};

// Grid constraints
export const gridConstraints = {
  gridSize: { min: 2, max: 8 },
  tileSize: { min: 80, max: 200, step: 10 },
  spacing: { min: 0, max: 20 }
};

// Transform constraints
export const transformConstraints = {
  randomOffset: { min: 0, max: 20 },
  scaleVariation: { min: 0, max: 0.5, step: 0.05 },
  rotation: { min: 0, max: 360, step: 15 }
};

// Effect constraints
export const effectConstraints = {
  fillOpacity: { min: 0, max: 1, step: 0.1 },
  strokeOpacity: { min: 0, max: 1, step: 0.1 },
  strokeWeight: { min: 0.5, max: 8, step: 0.5 },
  strokeWeightRange: { min: [0.5, 2], max: [4, 8] },
  shadowBlur: { min: 1, max: 10 },
  shadowOffset: { min: 1, max: 10 },
  globalGradientOpacity: { min: 0.1, max: 0.8, step: 0.1 },
  sizeVariationRange: { min: [0.3, 1], max: [1, 2], step: 0.1 }
};
