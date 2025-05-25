// Enhanced configuration system for Circuit V2 Generator
// Exposes extensive parameters for fine-grained control

export const defaultConfig = {
  // Basic Canvas Settings
  canvas: {
    width: 800,
    height: 800,
    backgroundColor: '#000000',
    exportFormat: 'png',
    dpi: 300
  },

  // Grid System Configuration
  grid: {
    cellsX: 20,
    cellsY: 20,
    type: 'rectangular', // rectangular, hexagonal, triangular, irregular
    uniformSize: true,
    minCellSize: 0.8,
    maxCellSize: 1.2,
    spacing: 1.0,
    offset: { x: 0, y: 0 },
    rotation: 0
  },

  // Advanced Geometry Controls
  geometry: {
    positionJitter: 0.1, // How much shapes can deviate from grid positions
    scaleVariance: 0.2, // Random size variation
    rotationMode: 'discrete', // discrete, continuous, none
    rotationSteps: 4, // For discrete mode (90° increments)
    rotationRange: 360, // For continuous mode
    aspectRatioVariance: 0.1, // Independent X/Y scaling
    positionSeed: 12345,
    overlapAllowed: true,
    boundaryHandling: 'wrap' // wrap, clip, extend
  },

  // Pattern System
  patterns: {
    // Individual pattern type controls (from original 25 + new ones)
    enabled: {
      checkerboard: true,
      horizontalBars: true,
      fiveCircles: true,
      concentricCircles: true,
      triangleCorner: true,
      triangleUp: true,
      circle: true,
      verticalLines: true,
      circleGrid: true,
      diagonalSlash: true,
      horizontalRects: true,
      cornerSquares: true,
      quarterCircles: true,
      halfCircles: true,
      quarterCorner: true,
      dotsWithCircle: true,
      overlappingCircles: true,
      squareInSquare: true,
      circleWithLines: true,
      octagonHole: true,
      centerTriangles: true,
      cornerTriangles: true,
      oppositeQuarters: true,
      nestedSquares: true,
      diamond: true,
      // New enhanced patterns
      bezierCurves: false,
      fractalTree: false,
      spiralPattern: false,
      circuitTrace: false,
      hexPattern: false,
      voronoiCell: false,
      parametricWave: false,
      noiseField: false,
      organicBlob: false,
      geometricMandala: false
    },
    
    // Pattern probability weights (0-1 for each pattern)
    weights: {
      checkerboard: 1.0,
      horizontalBars: 1.0,
      fiveCircles: 1.0,
      concentricCircles: 1.0,
      triangleCorner: 1.0,
      triangleUp: 1.0,
      circle: 1.0,
      verticalLines: 1.0,
      circleGrid: 1.0,
      diagonalSlash: 1.0,
      horizontalRects: 1.0,
      cornerSquares: 1.0,
      quarterCircles: 1.0,
      halfCircles: 1.0,
      quarterCorner: 1.0,
      dotsWithCircle: 1.0,
      overlappingCircles: 1.0,
      squareInSquare: 1.0,
      circleWithLines: 1.0,
      octagonHole: 1.0,
      centerTriangles: 1.0,
      cornerTriangles: 1.0,
      oppositeQuarters: 1.0,
      nestedSquares: 1.0,
      diamond: 1.0,
      bezierCurves: 0.5,
      fractalTree: 0.3,
      spiralPattern: 0.4,
      circuitTrace: 0.6,
      hexPattern: 0.5,
      voronoiCell: 0.3,
      parametricWave: 0.4,
      noiseField: 0.2,
      organicBlob: 0.3,
      geometricMandala: 0.4
    },

    // Pattern distribution modes
    distribution: {
      mode: 'random', // random, clustered, zoned, gradient, radial
      clusterSize: 3,
      clusterIntensity: 0.7,
      zones: [],
      gradientDirection: 'horizontal' // horizontal, vertical, radial, diagonal
    }
  },

  // Advanced Color System
  colors: {
    palette: [
      '#e92f2f', '#dd6a7f', '#E0DBC5', '#e5c215', 
      '#067bc2', '#8fc1dd', '#21377a'
    ],
    
    // Color harmony rules
    harmony: {
      type: 'custom', // custom, complementary, triadic, analogous, monochromatic
      saturationVariance: 0.2,
      brightnessVariance: 0.3,
      temperature: 'neutral' // warm, cool, neutral
    },

    // Individual color controls
    colorControls: {
      enableGradients: false,
      gradientStops: 2,
      opacityVariance: 0.1,
      colorMutationRate: 0.05,
      dynamicPalette: false
    },

    // Background options
    background: {
      type: 'solid', // solid, gradient, pattern, noise
      color: '#000000',
      gradientColors: ['#000000', '#1a1a1a'],
      gradientDirection: 'vertical'
    }
  },

  // Multi-Layer System
  layers: [
    {
      id: 'main',
      name: 'Main Pattern Layer',
      enabled: true,
      opacity: 1.0,
      blendMode: 'normal', // normal, multiply, screen, overlay, etc.
      patternOverride: null,
      colorOverride: null,
      transform: {
        translateX: 0,
        translateY: 0,
        scale: 1.0,
        rotation: 0
      }
    }
  ],

  // Enhanced Visual Effects
  visual: {
    // Shadow system
    shadows: {
      enabled: true,
      layers: [
        {
          blur: 0.02,
          color: '#000000',
          opacity: 0.6,
          offsetX: 0,
          offsetY: 0
        }
      ]
    },

    // Glow effects
    glow: {
      enabled: false,
      intensity: 0.5,
      spread: 0.1,
      color: '#ffffff',
      innerGlow: false
    },

    // Border/Stroke options
    borders: {
      enabled: false,
      width: 1,
      color: '#ffffff',
      style: 'solid', // solid, dashed, dotted
      opacity: 1.0
    },

    // Texture overlays
    texture: {
      enabled: false,
      type: 'noise', // noise, grain, fabric, metal, wood
      intensity: 0.3,
      scale: 1.0,
      blendMode: 'overlay'
    },

    // 3D and depth effects
    depth: {
      enabled: false,
      bevelSize: 2,
      bevelSoftness: 0.5,
      lightAngle: 45,
      lightIntensity: 0.7,
      ambientLight: 0.3
    },

    // Noise filter
    noise: {
      enabled: true,
      amount: 30,
      type: 'uniform', // uniform, gaussian, perlin
      colorChannels: 'rgb', // rgb, luminance, alpha
      seed: 54321
    },

    // Post-processing effects
    postProcessing: {
      contrast: 1.0,
      brightness: 1.0,
      saturation: 1.0,
      gamma: 1.0,
      vignette: {
        enabled: false,
        intensity: 0.3,
        softness: 0.5
      }
    }
  },

  // Animation settings (for future use)
  animation: {
    enabled: false,
    duration: 5000,
    easing: 'linear',
    loop: true,
    animatedProperties: []
  },

  // Global randomization
  randomSeed: 12345,

  // Export settings
  export: {
    format: 'png',
    quality: 0.95,
    includeMetadata: true,
    vectorOptimized: false,
    filename: 'circuit-v2-pattern'
  }
};

