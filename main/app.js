/*
 * Developed by Inside4ndroid Studios Ltd
 */
const { app, BrowserWindow, Tray, Menu, ipcMain, shell } = require('electron');
const path = require('path');
const { PluginManager } = require('./pluginManager');
const { wallpaperManager } = require('./wallpaperManager');
const fs = require('fs');
const childProcess = require('child_process');

let appWindow;
let tray;

const pluginManager = new PluginManager();
const WallpaperManager = new wallpaperManager();

function createWindow() {
    const windowWidth = 1000;
    const windowHeight = 600;

    appWindow = new BrowserWindow({
        width: windowWidth,
        height: windowHeight,
        frame: true,
        transparent: false,
        focusable: true,
        resizable: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            scrollBounce: false,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    appWindow.setAlwaysOnTop(false, 'normal');
    appWindow.loadFile(path.join(__dirname, '../public/index.html'));
    tray = new Tray(path.join(__dirname, '../public/images/app_icon.png'));

    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Help',
            click: () => {
                // TODO this should point to the website help section.
                shell.openExternal('https://google.com');
            },
        },
        {
            label: 'Hide Launcher',
            click: () => {
                app.quit();
            },
        },
        {
            label: 'Show Launcher',
            click: () => {
                appWindow.show();
            },
        },
        {
            label: 'Quit',
            click: () => {
                app.isQuiting = true;
                appWindow.webContents.send('kill-all');
            },
        },
    ]);

    tray.setToolTip('DeskEngine');
    tray.setContextMenu(contextMenu);
    tray.on('click', () => {
        appWindow.show();
    });
    tray.on('right-click', () => {
        tray.popUpContextMenu(contextMenu);
    });
    tray.on('double-click', () => {
        appWindow.show();
    });
    appWindow.on('close', (event) => {
        if (!app.isQuiting) {
            event.preventDefault();
            appWindow.hide();
        }
    });
}

app.whenReady().then(() => {
    setUpDirectories()
        .then(() => {
            createWindow();
            getplugins();
            getwallpapers();
        })
});

function setUpDirectories() {
    return new Promise((resolve, reject) => {
        const wallpaperDir = path.join(process.env.USERPROFILE, 'Documents', 'DeskEngine', 'wallpapers');
        const pluginsDir = path.join(process.env.USERPROFILE, 'Documents', 'DeskEngine', 'plugins');
        const checkAndCreateDir = (dir) => {
            return new Promise((res, rej) => {
                if (!fs.existsSync(dir)) {
                    fs.mkdir(dir, { recursive: true }, (err) => {
                        if (err) {
                            rej(`Error creating directory: ${dir}`);
                        } else {
                            res();
                        }
                    });
                } else {
                    res();
                }
            });
        };
        const copyFiles = (srcDir, destDir) => {
            return new Promise((res, rej) => {
                fs.readdir(srcDir, { withFileTypes: true }, (err, entries) => {
                    if (err) {
                        return rej(`Error reading directory: ${srcDir}`);
                    }

                    const copyPromises = entries.map((entry) => {
                        const srcPath = path.join(srcDir, entry.name);
                        const destPath = path.join(destDir, entry.name);

                        if (entry.isDirectory()) {
                            return checkAndCreateDir(destPath).then(() => copyFiles(srcPath, destPath));
                        } else {
                            return new Promise((fileRes, fileRej) => {
                                fs.copyFile(srcPath, destPath, (err) => {
                                    if (err) {
                                        fileRej(`Error copying file: ${srcPath} to ${destPath}`);
                                    } else {
                                        fileRes();
                                    }
                                });
                            });
                        }
                    });

                    Promise.all(copyPromises)
                        .then(() => res())
                        .catch(rej);
                });
            });
        };

        Promise.all([checkAndCreateDir(wallpaperDir), checkAndCreateDir(pluginsDir)])
            .then(() => {
                return Promise.all([
                    copyFiles(path.join(process.cwd(), 'public', 'wallpapers'), wallpaperDir),
                    copyFiles(path.join(process.cwd(), 'public', 'plugins'), pluginsDir)
                ]);
            })
            .then(() => {
                resolve();
            })
            .catch((error) => {
                reject(error);
            });
    });
}

