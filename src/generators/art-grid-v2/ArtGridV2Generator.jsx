import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  loadColorPalettes, 
  createBackgroundColors, 
  getTwoColors, 
  randomChoice 
} from '../../utils/colorPalettes.js';
import { 
  downloadSVG 
} from '../../utils/svgUtils.js';
import { GridGeometries, getPatternForGrid } from './utils/gridGeometries.js';

// V2 specific configurations with all grid types enabled
const gridTypes = {
  rectangular: 'Rectangular',
  hexagonal: 'Hexagonal',
  triangular: 'Triangular',
  voronoi: 'Voronoi',
  radial: 'Radial',
  irregular: 'Irregular'
};

const effectPresets = {
  minimal: { shadows: false, noise: false, brightness: 1.0 },
  classic: { shadows: true, noise: false, brightness: 1.0 },
  modern: { shadows: true, noise: true, brightness: 1.1 },
  dramatic: { shadows: true, noise: true, brightness: 0.9 }
};

// React-safe pattern components
const PatternComponents = {
  circle: ({ x, y, size, color, bgColor }) => (
    <circle
      cx={x + size/2}
      cy={y + size/2}
      r={size * 0.4}
      fill={color}
      stroke={bgColor}
      strokeWidth={2}
    />
  ),

  square: ({ x, y, size, color, bgColor }) => (
    <rect
      x={x + size * 0.1}
      y={y + size * 0.1}
      width={size * 0.8}
      height={size * 0.8}
      fill={color}
      stroke={bgColor}
      strokeWidth={2}
    />
  ),

  triangle: ({ x, y, size, color, bgColor }) => {
    const points = [
      [x + size/2, y + size * 0.1],
      [x + size * 0.1, y + size * 0.9],
      [x + size * 0.9, y + size * 0.9]
    ].map(p => p.join(',')).join(' ');
    
    return (
      <polygon
        points={points}
        fill={color}
        stroke={bgColor}
        strokeWidth={2}
      />
    );
  },

  diamond: ({ x, y, size, color, bgColor }) => {
    const points = [
      [x + size/2, y + size * 0.1],
      [x + size * 0.9, y + size/2],
      [x + size/2, y + size * 0.9],
      [x + size * 0.1, y + size/2]
    ].map(p => p.join(',')).join(' ');
    
    return (
      <polygon
        points={points}
        fill={color}
        stroke={bgColor}
        strokeWidth={2}
      />
    );
  },

  cross: ({ x, y, size, color, bgColor }) => (
    <g>
      <rect
        x={x + size * 0.4}
        y={y + size * 0.1}
        width={size * 0.2}
        height={size * 0.8}
        fill={color}
        stroke={bgColor}
        strokeWidth={1}
      />
      <rect
        x={x + size * 0.1}
        y={y + size * 0.4}
        width={size * 0.8}
        height={size * 0.2}
        fill={color}
        stroke={bgColor}
        strokeWidth={1}
      />
    </g>
  ),

  star: ({ x, y, size, color, bgColor }) => {
    const cx = x + size/2;
    const cy = y + size/2;
    const r1 = size * 0.15;
    const r2 = size * 0.35;
    const points = [];
    
    for (let i = 0; i < 10; i++) {
      const angle = (i * Math.PI) / 5;
      const r = i % 2 === 0 ? r2 : r1;
      const px = cx + r * Math.cos(angle - Math.PI/2);
      const py = cy + r * Math.sin(angle - Math.PI/2);
      points.push(`${px},${py}`);
    }
    
    return (
      <polygon
        points={points.join(' ')}
        fill={color}
        stroke={bgColor}
        strokeWidth={2}
      />
    );
  },

  hexagon: ({ x, y, size, color, bgColor }) => {
    const cx = x + size/2;
    const cy = y + size/2;
    const r = size * 0.35;
    const points = [];
    
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      const px = cx + r * Math.cos(angle);
      const py = cy + r * Math.sin(angle);
      points.push(`${px},${py}`);
    }
    
    return (
      <polygon
        points={points.join(' ')}
        fill={color}
        stroke={bgColor}
        strokeWidth={2}
      />
    );
  },

  gradient: ({ x, y, size, color, bgColor, id }) => (
    <g>
      <defs>
        <radialGradient id={`grad-${id}`}>
          <stop offset="0%" stopColor={color} />
          <stop offset="100%" stopColor={bgColor} />
        </radialGradient>
      </defs>
      <circle
        cx={x + size/2}
        cy={y + size/2}
        r={size * 0.4}
        fill={`url(#grad-${id})`}
      />
    </g>
  )
};