// Predefined style presets
export const stylePresets = {
  classic: {
    name: 'Classic Circuit',
    description: 'Traditional circuit board aesthetic',
    config: {
      ...defaultConfig,
      colors: {
        ...defaultConfig.colors,
        palette: ['#e92f2f', '#dd6a7f', '#E0DBC5', '#e5c215', '#067bc2', '#8fc1dd', '#21377a']
      },
      visual: {
        ...defaultConfig.visual,
        shadows: { ...defaultConfig.visual.shadows, enabled: true },
        noise: { ...defaultConfig.visual.noise, amount: 25 }
      }
    }
  },

  modern: {
    name: 'Modern Minimal',
    description: 'Clean, minimal aesthetic with subtle effects',
    config: {
      ...defaultConfig,
      colors: {
        ...defaultConfig.colors,
        palette: ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#dbeafe', '#1e40af', '#1d4ed8']
      },
      visual: {
        ...defaultConfig.visual,
        glow: { ...defaultConfig.visual.glow, enabled: true, intensity: 0.3 },
        noise: { ...defaultConfig.visual.noise, amount: 10 }
      }
    }
  },

  neon: {
    name: 'Neon Cyber',
    description: 'Vibrant neon colors with glowing effects',
    config: {
      ...defaultConfig,
      colors: {
        ...defaultConfig.colors,
        palette: ['#ff00ff', '#00ffff', '#ffff00', '#ff6600', '#00ff00', '#ff0066', '#6600ff'],
        background: { ...defaultConfig.colors.background, color: '#0a0a0a' }
      },
      visual: {
        ...defaultConfig.visual,
        glow: { ...defaultConfig.visual.glow, enabled: true, intensity: 0.8, spread: 0.2 },
        borders: { ...defaultConfig.visual.borders, enabled: true, color: '#ffffff', width: 0.5 }
      }
    }
  },

  organic: {
    name: 'Organic Flow',
    description: 'Natural, flowing patterns with organic shapes',
    config: {
      ...defaultConfig,
      geometry: {
        ...defaultConfig.geometry,
        positionJitter: 0.3,
        scaleVariance: 0.4,
        rotationMode: 'continuous'
      },
      patterns: {
        ...defaultConfig.patterns,
        enabled: {
          ...defaultConfig.patterns.enabled,
          organicBlob: true,
          spiralPattern: true,
          voronoiCell: true,
          parametricWave: true
        }
      },
      colors: {
        ...defaultConfig.colors,
        palette: ['#5f7c61', '#8fbc8f', '#deb887', '#d2b48c', '#f4e4bc', '#cd853f', '#8b7355']
      }
    }
  },

  monochrome: {
    name: 'Monochrome Circuit',
    description: 'Black and white with grayscale variations',
    config: {
      ...defaultConfig,
      colors: {
        ...defaultConfig.colors,
        palette: ['#ffffff', '#e5e5e5', '#cccccc', '#999999', '#666666', '#333333', '#000000']
      },
      visual: {
        ...defaultConfig.visual,
        shadows: { ...defaultConfig.visual.shadows, enabled: true },
        texture: { ...defaultConfig.visual.texture, enabled: true, type: 'grain', intensity: 0.2 }
      }
    }
  }
};

// Parameter constraints for UI controls
export const constraints = {
  canvas: {
    width: { min: 400, max: 2000, step: 50 },
    height: { min: 400, max: 2000, step: 50 }
  },
  grid: {
    cellsX: { min: 5, max: 50, step: 1 },
    cellsY: { min: 5, max: 50, step: 1 },
    spacing: { min: 0.1, max: 3.0, step: 0.1 }
  },
  geometry: {
    positionJitter: { min: 0, max: 1.0, step: 0.01 },
    scaleVariance: { min: 0, max: 2.0, step: 0.01 },
    aspectRatioVariance: { min: 0, max: 1.0, step: 0.01 }
  },
  visual: {
    shadowBlur: { min: 0, max: 0.1, step: 0.001 },
    noiseAmount: { min: 0, max: 100, step: 1 },
    glowIntensity: { min: 0, max: 2.0, step: 0.01 },
    opacity: { min: 0, max: 1.0, step: 0.01 }
  }
};
