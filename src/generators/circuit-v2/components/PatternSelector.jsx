import React from 'react';

const PatternSelector = ({ options, updateOptions }) => {
  
  const updatePatternEnabled = (pattern, enabled) => {
    const newOptions = {
      ...options,
      patterns: {
        ...options.patterns,
        enabled: {
          ...options.patterns.enabled,
          [pattern]: enabled
        }
      }
    };
    updateOptions(newOptions);
  };

  const updatePatternWeight = (pattern, weight) => {
    const newOptions = {
      ...options,
      patterns: {
        ...options.patterns,
        weights: {
          ...options.patterns.weights,
          [pattern]: weight
        }
      }
    };
    updateOptions(newOptions);
  };

  const patterns = [
    { key: 'checkerboard', name: 'Checkerboard', category: 'Basic' },
    { key: 'horizontalBars', name: 'Horizontal Bars', category: 'Basic' },
    { key: 'fiveCircles', name: 'Five Circles', category: 'Basic' },
    { key: 'concentricCircles', name: 'Concentric Circles', category: 'Basic' },
    { key: 'triangleCorner', name: 'Triangle Corner', category: 'Basic' },
    { key: 'circle', name: 'Circle', category: 'Basic' },
    { key: 'verticalLines', name: 'Vertical Lines', category: 'Basic' },
    { key: 'circleGrid', name: 'Circle Grid', category: 'Basic' },
    { key: 'diamond', name: 'Diamond', category: 'Basic' },
    { key: 'bezierCurves', name: 'Bezier Curves', category: 'Advanced' },
    { key: 'fractalTree', name: 'Fractal Tree', category: 'Advanced' },
    { key: 'spiralPattern', name: 'Spiral Pattern', category: 'Advanced' },
    { key: 'circuitTrace', name: 'Circuit Trace', category: 'Advanced' },
    { key: 'organicBlob', name: 'Organic Blob', category: 'Advanced' }
  ];

  const basicPatterns = patterns.filter(p => p.category === 'Basic');
  const advancedPatterns = patterns.filter(p => p.category === 'Advanced');

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="space-y-2">
        <button
          onClick={() => patterns.forEach(p => updatePatternEnabled(p.key, true))}
          className="w-full px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded text-sm transition-colors"
        >
          Enable All Patterns
        </button>
        <button
          onClick={() => patterns.forEach(p => updatePatternEnabled(p.key, false))}
          className="w-full px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded text-sm transition-colors"
        >
          Disable All Patterns
        </button>
      </div>

      {/* Basic Patterns */}
      <div>
        <h3 className="font-medium mb-3 pb-1 border-b text-gray-800">Basic Patterns</h3>
        <div className="space-y-2">
          {basicPatterns.map(pattern => (
            <div key={pattern.key} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={pattern.key}
                  checked={options.patterns.enabled[pattern.key] || false}
                  onChange={e => updatePatternEnabled(pattern.key, e.target.checked)}
                  className="rounded"
                />
                <label htmlFor={pattern.key} className="text-sm">{pattern.name}</label>
              </div>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={options.patterns.weights[pattern.key] || 1.0}
                onChange={e => updatePatternWeight(pattern.key, parseFloat(e.target.value))}
                className="w-16"
                disabled={!options.patterns.enabled[pattern.key]}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Advanced Patterns */}
      <div>
        <h3 className="font-medium mb-3 pb-1 border-b text-gray-800">Advanced Patterns</h3>
        <div className="space-y-2">
          {advancedPatterns.map(pattern => (
            <div key={pattern.key} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={pattern.key}
                  checked={options.patterns.enabled[pattern.key] || false}
                  onChange={e => updatePatternEnabled(pattern.key, e.target.checked)}
                  className="rounded"
                />
                <label htmlFor={pattern.key} className="text-sm">{pattern.name}</label>
              </div>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={options.patterns.weights[pattern.key] || 1.0}
                onChange={e => updatePatternWeight(pattern.key, parseFloat(e.target.value))}
                className="w-16"
                disabled={!options.patterns.enabled[pattern.key]}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PatternSelector;
