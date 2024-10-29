/*
 * Developed by Inside4ndroid Studios Ltd
 */
const { exec, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const ini = require('ini');

class wallpaperManager {
    constructor() {

    }

    async removeWallpaper() {
        try {
            await killAll();
            return true;
        } catch (error) {
            return false;
        }
    }

    async setWallpaper(inputPath) {
        const processName = 'mpv.exe';

        const closeProcess = (processName) => {
            return new Promise((resolve) => {
                exec(`taskkill /F /IM ${processName}`, (err) => {
                    resolve();
                });
            });
        };

        const processExists = (processName) => {
            return new Promise((resolve) => {
                exec(`tasklist`, (err, stdout) => {
                    if (err) {
                        resolve(false);
                    }
                    resolve(stdout.toLowerCase().includes(processName.toLowerCase()));
                });
            });
        };

        try {
            let exists = await processExists(processName);
            while (exists) {
                await closeProcess(processName);
                exists = await processExists(processName);
            }

            const oldWork = __dirname;
            const weebp = path.join(__dirname, 'weebp', 'wp.exe');
            const webview = path.join(__dirname, 'tools', 'webView.exe');
            const mouseWallpaper = readIniKey("mouseToWallpaper");
            const forceMouseWallpaper = readIniKey("forceMouseToWallpaper");

            if (!isUrl(inputPath) && !/\.(html?)$/.test(inputPath) && !readIniKey("forceWebview")) {
                process.chdir(path.join(oldWork, 'mpv'));
                exec(`${weebp} run mpv "${inputPath}" --input-ipc-server=\\\\.\\pipe\\mpvsocket`, { stdio: 'ignore' });
                exec(`${weebp} add --wait --fullscreen --class mpv`, { stdio: 'ignore' });
            } else {
                const url = inputPath;
                exec(`${weebp} run "${webview}" "" "${url}"`, { stdio: 'ignore' });
                execSync(`${weebp} add --wait --fullscreen --name litewebview`, { stdio: 'ignore' });

                const sLiteWebviewId = await getLiteWebviewId(oldWork);
                if (mouseWallpaper && !url.includes("youtube")) {
                    exec(`${path.join(oldWork, 'tools', 'mousesender.exe')} 0x${sLiteWebviewId}`, { stdio: 'ignore' });
                } else if (forceMouseWallpaper) {
                    exec(`${path.join(oldWork, 'tools', 'mousesender.exe')} 0x${sLiteWebviewId}`, { stdio: 'ignore' });
                }
            }

            process.chdir(oldWork);
            if (readIniKey("autoPauseFeature")) {
                exec(`${path.join(oldWork, 'tools', 'autoPause.exe')}`, { stdio: 'ignore' });
            }

            return true;
        } catch (error) {
            return false;
        }
    }

    async killAllProcess() {
        await killAll();
    }
}

function isUrl(string) {
    const urlPattern = new RegExp('^(https?:\\/\\/)?' +
        '(((([a-z0-9][a-z0-9-]*[a-z0-9]+)\\.)+[a-z]{2,}|' +
        'localhost|' +
        '\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}|' +
        '\\[?[0-9a-f]{1,4}(:[0-9a-f]{1,4}){0,7}\\]?)' +
        ')(:\\d+)?(\\/[-a-z0-9%_.~+]*)*' +
        '(\\?[;&a-z0-9%_.~+=-]*)?' +
        '(\\#[-a-z0-9_]*)?$', 'i');

    return !!urlPattern.test(string);
}

function readIniKey(sKey) {
    const filePath = path.join(__dirname, 'config.ini');
    if (!fs.existsSync(filePath)) {
        return false;
    }
    const config = ini.parse(fs.readFileSync(filePath, 'utf-8'));
    const sValue = config.Configurations ? config.Configurations[sKey] : "NotFound";
    return sValue === "true";
}

async function killAll() {
    const processes = ['mpv.exe', 'wp.exe', 'litewebview.exe', 'Win32WebViewHost.exe', 'autopause.exe', 'mousesender.exe'];
    const processExists = (processName) => {
        return new Promise((resolve) => {
            exec(`tasklist`, (err, stdout) => {
                if (err) {
                    resolve(false);
                }
                resolve(stdout.toLowerCase().includes(processName.toLowerCase()));
            });
        });
    };

    const closeProcess = (processName) => {
        return new Promise((resolve) => {
            exec(`taskkill /F /IM ${processName}`, (err) => {
                resolve();
            });
        });
    };

    for (const processName of processes) {
        let exists = await processExists(processName);
        while (exists) {
            await closeProcess(processName);
            exists = await processExists(processName);
        }
    }

    exec(`"${path.join(process.cwd(), 'weebp', 'wp.exe')}" ls`);
}

/**
 * Function to get the LiteWebview ID from the wp.exe process output.
 * @param {string} oldWork - The path to the working directory.
 * @returns {Promise<string>} - A promise that resolves with the LiteWebview ID or an error message.
 */
function getLiteWebviewId(oldWork) {
    return new Promise((resolve, reject) => {
        const command = `"${path.join(oldWork, 'weebp', 'wp.exe')}" ls`;

        exec(command, (error, stdout, stderr) => {
            if (error) {
                return reject(`Error executing command: ${error.message}`);
            }

            const pattern = /\[\K[0-9A-F]+\b(?=].*litewebview)/g;
            const matches = stdout.match(pattern);

            if (matches && matches.length > 0) {
                resolve(matches[0]);
            } else {
                resolve("0");
            }
        });
    });
}

module.exports = { wallpaperManager };