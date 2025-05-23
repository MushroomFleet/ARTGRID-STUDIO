import React, { useEffect, useRef, useState, useCallback } from 'react';

const MazeStyleGenerator = () => {
  const svgContainerRef = useRef(null);
  const [options, setOptions] = useState({
    // Grid settings
    gridSize: 40,
    cellSize: 12,
    padding: 40,
    
    // Color settings
    colorScheme: 'redOrange',
    backgroundColor: '#fff9e3',
    
    // Path settings
    minPathLength: 3,
    maxPathLength: 8,
    cornerProbability: 0.7,
    pathDensity: 0.8,
    
    // Visual effects
    strokeWidth: 3,
    dropShadow: true,
    shadowColor: '#000000',
    shadowOpacity: 0.5,
    shadowOffset: 2,
    
    // SVG filter effects
    useNoise: true,
    noiseAmount: 0.8,
    turbulenceFrequency: 0.02,
    
    // Advanced layout
    useClusters: true,
    clusterDensity: 0.6,
    useOutline: true,
    outlineWidth: 5
  });
  
  // Color schemes based on the examples
  const colorSchemes = {
    redOrange: ['#ff3b30', '#ff9500', '#4cd2ff', '#5ac8fa', '#fc96ff'],
    blueRed: ['#1a73e8', '#ea4335', '#fbbc04', '#34a853', '#ffffff'],
    monochrome: ['#e63946', '#f1faee', '#a8dadc', '#457b9d', '#1d3557'],
    vibrant: ['#ff3b30', '#ff9500', '#ffcc00', '#4cd964', '#5ac8fa', '#007aff', '#5856d6']
  };

  // Generate a random path starting from the given coordinates
  const generatePath = useCallback((startX, startY, grid, colors) => {
    const path = [];
    
    // Choose a random color for this path
    const pathColor = colors[Math.floor(Math.random() * colors.length)];
    
    // Add the starting point
    path.push({ x: startX, y: startY, color: pathColor });
    
    let currentX = startX;
    let currentY = startY;
    let lastDirection = null;
    
    const pathLength = options.minPathLength + Math.floor(Math.random() * (options.maxPathLength - options.minPathLength + 1));
    
    for (let i = 0; i < pathLength; i++) {
      // Possible directions: 0 = right, 1 = down, 2 = left, 3 = up
      let possibleDirections = [];
      
      // Check if we should continue in the same direction or make a turn
      if (lastDirection !== null && Math.random() > options.cornerProbability) {
        possibleDirections.push(lastDirection);
      } else {
        // Consider all directions
        if (currentX < options.gridSize - 1 && !grid[currentY]?.[currentX + 1]) possibleDirections.push(0);
        if (currentY < options.gridSize - 1 && grid[currentY + 1]?.[currentX] === false) possibleDirections.push(1);
        if (currentX > 0 && !grid[currentY]?.[currentX - 1]) possibleDirections.push(2);
        if (currentY > 0 && grid[currentY - 1]?.[currentX] === false) possibleDirections.push(3);
      }
      
      // If no valid directions, end the path
      if (possibleDirections.length === 0) break;
      
      // Choose a random direction
      const direction = possibleDirections[Math.floor(Math.random() * possibleDirections.length)];
      lastDirection = direction;
      
      // Move in the chosen direction
      switch (direction) {
        case 0: currentX++; break; // Right
        case 1: currentY++; break; // Down
        case 2: currentX--; break; // Left
        case 3: currentY--; break; // Up
        default: break;
      }
      
      // Add the new point to the path with the same color
      path.push({ x: currentX, y: currentY, color: pathColor });
      
      // Mark cell as occupied if in bounds
      if (currentX >= 0 && currentX < options.gridSize && currentY >= 0 && currentY < options.gridSize) {
        grid[currentY][currentX] = true;
      }
    }
    
    return path;
  }, [options.minPathLength, options.maxPathLength, options.cornerProbability, options.gridSize]);

  const generateMazeGrid = useCallback(() => {
    const container = svgContainerRef.current;
    if (!container) return;
    
    // Clear previous content
    container.innerHTML = '';
    
    // Get colors based on selected scheme
    const colors = colorSchemes[options.colorScheme] || colorSchemes.redOrange;
    
    // Calculate canvas dimensions
    const totalSize = options.gridSize * options.cellSize + 2 * options.padding;
    
    // Create SVG element
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", totalSize);
    svg.setAttribute("height", totalSize);
    svg.setAttribute("viewBox", `0 0 ${totalSize} ${totalSize}`);
    
    // Add background
    const background = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    background.setAttribute("width", totalSize);
    background.setAttribute("height", totalSize);
    background.setAttribute("fill", options.backgroundColor);
    svg.appendChild(background);
    
    // Add defs for filters
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    
    // Add drop shadow filter
    if (options.dropShadow) {
      const shadowFilter = document.createElementNS("http://www.w3.org/2000/svg", "filter");
      shadowFilter.setAttribute("id", "shadow");
      shadowFilter.setAttribute("x", "-20%");
      shadowFilter.setAttribute("y", "-20%");
      shadowFilter.setAttribute("width", "140%");
      shadowFilter.setAttribute("height", "140%");
      
      const feOffset = document.createElementNS("http://www.w3.org/2000/svg", "feOffset");
      feOffset.setAttribute("in", "SourceAlpha");
      feOffset.setAttribute("dx", options.shadowOffset);
      feOffset.setAttribute("dy", options.shadowOffset);
      feOffset.setAttribute("result", "offsetBlur");
      
      const feGaussianBlur = document.createElementNS("http://www.w3.org/2000/svg", "feGaussianBlur");
      feGaussianBlur.setAttribute("in", "offsetBlur");
      feGaussianBlur.setAttribute("stdDeviation", "1");
      feGaussianBlur.setAttribute("result", "blurResult");
      
      const feFlood = document.createElementNS("http://www.w3.org/2000/svg", "feFlood");
      feFlood.setAttribute("flood-color", options.shadowColor);
      feFlood.setAttribute("flood-opacity", options.shadowOpacity);
      feFlood.setAttribute("result", "floodResult");
      
      const feComposite = document.createElementNS("http://www.w3.org/2000/svg", "feComposite");
      feComposite.setAttribute("in", "floodResult");
      feComposite.setAttribute("in2", "blurResult");
      feComposite.setAttribute("operator", "in");
      feComposite.setAttribute("result", "shadowResult");
      
      const feMerge = document.createElementNS("http://www.w3.org/2000/svg", "feMerge");
      
      const feMergeNode1 = document.createElementNS("http://www.w3.org/2000/svg", "feMergeNode");
      feMergeNode1.setAttribute("in", "shadowResult");
      
      const feMergeNode2 = document.createElementNS("http://www.w3.org/2000/svg", "feMergeNode");
      feMergeNode2.setAttribute("in", "SourceGraphic");
      
      feMerge.appendChild(feMergeNode1);
      feMerge.appendChild(feMergeNode2);
      
      shadowFilter.appendChild(feOffset);
      shadowFilter.appendChild(feGaussianBlur);
      shadowFilter.appendChild(feFlood);
      shadowFilter.appendChild(feComposite);
      shadowFilter.appendChild(feMerge);
      
      defs.appendChild(shadowFilter);
    }
    
    // Add noise filter
    if (options.useNoise) {
      const noiseFilter = document.createElementNS("http://www.w3.org/2000/svg", "filter");
      noiseFilter.setAttribute("id", "noise");
      noiseFilter.setAttribute("x", "-30%");
      noiseFilter.setAttribute("y", "-30%");
      noiseFilter.setAttribute("width", "160%");
      noiseFilter.setAttribute("height", "160%");
      
      const turbulence = document.createElementNS("http://www.w3.org/2000/svg", "feTurbulence");
      turbulence.setAttribute("type", "turbulence");
      turbulence.setAttribute("baseFrequency", options.turbulenceFrequency);
      turbulence.setAttribute("numOctaves", "2");
      turbulence.setAttribute("seed", Math.floor(Math.random() * 100));
      turbulence.setAttribute("result", "turbulence");
      
      const displacementMap = document.createElementNS("http://www.w3.org/2000/svg", "feDisplacementMap");
      displacementMap.setAttribute("in", "SourceGraphic");
      displacementMap.setAttribute("in2", "turbulence");
      displacementMap.setAttribute("scale", options.noiseAmount * 3);
      displacementMap.setAttribute("xChannelSelector", "R");
      displacementMap.setAttribute("yChannelSelector", "G");
      
      noiseFilter.appendChild(turbulence);
      noiseFilter.appendChild(displacementMap);
      
      defs.appendChild(noiseFilter);
    }
    
    svg.appendChild(defs);
    
    // Create a container group for all paths
    const pathGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    
    // Apply filters to the whole group
    let filterString = "";
    if (options.dropShadow) filterString += "url(#shadow) ";
    if (options.useNoise) filterString += "url(#noise)";
    if (filterString) pathGroup.setAttribute("filter", filterString.trim());
    
    svg.appendChild(pathGroup);
    
    // Create a grid to track occupied cells
    const grid = Array(options.gridSize).fill().map(() => Array(options.gridSize).fill(false));
    
    // Cluster centers for more organic distribution
    const clusters = [];
    if (options.useClusters) {
      const clusterCount = Math.floor(options.gridSize / 10) + 2;
      for (let i = 0; i < clusterCount; i++) {
        clusters.push({
          x: options.padding + Math.floor(Math.random() * (options.gridSize * options.cellSize)),
          y: options.padding + Math.floor(Math.random() * (options.gridSize * options.cellSize)),
          radius: 50 + Math.floor(Math.random() * 100)
        });
      }
    }
    
    // Generate paths
    const paths = [];
    let attempts = 0;
    const maxAttempts = options.gridSize * options.gridSize * options.pathDensity;
    
    while (attempts < maxAttempts) {
      attempts++;
      
      // Choose a starting position
      let startX, startY;
      
      if (options.useClusters && clusters.length > 0 && Math.random() < options.clusterDensity) {
        // Start near a cluster center
        const cluster = clusters[Math.floor(Math.random() * clusters.length)];
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * cluster.radius;
        
        const rawX = cluster.x + Math.cos(angle) * distance;
        const rawY = cluster.y + Math.sin(angle) * distance;
        
        // Convert to grid coordinates
        startX = Math.floor((rawX - options.padding) / options.cellSize);
        startY = Math.floor((rawY - options.padding) / options.cellSize);
      } else {
        // Random start
        startX = Math.floor(Math.random() * options.gridSize);
        startY = Math.floor(Math.random() * options.gridSize);
      }
      
      // Skip if the cell is already occupied or out of bounds
      if (startX < 0 || startY < 0 || startX >= options.gridSize || startY >= options.gridSize || grid[startY][startX]) {
        continue;
      }
      
      // Generate a path
      const path = generatePath(startX, startY, grid, colors);
      
      if (path.length >= options.minPathLength) {
        paths.push(path);
        
        // Mark path cells as occupied
        path.forEach(point => {
          if (point.x >= 0 && point.x < options.gridSize && point.y >= 0 && point.y < options.gridSize) {
            grid[point.y][point.x] = true;
          }
        });
      }
    }
    
    // Draw paths
    paths.forEach(path => {
      const svgPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
      
      // Create path data
      let pathData = `M ${path[0].x * options.cellSize + options.padding} ${path[0].y * options.cellSize + options.padding}`;
      
      for (let i = 1; i < path.length; i++) {
        pathData += ` L ${path[i].x * options.cellSize + options.padding} ${path[i].y * options.cellSize + options.padding}`;
      }
      
      svgPath.setAttribute("d", pathData);
      svgPath.setAttribute("fill", "none");
      
      // Use the path color from the first point
      const pathColor = path[0].color || colors[0];
      svgPath.setAttribute("stroke", pathColor);
      svgPath.setAttribute("stroke-width", options.strokeWidth);
      svgPath.setAttribute("stroke-linecap", "square");
      svgPath.setAttribute("stroke-linejoin", "miter");
      
      pathGroup.appendChild(svgPath);
    });
    
    // Draw filled rectangles at path endpoints for the dot effect seen in the image
    paths.forEach(path => {
      if (path.length > 0) {
        // Start point
        const startDot = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        startDot.setAttribute("x", path[0].x * options.cellSize + options.padding - options.strokeWidth/2);
        startDot.setAttribute("y", path[0].y * options.cellSize + options.padding - options.strokeWidth/2);
        startDot.setAttribute("width", options.strokeWidth);
        startDot.setAttribute("height", options.strokeWidth);
        startDot.setAttribute("fill", path[0].color || colors[0]);
        
        // End point
        const endDot = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        const endPoint = path[path.length - 1];
        endDot.setAttribute("x", endPoint.x * options.cellSize + options.padding - options.strokeWidth/2);
        endDot.setAttribute("y", endPoint.y * options.cellSize + options.padding - options.strokeWidth/2);
        endDot.setAttribute("width", options.strokeWidth);
        endDot.setAttribute("height", options.strokeWidth);
        endDot.setAttribute("fill", endPoint.color || colors[0]);
        
        pathGroup.appendChild(startDot);
        pathGroup.appendChild(endDot);
      }
    });
    
    // Add border outline if enabled
    if (options.useOutline) {
      const outline = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      const outlineSize = options.gridSize * options.cellSize;
      outline.setAttribute("x", options.padding);
      outline.setAttribute("y", options.padding);
      outline.setAttribute("width", outlineSize);
      outline.setAttribute("height", outlineSize);
      outline.setAttribute("fill", "none");
      outline.setAttribute("stroke", "#000000");
      outline.setAttribute("stroke-width", options.outlineWidth);
      svg.appendChild(outline);
    }
    
    container.appendChild(svg);
  }, [options, colorSchemes, generatePath]);

  // Generate the maze-like grid when component mounts
  useEffect(() => {
    generateMazeGrid();
  }, [generateMazeGrid]);

  // Generate the maze-like grid when options change
  // Using a separate effect to avoid the initial render error
  useEffect(() => {
    if (svgContainerRef.current) {
      generateMazeGrid();
    }
  }, [options, generateMazeGrid]);
  
  const exportSVG = () => {
    if (!svgContainerRef.current) return;
    
    const svgData = svgContainerRef.current.innerHTML;
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'maze-grid-artwork.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="max-w-6xl mx-auto p-4 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-center">Maze-Style Grid Generator</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Controls Panel */}
        <div className="md:col-span-1 bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Controls</h2>
          
          {/* Grid Settings */}
          <div className="mb-6">
            <h3 className="font-medium mb-2 pb-1 border-b">Grid Settings</h3>
            
            <div className="mb-3">
              <label className="block text-sm mb-1">Grid Density: {options.gridSize}</label>
              <input 
                type="range" 
                min="20" 
                max="60" 
                value={options.gridSize} 
                onChange={e => setOptions({...options, gridSize: parseInt(e.target.value)})} 
                className="w-full"
              />
            </div>
            
            <div className="mb-3">
              <label className="block text-sm mb-1">Cell Size: {options.cellSize}px</label>
              <input 
                type="range" 
                min="8" 
                max="16" 
                value={options.cellSize} 
                onChange={e => setOptions({...options, cellSize: parseInt(e.target.value)})} 
                className="w-full"
              />
            </div>
            
            <div className="mb-3">
              <label className="block text-sm mb-1">Path Density: {options.pathDensity.toFixed(2)}</label>
              <input 
                type="range" 
                min="0.4" 
                max="1" 
                step="0.05"
                value={options.pathDensity} 
                onChange={e => setOptions({...options, pathDensity: parseFloat(e.target.value)})} 
                className="w-full"
              />
            </div>
          </div>
          
          {/* Visual Style */}
          <div className="mb-6">
            <h3 className="font-medium mb-2 pb-1 border-b">Visual Style</h3>
            
            <div className="mb-3">
              <label className="block text-sm mb-1">Color Scheme</label>
              <select 
                value={options.colorScheme} 
                onChange={e => setOptions({...options, colorScheme: e.target.value})}
                className="w-full p-2 border rounded"
              >
                <option value="redOrange">Red-Orange (Like Image 2)</option>
                <option value="blueRed">Blue-Red</option>
                <option value="monochrome">Monochrome</option>
                <option value="vibrant">Vibrant</option>
              </select>
            </div>
            
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
              <label className="block text-sm mb-1">Stroke Width: {options.strokeWidth}</label>
              <input 
                type="range" 
                min="2" 
                max="6" 
                value={options.strokeWidth} 
                onChange={e => setOptions({...options, strokeWidth: parseInt(e.target.value)})} 
                className="w-full"
              />
            </div>
          </div>
          
          {/* Path Settings */}
          <div className="mb-6">
            <h3 className="font-medium mb-2 pb-1 border-b">Path Settings</h3>
            
            <div className="mb-3">
              <label className="block text-sm mb-1">Min Path Length: {options.minPathLength}</label>
              <input 
                type="range" 
                min="2" 
                max="6" 
                value={options.minPathLength} 
                onChange={e => setOptions({...options, minPathLength: parseInt(e.target.value)})} 
                className="w-full"
              />
            </div>
            
            <div className="mb-3">
              <label className="block text-sm mb-1">Max Path Length: {options.maxPathLength}</label>
              <input 
                type="range" 
                min="4" 
                max="12" 
                value={options.maxPathLength} 
                onChange={e => setOptions({...options, maxPathLength: parseInt(e.target.value)})} 
                className="w-full"
              />
            </div>
            
            <div className="mb-3">
              <label className="block text-sm mb-1">Corner Probability: {options.cornerProbability.toFixed(2)}</label>
              <input 
                type="range" 
                min="0.3" 
                max="0.9" 
                step="0.05"
                value={options.cornerProbability} 
                onChange={e => setOptions({...options, cornerProbability: parseFloat(e.target.value)})} 
                className="w-full"
              />
            </div>
            
            <div className="mb-3 flex items-center">
              <input 
                type="checkbox"
                id="useClusters"
                checked={options.useClusters}
                onChange={e => setOptions({...options, useClusters: e.target.checked})}
                className="mr-2"
              />
              <label htmlFor="useClusters" className="text-sm">Use Clusters</label>
            </div>
            
            {options.useClusters && (
              <div className="mb-3">
                <label className="block text-sm mb-1">Cluster Density: {options.clusterDensity.toFixed(2)}</label>
                <input 
                  type="range" 
                  min="0.2" 
                  max="0.8" 
                  step="0.05"
                  value={options.clusterDensity} 
                  onChange={e => setOptions({...options, clusterDensity: parseFloat(e.target.value)})} 
                  className="w-full"
                />
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
                onChange={e => setOptions({...options, dropShadow: e.target.checked})}
                className="mr-2"
              />
              <label htmlFor="dropShadow" className="text-sm">Drop Shadow</label>
            </div>
            
            {options.dropShadow && (
              <div className="mb-3">
                <label className="block text-sm mb-1">Shadow Offset: {options.shadowOffset}px</label>
                <input 
                  type="range" 
                  min="1" 
                  max="5" 
                  value={options.shadowOffset} 
                  onChange={e => setOptions({...options, shadowOffset: parseInt(e.target.value)})} 
                  className="w-full"
                />
                
                <label className="block text-sm mb-1 mt-2">Shadow Opacity: {options.shadowOpacity.toFixed(2)}</label>
                <input 
                  type="range" 
                  min="0.1" 
                  max="1" 
                  step="0.05"
                  value={options.shadowOpacity} 
                  onChange={e => setOptions({...options, shadowOpacity: parseFloat(e.target.value)})} 
                  className="w-full"
                />
              </div>
            )}
            
            <div className="mb-3 flex items-center">
              <input 
                type="checkbox"
                id="useNoise"
                checked={options.useNoise}
                onChange={e => setOptions({...options, useNoise: e.target.checked})}
                className="mr-2"
              />
              <label htmlFor="useNoise" className="text-sm">Noise Effect</label>
            </div>
            
            {options.useNoise && (
              <div className="mb-3">
                <label className="block text-sm mb-1">Noise Amount: {options.noiseAmount.toFixed(2)}</label>
                <input 
                  type="range" 
                  min="0.2" 
                  max="1.5" 
                  step="0.1"
                  value={options.noiseAmount} 
                  onChange={e => setOptions({...options, noiseAmount: parseFloat(e.target.value)})} 
                  className="w-full"
                />
                
                <label className="block text-sm mb-1 mt-2">Turbulence: {options.turbulenceFrequency.toFixed(3)}</label>
                <input 
                  type="range" 
                  min="0.005" 
                  max="0.05" 
                  step="0.005"
                  value={options.turbulenceFrequency} 
                  onChange={e => setOptions({...options, turbulenceFrequency: parseFloat(e.target.value)})} 
                  className="w-full"
                />
              </div>
            )}
            
            <div className="mb-3 flex items-center">
              <input 
                type="checkbox"
                id="useOutline"
                checked={options.useOutline}
                onChange={e => setOptions({...options, useOutline: e.target.checked})}
                className="mr-2"
              />
              <label htmlFor="useOutline" className="text-sm">Square Outline</label>
            </div>
            
            {options.useOutline && (
              <div className="mb-3">
                <label className="block text-sm mb-1">Outline Width: {options.outlineWidth}px</label>
                <input 
                  type="range" 
                  min="1" 
                  max="10" 
                  value={options.outlineWidth} 
                  onChange={e => setOptions({...options, outlineWidth: parseInt(e.target.value)})} 
                  className="w-full"
                />
              </div>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-2">
            <button 
              onClick={() => generateMazeGrid()} 
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors"
            >
              Generate New
            </button>
            <button 
              onClick={exportSVG} 
              className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition-colors"
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
            ></div>
            
            <div className="mt-4 text-sm">
              <p><strong>About this Generator:</strong></p>
              <p className="mt-2">This specialized generator creates maze-like grid patterns similar to Image 2 in the examples. Key features:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Path-based grid generation with controlled density and length</li>
                <li>Drop shadow effects for the characteristic depth appearance</li>
                <li>Turbulence filter for the hand-drawn, organic aesthetic</li>
                <li>Color schemes focused on the red-orange-blue palette from the reference</li>
                <li>Cluster-based distribution for more organic, natural-looking patterns</li>
              </ul>
              <p className="mt-2">The SVG export can be further refined in vector editing software if needed.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MazeStyleGenerator;
