import React, { useEffect, useRef, useState } from 'react';

const BalancedCircuitGenerator = () => {
  const svgContainerRef = useRef(null);
  const [options, setOptions] = useState({
    // Basic settings
    panelType: 'center', // focusing on the blue/red/white/black/yellow variant
    gridSize: 20,
    padding: 30,
    
    // Pattern settings
    lineThickness: 2,
    
    // Shape settings
    minShapeSize: 2,
    maxShapeSize: 8,
    shapeDensity: 0.8,
    
    // Color balance settings - key improvement
    whiteWeight: 0.15,     // Much less white
    blueWeight: 0.25,      // Primary color
    redWeight: 0.25,       // Primary color  
    blackWeight: 0.20,     // Strong accent
    yellowWeight: 0.15,    // Accent color
    
    // Layout settings
    largeShapesProbability: 0.3,
    mediumShapesProbability: 0.4,
    smallShapesProbability: 0.3
  });
  
  // Balanced color scheme based on the thumbnail
  const colorScheme = {
    background: '#1e40af', // blue background
    colors: [
      '#ffffff', // white - reduced usage
      '#ef4444', // red
      '#1e40af', // blue  
      '#000000', // black
      '#eab308'  // yellow
    ]
  };
  
  useEffect(() => {
    generateBalancedPattern();
  }, [options]);
  
  const generateBalancedPattern = () => {
    const container = svgContainerRef.current;
    if (!container) return;
    
    container.innerHTML = '';
    
    const canvasSize = 600;
    const cellSize = (canvasSize - (2 * options.padding)) / options.gridSize;
    
    // Create SVG
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", canvasSize);
    svg.setAttribute("height", canvasSize);
    svg.setAttribute("viewBox", `0 0 ${canvasSize} ${canvasSize}`);
    
    // Background
    const background = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    background.setAttribute("width", canvasSize);
    background.setAttribute("height", canvasSize);
    background.setAttribute("fill", colorScheme.background);
    svg.appendChild(background);
    
    // Grid for tracking
    const grid = Array(options.gridSize).fill().map(() => Array(options.gridSize).fill(false));
    
    // Generate shapes with balanced color distribution
    generateBalancedShapes(svg, grid, cellSize);
    
    container.appendChild(svg);
  };
  
  const generateBalancedShapes = (svg, grid, cellSize) => {
    const shapesGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    
    // Create weighted color array based on the weights
    const weightedColors = [];
    const weights = [
      options.whiteWeight,
      options.redWeight, 
      options.blueWeight,
      options.blackWeight,
      options.yellowWeight
    ];
    
    // Build weighted array
    weights.forEach((weight, index) => {
      const count = Math.floor(weight * 100);
      for (let i = 0; i < count; i++) {
        weightedColors.push(colorScheme.colors[index]);
      }
    });
    
    // Generate large shapes first (like the reference image)
    const numLargeShapes = Math.floor(options.gridSize * options.largeShapesProbability);
    
    for (let i = 0; i < numLargeShapes; i++) {
      const width = Math.floor(Math.random() * (options.maxShapeSize - 4)) + 4;
      const height = Math.floor(Math.random() * (options.maxShapeSize - 4)) + 4;
      
      if (placeShape(svg, grid, cellSize, width, height, weightedColors, 'large')) {
        // Successfully placed
      }
    }
    
    // Generate medium shapes
    const numMediumShapes = Math.floor(options.gridSize * options.mediumShapesProbability);
    
    for (let i = 0; i < numMediumShapes; i++) {
      const width = Math.floor(Math.random() * 4) + 2;
      const height = Math.floor(Math.random() * 4) + 2;
      
      placeShape(svg, grid, cellSize, width, height, weightedColors, 'medium');
    }
    
    // Fill remaining space with small shapes
    const numSmallShapes = Math.floor(options.gridSize * options.gridSize * options.smallShapesProbability);
    
    for (let i = 0; i < numSmallShapes; i++) {
      const width = Math.floor(Math.random() * 2) + 1;
      const height = Math.floor(Math.random() * 2) + 1;
      
      placeShape(svg, grid, cellSize, width, height, weightedColors, 'small');
    }
    
    svg.appendChild(shapesGroup);
  };
  
  const placeShape = (svg, grid, cellSize, width, height, weightedColors, shapeType) => {
    let attempts = 0;
    const maxAttempts = 50;
    
    while (attempts < maxAttempts) {
      attempts++;
      
      const x = Math.floor(Math.random() * (options.gridSize - width));
      const y = Math.floor(Math.random() * (options.gridSize - height));
      
      // Check if area is available
      let areaAvailable = true;
      for (let dy = 0; dy < height && areaAvailable; dy++) {
        for (let dx = 0; dx < width && areaAvailable; dx++) {
          if (grid[y + dy] && grid[y + dy][x + dx]) {
            areaAvailable = false;
          }
        }
      }
      
      if (areaAvailable) {
        // Mark area as occupied
        for (let dy = 0; dy < height; dy++) {
          for (let dx = 0; dx < width; dx++) {
            if (grid[y + dy]) {
              grid[y + dy][x + dx] = true;
            }
          }
        }
        
        // Choose color from weighted array
        const color = weightedColors[Math.floor(Math.random() * weightedColors.length)];
        
        // Create the shape - mix of rectangles and jagged shapes like the reference
        let shape;
        
        if (shapeType === 'large' && Math.random() > 0.3) {
          // Create jagged shape for larger pieces (like in the reference)
          shape = createJaggedShape(x, y, width, height, cellSize, color);
        } else {
          // Create regular rectangle
          shape = document.createElementNS("http://www.w3.org/2000/svg", "rect");
          shape.setAttribute("x", x * cellSize + options.padding);
          shape.setAttribute("y", y * cellSize + options.padding);
          shape.setAttribute("width", width * cellSize);
          shape.setAttribute("height", height * cellSize);
          shape.setAttribute("fill", color);
          
          // Add black stroke to separate shapes (like in reference)
          shape.setAttribute("stroke", "#000000");
          shape.setAttribute("stroke-width", options.lineThickness);
        }
        
        svg.appendChild(shape);
        return true;
      }
    }
    return false;
  };
  
  const createJaggedShape = (x, y, width, height, cellSize, color) => {
    const pixelX = x * cellSize + options.padding;
    const pixelY = y * cellSize + options.padding;
    const pixelWidth = width * cellSize;
    const pixelHeight = height * cellSize;
    
    // Create more angular, circuit-like jagged edges
    let pathData = `M ${pixelX} ${pixelY}`;
    
    // Top edge with steps
    const topSteps = Math.floor(width / 2) + 1;
    for (let i = 1; i < topSteps; i++) {
      const xPos = pixelX + (pixelWidth * i / topSteps);
      const yOffset = Math.random() > 0.6 ? -cellSize/2 : 0;
      pathData += ` L ${xPos} ${pixelY + yOffset}`;
    }
    pathData += ` L ${pixelX + pixelWidth} ${pixelY}`;
    
    // Right edge
    const rightSteps = Math.floor(height / 2) + 1;
    for (let i = 1; i < rightSteps; i++) {
      const yPos = pixelY + (pixelHeight * i / rightSteps);
      const xOffset = Math.random() > 0.6 ? cellSize/2 : 0;
      pathData += ` L ${pixelX + pixelWidth + xOffset} ${yPos}`;
    }
    pathData += ` L ${pixelX + pixelWidth} ${pixelY + pixelHeight}`;
    
    // Bottom edge
    for (let i = 1; i < topSteps; i++) {
      const xPos = pixelX + pixelWidth - (pixelWidth * i / topSteps);
      const yOffset = Math.random() > 0.6 ? cellSize/2 : 0;
      pathData += ` L ${xPos} ${pixelY + pixelHeight + yOffset}`;
    }
    pathData += ` L ${pixelX} ${pixelY + pixelHeight}`;
    
    // Left edge
    for (let i = 1; i < rightSteps; i++) {
      const yPos = pixelY + pixelHeight - (pixelHeight * i / rightSteps);
      const xOffset = Math.random() > 0.6 ? -cellSize/2 : 0;
      pathData += ` L ${pixelX + xOffset} ${yPos}`;
    }
    pathData += ` Z`;
    
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", pathData);
    path.setAttribute("fill", color);
    path.setAttribute("stroke", "#000000");
    path.setAttribute("stroke-width", options.lineThickness);
    
    return path;
  };
  
  const exportSVG = () => {
    if (!svgContainerRef.current) return;
    
    // Get the SVG element
    const svgElement = svgContainerRef.current.querySelector('svg');
    if (!svgElement) return;
    
    // Use XMLSerializer to properly serialize the SVG
    const serializer = new XMLSerializer();
    let svgData = serializer.serializeToString(svgElement);
    
    // Add XML declaration and ensure proper namespaces
    const xmlDeclaration = '<?xml version="1.0" encoding="UTF-8"?>\n';
    
    // Ensure the SVG has proper namespace if it's missing
    if (!svgData.includes('xmlns="http://www.w3.org/2000/svg"')) {
      svgData = svgData.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    
    // Combine declaration with SVG data
    const completeData = xmlDeclaration + svgData;
    
    const blob = new Blob([completeData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'balanced-circuit-pattern.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  // Preset configurations for different balances
  const applyPreset = (presetName) => {
    const presets = {
      balanced: {
        whiteWeight: 0.15,
        blueWeight: 0.25,
        redWeight: 0.25,
        blackWeight: 0.20,
        yellowWeight: 0.15
      },
      redDominant: {
        whiteWeight: 0.10,
        blueWeight: 0.20,
        redWeight: 0.40,
        blackWeight: 0.20,
        yellowWeight: 0.10
      },
      blueDominant: {
        whiteWeight: 0.10,
        blueWeight: 0.40,
        redWeight: 0.20,
        blackWeight: 0.20,
        yellowWeight: 0.10
      },
      minimal: {
        whiteWeight: 0.30,
        blueWeight: 0.30,
        redWeight: 0.15,
        blackWeight: 0.15,
        yellowWeight: 0.10
      }
    };
    
    setOptions({...options, ...presets[presetName]});
  };
  
  return (
    <div className="max-w-6xl mx-auto p-4 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-center">Balanced Circuit Pattern Generator</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Controls Panel */}
        <div className="md:col-span-1 bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Controls</h2>
          
          {/* Color Presets */}
          <div className="mb-6">
            <h3 className="font-medium mb-2 pb-1 border-b">Color Balance Presets</h3>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => applyPreset('balanced')}
                className="px-3 py-2 bg-blue-100 hover:bg-blue-200 rounded text-sm"
              >
                Balanced
              </button>
              <button 
                onClick={() => applyPreset('redDominant')}
                className="px-3 py-2 bg-red-100 hover:bg-red-200 rounded text-sm"
              >
                Red Focus
              </button>
              <button 
                onClick={() => applyPreset('blueDominant')}
                className="px-3 py-2 bg-blue-100 hover:bg-blue-200 rounded text-sm"
              >
                Blue Focus
              </button>
              <button 
                onClick={() => applyPreset('minimal')}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm"
              >
                Minimal
              </button>
            </div>
          </div>
          
          {/* Color Weight Controls */}
          <div className="mb-6">
            <h3 className="font-medium mb-2 pb-1 border-b">Color Distribution</h3>
            
            <div className="mb-3">
              <div className="flex items-center mb-1">
                <div className="w-4 h-4 bg-white border border-gray-300 mr-2"></div>
                <label className="block text-sm">White: {(options.whiteWeight * 100).toFixed(0)}%</label>
              </div>
              <input 
                type="range" 
                min="0.05" 
                max="0.4" 
                step="0.05"
                value={options.whiteWeight} 
                onChange={e => setOptions({...options, whiteWeight: parseFloat(e.target.value)})} 
                className="w-full"
              />
            </div>
            
            <div className="mb-3">
              <div className="flex items-center mb-1">
                <div className="w-4 h-4 bg-red-500 mr-2"></div>
                <label className="block text-sm">Red: {(options.redWeight * 100).toFixed(0)}%</label>
              </div>
              <input 
                type="range" 
                min="0.1" 
                max="0.5" 
                step="0.05"
                value={options.redWeight} 
                onChange={e => setOptions({...options, redWeight: parseFloat(e.target.value)})} 
                className="w-full"
              />
            </div>
            
            <div className="mb-3">
              <div className="flex items-center mb-1">
                <div className="w-4 h-4 bg-blue-600 mr-2"></div>
                <label className="block text-sm">Blue: {(options.blueWeight * 100).toFixed(0)}%</label>
              </div>
              <input 
                type="range" 
                min="0.1" 
                max="0.5" 
                step="0.05"
                value={options.blueWeight} 
                onChange={e => setOptions({...options, blueWeight: parseFloat(e.target.value)})} 
                className="w-full"
              />
            </div>
            
            <div className="mb-3">
              <div className="flex items-center mb-1">
                <div className="w-4 h-4 bg-black mr-2"></div>
                <label className="block text-sm">Black: {(options.blackWeight * 100).toFixed(0)}%</label>
              </div>
              <input 
                type="range" 
                min="0.1" 
                max="0.4" 
                step="0.05"
                value={options.blackWeight} 
                onChange={e => setOptions({...options, blackWeight: parseFloat(e.target.value)})} 
                className="w-full"
              />
            </div>
            
            <div className="mb-3">
              <div className="flex items-center mb-1">
                <div className="w-4 h-4 bg-yellow-500 mr-2"></div>
                <label className="block text-sm">Yellow: {(options.yellowWeight * 100).toFixed(0)}%</label>
              </div>
              <input 
                type="range" 
                min="0.05" 
                max="0.3" 
                step="0.05"
                value={options.yellowWeight} 
                onChange={e => setOptions({...options, yellowWeight: parseFloat(e.target.value)})} 
                className="w-full"
              />
            </div>
            
            <div className="text-xs text-gray-500 mt-2">
              Total: {((options.whiteWeight + options.redWeight + options.blueWeight + options.blackWeight + options.yellowWeight) * 100).toFixed(0)}%
            </div>
          </div>
          
          {/* Shape Settings */}
          <div className="mb-6">
            <h3 className="font-medium mb-2 pb-1 border-b">Shape Settings</h3>
            
            <div className="mb-3">
              <label className="block text-sm mb-1">Grid Detail: {options.gridSize}</label>
              <input 
                type="range" 
                min="15" 
                max="30" 
                value={options.gridSize} 
                onChange={e => setOptions({...options, gridSize: parseInt(e.target.value)})} 
                className="w-full"
              />
            </div>
            
            <div className="mb-3">
              <label className="block text-sm mb-1">Max Shape Size: {options.maxShapeSize}</label>
              <input 
                type="range" 
                min="4" 
                max="12" 
                value={options.maxShapeSize} 
                onChange={e => setOptions({...options, maxShapeSize: parseInt(e.target.value)})} 
                className="w-full"
              />
            </div>
            
            <div className="mb-3">
              <label className="block text-sm mb-1">Large Shapes: {(options.largeShapesProbability * 100).toFixed(0)}%</label>
              <input 
                type="range" 
                min="0.1" 
                max="0.6" 
                step="0.05"
                value={options.largeShapesProbability} 
                onChange={e => setOptions({...options, largeShapesProbability: parseFloat(e.target.value)})} 
                className="w-full"
              />
            </div>
            
            <div className="mb-3">
              <label className="block text-sm mb-1">Line Thickness: {options.lineThickness}</label>
              <input 
                type="range" 
                min="1" 
                max="4" 
                value={options.lineThickness} 
                onChange={e => setOptions({...options, lineThickness: parseInt(e.target.value)})} 
                className="w-full"
              />
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            <button 
              onClick={generateBalancedPattern} 
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors"
            >
              Generate New Pattern
            </button>
            <button 
              onClick={exportSVG} 
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition-colors"
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
              className="flex justify-center items-center border border-gray-200 rounded-lg"
              style={{ minHeight: '600px', backgroundColor: colorScheme.background }}
            ></div>
            
            <div className="mt-4 text-sm">
              <p><strong>Balanced Color Distribution:</strong></p>
              <p className="mt-2">This version creates patterns more similar to your reference thumbnail by:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Significantly reducing white dominance (15% instead of being the main color)</li>
                <li>Balancing red and blue as primary colors (25% each)</li>
                <li>Using black as a strong accent (20%)</li>
                <li>Adding yellow as a supporting accent (15%)</li>
                <li>Creating more angular, circuit-like jagged shapes</li>
                <li>Using size variation similar to the reference</li>
              </ul>
              <p className="mt-2">Adjust the color weights to create different balances, or use the presets for quick variations.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalancedCircuitGenerator;
