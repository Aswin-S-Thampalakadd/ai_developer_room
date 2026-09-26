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
  ".cache",
]);

const allowedExtensions = new Set([
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".py",
  ".json",
  ".sql",
  ".html",
  ".css",
  ".scss",
  ".md",
  ".yml",
  ".yaml",
  ".env.example",
]);

const getProjectPath = (project) => {
  const projectPath = path.resolve(config.projectsRoot, project);

  const root = path.resolve(config.projectsRoot);

  if (projectPath !== root && !projectPath.startsWith(`${root}${path.sep}`)) {
    throw new Error("Invalid project path");
  }

  return projectPath;
};

const searchDirectory = async (directory, searchTerm, results) => {
  const entries = await fs.readdir(directory, {
    withFileTypes: true,
  });

  for (const entry of entries) {
    if (ignoredDirectories.has(entry.name)) {
      continue;
    }

    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      await searchDirectory(fullPath, searchTerm, results);

      continue;
    }

    const extension = path.extname(entry.name);

    if (!allowedExtensions.has(extension)) {
      continue;
    }

    try {
      const content = await fs.readFile(fullPath, "utf8");

      const lines = content.split("\n");

      lines.forEach((line, index) => {
        if (line.toLowerCase().includes(searchTerm.toLowerCase())) {
          results.push({
            file: path.relative(config.projectsRoot, fullPath),
            line: index + 1,
            content: line.trim().slice(0, 500),
          });
        }
      });
    } catch (error) {}
  }
};

export const searchCode = async (project, searchTerm) => {
  if (!project) {
    throw new Error("Project is missing");
  }

  if (!searchTerm) {
    throw new Error("Search term is missing");
  }

  const projectPath = getProjectPath(project);

  const results = [];

  await searchDirectory(projectPath, searchTerm, results);

  return {
    project,
    searchTerm,
    count: results.length,
    results: results.slice(0, 100),
  };
};

export const getProjectDocuments = async (project) => {
  const projectPath = getProjectPath(project);

  const documents = [];

  const collect = async (directory) => {
    const entries = await fs.readdir(directory, {
      withFileTypes: true,
    });

    for (const entry of entries) {
      if (entry.isDirectory() && ignoredDirectories.has(entry.name)) {
        continue;
      }

      const fullPath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        await collect(fullPath);
        continue;
      }

      const extension = path.extname(entry.name);

      if (!allowedExtensions.has(extension)) {
        continue;
      }

      try {
        const content = await fs.readFile(fullPath, "utf8");

        if (content.length > 100000) {
          continue;
        }

        documents.push({
          filePath: path.relative(projectPath, fullPath),
          content,
        });
      } catch (error) {}
    }
  };
  await collect(projectPath);

  return {
    project,
    documents,
  };
};
