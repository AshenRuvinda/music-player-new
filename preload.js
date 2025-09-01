const { contextBridge } = require('electron');

// Expose APIs if needed in the future
contextBridge.exposeInMainWorld('api', {
  // Add any APIs here, e.g., for IPC communication
});