import React, { useEffect, useRef, useState } from 'react';
import { downloadSVG, clearSVGContainer } from '../../utils/svgUtils.js';
import { defaultConfig, colorSchemes } from './config.js';
import { 
  createGradient, 
  createShadowFilter, 
  addGlobalGradientOverlay, 
  addGridLines, 
  processSVGTile, 
  processElement 
} from './utils.js';

const TileImportGenerator = () => {
  const svgContainerRef = useRef(null);
  const fileInputRef = useRef(null);
  const [options, setOptions] = useState(defaultConfig);
  const [importedSVGs, setImportedSVGs] = useState([]);
  const [selectedSVGIndex, setSelectedSVGIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationInfo, setGenerationInfo] = useState('');
  
  useEffect(() => {
    generateTileGrid();
  }, [options, importedSVGs, selectedSVGIndex]);
  
  const handleFileImport = (event) => {
    const files = Array.from(event.target.files);
    
    files.forEach(file => {
      if (file.type === 'image/svg+xml' || file.name.endsWith('.svg')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const svgContent = e.target.result;
          const svgObject = {
            name: file.name,
            content: svgContent,
            id: Date.now() + Math.random()
          };
          
          setImportedSVGs(prev => [...prev, svgObject]);
        };
        reader.readAsText(file);
      }
    });
  };
  
  const generateTileGrid = () => {
    const container = svgContainerRef.current;
    if (!container || importedSVGs.length === 0) return;
    
    setIsGenerating(true);
    
    try {
      clearSVGContainer(container);
      
      const totalSize = options.gridSize * (options.tileSize + options.spacing) - options.spacing;
      
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("width", totalSize);
      svg.setAttribute("height", totalSize);
      svg.setAttribute("viewBox", `0 0 ${totalSize} ${totalSize}`);
      
      const background = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      background.setAttribute("width", totalSize);
      background.setAttribute("height", totalSize);
      background.setAttribute("fill", options.backgroundColor);
      svg.appendChild(background);
      
      const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
      
      if (options.applyGradients) {
        const colors = colorSchemes[options.colorScheme];
        if (colors.length > 0) {
          colors.forEach((color, index) => {
            const gradient = createGradient(index, color, colors[(index + 1) % colors.length], options);
            defs.appendChild(gradient);
          });
        }
      }
      
      if (options.shadowEffect) {
        const shadowFilter = createShadowFilter(options);
        defs.appendChild(shadowFilter);
      }
      
      svg.appendChild(defs);
      
      for (let row = 0; row < options.gridSize; row++) {
        for (let col = 0; col < options.gridSize; col++) {
          const x = col * (options.tileSize + options.spacing);
          const y = row * (options.tileSize + options.spacing);
          
          const tileGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
          
          let transform = `translate(${x + options.tileSize/2}, ${y + options.tileSize/2})`;
          
          if (options.randomOffset > 0) {
            const offsetX = (Math.random() - 0.5) * options.randomOffset;
            const offsetY = (Math.random() - 0.5) * options.randomOffset;
            transform += ` translate(${offsetX}, ${offsetY})`;
          }
          
          if (options.scaleVariation > 0) {
            const scale = 1 + (Math.random() - 0.5) * options.scaleVariation;
            transform += ` scale(${scale})`;
          }
          
          let rotation = options.rotation;
          if (options.randomRotation) {
            rotation = Math.random() * 360;
          }
          if (rotation !== 0) {
            transform += ` rotate(${rotation})`;
          }
          
          tileGroup.setAttribute("transform", transform);
          
          let svgIndex;
          if (options.mixSVGs && importedSVGs.length > 1) {
            svgIndex = Math.floor(Math.random() * importedSVGs.length);
          } else {
            svgIndex = selectedSVGIndex < importedSVGs.length ? selectedSVGIndex : 
                      Math.floor(Math.random() * importedSVGs.length);
          }
          
          const selectedSVG = importedSVGs[svgIndex];
          
          if (selectedSVG) {
            const processElementWithColorSchemes = (element, row, col, options) => {
              return processElement(element, row, col, options, colorSchemes);
            };
            const processedTile = processSVGTile(selectedSVG.content, row, col, options, processElementWithColorSchemes);
            tileGroup.appendChild(processedTile);
          }
          
          svg.appendChild(tileGroup);
        }
      }
      
      if (options.globalGradient) {
        addGlobalGradientOverlay(svg, totalSize, options, colorSchemes);
      }
      
      if (options.showGrid) {
        addGridLines(svg, totalSize, options);
      }
      
      container.appendChild(svg);
      
      setGenerationInfo(`Generated ${options.gridSize}×${options.gridSize} tile grid (${importedSVGs.length} SVG${importedSVGs.length !== 1 ? 's' : ''} imported)`);
      
    } catch (error) {
      console.error('Error generating tile grid:', error);
      setGenerationInfo('Error generating tile grid');
    } finally {
      setIsGenerating(false);
    }
  };
  
  const exportSVG = () => {
    const svgElement = svgContainerRef.current?.querySelector('svg');
    if (svgElement) {
      downloadSVG(svgElement, 'generated-tile-grid.svg');
    }
  };
  
  const exportPNG = () => {
    const svgElement = svgContainerRef.current?.querySelector('svg');
    if (!svgElement) return;
    
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    const svgBlob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'});
    const url = URL.createObjectURL(svgBlob);
    
    img.onload = () => {
      const size = options.gridSize * (options.tileSize + options.spacing) - options.spacing;
      canvas.width = size * 2;
      canvas.height = size * 2;
      
      ctx.scale(2, 2);
      ctx.drawImage(img, 0, 0);
      
      URL.revokeObjectURL(url);
      
      const pngUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = pngUrl;
      link.download = 'generated-tile-grid.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
    
    img.src = url;
  };
  
  const removeSVG = (index) => {
    setImportedSVGs(prev => prev.filter((_, i) => i !== index));
    if (selectedSVGIndex >= index && selectedSVGIndex > 0) {
      setSelectedSVGIndex(selectedSVGIndex - 1);
    }
  };

  const updateOption = (key, value) => {
    setOptions(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="max-w-6xl mx-auto p-4 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-center">SVG Tile Importer & Generator</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Controls Panel */}
        <div className="md:col-span-1 bg-white p-4 rounded-lg shadow max-h-screen overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">Controls</h2>
          
          {/* Import SVG Files */}
          <div className="mb-6">
            <h3 className="font-medium mb-2 pb-1 border-b">Import SVG Files</h3>
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".svg,image/svg+xml"
              multiple
              onChange={handleFileImport}
              className="w-full mb-2 text-sm"
            />
            
            <p className="text-xs text-gray-500 mb-3">
              Import one or more SVG files to use as tiles
            </p>
            
            {importedSVGs.length > 0 && (
              <div className="mb-3">
                <label className="block text-sm mb-1">Imported SVGs ({importedSVGs.length})</label>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {importedSVGs.map((svg, index) => (
                    <div key={svg.id} className="flex items-center justify-between bg-gray-100 p-2 rounded text-xs">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="selectedSVG"
                          checked={selectedSVGIndex === index}
                          onChange={() => setSelectedSVGIndex(index)}
                          className="mr-2"
                        />
                        <span className="truncate max-w-32">{svg.name}</span>
                      </div>
                      <button
                        onClick={() => removeSVG(index)}
                        className="text-red-500 hover:text-red-700 ml-2"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Grid Settings */}
          <div className="mb-4">
            <h3 className="font-medium mb-2 pb-1 border-b">Grid Settings</h3>
            
            <div className="mb-2">
              <label className="block text-sm mb-1">Grid Size: {options.gridSize}×{options.gridSize}</label>
              <input 
                type="range" 
                min="2" 
                max="8" 
                value={options.gridSize} 
                onChange={e => updateOption('gridSize', parseInt(e.target.value))} 
                className="w-full"
              />
            </div>
            
            <div className="mb-2">
              <label className="block text-sm mb-1">Tile Size: {options.tileSize}px</label>
              <input 
                type="range" 
                min="80" 
                max="200" 
                step="10"
                value={options.tileSize} 
                onChange={e => updateOption('tileSize', parseInt(e.target.value))} 
                className="w-full"
              />
            </div>
            
            <div className="mb-2">
              <label className="block text-sm mb-1">Spacing: {options.spacing}px</label>
              <input 
                type="range" 
                min="0" 
                max="20" 
                value={options.spacing} 
                onChange={e => updateOption('spacing', parseInt(e.target.value))} 
                className="w-full"
              />
            </div>
            
            <div className="mb-2">
              <label className="block text-sm mb-1">Background Color</label>
              <input 
                type="color" 
                value={options.backgroundColor} 
                onChange={e => updateOption('backgroundColor', e.target.value)} 
                className="w-full h-8"
              />
            </div>
            
            <div className="mb-2 flex items-center">
              <input 
                type="checkbox"
                id="showGrid"
                checked={options.showGrid}
                onChange={e => updateOption('showGrid', e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="showGrid" className="text-sm">Show Grid Lines</label>
            </div>
            
            <div className="mb-2 flex items-center">
              <input 
                type="checkbox"
                id="mixSVGs"
                checked={options.mixSVGs}
                onChange={e => updateOption('mixSVGs', e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="mixSVGs" className="text-sm">Mix All SVGs Randomly</label>
            </div>
            
            <div className="mb-2 flex items-center">
              <input 
                type="checkbox"
                id="sizeVariation"
                checked={options.sizeVariation}
                onChange={e => updateOption('sizeVariation', e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="sizeVariation" className="text-sm">Random Size Variation</label>
            </div>
            
            {options.sizeVariation && (
              <div className="mb-2">
                <label className="block text-sm mb-1">Size Range: {options.sizeVariationRange[0].toFixed(1)} - {options.sizeVariationRange[1].toFixed(1)}</label>
                <div className="flex space-x-2">
                  <input 
                    type="range" 
                    min="0.3" 
                    max="1" 
                    step="0.1"
                    value={options.sizeVariationRange[0]} 
                    onChange={e => updateOption('sizeVariationRange', [parseFloat(e.target.value), options.sizeVariationRange[1]])} 
                    className="flex-1"
                  />
                  <input 
                    type="range" 
                    min="1" 
                    max="2" 
                    step="0.1"
                    value={options.sizeVariationRange[1]} 
                    onChange={e => updateOption('sizeVariationRange', [options.sizeVariationRange[0], parseFloat(e.target.value)])} 
                    className="flex-1"
                  />
                </div>
              </div>
            )}
          </div>
          
          {/* Color Settings */}
          <div className="mb-4">
            <h3 className="font-medium mb-2 pb-1 border-b">Color Settings</h3>
            
            <div className="mb-2 flex items-center">
              <input 
                type="checkbox"
                id="applyColorScheme"
                checked={options.applyColorScheme}
                onChange={e => updateOption('applyColorScheme', e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="applyColorScheme" className="text-sm">Apply Color Scheme</label>
            </div>
            
            {options.applyColorScheme && (
              <>
                <div className="mb-2">
                  <label className="block text-sm mb-1">Color Scheme</label>
                  <select 
                    value={options.colorScheme} 
                    onChange={e => updateOption('colorScheme', e.target.value)}
                    className="w-full p-2 border rounded text-sm"
                  >
                    {Object.keys(colorSchemes).map(scheme => (
                      <option key={scheme} value={scheme}>
                        {scheme.charAt(0).toUpperCase() + scheme.slice(1).replace(/([A-Z])/g, ' $1')}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="mb-2">
                  <label className="block text-sm mb-1">Fill Opacity: {options.fillOpacity.toFixed(2)}</label>
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.1"
                    value={options.fillOpacity} 
                    onChange={e => updateOption('fillOpacity', parseFloat(e.target.value))} 
                    className="w-full"
                  />
                </div>
                
                <div className="mb-2 flex items-center">
                  <input 
                    type="checkbox"
                    id="recolorElements"
                    checked={options.recolorElements}
                    onChange={e => updateOption('recolorElements', e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="recolorElements" className="text-sm">Smart Element Recoloring</label>
                </div>
              </>
            )}
          </div>
          
          {/* Transform Settings */}
          <div className="mb-4">
            <h3 className="font-medium mb-2 pb-1 border-b">Transforms</h3>
            
            <div className="mb-2">
              <label className="block text-sm mb-1">Random Offset: {options.randomOffset}px</label>
              <input 
                type="range" 
                min="0" 
                max="20" 
                value={options.randomOffset} 
                onChange={e => updateOption('randomOffset', parseInt(e.target.value))} 
                className="w-full"
              />
            </div>
            
            <div className="mb-2">
              <label className="block text-sm mb-1">Scale Variation: {options.scaleVariation.toFixed(2)}</label>
              <input 
                type="range" 
                min="0" 
                max="0.5" 
                step="0.05"
                value={options.scaleVariation} 
                onChange={e => updateOption('scaleVariation', parseFloat(e.target.value))} 
                className="w-full"
              />
            </div>
            
            <div className="mb-2 flex items-center">
              <input 
                type="checkbox"
                id="randomRotation"
                checked={options.randomRotation}
                onChange={e => updateOption('randomRotation', e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="randomRotation" className="text-sm">Random Rotation</label>
            </div>
            
            {!options.randomRotation && (
              <div className="mb-2">
                <label className="block text-sm mb-1">Rotation: {options.rotation}°</label>
                <input 
                  type="range" 
                  min="0" 
                  max="360" 
                  step="15"
                  value={options.rotation} 
                  onChange={e => updateOption('rotation', parseInt(e.target.value))} 
                  className="w-full"
                />
              </div>
            )}
          </div>
          
          {/* Effects */}
          <div className="mb-4">
            <h3 className="font-medium mb-2 pb-1 border-b">Effects</h3>
            
            <div className="mb-2 flex items-center">
              <input 
                type="checkbox"
                id="applyGradients"
                checked={options.applyGradients}
                onChange={e => updateOption('applyGradients', e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="applyGradients" className="text-sm">Apply Gradients</label>
            </div>
            
            <div className="mb-2 flex items-center">
              <input 
                type="checkbox"
                id="shadowEffect"
                checked={options.shadowEffect}
                onChange={e => updateOption('shadowEffect', e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="shadowEffect" className="text-sm">Drop Shadow</label>
            </div>
            
            <div className="mb-2 flex items-center">
              <input 
                type="checkbox"
                id="globalGradient"
                checked={options.globalGradient}
                onChange={e => updateOption('globalGradient', e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="globalGradient" className="text-sm">Global Gradient Overlay</label>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            <button 
              onClick={generateTileGrid} 
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors text-sm"
              disabled={importedSVGs.length === 0 || isGenerating}
            >
              {isGenerating ? 'Generating...' : 'Generate Grid'}
            </button>
            <button 
              onClick={exportSVG} 
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition-colors text-sm"
              disabled={importedSVGs.length === 0}
            >
              Export SVG
            </button>
            <button 
              onClick={exportPNG} 
              className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded transition-colors text-sm"
              disabled={importedSVGs.length === 0}
            >
              Export PNG
            </button>
          </div>
        </div>
        
        {/* Preview Panel */}
        <div className="md:col-span-2">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Preview</h2>
            
            {importedSVGs.length === 0 ? (
              <div className="flex items-center justify-center h-96 border-2 border-dashed border-gray-300 rounded-lg">
                <div className="text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No SVG files imported</h3>
                  <p className="mt-1 text-sm text-gray-500">Upload SVG files to get started</p>
                </div>
              </div>
            ) : (
              <div 
                ref={svgContainerRef} 
                className="flex justify-center items-center border border-gray-200 rounded-lg overflow-auto"
                style={{ minHeight: '500px' }}
              >
                {isGenerating && (
                  <div className="text-gray-500">Generating tile grid...</div>
                )}
              </div>
            )}
            
            {generationInfo && (
              <div className="mt-4 text-sm text-gray-600">
                <p>{generationInfo}</p>
              </div>
            )}
            
            <div className="mt-4 text-sm">
              <p><strong>SVG Tile Importer & Generator:</strong></p>
              <p className="mt-2">Create dynamic tile patterns from your SVG files with advanced effects:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li><strong>Multi-SVG Mixing:</strong> Randomly combines multiple imported SVGs in each grid</li>
                <li><strong>18+ Color Schemes:</strong> From Primary Bold to Cyberpunk palettes</li>
                <li><strong>Smart Recoloring:</strong> Intelligently recolors individual SVG elements</li>
                <li><strong>Global Effects:</strong> Apply unified gradients and effects across the entire pattern</li>
                <li><strong>Advanced Transforms:</strong> Random positioning, scaling, and rotation</li>
                <li><strong>High-Quality Export:</strong> SVG and PNG output options</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TileImportGenerator;
