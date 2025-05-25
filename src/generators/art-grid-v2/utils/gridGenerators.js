// Advanced grid generation utilities for Art Grid V2
// Supports multiple grid types beyond simple rectangular grids

import { randomChoice, randomInt } from '../../../utils/colorPalettes.js';

/**
 * Generate rectangular grid positions (enhanced version of V1)
 */
export const generateRectangularGrid = (rows, cols, squareSize, spacing = 0, rotation = 0) => {
  const positions = [];
  
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const x = i * (squareSize + spacing);
      const y = j * (squareSize + spacing);
      
      positions.push({
        x, y, 
        size: squareSize,
        row: i,
        col: j,
        type: 'rectangle',
        neighbors: getRectangularNeighbors(i, j, rows, cols)
      });
    }
  }
  
  // Apply rotation if specified
  if (rotation !== 0) {
    return rotateGridPositions(positions, rotation);
  }
  
  return positions;
};

/**
 * Generate hexagonal grid positions
 */
export const generateHexagonalGrid = (rows, cols, squareSize, spacing = 0) => {
  const positions = [];
  const hexHeight = squareSize * Math.sqrt(3) / 2;
  const hexWidth = squareSize * 3 / 4;
  
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      // Offset every other row for hexagonal pattern
      const xOffset = (j % 2) * (hexWidth / 2);
      const x = i * hexWidth + xOffset;
      const y = j * hexHeight;
      
      positions.push({
        x, y,
        size: squareSize,
        row: i,
        col: j,
        type: 'hexagon',
        neighbors: getHexagonalNeighbors(i, j, rows, cols)
      });
    }
  }
  
  return positions;
};

/**
 * Generate triangular grid positions
 */
export const generateTriangularGrid = (rows, cols, squareSize, spacing = 0) => {
  const positions = [];
  const triHeight = squareSize * Math.sqrt(3) / 2;
  const triWidth = squareSize;
  
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      // Alternate triangle orientation
      const isUpward = (i + j) % 2 === 0;
      const xOffset = (j % 2) * (triWidth / 2);
      const x = i * (triWidth / 2) + xOffset;
      const y = j * triHeight;
      
      positions.push({
        x, y,
        size: squareSize,
        row: i,
        col: j,
        type: 'triangle',
        orientation: isUpward ? 'up' : 'down',
        neighbors: getTriangularNeighbors(i, j, rows, cols)
      });
    }
  }
  
  return positions;
};

/**
 * Generate Voronoi-style grid (irregular cells)
 */
export const generateVoronoiGrid = (numCells, width, height, minCellSize = 50) => {
  const positions = [];
  
  // Generate random seed points
  const seedPoints = [];
  for (let i = 0; i < numCells; i++) {
    seedPoints.push({
      x: Math.random() * width,
      y: Math.random() * height,
      id: i
    });
  }
  
  // Create Voronoi cells (simplified approximation)
  // In a full implementation, we'd use a proper Voronoi algorithm
  // For now, we'll create irregular polygonal regions
  
  seedPoints.forEach((seed, index) => {
    // Calculate approximate cell boundaries
    const cellSize = Math.max(minCellSize, Math.random() * 100 + 50);
    const numVertices = randomInt(5, 8);
    const vertices = [];
    
    for (let i = 0; i < numVertices; i++) {
      const angle = (i / numVertices) * 2 * Math.PI;
      const radius = cellSize * (0.7 + Math.random() * 0.6);
      const vx = seed.x + radius * Math.cos(angle);
      const vy = seed.y + radius * Math.sin(angle);
      vertices.push([vx, vy]);
    }
    
    positions.push({
      x: seed.x - cellSize / 2,
      y: seed.y - cellSize / 2,
      size: cellSize,
      centerX: seed.x,
      centerY: seed.y,
      vertices: vertices,
      type: 'voronoi',
      id: index,
      neighbors: [] // Would be calculated in full implementation
    });
  });
  
  return positions;
};

