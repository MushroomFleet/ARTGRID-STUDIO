// Utility functions for SVG tile processing

export const createGradient = (index, color1, color2, options) => {
  const gradient = document.createElementNS("http://www.w3.org/2000/svg", 
    options.gradientType === 'radial' ? "radialGradient" : "linearGradient");
  
  gradient.setAttribute("id", `gradient${index}`);
  
  if (options.gradientType === 'linear') {
    const angle = options.gradientDirection * Math.PI / 180;
    const x2 = Math.cos(angle) * 50 + 50;
    const y2 = Math.sin(angle) * 50 + 50;
    
    gradient.setAttribute("x1", "50%");
    gradient.setAttribute("y1", "50%");
    gradient.setAttribute("x2", `${x2}%`);
    gradient.setAttribute("y2", `${y2}%`);
  } else {
    gradient.setAttribute("cx", "50%");
    gradient.setAttribute("cy", "50%");
    gradient.setAttribute("r", "50%");
  }
  
  const stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
  stop1.setAttribute("offset", "0%");
  stop1.setAttribute("stop-color", color1);
  
  const stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
  stop2.setAttribute("offset", "100%");
  stop2.setAttribute("stop-color", color2);
  
  gradient.appendChild(stop1);
  gradient.appendChild(stop2);
  
  return gradient;
};

export const createShadowFilter = (options) => {
  const filter = document.createElementNS("http://www.w3.org/2000/svg", "filter");
  filter.setAttribute("id", "shadow");
  filter.setAttribute("x", "-20%");
  filter.setAttribute("y", "-20%");
  filter.setAttribute("width", "140%");
  filter.setAttribute("height", "140%");
  
  const offset = document.createElementNS("http://www.w3.org/2000/svg", "feOffset");
  offset.setAttribute("dx", options.shadowOffset);
  offset.setAttribute("dy", options.shadowOffset);
  offset.setAttribute("result", "offset");
  
  const blur = document.createElementNS("http://www.w3.org/2000/svg", "feGaussianBlur");
  blur.setAttribute("in", "offset");
  blur.setAttribute("stdDeviation", options.shadowBlur);
  blur.setAttribute("result", "blur");
  
  const merge = document.createElementNS("http://www.w3.org/2000/svg", "feMerge");
  
  const mergeNode1 = document.createElementNS("http://www.w3.org/2000/svg", "feMergeNode");
  mergeNode1.setAttribute("in", "blur");
  
  const mergeNode2 = document.createElementNS("http://www.w3.org/2000/svg", "feMergeNode");
  mergeNode2.setAttribute("in", "SourceGraphic");
  
  merge.appendChild(mergeNode1);
  merge.appendChild(mergeNode2);
  
  filter.appendChild(offset);
  filter.appendChild(blur);
  filter.appendChild(merge);
  
  return filter;
};

export const addGlobalGradientOverlay = (svg, totalSize, options, colorSchemes) => {
  const colors = colorSchemes[options.colorScheme];
  if (colors.length === 0) return;
  
  const overlayRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  overlayRect.setAttribute("width", totalSize);
  overlayRect.setAttribute("height", totalSize);
  overlayRect.setAttribute("fill", "url(#globalGradient)");
  overlayRect.setAttribute("opacity", options.globalGradientOpacity);
  overlayRect.setAttribute("mix-blend-mode", "multiply");
  
  const globalGradient = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
  globalGradient.setAttribute("id", "globalGradient");
  globalGradient.setAttribute("x1", "0%");
  globalGradient.setAttribute("y1", "0%");
  globalGradient.setAttribute("x2", "100%");
  globalGradient.setAttribute("y2", "100%");
  
  const numStops = Math.min(4, colors.length);
  for (let i = 0; i < numStops; i++) {
    const stop = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    stop.setAttribute("offset", `${(i / (numStops - 1)) * 100}%`);
    stop.setAttribute("stop-color", colors[i]);
    globalGradient.appendChild(stop);
  }
  
  const defs = svg.querySelector('defs');
  defs.appendChild(globalGradient);
  
  svg.appendChild(overlayRect);
};

