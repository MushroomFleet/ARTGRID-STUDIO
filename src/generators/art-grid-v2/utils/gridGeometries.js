// Advanced grid geometry calculations for V2

export const GridGeometries = {
  rectangular: {
    generatePositions: (rows, cols, cellSize) => {
      const positions = [];
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          positions.push({
            x: i * cellSize,
            y: j * cellSize,
            size: cellSize,
            gridX: i,
            gridY: j
          });
        }
      }
      return positions;
    },
    getDimensions: (rows, cols, cellSize) => ({
      width: rows * cellSize,
      height: cols * cellSize
    })
  },

  hexagonal: {
    generatePositions: (rows, cols, cellSize) => {
      const positions = [];
      const hexWidth = cellSize * Math.sqrt(3);
      const hexHeight = cellSize * 1.5;
      
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const offsetX = (row % 2) * (hexWidth / 2);
          const x = col * hexWidth + offsetX;
          const y = row * hexHeight;
          
          positions.push({
            x: x,
            y: y,
            size: cellSize,
            gridX: col,
            gridY: row,
            isHex: true
          });
        }
      }
      return positions;
    },
    getDimensions: (rows, cols, cellSize) => {
      const hexWidth = cellSize * Math.sqrt(3);
      const hexHeight = cellSize * 1.5;
      return {
        width: cols * hexWidth + hexWidth / 2,
        height: rows * hexHeight + cellSize / 2
      };
    }
  },

  triangular: {
    generatePositions: (rows, cols, cellSize) => {
      const positions = [];
      const triHeight = cellSize * Math.sqrt(3) / 2;
      const triWidth = cellSize;
      
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const offsetX = (row % 2) * (triWidth / 2);
          const x = col * triWidth + offsetX;
          const y = row * triHeight;
          const pointUp = (row + col) % 2 === 0;
          
          positions.push({
            x: x,
            y: y,
            size: cellSize,
            gridX: col,
            gridY: row,
            pointUp: pointUp,
            isTriangle: true
          });
        }
      }
      return positions;
    },
    getDimensions: (rows, cols, cellSize) => {
      const triHeight = cellSize * Math.sqrt(3) / 2;
      const triWidth = cellSize;
      return {
        width: cols * triWidth + triWidth / 2,
        height: rows * triHeight + triHeight / 2
      };
    }
  },

  voronoi: {
    generatePositions: (rows, cols, cellSize) => {
      const positions = [];
      const width = cols * cellSize;
      const height = rows * cellSize;
      const numCells = Math.min(rows * cols, 50); // Limit for performance
      
      // Generate random seed points
      const seedPoints = [];
      for (let i = 0; i < numCells; i++) {
        seedPoints.push({
          x: Math.random() * width,
          y: Math.random() * height,
          id: i
        });
      }
      
      // Generate a grid of sample points and assign to nearest seed
      const sampleRes = Math.max(2, Math.floor(cellSize / 4));
      for (let x = 0; x < width; x += sampleRes) {
        for (let y = 0; y < height; y += sampleRes) {
          let nearestSeed = seedPoints[0];
          let minDist = Infinity;
          
          for (const seed of seedPoints) {
            const dist = Math.sqrt((x - seed.x) ** 2 + (y - seed.y) ** 2);
            if (dist < minDist) {
              minDist = dist;
              nearestSeed = seed;
            }
          }
          
          // Only add unique positions for each cell
          if (!positions.some(p => p.cellId === nearestSeed.id)) {
            positions.push({
              x: nearestSeed.x - cellSize / 2,
              y: nearestSeed.y - cellSize / 2,
              size: cellSize * (0.8 + Math.random() * 0.4), // Varied sizes
              gridX: Math.floor(nearestSeed.x / cellSize),
              gridY: Math.floor(nearestSeed.y / cellSize),
              cellId: nearestSeed.id,
              isVoronoi: true
            });
          }
        }
      }
      
      return positions;
    },
    getDimensions: (rows, cols, cellSize) => ({
      width: cols * cellSize,
      height: rows * cellSize
    })
  },

  radial: {
    generatePositions: (rows, cols, cellSize) => {
      const positions = [];
      const centerX = (cols * cellSize) / 2;
      const centerY = (rows * cellSize) / 2;
      const maxRadius = Math.min(centerX, centerY) * 0.9;
      
      const rings = Math.min(rows, 8);
      const segmentsBase = Math.max(cols, 6);
      
      // Center point
      positions.push({
        x: centerX - cellSize / 2,
        y: centerY - cellSize / 2,
        size: cellSize,
        gridX: 0,
        gridY: 0,
        ring: 0,
        segment: 0,
        isRadial: true
      });
      
      for (let ring = 1; ring < rings; ring++) {
        const radius = (ring / (rings - 1)) * maxRadius;
        const segments = Math.floor(segmentsBase * (ring / rings) * 2) || 1;
        
        for (let segment = 0; segment < segments; segment++) {
          const angle = (segment / segments) * 2 * Math.PI;
          const x = centerX + radius * Math.cos(angle) - cellSize / 2;
          const y = centerY + radius * Math.sin(angle) - cellSize / 2;
          
          positions.push({
            x: x,
            y: y,
            size: cellSize * (1 - ring * 0.1), // Smaller towards outside
            gridX: ring,
            gridY: segment,
            ring: ring,
            segment: segment,
            angle: angle,
            isRadial: true
          });
        }
      }
      
      return positions;
    },
    getDimensions: (rows, cols, cellSize) => ({
      width: cols * cellSize,
      height: rows * cellSize
    })
  },

  irregular: {
    generatePositions: (rows, cols, cellSize) => {
      const positions = [];
      const width = cols * cellSize;
      const height = rows * cellSize;
      const targetCount = rows * cols;
      
      // Use Poisson disk sampling for organic distribution
      const minDistance = cellSize * 0.7;
      const maxAttempts = 30;
      const grid = [];
      const gridWidth = Math.ceil(width / minDistance);
      const gridHeight = Math.ceil(height / minDistance);
      
      // Initialize grid
      for (let i = 0; i < gridWidth * gridHeight; i++) {
        grid[i] = null;
      }
      
      const points = [];
      const activeList = [];
      
      // Add first point
      const firstPoint = {
        x: width / 2,
        y: height / 2
      };
      points.push(firstPoint);
      activeList.push(firstPoint);
      
      while (activeList.length > 0 && points.length < targetCount) {
        const randomIndex = Math.floor(Math.random() * activeList.length);
        const point = activeList[randomIndex];
        let found = false;
        
        for (let i = 0; i < maxAttempts; i++) {
          const angle = Math.random() * 2 * Math.PI;
          const radius = minDistance + Math.random() * minDistance;
          const newX = point.x + radius * Math.cos(angle);
          const newY = point.y + radius * Math.sin(angle);
          
          if (newX >= 0 && newX < width && newY >= 0 && newY < height) {
            let valid = true;
            
            // Check distance to existing points
            for (const existingPoint of points) {
              const dist = Math.sqrt((newX - existingPoint.x) ** 2 + (newY - existingPoint.y) ** 2);
              if (dist < minDistance) {
                valid = false;
                break;
              }
            }
            
            if (valid) {
              const newPoint = { x: newX, y: newY };
              points.push(newPoint);
              activeList.push(newPoint);
              found = true;
              break;
            }
          }
        }
        
        if (!found) {
          activeList.splice(randomIndex, 1);
        }
      }
      
      // Convert points to positions
      points.forEach((point, index) => {
        const sizeVariation = 0.7 + Math.random() * 0.6;
        positions.push({
          x: point.x - cellSize / 2,
          y: point.y - cellSize / 2,
          size: cellSize * sizeVariation,
          gridX: Math.floor(point.x / cellSize),
          gridY: Math.floor(point.y / cellSize),
          pointIndex: index,
          isIrregular: true
        });
      });
      
      return positions;
    },
    getDimensions: (rows, cols, cellSize) => ({
      width: cols * cellSize,
      height: rows * cellSize
    })
  }
};

// Helper function to get appropriate pattern for grid type
export const getPatternForGrid = (gridType, pattern, position) => {
  switch (gridType) {
    case 'hexagonal':
      // Adapt patterns for hexagonal cells
      if (pattern === 'square') return 'hexagon';
      if (pattern === 'triangle' && position.isHex) return 'circle';
      return pattern;
      
    case 'triangular':
      // Adapt patterns for triangular cells
      if (pattern === 'square') return 'triangle';
      if (pattern === 'hexagon') return 'triangle';
      return pattern;
      
    case 'voronoi':
    case 'irregular':
      // Prefer organic patterns for irregular grids
      if (pattern === 'square') return 'circle';
      if (pattern === 'triangle') return 'circle';
      return pattern;
      
    case 'radial':
      // Radial grids work well with most patterns
      return pattern;
      
    default:
      return pattern;
  }
};
