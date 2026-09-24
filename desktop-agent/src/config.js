import dotenv from "dotenv";

dotenv.config();

const config = {
  port: Number(process.env.DESKTOP_AGENT_PORT || 5001),
  apiKey: process.env.DESKTOP_AGENT_API_KEY,
  projectsRoot: process.env.PROJECTS_ROOT,
  defaultProject: process.env.DEFAULT_PROJECT || null,
};

if (!config.apiKey) {
  throw new Error("DESKTOP AGENT API KEY is missing");
}

if (!config.projectsRoot) {
  throw new Error("PROJECT ROOT is missing");
}

export default config;
