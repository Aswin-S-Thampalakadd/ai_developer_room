import { createEmbedding } from "../ai/embedding.service.js";
import {
  createProjectDocumentDB,
  searchProjectDocumentsDB,
} from "./document.repository.js";
import { deleteProjectDocumentsDB } from "./document.repository.js";

export const indexProject = async (project, documents) => {
  await deleteProjectDocumentsDB(project);

  let count = 0;

  for (const document of documents) {
    if (!document.content || !document.filePath) {
      continue;
    }

    const embedding = await createEmbedding(document.content);

    await createProjectDocumentDB({
      project,
      filePath: document.filePath,
      content: document.content,
      embedding,
    });

    count++;
  }

  return {
    project,
    indexedDocuments: count,
  };
};

export const retrieveProjectContext = async (project, query, limit = 8) => {
  const embedding = await createEmbedding(query);

  return searchProjectDocumentsDB(project, embedding, limit);
};
