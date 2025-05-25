import React from 'react';

const LayerManager = ({ options, updateOptions }) => {
  
  const updateLayerEnabled = (index, enabled) => {
    const newLayers = [...options.layers];
    newLayers[index] = { ...newLayers[index], enabled };
    updateOptions({ layers: newLayers });
  };

  const updateLayerOpacity = (index, opacity) => {
    const newLayers = [...options.layers];
    newLayers[index] = { ...newLayers[index], opacity };
    updateOptions({ layers: newLayers });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-3 pb-1 border-b text-gray-800">Layer Management</h3>
        <p className="text-sm text-gray-600 mb-4">
          Basic layer controls for the circuit pattern composition.
        </p>
      </div>

      {/* Main Layer */}
      <div>
        <h4 className="font-medium mb-2 text-gray-700">Main Pattern Layer</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Base Patterns</span>
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Active</span>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Layer Opacity: 100%</label>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01"
              value="1"
              disabled
              className="w-full opacity-50"
            />
            <span className="text-xs text-gray-500">Main layer opacity is fixed at 100%</span>
          </div>
        </div>
      </div>

      {/* Effects Layer */}
      <div>
        <h4 className="font-medium mb-2 text-gray-700">Effects Layer</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Visual Effects</span>
            <span className={`text-xs px-2 py-1 rounded ${
              options.visual.shadows.enabled || options.visual.glow.enabled 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-600'
            }`}>
              {options.visual.shadows.enabled || options.visual.glow.enabled ? 'Active' : 'Inactive'}
            </span>
          </div>
          
          <div className="text-xs text-gray-600">
            <div>• Shadows: {options.visual.shadows.enabled ? 'On' : 'Off'}</div>
            <div>• Glow: {options.visual.glow.enabled ? 'On' : 'Off'}</div>
            <div>• Borders: {options.visual.borders.enabled ? 'On' : 'Off'}</div>
            <div>• Noise: {options.visual.noise.enabled ? 'On' : 'Off'}</div>
          </div>
        </div>
      </div>

      {/* Layer Info */}
      <div className="bg-blue-50 p-3 rounded-lg">
        <h4 className="font-medium mb-2 text-blue-800">Layer System Info</h4>
        <div className="text-xs text-blue-700 space-y-1">
          <div>• Circuit V2 uses a simplified layer system</div>
          <div>• Pattern layers are automatically managed</div>
          <div>• Use the Effects tab to control layer effects</div>
          <div>• Advanced layer features available in future updates</div>
        </div>
      </div>

      {/* Quick Layer Actions */}
      <div>
        <h4 className="font-medium mb-2 text-gray-700">Quick Actions</h4>
        <div className="space-y-2">
          <button
            onClick={() => updateOptions({
              visual: {
                ...options.visual,
                shadows: { ...options.visual.shadows, enabled: !options.visual.shadows.enabled }
              }
            })}
            className="w-full px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm transition-colors"
          >
            Toggle Shadows
          </button>
          
          <button
            onClick={() => updateOptions({
              visual: {
                ...options.visual,
                glow: { ...options.visual.glow, enabled: !options.visual.glow.enabled }
              }
            })}
            className="w-full px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm transition-colors"
          >
            Toggle Glow Effects
          </button>
        </div>
      </div>
    </div>
  );
};

export default LayerManager;
