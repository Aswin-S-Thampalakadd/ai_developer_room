import { chatWithAI } from "./ai.service.js";

export const chat = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== "string") {
      return res.status(400).json({
        success: false,
        message: "Message is missing",
      });
    }

    const response = await chatWithAI(message);

    return res.json({
      success: true,
      response,
    });
  } catch (error) {
    console.error("Error : ", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