/**
 * Generate radial grid positions
 */
export const generateRadialGrid = (rings, segments, centerX, centerY, maxRadius) => {
  const positions = [];
  
  for (let ring = 1; ring <= rings; ring++) {
    const radius = (ring / rings) * maxRadius;
    const segmentsInRing = Math.max(6, Math.floor(segments * (ring / rings)));
    
    for (let segment = 0; segment < segmentsInRing; segment++) {
      const angle = (segment / segmentsInRing) * 2 * Math.PI;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      
      // Calculate size based on distance from center
      const size = Math.max(20, 60 - (ring - 1) * 8);
      
      positions.push({
        x: x - size / 2,
        y: y - size / 2,
        size: size,
        ring: ring,
        segment: segment,
        angle: angle,
        radius: radius,
        type: 'radial',
        neighbors: getRadialNeighbors(ring, segment, rings, segmentsInRing)
      });
    }
  }
  
  return positions;
};

/**
 * Generate irregular "hand-drawn" grid
 */
export const generateIrregularGrid = (baseCells, width, height) => {
  const positions = [];
  
  // Start with a rough grid and add irregularity
  const roughRows = Math.ceil(Math.sqrt(baseCells));
  const roughCols = Math.ceil(baseCells / roughRows);
  
  const cellWidth = width / roughCols;
  const cellHeight = height / roughRows;
  
  for (let i = 0; i < roughRows; i++) {
    for (let j = 0; j < roughCols; j++) {
      if (positions.length >= baseCells) break;
      
      // Add randomness to position and size
      const baseX = i * cellWidth;
      const baseY = j * cellHeight;
      
      const jitterX = (Math.random() - 0.5) * cellWidth * 0.3;
      const jitterY = (Math.random() - 0.5) * cellHeight * 0.3;
      
      const x = baseX + jitterX;
      const y = baseY + jitterY;
      
      const sizeVariation = 0.7 + Math.random() * 0.6;
      const size = Math.min(cellWidth, cellHeight) * sizeVariation;
      
      // Create irregular shape vertices
      const numVertices = randomInt(4, 7);
      const vertices = [];
      
      for (let v = 0; v < numVertices; v++) {
        const angle = (v / numVertices) * 2 * Math.PI;
        const radius = size * (0.8 + Math.random() * 0.4) / 2;
        const vx = x + size / 2 + radius * Math.cos(angle);
        const vy = y + size / 2 + radius * Math.sin(angle);
        vertices.push([vx, vy]);
      }
      
      positions.push({
        x, y, size,
        centerX: x + size / 2,
        centerY: y + size / 2,
        vertices: vertices,
        type: 'irregular',
        id: positions.length,
        neighbors: []
      });
    }
  }
  
  return positions;
};

// =====================================
// NEIGHBOR CALCULATION FUNCTIONS
// =====================================

/**
 * Get neighbors for rectangular grid
 */
function getRectangularNeighbors(row, col, maxRows, maxCols) {
  const neighbors = [];
  
  // 4-directional neighbors
  const directions = [
    [-1, 0], [1, 0], [0, -1], [0, 1]
  ];
  
  directions.forEach(([dr, dc]) => {
    const newRow = row + dr;
    const newCol = col + dc;
    
    if (newRow >= 0 && newRow < maxRows && newCol >= 0 && newCol < maxCols) {
      neighbors.push({ row: newRow, col: newCol });
    }
  });
  
  return neighbors;
}

/**
 * Get neighbors for hexagonal grid
 */
function getHexagonalNeighbors(row, col, maxRows, maxCols) {
  const neighbors = [];
  
  // Hexagonal neighbors depend on whether the column is even or odd
  const isEvenCol = col % 2 === 0;
  
  const directions = isEvenCol ? [
    [-1, -1], [-1, 0], [0, -1], [0, 1], [1, -1], [1, 0]
  ] : [
    [-1, 0], [-1, 1], [0, -1], [0, 1], [1, 0], [1, 1]
  ];
  
  directions.forEach(([dr, dc]) => {
    const newRow = row + dr;
    const newCol = col + dc;
    
    if (newRow >= 0 && newRow < maxRows && newCol >= 0 && newCol < maxCols) {
      neighbors.push({ row: newRow, col: newCol });
    }
  });
  
  return neighbors;
}