export const addGridLines = (svg, totalSize, options) => {
  const gridGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
  gridGroup.setAttribute("stroke", "#cccccc");
  gridGroup.setAttribute("stroke-width", "0.5");
  gridGroup.setAttribute("opacity", "0.5");
  
  for (let i = 0; i <= options.gridSize; i++) {
    const x = i * (options.tileSize + options.spacing) - options.spacing/2;
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", x);
    line.setAttribute("y1", 0);
    line.setAttribute("x2", x);
    line.setAttribute("y2", totalSize);
    gridGroup.appendChild(line);
  }
  
  for (let i = 0; i <= options.gridSize; i++) {
    const y = i * (options.tileSize + options.spacing) - options.spacing/2;
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", 0);
    line.setAttribute("y1", y);
    line.setAttribute("x2", totalSize);
    line.setAttribute("y2", y);
    gridGroup.appendChild(line);
  }
  
  svg.appendChild(gridGroup);
};

export const processSVGTile = (svgContent, row, col, options, processElementFn) => {
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml');
  const originalSVG = svgDoc.documentElement;
  
  const tileGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
  
  const viewBox = originalSVG.getAttribute('viewBox');
  let scaleX = 1, scaleY = 1;
  
  if (viewBox) {
    const [, , width, height] = viewBox.split(' ').map(Number);
    scaleX = options.tileSize / width;
    scaleY = options.tileSize / height;
  } else {
    const width = parseFloat(originalSVG.getAttribute('width')) || 100;
    const height = parseFloat(originalSVG.getAttribute('height')) || 100;
    scaleX = options.tileSize / width;
    scaleY = options.tileSize / height;
  }
  
  if (options.sizeVariation) {
    const [minScale, maxScale] = options.sizeVariationRange;
    const randomScale = minScale + Math.random() * (maxScale - minScale);
    scaleX *= randomScale;
    scaleY *= randomScale;
  }
  
  tileGroup.setAttribute("transform", `translate(${-options.tileSize/2}, ${-options.tileSize/2}) scale(${scaleX}, ${scaleY})`);
  
  Array.from(originalSVG.children).forEach(child => {
    const clonedElement = child.cloneNode(true);
    processElementFn(clonedElement, row, col, options);
    tileGroup.appendChild(clonedElement);
  });
  
  if (options.shadowEffect) {
    tileGroup.setAttribute("filter", "url(#shadow)");
  }
  
  return tileGroup;
};

export const processElement = (element, row, col, options, colorSchemes) => {
  
  if (element.getAttribute && element.getAttribute('stroke') || element.style?.stroke) {
    let strokeWeight = options.strokeWeight;
    
    if (options.strokeVariation) {
      const [min, max] = options.strokeWeightRange;
      strokeWeight = min + Math.random() * (max - min);
    }
    
    element.setAttribute('stroke-width', strokeWeight);
    element.setAttribute('stroke', options.strokeColor);
    element.setAttribute('stroke-opacity', options.strokeOpacity);
  }
  
  if (options.applyColorScheme && options.colorScheme !== 'original') {
    const colors = colorSchemes[options.colorScheme];
    if (colors.length > 0) {
      if (element.getAttribute && element.getAttribute('fill') && element.getAttribute('fill') !== 'none') {
        let colorIndex;
        
        if (options.recolorElements) {
          const elementType = element.tagName?.toLowerCase() || '';
          const elementIndex = Array.from(element.parentElement?.children || []).indexOf(element);
          colorIndex = (row * 3 + col * 2 + elementIndex + (elementType === 'circle' ? 1 : 0)) % colors.length;
        } else {
          colorIndex = (row + col) % colors.length;
        }
        
        let fillColor = colors[colorIndex];
        
        if (options.applyGradients) {
          fillColor = `url(#gradient${colorIndex})`;
        }
        
        element.setAttribute('fill', fillColor);
        element.setAttribute('fill-opacity', options.fillOpacity);
      }
      
      if (element.getAttribute && element.getAttribute('stroke') && options.recolorElements) {
        const strokeColorIndex = (row + col + 2) % colors.length;
        element.setAttribute('stroke', colors[strokeColorIndex]);
      }
    }
  }
  
  if (element.children) {
    Array.from(element.children).forEach(child => {
      processElement(child, row, col, options, colorSchemes);
    });
  }
};
