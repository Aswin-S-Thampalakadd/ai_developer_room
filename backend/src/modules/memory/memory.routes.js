import express from "express";

import { create, search } from "./memory.controller.js";

const router = express.Router();

router.post("/", create);
router.post("/search", search);

export default router;
