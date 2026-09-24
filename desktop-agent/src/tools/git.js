import fs from "fs";
import { spawn } from "child_process";
import path from "path";
import config from "../config.js";

const resolveProjectPath = (projectName) => {
  const projectPath = path.resolve(config.projectsRoot, projectName);
  const root = path.resolve(config.projectsRoot);

  if (projectPath !== root && !projectPath.startsWith(`${root}${path.sep}`)) {
    throw new Error("Project path is outside PROJECTS ROOT");
  }

  return projectPath;
};

const runGit = (projectPath, args) => {
  return new Promise((resolve, reject) => {
    const child = spawn("git", args, {
      cwd: projectPath,
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    child.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    child.on("error", reject);

    child.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(stderr || `Git exited with code ${code}`));
        return;
      }

      resolve(stdout.trim());
    });
  });
};

export const getGitStatus = async (projectName) => {
  const projectPath = resolveProjectPath(projectName);

  await fs.access(projectPath);

  const status = await runGit(projectPath, ["status", "--short", "--branch"]);

  return {
    project: projectName,
    status,
  };
};

export const getGitLog = async (projectName, limit = 10) => {
  const projectPath = resolveProjectPath(projectName);

  await fs.access(projectPath);

  const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 50);

  const log = await runGit(projectPath, [
    "log",
    `-${safeLimit}`,
    "--pretty=format:%h|%an|%ad|%s",
    "--date=iso",
  ]);

  return {
    project: projectName,
    commits: log
      ? log.split("\n").map((line) => {
          const [hash, author, date, message] = line.split("|");

          return {
            hash,
            author,
            date,
            message,
          };
        })
      : [],
  };
};

export const getGitBranch = async (projectName) => {
  const projectPath = resolveProjectPath(projectName);

  await fs.access(projectPath);

  const branch = await runGit(projectPath, ["branch", "--show-current"]);

  return {
    project: projectName,
    branch,
  };
};
