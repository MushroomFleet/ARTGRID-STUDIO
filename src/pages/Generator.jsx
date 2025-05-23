import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getGenerator, getGeneratorList, DEFAULT_GENERATOR } from '../generators';

const Generator = () => {
  const { mode } = useParams();
  const navigate = useNavigate();
  const generators = getGeneratorList();
  
  // Get the current generator or default
  const currentGeneratorSlug = mode || DEFAULT_GENERATOR;
  const currentGenerator = getGenerator(currentGeneratorSlug);
  
  // If the generator doesn't exist, show generator selection
  if (!currentGenerator) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Choose a Generator</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {generators.map((generator) => (
            <div key={generator.slug} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {generator.name}
                </h3>
                <p className="text-gray-600 mb-4">
                  {generator.description}
                </p>
                
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Features:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {generator.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <button
                  onClick={() => navigate(`/generator/${generator.slug}`)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Use {generator.name}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Render the selected generator with navigation
  const GeneratorComponent = currentGenerator.component;

  return (
    <div className="min-h-screen">
      {/* Generator Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{currentGenerator.name}</h1>
              <p className="text-sm text-gray-600 mt-1">{currentGenerator.description}</p>
            </div>
            
            {/* Generator Selector */}
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">Switch Generator:</label>
              <select
                value={currentGeneratorSlug}
                onChange={(e) => navigate(`/generator/${e.target.value}`)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {generators.map((generator) => (
                  <option key={generator.slug} value={generator.slug}>
                    {generator.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Generator Component */}
      <GeneratorComponent />
    </div>
  );
};

export default Generator;
