/*
 * Developed by Inside4ndroid Studios Ltd
 */
const { contextBridge, ipcRenderer } = require('electron');
const DateTime = require('./meters/DateTime');
const SystemInfo = require('./meters/SystemInfo');
const path = require('path');
const { wallpaperManager } = require('./wallpaperManager');

contextBridge.exposeInMainWorld('ipcRenderer', ipcRenderer);

contextBridge.exposeInMainWorld('app', {
    send: (channel, data) => {
        const validChannels = ['minimise', 'createplugin', 'load-plugin', 'refresh', 'load-plugin-response', 'load-wallpaper', 'unload-wallpaper'];
        if (validChannels.includes(channel)) {
            ipcRenderer.send(channel, data);
        }
    },
});

ipcRenderer.on('kill-all', async (event) => {
    const manager = new wallpaperManager();
    await manager.killAllProcess();
    ipcRenderer.send('kill-all-completed');
});


ipcRenderer.on('populateplugins', (event, { pluginData }) => {
    const homeWelcome = document.getElementById('languageText');
    const userProfile = process.env.USERPROFILE;
    const username = path.basename(userProfile);
    homeWelcome.textContent = 'Hello, '+username;

    populatePluginList(pluginData);
});

ipcRenderer.on('load-plugin-response', (event, response) => {
    if (response.success) {
        showSuccessToast(response.Ttitle, response.Tmessage);
    } else {
        showErrorToast(response.Ttitle, response.Tmessage);
    }
});

ipcRenderer.on('unload-plugin-response', (event, response) => {
    if (response.success) {
        showSuccessToast(response.Ttitle, response.Tmessage);
    } else {
        showErrorToast(response.Ttitle, response.Tmessage);
    }
});

ipcRenderer.on('vscode-not-installed', (event, response) => {
    if (response.success) {
        showSuccessToast(response.Ttitle, response.Tmessage);
    } else {
        showErrorToast(response.Ttitle, response.Tmessage);
    }
});


ipcRenderer.on('populateplugins', (event, { pluginData }) => {
    populatePluginList(pluginData);
});

ipcRenderer.on('populatewallpapers', (event, { wallpaperData }) => {
    populateWallpaperList(wallpaperData);
});

function showSuccessToast(Ttitle, Tmessage) {
    toast({
        title: Ttitle,
        message: Tmessage,
        type: "success",
        duration: 5000
    });
}

function showErrorToast(Ttitle, Tmessage) {
    toast({
        title: Ttitle,
        message: Tmessage,
        type: "error",
        duration: 5000
    });
}

function toast({ title = "", message = "", type = "info", duration = 2000 }) {
    const main = document.getElementById("toast");
    if (main) {
        const toast = document.createElement("div");

        const autoRemoveId = setTimeout(function () {
            main.removeChild(toast);
        }, duration + 1000);

        toast.onclick = function (e) {
            if (e.target.closest(".toast__close")) {
                main.removeChild(toast);
                clearTimeout(autoRemoveId);
            }
        };

        const delay = (duration / 1000).toFixed(2);

        toast.classList.add("toast", `toast--${type}`);
        toast.style.animation = `slideInLeft ease .3s, fadeOut linear 1s ${delay}s forwards`;

        toast.innerHTML = `
                      <div class="toast__body">
                          <h3 class="toast__title">${title}</h3>
                          <p class="toast__msg">${message}</p>
                      </div>
                      <div class="toast__close">
                      <img src="./images/close_icon.png" width="20" height="20" alt="close-icon">
                      </div>
                  `;
        main.appendChild(toast);
    }
}

