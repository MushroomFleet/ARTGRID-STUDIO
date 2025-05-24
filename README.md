# 🎨 ARTGRID-STUDIO

**A Modern Web-Based SVG Art Generator Suite**

Transform geometric patterns into stunning visual artwork with six specialized generators: from basic artistic grids to advanced circuit-style compositions and next-generation multi-layer systems. Built with React and inspired by algorithmic art principles.

🌐 **Visit:** [https://scuffedepoch.com/artgrid-studio](https://scuffedepoch.com/artgrid-studio) | **Version:** 1.8.8 (WEB)

🚀 **Visit:** [https://github.com/MushroomFleet/ARTGRID-STUDIO/releases](https://github.com/MushroomFleet/ARTGRID-STUDIO/releases) | **Version:** 1.8.8 (EXE)

---

## ✨ Features

### 🎯 **Six Powerful Generators**

#### **1. Artistic Grid Generator** - *The Original*
- **8 Geometric Patterns**: Circles, crosses, diagonal squares, quarter circles, dots, letters, half squares, and opposite circles
- **Dynamic Color Palettes**: Curated color schemes from the nice-color-palettes collection
- **Big Block Focal Points**: Optional larger pattern elements for visual emphasis
- **Customizable Grid**: Adjustable rows, columns, and square sizes
- **Visual Effects**: Drop shadows, noise textures, and gradient backgrounds

#### **2. Art Grid V2 Generator** - *Next-Generation*
- **6 Grid Types**: Rectangular, hexagonal, triangular, voronoi, radial, and irregular layouts
- **25+ Pattern Types**: Across 7 categories (geometric, organic, artistic, textures)
- **Multi-Layer System**: Blend modes and opacity controls for complex compositions
- **Advanced Effects**: Shadows, noise, distortion, and 3D bevels
- **Smart Distribution**: AI-assisted composition and pattern placement
- **Interactive Editing**: Real-time parameter adjustment and live preview
- **Style Presets**: Classic, Modern, Organic, Artistic, and Minimal themes
- **Professional Export**: Print-ready quality with multiple format options

#### **3. Circuit-Style Generator** - *Tech-Inspired*
- **25 Different Patterns**: Circuit board-inspired geometric shapes
- **Grid-Based Layout**: Structured geometric arrangement
- **6 Color Schemes**: Original, Blues, Earth, Pastel, Vibrant, and Monochrome
- **Shadow & Noise Effects**: Professional visual enhancement
- **Seeded Randomization**: Reproducible results with seed control

#### **4. Balanced Circuit Generator** - *Weighted Distribution*
- **Weighted Color System**: Intelligent color balance algorithms
- **Color Balance Presets**: Balanced, Red Focus, Blue Focus, and Minimal
- **Jagged Circuit Shapes**: Organic circuit-like pattern generation
- **Size Distribution**: Large, medium, and small shape categories
- **Grid Structure**: Organized layout with circuit aesthetics

#### **5. Triptych Circuit Generator** - *Three-Panel Art*
- **Three Panel Styles**: Hatched, Jagged, and Block pattern types
- **Triptych Mode**: Complete three-panel compositions
- **Individual Panels**: Single panel generation options
- **Advanced Filling**: Hatching and cross-hatching pattern techniques
- **Circuit Connectors**: Interconnected path systems
- **Detailed Elements**: Small decorative circuit components

#### **6. Maze-Style Generator** - *Organic Paths*
- **Organic Path Generation**: Algorithm-generated interconnected paths
- **Cluster-Based Distribution**: Natural-looking pattern placement
- **Advanced Effects**: Turbulence filters, drop shadows, and noise effects
- **Multiple Color Schemes**: Red-orange, blue-red, monochrome, and vibrant palettes
- **Path Customization**: Adjustable length, density, and corner probability

### 🛠 **Universal Features**
- **SVG Export**: Download high-quality vector graphics
- **Real-Time Preview**: Instant visual feedback as you adjust parameters
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **No Installation Required**: Runs in any modern web browser
- **Desktop Application**: Standalone .exe version available
- **Cross-Platform**: Web and desktop deployment options

---

## 🚀 Installation

### Prerequisites
- **Node.js** (version 14.0 or higher)
- **npm** (comes with Node.js)

### Step-by-Step Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/MushroomFleet/ARTGRID-STUDIO
   cd ARTGRID-STUDIO
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm start
   ```

4. **Open in Browser**
   - Navigate to `http://localhost:3000`
   - The application will automatically reload when you make changes

### Build Options

#### Web Version
```bash
npm run build:web
```
Creates an optimized web build in the `build-web/` folder.

#### Desktop Application
```bash
npm run build:electron
```
Creates desktop-ready build with Electron integration.

#### Build All Versions
```bash
npm run build:all
```
Builds both web and desktop versions simultaneously.

---

## 📖 Usage Guide

### Getting Started

1. **Launch the Application**
   - **Web**: Open your browser and go to `http://localhost:3000`
   - **Desktop**: Run the downloaded .exe file
   - You'll see the homepage with navigation to all six generators

2. **Choose Your Generator**
   - **Artistic Grid**: Classic geometric patterns (beginner-friendly)
   - **Art Grid V2**: Advanced multi-layer compositions (professional)
   - **Circuit-Style**: Tech-inspired circuit patterns
   - **Balanced Circuit**: Weighted color distribution circuits
   - **Triptych Circuit**: Three-panel circuit art
   - **Maze-Style**: Organic interconnected paths

### Generator-Specific Guides

#### **Artistic Grid Generator**
**Grid Settings**
- **Rows/Columns**: Set specific values or use "Random" for varied layouts
- **Square Size**: Adjust the pixel size of each grid cell (50-200px)

**Pattern Selection**
- **Circles**: Full and concentric circles
- **Crosses**: Plus signs and X shapes  
- **Diagonal Squares**: Triangle-filled squares
- **Quarter Circles**: Arc patterns in corners
- **Dots**: Regular dot grids (2x2, 3x3, 4x4)
- **Letters**: Random alphanumeric characters
- **Half Squares**: Triangular fills
- **Opposite Circles**: Overlapping circle pairs

#### **Art Grid V2 Generator**
**Grid Types**
- **Rectangular**: Traditional grid layout
- **Hexagonal**: Honeycomb pattern arrangement
- **Triangular**: Triangular tessellation
- **Voronoi**: Organic cell-based divisions
- **Radial**: Circular radiating patterns
- **Irregular**: Randomly distributed points

**Pattern Categories**
- **Geometric**: Circles, squares, triangles, polygons
- **Organic**: Flowing shapes, natural forms
- **Artistic**: Creative interpretations, abstract forms
- **Textures**: Surface patterns, material simulations

#### **Circuit Generators**
**Common Features Across Circuit Types**
- **Pattern Density**: Control shape distribution
- **Color Schemes**: Choose from curated palettes
- **Size Variations**: Mix of large, medium, small elements
- **Visual Effects**: Shadows, noise, and distortion options

#### **Maze-Style Generator**
**Path Configuration**
- **Grid Density**: Overall pattern complexity (20-60)
- **Cell Size**: Individual path segment size (8-16px)
- **Path Density**: Grid fill percentage (0.4-1.0)
- **Corner Probability**: Direction change frequency
- **Cluster Mode**: Grouped vs random distribution

### Exporting Your Work

1. **Generate Your Design**: Adjust parameters until satisfied
2. **Click "Export SVG"**: Downloads a high-quality vector file
3. **File Usage**: SVG files can be:
   - Opened in web browsers
   - Edited in vector graphics software (Illustrator, Inkscape)
   - Used in print or digital projects
   - Scaled to any size without quality loss

---

## 🔧 Technical Details

### Tech Stack
- **Frontend**: React 18.2.0
- **Styling**: TailwindCSS 3.2.4
- **Routing**: React Router DOM 6.8.0
- **Data Visualization**: D3.js 7.9.0
- **Build Tool**: Create React App
- **Desktop**: Electron 22.0.0
- **Graphics**: Native SVG with DOM manipulation

### Project Structure
```
ARTGRID-STUDIO/
├── public/           # Static assets and Electron files
├── src/
│   ├── components/   # Reusable UI components
│   ├── generators/   # Pattern generation logic
│   │   ├── artistic-grid/        # Original geometric patterns
│   │   ├── art-grid-v2/         # Next-gen multi-layer system
│   │   ├── circuit-style/       # Circuit board patterns
│   │   ├── balanced-circuit/    # Weighted circuit distributions
│   │   ├── triptic-circuit/     # Three-panel compositions
│   │   └── maze-style/          # Organic path generation
│   ├── pages/        # Route components
│   ├── utils/        # Helper functions and utilities
│   └── index.js      # Application entry point
├── build/            # Electron application build
├── build-web/        # Web application build
├── arch/             # Version archives
├── package.json      # Dependencies and scripts
└── README.md         # This file
```

### Browser Compatibility
- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **Mobile**: iOS Safari, Chrome Mobile
- **Desktop**: Windows 10/11 (portable .exe)
- **Requirements**: JavaScript enabled, SVG support

### Generator Evolution
The project has evolved from a simple Python script to a comprehensive art generation suite:

1. **SVG_ArtGrid.py** (Original): Command-line Python script
2. **Artistic Grid** (V1): Web adaptation with React
3. **Maze-Style** (V1.5): Added organic path generation
4. **Circuit Generators** (V1.6-1.7): Tech-inspired patterns
5. **Art Grid V2** (V1.8): Professional multi-layer system
6. **Triptych Circuit** (V1.8.5): Multi-panel compositions

---

## 🔨 Development

### Available Scripts

- **`npm start`**: Development server with hot reload
- **`npm run build:web`**: Web production build
- **`npm run build:electron`**: Desktop application build
- **`npm run build:all`**: Build both web and desktop versions
- **`npm test`**: Run test suite
- **`npm run electron`**: Run development with Electron
- **`npm run dist`**: Package desktop application

### Contributing
1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

### Adding New Generators
1. Create a new folder in `src/generators/`
2. Implement the generator component
3. Add to the registry in `src/generators/index.js`
4. Update navigation and routing
5. Add generator-specific documentation

---

## 🚀 Deployment Status

### ✅ **Live Deployments**

#### **Web Application**
- **Status**: ✅ **DEPLOYED**
- **URL**: [https://scuffedepoch.com/artgrid-studio](https://scuffedepoch.com/artgrid-studio)
- **Version**: 1.8.8
- **Features**: All 6 generators available
- **Hosting**: Apache2 server with optimized build

#### **Desktop Application** 
- **Status**: ✅ **DEPLOYED**
- **Download**: [GitHub Releases](https://github.com/MushroomFleet/ARTGRID-STUDIO/releases)
- **Version**: 1.8.8
- **Format**: Portable .exe (Windows)
- **Size**: Optimized Electron package
- **Features**: Full offline functionality

### Deployment Options

#### **Option 1: Static Web Hosting**
```bash
npm run build:web
# Upload build-web/ folder contents to your web server
```

**Compatible with:**
- Apache2 servers
- Nginx
- GitHub Pages
- Netlify
- Vercel
- Any static hosting service

#### **Option 2: Desktop Application (.exe)**
```bash
npm run build:electron
npm run dist
```

**Packaging Options:**
- **Electron** (Current): Full-featured desktop app
- **Tauri** (Future): Rust-based, lightweight
- **Neutralino** (Alternative): Minimal web wrapper

#### **Option 3: Server Deployment**
For Apache2 hosting:
1. Build the project: `npm run build:web`
2. Copy `build-web/` contents to your web root
3. Configure Apache for single-page application routing
4. Set up HTTPS for optimal performance

---

## 🎯 Future Enhancements

### Planned Features
- **Additional Generators**: Voronoi diagrams, fractals, cellular automata
- **Animation Support**: Animated SVG exports with timeline controls
- **Batch Generation**: Multiple variations with parameter sweeps
- **Color Palette Editor**: Custom color scheme creation tools
- **3D Patterns**: WebGL-based three-dimensional compositions
- **API Integration**: Cloud saving and sharing capabilities

### Version Roadmap
- **V1.9**: Animation system and batch generation
- **V2.0**: 3D pattern generation with Three.js
- **V2.1**: Cloud integration and user accounts
- **V2.2**: AI-assisted pattern generation

---

## 📚 Resources & Credits

### Inspiration
- **Original Script**: `SVG_ArtGrid.py` - Command-line SVG art generator
- **Algorithmic Art**: Geometric pattern generation principles
- **Circuit Board Aesthetics**: Electronic design inspiration
- **Generative Art Community**: Ongoing inspiration and feedback

### Dependencies
- **React**: Meta's UI library for interactive interfaces
- **TailwindCSS**: Utility-first CSS framework
- **D3.js**: Data-driven document manipulation
- **Electron**: Cross-platform desktop applications
- **Nice Color Palettes**: Curated color scheme collection

### External Links
- **Main Website**: [scuffedepoch.com](https://www.scuffedepoch.com)
- **Color Palettes**: [nice-color-palettes](https://github.com/Jam3/nice-color-palettes)
- **SVG Specification**: [W3C SVG](https://www.w3.org/Graphics/SVG/)
- **React Documentation**: [reactjs.org](https://reactjs.org/)
- **Electron Guide**: [electronjs.org](https://www.electronjs.org/)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🤝 Support

- **Website**: [scuffedepoch.com](https://www.scuffedepoch.com)
- **Issues**: Report bugs via GitHub Issues
- **Documentation**: This README and inline code comments
- **Releases**: Check GitHub Releases for latest versions

---

**Made with ❤️ for the generative art community**

*From simple grids to complex compositions. Six generators. Infinite possibilities.*

*Transform algorithms into art. Create patterns that inspire.*
