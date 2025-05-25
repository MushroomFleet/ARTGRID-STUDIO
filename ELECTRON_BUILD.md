# ArtGrid Studio - Electron Portable App

## Build Completed Successfully ✅

**File:** `dist/ArtGrid Studio 2.1.0.exe`
**Size:** ~78 MB (estimated)
**Type:** Portable executable (no installation required)

## Features

- **Single Executable File**: No installation required, runs directly on Windows
- **Native File Save Dialog**: Uses Windows native save dialog for SVG exports
- **Identical UI**: Same interface as the web version
- **Modular Generator System**: Maintains the extensible architecture for adding new generators
- **Eight Built-in Generators**:
  - Artistic Grid Generator (based on original Python script)
  - Art Grid V2 (advanced multi-grid system with 25+ patterns)
  - Maze-Style Generator (path-based maze patterns)
  - Circuit-Style Patterns (25 circuit board shapes)
  - Circuit V2 (advanced circuit generator with 35+ patterns) ✨ **Restored**
  - Balanced Circuit (weighted color distribution)
  - Triptych Circuit (three-panel circuit styles)
  - SVG Tile Importer (import & arrange SVG files) ✨ **New**

## Usage Instructions

1. **Run the Application**
   - Double-click `ArtGrid Studio 2.1.0.exe`
   - No installation required
   - Windows may show a security warning (click "More info" → "Run anyway")

2. **Generate Artwork**
   - Select a generator from the navigation
   - Adjust parameters using the control panel
   - Click "Random Generate" for new artwork
   - Preview updates in real-time

3. **Save SVG Files**
   - Click "Export SVG" button
   - Native Windows save dialog will open
   - Choose location and filename
   - File will be saved as SVG format

4. **Keyboard Shortcuts**
   - `Ctrl+S`: Save SVG (same as clicking Export SVG)
   - `Ctrl+Q`: Exit application
   - `F5`: Reload application
   - `F11`: Toggle fullscreen
   - `F12`: Toggle developer tools

## Technical Details

### Built With
- **Electron 22.0.0**: Desktop app framework
- **React 18.2.0**: UI framework
- **Tailwind CSS**: Styling
- **Electron Builder**: Packaging

### Architecture
- **Main Process**: `electron.js` - Window management and file operations
- **Renderer Process**: React app - UI and generator logic
- **IPC Communication**: Secure preload script for file system access
- **Hash Router**: Client-side routing for Electron compatibility

### File Structure in Executable
```
ArtGrid Studio 2.1.0.exe
├── Electron runtime
├── React build (HTML, CSS, JS)
├── Generator modules (8 total)
├── Color palettes
└── All dependencies bundled
```

## Distribution

The executable is fully self-contained and can be:
- Copied to any Windows machine
- Run from USB drives
- Distributed without additional setup
- Used offline (no internet required)

## Modular System

The generator system remains modular. To add new generators in future versions:

1. Create new generator component in `src/generators/`
2. Register in `src/generators/index.js`
3. Rebuild with `npm run dist`

## Build Commands Reference

- `npm run electron`: Run in development mode
- `npm run build`: Create React production build
- `npm run dist`: Build portable executable
- `npm run electron-pack`: Build executable (alternative)

## Troubleshooting

**If the app doesn't start:**
- Check Windows Defender/antivirus isn't blocking it
- Try running as administrator
- Ensure you're on Windows 7 or later

**If save dialog doesn't work:**
- Check file permissions in target directory
- Try saving to a different location (like Desktop)

**For development:**
- Use `npm run electron` to test changes
- Edit source files and rebuild with `npm run dist`

---

**Build Date:** May 25, 2025
**Version:** 2.1.0
**Platform:** Windows x64
**Build Type:** Portable Executable
