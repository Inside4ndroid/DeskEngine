const perfmon = require("perfmon");
const si = require('systeminformation');

/*
 * Developed by Inside4ndroid Studios Ltd
 */
class SystemInfo {
    static async getCPUInfo(arg) {
        return new Promise(async (resolve, reject) => {
            try {
                if (arg === 'total_usage') {
                    getInfo('processor(_Total)\\% Processor Time', (err, data) => {
                        if (err) {
                            reject(err);
                        } else {
                            const cpuUsage = data.counters['processor(_Total)\\% Processor Time'];
                            resolve(cpuUsage);
                        }
                    });
                } else if (arg === 'manufacturer') {
                    const cpuInfo = await si.cpu();
                    const manufacturer = cpuInfo.manufacturer;
                    resolve(manufacturer);
                } else if (arg === 'brand') {
                    const cpuInfo = await si.cpu();
                    const brand = cpuInfo.brand;
                    resolve(brand);
                } else if (arg === 'vendor') {
                    const cpuInfo = await si.cpu();
                    const vendor = cpuInfo.vendor;
                    resolve(vendor);
                } else if (arg === 'family') {
                    const cpuInfo = await si.cpu();
                    const family = cpuInfo.family;
                    resolve(family);
                } else if (arg === 'model') {
                    const cpuInfo = await si.cpu();
                    const model = cpuInfo.model;
                    resolve(model);
                } else if (arg === 'stepping') {
                    const cpuInfo = await si.cpu();
                    const stepping = cpuInfo.stepping;
                    resolve(stepping);
                } else if (arg === 'revision') {
                    const cpuInfo = await si.cpu();
                    const revision = cpuInfo.revision;
                    resolve(revision);
                } else if (arg === 'speed') {
                    const cpuInfo = await si.cpu();
                    const speed = cpuInfo.speed;
                    resolve(speed);
                } else if (arg === 'speedMin') {
                    const cpuInfo = await si.cpu();
                    const speedMin = cpuInfo.speedMin;
                    resolve(speedMin);
                } else if (arg === 'speedMax') {
                    const cpuInfo = await si.cpu();
                    const speedMax = cpuInfo.speedMax;
                    resolve(speedMax);
                } else if (arg === 'cores') {
                    const cpuInfo = await si.cpu();
                    const cores = cpuInfo.cores;
                    resolve(cores);
                } else if (arg === 'physicalCores') {
                    const cpuInfo = await si.cpu();
                    const physicalCores = cpuInfo.physicalCores;
                    resolve(physicalCores);
                } else if (arg === 'performanceCores') {
                    const cpuInfo = await si.cpu();
                    const performanceCores = cpuInfo.performanceCores;
                    resolve(performanceCores);
                } else if (arg === 'processors') {
                    const cpuInfo = await si.cpu();
                    const processors = cpuInfo.processors;
                    resolve(processors);
                } else if (arg === 'socket') {
                    const cpuInfo = await si.cpu();
                    const socket = cpuInfo.socket;
                    resolve(socket);
                } else if (arg === 'flags') {
                    const cpuInfo = await si.cpu();
                    const flags = cpuInfo.flags;
                    resolve(flags);
                } else if (arg === 'virtualization') {
                    const cpuInfo = await si.cpu();
                    const virtualization = cpuInfo.virtualization;
                    resolve(virtualization);
                } else {
                    reject(new Error('Invalid argument'));
                }
            } catch (error) {
                reject(error);
            }
        });
    }
}

function getInfo(arg, callback) {
    perfmon([arg], function(err, data) {
        if (err) {
            return callback(err);
        }
        callback(null, data);
    });
}

module.exports = SystemInfo;