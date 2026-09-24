import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { desktopService } from "./modules/desktop/desktop.service.js";
import aiRoutes from "./modules/ai/ai.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/ai", aiRoutes);

app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "AI Developer Room Backend",
    desktopAgent: desktopService.connected,
  });
});

const PORT = process.env.PORT || 5000;

desktopService.connect();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