function populateWallpaperList(wallpaperData) {
    const wallpaperListContainer = document.getElementById('wallpaperList');
    const selectedwallpaperTitle = document.getElementById('selectedWallpaperTitle');
    const buttons = document.querySelector('.button_container_plugins');

    wallpaperListContainer.innerHTML = '';
    selectedwallpaperTitle.textContent = 'No wallpaper Selected';


    wallpaperData.forEach(({ name, path }) => {

        const nameWithoutExtension = name.substring(0, name.lastIndexOf('.')) || name;

        const listItem = document.createElement('div');
        listItem.classList.add('wallpaperItem');
        listItem.textContent = nameWithoutExtension;

        listItem.addEventListener('click', () => {
            try {
                buttons.remove();
            } catch (ignored) {

            }

            selectedwallpaperTitle.textContent = nameWithoutExtension;
            const videoPreview = document.querySelector('#selectedWallpaperInfo video');
            const fileExtension = name.split('.').pop().toLowerCase();
            const videoExtensions = ['mp4', 'webm', 'ogg'];
            const imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
            if (videoExtensions.includes(fileExtension)) {
                videoPreview.src = path;
                videoPreview.poster = '';
                videoPreview.load();
                videoPreview.play();
            } else if (imageExtensions.includes(fileExtension)) {
                videoPreview.src = '';
                videoPreview.poster = path;
                videoPreview.pause();
            }

            videoPreview.insertAdjacentHTML('afterend', `
                <div class="button_container_plugins" id="pluginButtons">
                    <div class="general_button LBTB" id="loadWallpaper ${name}" reference="${path}"><span>Load</span></div>
                    <div class="general_button UBTN" id="unloadWallpaper ${name}"><span>Unload</span></div>
                </div>
            `);

            document.getElementById(`loadWallpaper ${name}`).addEventListener('click', () => {
                const item = document.querySelector('.LBTB');
                ipcRenderer.send('load-wallpaper', item.getAttribute('reference'));
            });

            document.getElementById(`unloadWallpaper ${name}`).addEventListener('click', () => {
                ipcRenderer.send('unload-wallpaper', name);
            });
        });

        wallpaperListContainer.appendChild(listItem);
    });

}

function populatePluginList(pluginData) {
    const pluginListContainer = document.getElementById('pluginList');
    const selectedPluginTitle = document.getElementById('selectedPluginTitle');
    const selectedPluginInfo = document.getElementById('selectedPluginInfo');

    pluginListContainer.innerHTML = '';
    selectedPluginTitle.textContent = 'No Plugin Selected';
    selectedPluginInfo.innerHTML = '';

    pluginData.forEach(({ folder, manifest }) => {
        const listItem = document.createElement('div');
        listItem.classList.add('pluginItem');
        listItem.textContent = manifest ? manifest.name : folder;

        listItem.addEventListener('click', () => {
            selectedPluginTitle.textContent = `${manifest ? manifest.name : folder}`;
            selectedPluginInfo.innerHTML = manifest
                ? `<p>VERSION: ${manifest.version || 'N/A'}</p>
               <p>AUTHOR: ${manifest.author || 'N/A'}</p>
               <p>DESCRIPTION: ${manifest.description || 'N/A'}</p>
               <div class="button_container_plugins" id="pluginButtons" style="display: none;">
                 <div class="general_button" id="loadPlugin ${manifest ? manifest.name : folder}"><span>Load</span></div>
                 <div class="general_button" id="unloadPlugin ${manifest ? manifest.name : folder}"><span>Unload</span></div>
                 <div class="general_button" id="editPlugin ${manifest ? manifest.name : folder}"><span>Edit</span></div>
               </div>`
                : '<p>Manifest not found.</p>';

            document.getElementById('pluginButtons').style.display = 'flex';

            const pluginName = listItem.textContent.trim();
            
            document.getElementById(`loadPlugin ${pluginName}`).addEventListener('click', () => {
                ipcRenderer.send('load-plugin', pluginName);
            });

            document.getElementById(`unloadPlugin ${pluginName}`).addEventListener('click', () => {
                ipcRenderer.send('unload-plugin', pluginName);
            });

            document.getElementById(`editPlugin ${pluginName}`).addEventListener('click', () => {
                ipcRenderer.send('edit-plugin', pluginName);
            });
        });

        pluginListContainer.appendChild(listItem);
    });
}

contextBridge.exposeInMainWorld('api', {
    getCPUInfo: async (arg) => {
        try {
            return await SystemInfo.getCPUInfo(arg);
        } catch (error) {
            console.error('Error calling getCPUInfo:', error);
            throw error;
        }
    },
    getClockInfo: async (method) => {
        try {
            if (typeof DateTime[method] === 'function') {
                return await DateTime[method]();
            } else {
                throw new Error(`Method ${method} does not exist on DateTime`);
            }
        } catch (error) {
            console.error('Error calling getClockInfo:', error);
            throw error;
        }
    },
});
