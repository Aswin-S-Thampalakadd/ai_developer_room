import fs from "fs/promises";
import path from "path";
import config from "../config.js";

const ignoredDirectories = new Set([
  "node_modules",
  ".git",
  "dist",
  "build",
  ".next",
  "coverage",
]);

const getProjectPath = (project) => {
  const projectPath = path.resolve(config.projectsRoot, project);

  const root = path.resolve(config.projectsRoot);

  if (projectPath !== root && !projectPath.startsWith(`${root}${path.sep}`)) {
    throw new Error("Invalid project path");
  }

  return projectPath;
};

const scanDirectory = async (directory, relativePath = "") => {
  const entries = await fs.readdir(directory, {
    withFileTypes: true,
  });

  const result = [];

  for (const entry of entries) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) {
      continue;
    }

    const fullPath = path.join(directory, entry.name);

    const currentRelativePath = path.join(relativePath, entry.name);

    if (entry.isDirectory()) {
      const children = await scanDirectory(fullPath, currentRelativePath);

      result.push({
        type: "directory",
        name: entry.name,
        path: currentRelativePath,
        children,
      });
    } else {
      result.push({
        type: "file",
        name: entry.name,
        path: currentRelativePath,
      });
    }
  }

  return result;
};

export const analyzeProject = async (project) => {
  if (!project) {
    throw new Error("project is required");
  }

  const projectPath = getProjectPath(project);

  const structure = await scanDirectory(projectPath);

  let packageJson = null;

  try {
    const packagePath = path.join(projectPath, "package.json");

    const content = await fs.readFile(packagePath, "utf8");

    packageJson = JSON.parse(content);
  } catch {}

  return {
    project,
    path: projectPath,
    packageJson,
    structure,
  };
};
