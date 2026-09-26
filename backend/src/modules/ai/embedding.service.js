import ollama from "ollama";
import config from "../../config.js";

export const createEmbedding = async (text) => {
  const response = await ollama.embeddings({
    model: config.ollamaEmbeddingModel,
    prompt: text,
  });

  return response.embedding;
};