function getwallpapers() {
    const userDocumentsPath = path.join(process.env.USERPROFILE, 'Documents', 'DeskEngine', 'wallpapers');
    const supportedExtensions = ['mp4', 'webm', 'ogg', 'jpg', 'jpeg', 'png', 'gif'];
    let wallpaperData = [];
    try {
        const files = fs.readdirSync(userDocumentsPath);
        wallpaperData = files
            .filter(file => {
                const extension = file.split('.').pop().toLowerCase();
                return supportedExtensions.includes(extension);
            })
            .map(file => ({
                name: file,
                path: path.join(userDocumentsPath, file)
            }));
    } catch (error) {
        appWindow.webContents.send('load-plugin-response', { success: false, Ttitle: 'Error!', Tmessage: `There was an error please report this!` });
    }

    appWindow.webContents.send('populatewallpapers', { wallpaperData });
}

function getplugins() {
    const userDocumentsPath = path.join(process.env.USERPROFILE, 'Documents', 'DeskEngine', 'plugins');

    try {
        const allPluginFolders = fs.readdirSync(userDocumentsPath);

        const pluginData = allPluginFolders.map((folder) => {
            const manifestPath = path.join(userDocumentsPath, folder, 'manifest.json');
            try {
                const manifestData = fs.readFileSync(manifestPath, 'utf-8');
                const manifest = JSON.parse(manifestData);
                return { folder, manifest };
            } catch (error) {
                return { folder, manifest: null };
            }
        });

        appWindow.webContents.send('populateplugins', { pluginData });
    } catch (error) {
        appWindow.webContents.send('load-plugin-response', { success: false, Ttitle: 'Error!', Tmessage: `Error accessing DeskEngine folder: ${error.message}` });
    }
}

ipcMain.on('minimise', (event) => {
    appWindow.hide();
});

ipcMain.on('createplugin', async (event, pluginName) => {
    try {
        createPlugin(event, pluginName);
    } catch (error) {
        appWindow.webContents.send('load-plugin-response', { success: false, Ttitle: 'Error!', Tmessage: `Failed to create plugin: ${error.message}` });
    }
});

ipcMain.on('refresh', (event) => {
    getplugins();
});

ipcMain.on('kill-all-completed', (event) => {
    app.quit();
});

async function createPlugin(event, pluginName) {
    if (/^[a-zA-Z0-9\s]+$/.test(pluginName)) {
        const pluginFolderPath = path.join(process.env.USERPROFILE, 'Documents', 'DeskEngine', 'plugins', pluginName);

        if (!fs.existsSync(pluginFolderPath)) {
            fs.mkdirSync(pluginFolderPath, { recursive: true });
            if (!fs.existsSync(path.join(pluginFolderPath, 'src'))) {
                try {
                    fs.mkdirSync(path.join(pluginFolderPath, 'src'));
                } catch (error) {
                    appWindow.webContents.send('load-plugin-response', { success: false, Ttitle: 'Error!', Tmessage: `Failed to create "src" subfolder: ${error.message}` });
                }
            }

            const templateHtml = `<!DOCTYPE html>
  <html>
  
  <head>
    <title>Example Web Site</title>
    <meta charset="UTF-8" />
        
    <link rel="stylesheet" href="./src/styles.css">
  </head>
        
  <body>
    <h1>
      Hello, Welcome to your Testing! plugin for AnyDock
    </h1>
        
    <div id="html-container">
      <div id="html">
        <h2>
          HTML
        </h2>
        <p>
          This text comes straight from the HTML file,
          <strong>index.html</strong>.
        </p>
      </div>
      <div id="css">
        <h2>
          CSS
        </h2>
        <p>
          The styling is all controlled by the
          <strong>styles.css</strong> file.
        </p>
      </div>
    </div>
        
    <div id="js-container"></div>
        
    <script src="src/index.js"></script>
  </body>
        
  </html>`;
            const templateJvascript = `document.getElementById("js-container").innerHTML = '<div id="js"><h2>JavaScript</h2><p>This text comes from the <strong>index.js</strong> file,and is powered by javascript.</p> <p>The way the page knows to run the javascript is that the <strong>index.js</strong> file is included at the bottomof the <strong>index.html</strong> file.</p></div>'`;
            const templateStyles = `body {
    font-family: sans-serif;
  }
        
  h1 {
    color: darkgreen;
  }
        
  h2 {
    text-decoration: underline;
  }
        
  p {
    font-style: italic;
  }`;
            const templateManifest = `{
      "name": "${pluginName}",
      "version": "1.0.0",
      "author": "Your Name",
      "description": "This is my first plugin!",
      "width": 640,
      "height": 480,
      "frame": true,
      "transparent": true,
      "focusable": true,
      "resizable": true,
      "alwaysontop": false,
      "positionX": 0,
      "positionY": 0
  }`;

            fs.writeFileSync(path.join(pluginFolderPath, 'index.html'), templateHtml);
            fs.writeFileSync(path.join(pluginFolderPath, 'manifest.json'), templateManifest);
            fs.writeFileSync(path.join(pluginFolderPath, 'src', 'index.js'), templateJvascript);
            fs.writeFileSync(path.join(pluginFolderPath, 'src', 'styles.css'), templateStyles);

            event.reply('load-plugin-response', { success: true, Ttitle: 'Success!', Tmessage: `Plugin "${pluginName}" created successfully!` });

            const allPluginFoldersPath = path.join(process.env.USERPROFILE, 'Documents', 'DeskEngine', 'plugins');
            const allPluginFolders = fs.readdirSync(allPluginFoldersPath);

            const pluginData = allPluginFolders.map((folder) => {
                const manifestPath = path.join(allPluginFoldersPath, folder, 'manifest.json');
                try {
                    const manifestData = fs.readFileSync(manifestPath, 'utf-8');
                    const manifest = JSON.parse(manifestData);
                    return { folder, manifest };
                } catch (error) {
                    return { folder, manifest: null };
                }
            });

            appWindow.webContents.send('populateplugins', { pluginData });

        } else {
            event.reply('load-plugin-response', { success: false, Ttitle: 'Error!', Tmessage: `Plugin name already exists.` });
        }
    } else {
        event.reply('load-plugin-response', { success: false, Ttitle: 'Error!', Tmessage: `Please enter a valid alphanumeric plugin name.` });
    }
}

