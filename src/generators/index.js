// Generator registry
// Import all generators here

import ArtisticGridGenerator from './artistic-grid/ArtisticGridGenerator.jsx';
import ArtGridV2Generator from './art-grid-v2/ArtGridV2Generator.jsx';
import MazeStyleGenerator from './maze-style/MazeStyleGenerator.jsx';
import CircuitStyleGenerator from './circuit-style/CircuitStyleGenerator.jsx';
import CircuitV2Generator from './circuit-v2/CircuitV2Generator.jsx';
import BalancedCircuitGenerator from './balanced-circuit/BalancedCircuitGenerator.jsx';
import TripticCircuitGenerator from './triptic-circuit/TripticCircuitGenerator.jsx';
import TileImportGenerator from './tile-import/TileImportGenerator.jsx';
import StampDecoratorGenerator from './stamp-decorator/StampDecoratorGenerator.jsx';
import TopoContourGenerator from './topo-contour/TopoContourGenerator.jsx';

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
  'art-grid-v2': {
    name: 'Art Grid V2',
    slug: 'art-grid-v2',
    component: ArtGridV2Generator,
    description: 'Next-generation artistic grid generator with advanced features, multiple grid types, and professional effects',
    features: [
      '6 grid types (rectangular, hexagonal, triangular, voronoi, radial, irregular)',
      '25+ pattern types across 7 categories (geometric, organic, artistic, textures)',
      'Multi-layer system with blend modes and opacity controls',
      'Advanced effects (shadows, noise, distortion, 3D bevels)',
      'Smart pattern distribution and AI-assisted composition',
      'Interactive editing and real-time parameter adjustment',
      'Professional export options and print-ready quality',
      'Style presets (Classic, Modern, Organic, Artistic, Minimal)'
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
  'circuit-v2': {
    name: 'Circuit V2',
    slug: 'circuit-v2',
    component: CircuitV2Generator,
    description: 'Advanced circuit pattern generator with extensive customization and 35+ pattern types',
    features: [
      '35+ pattern types (25 original + 10 advanced procedural patterns)',
      'Multiple grid systems (rectangular, hexagonal, triangular, irregular)',
      'Advanced geometry controls (jitter, scaling, rotation, aspect ratio)',
      'Professional visual effects (shadows, glow, borders, noise)',
      'Comprehensive color palette system with presets',
      'Post-processing effects (contrast, brightness, saturation, gamma)',
      'Multiple random seeds for different aspects',
      'Pattern weighting and selection system',
      'Real-time preview with canvas rendering'
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
  },
  'tile-import': {
    name: 'SVG Tile Importer',
    slug: 'tile-import',
    component: TileImportGenerator,
    description: 'Import and arrange your SVG files into dynamic tile patterns with advanced effects and color schemes',
    features: [
      'Multi-SVG file import with mixing capabilities',
      '18+ professional color schemes (Vibrant, Pastel, Cyberpunk, etc.)',
      'Smart element recoloring and gradient effects',
      'Advanced transforms (rotation, scaling, positioning)',
      'Global gradient overlays and shadow effects',
      'Random size variation and intelligent mixing',
      'High-quality SVG and PNG export',
      'Grid sizes from 2x2 to 8x8 with customizable spacing'
    ]
  },
  'stamp-decorator': {
    name: 'Stamp Decorator',
    slug: 'stamp-decorator',
    component: StampDecoratorGenerator,
    description: 'Generate decorative stamp patterns with scalloped edges and recursive subdivisions',
    features: [
      'Decorative scalloped stamp edges',
      'Recursive subdivision patterns',
      'Corner arc decorations',
      '6 color schemes (Original, Warm, Cool, Monochrome, Pastel, Vibrant)',
      'Paper texture effects with noise overlay',
      'Drop shadows for depth',
      'Seeded randomization for reproducible results',
      'Customizable grid size and stamp density'
    ]
  },
  'topo-contour': {
    name: 'Topo-Contour',
    slug: 'topo-contour',
    component: TopoContourGenerator,
    description: 'Generate topographical contour maps with realistic terrain and elevation lines for natural composition structures',
    features: [
      '5 terrain types (hills, mountains, valleys, ridges, craters)',
      'Perlin noise terrain generation with octaves and persistence',
      'Major and minor contour lines with customizable intervals',
      'Elevation labels and ridge point visualization',
      'Advanced smoothing and visual styling controls',
      'Seeded randomization for reproducible terrains',
      'SVG export with professional cartographic styling'
    ]
  }
};

// Helper functions
export const getGeneratorList = () => Object.values(generators);
export const getGenerator = (slug) => generators[slug];
export const getGeneratorSlugs = () => Object.keys(generators);

// Default generator
export const DEFAULT_GENERATOR = 'artistic-grid';
