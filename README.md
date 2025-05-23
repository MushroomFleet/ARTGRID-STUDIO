# 🎨 ARTGRID-STUDIO

**A Modern Web-Based SVG Art Generator**

Transform geometric patterns into stunning visual artwork with two specialized generators: Artistic Grid patterns and Maze-Style compositions. Built with React and inspired by algorithmic art principles.

🌐 **Visit:** [scuffedepoch.com](https://www.scuffedepoch.com) | **Version:** 1.0.0

---

## ✨ Features

### 🎯 **Two Powerful Generators**

#### **Artistic Grid Generator**
- **8 Geometric Patterns**: Circles, crosses, diagonal squares, quarter circles, dots, letters, half squares, and opposite circles
- **Dynamic Color Palettes**: Curated color schemes from the nice-color-palettes collection
- **Big Block Focal Points**: Optional larger pattern elements for visual emphasis
- **Customizable Grid**: Adjustable rows, columns, and square sizes
- **Visual Effects**: Drop shadows, noise textures, and gradient backgrounds

#### **Maze-Style Generator**
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

---

## 🚀 Installation

### Prerequisites
- **Node.js** (version 14.0 or higher)
- **npm** (comes with Node.js)

### Step-by-Step Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/ARTGRID-STUDIO.git
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

### Build for Production
```bash
npm run build
```
This creates an optimized build in the `build/` folder ready for deployment.

---

## 📖 Usage Guide

### Getting Started

1. **Launch the Application**
   - Open your browser and go to `http://localhost:3000`
   - You'll see the homepage with navigation to both generators

2. **Choose Your Generator**
   - **Artistic Grid**: For geometric pattern grids
   - **Maze-Style**: For organic, interconnected path patterns

### Artistic Grid Generator

#### **Grid Settings**
- **Rows/Columns**: Set specific values or use "Random" for varied layouts
- **Square Size**: Adjust the pixel size of each grid cell (50-200px)

#### **Pattern Types**
Select which patterns to include:
- **Circles**: Full and concentric circles
- **Crosses**: Plus signs and X shapes  
- **Diagonal Squares**: Triangle-filled squares
- **Quarter Circles**: Arc patterns in corners
- **Dots**: Regular dot grids (2x2, 3x3, 4x4)
- **Letters**: Random alphanumeric characters
- **Half Squares**: Triangular fills
- **Opposite Circles**: Overlapping circle pairs

#### **Big Block Options**
- **Enable/Disable**: Toggle larger focal elements
- **Size Multiplier**: 2x or 3x the base square size
- **Random Placement**: Automatically positioned to avoid overflow

#### **Visual Effects**
- **Drop Shadow**: Adjustable offset and opacity
- **Noise Effect**: Turbulence-based texture with frequency control

### Maze-Style Generator

#### **Grid Settings**
- **Grid Density**: Controls overall pattern complexity (20-60)
- **Cell Size**: Individual path segment size (8-16px)
- **Path Density**: How much of the grid is filled (0.4-1.0)

#### **Path Configuration**
- **Length Range**: Minimum and maximum path segments
- **Corner Probability**: How often paths change direction
- **Cluster Mode**: Groups paths in organic clusters vs random distribution

#### **Visual Styling**
- **Color Schemes**: Pre-configured palettes matching different aesthetics
- **Stroke Width**: Path thickness (2-6px)
- **Background Color**: Custom color picker
- **Square Outline**: Optional border around the entire composition

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
- **Build Tool**: Create React App
- **Graphics**: Native SVG with DOM manipulation

### Project Structure
```
ARTGRID-STUDIO/
├── public/           # Static assets
├── src/
│   ├── components/   # Reusable UI components
│   ├── generators/   # Pattern generation logic
│   │   ├── artistic-grid/
│   │   └── maze-style/
│   ├── pages/        # Route components
│   ├── utils/        # Helper functions
│   └── index.js      # Application entry point
├── package.json      # Dependencies and scripts
└── README.md         # This file
```

### Browser Compatibility
- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **Mobile**: iOS Safari, Chrome Mobile
- **Requirements**: JavaScript enabled, SVG support

### Original Inspiration
This project is based on the Python script `SVG_ArtGrid.py`, which generated similar patterns using command-line arguments. The web version maintains the same algorithmic principles while adding:
- Interactive real-time controls
- Multiple generator types
- Enhanced visual effects
- Modern web interface

---

## 🔨 Development

### Available Scripts

- **`npm start`**: Development server with hot reload
- **`npm run build`**: Production build
- **`npm test`**: Run test suite
- **`npm run eject`**: Eject from Create React App (⚠️ irreversible)

### Contributing
1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

### Adding New Generators
1. Create a new folder in `src/generators/`
2. Implement the generator component
3. Add to the routing in `src/generators/index.js`
4. Update navigation in the layout component

---

## 🚀 Deployment Options

### Option 1: Static Web Hosting
```bash
npm run build
# Upload build/ folder contents to your web server
```

**Compatible with:**
- Apache2 servers
- Nginx
- GitHub Pages
- Netlify
- Vercel
- Any static hosting service

### Option 2: Desktop Application (.exe)
The React app can be packaged as a desktop executable using:

**Electron** (Recommended):
```bash
npm install -g electron
# Additional setup required for packaging
```

**Tauri** (Lightweight):
- Rust-based wrapper
- Smaller file size
- Better performance

**Neutralino** (Web-native):
- Minimal overhead
- Web technologies focused

### Option 3: Server Deployment
For Apache2 hosting:
1. Build the project: `npm run build`
2. Copy `build/` contents to your web root
3. Configure Apache for single-page application routing
4. Set up HTTPS for optimal performance

---

## 🎯 Future Enhancements

- **Additional Generators**: Voronoi diagrams, fractals, cellular automata
- **Animation Support**: Animated SVG exports
- **Batch Generation**: Multiple variations at once
- **Color Palette Editor**: Custom color scheme creation
- **3D Patterns**: WebGL-based three-dimensional compositions
- **API Integration**: Cloud saving and sharing

---

## 📚 Resources & Credits

### Inspiration
- **Original Script**: `SVG_ArtGrid.py` - Command-line SVG art generator
- **Algorithmic Art**: Geometric pattern generation principles
- **Color Theory**: Nice-color-palettes collection

### Dependencies
- **React**: Meta's UI library for interactive interfaces
- **TailwindCSS**: Utility-first CSS framework
- **Nice Color Palettes**: Curated color scheme collection

### External Links
- **Main Website**: [scuffedepoch.com](https://www.scuffedepoch.com)
- **Color Palettes**: [nice-color-palettes](https://github.com/Jam3/nice-color-palettes)
- **SVG Specification**: [W3C SVG](https://www.w3.org/Graphics/SVG/)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🤝 Support

- **Website**: [scuffedepoch.com](https://www.scuffedepoch.com)
- **Issues**: Report bugs via GitHub Issues
- **Documentation**: This README and inline code comments

---

**Made with ❤️ for the generative art community**

*Transform algorithms into art. Create patterns that inspire.*