ipcMain.on('load-wallpaper', (event, path) => {
    const success = WallpaperManager.setWallpaper(path);

    if (success) {
        event.reply('load-plugin-response', { success: true, Ttitle: 'Success!', Tmessage: `Wallpaper loaded successfully!` });
    } else {
        event.reply('load-plugin-response', { success: false, Ttitle: 'Error!', Tmessage: `There was an error please report this!` });
    }
});

ipcMain.on('unload-wallpaper', (event) => {
    const success = WallpaperManager.removeWallpaper();

    if (success) {
        event.reply('load-plugin-response', { success: true, Ttitle: 'Success!', Tmessage: `Wallpaper unloaded successfully!` });
    } else {
        event.reply('load-plugin-response', { success: false, Ttitle: 'Error!', Tmessage: `There was an error please report this!` });
    }
});

ipcMain.on('set-username', (event) => {
    event.reply('set-username', {});
});

ipcMain.on('load-plugin', (event, pluginName) => {
    console.log()
    const success = pluginManager.loadPlugin(pluginName);

    if (success) {
        event.reply('load-plugin-response', { success: true, Ttitle: 'Success!', Tmessage: `Plugin "${pluginName}" loaded successfully!` });
    } else {
        event.reply('load-plugin-response', { success: false, Ttitle: 'Error!', Tmessage: `Plugin "${pluginName}" already loaded!` });
    }
});



ipcMain.on('unload-plugin', (event, pluginName) => {
    const success = pluginManager.unloadPlugin(pluginName);

    if (success) {
        event.reply('unload-plugin-response', { success: true, Ttitle: 'Success!', Tmessage: `Plugin "${pluginName}" un-loaded successfully!` });
    } else {
        event.reply('unload-plugin-response', { success: false, Ttitle: 'Error!', Tmessage: `Plugin "${pluginName}" is not active!` });
    }
});

ipcMain.on('edit-plugin', (event, pluginName) => {
    childProcess.exec('code -v', (err, stdout, stderr) => {
        if (err) {
            event.reply('vscode-not-installed', { success: false, Ttitle: 'Error!', Tmessage: `Please install "Visual Studio Code" to use this feature` });
        } else {
            const pluginFolderPath = path.join(process.env.USERPROFILE, 'Documents', 'DeskEngine', 'plugins', pluginName); // Update this path
            const vscodeProcess = childProcess.exec(`code -n "${pluginFolderPath}"`);

            vscodeProcess.on('error', (error) => {
                event.reply('vscode-not-installed', { success: false, Ttitle: 'Error!', Tmessage: `Error opening the plugin folder: ${error.message}` });
            });

            vscodeProcess.on('exit', (code) => {
                if (code !== 0) {
                    appWindow.webContents.send('load-plugin-response', { success: false, Ttitle: 'Error!', Tmessage: `Visual Studio Code exited with code ${code}` });
                }
            });
        }
    });
});

app.on('before-quit', () => {
    pluginManager.loadedplugins.forEach((pluginWindow) => {
        pluginWindow.close();
    });
});