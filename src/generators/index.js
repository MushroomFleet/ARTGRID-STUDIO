// Generator registry
// Import all generators here

import ArtisticGridGenerator from './artistic-grid/ArtisticGridGenerator.jsx';
import MazeStyleGenerator from './maze-style/MazeStyleGenerator.jsx';
import CircuitStyleGenerator from './circuit-style/CircuitStyleGenerator.jsx';
import BalancedCircuitGenerator from './balanced-circuit/BalancedCircuitGenerator.jsx';
import TripticCircuitGenerator from './triptic-circuit/TripticCircuitGenerator.jsx';

// Generator registry with all available generators
export const generators = {
  'artistic-grid': {
    name: 'Artistic Grid',
    slug: 'artistic-grid',
    component: ArtisticGridGenerator,
    description: 'Generate artistic SVG grids with geometric patterns based on the original Python script',
    features: [
      '8 different pattern types',
      'Dynamic color palettes',
      'Optional big blocks for focal points',
      'Visual effects like drop shadows and noise',
      'Customizable grid dimensions'
    ]
  },
  'maze-style': {
    name: 'Maze-Style Grid',
    slug: 'maze-style', 
    component: MazeStyleGenerator,
    description: 'Create maze-like grid patterns with path-based generation',
    features: [
      'Path-based grid generation',
      'Drop shadow effects',
      'Turbulence filter effects',
      'Cluster-based distribution',
      'Multiple color schemes'
    ]
  },
  'circuit-style': {
    name: 'Circuit-Style Patterns',
    slug: 'circuit-style',
    component: CircuitStyleGenerator,
    description: 'Generate circuit board-inspired geometric patterns with 25 different shapes',
    features: [
      '25 different pattern types',
      'Grid-based structured layout',
      '6 color schemes (Original, Blues, Earth, Pastel, Vibrant, Monochrome)',
      'Shadow and noise effects',
      'Seeded randomization for reproducible results'
    ]
  },
  'balanced-circuit': {
    name: 'Balanced Circuit',
    slug: 'balanced-circuit',
    component: BalancedCircuitGenerator,
    description: 'Generate balanced circuit patterns with weighted color distribution',
    features: [
      'Weighted color distribution system',
      'Color balance presets (Balanced, Red Focus, Blue Focus, Minimal)',
      'Jagged circuit-like shape generation',
      'Size-based shape distribution (large, medium, small)',
      'Grid-based structured layout'
    ]
  },
  'triptic-circuit': {
    name: 'Triptych Circuit',
    slug: 'triptic-circuit',
    component: TripticCircuitGenerator,
    description: 'Generate triptych-style circuit patterns with three distinct visual styles',
    features: [
      'Three distinct panel styles (Hatched, Jagged, Block)',
      'Triptych and individual panel modes',
      'Advanced pattern filling (hatching, cross-hatching)',
      'Circuit-like connector paths',
      'Detailed small elements and decorations'
    ]
  }
};

// Helper functions
export const getGeneratorList = () => Object.values(generators);
export const getGenerator = (slug) => generators[slug];
export const getGeneratorSlugs = () => Object.keys(generators);

// Default generator
export const DEFAULT_GENERATOR = 'artistic-grid';
