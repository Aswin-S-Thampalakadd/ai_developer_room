import dotenv from "dotenv";

dotenv.config();

const config = {
  port: Number(process.env.PORT || 5000),

  ollamaHost: process.env.OLLAMA_HOST || "http://127.0.0.1:11434",

  ollamaModel: process.env.OLLAMA_MODEL || "qwen3",

  desktopAgentUrl: process.env.DESKTOP_AGENT_URL || "ws://localhost:5050",

  desktopAgentApiKey: process.env.DESKTOP_AGENT_API_KEY,
};

if (!config.desktopAgentApiKey) {
  throw new Error("DESKTOP_AGENT_API_KEY is required");
}

export default config;
