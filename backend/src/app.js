import express from "express";
import cors from "cors";

import config from "./config.js";
import { desktopService } from "./modules/desktop/desktop.service.js";
import aiRoutes from "./modules/ai/ai.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/ai", aiRoutes);

app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "AI Developer Room Backend",
    desktopAgent: desktopService.connected,
    ollama: true,
    model: config.ollamaModel,
  });
});

desktopService.connect();

app.listen(config.port, () => {
  console.log(`Backend running on port ${config.port}`);
});
