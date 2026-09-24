import os, { platform } from "os";

export const getSystemInfo = () => {
  return {
    hostname: os.hostname,
    platform: os.platform,
    architecture: os.arch,
    cpuCount: os.cpus().length,
    totalMemory: os.totalmem(),
    freeMemory: os.freemem(),
    uptime: os.uptime(),
    username: os.userInfo().username,
  };
};

export const getSystemTime = () => {
  return {
    timestamp: new Date().toISOString(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
};
