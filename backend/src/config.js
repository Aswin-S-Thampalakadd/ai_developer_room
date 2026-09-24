import dotenv from "dotenv";
dotenv.config();

const config = {
  port: Number(process.env.PORT || 5000),
  openaiApiKey: process.env.OPENAI_API_KEY,
  openaiModel: process.env.OPENAI_MODEL || "gpt-5.6",
  desktopAgentUrl: process.env.DESKTOP_AGENT_URL || "ws://localhost:5050",

  desktopAgentApiKey: process.env.DESKTOP_AGENT_API_KEY,
};

if (!config.openaiApiKey) {
  throw new Error("OPEN AI API KEY is missing");
}

if (!config.desktopAgentApiKey) {
  throw new Error("DESKTOP AGENT API KEY is missing");
}

export default config;
