import React, { useEffect, useRef, useState } from 'react';
import { downloadSVG } from '../../utils/svgUtils.js';

const StampDecoratorGenerator = () => {
  const svgContainerRef = useRef(null);
  const [options, setOptions] = useState({
    // Grid settings
    canvasSize: 900,
    cellCount: 5,
    gridArea: 0.85,
    
    // Color settings
    backgroundColor: '#1666AE',
    colorScheme: 'original',
    
    // Stamp settings
    stampMargin: 0.16,
    shadowOffset: 0.01,
    scallopsPerEdge: 10,
    scallopSize: 0.3,
    
    // Subdivision settings
    subdivisionDepth: 4,
    subdivisionRatios: [0.25, 0.5, 0.75],
    
    // Effects
    useNoise: true,
    noiseOpacity: 30,
    useShadows: true,
    
    // Randomization
    randomSeed: Math.floor(Math.random() * 1000)
  });
  
  // Color schemes
  const colorSchemes = {
    original: ['#1666AE', '#FFD300', '#E84B20', '#1EA988', '#F6B3C4', '#232323', '#fafafa'],
    warm: ['#FF6B35', '#F7931E', '#FFD23F', '#06FFA5', '#118AB2', '#073B4C', '#FFFFFF'],
    cool: ['#264653', '#2A9D8F', '#E9C46A', '#F4A261', '#E76F51', '#1A535C', '#F7F7F2'],
    monochrome: ['#0D1B2A', '#1B263B', '#415A77', '#778DA9', '#E0E1DD', '#FFFFFF', '#F8F9FA'],
    pastel: ['#F8BBD0', '#E1BEE7', '#C5CAE9', '#BBDEFB', '#B3E5FC', '#B2EBF2', '#E8F5E8'],
    vibrant: ['#FF0080', '#00FF80', '#8000FF', '#FF8000', '#0080FF', '#80FF00', '#FF4080']
  };

  // Seeded random function
  let seedValue = options.randomSeed;
  const seededRandom = () => {
    seedValue = (seedValue * 9301 + 49297) % 233280;
    return seedValue / 233280;
  };

  const seededRandomChoice = (array) => {
    return array[Math.floor(seededRandom() * array.length)];
  };

  useEffect(() => {
    generateStampPattern();
  }, [options]);

  const generateStampPattern = () => {
    // Reset seed
    seedValue = options.randomSeed;
    
    const container = svgContainerRef.current;
    if (!container) return;

    container.innerHTML = '';

    const colors = colorSchemes[options.colorScheme] || colorSchemes.original;
    const size = options.canvasSize;
    
    // Create SVG
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", size);
    svg.setAttribute("height", size);
    svg.setAttribute("viewBox", `0 0 ${size} ${size}`);

    // Add defs for patterns and filters
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    svg.appendChild(defs);

    // Add noise filter if enabled
    if (options.useNoise) {
      addNoiseFilter(defs);
    }

    // Background
    const background = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    background.setAttribute("width", size);
    background.setAttribute("height", size);
    background.setAttribute("fill", options.backgroundColor);
    svg.appendChild(background);

    // Calculate grid parameters
    const area = size * options.gridArea;
    const cellSize = area / options.cellCount;
    const startOffset = (size - area) / 2;

    // Generate grid of stamps
    for (let i = 0; i < options.cellCount; i++) {
      for (let j = 0; j < options.cellCount; j++) {
        const x = cellSize * i + (cellSize / 2) + startOffset;
        const y = cellSize * j + (cellSize / 2) + startOffset;
        
        createStamp(svg, x, y, cellSize, colors);
      }
    }

    // Add noise overlay
    if (options.useNoise) {
      addNoiseOverlay(svg, size);
    }

    container.appendChild(svg);
  };

  const addNoiseFilter = (defs) => {
    const noiseFilter = document.createElementNS("http://www.w3.org/2000/svg", "filter");
    noiseFilter.setAttribute("id", "noise");
    noiseFilter.setAttribute("x", "0%");
    noiseFilter.setAttribute("y", "0%");
    noiseFilter.setAttribute("width", "100%");
    noiseFilter.setAttribute("height", "100%");

    const turbulence = document.createElementNS("http://www.w3.org/2000/svg", "feTurbulence");
    turbulence.setAttribute("baseFrequency", "0.9");
    turbulence.setAttribute("numOctaves", "1");
    turbulence.setAttribute("seed", options.randomSeed);
    turbulence.setAttribute("result", "noise");

    const colorMatrix = document.createElementNS("http://www.w3.org/2000/svg", "feColorMatrix");
    colorMatrix.setAttribute("in", "noise");
    colorMatrix.setAttribute("type", "saturate");
    colorMatrix.setAttribute("values", "0");
    colorMatrix.setAttribute("result", "desaturatedNoise");

    const componentTransfer = document.createElementNS("http://www.w3.org/2000/svg", "feComponentTransfer");
    componentTransfer.setAttribute("in", "desaturatedNoise");
    componentTransfer.setAttribute("result", "theNoise");

    const funcA = document.createElementNS("http://www.w3.org/2000/svg", "feFuncA");
    funcA.setAttribute("type", "discrete");
    funcA.setAttribute("tableValues", `0 ${options.noiseOpacity / 255}`);

    componentTransfer.appendChild(funcA);

    noiseFilter.appendChild(turbulence);
    noiseFilter.appendChild(colorMatrix);
    noiseFilter.appendChild(componentTransfer);

    defs.appendChild(noiseFilter);
  };

  const addNoiseOverlay = (svg, size) => {
    const noiseRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    noiseRect.setAttribute("width", size);
    noiseRect.setAttribute("height", size);
    noiseRect.setAttribute("fill", "white");
    noiseRect.setAttribute("filter", "url(#noise)");
    noiseRect.setAttribute("mix-blend-mode", "multiply");
    svg.appendChild(noiseRect);
  };

  const createStamp = (svg, x, y, cellSize, colors) => {
    const stampWidth = cellSize * 0.8;
    const stampHeight = cellSize * 0.9;
    const margin = cellSize * options.stampMargin;
    const shadowOffset = cellSize * options.shadowOffset;

    // Create group for this stamp with clipping
    const stampGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    
    // Create a clipping path to contain all content within the stamp
    const clipId = `stamp-clip-${Math.random().toString(36).substr(2, 9)}`;
    const clipPath = document.createElementNS("http://www.w3.org/2000/svg", "clipPath");
    clipPath.setAttribute("id", clipId);
    
    const clipRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    clipRect.setAttribute("x", x - stampWidth/2);
    clipRect.setAttribute("y", y - stampHeight/2);
    clipRect.setAttribute("width", stampWidth);
    clipRect.setAttribute("height", stampHeight);
    clipPath.appendChild(clipRect);
    
    // Add clipPath to defs (we'll need to get the defs element)
    let defs = svg.querySelector('defs');
    if (!defs) {
      defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
      svg.insertBefore(defs, svg.firstChild);
    }
    defs.appendChild(clipPath);

    // Shadow stamp (black, offset) - outside clipping
    if (options.useShadows) {
      const shadowStamp = createStampShape(
        x + shadowOffset,
        y + shadowOffset,
        stampWidth,
        stampHeight,
        'rgba(0,0,0,0.5)'
      );
      stampGroup.appendChild(shadowStamp);
    }

    // Main stamp (white background)
    const mainStamp = createStampShape(x, y, stampWidth, stampHeight, '#ffffff');
    stampGroup.appendChild(mainStamp);

    // Create a group for clipped content (inner subdivisions)
    const clippedGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    clippedGroup.setAttribute("clip-path", `url(#${clipId})`);

    // Inner subdivided area
    const innerWidth = stampWidth - margin;
    const innerHeight = stampHeight - margin;
    
    const subdividedShapes = createSubdividedRect(
      x, y, innerWidth, innerHeight, options.subdivisionDepth, colors
    );
    
    subdividedShapes.forEach(shape => clippedGroup.appendChild(shape));
    
    stampGroup.appendChild(clippedGroup);
    svg.appendChild(stampGroup);
  };

  const createStampShape = (x, y, width, height, fillColor) => {
    const scallopsPerEdge = options.scallopsPerEdge;
    const scallopRadius = Math.min(width, height) / scallopsPerEdge * options.scallopSize;
    
    let pathData = '';
    
    // Start at top-left corner
    pathData += `M ${x - width/2} ${y - height/2}`;
    
    // Top edge (no scallops on straight edges in original)
    pathData += ` L ${x + width/2} ${y - height/2}`;
    
    // Right edge with scallops
    const rightEdgeSteps = Math.floor((height - scallopRadius) / (scallopRadius * 2));
    for (let i = 0; i < rightEdgeSteps; i++) {
      const yPos = y - height/2 + (i + 0.5) * (height / rightEdgeSteps);
      pathData += ` L ${x + width/2} ${yPos - scallopRadius}`;
      pathData += ` A ${scallopRadius} ${scallopRadius} 0 0 1 ${x + width/2} ${yPos + scallopRadius}`;
    }
    pathData += ` L ${x + width/2} ${y + height/2}`;
    
    // Bottom edge with scallops
    const bottomEdgeSteps = Math.floor(width / (scallopRadius * 2));
    for (let i = 0; i < bottomEdgeSteps; i++) {
      const xPos = x + width/2 - (i + 0.5) * (width / bottomEdgeSteps);
      pathData += ` L ${xPos + scallopRadius} ${y + height/2}`;
      pathData += ` A ${scallopRadius} ${scallopRadius} 0 0 1 ${xPos - scallopRadius} ${y + height/2}`;
    }
    pathData += ` L ${x - width/2} ${y + height/2}`;
    
    // Left edge with scallops
    for (let i = 0; i < rightEdgeSteps; i++) {
      const yPos = y + height/2 - (i + 0.5) * (height / rightEdgeSteps);
      pathData += ` L ${x - width/2} ${yPos + scallopRadius}`;
      pathData += ` A ${scallopRadius} ${scallopRadius} 0 0 1 ${x - width/2} ${yPos - scallopRadius}`;
    }
    
    pathData += ' Z';

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", pathData);
    path.setAttribute("fill", fillColor);
    path.setAttribute("stroke", "none");

    return path;
  };

  const createSubdividedRect = (x, y, width, height, depth, colors) => {
    const shapes = [];
    
    const subdivide = (cx, cy, w, h, d) => {
      if (d <= 0) {
        // Base case - create final rectangle with arc decoration
        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("x", cx - w/2);
        rect.setAttribute("y", cy - h/2);
        rect.setAttribute("width", w);
        rect.setAttribute("height", h);
        rect.setAttribute("fill", seededRandomChoice(colors));
        shapes.push(rect);

        // Add decorative arc in corner - properly constrained
        const arcColor = seededRandomChoice(colors);
        
        // Choose which corner to place the arc
        const cornerChoice = Math.floor(seededRandom() * 4);
        
        // Scale the arc to be smaller and fit within bounds
        const maxRadius = Math.min(w, h) * 0.4; // Reduced from full size
        
        let arcPath = '';
        let arcX, arcY;
        
        switch(cornerChoice) {
          case 0: // Top-left
            arcX = cx - w/2;
            arcY = cy - h/2;
            arcPath = `M ${arcX} ${arcY} L ${arcX + maxRadius} ${arcY} A ${maxRadius} ${maxRadius} 0 0 1 ${arcX} ${arcY + maxRadius} Z`;
            break;
          case 1: // Top-right
            arcX = cx + w/2;
            arcY = cy - h/2;
            arcPath = `M ${arcX} ${arcY} L ${arcX - maxRadius} ${arcY} A ${maxRadius} ${maxRadius} 0 0 0 ${arcX} ${arcY + maxRadius} Z`;
            break;
          case 2: // Bottom-right
            arcX = cx + w/2;
            arcY = cy + h/2;
            arcPath = `M ${arcX} ${arcY} L ${arcX - maxRadius} ${arcY} A ${maxRadius} ${maxRadius} 0 0 1 ${arcX} ${arcY - maxRadius} Z`;
            break;
          case 3: // Bottom-left
            arcX = cx - w/2;
            arcY = cy + h/2;
            arcPath = `M ${arcX} ${arcY} L ${arcX + maxRadius} ${arcY} A ${maxRadius} ${maxRadius} 0 0 0 ${arcX} ${arcY - maxRadius} Z`;
            break;
        }
        
        const arc = document.createElementNS("http://www.w3.org/2000/svg", "path");
        arc.setAttribute("d", arcPath);
        arc.setAttribute("fill", arcColor);
        
        shapes.push(arc);
        
        return;
      }

      // Choose subdivision ratios
      const ratio1 = seededRandomChoice(options.subdivisionRatios);
      const ratio2 = 1 - ratio1;

      if (w > h) {
        // Divide vertically
        const w1 = w * ratio1;
        const w2 = w * ratio2;
        subdivide(cx - w/2 + w1/2, cy, w1, h, d - 1);
        subdivide(cx + w/2 - w2/2, cy, w2, h, d - 1);
      } else {
        // Divide horizontally
        const h1 = h * ratio1;
        const h2 = h * ratio2;
        subdivide(cx, cy - h/2 + h1/2, w, h1, d - 1);
        subdivide(cx, cy + h/2 - h2/2, w, h2, d - 1);
      }
    };

    subdivide(x, y, width, height, depth);
    return shapes;
  };

  const exportSVG = () => {
    if (!svgContainerRef.current) return;
    
    const svg = svgContainerRef.current.querySelector('svg');
    if (svg) {
      downloadSVG(svg, 'decorative-stamps.svg');
    }
  };

  const exportPNG = () => {
    const svg = svgContainerRef.current.querySelector('svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    canvas.width = options.canvasSize * 2; // Higher resolution
    canvas.height = options.canvasSize * 2;

    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const pngUrl = canvas.toDataURL('image/png');
      
      const link = document.createElement('a');
      link.href = pngUrl;
      link.download = 'decorative-stamps.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    img.src = url;
  };

  return (
    <div className="max-w-6xl mx-auto p-4 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-center">Stamp Decorator Generator</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Controls Panel */}
        <div className="md:col-span-1 bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Controls</h2>
          
          {/* Grid Settings */}
          <div className="mb-6">
            <h3 className="font-medium mb-2 pb-1 border-b">Grid Settings</h3>
            
            <div className="mb-3">
              <label className="block text-sm mb-1">Canvas Size: {options.canvasSize}px</label>
              <input 
                type="range" 
                min="600" 
                max="1200" 
                step="50"
                value={options.canvasSize} 
                onChange={e => setOptions({...options, canvasSize: parseInt(e.target.value)})} 
                className="w-full"
              />
            </div>
            
            <div className="mb-3">
              <label className="block text-sm mb-1">Cell Count: {options.cellCount}</label>
              <input 
                type="range" 
                min="3" 
                max="8" 
                value={options.cellCount} 
                onChange={e => setOptions({...options, cellCount: parseInt(e.target.value)})} 
                className="w-full"
              />
              <span className="text-xs text-gray-500">Number of stamps per row/column</span>
            </div>
            
            <div className="mb-3">
              <label className="block text-sm mb-1">Grid Coverage: {(options.gridArea * 100).toFixed(0)}%</label>
              <input 
                type="range" 
                min="0.6" 
                max="0.95" 
                step="0.05"
                value={options.gridArea} 
                onChange={e => setOptions({...options, gridArea: parseFloat(e.target.value)})} 
                className="w-full"
              />
            </div>
          </div>
          
          {/* Color Settings */}
          <div className="mb-6">
            <h3 className="font-medium mb-2 pb-1 border-b">Color Settings</h3>
            
            <div className="mb-3">
              <label className="block text-sm mb-1">Background Color</label>
              <input 
                type="color" 
                value={options.backgroundColor} 
                onChange={e => setOptions({...options, backgroundColor: e.target.value})} 
                className="w-full h-8"
              />
            </div>
            
            <div className="mb-3">
              <label className="block text-sm mb-1">Color Scheme</label>
              <select 
                value={options.colorScheme} 
                onChange={e => setOptions({...options, colorScheme: e.target.value})}
                className="w-full p-2 border rounded"
              >
                <option value="original">Original</option>
                <option value="warm">Warm</option>
                <option value="cool">Cool</option>
                <option value="monochrome">Monochrome</option>
                <option value="pastel">Pastel</option>
                <option value="vibrant">Vibrant</option>
              </select>
            </div>
            
            <div className="flex flex-wrap gap-1 mt-2">
              {colorSchemes[options.colorScheme].map((color, index) => (
                <div 
                  key={index} 
                  className="w-6 h-6 rounded-sm border border-gray-300" 
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
          
          {/* Stamp Settings */}
          <div className="mb-6">
            <h3 className="font-medium mb-2 pb-1 border-b">Stamp Settings</h3>
            
            <div className="mb-3">
              <label className="block text-sm mb-1">Stamp Margin: {(options.stampMargin * 100).toFixed(0)}%</label>
              <input 
                type="range" 
                min="0.05" 
                max="0.3" 
                step="0.01"
                value={options.stampMargin} 
                onChange={e => setOptions({...options, stampMargin: parseFloat(e.target.value)})} 
                className="w-full"
              />
            </div>
            
            <div className="mb-3">
              <label className="block text-sm mb-1">Scallop Size: {(options.scallopSize * 100).toFixed(0)}%</label>
              <input 
                type="range" 
                min="0.1" 
                max="0.5" 
                step="0.05"
                value={options.scallopSize} 
                onChange={e => setOptions({...options, scallopSize: parseFloat(e.target.value)})} 
                className="w-full"
              />
            </div>
            
            <div className="mb-3">
              <label className="block text-sm mb-1">Scallops Per Edge: {options.scallopsPerEdge}</label>
              <input 
                type="range" 
                min="6" 
                max="16" 
                value={options.scallopsPerEdge} 
                onChange={e => setOptions({...options, scallopsPerEdge: parseInt(e.target.value)})} 
                className="w-full"
              />
            </div>
            
            <div className="mb-3 flex items-center">
              <input 
                type="checkbox"
                id="useShadows"
                checked={options.useShadows}
                onChange={e => setOptions({...options, useShadows: e.target.checked})}
                className="mr-2"
              />
              <label htmlFor="useShadows" className="text-sm">Drop Shadows</label>
            </div>
          </div>
          
          {/* Subdivision Settings */}
          <div className="mb-6">
            <h3 className="font-medium mb-2 pb-1 border-b">Pattern Settings</h3>
            
            <div className="mb-3">
              <label className="block text-sm mb-1">Subdivision Depth: {options.subdivisionDepth}</label>
              <input 
                type="range" 
                min="2" 
                max="6" 
                value={options.subdivisionDepth} 
                onChange={e => setOptions({...options, subdivisionDepth: parseInt(e.target.value)})} 
                className="w-full"
              />
              <span className="text-xs text-gray-500">More depth = more detailed patterns</span>
            </div>
            
            <div className="mb-3 flex items-center">
              <input 
                type="checkbox"
                id="useNoise"
                checked={options.useNoise}
                onChange={e => setOptions({...options, useNoise: e.target.checked})}
                className="mr-2"
              />
              <label htmlFor="useNoise" className="text-sm">Paper Texture</label>
            </div>
            
            {options.useNoise && (
              <div className="mb-3">
                <label className="block text-sm mb-1">Texture Intensity: {options.noiseOpacity}</label>
                <input 
                  type="range" 
                  min="10" 
                  max="80" 
                  value={options.noiseOpacity} 
                  onChange={e => setOptions({...options, noiseOpacity: parseInt(e.target.value)})} 
                  className="w-full"
                />
              </div>
            )}
          </div>
          
          {/* Randomization */}
          <div className="mb-6">
            <h3 className="font-medium mb-2 pb-1 border-b">Randomization</h3>
            
            <div className="mb-3">
              <label className="block text-sm mb-1">Seed: {options.randomSeed}</label>
              <input 
                type="number" 
                value={options.randomSeed} 
                onChange={e => setOptions({...options, randomSeed: parseInt(e.target.value)})} 
                className="w-full p-2 border rounded"
              />
            </div>
            
            <button 
              onClick={() => setOptions({...options, randomSeed: Math.floor(Math.random() * 10000)})} 
              className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded w-full mb-2"
            >
              Random Seed
            </button>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            <button 
              onClick={generateStampPattern} 
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
            <button 
              onClick={exportPNG} 
              className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded transition-colors"
            >
              Export PNG (2x)
            </button>
          </div>
        </div>
        
        {/* Preview Panel */}
        <div className="md:col-span-2">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Preview</h2>
            <div 
              ref={svgContainerRef} 
              className="flex justify-center items-center border border-gray-200 rounded-lg overflow-hidden"
              style={{ minHeight: '600px' }}
            ></div>
            
            <div className="mt-4 text-sm">
              <p><strong>About this Generator:</strong></p>
              <p className="mt-2">This generator creates decorative stamp patterns with scalloped edges and recursive subdivisions. Key features:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li><strong>Stamp Shapes:</strong> Decorative scalloped edges that mimic postal stamps</li>
                <li><strong>Recursive Subdivision:</strong> Each stamp is divided into smaller colored rectangles</li>
                <li><strong>Corner Arcs:</strong> Decorative quarter-circles in the final subdivisions</li>
                <li><strong>Drop Shadows:</strong> Optional shadows for depth and dimension</li>
                <li><strong>Paper Texture:</strong> Noise overlay for authentic paper feel</li>
                <li><strong>Color Harmony:</strong> Carefully chosen color schemes that work well together</li>
              </ul>
              <p className="mt-2">The pattern combines geometric precision with organic scalloped edges, creating a unique blend of structured and decorative elements perfect for backgrounds, prints, or digital art projects.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StampDecoratorGenerator;
