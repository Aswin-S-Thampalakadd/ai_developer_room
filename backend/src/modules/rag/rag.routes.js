import express from "express";

import { index, retrieve } from "./rag.controller.js";

const router = express.Router();

router.post("/index", index);

router.post("/retrieve", retrieve);

export default router;
