import { chatWithAI } from "./ai.service.js";

export const chat = async (req, res) => {
  try {
    // const { message } = req.body;

    const { message, project } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        success: false,
        message: "message is required",
      });
    }

    // const response = await chatWithAI(message);

    const response = await chatWithAI(message, project);

    return res.json({
      success: true,
      response,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
