import React from 'react';

const About = () => {
  return (
    <div className="max-w-4xl mx-auto p-4 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">About ARTGRID STUDIO</h1>
      
      {/* Overview */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
        <div className="prose prose-lg text-gray-600">
          <p className="mb-4">
            ARTGRID STUDIO is a modern web-based interface for generating artistic SVG grid patterns. 
            It's built on the foundation of the original Python script <code>SVG_ArtGrid.py</code>, 
            bringing the power of algorithmic art creation to your browser.
          </p>
          <p className="mb-4">
            Our platform transforms the command-line functionality of the original script into an 
            intuitive, interactive experience that makes creating beautiful geometric art accessible to everyone.
          </p>
        </div>
      </section>

      {/* Original Script */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Based on SVG_ArtGrid.py</h2>
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Original Script Features</h3>
          <ul className="space-y-2 text-gray-600">
            <li>• Command-line tool for generating SVG art grids</li>
            <li>• Multiple geometric pattern types (circles, crosses, diagonal squares, etc.)</li>
            <li>• Dynamic color palette integration from nice-color-palettes</li>
            <li>• Configurable grid dimensions and square sizes</li>
            <li>• Optional "big block" focal points</li>
            <li>• Random seed support for reproducible results</li>
            <li>• Customizable pattern selection</li>
          </ul>
        </div>
        <p className="text-gray-600">
          The Python script provided a powerful but technical way to create these artworks. 
          ARTGRID STUDIO brings all these capabilities to the web with real-time preview, 
          interactive controls, and additional enhancements.
        </p>
      </section>

      {/* Technical Details */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Technical Implementation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Frontend Technologies</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• React 18 with modern hooks</li>
              <li>• React Router for navigation</li>
              <li>• Tailwind CSS for styling</li>
              <li>• SVG DOM manipulation</li>
              <li>• Real-time parameter adjustment</li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Art Generation</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Direct SVG element creation</li>
              <li>• Pattern-based drawing functions</li>
              <li>• Color palette algorithms</li>
              <li>• Advanced SVG filters</li>
              <li>• Export functionality</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Pattern Types */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Available Pattern Types</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: 'Circle', description: 'Simple and complex circular patterns' },
            { name: 'Opposite Circles', description: 'Dual circles with masking effects' },
            { name: 'Cross/X', description: 'Plus signs and X patterns' },
            { name: 'Half Square', description: 'Triangular half-filled squares' },
            { name: 'Diagonal Square', description: 'Diagonal triangle patterns' },
            { name: 'Quarter Circle', description: 'Arc segments in corners' },
            { name: 'Dots', description: 'Multi-dot grid patterns' },
            { name: 'Letter Block', description: 'Alphanumeric character patterns' }
          ].map((pattern, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900">{pattern.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{pattern.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Enhanced Features */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Enhanced Features</h2>
        <div className="bg-blue-50 p-6 rounded-lg">
          <p className="text-gray-700 mb-4">
            Beyond the original script capabilities, ARTGRID STUDIO adds:
          </p>
          <ul className="space-y-2 text-gray-700">
            <li>• <strong>Real-time Preview:</strong> See changes instantly as you adjust parameters</li>
            <li>• <strong>Interactive Controls:</strong> Sliders, checkboxes, and dropdowns for easy customization</li>
            <li>• <strong>Multiple Generators:</strong> Different styles beyond the original grid pattern</li>
            <li>• <strong>Enhanced Effects:</strong> Drop shadows, noise filters, and other visual enhancements</li>
            <li>• <strong>Better UX:</strong> No command-line knowledge required</li>
            <li>• <strong>Responsive Design:</strong> Works on desktop, tablet, and mobile devices</li>
          </ul>
        </div>
      </section>

      {/* Usage */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Use</h2>
        <div className="space-y-4 text-gray-600">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-1">1</div>
            <div>
              <h3 className="font-semibold text-gray-900">Choose a Generator</h3>
              <p>Navigate to the Generators page and select the type of artwork you want to create.</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-1">2</div>
            <div>
              <h3 className="font-semibold text-gray-900">Customize Parameters</h3>
              <p>Use the control panel to adjust grid size, patterns, colors, and effects to your liking.</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-1">3</div>
            <div>
              <h3 className="font-semibold text-gray-900">Generate and Export</h3>
              <p>Click "Generate New" to create variations, then "Export SVG" to download your artwork.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Future Development */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Future Development</h2>
        <div className="bg-gray-50 p-6 rounded-lg">
          <p className="text-gray-700 mb-4">Planned enhancements include:</p>
          <ul className="space-y-2 text-gray-700">
            <li>• Additional pattern generators</li>
            <li>• Custom color palette creation</li>
            <li>• Animation and motion graphics</li>
            <li>• Batch generation tools</li>
            <li>• Community gallery features</li>
            <li>• Export to additional formats (PNG, PDF)</li>
          </ul>
        </div>
      </section>

      {/* Contact */}
      <section className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions or Feedback?</h2>
        <p className="text-gray-600 mb-6">
          We'd love to hear from you! Whether you have questions, suggestions, or just want to share 
          your creations, feel free to reach out.
        </p>
        <div className="flex justify-center space-x-4">
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            View on GitHub
          </a>
          <a 
            href="mailto:hello@artgridstudio.com" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Contact Us
          </a>
        </div>
      </section>
    </div>
  );
};

export default About;
