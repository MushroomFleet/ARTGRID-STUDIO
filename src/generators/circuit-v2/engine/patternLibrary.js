// Enhanced pattern library for Circuit V2 Generator
// Includes original 25 patterns plus new advanced patterns

export const patternLibrary = {
  // Main pattern drawing function
  drawPattern(ctx, shape, options, random) {
    const { patternType, colors, width, height } = shape;
    
    ctx.save();
    
    // Draw base shape
    ctx.fillStyle = colors.primary;
    ctx.fillRect(-width/2, -height/2, width, height);
    
    // Draw pattern overlay
    ctx.fillStyle = colors.secondary;
    
    // Route to appropriate pattern function
    switch (patternType) {
      // Original 25 patterns from circuit-gen.txt
      case 'checkerboard':
        this.drawCheckerboard(ctx, width, height, colors);
        break;
      case 'horizontalBars':
        this.drawHorizontalBars(ctx, width, height, colors);
        break;
      case 'fiveCircles':
        this.drawFiveCircles(ctx, width, height, colors);
        break;
      case 'concentricCircles':
        this.drawConcentricCircles(ctx, width, height, colors);
        break;
      case 'triangleCorner':
        this.drawTriangleCorner(ctx, width, height, colors);
        break;
      case 'triangleUp':
        this.drawTriangleUp(ctx, width, height, colors);
        break;
      case 'circle':
        this.drawCircle(ctx, width, height, colors);
        break;
      case 'verticalLines':
        this.drawVerticalLines(ctx, width, height, colors);
        break;
      case 'circleGrid':
        this.drawCircleGrid(ctx, width, height, colors);
        break;
      case 'diagonalSlash':
        this.drawDiagonalSlash(ctx, width, height, colors);
        break;
      case 'horizontalRects':
        this.drawHorizontalRects(ctx, width, height, colors);
        break;
      case 'cornerSquares':
        this.drawCornerSquares(ctx, width, height, colors);
        break;
      case 'quarterCircles':
        this.drawQuarterCircles(ctx, width, height, colors);
        break;
      case 'halfCircles':
        this.drawHalfCircles(ctx, width, height, colors);
        break;
      case 'quarterCorner':
        this.drawQuarterCorner(ctx, width, height, colors);
        break;
      case 'dotsWithCircle':
        this.drawDotsWithCircle(ctx, width, height, colors);
        break;
      case 'overlappingCircles':
        this.drawOverlappingCircles(ctx, width, height, colors);
        break;
      case 'squareInSquare':
        this.drawSquareInSquare(ctx, width, height, colors);
        break;
      case 'circleWithLines':
        this.drawCircleWithLines(ctx, width, height, colors);
        break;
      case 'octagonHole':
        this.drawOctagonHole(ctx, width, height, colors);
        break;
      case 'centerTriangles':
        this.drawCenterTriangles(ctx, width, height, colors);
        break;
      case 'cornerTriangles':
        this.drawCornerTriangles(ctx, width, height, colors);
        break;
      case 'oppositeQuarters':
        this.drawOppositeQuarters(ctx, width, height, colors);
        break;
      case 'nestedSquares':
        this.drawNestedSquares(ctx, width, height, colors);
        break;
      case 'diamond':
        this.drawDiamond(ctx, width, height, colors);
        break;
      
      // New enhanced patterns
      case 'bezierCurves':
        this.drawBezierCurves(ctx, width, height, colors, random);
        break;
      case 'fractalTree':
        this.drawFractalTree(ctx, width, height, colors, random);
        break;
      case 'spiralPattern':
        this.drawSpiralPattern(ctx, width, height, colors, random);
        break;
      case 'circuitTrace':
        this.drawCircuitTrace(ctx, width, height, colors, random);
        break;
      case 'hexPattern':
        this.drawHexPattern(ctx, width, height, colors, random);
        break;
      case 'voronoiCell':
        this.drawVoronoiCell(ctx, width, height, colors, random);
        break;
      case 'parametricWave':
        this.drawParametricWave(ctx, width, height, colors, random);
        break;
      case 'noiseField':
        this.drawNoiseField(ctx, width, height, colors, random);
        break;
      case 'organicBlob':
        this.drawOrganicBlob(ctx, width, height, colors, random);
        break;
      case 'geometricMandala':
        this.drawGeometricMandala(ctx, width, height, colors, random);
        break;
      
      default:
        // Default simple square
        ctx.fillRect(-width*0.25, -height*0.25, width*0.5, height*0.5);
    }
    
    ctx.restore();
  },

  // ========= ORIGINAL 25 PATTERNS =========
  
  // Pattern 0: Checkerboard
  drawCheckerboard(ctx, w, h, colors) {
    const n = 4;
    const ww = w / n;
    const hh = h / n;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        let xx = i * ww + (ww / 2) - (w / 2);
        let yy = j * hh + (hh / 2) - (h / 2);
        if ((i + j) % 2 === 0) {
          ctx.fillRect(xx - ww/2, yy - hh/2, ww, hh);
        }
      }
    }
  },

  // Pattern 1: Two horizontal bars
  drawHorizontalBars(ctx, w, h, colors) {
    ctx.fillRect(-w/2, h/8 - h/8, w, h/4);
    ctx.fillRect(-w/2, (h/8) - (h/2) - h/8, w, h/4);
  },

  // Pattern 2: Five circles pattern
  drawFiveCircles(ctx, w, h, colors) {
    const d = Math.min(w, h) / 4;
    
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
  },

  // Pattern 3: Concentric circles
  drawConcentricCircles(ctx, w, h, colors) {
    const size = Math.min(w, h);
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.4, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = colors.primary;
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.15, 0, Math.PI * 2);
    ctx.fill();
  },

  // Pattern 4: Triangle in corner
  drawTriangleCorner(ctx, w, h, colors) {
    ctx.beginPath();
    ctx.moveTo(w/2, h/2);
    ctx.lineTo(-w/2, -h/2);
    ctx.lineTo(w/2, -h/2);
    ctx.closePath();
    ctx.fill();
  },

  // Pattern 5: Triangle pointing up
  drawTriangleUp(ctx, w, h, colors) {
    ctx.beginPath();
    ctx.moveTo(w/2, h/2);
    ctx.lineTo(-w/2, h/2);
    ctx.lineTo(0, -h/2);
    ctx.closePath();
    ctx.fill();
  },

  // Pattern 6: Circle
  drawCircle(ctx, w, h, colors) {
    const size = Math.min(w, h);
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.4, 0, Math.PI * 2);
    ctx.fill();
  },

  // Pattern 7: Three vertical lines
  drawVerticalLines(ctx, w, h, colors) {
    ctx.strokeStyle = colors.secondary;
    ctx.lineWidth = Math.min(w, h) * 0.1;
    
    ctx.beginPath();
    ctx.moveTo(0, h * 0.3);
    ctx.lineTo(0, -h * 0.3);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(w * 0.3, h * 0.3);
    ctx.lineTo(w * 0.3, -h * 0.3);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(-w * 0.3, h * 0.3);
    ctx.lineTo(-w * 0.3, -h * 0.3);
    ctx.stroke();
  },

  // Pattern 8: Grid of circles
  drawCircleGrid(ctx, w, h, colors) {
    const n2 = 3;
    const ww2 = (Math.min(w, h) * 0.8) / n2;
    for (let i = 0; i < n2; i++) {
      for (let j = 0; j < n2; j++) {
        let xx = i * ww2 + (ww2 / 2) - (w / 2) + (w * 0.1);
        let yy = j * ww2 + (ww2 / 2) - (h / 2) + (h * 0.1);
        ctx.beginPath();
        ctx.arc(xx, yy, ww2 * 0.375, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  },

  // Pattern 9: Diagonal slash
  drawDiagonalSlash(ctx, w, h, colors) {
    ctx.beginPath();
    ctx.moveTo(-w/2, -h/2);
    ctx.lineTo(-w/2, h/2);
    ctx.lineTo(w/2, -h/2);
    ctx.lineTo(w/2, h/2);
    ctx.fill();
  },

  // Pattern 10: Two horizontal rectangles
  drawHorizontalRects(ctx, w, h, colors) {
    ctx.fillRect(-w*0.4, h*0.2 - h*0.125, w*0.8, h/4);
    ctx.fillRect(-w*0.4, -h*0.2 - h*0.125, w*0.8, h/4);
  },

  // Pattern 11: Square with 4 corner squares
  drawCornerSquares(ctx, w, h, colors) {
    ctx.fillRect(-w*0.25, -h*0.25, w*0.5, h*0.5);
    
    // Corner squares
    ctx.fillRect(w*0.5 - w*0.25, -h*0.5, w*0.25, h*0.25);
    ctx.fillRect(-w*0.5, -h*0.5, w*0.25, h*0.25);
    ctx.fillRect(w*0.5 - w*0.25, h*0.5 - h*0.25, w*0.25, h*0.25);
    ctx.fillRect(-w*0.5, h*0.5 - h*0.25, w*0.25, h*0.25);
  },

  // Pattern 12: Four quarter circles at corners
  drawQuarterCircles(ctx, w, h, colors) {
    const size = Math.min(w, h);
    ctx.beginPath();
    ctx.arc(-w/2, -h/2, size/2, 0, Math.PI/2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(w/2, -h/2, size/2, Math.PI/2, Math.PI);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(w/2, h/2, size/2, Math.PI, Math.PI*1.5);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(-w/2, h/2, size/2, Math.PI*1.5, Math.PI*2);
    ctx.fill();
  },

  // Pattern 13: Two half circles
  drawHalfCircles(ctx, w, h, colors) {
    const size = Math.min(w, h);
    ctx.beginPath();
    ctx.arc(-w/2, 0, size/2, -Math.PI/2, Math.PI/2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(w/2, 0, size/2, Math.PI/2, Math.PI*1.5);
    ctx.fill();
  },

  // Pattern 14: Quarter circle in corner
  drawQuarterCorner(ctx, w, h, colors) {
    const size = Math.min(w, h);
    ctx.beginPath();
    ctx.arc(w/2, h/2, size, Math.PI, Math.PI*1.5);
    ctx.fill();
  },

  // Pattern 15: Four dots with circle outline
  drawDotsWithCircle(ctx, w, h, colors) {
    const size = Math.min(w, h);
    const d2 = size * 0.2;
    
    ctx.beginPath();
    ctx.arc(w*0.3, 0, d2/2, 0, Math.PI*2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(-w*0.3, 0, d2/2, 0, Math.PI*2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(0, h*0.3, d2/2, 0, Math.PI*2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(0, -h*0.3, d2/2, 0, Math.PI*2);
    ctx.fill();
    
    ctx.strokeStyle = colors.secondary;
    ctx.lineWidth = size * 0.03;
    ctx.beginPath();
    ctx.arc(0, 0, size*0.3, 0, Math.PI*2);
    ctx.stroke();
  },

  // Pattern 16: Four overlapping circles
  drawOverlappingCircles(ctx, w, h, colors) {
    const size = Math.min(w, h);
    const d3 = size * 0.5;
    
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
  },

  // Pattern 17: Square with smaller square
  drawSquareInSquare(ctx, w, h, colors) {
    ctx.fillRect(-w/2, -h/2, w, h);
    ctx.fillStyle = colors.primary;
    ctx.fillRect(-w*0.25, -h*0.25, w*0.5, h*0.5);
  },

  // Pattern 18: Circle with 4 diagonal lines
  drawCircleWithLines(ctx, w, h, colors) {
    const size = Math.min(w, h);
    ctx.beginPath();
    ctx.arc(0, 0, size*0.11, 0, Math.PI*2);
    ctx.fill();
    
    ctx.strokeStyle = colors.secondary;
    ctx.lineWidth = size*0.05;
    
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.moveTo(size*0.15, size*0.15);
      ctx.lineTo(size*0.4, size*0.4);
      ctx.stroke();
      ctx.rotate(Math.PI/2);
    }
  },

  // Pattern 19: Octagon with square hole
  drawOctagonHole(ctx, w, h, colors) {
    ctx.beginPath();
    ctx.moveTo(-w*0.25, -h*0.5);
    ctx.lineTo(w*0.25, -h*0.5);
    ctx.lineTo(w*0.5, -h*0.25);
    ctx.lineTo(w*0.5, h*0.25);
    ctx.lineTo(w*0.25, h*0.5);
    ctx.lineTo(-w*0.25, h*0.5);
    ctx.lineTo(-w*0.5, h*0.25);
    ctx.lineTo(-w*0.5, -h*0.25);
    ctx.closePath();
    
    // Cut out center square
    ctx.moveTo(0, -h*0.25);
    ctx.lineTo(-w*0.25, 0);
    ctx.lineTo(0, h*0.25);
    ctx.lineTo(w*0.25, 0);
    ctx.closePath();
    
    ctx.fill('evenodd');
  },

  // Pattern 20: Four triangles from center
  drawCenterTriangles(ctx, w, h, colors) {
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -h*0.5);
      ctx.lineTo(w*0.5, -h*0.5);
      ctx.closePath();
      ctx.fill();
      ctx.rotate(Math.PI/2);
    }
  },

  // Pattern 21: Corner triangles
  drawCornerTriangles(ctx, w, h, colors) {
    for (let i = 0; i < 2; i++) {
      ctx.beginPath();
      ctx.moveTo(w*0.5, 0);
      ctx.lineTo(0, -h*0.5);
      ctx.lineTo(w*0.5, -h*0.5);
      ctx.closePath();
      ctx.fill();
      
      ctx.beginPath();
      ctx.moveTo(w*0.5, 0);
      ctx.lineTo(0, 0);
      ctx.lineTo(0, h*0.5);
      ctx.closePath();
      ctx.fill();
      
      ctx.rotate(Math.PI);
    }
  },

  // Pattern 22: Quarter circles in opposite corners
  drawOppositeQuarters(ctx, w, h, colors) {
    ctx.beginPath();
    ctx.moveTo(-w/2, -h/2);
    
    // Top-left quarter circle
    for (let a = 0; a < Math.PI/2; a += Math.PI/180) {
      ctx.lineTo(-(w/2) + (w) * Math.cos(a), -(h/2) + (h) * Math.sin(a));
    }
    
    // Bottom-right quarter circle
    for (let a = Math.PI; a < Math.PI*1.5; a += Math.PI/180) {
      ctx.lineTo((w/2) + (w) * Math.cos(a), (h/2) + (h) * Math.sin(a));
    }
    
    ctx.closePath();
    ctx.fill();
  },

  // Pattern 23: Nested squares in corner
  drawNestedSquares(ctx, w, h, colors) {
    const size = Math.min(w, h);
    for (let i = 0; i < 3; i++) {
      let ww = (size * (3/4)) * (1 - i/3);
      ctx.fillStyle = i % 2 === 0 ? colors.secondary : colors.primary;
      ctx.fillRect((w/2) - ww, (h/2) - ww, ww, ww);
    }
  },

  // Pattern 24: Diamond
  drawDiamond(ctx, w, h, colors) {
    const size = Math.min(w, h);
    ctx.beginPath();
    ctx.moveTo(0, -size*0.5);
    ctx.lineTo(size*0.25, 0);
    ctx.lineTo(0, size*0.5);
    ctx.lineTo(-size*0.25, 0);
    ctx.closePath();
    ctx.fill();
  },

  // ========= NEW ENHANCED PATTERNS =========

  // Bezier curves pattern
  drawBezierCurves(ctx, w, h, colors, random) {
    ctx.strokeStyle = colors.secondary;
    ctx.lineWidth = Math.min(w, h) * 0.05;
    ctx.fillStyle = 'transparent';
    
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      const startX = (random() - 0.5) * w;
      const startY = (random() - 0.5) * h;
      const cp1X = (random() - 0.5) * w;
      const cp1Y = (random() - 0.5) * h;
      const cp2X = (random() - 0.5) * w;
      const cp2Y = (random() - 0.5) * h;
      const endX = (random() - 0.5) * w;
      const endY = (random() - 0.5) * h;
      
      ctx.moveTo(startX, startY);
      ctx.bezierCurveTo(cp1X, cp1Y, cp2X, cp2Y, endX, endY);
      ctx.stroke();
    }
  },

  // Fractal tree pattern
  drawFractalTree(ctx, w, h, colors, random) {
    const size = Math.min(w, h);
    ctx.strokeStyle = colors.secondary;
    ctx.lineWidth = size * 0.02;
    
    const drawBranch = (x, y, length, angle, depth) => {
      if (depth === 0 || length < 2) return;
      
      const endX = x + Math.cos(angle) * length;
      const endY = y + Math.sin(angle) * length;
      
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(endX, endY);
      ctx.stroke();
      
      const newLength = length * (0.6 + random() * 0.2);
      const leftAngle = angle - (Math.PI / 6) + (random() - 0.5) * 0.5;
      const rightAngle = angle + (Math.PI / 6) + (random() - 0.5) * 0.5;
      
      drawBranch(endX, endY, newLength, leftAngle, depth - 1);
      drawBranch(endX, endY, newLength, rightAngle, depth - 1);
    };
    
    drawBranch(0, h * 0.3, size * 0.3, -Math.PI / 2, 4);
  },

  // Spiral pattern
  drawSpiralPattern(ctx, w, h, colors, random) {
    const size = Math.min(w, h);
    const spirals = 2 + Math.floor(random() * 3);
    
    for (let s = 0; s < spirals; s++) {
      ctx.beginPath();
      ctx.strokeStyle = s % 2 === 0 ? colors.secondary : colors.primary;
      ctx.lineWidth = size * 0.03;
      
      const centerX = (random() - 0.5) * w * 0.5;
      const centerY = (random() - 0.5) * h * 0.5;
      const maxRadius = size * 0.3;
      const turns = 2 + random() * 2;
      
      for (let angle = 0; angle < turns * Math.PI * 2; angle += 0.1) {
        const radius = (angle / (turns * Math.PI * 2)) * maxRadius;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        
        if (angle === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
    }
  },

  // Circuit trace pattern
  drawCircuitTrace(ctx, w, h, colors, random) {
    ctx.strokeStyle = colors.secondary;
    ctx.lineWidth = Math.min(w, h) * 0.04;
    ctx.lineCap = 'round';
    
    // Main traces
    const traceCount = 3 + Math.floor(random() * 4);
    for (let i = 0; i < traceCount; i++) {
      ctx.beginPath();
      let x = (random() - 0.5) * w;
      let y = (random() - 0.5) * h;
      ctx.moveTo(x, y);
      
      const segments = 3 + Math.floor(random() * 4);
      for (let j = 0; j < segments; j++) {
        const direction = Math.floor(random() * 4) * Math.PI / 2;
        const length = (0.2 + random() * 0.3) * Math.min(w, h);
        x += Math.cos(direction) * length;
        y += Math.sin(direction) * length;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
      
      // Add connection points
      ctx.fillStyle = colors.secondary;
      ctx.beginPath();
      ctx.arc(x, y, Math.min(w, h) * 0.02, 0, Math.PI * 2);
      ctx.fill();
    }
  },

  // Hexagon pattern
  drawHexPattern(ctx, w, h, colors, random) {
    const size = Math.min(w, h) * 0.3;
    const hexCount = 1 + Math.floor(random() * 3);
    
    for (let i = 0; i < hexCount; i++) {
      const centerX = (random() - 0.5) * w * 0.5;
      const centerY = (random() - 0.5) * h * 0.5;
      const radius = size * (0.5 + random() * 0.5);
      
      ctx.beginPath();
      for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 3) {
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        if (angle === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
      
      if (i % 2 === 0) {
        ctx.fill();
      } else {
        ctx.strokeStyle = colors.secondary;
        ctx.lineWidth = Math.min(w, h) * 0.03;
        ctx.stroke();
      }
    }
  },

  // Voronoi cell pattern
  drawVoronoiCell(ctx, w, h, colors, random) {
    const points = [];
    const pointCount = 4 + Math.floor(random() * 6);
    
    // Generate random points
    for (let i = 0; i < pointCount; i++) {
      points.push({
        x: (random() - 0.5) * w,
        y: (random() - 0.5) * h
      });
    }
    
    // Draw Voronoi-like cell boundaries
    ctx.strokeStyle = colors.secondary;
    ctx.lineWidth = Math.min(w, h) * 0.02;
    
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const midX = (points[i].x + points[j].x) / 2;
        const midY = (points[i].y + points[j].y) / 2;
        
        // Draw perpendicular bisector segment
        const dx = points[j].x - points[i].x;
        const dy = points[j].y - points[i].y;
        const perpX = -dy;
        const perpY = dx;
        const length = Math.min(w, h) * 0.2;
        
        ctx.beginPath();
        ctx.moveTo(midX - perpX * length / 2, midY - perpY * length / 2);
        ctx.lineTo(midX + perpX * length / 2, midY + perpY * length / 2);
        ctx.stroke();
      }
      
      // Draw seed points
      ctx.fillStyle = colors.secondary;
      ctx.beginPath();
      ctx.arc(points[i].x, points[i].y, Math.min(w, h) * 0.03, 0, Math.PI * 2);
      ctx.fill();
    }
  },

  // Parametric wave pattern
  drawParametricWave(ctx, w, h, colors, random) {
    ctx.strokeStyle = colors.secondary;
    ctx.lineWidth = Math.min(w, h) * 0.03;
    
    const waveCount = 2 + Math.floor(random() * 3);
    for (let wave = 0; wave < waveCount; wave++) {
      ctx.beginPath();
      
      const frequency = 1 + random() * 3;
      const amplitude = (0.2 + random() * 0.3) * Math.min(w, h);
      const phase = random() * Math.PI * 2;
      const direction = random() > 0.5 ? 'horizontal' : 'vertical';
      
      if (direction === 'horizontal') {
        for (let x = -w/2; x <= w/2; x += 2) {
          const y = Math.sin((x / w) * frequency * Math.PI + phase) * amplitude;
          if (x === -w/2) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
      } else {
        for (let y = -h/2; y <= h/2; y += 2) {
          const x = Math.sin((y / h) * frequency * Math.PI + phase) * amplitude;
          if (y === -h/2) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
      }
      ctx.stroke();
    }
  },

  // Noise field pattern
  drawNoiseField(ctx, w, h, colors, random) {
    const size = Math.min(w, h);
    const points = 20 + Math.floor(random() * 30);
    
    ctx.fillStyle = colors.secondary;
    
    for (let i = 0; i < points; i++) {
      const x = (random() - 0.5) * w;
      const y = (random() - 0.5) * h;
      const radius = random() * size * 0.02;
      
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Add some connecting lines
    ctx.strokeStyle = colors.secondary;
    ctx.lineWidth = size * 0.01;
    ctx.globalAlpha = 0.3;
    
    for (let i = 0; i < points / 4; i++) {
      ctx.beginPath();
      ctx.moveTo((random() - 0.5) * w, (random() - 0.5) * h);
      ctx.lineTo((random() - 0.5) * w, (random() - 0.5) * h);
      ctx.stroke();
    }
    
    ctx.globalAlpha = 1.0;
  },

  // Organic blob pattern
  drawOrganicBlob(ctx, w, h, colors, random) {
    const size = Math.min(w, h);
    const centerX = (random() - 0.5) * w * 0.3;
    const centerY = (random() - 0.5) * h * 0.3;
    const baseRadius = size * (0.15 + random() * 0.15);
    
    ctx.beginPath();
    
    const points = 8 + Math.floor(random() * 8);
    for (let i = 0; i <= points; i++) {
      const angle = (i / points) * Math.PI * 2;
      const radiusVariation = 0.7 + random() * 0.6;
      const radius = baseRadius * radiusVariation;
      
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        // Use quadratic curves for smoother organic shape
        const prevAngle = ((i - 1) / points) * Math.PI * 2;
        const prevRadius = baseRadius * (0.7 + random() * 0.6);
        const prevX = centerX + Math.cos(prevAngle) * prevRadius;
        const prevY = centerY + Math.sin(prevAngle) * prevRadius;
        
        const cpX = (prevX + x) / 2 + (random() - 0.5) * size * 0.1;
        const cpY = (prevY + y) / 2 + (random() - 0.5) * size * 0.1;
        
        ctx.quadraticCurveTo(cpX, cpY, x, y);
      }
    }
    
    ctx.closePath();
    ctx.fill();
    
    // Add some internal details
    ctx.fillStyle = colors.primary;
    for (let i = 0; i < 3; i++) {
      const detailX = centerX + (random() - 0.5) * baseRadius;
      const detailY = centerY + (random() - 0.5) * baseRadius;
      const detailRadius = random() * baseRadius * 0.2;
      
      ctx.beginPath();
      ctx.arc(detailX, detailY, detailRadius, 0, Math.PI * 2);
      ctx.fill();
    }
  },

  // Geometric mandala pattern
  drawGeometricMandala(ctx, w, h, colors, random) {
    const size = Math.min(w, h);
    const centerX = (random() - 0.5) * w * 0.2;
    const centerY = (random() - 0.5) * h * 0.2;
    const layers = 3 + Math.floor(random() * 4);
    
    for (let layer = 0; layer < layers; layer++) {
      const radius = (size * 0.1) + (layer * size * 0.08);
      const segments = 6 + layer * 2;
      
      ctx.strokeStyle = layer % 2 === 0 ? colors.secondary : colors.primary;
      ctx.lineWidth = size * 0.02;
      
      for (let i = 0; i < segments; i++) {
        const angle = (i / segments) * Math.PI * 2;
        const nextAngle = ((i + 1) / segments) * Math.PI * 2;
        
        const x1 = centerX + Math.cos(angle) * radius;
        const y1 = centerY + Math.sin(angle) * radius;
        const x2 = centerX + Math.cos(nextAngle) * radius;
        const y2 = centerY + Math.sin(nextAngle) * radius;
        
        // Draw segment
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, angle, nextAngle);
        ctx.stroke();
        
        // Draw radial lines
        if (layer === layers - 1) {
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.lineTo(x1, y1);
          ctx.stroke();
        }
        
        // Draw connecting elements
        if (layer > 0 && i % 2 === 0) {
          const innerRadius = (size * 0.1) + ((layer - 1) * size * 0.08);
          const innerX = centerX + Math.cos(angle) * innerRadius;
          const innerY = centerY + Math.sin(angle) * innerRadius;
          
          ctx.beginPath();
          ctx.moveTo(innerX, innerY);
          ctx.lineTo(x1, y1);
          ctx.stroke();
        }
      }
      
      // Add decorative elements
      if (layer === Math.floor(layers / 2)) {
        ctx.fillStyle = colors.secondary;
        for (let i = 0; i < segments; i++) {
          const angle = (i / segments) * Math.PI * 2;
          const x = centerX + Math.cos(angle) * radius;
          const y = centerY + Math.sin(angle) * radius;
          
          ctx.beginPath();
          ctx.arc(x, y, size * 0.015, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
    
    // Central element
    ctx.fillStyle = colors.primary;
    ctx.beginPath();
    ctx.arc(centerX, centerY, size * 0.05, 0, Math.PI * 2);
    ctx.fill();
  }
};
