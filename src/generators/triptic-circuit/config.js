// Configuration file for Triptic Circuit Generator

// Color schemes based on the triptych concept
export const colorSchemes = {
  left: {
    background: '#f7df00', // bright yellow
    primary: '#000000',    // black
    secondary: '#333333',  // dark gray for details
    accent: '#222222'      // slightly lighter for variety
  },
  center: {
    background: '#0066cc', // blue
    primary: '#ffffff',    // white
    secondary: '#ff3300',  // red
    accent: '#ffcc00'      // yellow for details
  },
  right: {
    background: '#ccff00', // lime green
    primary: '#339933',    // green
    secondary: '#006600',  // dark green
    accent: '#000000'      // black for details
  }
};

// Default configuration options
export const defaultConfig = {
  // Basic settings
  panelType: 'left', // left, center, right
  gridSize: 20,
  padding: 30,
  
  // Pattern settings
  lineThickness: 2,
  lineSpacing: 8,
  hatchingDensity: 0.7,
  cornerRounding: 0,
  
  // Shape settings
  minShapeSize: 3,
  maxShapeSize: 8,
  shapeDensity: 0.7,
  shapeComplexity: 0.6,
  
  // Connection settings
  pathDensity: 0.5,
  pathComplexity: 0.7,
  includeConnectors: true,
  
  // Detail settings
  includeSmallDetails: true,
  detailDensity: 0.3,
  noiseAmount: 0
};

// Constraints for input validation
export const constraints = {
  gridSize: { min: 10, max: 40 },
  lineThickness: { min: 1, max: 5 },
  lineSpacing: { min: 4, max: 16 },
  minShapeSize: { min: 1, max: 6 },
  maxShapeSize: { min: 3, max: 12 },
  shapeDensity: { min: 0.3, max: 1, step: 0.05 },
  shapeComplexity: { min: 0.1, max: 1, step: 0.05 },
  pathDensity: { min: 0.1, max: 1, step: 0.05 },
  pathComplexity: { min: 0.1, max: 1, step: 0.05 },
  detailDensity: { min: 0.1, max: 0.6, step: 0.05 }
};

// Panel type names for UI
export const panelTypeNames = {
  left: 'Yellow/Black Hatched',
  center: 'Blue/Red/White Jagged', 
  right: 'Lime/Green Blocks'
};
