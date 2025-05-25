import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { defaultConfig } from './presets/defaultPresets.js';
import { renderEngine } from './engine/renderEngine.js';
import { patternLibrary } from './engine/patternLibrary.js';
import AdvancedControls from './components/AdvancedControls.jsx';
import PatternSelector from './components/PatternSelector.jsx';
import ColorPaletteBuilder from './components/ColorPaletteBuilder.jsx';
import LayerManager from './components/LayerManager.jsx';
import ExportPanel from './components/ExportPanel.jsx';

const CircuitV2Generator = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [options, setOptions] = useState(defaultConfig);
  const [activeTab, setActiveTab] = useState('basic');
  const [isGenerating, setIsGenerating] = useState(false);

  // Reset and redraw when options change
  useEffect(() => {
    if (canvasRef.current && !isGenerating) {
      generatePattern();
    }
  }, [options]);

  // Main pattern generation function
  const generatePattern = async () => {
    setIsGenerating(true);
    try {
      await renderEngine.render(canvasRef.current, options);
    } catch (error) {
      console.error('Generation error:', error);
    }
    setIsGenerating(false);
  };

  // Update options helper
  const updateOptions = (newOptions) => {
    setOptions(prev => ({ ...prev, ...newOptions }));
  };

  // Tab configuration
  const tabs = [
    { id: 'basic', label: 'Basic', icon: '⚙️' },
    { id: 'patterns', label: 'Patterns', icon: '🔲' },
    { id: 'colors', label: 'Colors', icon: '🎨' },
    { id: 'effects', label: 'Effects', icon: '✨' },
    { id: 'layers', label: 'Layers', icon: '📚' },
    { id: 'export', label: 'Export', icon: '💾' }
  ];

  // Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'basic':
        return <AdvancedControls options={options} updateOptions={updateOptions} />;
      case 'patterns':
        return <PatternSelector options={options} updateOptions={updateOptions} />;
      case 'colors':
        return <ColorPaletteBuilder options={options} updateOptions={updateOptions} />;
      case 'effects':
        return <AdvancedControls options={options} updateOptions={updateOptions} tab="effects" />;
      case 'layers':
        return <LayerManager options={options} updateOptions={updateOptions} />;
      case 'export':
        return <ExportPanel canvasRef={canvasRef} options={options} />;
      default:
        return <AdvancedControls options={options} updateOptions={updateOptions} />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 bg-gray-50" ref={containerRef}>
      <div className="mb-6 text-center">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Circuit V2 Generator
        </h1>
        <p className="text-gray-600 text-lg">Advanced circuit-style pattern generator with extensive parameter control</p>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Advanced Controls Panel */}
        <div className="xl:col-span-1 bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Tab Navigation */}
          <div className="flex overflow-x-auto bg-gray-100 border-b">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 px-3 py-3 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-blue-600 bg-white'
                    : 'text-gray-600 border-transparent hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span className="mr-1">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-4 max-h-96 overflow-y-auto">
            {renderTabContent()}
          </div>

          {/* Quick Actions */}
          <div className="p-4 bg-gray-50 border-t">
            <div className="flex flex-col gap-2">
              <button 
                onClick={generatePattern}
                disabled={isGenerating}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
                  isGenerating
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
                }`}
              >
                {isGenerating ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating...
                  </span>
                ) : (
                  'Generate New Pattern'
                )}
              </button>
              
              <button 
                onClick={() => updateOptions({ 
                  randomSeed: Math.floor(Math.random() * 100000),
                  geometry: { ...options.geometry, positionSeed: Math.floor(Math.random() * 100000) }
                })} 
                className="w-full py-2 px-4 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
              >
                🎲 Randomize All
              </button>
            </div>
          </div>
        </div>
        
        {/* Preview Panel */}
        <div className="xl:col-span-3">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Preview Header */}
            <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-gray-800">Live Preview</h2>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>Size: {options.canvas.width}×{options.canvas.height}</span>
                  <span>Grid: {options.grid.cellsX}×{options.grid.cellsY}</span>
                  <span>Patterns: {Object.values(options.patterns.enabled).filter(Boolean).length}</span>
                </div>
              </div>
            </div>

            {/* Canvas Container */}
            <div className="p-6">
              <div className="flex justify-center items-center border border-gray-200 rounded-lg overflow-hidden bg-black">
                <canvas 
                  ref={canvasRef} 
                  style={{ 
                    maxWidth: '100%', 
                    height: 'auto',
                    background: options.visual.backgroundColor || '#000000'
                  }}
                />
              </div>
              
              {/* Pattern Statistics */}
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <div className="font-semibold text-gray-800">Total Cells</div>
                  <div className="text-xl font-bold text-blue-600">{options.grid.cellsX * options.grid.cellsY}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <div className="font-semibold text-gray-800">Active Layers</div>
                  <div className="text-xl font-bold text-purple-600">{options.layers.filter(l => l.enabled).length}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <div className="font-semibold text-gray-800">Color Palette</div>
                  <div className="text-xl font-bold text-green-600">{options.colors.palette.length}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <div className="font-semibold text-gray-800">Random Seed</div>
                  <div className="text-xl font-bold text-orange-600">{options.randomSeed}</div>
                </div>
              </div>
            </div>

            {/* Feature Description */}
            <div className="p-4 bg-gray-50 border-t">
              <div className="text-sm text-gray-700">
                <p><strong>Circuit V2 Features:</strong></p>
                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ul className="list-disc list-inside space-y-1">
                    <li>35+ parametric pattern types with individual controls</li>
                    <li>Advanced geometry system with jitter and scaling</li>
                    <li>Multi-layer composition with blend modes</li>
                    <li>Custom color palette builder and harmony rules</li>
                  </ul>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Enhanced visual effects (shadows, glows, textures)</li>
                    <li>Non-uniform grid systems and pattern distribution</li>
                    <li>Real-time parameter linking and synchronization</li>
                    <li>Professional export options with vector support</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CircuitV2Generator;