/**
 * Get neighbors for triangular grid
 */
function getTriangularNeighbors(row, col, maxRows, maxCols) {
  const neighbors = [];
  
  // Triangular grid neighbors (simplified)
  const directions = [
    [-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, 1]
  ];
  
  directions.forEach(([dr, dc]) => {
    const newRow = row + dr;
    const newCol = col + dc;
    
    if (newRow >= 0 && newRow < maxRows && newCol >= 0 && newCol < maxCols) {
      neighbors.push({ row: newRow, col: newCol });
    }
  });
  
  return neighbors;
}

/**
 * Get neighbors for radial grid
 */
function getRadialNeighbors(ring, segment, maxRings, segmentsInRing) {
  const neighbors = [];
  
  // Same ring neighbors
  const prevSegment = (segment - 1 + segmentsInRing) % segmentsInRing;
  const nextSegment = (segment + 1) % segmentsInRing;
  
  neighbors.push({ ring, segment: prevSegment });
  neighbors.push({ ring, segment: nextSegment });
  
  // Inner ring neighbors (if exists)
  if (ring > 1) {
    neighbors.push({ ring: ring - 1, segment: Math.floor(segment / 2) });
  }
  
  // Outer ring neighbors (if exists)
  if (ring < maxRings) {
    neighbors.push({ ring: ring + 1, segment: segment * 2 });
    neighbors.push({ ring: ring + 1, segment: segment * 2 + 1 });
  }
  
  return neighbors;
}

// =====================================
// UTILITY FUNCTIONS
// =====================================

/**
 * Rotate grid positions around center
 */
function rotateGridPositions(positions, rotationDegrees) {
  const radians = (rotationDegrees * Math.PI) / 180;
  
  // Calculate grid center
  const bounds = getGridBounds(positions);
  const centerX = bounds.minX + (bounds.maxX - bounds.minX) / 2;
  const centerY = bounds.minY + (bounds.maxY - bounds.minY) / 2;
  
  return positions.map(pos => {
    // Translate to origin
    const translatedX = pos.x - centerX;
    const translatedY = pos.y - centerY;
    
    // Rotate
    const rotatedX = translatedX * Math.cos(radians) - translatedY * Math.sin(radians);
    const rotatedY = translatedX * Math.sin(radians) + translatedY * Math.cos(radians);
    
    // Translate back
    return {
      ...pos,
      x: rotatedX + centerX,
      y: rotatedY + centerY
    };
  });
}

/**
 * Get bounds of grid positions
 */
function getGridBounds(positions) {
  if (positions.length === 0) {
    return { minX: 0, maxX: 0, minY: 0, maxY: 0 };
  }
  
  let minX = positions[0].x;
  let maxX = positions[0].x + positions[0].size;
  let minY = positions[0].y;
  let maxY = positions[0].y + positions[0].size;
  
  positions.forEach(pos => {
    minX = Math.min(minX, pos.x);
    maxX = Math.max(maxX, pos.x + pos.size);
    minY = Math.min(minY, pos.y);
    maxY = Math.max(maxY, pos.y + pos.size);
  });
  
  return { minX, maxX, minY, maxY };
}

/**
 * Calculate grid dimensions based on positions
 */
export const calculateGridDimensions = (positions) => {
  const bounds = getGridBounds(positions);
  return {
    width: bounds.maxX - bounds.minX,
    height: bounds.maxY - bounds.minY,
    bounds
  };
};

/**
 * Pattern flow analysis - determines how patterns should connect
 */
