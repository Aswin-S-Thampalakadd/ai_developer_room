import fs from "fs/promises";
import path from "path";
import { spawn } from "child_process";
import config from "../config.js";

const resolveProjectPath = (projectName) => {
  const projectPath = path.resolve(config.projectsRoot, projectName);
  const root = path.resolve(config.projectsRoot);

  if (projectPath !== root && !projectPath.startsWith(`${root}${path.sep}`)) {
    throw new Error("Project path is outside PROJECTS ROOT");
  }

  return projectPath;
};

const openApplication = (command, args, cwd) => {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      detached: true,
      stdio: "ignore",
    });

    child.on("error", reject);
    child.unref();

    resolve({
      pid: child.pid,
    });
  });
};

export const listProjects = async () => {
  const entries = await fs.readdir(config.projectsRoot, {
    withFileTypes: true,
  });

  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
};

export const getCurrentProject = async () => {
  if (!config.defaultProject) {
    return null;
  }

  const projectPath = resolveProjectPath(projectName);

  return {
    name: config.defaultProject,
    path: projectPath,
  };
};

export const openProject = async (projectName) => {
  const projectPath = resolveProjectPath(projectName);

  await fs.access(projectPath);

  const result = await openApplication("code", [projectPath], projectPath);

  return {
    project: projectName,
    path: projectPath,
    pid: result.pid,
  };
};

export const openTerminal = async (projectName) => {
  const projectPath = resolveProjectPath(projectName);

  await fs.access(projectPath);

  const terminal = process.env.TERMINAL || "gnome-terminal";

  const result = await openApplication(
    terminal,
    ["--working-directory", projectPath],
    projectPath
  );

  return {
    project: projectName,
    path: projectPath,
    pid: result.pid,
  };
};

export const openBrowser = async (url) => {
  if (!url || !/^https?:\/\//i.test(url)) {
    throw new Error("Only HTTP and HTTPS URLs are allowed");
  }

  const result = await openApplication("xdg-open", [url], config.projectsRoot);

  return {
    url,
    pid: result.pid,
  };
};