const patternNames = Object.keys(PatternComponents);
const patternDisplayNames = {
  circle: 'Circle',
  square: 'Square', 
  triangle: 'Triangle',
  diamond: 'Diamond',
  cross: 'Cross',
  star: 'Star',
  hexagon: 'Hexagon',
  gradient: 'Gradient'
};

const ArtGridV2Generator = () => {
  const svgRef = useRef(null);
  const [options, setOptions] = useState({
    rows: 6,
    cols: 6,
    squareSize: 80,
    gridType: 'rectangular',
    effectPreset: 'classic',
    patterns: ['circle', 'square', 'triangle', 'diamond'],
    bigBlock: true,
    bigBlockSize: 2,
    colorSaturation: 1.0,
    colorBrightness: 1.0,
    seed: null,
    paletteIndex: null
  });
  
  const [colorPalettes, setColorPalettes] = useState([]);
  const [currentPalette, setCurrentPalette] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationInfo, setGenerationInfo] = useState('');
  const [svgElements, setSvgElements] = useState([]);

  // Load color palettes
  useEffect(() => {
    const loadPalettes = async () => {
      const palettes = await loadColorPalettes();
      setColorPalettes(palettes);
      if (palettes.length > 0) {
        const randomIndex = Math.floor(Math.random() * palettes.length);
        setCurrentPalette(palettes[randomIndex]);
      }
    };
    loadPalettes();
  }, []);

  // Generate grid patterns using advanced geometries
  const generateGrid = useCallback(() => {
    if (colorPalettes.length === 0 || !GridGeometries) return;
    
    setIsGenerating(true);
    
    try {
      // Set random seed if provided
      if (options.seed !== null) {
        Math.seedrandom && Math.seedrandom(options.seed);
      }
      
      // Get color palette
      const paletteIndex = options.paletteIndex !== null ? 
        options.paletteIndex : 
        Math.floor(Math.random() * colorPalettes.length);
      const palette = colorPalettes[paletteIndex];
      setCurrentPalette(palette);
      
      // Get grid geometry
      const gridGeometry = GridGeometries[options.gridType];
      if (!gridGeometry) {
        console.warn(`Grid type ${options.gridType} not supported, falling back to rectangular`);
        // Fallback to rectangular grid generation
        const elements = [];
        let elementId = 0;
        
        for (let i = 0; i < options.rows; i++) {
          for (let j = 0; j < options.cols; j++) {
            const x = i * options.squareSize;
            const y = j * options.squareSize;
            const colors = getTwoColors(palette);
            const pattern = randomChoice(options.patterns);
            const PatternComponent = PatternComponents[pattern];
            
            if (PatternComponent) {
              elements.push({
                id: elementId++,
                component: PatternComponent,
                props: {
                  x,
                  y,
                  size: options.squareSize,
                  color: colors.foreground,
                  bgColor: colors.background,
                  id: elementId
                },
                isBig: false
              });
            }
          }
        }
        
        setSvgElements(elements);
        setGenerationInfo(`Generated ${options.rows}×${options.cols} V2 grid (fallback) with ${options.patterns.length} pattern types`);
        return;
      }
      
      // Generate positions using the selected geometry
      const positions = gridGeometry.generatePositions(options.rows, options.cols, options.squareSize);
      
      const elements = [];
      let elementId = 0;
      
      // Generate pattern for each position
      positions.forEach((position) => {
        const colors = getTwoColors(palette);
        let pattern = randomChoice(options.patterns);
        
        // Adapt pattern for grid type
        pattern = getPatternForGrid(options.gridType, pattern, position);
        const PatternComponent = PatternComponents[pattern];
        
        if (PatternComponent) {
          elements.push({
            id: elementId++,
            component: PatternComponent,
            props: {
              x: position.x,
              y: position.y,
              size: position.size,
              color: colors.foreground,
              bgColor: colors.background,
              id: elementId
            },
            position: position,
            isBig: false
          });
        }
      });
      
      // Add big block if enabled (only for rectangular grids for now)
      if (options.bigBlock && options.bigBlockSize > 1 && options.gridType === 'rectangular') {
        const maxI = Math.max(0, options.rows - options.bigBlockSize);
        const maxJ = Math.max(0, options.cols - options.bigBlockSize);
        
        if (maxI >= 0 && maxJ >= 0) {
          const bigI = Math.floor(Math.random() * (maxI + 1));
          const bigJ = Math.floor(Math.random() * (maxJ + 1));
          const x = bigI * options.squareSize;
          const y = bigJ * options.squareSize;
          const bigSize = options.squareSize * options.bigBlockSize;
          const colors = getTwoColors(palette);
          const availablePatterns = options.patterns.filter(p => p !== 'gradient');
          const pattern = randomChoice(availablePatterns.length > 0 ? availablePatterns : ['circle']);
          const PatternComponent = PatternComponents[pattern];
          
          if (PatternComponent) {
            elements.push({
              id: elementId++,
              component: PatternComponent,
              props: {
                x,
                y,
                size: bigSize,
                color: colors.foreground,
                bgColor: colors.background,
                id: elementId
              },
              isBig: true
            });
          }
        }
      }
      
      setSvgElements(elements);
      setGenerationInfo(`Generated ${gridTypes[options.gridType]} grid (${positions.length} cells) with ${options.patterns.length} pattern types`);
      
    } catch (error) {
      console.error('Error generating V2 grid:', error);
      setGenerationInfo('Error generating grid');
    } finally {
      setIsGenerating(false);
    }
  }, [options, colorPalettes]);

  // Generate when options change
  useEffect(() => {
    generateGrid();
  }, [generateGrid]);

  const handleExport = () => {
    if (svgRef.current) {
      downloadSVG(svgRef.current, 'art-grid-v2.svg');
    }
  };

  const handleRandomGenerate = () => {
    setOptions(prev => ({
      ...prev,
      seed: Math.random() * 10000,
      paletteIndex: null
    }));
  };

  const updateOption = (key, value) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  const togglePattern = (pattern) => {
    setOptions(prev => ({
      ...prev,
      patterns: prev.patterns.includes(pattern)
        ? prev.patterns.filter(p => p !== pattern)
        : [...prev.patterns, pattern]
    }));
  };

  // Calculate SVG dimensions using grid geometry
  let svgWidth = options.rows * options.squareSize;
  let svgHeight = options.cols * options.squareSize;
  
  if (GridGeometries && GridGeometries[options.gridType]) {
    const dimensions = GridGeometries[options.gridType].getDimensions(options.rows, options.cols, options.squareSize);
    svgWidth = dimensions.width;
    svgHeight = dimensions.height;
  }
  
  // Apply effect preset
  const preset = effectPresets[options.effectPreset];

  return (
    <div className="max-w-6xl mx-auto p-4 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Art Grid V2 Generator
      </h1>
      
      {/* V2 Banner */}
      <div className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
        <div className="flex items-center gap-3">
          <div className="text-2xl">🚀</div>
          <div>
            <h3 className="font-semibold text-blue-800">Art Grid V2 - Advanced Edition</h3>
            <p className="text-sm text-blue-600 mt-1">
              All grid types now available! Hexagonal, Triangular, Voronoi, Radial, and Irregular grids
            </p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="md:col-span-1 bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">V2 Controls</h2>
          
          {/* Grid Type - ALL ENABLED */}
          <div className="mb-6">
            <h3 className="font-medium mb-2 pb-1 border-b">Grid Type ✨</h3>
            <select
              value={options.gridType}
              onChange={e => updateOption('gridType', e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              {Object.entries(gridTypes).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
            <p className="text-xs text-green-600 mt-1">✅ All grid types enabled!</p>
          </div>

          {/* Effect Presets */}
          <div className="mb-6">
            <h3 className="font-medium mb-2 pb-1 border-b">Effect Preset</h3>
            <select
              value={options.effectPreset}
              onChange={e => updateOption('effectPreset', e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              {Object.entries(effectPresets).map(([key]) => (
                <option key={key} value={key}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </option>
              ))}
            </select>
          </div>
          
          {/* Grid Settings */}
          <div className="mb-6">
            <h3 className="font-medium mb-2 pb-1 border-b">Grid Settings</h3>
            
            <div className="mb-3">
              <label className="block text-sm mb-1">Rows: {options.rows}</label>
              <input 
                type="range" 
                min="3" 
                max="12" 
                value={options.rows} 
                onChange={e => updateOption('rows', parseInt(e.target.value))} 
                className="w-full"
              />
            </div>
            
            <div className="mb-3">
              <label className="block text-sm mb-1">Columns: {options.cols}</label>
              <input 
                type="range" 
                min="3" 
                max="12" 
                value={options.cols} 
                onChange={e => updateOption('cols', parseInt(e.target.value))} 
                className="w-full"
              />
            </div>
            
            <div className="mb-3">
              <label className="block text-sm mb-1">Cell Size: {options.squareSize}px</label>
              <input 
                type="range" 
                min="40" 
                max="120" 
                value={options.squareSize} 
                onChange={e => updateOption('squareSize', parseInt(e.target.value))} 
                className="w-full"
              />
            </div>
          </div>
          
          {/* Patterns */}
          <div className="mb-6">
            <h3 className="font-medium mb-2 pb-1 border-b">V2 Patterns</h3>
            <div className="grid grid-cols-2 gap-1 text-xs">
              {patternNames.map(pattern => (
                <label key={pattern} className="flex items-center p-1 hover:bg-gray-50 rounded">
                  <input
                    type="checkbox"
                    checked={options.patterns.includes(pattern)}
                    onChange={() => togglePattern(pattern)}
                    className="mr-2"
                  />
                  <span>{patternDisplayNames[pattern]}</span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Big Block */}
          <div className="mb-6">
            <h3 className="font-medium mb-2 pb-1 border-b">Big Block</h3>
            
            <div className="mb-3 flex items-center">
              <input 
                type="checkbox"
                checked={options.bigBlock}
                onChange={e => updateOption('bigBlock', e.target.checked)}
                className="mr-2"
              />
              <label className="text-sm">Enable Big Block</label>
            </div>
            
            {options.bigBlock && (
              <div className="mb-3">
                <label className="block text-sm mb-1">Size: {options.bigBlockSize}x</label>
                <input 
                  type="range" 
                  min="2" 
                  max="4" 
                  value={options.bigBlockSize} 
                  onChange={e => updateOption('bigBlockSize', parseInt(e.target.value))} 
                  className="w-full"
                />
              </div>
            )}
          </div>
          
          {/* V2 Features */}
          <div className="mb-6">
            <h3 className="font-medium mb-2 pb-1 border-b">V2 Features</h3>
            
            <div className="mb-3">
              <label className="block text-sm mb-1">
                Color Saturation: {options.colorSaturation.toFixed(1)}
              </label>
              <input 
                type="range" 
                min="0.5" 
                max="2.0" 
                step="0.1"
                value={options.colorSaturation} 
                onChange={e => updateOption('colorSaturation', parseFloat(e.target.value))} 
                className="w-full"
              />
            </div>
            
            <div className="mb-3">
              <label className="block text-sm mb-1">
                Color Brightness: {options.colorBrightness.toFixed(1)}
              </label>
              <input 
                type="range" 
                min="0.5" 
                max="2.0" 
                step="0.1"
                value={options.colorBrightness} 
                onChange={e => updateOption('colorBrightness', parseFloat(e.target.value))} 
                className="w-full"
              />
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex gap-2">
            <button 
              onClick={handleRandomGenerate} 
              disabled={isGenerating}
              className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white py-2 px-4 rounded transition-colors"
            >
              {isGenerating ? 'Generating...' : 'Random'}
            </button>
            <button 
              onClick={handleExport} 
              disabled={isGenerating}
              className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white py-2 px-4 rounded transition-colors"
            >
              Export
            </button>
          </div>
        </div>
        
        {/* Preview */}
        <div className="md:col-span-2">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">V2 Preview</h2>
            
            <div className="flex justify-center items-center border border-gray-200 rounded-lg overflow-auto"
                 style={{ minHeight: '500px' }}>
              {isGenerating ? (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <div className="text-gray-500">Generating V2 artwork...</div>
                </div>
              ) : (
                <svg
                  ref={svgRef}
                  width={svgWidth}
                  height={svgHeight}
                  viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                  style={{
                    filter: preset.shadows ? 'drop-shadow(3px 3px 6px rgba(0,0,0,0.3))' : 'none',
                    opacity: preset.brightness
                  }}
                >
                  {/* Background gradient */}
                  <defs>
                    {currentPalette.length > 0 && (
                      <radialGradient id="bg-gradient">
                        <stop offset="0%" stopColor={currentPalette[0]} stopOpacity="0.1" />
                        <stop offset="100%" stopColor={currentPalette[1] || currentPalette[0]} stopOpacity="0.05" />
                      </radialGradient>
                    )}
                  </defs>
                  
                  <rect 
                    width={svgWidth} 
                    height={svgHeight} 
                    fill="url(#bg-gradient)" 
                  />
                  
                  {/* Pattern elements */}
                  {svgElements.map(({ id, component: Component, props, isBig }) => (
                    <Component key={id} {...props} />
                  ))}
                  
                  {/* Noise effect overlay */}
                  {preset.noise && (
                    <rect 
                      width={svgWidth} 
                      height={svgHeight} 
                      fill="none"
                      style={{
                        filter: 'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGZpbHRlciBpZD0ibm9pc2UiPjxmZVR1cmJ1bGVuY2UgYmFzZUZyZXF1ZW5jeT0iMC45IiBudW1PY3RhdmVzPSI0IiBzZWVkPSIyIiByZXN1bHQ9Im5vaXNlIi8+PGZlQ29sb3JNYXRyaXggaW49Im5vaXNlIiB0eXBlPSJzYXR1cmF0ZSIgdmFsdWVzPSIwIi8+PC9maWx0ZXI+PC9zdmc+)'
                      }}
                    />
                  )}
                </svg>
              )}
            </div>
            
            {generationInfo && (
              <div className="mt-4 text-sm text-gray-600">
                <p>{generationInfo}</p>
                {currentPalette.length > 0 && (
                  <div className="mt-2">
                    <span>Current palette: </span>
                    <div className="inline-flex gap-1 ml-2">
                      {currentPalette.map((color, index) => (
                        <div 
                          key={index}
                          className="w-4 h-4 border border-gray-300 rounded"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <div className="mt-4 text-sm">
              <p><strong>About Art Grid V2 - Advanced Edition:</strong></p>
              <p className="mt-2">
                Complete implementation with all advanced grid geometries now enabled:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li><strong>Hexagonal:</strong> Honeycomb tessellation patterns</li>
                <li><strong>Triangular:</strong> Triangular tessellation grids</li>
                <li><strong>Voronoi:</strong> Organic cell-like structures</li>
                <li><strong>Radial:</strong> Circular/polar coordinate systems</li>
                <li><strong>Irregular:</strong> Poisson disk sampling distributions</li>
                <li>8 geometric pattern types with React components</li>
                <li>Effect presets and advanced color controls</li>
                <li>Pattern adaptation for different grid types</li>
              </ul>
              <div className="mt-3 p-2 bg-blue-50 rounded">
                <p className="text-blue-800 text-xs">
                  <strong>🎉 V2 Complete!</strong> All "Coming Soon" features have been implemented! 
                  Try different grid types to see the advanced geometries in action.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtGridV2Generator;
