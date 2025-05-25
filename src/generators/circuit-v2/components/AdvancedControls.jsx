import React from 'react';
import { constraints } from '../presets/defaultPresets.js';

const AdvancedControls = ({ options, updateOptions, tab = 'basic' }) => {
  
  // Helper function to update nested options
  const updateNestedOption = (path, value) => {
    const keys = path.split('.');
    const newOptions = { ...options };
    let current = newOptions;
    
    for (let i = 0; i < keys.length - 1; i++) {
      current[keys[i]] = { ...current[keys[i]] };
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = value;
    updateOptions(newOptions);
  };

  // Render basic controls
  const renderBasicControls = () => (
    <div className="space-y-6">
      {/* Canvas Settings */}
      <div>
        <h3 className="font-medium mb-3 pb-1 border-b text-gray-800">Canvas Settings</h3>
        
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Width: {options.canvas.width}px</label>
            <input 
              type="range" 
              min={constraints.canvas.width.min}
              max={constraints.canvas.width.max}
              step={constraints.canvas.width.step}
              value={options.canvas.width} 
              onChange={e => updateNestedOption('canvas.width', parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Height: {options.canvas.height}px</label>
            <input 
              type="range" 
              min={constraints.canvas.height.min}
              max={constraints.canvas.height.max}
              step={constraints.canvas.height.step}
              value={options.canvas.height} 
              onChange={e => updateNestedOption('canvas.height', parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Grid System */}
      <div>
        <h3 className="font-medium mb-3 pb-1 border-b text-gray-800">Grid System</h3>
        
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Grid Type</label>
            <select 
              value={options.grid.type} 
              onChange={e => updateNestedOption('grid.type', e.target.value)}
              className="w-full p-2 border rounded text-sm"
            >
              <option value="rectangular">Rectangular</option>
              <option value="hexagonal">Hexagonal</option>
              <option value="triangular">Triangular</option>
              <option value="irregular">Irregular/Organic</option>
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium mb-1">Cells X: {options.grid.cellsX}</label>
              <input 
                type="range" 
                min={constraints.grid.cellsX.min}
                max={constraints.grid.cellsX.max}
                value={options.grid.cellsX} 
                onChange={e => updateNestedOption('grid.cellsX', parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Cells Y: {options.grid.cellsY}</label>
              <input 
                type="range" 
                min={constraints.grid.cellsY.min}
                max={constraints.grid.cellsY.max}
                value={options.grid.cellsY} 
                onChange={e => updateNestedOption('grid.cellsY', parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Spacing: {options.grid.spacing.toFixed(1)}</label>
            <input 
              type="range" 
              min={constraints.grid.spacing.min}
              max={constraints.grid.spacing.max}
              step={constraints.grid.spacing.step}
              value={options.grid.spacing} 
              onChange={e => updateNestedOption('grid.spacing', parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <input 
              type="checkbox" 
              id="uniformSize"
              checked={options.grid.uniformSize}
              onChange={e => updateNestedOption('grid.uniformSize', e.target.checked)}
              className="rounded"
            />
            <label htmlFor="uniformSize" className="text-sm">Uniform cell sizes</label>
          </div>
          
          {!options.grid.uniformSize && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium mb-1">Min Size: {options.grid.minCellSize.toFixed(1)}</label>
                <input 
                  type="range" 
                  min="0.3"
                  max="1.0"
                  step="0.1"
                  value={options.grid.minCellSize} 
                  onChange={e => updateNestedOption('grid.minCellSize', parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Max Size: {options.grid.maxCellSize.toFixed(1)}</label>
                <input 
                  type="range" 
                  min="1.0"
                  max="2.0"
                  step="0.1"
                  value={options.grid.maxCellSize} 
                  onChange={e => updateNestedOption('grid.maxCellSize', parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Advanced Geometry */}
      <div>
        <h3 className="font-medium mb-3 pb-1 border-b text-gray-800">Geometry Controls</h3>
        
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Position Jitter: {(options.geometry.positionJitter * 100).toFixed(0)}%</label>
            <input 
              type="range" 
              min={constraints.geometry.positionJitter.min}
              max={constraints.geometry.positionJitter.max}
              step={constraints.geometry.positionJitter.step}
              value={options.geometry.positionJitter} 
              onChange={e => updateNestedOption('geometry.positionJitter', parseFloat(e.target.value))}
              className="w-full"
            />
            <span className="text-xs text-gray-500">How much shapes deviate from grid positions</span>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Scale Variance: {(options.geometry.scaleVariance * 100).toFixed(0)}%</label>
            <input 
              type="range" 
              min={constraints.geometry.scaleVariance.min}
              max={constraints.geometry.scaleVariance.max}
              step={constraints.geometry.scaleVariance.step}
              value={options.geometry.scaleVariance} 
              onChange={e => updateNestedOption('geometry.scaleVariance', parseFloat(e.target.value))}
              className="w-full"
            />
            <span className="text-xs text-gray-500">Random size variation of shapes</span>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Aspect Ratio Variance: {(options.geometry.aspectRatioVariance * 100).toFixed(0)}%</label>
            <input 
              type="range" 
              min={constraints.geometry.aspectRatioVariance.min}
              max={constraints.geometry.aspectRatioVariance.max}
              step={constraints.geometry.aspectRatioVariance.step}
              value={options.geometry.aspectRatioVariance} 
              onChange={e => updateNestedOption('geometry.aspectRatioVariance', parseFloat(e.target.value))}
              className="w-full"
            />
            <span className="text-xs text-gray-500">Independent X/Y scaling variation</span>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Rotation Mode</label>
            <select 
              value={options.geometry.rotationMode} 
              onChange={e => updateNestedOption('geometry.rotationMode', e.target.value)}
              className="w-full p-2 border rounded text-sm"
            >
              <option value="none">No Rotation</option>
              <option value="discrete">Discrete (90° steps)</option>
              <option value="continuous">Continuous</option>
            </select>
          </div>
          
          {options.geometry.rotationMode === 'discrete' && (
            <div>
              <label className="block text-sm font-medium mb-1">Rotation Steps: {options.geometry.rotationSteps}</label>
              <input 
                type="range" 
                min="2"
                max="16"
                value={options.geometry.rotationSteps} 
                onChange={e => updateNestedOption('geometry.rotationSteps', parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          )}
          
          {options.geometry.rotationMode === 'continuous' && (
            <div>
              <label className="block text-sm font-medium mb-1">Rotation Range: {options.geometry.rotationRange}°</label>
              <input 
                type="range" 
                min="45"
                max="360"
                step="15"
                value={options.geometry.rotationRange} 
                onChange={e => updateNestedOption('geometry.rotationRange', parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <input 
              type="checkbox" 
              id="overlapAllowed"
              checked={options.geometry.overlapAllowed}
              onChange={e => updateNestedOption('geometry.overlapAllowed', e.target.checked)}
              className="rounded"
            />
            <label htmlFor="overlapAllowed" className="text-sm">Allow shape overlap</label>
          </div>
        </div>
      </div>

      {/* Randomization */}
      <div>
        <h3 className="font-medium mb-3 pb-1 border-b text-gray-800">Randomization</h3>
        
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Main Seed: {options.randomSeed}</label>
            <input 
              type="number" 
              value={options.randomSeed} 
              onChange={e => updateOptions({ randomSeed: parseInt(e.target.value) || 0 })}
              className="w-full p-2 border rounded text-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Position Seed: {options.geometry.positionSeed}</label>
            <input 
              type="number" 
              value={options.geometry.positionSeed} 
              onChange={e => updateNestedOption('geometry.positionSeed', parseInt(e.target.value) || 0)}
              className="w-full p-2 border rounded text-sm"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => updateOptions({ randomSeed: Math.floor(Math.random() * 100000) })} 
              className="px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded text-sm transition-colors"
            >
              🎲 Random Main
            </button>
            <button 
              onClick={() => updateNestedOption('geometry.positionSeed', Math.floor(Math.random() * 100000))} 
              className="px-3 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded text-sm transition-colors"
            >
              📍 Random Position
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Render effects controls
  const renderEffectsControls = () => (
    <div className="space-y-6">
      {/* Shadow Effects */}
      <div>
        <h3 className="font-medium mb-3 pb-1 border-b text-gray-800">Shadow Effects</h3>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <input 
              type="checkbox" 
              id="shadowsEnabled"
              checked={options.visual.shadows.enabled}
              onChange={e => updateNestedOption('visual.shadows.enabled', e.target.checked)}
              className="rounded"
            />
            <label htmlFor="shadowsEnabled" className="text-sm font-medium">Enable Shadows</label>
          </div>
          
          {options.visual.shadows.enabled && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Shadow Blur: {(options.visual.shadows.layers[0]?.blur * 1000).toFixed(1)}</label>
                <input 
                  type="range" 
                  min={constraints.visual.shadowBlur.min}
                  max={constraints.visual.shadowBlur.max}
                  step={constraints.visual.shadowBlur.step}
                  value={options.visual.shadows.layers[0]?.blur || 0.02} 
                  onChange={e => {
                    const newShadows = { ...options.visual.shadows };
                    newShadows.layers[0] = { ...newShadows.layers[0], blur: parseFloat(e.target.value) };
                    updateNestedOption('visual.shadows', newShadows);
                  }}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Shadow Opacity: {(options.visual.shadows.layers[0]?.opacity * 100).toFixed(0)}%</label>
                <input 
                  type="range" 
                  min="0"
                  max="1"
                  step="0.01"
                  value={options.visual.shadows.layers[0]?.opacity || 0.6} 
                  onChange={e => {
                    const newShadows = { ...options.visual.shadows };
                    newShadows.layers[0] = { ...newShadows.layers[0], opacity: parseFloat(e.target.value) };
                    updateNestedOption('visual.shadows', newShadows);
                  }}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Shadow Color</label>
                <input 
                  type="color" 
                  value={options.visual.shadows.layers[0]?.color || '#000000'} 
                  onChange={e => {
                    const newShadows = { ...options.visual.shadows };
                    newShadows.layers[0] = { ...newShadows.layers[0], color: e.target.value };
                    updateNestedOption('visual.shadows', newShadows);
                  }}
                  className="w-full h-10 border rounded"
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Glow Effects */}
      <div>
        <h3 className="font-medium mb-3 pb-1 border-b text-gray-800">Glow Effects</h3>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <input 
              type="checkbox" 
              id="glowEnabled"
              checked={options.visual.glow.enabled}
              onChange={e => updateNestedOption('visual.glow.enabled', e.target.checked)}
              className="rounded"
            />
            <label htmlFor="glowEnabled" className="text-sm font-medium">Enable Glow</label>
          </div>
          
          {options.visual.glow.enabled && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Glow Intensity: {(options.visual.glow.intensity * 100).toFixed(0)}%</label>
                <input 
                  type="range" 
                  min={constraints.visual.glowIntensity.min}
                  max={constraints.visual.glowIntensity.max}
                  step={constraints.visual.glowIntensity.step}
                  value={options.visual.glow.intensity} 
                  onChange={e => updateNestedOption('visual.glow.intensity', parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Glow Spread: {(options.visual.glow.spread * 100).toFixed(1)}</label>
                <input 
                  type="range" 
                  min="0"
                  max="0.5"
                  step="0.01"
                  value={options.visual.glow.spread} 
                  onChange={e => updateNestedOption('visual.glow.spread', parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Glow Color</label>
                <input 
                  type="color" 
                  value={options.visual.glow.color} 
                  onChange={e => updateNestedOption('visual.glow.color', e.target.value)}
                  className="w-full h-10 border rounded"
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Border Effects */}
      <div>
        <h3 className="font-medium mb-3 pb-1 border-b text-gray-800">Border Effects</h3>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <input 
              type="checkbox" 
              id="bordersEnabled"
              checked={options.visual.borders.enabled}
              onChange={e => updateNestedOption('visual.borders.enabled', e.target.checked)}
              className="rounded"
            />
            <label htmlFor="bordersEnabled" className="text-sm font-medium">Enable Borders</label>
          </div>
          
          {options.visual.borders.enabled && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Border Width: {options.visual.borders.width}</label>
                <input 
                  type="range" 
                  min="0.5"
                  max="5"
                  step="0.5"
                  value={options.visual.borders.width} 
                  onChange={e => updateNestedOption('visual.borders.width', parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Border Style</label>
                <select 
                  value={options.visual.borders.style} 
                  onChange={e => updateNestedOption('visual.borders.style', e.target.value)}
                  className="w-full p-2 border rounded text-sm"
                >
                  <option value="solid">Solid</option>
                  <option value="dashed">Dashed</option>
                  <option value="dotted">Dotted</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Border Color</label>
                <input 
                  type="color" 
                  value={options.visual.borders.color} 
                  onChange={e => updateNestedOption('visual.borders.color', e.target.value)}
                  className="w-full h-10 border rounded"
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Noise Filter */}
      <div>
        <h3 className="font-medium mb-3 pb-1 border-b text-gray-800">Noise Filter</h3>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <input 
              type="checkbox" 
              id="noiseEnabled"
              checked={options.visual.noise.enabled}
              onChange={e => updateNestedOption('visual.noise.enabled', e.target.checked)}
              className="rounded"
            />
            <label htmlFor="noiseEnabled" className="text-sm font-medium">Enable Noise</label>
          </div>
          
          {options.visual.noise.enabled && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Noise Amount: {options.visual.noise.amount}</label>
                <input 
                  type="range" 
                  min={constraints.visual.noiseAmount.min}
                  max={constraints.visual.noiseAmount.max}
                  value={options.visual.noise.amount} 
                  onChange={e => updateNestedOption('visual.noise.amount', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Noise Type</label>
                <select 
                  value={options.visual.noise.type} 
                  onChange={e => updateNestedOption('visual.noise.type', e.target.value)}
                  className="w-full p-2 border rounded text-sm"
                >
                  <option value="uniform">Uniform</option>
                  <option value="gaussian">Gaussian</option>
                  <option value="perlin">Perlin-like</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Color Channels</label>
                <select 
                  value={options.visual.noise.colorChannels} 
                  onChange={e => updateNestedOption('visual.noise.colorChannels', e.target.value)}
                  className="w-full p-2 border rounded text-sm"
                >
                  <option value="rgb">RGB Channels</option>
                  <option value="luminance">Luminance Only</option>
                </select>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Post-Processing */}
      <div>
        <h3 className="font-medium mb-3 pb-1 border-b text-gray-800">Post-Processing</h3>
        
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Contrast: {options.visual.postProcessing.contrast.toFixed(2)}</label>
            <input 
              type="range" 
              min="0.5"
              max="2.0"
              step="0.01"
              value={options.visual.postProcessing.contrast} 
              onChange={e => updateNestedOption('visual.postProcessing.contrast', parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Brightness: {options.visual.postProcessing.brightness.toFixed(2)}</label>
            <input 
              type="range" 
              min="0.5"
              max="2.0"
              step="0.01"
              value={options.visual.postProcessing.brightness} 
              onChange={e => updateNestedOption('visual.postProcessing.brightness', parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Saturation: {options.visual.postProcessing.saturation.toFixed(2)}</label>
            <input 
              type="range" 
              min="0"
              max="2.0"
              step="0.01"
              value={options.visual.postProcessing.saturation} 
              onChange={e => updateNestedOption('visual.postProcessing.saturation', parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Gamma: {options.visual.postProcessing.gamma.toFixed(2)}</label>
            <input 
              type="range" 
              min="0.5"
              max="2.5"
              step="0.01"
              value={options.visual.postProcessing.gamma} 
              onChange={e => updateNestedOption('visual.postProcessing.gamma', parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {tab === 'basic' ? renderBasicControls() : renderEffectsControls()}
    </div>
  );
};

export default AdvancedControls;
