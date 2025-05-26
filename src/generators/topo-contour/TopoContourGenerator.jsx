import React, { useEffect, useRef, useState } from 'react';

const TopoContourGenerator = () => {
  const svgContainerRef = useRef(null);
  const [options, setOptions] = useState({
    // Canvas settings
    canvasSize: 800,
    
    // Terrain generation
    terrainType: 'hills',
    elevationRange: [0, 100],
    terrainScale: 0.02,
    terrainOctaves: 4,
    terrainPersistence: 0.5,
    
    // Contour settings
    contourInterval: 10,
    minorContourInterval: 2,
    contourSmoothing: 0.8,
    showMinorContours: true,
    
    // Visual style
    majorContourWeight: 2,
    minorContourWeight: 0.8,
    majorContourColor: '#2D5016',
    minorContourColor: '#6B9080',
    backgroundColor: '#F5F5DC',
    
    // Features
    showElevationLabels: true,
    showRidgeLines: true,
    showWatersheds: false,
    
    // Generation controls
    peakCount: 5,
    valleyCount: 3,
    ridgeStrength: 0.7,
    randomSeed: Math.floor(Math.random() * 1000)
  });

  // Seeded random function for reproducible results
  let seedValue = options.randomSeed;
  const seededRandom = () => {
    seedValue = (seedValue * 9301 + 49297) % 233280;
    return seedValue / 233280;
  };

  useEffect(() => {
    generateTopography();
  }, [options]);

  // Perlin noise implementation
  const generatePerlinNoise = (width, height, scale, octaves, persistence) => {
    const noise = Array(height).fill().map(() => Array(width).fill(0));
    
    // Generate multiple octaves of noise
    for (let octave = 0; octave < octaves; octave++) {
      const frequency = Math.pow(2, octave) * scale;
      const amplitude = Math.pow(persistence, octave);
      
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          noise[y][x] += amplitude * perlinAt(x * frequency, y * frequency);
        }
      }
    }
    
    return noise;
  };

  // Simple Perlin noise function
  const perlinAt = (x, y) => {
    // Simple noise based on sine waves (simplified for this demo)
    const a = Math.sin(x * 0.1) * Math.cos(y * 0.1);
    const b = Math.sin(x * 0.2 + 1.5) * Math.cos(y * 0.15 + 2.1);
    const c = Math.sin(x * 0.05 + 0.8) * Math.cos(y * 0.08 + 1.2);
    return (a + b * 0.5 + c * 0.25) * 0.5 + 0.5;
  };

  const generateTopography = () => {
    // Reset seed
    seedValue = options.randomSeed;
    
    const container = svgContainerRef.current;
    if (!container) return;

    container.innerHTML = '';

    const size = options.canvasSize;
    const resolution = Math.floor(size / 4); // Grid resolution for height calculation

    // Generate height field
    let heightField = generatePerlinNoise(
      resolution, 
      resolution, 
      options.terrainScale, 
      options.terrainOctaves,
      options.terrainPersistence
    );

    // Add terrain features based on type
    heightField = addTerrainFeatures(heightField, resolution);

    // Normalize heights to elevation range
    heightField = normalizeHeights(heightField, options.elevationRange);

    // Create SVG
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svg.setAttribute("width", size);
    svg.setAttribute("height", size);
    svg.setAttribute("viewBox", `0 0 ${size} ${size}`);

    // Background
    const background = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    background.setAttribute("width", size);
    background.setAttribute("height", size);
    background.setAttribute("fill", options.backgroundColor);
    svg.appendChild(background);

    // Generate contour lines
    const contours = generateContourLines(heightField, resolution, size);
    
    // Draw contours
    contours.forEach(contour => {
      svg.appendChild(contour);
    });

    // Add ridge lines if enabled
    if (options.showRidgeLines) {
      const ridgeLines = generateRidgeLines(heightField, resolution, size);
      ridgeLines.forEach(ridge => svg.appendChild(ridge));
    }

    // Add watersheds if enabled
    if (options.showWatersheds) {
      const watersheds = generateWatersheds(heightField, resolution, size);
      watersheds.forEach(watershed => svg.appendChild(watershed));
    }

    container.appendChild(svg);
  };

  const addTerrainFeatures = (heightField, resolution) => {
    const modified = heightField.map(row => [...row]);

    switch (options.terrainType) {
      case 'mountain':
        // Add peaks
        for (let i = 0; i < options.peakCount; i++) {
          const peakX = Math.floor(seededRandom() * resolution);
          const peakY = Math.floor(seededRandom() * resolution);
          const peakHeight = 0.7 + seededRandom() * 0.3;
          const peakRadius = 20 + seededRandom() * 30;
          
          addPeak(modified, peakX, peakY, peakHeight, peakRadius, resolution);
        }
        break;

      case 'valley':
        // Add valleys (negative peaks)
        for (let i = 0; i < options.valleyCount; i++) {
          const valleyX = Math.floor(seededRandom() * resolution);
          const valleyY = Math.floor(seededRandom() * resolution);
          const valleyDepth = -0.5 - seededRandom() * 0.3;
          const valleyRadius = 15 + seededRandom() * 25;
          
          addPeak(modified, valleyX, valleyY, valleyDepth, valleyRadius, resolution);
        }
        break;

      case 'ridge':
        // Add ridge lines
        const ridgeCount = 3 + Math.floor(seededRandom() * 3);
        for (let i = 0; i < ridgeCount; i++) {
          addRidge(modified, resolution);
        }
        break;

      case 'crater':
        // Add circular crater
        const craterX = resolution / 2;
        const craterY = resolution / 2;
        const outerRadius = resolution * 0.3;
        const innerRadius = resolution * 0.2;
        
        addCrater(modified, craterX, craterY, outerRadius, innerRadius, resolution);
        break;

      case 'hills':
      default:
        // Add gentle hills
        for (let i = 0; i < options.peakCount; i++) {
          const hillX = Math.floor(seededRandom() * resolution);
          const hillY = Math.floor(seededRandom() * resolution);
          const hillHeight = 0.3 + seededRandom() * 0.4;
          const hillRadius = 25 + seededRandom() * 40;
          
          addPeak(modified, hillX, hillY, hillHeight, hillRadius, resolution);
        }
        break;
    }

    return modified;
  };

  const addPeak = (heightField, centerX, centerY, height, radius, resolution) => {
    for (let y = 0; y < resolution; y++) {
      for (let x = 0; x < resolution; x++) {
        const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
        if (distance < radius) {
          const influence = Math.cos((distance / radius) * Math.PI * 0.5) ** 2;
          heightField[y][x] += height * influence;
        }
      }
    }
  };

  const addRidge = (heightField, resolution) => {
    const startX = seededRandom() * resolution;
    const startY = seededRandom() * resolution;
    const endX = seededRandom() * resolution;
    const endY = seededRandom() * resolution;
    const ridgeHeight = 0.4 + seededRandom() * 0.3;
    const ridgeWidth = 8 + seededRandom() * 12;

    const steps = Math.floor(Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2));
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = Math.floor(startX + t * (endX - startX));
      const y = Math.floor(startY + t * (endY - startY));
      
      addPeak(heightField, x, y, ridgeHeight, ridgeWidth, resolution);
    }
  };

  const addCrater = (heightField, centerX, centerY, outerRadius, innerRadius, resolution) => {
    for (let y = 0; y < resolution; y++) {
      for (let x = 0; x < resolution; x++) {
        const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
        
        if (distance < outerRadius) {
          let influence = 0;
          
          if (distance < innerRadius) {
            // Inside crater - depression
            influence = -0.8 * (1 - distance / innerRadius);
          } else {
            // Crater rim - elevation
            const rimFactor = (distance - innerRadius) / (outerRadius - innerRadius);
            influence = 0.6 * Math.sin(rimFactor * Math.PI);
          }
          
          heightField[y][x] += influence;
        }
      }
    }
  };

  const normalizeHeights = (heightField, [minElev, maxElev]) => {
    let min = Infinity, max = -Infinity;
    
    // Find current range
    heightField.forEach(row => {
      row.forEach(height => {
        min = Math.min(min, height);
        max = Math.max(max, height);
      });
    });

    // Normalize to target range
    const range = max - min;
    const targetRange = maxElev - minElev;
    
    return heightField.map(row => 
      row.map(height => 
        minElev + ((height - min) / range) * targetRange
      )
    );
  };

  const generateContourLines = (heightField, resolution, canvasSize) => {
    const contours = [];
    const scale = canvasSize / resolution;
    
    // Generate elevation levels
    const minElev = options.elevationRange[0];
    const maxElev = options.elevationRange[1];
    const majorInterval = options.contourInterval;
    const minorInterval = options.minorContourInterval;
    
    const levels = [];
    
    // Add major contour levels
    for (let elev = minElev; elev <= maxElev; elev += majorInterval) {
      levels.push({ elevation: elev, isMajor: true });
    }
    
    // Add minor contour levels if enabled
    if (options.showMinorContours) {
      for (let elev = minElev; elev <= maxElev; elev += minorInterval) {
        if (elev % majorInterval !== 0) {
          levels.push({ elevation: elev, isMajor: false });
        }
      }
    }

    // Generate contour lines for each level
    levels.forEach(level => {
      const paths = marchingSquares(heightField, level.elevation, resolution);
      
      paths.forEach(path => {
        if (path.length < 3) return; // Skip very short paths
        
        // Smooth the path
        const smoothedPath = smoothPath(path, options.contourSmoothing);
        
        // Convert to SVG coordinates
        const svgPath = smoothedPath.map(([x, y]) => [
          x * scale,
          y * scale
        ]);
        
        // Create SVG path element
        const pathElement = createContourPath(svgPath, level);
        contours.push(pathElement);
        
        // Add elevation labels for major contours
        if (level.isMajor && options.showElevationLabels && svgPath.length > 10) {
          const labelElement = createElevationLabel(svgPath, level.elevation);
          if (labelElement) contours.push(labelElement);
        }
      });
    });

    return contours;
  };

  // Simplified marching squares algorithm
  const marchingSquares = (heightField, level, resolution) => {
    const paths = [];
    const visited = Array(resolution - 1).fill().map(() => Array(resolution - 1).fill(false));
    
    for (let y = 0; y < resolution - 1; y++) {
      for (let x = 0; x < resolution - 1; x++) {
        if (visited[y][x]) continue;
        
        // Check if this cell contains the contour level
        const corners = [
          heightField[y][x],     // top-left
          heightField[y][x + 1], // top-right
          heightField[y + 1][x + 1], // bottom-right
          heightField[y + 1][x]  // bottom-left
        ];
        
        const above = corners.map(h => h >= level);
        const caseIndex = (above[0] ? 1 : 0) + (above[1] ? 2 : 0) + 
                         (above[2] ? 4 : 0) + (above[3] ? 8 : 0);
        
        if (caseIndex !== 0 && caseIndex !== 15) {
          // This cell contains part of the contour
          const path = traceContour(heightField, level, x, y, resolution, visited);
          if (path.length > 2) {
            paths.push(path);
          }
        }
      }
    }
    
    return paths;
  };

  const traceContour = (heightField, level, startX, startY, resolution, visited) => {
    const path = [];
    let x = startX, y = startY;
    
    // Simple contour tracing - this is simplified for the demo
    const maxSteps = 1000;
    let steps = 0;
    
    while (steps < maxSteps) {
      if (x < 0 || x >= resolution - 1 || y < 0 || y >= resolution - 1) break;
      if (visited[y][x]) break;
      
      visited[y][x] = true;
      
      // Interpolate contour point
      const point = interpolateContourPoint(heightField, level, x, y);
      if (point) {
        path.push(point);
      }
      
      // Find next cell (simplified)
      let found = false;
      for (const [dx, dy] of [[1, 0], [0, 1], [-1, 0], [0, -1]]) {
        const nx = x + dx;
        const ny = y + dy;
        
        if (nx >= 0 && nx < resolution - 1 && ny >= 0 && ny < resolution - 1 && !visited[ny][nx]) {
          const corners = [
            heightField[ny][nx],
            heightField[ny][nx + 1],
            heightField[ny + 1][nx + 1],
            heightField[ny + 1][nx]
          ];
          
          const crossesLevel = corners.some(h => h >= level) && corners.some(h => h < level);
          if (crossesLevel) {
            x = nx;
            y = ny;
            found = true;
            break;
          }
        }
      }
      
      if (!found) break;
      steps++;
    }
    
    return path;
  };

  const interpolateContourPoint = (heightField, level, x, y) => {
    // Simple interpolation - find where level crosses cell edges
    const h00 = heightField[y][x];
    const h10 = heightField[y][x + 1];
    const h11 = heightField[y + 1][x + 1];
    const h01 = heightField[y + 1][x];
    
    // Check top edge
    if ((h00 >= level) !== (h10 >= level)) {
      const t = (level - h00) / (h10 - h00);
      return [x + t, y];
    }
    
    // Check right edge
    if ((h10 >= level) !== (h11 >= level)) {
      const t = (level - h10) / (h11 - h10);
      return [x + 1, y + t];
    }
    
    // Check bottom edge
    if ((h11 >= level) !== (h01 >= level)) {
      const t = (level - h11) / (h01 - h11);
      return [x + 1 - t, y + 1];
    }
    
    // Check left edge
    if ((h01 >= level) !== (h00 >= level)) {
      const t = (level - h01) / (h00 - h01);
      return [x, y + 1 - t];
    }
    
    return null;
  };

  const smoothPath = (path, smoothing) => {
    if (path.length < 3 || smoothing === 0) return path;
    
    const smoothed = [];
    
    for (let i = 0; i < path.length; i++) {
      const prev = path[i === 0 ? path.length - 1 : i - 1];
      const current = path[i];
      const next = path[(i + 1) % path.length];
      
      const smoothedX = current[0] + smoothing * 0.5 * (prev[0] + next[0] - 2 * current[0]);
      const smoothedY = current[1] + smoothing * 0.5 * (prev[1] + next[1] - 2 * current[1]);
      
      smoothed.push([smoothedX, smoothedY]);
    }
    
    return smoothed;
  };

  const createContourPath = (points, level) => {
    if (points.length < 2) return null;
    
    let pathData = `M ${points[0][0]} ${points[0][1]}`;
    
    for (let i = 1; i < points.length; i++) {
      pathData += ` L ${points[i][0]} ${points[i][1]}`;
    }
    
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", pathData);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", level.isMajor ? options.majorContourColor : options.minorContourColor);
    path.setAttribute("stroke-width", level.isMajor ? options.majorContourWeight : options.minorContourWeight);
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke-linejoin", "round");
    
    return path;
  };

  const createElevationLabel = (path, elevation) => {
    if (path.length < 5) return null;
    
    // Find a good spot for the label (middle of path)
    const midIndex = Math.floor(path.length / 2);
    const [x, y] = path[midIndex];
    
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", x);
    text.setAttribute("y", y);
    text.setAttribute("fill", options.majorContourColor);
    text.setAttribute("font-size", "10");
    text.setAttribute("font-family", "Arial, sans-serif");
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("dominant-baseline", "middle");
    text.setAttribute("opacity", "0.7");
    text.textContent = elevation.toString();
    
    return text;
  };

  const generateRidgeLines = (heightField, resolution, canvasSize) => {
    const ridgeLines = [];
    const scale = canvasSize / resolution;
    
    // Find ridge points (local maxima in gradient)
    for (let y = 1; y < resolution - 1; y++) {
      for (let x = 1; x < resolution - 1; x++) {
        const center = heightField[y][x];
        const neighbors = [
          heightField[y-1][x-1], heightField[y-1][x], heightField[y-1][x+1],
          heightField[y][x-1],                        heightField[y][x+1],
          heightField[y+1][x-1], heightField[y+1][x], heightField[y+1][x+1]
        ];
        
        // Check if this is a ridge point
        const isRidge = neighbors.filter(h => h < center).length >= 6;
        
        if (isRidge && center > options.elevationRange[0] + (options.elevationRange[1] - options.elevationRange[0]) * 0.5) {
          const point = document.createElementNS("http://www.w3.org/2000/svg", "circle");
          point.setAttribute("cx", x * scale);
          point.setAttribute("cy", y * scale);
          point.setAttribute("r", 1);
          point.setAttribute("fill", "#8B4513");
          point.setAttribute("opacity", "0.6");
          ridgeLines.push(point);
        }
      }
    }
    
    return ridgeLines;
  };

  const generateWatersheds = (heightField, resolution, canvasSize) => {
    // Simplified watershed generation
    const watersheds = [];
    // This would be a complex algorithm - simplified for demo
    return watersheds;
  };

  const exportSVG = () => {
    if (!svgContainerRef.current) return;
    
    const svgData = '<?xml version="1.0" encoding="UTF-8"?>\n' + svgContainerRef.current.innerHTML;
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'topographical-contours.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-center">Topographical Contour Generator</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Controls Panel */}
        <div className="lg:col-span-1 bg-white p-4 rounded-lg shadow max-h-screen overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">Controls</h2>
          
          {/* Terrain Type */}
          <div className="mb-4">
            <h3 className="font-medium mb-2 pb-1 border-b">Terrain Type</h3>
            <select 
              value={options.terrainType} 
              onChange={e => setOptions({...options, terrainType: e.target.value})}
              className="w-full p-2 border rounded text-sm"
            >
              <option value="hills">Rolling Hills</option>
              <option value="mountain">Mountain Peaks</option>
              <option value="valley">Valley Systems</option>
              <option value="ridge">Ridge Lines</option>
              <option value="crater">Crater Formation</option>
            </select>
          </div>
          
          {/* Elevation Settings */}
          <div className="mb-4">
            <h3 className="font-medium mb-2 pb-1 border-b">Elevation</h3>
            
            <div className="mb-2">
              <label className="block text-sm mb-1">Min Elevation: {options.elevationRange[0]}m</label>
              <input 
                type="range" 
                min="0" 
                max="500" 
                step="10"
                value={options.elevationRange[0]} 
                onChange={e => setOptions({...options, elevationRange: [parseInt(e.target.value), options.elevationRange[1]]})} 
                className="w-full"
              />
            </div>
            
            <div className="mb-2">
              <label className="block text-sm mb-1">Max Elevation: {options.elevationRange[1]}m</label>
              <input 
                type="range" 
                min="100" 
                max="2000" 
                step="10"
                value={options.elevationRange[1]} 
                onChange={e => setOptions({...options, elevationRange: [options.elevationRange[0], parseInt(e.target.value)]})} 
                className="w-full"
              />
            </div>
          </div>
          
          {/* Contour Settings */}
          <div className="mb-4">
            <h3 className="font-medium mb-2 pb-1 border-b">Contour Lines</h3>
            
            <div className="mb-2">
              <label className="block text-sm mb-1">Major Interval: {options.contourInterval}m</label>
              <input 
                type="range" 
                min="5" 
                max="50" 
                step="5"
                value={options.contourInterval} 
                onChange={e => setOptions({...options, contourInterval: parseInt(e.target.value)})} 
                className="w-full"
              />
            </div>
            
            <div className="mb-2 flex items-center">
              <input 
                type="checkbox"
                id="showMinorContours"
                checked={options.showMinorContours}
                onChange={e => setOptions({...options, showMinorContours: e.target.checked})}
                className="mr-2"
              />
              <label htmlFor="showMinorContours" className="text-sm">Show Minor Contours</label>
            </div>
            
            {options.showMinorContours && (
              <div className="mb-2">
                <label className="block text-sm mb-1">Minor Interval: {options.minorContourInterval}m</label>
                <input 
                  type="range" 
                  min="1" 
                  max="10" 
                  value={options.minorContourInterval} 
                  onChange={e => setOptions({...options, minorContourInterval: parseInt(e.target.value)})} 
                  className="w-full"
                />
              </div>
            )}
            
            <div className="mb-2">
              <label className="block text-sm mb-1">Smoothing: {options.contourSmoothing.toFixed(2)}</label>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.1"
                value={options.contourSmoothing} 
                onChange={e => setOptions({...options, contourSmoothing: parseFloat(e.target.value)})} 
                className="w-full"
              />
            </div>
          </div>
          
          {/* Visual Style */}
          <div className="mb-4">
            <h3 className="font-medium mb-2 pb-1 border-b">Visual Style</h3>
            
            <div className="mb-2">
              <label className="block text-sm mb-1">Major Line Weight: {options.majorContourWeight}</label>
              <input 
                type="range" 
                min="1" 
                max="5" 
                step="0.5"
                value={options.majorContourWeight} 
                onChange={e => setOptions({...options, majorContourWeight: parseFloat(e.target.value)})} 
                className="w-full"
              />
            </div>
            
            <div className="mb-2">
              <label className="block text-sm mb-1">Major Line Color</label>
              <input 
                type="color" 
                value={options.majorContourColor} 
                onChange={e => setOptions({...options, majorContourColor: e.target.value})} 
                className="w-full h-8"
              />
            </div>
            
            <div className="mb-2">
              <label className="block text-sm mb-1">Minor Line Color</label>
              <input 
                type="color" 
                value={options.minorContourColor} 
                onChange={e => setOptions({...options, minorContourColor: e.target.value})} 
                className="w-full h-8"
              />
            </div>
            
            <div className="mb-2">
              <label className="block text-sm mb-1">Background Color</label>
              <input 
                type="color" 
                value={options.backgroundColor} 
                onChange={e => setOptions({...options, backgroundColor: e.target.value})} 
                className="w-full h-8"
              />
            </div>
          </div>
          
          {/* Features */}
          <div className="mb-4">
            <h3 className="font-medium mb-2 pb-1 border-b">Features</h3>
            
            <div className="mb-2 flex items-center">
              <input 
                type="checkbox"
                id="showElevationLabels"
                checked={options.showElevationLabels}
                onChange={e => setOptions({...options, showElevationLabels: e.target.checked})}
                className="mr-2"
              />
              <label htmlFor="showElevationLabels" className="text-sm">Elevation Labels</label>
            </div>
            
            <div className="mb-2 flex items-center">
              <input 
                type="checkbox"
                id="showRidgeLines"
                checked={options.showRidgeLines}
                onChange={e => setOptions({...options, showRidgeLines: e.target.checked})}
                className="mr-2"
              />
              <label htmlFor="showRidgeLines" className="text-sm">Ridge Points</label>
            </div>
            
            <div className="mb-2">
              <label className="block text-sm mb-1">Peak Count: {options.peakCount}</label>
              <input 
                type="range" 
                min="1" 
                max="10" 
                value={options.peakCount} 
                onChange={e => setOptions({...options, peakCount: parseInt(e.target.value)})} 
                className="w-full"
              />
            </div>
          </div>
          
          {/* Terrain Generation */}
          <div className="mb-4">
            <h3 className="font-medium mb-2 pb-1 border-b">Terrain Generation</h3>
            
            <div className="mb-2">
              <label className="block text-sm mb-1">Terrain Scale: {options.terrainScale.toFixed(3)}</label>
              <input 
                type="range" 
                min="0.005" 
                max="0.05" 
                step="0.005"
                value={options.terrainScale} 
                onChange={e => setOptions({...options, terrainScale: parseFloat(e.target.value)})} 
                className="w-full"
              />
              <span className="text-xs text-gray-500">Higher = more detailed terrain</span>
            </div>
            
            <div className="mb-2">
              <label className="block text-sm mb-1">Noise Octaves: {options.terrainOctaves}</label>
              <input 
                type="range" 
                min="1" 
                max="6" 
                value={options.terrainOctaves} 
                onChange={e => setOptions({...options, terrainOctaves: parseInt(e.target.value)})} 
                className="w-full"
              />
              <span className="text-xs text-gray-500">More octaves = more detail layers</span>
            </div>
            
            <div className="mb-2">
              <label className="block text-sm mb-1">Persistence: {options.terrainPersistence.toFixed(2)}</label>
              <input 
                type="range" 
                min="0.2" 
                max="0.8" 
                step="0.1"
                value={options.terrainPersistence} 
                onChange={e => setOptions({...options, terrainPersistence: parseFloat(e.target.value)})} 
                className="w-full"
              />
              <span className="text-xs text-gray-500">Controls detail roughness</span>
            </div>
          </div>
          
          {/* Random Seed */}
          <div className="mb-4">
            <h3 className="font-medium mb-2 pb-1 border-b">Randomization</h3>
            
            <div className="mb-2">
              <label className="block text-sm mb-1">Seed: {options.randomSeed}</label>
              <input 
                type="number" 
                value={options.randomSeed} 
                onChange={e => setOptions({...options, randomSeed: parseInt(e.target.value) || 0})} 
                className="w-full p-2 border rounded text-sm"
              />
            </div>
            
            <button 
              onClick={() => setOptions({...options, randomSeed: Math.floor(Math.random() * 10000)})} 
              className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded w-full mb-2 text-sm"
            >
              Random Seed
            </button>
          </div>
          
          {/* Canvas Settings */}
          <div className="mb-4">
            <h3 className="font-medium mb-2 pb-1 border-b">Canvas</h3>
            
            <div className="mb-2">
              <label className="block text-sm mb-1">Canvas Size: {options.canvasSize}px</label>
              <input 
                type="range" 
                min="400" 
                max="1200" 
                step="50"
                value={options.canvasSize} 
                onChange={e => setOptions({...options, canvasSize: parseInt(e.target.value)})} 
                className="w-full"
              />
            </div>
          </div>
          
          {/* Export Controls */}
          <div className="flex flex-col gap-2">
            <button 
              onClick={generateTopography} 
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors text-sm"
            >
              Generate New Terrain
            </button>
            <button 
              onClick={exportSVG} 
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition-colors text-sm"
            >
              Export SVG
            </button>
          </div>
        </div>
        
        {/* Preview Panel */}
        <div className="lg:col-span-3">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Topographical Preview</h2>
            <div 
              ref={svgContainerRef} 
              className="flex justify-center items-center border border-gray-200 rounded-lg overflow-auto"
              style={{ minHeight: '600px' }}
            ></div>
            
            <div className="mt-4 text-sm">
              <p><strong>Topographical Contour Generator for Diffusion Model Structure Injection:</strong></p>
              <p className="mt-2">This generator creates organic, flowing contour line patterns that provide natural compositional structure for AI image generation:</p>
              
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-700">Structural Benefits:</h4>
                  <ul className="list-disc list-inside mt-1 space-y-1 text-xs">
                    <li><strong>Natural Flow:</strong> Organic curves guide eye movement and composition</li>
                    <li><strong>Hierarchical Structure:</strong> Major/minor contours create depth layers</li>
                    <li><strong>Terrain Logic:</strong> Follows natural elevation principles</li>
                    <li><strong>Scalable Detail:</strong> Works from macro composition to fine details</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700">Diffusion Applications:</h4>
                  <ul className="list-disc list-inside mt-1 space-y-1 text-xs">
                    <li><strong>Landscape Generation:</strong> Natural terrain structure for mountains, hills</li>
                    <li><strong>Abstract Art:</strong> Flowing organic compositions</li>
                    <li><strong>Fantasy Worlds:</strong> Otherworldly terrain formations</li>
                    <li><strong>Architectural Plans:</strong> Site topography and grading</li>
                    <li><strong>Fluid Dynamics:</strong> Flow patterns and current systems</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-3">
                <h4 className="font-medium text-gray-700">Terrain Types:</h4>
                <p className="text-xs mt-1">
                  <strong>Rolling Hills:</strong> Gentle elevation changes • 
                  <strong>Mountain Peaks:</strong> Sharp elevation spikes • 
                  <strong>Valley Systems:</strong> Depression networks • 
                  <strong>Ridge Lines:</strong> Linear elevation features • 
                  <strong>Crater Formation:</strong> Circular rim structures
                </p>
              </div>
              
              <p className="mt-3 text-xs bg-blue-50 p-2 rounded">
                <strong>Pro Tip:</strong> Use high smoothing values for organic, flowing compositions, or low smoothing for more technical, precise contour mapping. The elevation range and contour intervals can be adjusted to create different levels of structural complexity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopoContourGenerator;