export const analyzePatternFlow = (positions, flowType = 'organic') => {
  const flowData = [];
  
  positions.forEach((pos, index) => {
    const connections = [];
    
    if (flowType === 'organic') {
      // Natural, flowing connections
      positions.forEach((otherPos, otherIndex) => {
        if (index !== otherIndex) {
          const distance = Math.sqrt(
            Math.pow(pos.centerX - otherPos.centerX, 2) + 
            Math.pow(pos.centerY - otherPos.centerY, 2)
          );
          
          // Connect to nearby cells with decreasing probability
          const maxDistance = Math.max(pos.size, otherPos.size) * 2;
          if (distance < maxDistance) {
            const strength = 1 - (distance / maxDistance);
            if (Math.random() < strength * 0.3) {
              connections.push({
                targetIndex: otherIndex,
                strength: strength,
                distance: distance
              });
            }
          }
        }
      });
    } else if (flowType === 'geometric') {
      // Grid-based connections
      pos.neighbors?.forEach(neighbor => {
        const targetIndex = positions.findIndex(p => 
          p.row === neighbor.row && p.col === neighbor.col
        );
        if (targetIndex !== -1) {
          connections.push({
            targetIndex: targetIndex,
            strength: 1.0,
            distance: Math.sqrt(
              Math.pow(pos.x - positions[targetIndex].x, 2) + 
              Math.pow(pos.y - positions[targetIndex].y, 2)
            )
          });
        }
      });
    }
    
    flowData.push({
      index: index,
      position: pos,
      connections: connections
    });
  });
  
  return flowData;
};

/**
 * Smart pattern placement - distributes patterns intelligently
 */
export const generateSmartPatternDistribution = (positions, patterns, style = 'balanced') => {
  const distribution = [];
  
  if (style === 'balanced') {
    // Evenly distribute patterns
    positions.forEach((pos, index) => {
      const patternIndex = index % patterns.length;
      distribution.push({
        position: pos,
        pattern: patterns[patternIndex],
        weight: 1.0
      });
    });
  } else if (style === 'clustered') {
    // Create clusters of similar patterns
    const clusterSize = Math.ceil(positions.length / patterns.length);
    
    positions.forEach((pos, index) => {
      const clusterIndex = Math.floor(index / clusterSize);
      const patternIndex = Math.min(clusterIndex, patterns.length - 1);
      distribution.push({
        position: pos,
        pattern: patterns[patternIndex],
        weight: 1.0
      });
    });
  } else if (style === 'random') {
    // Completely random distribution
    positions.forEach(pos => {
      distribution.push({
        position: pos,
        pattern: randomChoice(patterns),
        weight: Math.random()
      });
    });
  } else if (style === 'radial') {
    // Pattern changes based on distance from center
    const bounds = getGridBounds(positions);
    const centerX = bounds.minX + (bounds.maxX - bounds.minX) / 2;
    const centerY = bounds.minY + (bounds.maxY - bounds.minY) / 2;
    const maxDistance = Math.sqrt(
      Math.pow((bounds.maxX - bounds.minX) / 2, 2) + 
      Math.pow((bounds.maxY - bounds.minY) / 2, 2)
    );
    
    positions.forEach(pos => {
      const distance = Math.sqrt(
        Math.pow(pos.centerX - centerX, 2) + 
        Math.pow(pos.centerY - centerY, 2)
      );
      const normalizedDistance = distance / maxDistance;
      const patternIndex = Math.floor(normalizedDistance * patterns.length);
      
      distribution.push({
        position: pos,
        pattern: patterns[Math.min(patternIndex, patterns.length - 1)],
        weight: 1.0
      });
    });
  }
  
  return distribution;
};

// Export grid generator functions
export const gridGenerators = {
  rectangular: generateRectangularGrid,
  hexagonal: generateHexagonalGrid,
  triangular: generateTriangularGrid,
  voronoi: generateVoronoiGrid,
  radial: generateRadialGrid,
  irregular: generateIrregularGrid
};

export default gridGenerators;
