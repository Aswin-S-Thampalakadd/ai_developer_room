import { saveMemory, searchMemory } from "./memory.service.js";

export const create = async (req, res) => {
  try {
    const { content, metadata } = req.body;

    if (!content || typeof content !== "string") {
      return res.status(400).json({
        success: false,
        message: "content is required",
      });
    }

    const memory = await saveMemory({
      content,
      metadata,
    });

    return res.status(201).json({
      success: true,
      memory,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const search = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || typeof query !== "string") {
      return res.status(400).json({
        success: false,
        message: "query is required",
      });
    }

    const memories = await searchMemory(query);

    return res.json({
      success: true,
      memories,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
