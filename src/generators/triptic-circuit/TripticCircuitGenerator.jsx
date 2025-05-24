import React, { useEffect, useRef, useState } from 'react';
import { defaultConfig, colorSchemes, constraints, panelTypeNames } from './config.js';

const TripticCircuitGenerator = () => {
  const svgContainerRef = useRef(null);
  const [options, setOptions] = useState(defaultConfig);

  // Generate artwork when component mounts or options change
  useEffect(() => {
    generateCircuitPattern();
  }, [options]);

  const generateCircuitPattern = () => {
    const container = svgContainerRef.current;
    if (!container) return;

    // Clear previous content
    container.innerHTML = '';

    // Get selected color scheme based on panel type
    const colors = colorSchemes[options.panelType];

    // Calculate canvas dimensions
    const canvasSize = 600;
    const cellSize = (canvasSize - (2 * options.padding)) / options.gridSize;

    // Create SVG element
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", canvasSize);
    svg.setAttribute("height", canvasSize);
    svg.setAttribute("viewBox", `0 0 ${canvasSize} ${canvasSize}`);

    // Add background
    const background = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    background.setAttribute("width", canvasSize);
    background.setAttribute("height", canvasSize);
    background.setAttribute("fill", colors.background);
    svg.appendChild(background);

    // Create a grid for tracking occupied cells
    const grid = Array(options.gridSize).fill().map(() => Array(options.gridSize).fill(false));

    // Add definitions section for patterns
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    svg.appendChild(defs);

    // Create hatching patterns for left panel
    if (options.panelType === 'left') {
      createHatchingPatterns(defs, colors);
    }

    // Generate the main structures based on panel type
    switch(options.panelType) {
      case 'left':
        generateHatchedShapes(svg, grid, cellSize, colors);
        break;
      case 'center':
        generateColorBlocks(svg, grid, cellSize, colors);
        break;
      case 'right':
        generateBlocksWithPaths(svg, grid, cellSize, colors);
        break;
      default:
        generateHatchedShapes(svg, grid, cellSize, colors);
    }

    // Add connector lines and paths
    if (options.includeConnectors) {
      addConnectorPaths(svg, grid, cellSize, colors);
    }

    // Add small details
    if (options.includeSmallDetails) {
      addSmallDetails(svg, grid, cellSize, colors);
    }

    // Add the SVG to the container
    container.appendChild(svg);
  };

  // Create hatching patterns for the left panel
  const createHatchingPatterns = (defs, colors) => {
    // Basic hatch pattern
    const hatchPattern = document.createElementNS("http://www.w3.org/2000/svg", "pattern");
    hatchPattern.setAttribute("id", "hatchPattern");
    hatchPattern.setAttribute("patternUnits", "userSpaceOnUse");
    hatchPattern.setAttribute("width", options.lineSpacing);
    hatchPattern.setAttribute("height", options.lineSpacing);

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", "0");
    line.setAttribute("y1", "0");
    line.setAttribute("x2", options.lineSpacing);
    line.setAttribute("y2", options.lineSpacing);
    line.setAttribute("stroke", colors.primary);
    line.setAttribute("stroke-width", options.lineThickness);

    hatchPattern.appendChild(line);
    defs.appendChild(hatchPattern);

    // Cross-hatch pattern
    const crossHatchPattern = document.createElementNS("http://www.w3.org/2000/svg", "pattern");
    crossHatchPattern.setAttribute("id", "crossHatchPattern");
    crossHatchPattern.setAttribute("patternUnits", "userSpaceOnUse");
    crossHatchPattern.setAttribute("width", options.lineSpacing);
    crossHatchPattern.setAttribute("height", options.lineSpacing);

    const line1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line1.setAttribute("x1", "0");
    line1.setAttribute("y1", "0");
    line1.setAttribute("x2", options.lineSpacing);
    line1.setAttribute("y2", options.lineSpacing);
    line1.setAttribute("stroke", colors.primary);
    line1.setAttribute("stroke-width", options.lineThickness);

    const line2 = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line2.setAttribute("x1", "0");
    line2.setAttribute("y1", options.lineSpacing);
    line2.setAttribute("x2", options.lineSpacing);
    line2.setAttribute("y2", "0");
    line2.setAttribute("stroke", colors.primary);
    line2.setAttribute("stroke-width", options.lineThickness);

    crossHatchPattern.appendChild(line1);
    crossHatchPattern.appendChild(line2);
    defs.appendChild(crossHatchPattern);

    // Horizontal line pattern
    const horizontalPattern = document.createElementNS("http://www.w3.org/2000/svg", "pattern");
    horizontalPattern.setAttribute("id", "horizontalPattern");
    horizontalPattern.setAttribute("patternUnits", "userSpaceOnUse");
    horizontalPattern.setAttribute("width", options.lineSpacing);
    horizontalPattern.setAttribute("height", options.lineSpacing);

    const hline = document.createElementNS("http://www.w3.org/2000/svg", "line");
    hline.setAttribute("x1", "0");
    hline.setAttribute("y1", options.lineSpacing / 2);
    hline.setAttribute("x2", options.lineSpacing);
    hline.setAttribute("y2", options.lineSpacing / 2);
    hline.setAttribute("stroke", colors.primary);
    hline.setAttribute("stroke-width", options.lineThickness);

    horizontalPattern.appendChild(hline);
    defs.appendChild(horizontalPattern);

    // Vertical line pattern
    const verticalPattern = document.createElementNS("http://www.w3.org/2000/svg", "pattern");
    verticalPattern.setAttribute("id", "verticalPattern");
    verticalPattern.setAttribute("patternUnits", "userSpaceOnUse");
    verticalPattern.setAttribute("width", options.lineSpacing);
    verticalPattern.setAttribute("height", options.lineSpacing);

    const vline = document.createElementNS("http://www.w3.org/2000/svg", "line");
    vline.setAttribute("x1", options.lineSpacing / 2);
    vline.setAttribute("y1", "0");
    vline.setAttribute("x2", options.lineSpacing / 2);
    vline.setAttribute("y2", options.lineSpacing);
    vline.setAttribute("stroke", colors.primary);
    vline.setAttribute("stroke-width", options.lineThickness);

    verticalPattern.appendChild(vline);
    defs.appendChild(verticalPattern);
  };

  // Generate hatched shapes (left panel style)
  const generateHatchedShapes = (svg, grid, cellSize, colors) => {
    const shapesGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");

    // Number of shapes to generate
    const numShapes = Math.floor(options.gridSize * options.gridSize * options.shapeDensity / 20);

    for (let i = 0; i < numShapes; i++) {
      // Determine shape size
      const width = Math.floor(Math.random() * 
        (options.maxShapeSize - options.minShapeSize + 1)) + options.minShapeSize;
      const height = Math.floor(Math.random() * 
        (options.maxShapeSize - options.minShapeSize + 1)) + options.minShapeSize;

      // Find a position for the shape
      let attempts = 0;
      let placed = false;

      while (attempts < 50 && !placed) {
        attempts++;

        const x = Math.floor(Math.random() * (options.gridSize - width));
        const y = Math.floor(Math.random() * (options.gridSize - height));

        // Check if area is available
        let areaAvailable = true;
        for (let dy = 0; dy < height && areaAvailable; dy++) {
          for (let dx = 0; dx < width && areaAvailable; dx++) {
            if (grid[y + dy][x + dx]) {
              areaAvailable = false;
            }
          }
        }

        if (areaAvailable) {
          // Mark area as occupied
          for (let dy = 0; dy < height; dy++) {
            for (let dx = 0; dx < width; dx++) {
              grid[y + dy][x + dx] = true;
            }
          }

          // Create shape
          const shape = document.createElementNS("http://www.w3.org/2000/svg", "rect");
          shape.setAttribute("x", x * cellSize + options.padding);
          shape.setAttribute("y", y * cellSize + options.padding);
          shape.setAttribute("width", width * cellSize);
          shape.setAttribute("height", height * cellSize);
          shape.setAttribute("stroke", colors.primary);
          shape.setAttribute("stroke-width", options.lineThickness);

          // Choose a pattern type for the shape
          const patternTypes = ["hatchPattern", "crossHatchPattern", "horizontalPattern", "verticalPattern"];
          const patternType = patternTypes[Math.floor(Math.random() * patternTypes.length)];

          shape.setAttribute("fill", `url(#${patternType})`);

          shapesGroup.appendChild(shape);
          placed = true;
        }
      }
    }

    svg.appendChild(shapesGroup);
  };

  // Generate color blocks with borders (center panel style)
  const generateColorBlocks = (svg, grid, cellSize, colors) => {
    const blocksGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");

    // Create a large central shape
    const centerWidth = Math.floor(options.gridSize * 0.6);
    const centerHeight = Math.floor(options.gridSize * 0.7);
    const centerX = Math.floor((options.gridSize - centerWidth) / 2);
    const centerY = Math.floor((options.gridSize - centerHeight) / 2);

    // Create the central shape with jagged edges
    const centralShape = createJaggedShape(
      centerX, 
      centerY, 
      centerWidth, 
      centerHeight,
      options.shapeComplexity,
      cellSize,
      colors.primary
    );
    blocksGroup.appendChild(centralShape);

    // Mark area as occupied
    for (let y = centerY; y < centerY + centerHeight; y++) {
      for (let x = centerX; x < centerX + centerWidth; x++) {
        if (y < options.gridSize && x < options.gridSize) {
          grid[y][x] = true;
        }
      }
    }

    // Add secondary shapes with the secondary color
    const numSecondaryShapes = Math.floor(options.gridSize * 0.15);

    for (let i = 0; i < numSecondaryShapes; i++) {
      const width = Math.floor(Math.random() * 
        (options.maxShapeSize - options.minShapeSize + 1)) + options.minShapeSize;
      const height = Math.floor(Math.random() * 
        (options.maxShapeSize - options.minShapeSize + 1)) + options.minShapeSize;

      let attempts = 0;
      let placed = false;

      while (attempts < 50 && !placed) {
        attempts++;

        const x = Math.floor(Math.random() * (options.gridSize - width));
        const y = Math.floor(Math.random() * (options.gridSize - height));

        // Check if area is available
        let areaAvailable = true;
        for (let dy = 0; dy < height && areaAvailable; dy++) {
          for (let dx = 0; dx < width && areaAvailable; dx++) {
            if (grid[y + dy][x + dx]) {
              areaAvailable = false;
            }
          }
        }

        if (areaAvailable) {
          // Mark area as occupied
          for (let dy = 0; dy < height; dy++) {
            for (let dx = 0; dx < width; dx++) {
              grid[y + dy][x + dx] = true;
            }
          }

          // Create a jagged shape
          const shape = createJaggedShape(
            x, 
            y, 
            width, 
            height,
            options.shapeComplexity,
            cellSize,
            colors.secondary
          );

          blocksGroup.appendChild(shape);
          placed = true;
        }
      }
    }

    // Add small accent details
    const numAccentShapes = Math.floor(options.gridSize * 0.1);

    for (let i = 0; i < numAccentShapes; i++) {
      const size = Math.floor(Math.random() * 2) + 1;

      let attempts = 0;
      let placed = false;

      while (attempts < 50 && !placed) {
        attempts++;

        const x = Math.floor(Math.random() * (options.gridSize - size));
        const y = Math.floor(Math.random() * (options.gridSize - size));

        // Check if area is available
        let areaAvailable = true;
        for (let dy = 0; dy < size && areaAvailable; dy++) {
          for (let dx = 0; dx < size && areaAvailable; dx++) {
            if (grid[y + dy][x + dx]) {
              areaAvailable = false;
            }
          }
        }

        if (areaAvailable) {
          // Mark area as occupied
          for (let dy = 0; dy < size; dy++) {
            for (let dx = 0; dx < size; dx++) {
              grid[y + dy][x + dx] = true;
            }
          }

          // Create a small square or rectangle
          const shape = document.createElementNS("http://www.w3.org/2000/svg", "rect");
          shape.setAttribute("x", x * cellSize + options.padding);
          shape.setAttribute("y", y * cellSize + options.padding);
          shape.setAttribute("width", size * cellSize);
          shape.setAttribute("height", size * cellSize);
          shape.setAttribute("fill", colors.accent);
          shape.setAttribute("stroke", colors.primary);
          shape.setAttribute("stroke-width", options.lineThickness);

          blocksGroup.appendChild(shape);
          placed = true;
        }
      }
    }

    svg.appendChild(blocksGroup);
  };

  // Generate blocks with circuit-like paths (right panel style)
  const generateBlocksWithPaths = (svg, grid, cellSize, colors) => {
    const blocksGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");

    // Create rectangular blocks
    const numBlocks = Math.floor(options.gridSize * options.gridSize * options.shapeDensity / 16);

    for (let i = 0; i < numBlocks; i++) {
      const width = Math.floor(Math.random() * 
        (options.maxShapeSize - options.minShapeSize + 1)) + options.minShapeSize;
      const height = Math.floor(Math.random() * 
        (options.maxShapeSize - options.minShapeSize + 1)) + options.minShapeSize;

      let attempts = 0;
      let placed = false;

      while (attempts < 50 && !placed) {
        attempts++;

        const x = Math.floor(Math.random() * (options.gridSize - width));
        const y = Math.floor(Math.random() * (options.gridSize - height));

        // Check if area is available
        let areaAvailable = true;
        for (let dy = 0; dy < height && areaAvailable; dy++) {
          for (let dx = 0; dx < width && areaAvailable; dx++) {
            if (grid[y + dy][x + dx]) {
              areaAvailable = false;
            }
          }
        }

        if (areaAvailable) {
          // Mark area as occupied
          for (let dy = 0; dy < height; dy++) {
            for (let dx = 0; dx < width; dx++) {
              grid[y + dy][x + dx] = true;
            }
          }

          // Create the block
          const block = document.createElementNS("http://www.w3.org/2000/svg", "rect");
          block.setAttribute("x", x * cellSize + options.padding);
          block.setAttribute("y", y * cellSize + options.padding);
          block.setAttribute("width", width * cellSize);
          block.setAttribute("height", height * cellSize);
          block.setAttribute("fill", colors.primary);
          block.setAttribute("stroke", colors.accent);
          block.setAttribute("stroke-width", options.lineThickness);

          blocksGroup.appendChild(block);
          placed = true;
        }
      }
    }

    svg.appendChild(blocksGroup);
  };

  // Helper function to create a jagged shape for the center panel
  const createJaggedShape = (x, y, width, height, complexity, cellSize, color) => {
    // Calculate pixel coordinates
    const pixelX = x * cellSize + options.padding;
    const pixelY = y * cellSize + options.padding;
    const pixelWidth = width * cellSize;
    const pixelHeight = height * cellSize;

    // Decide on how many jagged edges to have
    const jaggedPoints = Math.floor(complexity * 20) + 5;

    // Create path data for the shape
    let pathData = `M ${pixelX} ${pixelY}`;

    // Top edge
    for (let i = 0; i < jaggedPoints; i++) {
      const xPos = pixelX + (pixelWidth * i / jaggedPoints);
      const yOffset = Math.random() > 0.5 ? -cellSize : 0;
      pathData += ` L ${xPos} ${pixelY + yOffset}`;
    }
    pathData += ` L ${pixelX + pixelWidth} ${pixelY}`;

    // Right edge
    for (let i = 0; i < jaggedPoints; i++) {
      const yPos = pixelY + (pixelHeight * i / jaggedPoints);
      const xOffset = Math.random() > 0.5 ? cellSize : 0;
      pathData += ` L ${pixelX + pixelWidth + xOffset} ${yPos}`;
    }
    pathData += ` L ${pixelX + pixelWidth} ${pixelY + pixelHeight}`;

    // Bottom edge
    for (let i = 0; i < jaggedPoints; i++) {
      const xPos = pixelX + pixelWidth - (pixelWidth * i / jaggedPoints);
      const yOffset = Math.random() > 0.5 ? cellSize : 0;
      pathData += ` L ${xPos} ${pixelY + pixelHeight + yOffset}`;
    }
    pathData += ` L ${pixelX} ${pixelY + pixelHeight}`;

    // Left edge
    for (let i = 0; i < jaggedPoints; i++) {
      const yPos = pixelY + pixelHeight - (pixelHeight * i / jaggedPoints);
      const xOffset = Math.random() > 0.5 ? -cellSize : 0;
      pathData += ` L ${pixelX + xOffset} ${yPos}`;
    }
    pathData += ` Z`;

    // Create the path element
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", pathData);
    path.setAttribute("fill", color);
    path.setAttribute("stroke", "#000000");
    path.setAttribute("stroke-width", options.lineThickness);

    return path;
  };

  // Add connector paths and circuit-like lines
  const addConnectorPaths = (svg, grid, cellSize, colors) => {
    const pathsGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");

    // Number of paths to create
    const numPaths = Math.floor(options.gridSize * options.pathDensity);

    for (let i = 0; i < numPaths; i++) {
      // Create a path that connects different parts of the grid
      const startX = Math.floor(Math.random() * options.gridSize);
      const startY = Math.floor(Math.random() * options.gridSize);

      // Create path data
      let pathData = `M ${startX * cellSize + options.padding} ${startY * cellSize + options.padding}`;

      // Create a winding path with right angles (circuit-like)
      let currentX = startX;
      let currentY = startY;
      const steps = Math.floor(Math.random() * 10) + 5;

      for (let j = 0; j < steps; j++) {
        // Decide direction: 0 = right, 1 = down, 2 = left, 3 = up
        const direction = Math.floor(Math.random() * 4);
        const stepLength = Math.floor(Math.random() * 5) + 1;

        let newX = currentX;
        let newY = currentY;

        switch(direction) {
          case 0: newX = Math.min(options.gridSize - 1, currentX + stepLength); break;
          case 1: newY = Math.min(options.gridSize - 1, currentY + stepLength); break;
          case 2: newX = Math.max(0, currentX - stepLength); break;
          case 3: newY = Math.max(0, currentY - stepLength); break;
        }

        // Add line segment
        pathData += ` L ${newX * cellSize + options.padding} ${newY * cellSize + options.padding}`;

        currentX = newX;
        currentY = newY;
      }

      // Create the path element
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", pathData);
      path.setAttribute("fill", "none");
      path.setAttribute("stroke", colors.primary);
      path.setAttribute("stroke-width", options.lineThickness);

      pathsGroup.appendChild(path);
    }

    svg.appendChild(pathsGroup);
  };

  // Add small decorative details
  const addSmallDetails = (svg, grid, cellSize, colors) => {
    const detailsGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");

    // Number of details to add
    const numDetails = Math.floor(options.gridSize * options.gridSize * options.detailDensity / 20);

    for (let i = 0; i < numDetails; i++) {
      const x = Math.floor(Math.random() * options.gridSize);
      const y = Math.floor(Math.random() * options.gridSize);

      // Skip if cell is already occupied
      if (grid[y][x]) continue;

      // Choose a detail type
      const detailType = Math.floor(Math.random() * 5);

      switch(detailType) {
        case 0: // Dot
          const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
          dot.setAttribute("cx", x * cellSize + options.padding + cellSize/2);
          dot.setAttribute("cy", y * cellSize + options.padding + cellSize/2);
          dot.setAttribute("r", cellSize/4);
          dot.setAttribute("fill", colors.accent);
          detailsGroup.appendChild(dot);
          break;

        case 1: // Small square
          const square = document.createElementNS("http://www.w3.org/2000/svg", "rect");
          square.setAttribute("x", x * cellSize + options.padding + cellSize/4);
          square.setAttribute("y", y * cellSize + options.padding + cellSize/4);
          square.setAttribute("width", cellSize/2);
          square.setAttribute("height", cellSize/2);
          square.setAttribute("fill", colors.accent);
          detailsGroup.appendChild(square);
          break;

        case 2: // Plus sign
          const plusGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");

          const hLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
          hLine.setAttribute("x1", x * cellSize + options.padding + cellSize/4);
          hLine.setAttribute("y1", y * cellSize + options.padding + cellSize/2);
          hLine.setAttribute("x2", x * cellSize + options.padding + cellSize*3/4);
          hLine.setAttribute("y2", y * cellSize + options.padding + cellSize/2);
          hLine.setAttribute("stroke", colors.accent);
          hLine.setAttribute("stroke-width", options.lineThickness);

          const vLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
          vLine.setAttribute("x1", x * cellSize + options.padding + cellSize/2);
          vLine.setAttribute("y1", y * cellSize + options.padding + cellSize/4);
          vLine.setAttribute("x2", x * cellSize + options.padding + cellSize/2);
          vLine.setAttribute("y2", y * cellSize + options.padding + cellSize*3/4);
          vLine.setAttribute("stroke", colors.accent);
          vLine.setAttribute("stroke-width", options.lineThickness);

          plusGroup.appendChild(hLine);
          plusGroup.appendChild(vLine);
          detailsGroup.appendChild(plusGroup);
          break;

        case 3: // Small corner
          const corner = document.createElementNS("http://www.w3.org/2000/svg", "path");
          const cornerPath = `M ${x * cellSize + options.padding + cellSize/4} ${y * cellSize + options.padding + cellSize/2} 
                             L ${x * cellSize + options.padding + cellSize/4} ${y * cellSize + options.padding + cellSize/4} 
                             L ${x * cellSize + options.padding + cellSize/2} ${y * cellSize + options.padding + cellSize/4}`;
          corner.setAttribute("d", cornerPath);
          corner.setAttribute("fill", "none");
          corner.setAttribute("stroke", colors.accent);
          corner.setAttribute("stroke-width", options.lineThickness);
          detailsGroup.appendChild(corner);
          break;

        case 4: // Small T-junction
          const tJunction = document.createElementNS("http://www.w3.org/2000/svg", "path");
          const tPath = `M ${x * cellSize + options.padding + cellSize/4} ${y * cellSize + options.padding + cellSize/4} 
                        L ${x * cellSize + options.padding + cellSize*3/4} ${y * cellSize + options.padding + cellSize/4} 
                        M ${x * cellSize + options.padding + cellSize/2} ${y * cellSize + options.padding + cellSize/4} 
                        L ${x * cellSize + options.padding + cellSize/2} ${y * cellSize + options.padding + cellSize*3/4}`;
          tJunction.setAttribute("d", tPath);
          tJunction.setAttribute("fill", "none");
          tJunction.setAttribute("stroke", colors.accent);
          tJunction.setAttribute("stroke-width", options.lineThickness);
          detailsGroup.appendChild(tJunction);
          break;
      }

      // Mark cell as occupied
      grid[y][x] = true;
    }

    svg.appendChild(detailsGroup);
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
    link.download = `triptic-circuit-${options.panelType}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Generate all three panels as a triptych
  const generateTriptych = () => {
    // Save current settings
    const currentType = options.panelType;

    // Generate and export each panel
    const panels = ['left', 'center', 'right'];
    
    panels.forEach((panelType, index) => {
      setTimeout(() => {
        setOptions({...options, panelType});
        
        // Give a moment for the state to update and regenerate
        setTimeout(() => {
          exportSVG();
          
          // Restore settings after the last export
          if (index === panels.length - 1) {
            setTimeout(() => {
              setOptions({...options, panelType: currentType});
            }, 500);
          }
        }, 300);
      }, index * 800);
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-4 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-center">Triptych Circuit Pattern Generator</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Controls Panel */}
        <div className="md:col-span-1 bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Controls</h2>
          
          {/* Panel Type Selection */}
          <div className="mb-6">
            <h3 className="font-medium mb-2 pb-1 border-b">Panel Type</h3>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => setOptions({...options, panelType: 'left'})}
                className={`px-4 py-2 ${options.panelType === 'left' ? 
                  'bg-yellow-400 text-black' : 'bg-gray-200 text-gray-700'} rounded`}
              >
                {panelTypeNames.left}
              </button>
              <button 
                onClick={() => setOptions({...options, panelType: 'center'})}
                className={`px-4 py-2 ${options.panelType === 'center' ? 
                  'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'} rounded`}
              >
                {panelTypeNames.center}
              </button>
              <button 
                onClick={() => setOptions({...options, panelType: 'right'})}
                className={`px-4 py-2 ${options.panelType === 'right' ? 
                  'bg-lime-400 text-black' : 'bg-gray-200 text-gray-700'} rounded`}
              >
                {panelTypeNames.right}
              </button>
            </div>
          </div>
          
          {/* Grid Settings */}
          <div className="mb-6">
            <h3 className="font-medium mb-2 pb-1 border-b">Grid Settings</h3>
            
            <div className="mb-3">
              <label className="block text-sm mb-1">Grid Size: {options.gridSize}</label>
              <input 
                type="range" 
                min={constraints.gridSize.min} 
                max={constraints.gridSize.max} 
                value={options.gridSize} 
                onChange={e => setOptions({...options, gridSize: parseInt(e.target.value)})} 
                className="w-full"
              />
              <span className="text-xs text-gray-500">Controls the level of detail</span>
            </div>
            
            <div className="mb-3">
              <label className="block text-sm mb-1">Line Thickness: {options.lineThickness}</label>
              <input 
                type="range" 
                min={constraints.lineThickness.min} 
                max={constraints.lineThickness.max} 
                value={options.lineThickness} 
                onChange={e => setOptions({...options, lineThickness: parseInt(e.target.value)})} 
                className="w-full"
              />
            </div>
            
            <div className="mb-3">
              <label className="block text-sm mb-1">Line Spacing: {options.lineSpacing}</label>
              <input 
                type="range" 
                min={constraints.lineSpacing.min} 
                max={constraints.lineSpacing.max} 
                value={options.lineSpacing} 
                onChange={e => setOptions({...options, lineSpacing: parseInt(e.target.value)})} 
                className="w-full"
              />
              <span className="text-xs text-gray-500">For hatching patterns</span>
            </div>
          </div>
          
          {/* Shape Settings */}
          <div className="mb-6">
            <h3 className="font-medium mb-2 pb-1 border-b">Shape Settings</h3>
            
            <div className="mb-3">
              <label className="block text-sm mb-1">Min Shape Size: {options.minShapeSize}</label>
              <input 
                type="range" 
                min={constraints.minShapeSize.min} 
                max={constraints.minShapeSize.max} 
                value={options.minShapeSize} 
                onChange={e => setOptions({...options, minShapeSize: parseInt(e.target.value)})} 
                className="w-full"
              />
            </div>
            
            <div className="mb-3">
              <label className="block text-sm mb-1">Max Shape Size: {options.maxShapeSize}</label>
              <input 
                type="range" 
                min={constraints.maxShapeSize.min} 
                max={constraints.maxShapeSize.max} 
                value={options.maxShapeSize} 
                onChange={e => setOptions({...options, maxShapeSize: parseInt(e.target.value)})} 
                className="w-full"
              />
            </div>
            
            <div className="mb-3">
              <label className="block text-sm mb-1">Shape Density: {options.shapeDensity.toFixed(2)}</label>
              <input 
                type="range" 
                min={constraints.shapeDensity.min} 
                max={constraints.shapeDensity.max} 
                step={constraints.shapeDensity.step}
                value={options.shapeDensity} 
                onChange={e => setOptions({...options, shapeDensity: parseFloat(e.target.value)})} 
                className="w-full"
              />
            </div>
            
            <div className="mb-3">
              <label className="block text-sm mb-1">Shape Complexity: {options.shapeComplexity.toFixed(2)}</label>
              <input 
                type="range" 
                min={constraints.shapeComplexity.min} 
                max={constraints.shapeComplexity.max} 
                step={constraints.shapeComplexity.step}
                value={options.shapeComplexity} 
                onChange={e => setOptions({...options, shapeComplexity: parseFloat(e.target.value)})} 
                className="w-full"
              />
              <span className="text-xs text-gray-500">For jagged edges</span>
            </div>
          </div>
          
          {/* Connection Settings */}
          <div className="mb-6">
            <h3 className="font-medium mb-2 pb-1 border-b">Connection Settings</h3>
            
            <div className="mb-3 flex items-center">
              <input 
                type="checkbox"
                id="includeConnectors"
                checked={options.includeConnectors}
                onChange={e => setOptions({...options, includeConnectors: e.target.checked})}
                className="mr-2"
              />
              <label htmlFor="includeConnectors" className="text-sm">Include Connector Lines</label>
            </div>
            
            {options.includeConnectors && (
              <>
                <div className="mb-3">
                  <label className="block text-sm mb-1">Path Density: {options.pathDensity.toFixed(2)}</label>
                  <input 
                    type="range" 
                    min={constraints.pathDensity.min} 
                    max={constraints.pathDensity.max} 
                    step={constraints.pathDensity.step}
                    value={options.pathDensity} 
                    onChange={e => setOptions({...options, pathDensity: parseFloat(e.target.value)})} 
                    className="w-full"
                  />
                </div>
                
                <div className="mb-3">
                  <label className="block text-sm mb-1">Path Complexity: {options.pathComplexity.toFixed(2)}</label>
                  <input 
                    type="range" 
                    min={constraints.pathComplexity.min} 
                    max={constraints.pathComplexity.max} 
                    step={constraints.pathComplexity.step}
                    value={options.pathComplexity} 
                    onChange={e => setOptions({...options, pathComplexity: parseFloat(e.target.value)})} 
                    className="w-full"
                  />
                </div>
              </>
            )}
          </div>
          
          {/* Detail Settings */}
          <div className="mb-6">
            <h3 className="font-medium mb-2 pb-1 border-b">Detail Settings</h3>
            
            <div className="mb-3 flex items-center">
              <input 
                type="checkbox"
                id="includeSmallDetails"
                checked={options.includeSmallDetails}
                onChange={e => setOptions({...options, includeSmallDetails: e.target.checked})}
                className="mr-2"
              />
              <label htmlFor="includeSmallDetails" className="text-sm">Include Small Details</label>
            </div>
            
            {options.includeSmallDetails && (
              <div className="mb-3">
                <label className="block text-sm mb-1">Detail Density: {options.detailDensity.toFixed(2)}</label>
                <input 
                  type="range" 
                  min={constraints.detailDensity.min} 
                  max={constraints.detailDensity.max} 
                  step={constraints.detailDensity.step}
                  value={options.detailDensity} 
                  onChange={e => setOptions({...options, detailDensity: parseFloat(e.target.value)})} 
                  className="w-full"
                />
              </div>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            <button 
              onClick={generateCircuitPattern} 
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
            <button 
              onClick={generateTriptych} 
              className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded transition-colors"
            >
              Generate Full Triptych
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
              style={{ minHeight: '600px', backgroundColor: colorSchemes[options.panelType].background }}
            ></div>
            
            <div className="mt-4 text-sm">
              <p><strong>About this Generator:</strong></p>
              <p className="mt-2">This generator creates triptych-style circuit patterns with three distinct visual approaches:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li><strong>Yellow/Black Hatched:</strong> Line-based patterns with various hatching techniques</li>
                <li><strong>Blue/Red/White Jagged:</strong> Irregular color blocks with jagged, organic edges</li>
                <li><strong>Lime/Green Blocks:</strong> Rectangular forms with connecting circuit-like paths</li>
              </ul>
              <p className="mt-2">Use the controls to adjust each style individually, or generate the complete triptych with a single click for cohesive multi-panel artwork.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripticCircuitGenerator;
