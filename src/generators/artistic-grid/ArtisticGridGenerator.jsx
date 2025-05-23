import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  loadColorPalettes, 
  createBackgroundColors, 
  getTwoColors, 
  randomInt, 
  randomChoice 
} from '../../utils/colorPalettes.js';
import { 
  createSVG, 
  addSVGStyles, 
  createRadialGradient, 
  clearSVGContainer,
  createDropShadowFilter,
  createNoiseFilter,
  downloadSVG 
} from '../../utils/svgUtils.js';
import { patternFunctions, patternDisplayNames } from './patterns.js';
import { 
  defaultConfig, 
  getRandomRows, 
  getRandomCols, 
  getRandomBigBlockSize,
  gridConstraints,
  effectConstraints,
  bigBlockConstraints,
} from './config.js';

const ArtisticGridGenerator = () => {
  const svgContainerRef = useRef(null);
  const [options, setOptions] = useState(defaultConfig);
  const [colorPalettes, setColorPalettes] = useState([]);
  const [currentPalette, setCurrentPalette] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationInfo, setGenerationInfo] = useState('');

  // Load color palettes on component mount
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

  const generateLittleBlock = useCallback((svg, i, j, squareSize, colorPalette, blockStyles) => {
    const colors = getTwoColors(colorPalette);
    
    // Filter available styles based on user selection
    const availableStyles = blockStyles.filter(style => patternFunctions[style]);
    if (availableStyles.length === 0) {
      return; // No valid styles
    }
    
    // Select a random style
    const styleName = randomChoice(availableStyles);
    const styleFunc = patternFunctions[styleName];
    
    const xPos = i * squareSize;
    const yPos = j * squareSize;
    
    // Call the appropriate drawing function
    styleFunc(svg, xPos, yPos, squareSize, colors.foreground, colors.background);
  }, []);

  const generateBigBlock = useCallback((svg, numRows, numCols, squareSize, colorPalette, blockStyles, multiplier) => {
    const colors = getTwoColors(colorPalette);
    
    // Filter available styles (exclude dots for big blocks as in Python)
    const availableStyles = blockStyles.filter(style => 
      patternFunctions[style] && style !== 'dots'
    );
    
    if (availableStyles.length === 0) {
      return; // No valid styles
    }
    
    // Random position that doesn't overflow
    const maxRow = Math.max(0, numRows - multiplier);
    const maxCol = Math.max(0, numCols - multiplier);
    
    if (maxRow < 0 || maxCol < 0) {
      return; // Grid too small for big block
    }
    
    const xPos = randomInt(0, maxRow) * squareSize;
    const yPos = randomInt(0, maxCol) * squareSize;
    
    // Calculate the big square size
    const bigSquareSize = multiplier * squareSize;
    
    // Select a random style
    const styleName = randomChoice(availableStyles);
    const styleFunc = patternFunctions[styleName];
    
    // Call the appropriate drawing function with the bigger size
    styleFunc(svg, xPos, yPos, bigSquareSize, colors.foreground, colors.background);
  }, []);

  const generateGrid = useCallback((svg, numRows, numCols, squareSize, colorPalette, blockStyles) => {
    for (let i = 0; i < numRows; i++) {
      for (let j = 0; j < numCols; j++) {
        generateLittleBlock(svg, i, j, squareSize, colorPalette, blockStyles);
      }
    }
  }, [generateLittleBlock]);

  const generateArtisticGrid = useCallback(async () => {
    const container = svgContainerRef.current;
    if (!container || colorPalettes.length === 0) return;

    setIsGenerating(true);
    
    try {
      // Clear previous content
      clearSVGContainer(container);
      
      // Set random seed if provided
      if (options.seed !== null) {
        Math.seedrandom && Math.seedrandom(options.seed);
      }
      
      // Determine grid dimensions
      const numRows = options.rows !== null ? options.rows : getRandomRows();
      const numCols = options.cols !== null ? options.cols : getRandomCols();
      
      // Get color palette
      const paletteIndex = options.paletteIndex !== null ? 
        options.paletteIndex : 
        Math.floor(Math.random() * colorPalettes.length);
      const colorPalette = colorPalettes[paletteIndex];
      setCurrentPalette(colorPalette);
      
      // Calculate SVG dimensions
      const svgWidth = numRows * options.squareSize;
      const svgHeight = numCols * options.squareSize;
      
      // Create SVG
      const svg = createSVG(svgWidth, svgHeight);
      
      // Add CSS for shape rendering
      addSVGStyles(svg, "svg * { shape-rendering: crispEdges; }");
      
      // Create background
      const bgColors = createBackgroundColors(colorPalette);
      createRadialGradient(svg, "background_gradient", bgColors.bg_inner, bgColors.bg_outer);
      
      // Add background rectangle
      const bgRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      bgRect.setAttribute("width", svgWidth);
      bgRect.setAttribute("height", svgHeight);
      bgRect.setAttribute("fill", "url(#background_gradient)");
      svg.appendChild(bgRect);
      
      // Add filters if enabled
      if (options.dropShadow) {
        createDropShadowFilter(svg, "shadow", {
          dx: options.shadowOffset,
          dy: options.shadowOffset,
          floodColor: options.shadowColor,
          floodOpacity: options.shadowOpacity
        });
      }
      
      if (options.useNoise) {
        createNoiseFilter(svg, "noise", {
          baseFrequency: options.turbulenceFrequency,
          scale: options.noiseAmount * 3
        });
      }
      
      // Create container group for all patterns
      const patternGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
      
      // Apply filters
      let filterString = "";
      if (options.dropShadow) filterString += "url(#shadow) ";
      if (options.useNoise) filterString += "url(#noise)";
      if (filterString) patternGroup.setAttribute("filter", filterString.trim());
      
      svg.appendChild(patternGroup);
      
      // Generate main grid
      generateGrid(svg, numRows, numCols, options.squareSize, colorPalette, options.blockStyles);
      
      // Add big block if enabled
      if (options.bigBlock) {
        const bigBlockSize = options.bigBlockSize !== null ? 
          options.bigBlockSize : 
          getRandomBigBlockSize();
        generateBigBlock(svg, numRows, numCols, options.squareSize, colorPalette, options.blockStyles, bigBlockSize);
      }
      
      // Add to container
      container.appendChild(svg);
      
      // Update generation info
      setGenerationInfo(`Generated ${numRows}×${numCols} grid with ${options.squareSize}px squares${options.bigBlock ? `, including big block` : ''}`);
      
    } catch (error) {
      console.error('Error generating grid:', error);
      setGenerationInfo('Error generating grid');
    } finally {
      setIsGenerating(false);
    }
  }, [options, colorPalettes, generateGrid, generateBigBlock]);

  // Generate grid when component mounts or options change
  useEffect(() => {
    if (svgContainerRef.current && colorPalettes.length > 0) {
      generateArtisticGrid();
    }
  }, [generateArtisticGrid]);

  const handleExportSVG = () => {
    const svgElement = svgContainerRef.current?.querySelector('svg');
    if (svgElement) {
      downloadSVG(svgElement, options.outputFilename);
    }
  };

  const handleRandomGenerate = () => {
    // Reset some options to null to force randomization
    setOptions(prev => ({
      ...prev,
      rows: null,
      cols: null,
      paletteIndex: null,
      bigBlockSize: null
    }));
  };

  const updateOption = (key, value) => {
    setOptions(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleBlockStyleToggle = (style) => {
    setOptions(prev => ({
      ...prev,
      blockStyles: prev.blockStyles.includes(style)
        ? prev.blockStyles.filter(s => s !== style)
        : [...prev.blockStyles, style]
    }));
  };

  return (
    <div className="max-w-6xl mx-auto p-4 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-center">Artistic Grid Generator</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Controls Panel */}
        <div className="md:col-span-1 bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Controls</h2>
          
          {/* Grid Settings */}
          <div className="mb-6">
            <h3 className="font-medium mb-2 pb-1 border-b">Grid Settings</h3>
            
            <div className="mb-3">
              <label className="block text-sm mb-1">
                Rows: {options.rows !== null ? options.rows : 'Random (4-8)'}
              </label>
              <input 
                type="range" 
                min={gridConstraints.rows.min} 
                max={gridConstraints.rows.max} 
                value={options.rows || getRandomRows()} 
                onChange={e => updateOption('rows', parseInt(e.target.value))} 
                className="w-full"
              />
              <button 
                onClick={() => updateOption('rows', null)}
                className="text-xs text-blue-600 mt-1"
              >
                Set to Random
              </button>
            </div>
            
            <div className="mb-3">
              <label className="block text-sm mb-1">
                Columns: {options.cols !== null ? options.cols : 'Random (4-8)'}
              </label>
              <input 
                type="range" 
                min={gridConstraints.cols.min} 
                max={gridConstraints.cols.max} 
                value={options.cols || getRandomCols()} 
                onChange={e => updateOption('cols', parseInt(e.target.value))} 
                className="w-full"
              />
              <button 
                onClick={() => updateOption('cols', null)}
                className="text-xs text-blue-600 mt-1"
              >
                Set to Random
              </button>
            </div>
            
            <div className="mb-3">
              <label className="block text-sm mb-1">Square Size: {options.squareSize}px</label>
              <input 
                type="range" 
                min={gridConstraints.squareSize.min} 
                max={gridConstraints.squareSize.max} 
                value={options.squareSize} 
                onChange={e => updateOption('squareSize', parseInt(e.target.value))} 
                className="w-full"
              />
            </div>
          </div>
          
          {/* Pattern Settings */}
          <div className="mb-6">
            <h3 className="font-medium mb-2 pb-1 border-b">Pattern Types</h3>
            <div className="grid grid-cols-2 gap-1 text-xs">
              {Object.keys(patternFunctions).map(style => (
                <label key={style} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={options.blockStyles.includes(style)}
                    onChange={() => handleBlockStyleToggle(style)}
                    className="mr-1"
                  />
                  <span>{patternDisplayNames[style]}</span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Big Block Settings */}
          <div className="mb-6">
            <h3 className="font-medium mb-2 pb-1 border-b">Big Block</h3>
            
            <div className="mb-3 flex items-center">
              <input 
                type="checkbox"
                id="bigBlock"
                checked={options.bigBlock}
                onChange={e => updateOption('bigBlock', e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="bigBlock" className="text-sm">Enable Big Block</label>
            </div>
            
            {options.bigBlock && (
              <div className="mb-3">
                <label className="block text-sm mb-1">
                  Size: {options.bigBlockSize !== null ? `${options.bigBlockSize}x` : 'Random (2-3x)'}
                </label>
                <input 
                  type="range" 
                  min={bigBlockConstraints.size.min} 
                  max={bigBlockConstraints.size.max} 
                  value={options.bigBlockSize || getRandomBigBlockSize()} 
                  onChange={e => updateOption('bigBlockSize', parseInt(e.target.value))} 
                  className="w-full"
                />
                <button 
                  onClick={() => updateOption('bigBlockSize', null)}
                  className="text-xs text-blue-600 mt-1"
                >
                  Set to Random
                </button>
              </div>
            )}
          </div>
          
          {/* Effects */}
          <div className="mb-6">
            <h3 className="font-medium mb-2 pb-1 border-b">Effects</h3>
            
            <div className="mb-3 flex items-center">
              <input 
                type="checkbox"
                id="dropShadow"
                checked={options.dropShadow}
                onChange={e => updateOption('dropShadow', e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="dropShadow" className="text-sm">Drop Shadow</label>
            </div>
            
            {options.dropShadow && (
              <div className="mb-3 ml-4">
                <label className="block text-sm mb-1">Offset: {options.shadowOffset}px</label>
                <input 
                  type="range" 
                  min={effectConstraints.shadowOffset.min} 
                  max={effectConstraints.shadowOffset.max} 
                  value={options.shadowOffset} 
                  onChange={e => updateOption('shadowOffset', parseInt(e.target.value))} 
                  className="w-full"
                />
                
                <label className="block text-sm mb-1 mt-2">Opacity: {options.shadowOpacity.toFixed(1)}</label>
                <input 
                  type="range" 
                  min={effectConstraints.shadowOpacity.min} 
                  max={effectConstraints.shadowOpacity.max} 
                  step={effectConstraints.shadowOpacity.step}
                  value={options.shadowOpacity} 
                  onChange={e => updateOption('shadowOpacity', parseFloat(e.target.value))} 
                  className="w-full"
                />
              </div>
            )}
            
            <div className="mb-3 flex items-center">
              <input 
                type="checkbox"
                id="useNoise"
                checked={options.useNoise}
                onChange={e => updateOption('useNoise', e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="useNoise" className="text-sm">Noise Effect</label>
            </div>
            
            {options.useNoise && (
              <div className="mb-3 ml-4">
                <label className="block text-sm mb-1">Amount: {options.noiseAmount.toFixed(1)}</label>
                <input 
                  type="range" 
                  min={effectConstraints.noiseAmount.min} 
                  max={effectConstraints.noiseAmount.max} 
                  step={effectConstraints.noiseAmount.step}
                  value={options.noiseAmount} 
                  onChange={e => updateOption('noiseAmount', parseFloat(e.target.value))} 
                  className="w-full"
                />
                
                <label className="block text-sm mb-1 mt-2">Frequency: {options.turbulenceFrequency.toFixed(3)}</label>
                <input 
                  type="range" 
                  min={effectConstraints.turbulenceFrequency.min} 
                  max={effectConstraints.turbulenceFrequency.max} 
                  step={effectConstraints.turbulenceFrequency.step}
                  value={options.turbulenceFrequency} 
                  onChange={e => updateOption('turbulenceFrequency', parseFloat(e.target.value))} 
                  className="w-full"
                />
              </div>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-2">
            <button 
              onClick={handleRandomGenerate} 
              disabled={isGenerating}
              className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white py-2 px-4 rounded transition-colors"
            >
              {isGenerating ? 'Generating...' : 'Random Generate'}
            </button>
            <button 
              onClick={handleExportSVG} 
              disabled={isGenerating}
              className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white py-2 px-4 rounded transition-colors"
            >
              Export SVG
            </button>
          </div>
        </div>
        
        {/* Preview Panel */}
        <div className="md:col-span-2">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Preview</h2>
            <div 
              ref={svgContainerRef} 
              className="flex justify-center items-center border border-gray-200 rounded-lg overflow-auto"
              style={{ minHeight: '500px' }}
            >
              {isGenerating && (
                <div className="text-gray-500">Generating artwork...</div>
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
              <p><strong>About this Generator:</strong></p>
              <p className="mt-2">Creates artistic grid patterns with geometric shapes based on the original Python SVG_ArtGrid.py script. Features include:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>8 different pattern types: circles, crosses, diagonal squares, quarter circles, dots, letters, and more</li>
                <li>Dynamic color palettes from the nice-color-palettes collection</li>
                <li>Optional big blocks for focal points</li>
                <li>Visual effects like drop shadows and noise</li>
                <li>Customizable grid dimensions and square sizes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtisticGridGenerator;
