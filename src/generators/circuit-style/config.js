// Default configuration for circuit-style generator
export const defaultConfig = {
  cellCount: 20,
  randomSeed: Math.floor(Math.random() * 1000),
  noiseAmount: 30,
  shadowBlur: 0.02,
  colorScheme: 'original',
  canvasSize: 600,
  outputFilename: 'circuit-patterns.svg'
};

// Color schemes (exact same as circuit-gen.txt)
export const colorSchemes = {
  original: ['#e92f2f', '#dd6a7f', '#E0DBC5', '#e5c215', '#067bc2', '#8fc1dd', '#21377a'],
  blues: ['#0A2463', '#3E92CC', '#1E1B18', '#D8315B', '#1E56A0', '#163172', '#D6FFF6'],
  earth: ['#5F4B32', '#7D6546', '#A78B71', '#D9AE61', '#E5C59E', '#46351D', '#A3714C'],
  pastel: ['#F7D1CD', '#E8C2CA', '#D1B3C4', '#B392AC', '#735D78', '#6F5060', '#F5E9E2'],
  vibrant: ['#FE4A49', '#FED766', '#009FB7', '#2AB7CA', '#4ECDC4', '#F7FFF7', '#FF6B6B'],
  monochrome: ['#0D1B2A', '#1B263B', '#415A77', '#778DA9', '#E0E1DD', '#363636', '#171717']
};

// UI constraints
export const constraints = {
  cellCount: { min: 10, max: 40 },
  canvasSize: { min: 400, max: 800, step: 50 },
  noiseAmount: { min: 0, max: 50 },
  shadowBlur: { min: 0, max: 0.05, step: 0.005 },
  randomSeed: { min: 0, max: 10000 }
};

// Color scheme display names
export const colorSchemeNames = {
  original: 'Original',
  blues: 'Blues',
  earth: 'Earth Tones',
  pastel: 'Pastel',
  vibrant: 'Vibrant',
  monochrome: 'Monochrome'
};
