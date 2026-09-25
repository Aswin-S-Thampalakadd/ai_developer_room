import fs from "fs/promises";
import path from "path";
import { spawn } from "child_process";
import config from "../config.js";

const process = new Map();

const resolveProjectPath = (projectName) => {
  const projectPath = path.resolve(config.projectsRoot, projectName);
  const root = path.resolve(config.projectsRoot);

  if (projectPath !== root && !projectPath.startsWith(`${root}${path.sep}`)) {
    throw new Error("Project path is outside PROJECT ROOT");
  }

  return projectPath;
};

const runCommand = (command, args, cwd, timeout = 120000) => {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      shell: false,
      stdio: ["ignore", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";

    const timer = setTimeout(() => {
      child.kill("SIGTERM");

      reject(new Error(`Command timed out after ${timeout} milliseconds`));
    }, [timeout]);

    child.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    child.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    child.on("close", (code) => {
      clearTimeout(timer);

      resolve({
        code,
        stdout,
        stderr,
      });
    });
  });
};

export const runTests = async (projectName) => {
  const projectPath = resolveProjectPath(projectName);

  await fs.access(projectPath);

  const packageJsonPath = path.join(projectPath, "package.json");

  await fs.access(packageJsonPath);

  const result = await runCommand("npm", ["test"], projectPath, 180000);

  return {
    project: projectName,
    sucess: result.code === 0,
    exitCode: result.code,
    stdout: result.stdout,
    stderr: result.stderr,
  };
};

export const startDevServer = async (projectName) => {
  const projectPath = resolveProjectPath(projectName);

  await fs.access(projectPath);

  if (process.has(projectName)) {
    const existing = process.get(projectName);

    return {
      project: projectName,
      alreadyRunning: true,
      pid: existing.pid,
    };
  }

  const child = spawn("npm", ["run", "start:dev"], {
    cwd: projectPath,
    detached: true,
    stdio: ["ignore", "pipe", "pipe"],
  });

  let output = "";
  let errorOutput = "";

  child.stdout.on("data", (data) => {
    output += data.toString();
  });

  child.stderr.on("data", (data) => {
    errorOutput += data.toString();
  });

  process.set(projectName, child);

  child.on("exit", () => {
    process.delete(projectName);
  });

  return {
    project: projectName,
    started: true,
    pid: child.pid,
  };
};

export const stopDevServer = async (projectName) => {
  const child = process.get(projectName);

  if (!child) {
    return {
      project: projectName,
      running: false,
    };
  }

  process.kill(-child.pid, "SIGTERM");

  process.delete(projectName);

  return {
    project: projectName,
    running: false,
    stopped: true,
  };
};

export const getDevServers = () => {
  return [...process.entries()].map(([project, process]) => ({
    project,
    pid: process.pid,
  }));
};
