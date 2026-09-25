import fs from "fs/promises";
import path from "path";
import { exec, spawn } from "child_process";
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

export const openProject = async (project) => {
  const entries = await fs.readdir(config.projectsRoot, {
    withFileTypes: true,
  });

  const projectEntry = entries.find(
    (entry) => entry.isDirectory() && entry.name === project
  );

  if (!projectEntry) {
    throw new Error(
      `Project not found: ${project}. Available projects: ${entries
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name)
        .join(", ")}`
    );
  }

  const projectPath = path.join(config.projectsRoot, projectEntry.name);

  await fs.access(projectPath);

  exec(`code "${projectPath}"`);

  return {
    success: true,
    project: projectEntry.name,
    path: projectPath,
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
