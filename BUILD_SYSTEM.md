# Dual Build System - Web & Electron

This project now supports building for both web deployment and Electron desktop app from the same codebase.

## Build Commands

### Individual Builds
- `npm run build:web` - Creates clean web build (React app only)
- `npm run build:electron` - Creates Electron build (includes electron.js, preload.js)

### Combined Builds
- `npm run build:all` - Builds both web and Electron versions
- `npm run deploy:web` - Builds web version and copies to build-web/ folder

### Legacy Commands
- `npm run build` - Now defaults to Electron build (maintains compatibility)

## Output Directories

### Web Build (`build-web/`)
- Clean React application
- No Electron files
- Ready for web server deployment
- Uses relative paths (`homepage: "./"`)

### Electron Build (`build/`)
- React application + Electron wrapper
- Includes electron.js and preload.js
- Ready for Electron packaging
- Same relative paths for compatibility

## Deployment Workflow

### For Web Deployment:
1. Run `npm run deploy:web`
2. Upload contents of `build-web/` to your web server
3. Follow the Apache2 configuration in `deployment-config.md`

### For Electron Distribution:
1. Run `npm run build:electron` (or just `npm run build`)
2. Run `npm run electron-pack` or `npm run dist`
3. Distribute the generated executable

### For Both Platforms:
1. Run `npm run build:all`
2. Web files will be in `build-web/`
3. Electron files will be in `build/`

## Development Workflow

### Adding New Features:
1. Develop in your React components as usual
2. Test with `npm start`
3. Build for target platform when ready
4. No need for separate codebases or forks

### Platform-Specific Code:
If you need platform-specific features:
```javascript
// Detect if running in Electron
const isElectron = window.require !== undefined;

if (isElectron) {
  // Electron-specific code
} else {
  // Web-specific code
}
```

## Benefits

✅ **Single Codebase** - All features developed once  
✅ **Clean Separation** - No unnecessary files in web builds  
✅ **Automated Process** - Scripts handle the differences  
✅ **Backwards Compatible** - Existing workflows still work  
✅ **Easy Deployment** - Simple commands for each platform  

## Technical Details

The `copy-to-build-web` script:
1. Creates fresh `build-web/` directory
2. Copies all React build files
3. Removes Electron-specific files (electron.js, preload.js)
4. Results in clean web deployment package

This system allows you to expand with new modes while maintaining both deployment options seamlessly.
