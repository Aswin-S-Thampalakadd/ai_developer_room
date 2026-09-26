import { eq, and, desc, sql } from "drizzle-orm";

import { db } from "../../db/index.js";
import { projectDocuments } from "../../db/schemas/projectDocuments.js";

export const deleteProjectDocumentsDB = async (project) => {
  await db
    .delete(projectDocuments)
    .where(eq(projectDocuments.project, project));
};

export const createProjectDocumentDB = async ({
  project,
  filePath,
  content,
  embedding,
}) => {
  const result = await db
    .insert(projectDocuments)
    .values({
      project,
      filePath,
      content,
      embedding,
    })
    .returning();

  return result[0];
};

export const searchProjectDocumentsDB = async (
  project,
  embedding,
  limit = 8
) => {
  const vector = `[${embedding.join(",")}]`;

  const similarity = sql`
      1 - (
        ${projectDocuments.embedding}
        <=> CAST(${vector} AS vector)
      )
    `;

  return db
    .select({
      id: projectDocuments.id,
      project: projectDocuments.project,
      filePath: projectDocuments.filePath,
      content: projectDocuments.content,
      similarity,
    })
    .from(projectDocuments)
    .where(eq(projectDocuments.project, project))
    .orderBy(desc(similarity))
    .limit(limit);
};
