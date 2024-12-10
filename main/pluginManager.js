/*
 * Developed by Inside4ndroid Studios Ltd
 */
const { app, ipcMain, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

class PluginManager {
  constructor() {
    this.loadedplugins = new Map();
  }

  loadPlugin(pluginName) {
    const pluginWindow = this.loadedplugins.get(pluginName);

    try {
      if (pluginWindow && !pluginWindow.isDestroyed()) {
        return false;
      } else {
        const allPluginFoldersPath = path.join(process.env.USERPROFILE, 'Documents', 'DeskEngine', 'plugins');
        const pluginPath = path.join(allPluginFoldersPath, pluginName);

        const manifestPath = path.join(pluginPath, 'manifest.json');
        const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

        const width = manifest.width;
        const height = manifest.height;
        const frame = manifest.frame;
        const transparent = manifest.transparent;
        const focusable = manifest.focusable;
        const resizable = manifest.resizable;
        const alwaysontop = manifest.alwaysontop;
        const positionX = manifest.positionX;
        const positionY = manifest.positionY;

        const pluginWindow = new BrowserWindow({
          width: width,
          height: height,
          frame: frame,
          transparent: transparent,
          focusable: focusable,
          resizable: resizable,
          x: positionX,
          y: positionY,
          webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
          },
        });

        pluginWindow.setAlwaysOnTop(alwaysontop, 'normal');

        pluginWindow.loadFile(path.join(pluginPath, 'index.html'));

        this.loadedplugins.set(pluginName, pluginWindow);

        return true;
      }


    } catch (error) {
      return false;
    }
  }

  unloadPlugin(pluginName) {
    const pluginWindow = this.loadedplugins.get(pluginName);

    if (pluginWindow && !pluginWindow.isDestroyed()) {
      pluginWindow.close();
      this.loadedplugins.delete(pluginName);
      return true;
    }

    return false;
  }
  
}

module.exports = { PluginManager };
