import * as d3 from 'd3';
import { patternLibrary } from './patternLibrary.js';

// Advanced render engine for Circuit V2 Generator
export const renderEngine = {
  // Main render function
  async render(canvas, options) {
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = options.canvas.width;
    canvas.height = options.canvas.height;
    
    // Initialize seeded random generators
    const mainRandom = d3.randomLcg(options.randomSeed);
    const positionRandom = d3.randomLcg(options.geometry.positionSeed);
    
    // Clear canvas and set background
    this.renderBackground(ctx, options);
    
    // Generate grid and shape data
    const grid = this.generateGrid(options);
    const shapes = this.generateShapes(grid, options, mainRandom, positionRandom);
    
    // Render layers
    for (const layer of options.layers.filter(l => l.enabled)) {
      await this.renderLayer(ctx, shapes, layer, options, mainRandom);
    }
    
    // Apply post-processing effects
    this.applyPostProcessing(ctx, options);
  },

  // Generate advanced grid system
  generateGrid(options) {
    const { grid, canvas } = options;
    const cells = [];
    
    switch (grid.type) {
      case 'rectangular':
        return this.generateRectangularGrid(options);
      case 'hexagonal':
        return this.generateHexagonalGrid(options);
      case 'triangular':
        return this.generateTriangularGrid(options);
      case 'irregular':
        return this.generateIrregularGrid(options);
      default:
        return this.generateRectangularGrid(options);
    }
  },

  // Rectangular grid with advanced features
  generateRectangularGrid(options) {
    const { grid, canvas, geometry } = options;
    const cells = [];
    
    const cellWidth = canvas.width / grid.cellsX;
    const cellHeight = canvas.height / grid.cellsY;
    
    for (let y = 0; y < grid.cellsY; y++) {
      for (let x = 0; x < grid.cellsX; x++) {
        const baseX = x * cellWidth + cellWidth / 2;
        const baseY = y * cellHeight + cellHeight / 2;
        
        // Apply grid spacing and offset
        const adjustedX = baseX * grid.spacing + grid.offset.x;
        const adjustedY = baseY * grid.spacing + grid.offset.y;
        
        // Variable cell size if enabled
        let width = cellWidth;
        let height = cellHeight;
        
        if (!grid.uniformSize) {
          const sizeVariation = (Math.random() * (grid.maxCellSize - grid.minCellSize)) + grid.minCellSize;
          width *= sizeVariation;
          height *= sizeVariation;
        }
        
        cells.push({
          x: adjustedX,
          y: adjustedY,
          width,
          height,
          gridX: x,
          gridY: y,
          id: `${x}-${y}`
        });
      }
    }
    
    return cells;
  },

  // Hexagonal grid generation
  generateHexagonalGrid(options) {
    const { grid, canvas } = options;
    const cells = [];
    
    const hexRadius = Math.min(canvas.width, canvas.height) / (Math.max(grid.cellsX, grid.cellsY) * 2);
    const hexWidth = hexRadius * 2;
    const hexHeight = hexRadius * Math.sqrt(3);
    
    for (let y = 0; y < grid.cellsY; y++) {
      for (let x = 0; x < grid.cellsX; x++) {
        const offsetX = (y % 2) * (hexWidth * 0.75);
        const cellX = x * (hexWidth * 1.5) + offsetX + hexRadius;
        const cellY = y * (hexHeight * 0.5) + hexRadius;
        
        if (cellX < canvas.width && cellY < canvas.height) {
          cells.push({
            x: cellX,
            y: cellY,
            width: hexWidth,
            height: hexHeight,
            gridX: x,
            gridY: y,
            id: `hex-${x}-${y}`,
            type: 'hexagon'
          });
        }
      }
    }
    
    return cells;
  },

  // Triangular grid generation
  generateTriangularGrid(options) {
    const { grid, canvas } = options;
    const cells = [];
    
    const triHeight = canvas.height / grid.cellsY;
    const triWidth = (canvas.width / grid.cellsX) * 2;
    
    for (let y = 0; y < grid.cellsY; y++) {
      for (let x = 0; x < grid.cellsX; x++) {
        const isUpward = (x + y) % 2 === 0;
        const cellX = x * (triWidth / 2) + (triWidth / 4);
        const cellY = y * triHeight + (triHeight / 2);
        
        cells.push({
          x: cellX,
          y: cellY,
          width: triWidth / 2,
          height: triHeight,
          gridX: x,
          gridY: y,
          id: `tri-${x}-${y}`,
          type: 'triangle',
          upward: isUpward
        });
      }
    }
    
    return cells;
  },

  // Irregular/organic grid generation
  generateIrregularGrid(options) {
    const { grid, canvas } = options;
    const cells = [];
    const random = d3.randomLcg(options.randomSeed + 1000);
    
    // Use Poisson disk sampling for organic distribution
    const targetCount = grid.cellsX * grid.cellsY;
    const minDistance = Math.min(canvas.width, canvas.height) / Math.sqrt(targetCount) * 0.8;
    
    // Simple Poisson disk sampling
    const points = [];
    const maxAttempts = 30;
    
    // Add initial random point
    points.push({
      x: random() * canvas.width,
      y: random() * canvas.height
    });
    
    while (points.length < targetCount) {
      let placed = false;
      
      for (let attempt = 0; attempt < maxAttempts && !placed; attempt++) {
        const candidate = {
          x: random() * canvas.width,
          y: random() * canvas.height
        };
        
        let validPosition = true;
        for (const point of points) {
          const distance = Math.sqrt(
            Math.pow(candidate.x - point.x, 2) + Math.pow(candidate.y - point.y, 2)
          );
          if (distance < minDistance) {
            validPosition = false;
            break;
          }
        }
        
        if (validPosition) {
          points.push(candidate);
          placed = true;
        }
      }
      
      if (!placed) break; // Prevent infinite loop
    }
    
    // Convert points to cells
    points.forEach((point, index) => {
      const size = minDistance * (0.8 + random() * 0.4);
      cells.push({
        x: point.x,
        y: point.y,
        width: size,
        height: size,
        gridX: index % grid.cellsX,
        gridY: Math.floor(index / grid.cellsX),
        id: `irregular-${index}`,
        type: 'irregular'
      });
    });
    
    return cells;
  },

  // Generate shapes with advanced parameters
  generateShapes(grid, options, mainRandom, positionRandom) {
    const shapes = [];
    
    // Get enabled patterns
    const enabledPatterns = Object.keys(options.patterns.enabled)
      .filter(pattern => options.patterns.enabled[pattern]);
    
    if (enabledPatterns.length === 0) {
      console.warn('No patterns enabled');
      return shapes;
    }
    
    // Create weighted pattern selection
    const weightedPatterns = [];
    enabledPatterns.forEach(pattern => {
      const weight = options.patterns.weights[pattern] || 1.0;
      const count = Math.max(1, Math.floor(weight * 10));
      for (let i = 0; i < count; i++) {
        weightedPatterns.push(pattern);
      }
    });
    
    grid.forEach(cell => {
      // Apply position jitter
      let x = cell.x;
      let y = cell.y;
      
      if (options.geometry.positionJitter > 0) {
        const jitterX = (positionRandom() - 0.5) * cell.width * options.geometry.positionJitter;
        const jitterY = (positionRandom() - 0.5) * cell.height * options.geometry.positionJitter;
        x += jitterX;
        y += jitterY;
      }
      
      // Apply scale variance
      let width = cell.width;
      let height = cell.height;
      
      if (options.geometry.scaleVariance > 0) {
        const scaleMultiplier = 1 + (mainRandom() - 0.5) * options.geometry.scaleVariance;
        width *= scaleMultiplier;
        height *= scaleMultiplier;
      }
      
      // Apply aspect ratio variance
      if (options.geometry.aspectRatioVariance > 0) {
        const aspectChange = (mainRandom() - 0.5) * options.geometry.aspectRatioVariance;
        width *= (1 + aspectChange);
        height *= (1 - aspectChange);
      }
      
      // Select pattern type
      const patternType = weightedPatterns[Math.floor(mainRandom() * weightedPatterns.length)];
      
      // Select colors
      const shuffledColors = [...options.colors.palette].sort(() => mainRandom() - 0.5);
      
      // Generate rotation
      let rotation = 0;
      switch (options.geometry.rotationMode) {
        case 'discrete':
          rotation = Math.floor(mainRandom() * options.geometry.rotationSteps) * (Math.PI * 2 / options.geometry.rotationSteps);
          break;
        case 'continuous':
          rotation = mainRandom() * (options.geometry.rotationRange * Math.PI / 180);
          break;
        case 'none':
        default:
          rotation = 0;
          break;
      }
      
      shapes.push({
        x,
        y,
        width,
        height,
        rotation,
        patternType,
        colors: {
          primary: shuffledColors[0] || '#ffffff',
          secondary: shuffledColors[1] || '#000000'
        },
        cellData: cell,
        id: `shape-${cell.id}`
      });
    });
    
    return shapes;
  },

  // Render background with advanced options
  renderBackground(ctx, options) {
    const { canvas, colors } = options;
    const bg = colors.background;
    
    switch (bg.type) {
      case 'solid':
        ctx.fillStyle = bg.color;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        break;
        
      case 'gradient':
        const gradient = ctx.createLinearGradient(
          0, 0,
          bg.gradientDirection === 'horizontal' ? canvas.width : 0,
          bg.gradientDirection === 'vertical' ? canvas.height : 0
        );
        bg.gradientColors.forEach((color, index) => {
          gradient.addColorStop(index / (bg.gradientColors.length - 1), color);
        });
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        break;
        
      case 'noise':
        this.renderNoiseBackground(ctx, options);
        break;
        
      default:
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  },

  // Render a single layer
  async renderLayer(ctx, shapes, layer, options, random) {
    ctx.save();
    
    // Apply layer transformations
    ctx.globalAlpha = layer.opacity;
    ctx.globalCompositeOperation = layer.blendMode;
    
    if (layer.transform) {
      ctx.translate(layer.transform.translateX, layer.transform.translateY);
      ctx.scale(layer.transform.scale, layer.transform.scale);
      ctx.rotate(layer.transform.rotation * Math.PI / 180);
    }
    
    // Render shapes
    for (const shape of shapes) {
      this.renderShape(ctx, shape, options, random);
    }
    
    ctx.restore();
  },

  // Render individual shape with effects
  renderShape(ctx, shape, options, random) {
    ctx.save();
    
    // Translate to shape center
    ctx.translate(shape.x, shape.y);
    ctx.rotate(shape.rotation);
    
    // Apply shadows
    if (options.visual.shadows.enabled) {
      options.visual.shadows.layers.forEach(shadow => {
        ctx.save();
        ctx.shadowBlur = shadow.blur * Math.max(options.canvas.width, options.canvas.height);
        ctx.shadowColor = shadow.color;
        ctx.shadowOffsetX = shadow.offsetX;
        ctx.shadowOffsetY = shadow.offsetY;
        ctx.globalAlpha = shadow.opacity;
        
        // Draw base shape for shadow
        ctx.fillStyle = shape.colors.primary;
        ctx.fillRect(-shape.width/2, -shape.height/2, shape.width, shape.height);
        
        ctx.restore();
      });
    }
    
    // Apply glow effect
    if (options.visual.glow.enabled) {
      const glowLayers = 3;
      for (let i = 0; i < glowLayers; i++) {
        ctx.save();
        ctx.shadowBlur = options.visual.glow.spread * Math.max(options.canvas.width, options.canvas.height) * (i + 1);
        ctx.shadowColor = options.visual.glow.color;
        ctx.globalAlpha = options.visual.glow.intensity / (i + 1);
        
        ctx.fillStyle = shape.colors.primary;
        ctx.fillRect(-shape.width/2, -shape.height/2, shape.width, shape.height);
        
        ctx.restore();
      }
    }
    
    // Draw the main pattern
    patternLibrary.drawPattern(ctx, shape, options, random);
    
    // Apply borders
    if (options.visual.borders.enabled) {
      ctx.strokeStyle = options.visual.borders.color;
      ctx.lineWidth = options.visual.borders.width;
      ctx.globalAlpha = options.visual.borders.opacity;
      
      if (options.visual.borders.style === 'dashed') {
        ctx.setLineDash([5, 5]);
      } else if (options.visual.borders.style === 'dotted') {
        ctx.setLineDash([2, 3]);
      }
      
      ctx.strokeRect(-shape.width/2, -shape.height/2, shape.width, shape.height);
    }
    
    ctx.restore();
  },

  // Apply post-processing effects
  applyPostProcessing(ctx, options) {
    const { canvas, visual } = options;
    
    // Apply noise filter
    if (visual.noise.enabled) {
      this.applyNoiseFilter(ctx, canvas.width, canvas.height, visual.noise, options.randomSeed);
    }
    
    // Apply other post-processing effects
    if (visual.postProcessing) {
      this.applyImageAdjustments(ctx, canvas.width, canvas.height, visual.postProcessing);
    }
  },

  // Enhanced noise filter with different types
  applyNoiseFilter(ctx, width, height, noiseConfig, seed) {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const random = d3.randomLcg(noiseConfig.seed || seed);
    
    for (let i = 0; i < data.length; i += 4) {
      let noiseValue;
      
      switch (noiseConfig.type) {
        case 'gaussian':
          // Box-Muller transform for Gaussian noise
          noiseValue = this.gaussianRandom(random) * noiseConfig.amount;
          break;
        case 'perlin':
          // Simplified Perlin-like noise
          const x = (i / 4) % width;
          const y = Math.floor((i / 4) / width);
          noiseValue = this.perlinNoise(x * 0.01, y * 0.01, seed) * noiseConfig.amount;
          break;
        case 'uniform':
        default:
          noiseValue = (random() - 0.5) * noiseConfig.amount * 2;
          break;
      }
      
      if (noiseConfig.colorChannels === 'rgb') {
        data[i] = Math.max(0, Math.min(255, data[i] + noiseValue));     // R
        data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noiseValue)); // G
        data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noiseValue)); // B
      } else if (noiseConfig.colorChannels === 'luminance') {
        const luminanceNoise = noiseValue * 0.299; // Weight for perceived brightness
        data[i] = Math.max(0, Math.min(255, data[i] + luminanceNoise));
        data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + luminanceNoise));
        data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + luminanceNoise));
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
  },

  // Gaussian random number generator
  gaussianRandom(random) {
    let u = 0, v = 0;
    while(u === 0) u = random(); // Converting [0,1) to (0,1)
    while(v === 0) v = random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  },

  // Simplified Perlin noise
  perlinNoise(x, y, seed) {
    const random = d3.randomLcg(seed);
    const n = Math.sin(x * 12.9898 + y * 78.233 + seed) * 43758.5453;
    return n - Math.floor(n);
  },

  // Apply image adjustments (contrast, brightness, etc.)
  applyImageAdjustments(ctx, width, height, adjustments) {
    if (!adjustments) return;
    
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      // Apply brightness and contrast
      let r = data[i];
      let g = data[i + 1];
      let b = data[i + 2];
      
      // Brightness
      r = r * adjustments.brightness;
      g = g * adjustments.brightness;
      b = b * adjustments.brightness;
      
      // Contrast
      r = ((r / 255 - 0.5) * adjustments.contrast + 0.5) * 255;
      g = ((g / 255 - 0.5) * adjustments.contrast + 0.5) * 255;
      b = ((b / 255 - 0.5) * adjustments.contrast + 0.5) * 255;
      
      // Saturation (convert to HSL, adjust, convert back)
      if (adjustments.saturation !== 1.0) {
        const hsl = this.rgbToHsl(r, g, b);
        hsl[1] *= adjustments.saturation;
        const rgb = this.hslToRgb(hsl[0], hsl[1], hsl[2]);
        r = rgb[0];
        g = rgb[1];
        b = rgb[2];
      }
      
      // Gamma correction
      if (adjustments.gamma !== 1.0) {
        r = Math.pow(r / 255, 1 / adjustments.gamma) * 255;
        g = Math.pow(g / 255, 1 / adjustments.gamma) * 255;
        b = Math.pow(b / 255, 1 / adjustments.gamma) * 255;
      }
      
      // Clamp values
      data[i] = Math.max(0, Math.min(255, r));
      data[i + 1] = Math.max(0, Math.min(255, g));
      data[i + 2] = Math.max(0, Math.min(255, b));
    }
    
    ctx.putImageData(imageData, 0, 0);
  },

  // Color space conversion helpers
  rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return [h, s, l];
  },

  hslToRgb(h, s, l) {
    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }
};
