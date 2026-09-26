import { indexProject, retrieveProjectContext } from "./rag.service.js";

export const index = async (req, res) => {
  try {
    const { project, documents } = req.body;

    if (!project || !Array.isArray(documents)) {
      return res.status(400).json({
        success: false,
        message: "project and documents are required",
      });
    }

    const result = await indexProject(project, documents);

    return res.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const retrieve = async (req, res) => {
  try {
    const { project, query, limit } = req.body;

    if (!project || !query) {
      return res.status(400).json({
        success: false,
        message: "project and query are required",
      });
    }

    const results = await retrieveProjectContext(project, query, limit || 8);

    return res.json({
      success: true,
      results,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
