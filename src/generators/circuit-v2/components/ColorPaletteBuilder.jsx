import React from 'react';

const ColorPaletteBuilder = ({ options, updateOptions }) => {
  
  const updateColor = (index, color) => {
    const newPalette = [...options.colors.palette];
    newPalette[index] = color;
    updateOptions({
      ...options,
      colors: {
        ...options.colors,
        palette: newPalette
      }
    });
  };

  const addColor = () => {
    const newPalette = [...options.colors.palette, '#ffffff'];
    updateOptions({
      ...options,
      colors: {
        ...options.colors,
        palette: newPalette
      }
    });
  };

  const removeColor = (index) => {
    if (options.colors.palette.length > 2) {
      const newPalette = options.colors.palette.filter((_, i) => i !== index);
      updateOptions({
        ...options,
        colors: {
          ...options.colors,
          palette: newPalette
        }
      });
    }
  };

  const presetPalettes = {
    original: ['#e92f2f', '#dd6a7f', '#E0DBC5', '#e5c215', '#067bc2', '#8fc1dd', '#21377a'],
    blues: ['#0A2463', '#3E92CC', '#1E1B18', '#D8315B', '#1E56A0', '#163172', '#D6FFF6'],
    neon: ['#ff00ff', '#00ffff', '#ffff00', '#ff6600', '#00ff00', '#ff0066', '#6600ff'],
    monochrome: ['#ffffff', '#e5e5e5', '#cccccc', '#999999', '#666666', '#333333', '#000000']
  };

  const applyPreset = (presetName) => {
    updateOptions({
      ...options,
      colors: {
        ...options.colors,
        palette: [...presetPalettes[presetName]]
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Color Presets */}
      <div>
        <h3 className="font-medium mb-3 pb-1 border-b text-gray-800">Color Presets</h3>
        <div className="grid grid-cols-2 gap-2">
          {Object.keys(presetPalettes).map(presetName => (
            <button
              key={presetName}
              onClick={() => applyPreset(presetName)}
              className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm capitalize transition-colors"
            >
              {presetName}
            </button>
          ))}
        </div>
      </div>

      {/* Current Palette */}
      <div>
        <h3 className="font-medium mb-3 pb-1 border-b text-gray-800">Current Palette</h3>
        <div className="space-y-2">
          {options.colors.palette.map((color, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="color"
                value={color}
                onChange={e => updateColor(index, e.target.value)}
                className="w-12 h-8 border rounded"
              />
              <span className="text-sm font-mono flex-1">{color}</span>
              {options.colors.palette.length > 2 && (
                <button
                  onClick={() => removeColor(index)}
                  className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
        
        <button
          onClick={addColor}
          className="w-full mt-3 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm transition-colors"
        >
          + Add Color
        </button>
      </div>

      {/* Background Settings */}
      <div>
        <h3 className="font-medium mb-3 pb-1 border-b text-gray-800">Background</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Background Color</label>
            <input
              type="color"
              value={options.colors.background.color}
              onChange={e => updateOptions({
                ...options,
                colors: {
                  ...options.colors,
                  background: {
                    ...options.colors.background,
                    color: e.target.value
                  }
                }
              })}
              className="w-full h-10 border rounded"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorPaletteBuilder;
