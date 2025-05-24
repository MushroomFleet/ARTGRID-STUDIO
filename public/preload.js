const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Save SVG file using native dialog
  saveSVG: (svgContent, filename) => {
    return ipcRenderer.invoke('save-svg-dialog', svgContent, filename);
  },
  
  // Show error dialog
  showError: (title, content) => {
    return ipcRenderer.invoke('show-error-dialog', title, content);
  },
  
  // Show info dialog
  showInfo: (title, content) => {
    return ipcRenderer.invoke('show-info-dialog', title, content);
  },
  
  // Listen for menu events
  onMenuSave: (callback) => {
    ipcRenderer.on('menu-save-svg', callback);
  },
  
  // Remove menu event listeners
  removeMenuSaveListener: () => {
    ipcRenderer.removeAllListeners('menu-save-svg');
  }
});

// Helper to detect if running in Electron
contextBridge.exposeInMainWorld('isElectron', true);
