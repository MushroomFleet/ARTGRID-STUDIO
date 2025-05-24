import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { defaultConfig, colorSchemes, constraints, colorSchemeNames } from './config.js';

const CircuitStyleGenerator = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [options, setOptions] = useState(defaultConfig);

  // Reset and redraw when options change
  useEffect(() => {
    if (canvasRef.current) {
      drawPatterns();
    }
  }, [options]);

  // Main drawing function
  const drawPatterns = () => {
    // Get canvas and context
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = options.canvasSize;
    canvas.height = options.canvasSize;
    
    // Clear canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Get active color scheme
    const colors = colorSchemes[options.colorScheme];
    
    // Create a seeded random function
    const seededRandom = d3.randomLcg(options.randomSeed);
    
    // Set up grid parameters
    const width = canvas.width;
    const height = canvas.height;
    const cellCount = options.cellCount;
    const cellSize = width / cellCount;
    
    // Create shapes array
    const shapes = [];
    
    // Generate shape data
    for (let j = 0; j < cellCount; j++) {
      for (let i = 0; i < cellCount; i++) {
        let x = i * cellSize + cellSize / 2;
        let y = j * cellSize + cellSize / 2;
        
        // Shuffle colors for each cell
        const shuffledColors = [...colors].sort(() => seededRandom() - 0.5);
        
        shapes.push({
          x: x,
          y: y,
          w: cellSize,
          t: Math.floor(seededRandom() * 25), // Type of shape
          c1: shuffledColors[0],
          c2: shuffledColors[1]
        });
      }
    }
    
    // Shuffle shapes for layering
    const shuffledShapes = [...shapes].sort(() => seededRandom() - 0.5);
    
    // Draw shapes
    for (let shape of shuffledShapes) {
      // Randomize size and position
      let s = shape.w * (Math.floor(seededRandom() * 2) + 1);
      let x = shape.x - ((shape.w / 2) - (s / 2)) * (seededRandom() > 0.5 ? 1 : -1);
      let y = shape.y - ((shape.w / 2) - (s / 2)) * (seededRandom() > 0.5 ? 1 : -1);
      
      // Apply shadow
      ctx.save();
      ctx.shadowBlur = width * options.shadowBlur;
      ctx.shadowColor = '#000000';
      ctx.fillStyle = shape.c1;
      ctx.fillRect(x - s/2, y - s/2, s, s);
      ctx.restore();
      
      // Draw the pattern
      drawSuperShape(ctx, x, y, s, shape.t, shape.c1, shape.c2, seededRandom);
    }
    
    // Apply noise filter
    applyNoiseFilter(ctx, width, height, options.noiseAmount, seededRandom);
  };
  
  // Function to apply noise filter
  const applyNoiseFilter = (ctx, width, height, amount, randomFunc) => {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      // Generate noise for RGB channels
      data[i] = Math.min(255, data[i] + randomFunc() * amount);
      data[i + 1] = Math.min(255, data[i + 1] + randomFunc() * amount);
      data[i + 2] = Math.min(255, data[i + 2] + randomFunc() * amount);
      // Leave alpha channel as is
    }
    
    ctx.putImageData(imageData, 0, 0);
  };
  
  // Function to draw individual patterns
  const drawSuperShape = (ctx, x, y, w, type, c1, c2, randomFunc) => {
    ctx.save();
    
    // Translate to center of shape
    ctx.translate(x, y);
    
    // Randomly rotate in 90-degree increments
    ctx.rotate(Math.floor(randomFunc() * 4) * (Math.PI / 2));
    
    // Set colors
    const clr01 = c1;
    const clr02 = c2;
    
    // Draw base square
    ctx.fillStyle = clr01;
    ctx.fillRect(-w/2, -w/2, w, w);
    
    // Draw pattern based on type
    ctx.fillStyle = clr02;
    
    switch (type) {
      case 0: // Checkerboard
        const n = 4;
        const ww = w / n;
        for (let i = 0; i < n; i++) {
          for (let j = 0; j < n; j++) {
            let xx = i * ww + (ww / 2) - (w / 2);
            let yy = j * ww + (ww / 2) - (w / 2);
            if ((i + j) % 2 === 0) {
              ctx.fillRect(xx - ww/2, yy - ww/2, ww, ww);
            }
          }
        }
        break;
        
      case 1: // Two horizontal bars
        ctx.fillRect(-w/2, w/8 - w/8, w, w/4);
        ctx.fillRect(-w/2, (w/8) - (w/2) - w/8, w, w/4);
        break;
        
      case 2: // Five circles pattern
        const d = w / 4;
        ctx.beginPath();
        ctx.arc(0, 0, d/2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(-d, d, d/2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(d, -d, d/2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(-d, -d, d/2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(d, d, d/2, 0, Math.PI * 2);
        ctx.fill();
        break;
        
      case 3: // Concentric circles
        ctx.beginPath();
        ctx.arc(0, 0, w * 0.4, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = clr01;
        ctx.beginPath();
        ctx.arc(0, 0, w * 0.15, 0, Math.PI * 2);
        ctx.fill();
        break;
        
      case 4: // Triangle in corner
        ctx.beginPath();
        ctx.moveTo(w/2, w/2);
        ctx.lineTo(-w/2, -w/2);
        ctx.lineTo(w/2, -w/2);
        ctx.closePath();
        ctx.fill();
        break;
        
      case 5: // Triangle pointing up
        ctx.beginPath();
        ctx.moveTo(w/2, w/2);
        ctx.lineTo(-w/2, w/2);
        ctx.lineTo(0, -w/2);
        ctx.closePath();
        ctx.fill();
        break;
        
      case 6: // Circle
        ctx.beginPath();
        ctx.arc(0, 0, w * 0.4, 0, Math.PI * 2);
        ctx.fill();
        break;
        
      case 7: // Three vertical lines
        ctx.strokeStyle = clr02;
        ctx.lineWidth = w * 0.1;
        
        ctx.beginPath();
        ctx.moveTo(0, w * 0.3);
        ctx.lineTo(0, -w * 0.3);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(w * 0.3, w * 0.3);
        ctx.lineTo(w * 0.3, -w * 0.3);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(-w * 0.3, w * 0.3);
        ctx.lineTo(-w * 0.3, -w * 0.3);
        ctx.stroke();
        break;
        
      case 8: // Grid of circles
        const n2 = 3;
        const ww2 = (w * 0.8) / n2;
        for (let i = 0; i < n2; i++) {
          for (let j = 0; j < n2; j++) {
            let xx = i * ww2 + (ww2 / 2) - (w / 2) + (w * 0.1);
            let yy = j * ww2 + (ww2 / 2) - (w / 2) + (w * 0.1);
            ctx.beginPath();
            ctx.arc(xx, yy, ww2 * 0.375, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        break;
        
      case 9: // Diagonal slash
        ctx.beginPath();
        ctx.moveTo(-w/2, -w/2);
        ctx.lineTo(-w/2, w/2);
        ctx.lineTo(w/2, -w/2);
        ctx.lineTo(w/2, w/2);
        ctx.fill();
        break;
        
      case 10: // Two horizontal rectangles
        ctx.fillRect(-w*0.4, w*0.2 - w*0.125, w*0.8, w/4);
        ctx.fillRect(-w*0.4, -w*0.2 - w*0.125, w*0.8, w/4);
        break;
        
      case 11: // Square with 4 corner squares
        ctx.fillRect(-w*0.25, -w*0.25, w*0.5, w*0.5);
        
        // Top-right
        ctx.fillRect(w*0.5 - w*0.25, -w*0.5, w*0.25, w*0.25);
        // Top-left
        ctx.fillRect(-w*0.5, -w*0.5, w*0.25, w*0.25);
        // Bottom-right
        ctx.fillRect(w*0.5 - w*0.25, w*0.5 - w*0.25, w*0.25, w*0.25);
        // Bottom-left
        ctx.fillRect(-w*0.5, w*0.5 - w*0.25, w*0.25, w*0.25);
        break;
        
      case 12: // Four quarter circles at corners
        ctx.beginPath();
        ctx.arc(-w/2, -w/2, w/2, 0, Math.PI/2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(w/2, -w/2, w/2, Math.PI/2, Math.PI);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(w/2, w/2, w/2, Math.PI, Math.PI*1.5);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(-w/2, w/2, w/2, Math.PI*1.5, Math.PI*2);
        ctx.fill();
        break;
        
      case 13: // Two half circles
        ctx.beginPath();
        ctx.arc(-w/2, 0, w/2, -Math.PI/2, Math.PI/2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(w/2, 0, w/2, Math.PI/2, Math.PI*1.5);
        ctx.fill();
        break;
        
      case 14: // Quarter circle in corner
        ctx.beginPath();
        ctx.arc(w/2, w/2, w, Math.PI, Math.PI*1.5);
        ctx.fill();
        break;
        
      case 15: // Four dots with circle outline
        const d2 = w * 0.2;
        
        ctx.beginPath();
        ctx.arc(w*0.3, 0, d2/2, 0, Math.PI*2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(-w*0.3, 0, d2/2, 0, Math.PI*2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(0, w*0.3, d2/2, 0, Math.PI*2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(0, -w*0.3, d2/2, 0, Math.PI*2);
        ctx.fill();
        
        ctx.strokeStyle = clr02;
        ctx.lineWidth = w * 0.03;
        ctx.beginPath();
        ctx.arc(0, 0, w*0.3, 0, Math.PI*2);
        ctx.stroke();
        break;
        
      case 16: // Four overlapping circles
        const d3 = w * 0.5;
        
        ctx.beginPath();
        ctx.arc(0, d3/2, d3/2, 0, Math.PI*2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(0, -d3/2, d3/2, 0, Math.PI*2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(d3/2, 0, d3/2, 0, Math.PI*2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(-d3/2, 0, d3/2, 0, Math.PI*2);
        ctx.fill();
        break;
        
      case 17: // Square with smaller square
        ctx.fillRect(-w/2, -w/2, w, w);
        ctx.fillStyle = clr01;
        ctx.fillRect(-w*0.25, -w*0.25, w*0.5, w*0.5);
        break;
        
      case 18: // Circle with 4 diagonal lines
        ctx.beginPath();
        ctx.arc(0, 0, w*0.11, 0, Math.PI*2);
        ctx.fill();
        
        ctx.strokeStyle = clr02;
        ctx.lineWidth = w*0.05;
        
        for (let i = 0; i < 4; i++) {
          ctx.beginPath();
          ctx.moveTo(w*0.15, w*0.15);
          ctx.lineTo(w*0.4, w*0.4);
          ctx.stroke();
          ctx.rotate(Math.PI/2);
        }
        break;
        
      case 19: // Octagon with square hole
        ctx.beginPath();
        ctx.moveTo(-w*0.25, -w*0.5);
        ctx.lineTo(w*0.25, -w*0.5);
        ctx.lineTo(w*0.5, -w*0.25);
        ctx.lineTo(w*0.5, w*0.25);
        ctx.lineTo(w*0.25, w*0.5);
        ctx.lineTo(-w*0.25, w*0.5);
        ctx.lineTo(-w*0.5, w*0.25);
        ctx.lineTo(-w*0.5, -w*0.25);
        ctx.closePath();
        
        // Cut out center square
        ctx.moveTo(0, -w*0.25);
        ctx.lineTo(-w*0.25, 0);
        ctx.lineTo(0, w*0.25);
        ctx.lineTo(w*0.25, 0);
        ctx.closePath();
        
        ctx.fill('evenodd');
        break;
        
      case 20: // Four triangles from center
        for (let i = 0; i < 4; i++) {
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(0, -w*0.5);
          ctx.lineTo(w*0.5, -w*0.5);
          ctx.closePath();
          ctx.fill();
          ctx.rotate(Math.PI/2);
        }
        break;
        
      case 21: // Corner triangles
        for (let i = 0; i < 2; i++) {
          ctx.beginPath();
          ctx.moveTo(w*0.5, 0);
          ctx.lineTo(0, -w*0.5);
          ctx.lineTo(w*0.5, -w*0.5);
          ctx.closePath();
          ctx.fill();
          
          ctx.beginPath();
          ctx.moveTo(w*0.5, 0);
          ctx.lineTo(0, 0);
          ctx.lineTo(0, w*0.5);
          ctx.closePath();
          ctx.fill();
          
          ctx.rotate(Math.PI);
        }
        break;
        
      case 22: // Quarter circles in opposite corners
        ctx.beginPath();
        ctx.moveTo(-w/2, -w/2);
        
        // Top-left quarter circle
        for (let a = 0; a < Math.PI/2; a += Math.PI/180) {
          ctx.lineTo(-(w/2) + (w) * Math.cos(a), -(w/2) + (w) * Math.sin(a));
        }
        
        // Bottom-right quarter circle
        for (let a = Math.PI; a < Math.PI*1.5; a += Math.PI/180) {
          ctx.lineTo((w/2) + (w) * Math.cos(a), (w/2) + (w) * Math.sin(a));
        }
        
        ctx.closePath();
        ctx.fill();
        break;
        
      case 23: // Nested squares in corner
        for (let i = 0; i < 3; i++) {
          let ww = (w * (3/4)) * (1 - i/3);
          ctx.fillStyle = i % 2 === 0 ? clr02 : clr01;
          ctx.fillRect((w/2) - ww, (w/2) - ww, ww, ww);
        }
        break;
        
      case 24: // Diamond
        ctx.beginPath();
        ctx.moveTo(0, -w*0.5);
        ctx.lineTo(w*0.25, 0);
        ctx.lineTo(0, w*0.5);
        ctx.lineTo(-w*0.25, 0);
        ctx.closePath();
        ctx.fill();
        break;
        
      default:
        // Default to a simple square
        ctx.fillRect(-w*0.25, -w*0.25, w*0.5, w*0.5);
    }
    
    ctx.restore();
  };

  // Export as SVG
  const exportSVG = () => {
    // Create SVG by reading the canvas pixels
    const canvas = canvasRef.current;
    const svgWidth = canvas.width;
    const svgHeight = canvas.height;
    
    // Create SVG content
    let svgContent = `<svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${svgWidth}" height="${svgHeight}" fill="black" />
      <image width="${svgWidth}" height="${svgHeight}" href="${canvas.toDataURL('image/png')}" />
    </svg>`;
    
    // Create a blob and download link
    const blob = new Blob([svgContent], {type: 'image/svg+xml'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = options.outputFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 bg-gray-50" ref={containerRef}>
      <h1 className="text-3xl font-bold mb-6 text-center">Circuit-Style Patterns Generator</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Controls Panel */}
        <div className="md:col-span-1 bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Controls</h2>
          
          {/* Grid Settings */}
          <div className="mb-6">
            <h3 className="font-medium mb-2 pb-1 border-b">Grid Settings</h3>
            
            <div className="mb-3">
              <label className="block text-sm mb-1">Cell Count: {options.cellCount}</label>
              <input 
                type="range" 
                min={constraints.cellCount.min} 
                max={constraints.cellCount.max} 
                value={options.cellCount} 
                onChange={e => setOptions({...options, cellCount: parseInt(e.target.value)})} 
                className="w-full"
              />
              <span className="text-xs text-gray-500">Number of cells in the grid</span>
            </div>
            
            <div className="mb-3">
              <label className="block text-sm mb-1">Canvas Size: {options.canvasSize}px</label>
              <input 
                type="range" 
                min={constraints.canvasSize.min} 
                max={constraints.canvasSize.max} 
                step={constraints.canvasSize.step}
                value={options.canvasSize} 
                onChange={e => setOptions({...options, canvasSize: parseInt(e.target.value)})} 
                className="w-full"
              />
            </div>
          </div>
          
          {/* Color Settings */}
          <div className="mb-6">
            <h3 className="font-medium mb-2 pb-1 border-b">Color Scheme</h3>
            
            <div className="mb-3">
              <select 
                value={options.colorScheme} 
                onChange={e => setOptions({...options, colorScheme: e.target.value})}
                className="w-full p-2 border rounded"
              >
                {Object.keys(colorSchemes).map(scheme => (
                  <option key={scheme} value={scheme}>{colorSchemeNames[scheme]}</option>
                ))}
              </select>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-2">
              {colorSchemes[options.colorScheme].map((color, index) => (
                <div 
                  key={index} 
                  className="w-8 h-8 rounded-sm border border-gray-300" 
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
          
          {/* Effect Settings */}
          <div className="mb-6">
            <h3 className="font-medium mb-2 pb-1 border-b">Effects</h3>
            
            <div className="mb-3">
              <label className="block text-sm mb-1">Shadow Blur: {options.shadowBlur.toFixed(3)}</label>
              <input 
                type="range" 
                min={constraints.shadowBlur.min} 
                max={constraints.shadowBlur.max} 
                step={constraints.shadowBlur.step}
                value={options.shadowBlur} 
                onChange={e => setOptions({...options, shadowBlur: parseFloat(e.target.value)})} 
                className="w-full"
              />
            </div>
            
            <div className="mb-3">
              <label className="block text-sm mb-1">Noise Amount: {options.noiseAmount}</label>
              <input 
                type="range" 
                min={constraints.noiseAmount.min} 
                max={constraints.noiseAmount.max} 
                value={options.noiseAmount} 
                onChange={e => setOptions({...options, noiseAmount: parseInt(e.target.value)})} 
                className="w-full"
              />
            </div>
          </div>
          
          {/* Random Seed */}
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
              className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded w-full"
            >
              Random Seed
            </button>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            <button 
              onClick={() => drawPatterns()} 
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors"
            >
              Generate New
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
            <div className="flex justify-center items-center border border-gray-200 rounded-lg overflow-hidden">
              <canvas 
                ref={canvasRef} 
                style={{ 
                  maxWidth: '100%', 
                  height: 'auto',
                  background: 'black'
                }}
              />
            </div>
            
            <div className="mt-4 text-sm">
              <p><strong>About this Generator:</strong></p>
              <p className="mt-2">This generator creates circuit board-inspired geometric patterns with structured grid layouts. Features include:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>25 different pattern types including checkerboards, circles, triangles, and complex shapes</li>
                <li>Grid-based structured layout with randomized positioning</li>
                <li>6 color schemes: Original, Blues, Earth Tones, Pastel, Vibrant, and Monochrome</li>
                <li>Shadow effects for depth and dimension</li>
                <li>Noise overlay for texture and grain</li>
                <li>Seeded randomization for reproducible results</li>
              </ul>
              <p className="mt-2">Adjust the controls to create your perfect circuit-style pattern grid, then export as SVG.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CircuitStyleGenerator;
