import { createEmbedding } from "../ai/embedding.service.js";
import { createMemoryDB, searchMemoriesDB } from "./memory.repository.js";

export const saveMemory = async ({ content, metadata = {} }) => {
  const embedding = await createEmbedding(content);

  return createMemoryDB({
    content,
    metadata,
    embedding,
  });
};

export const searchMemory = async (query, limit = 5) => {
  const embedding = await createEmbedding(query);

  return searchMemoriesDB(embedding, limit);
};
