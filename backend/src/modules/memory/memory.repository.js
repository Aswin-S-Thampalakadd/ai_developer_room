import { desc, sql } from "drizzle-orm";

import { memories } from "../../db/schemas/memories.js";
import { db } from "../../db/index.js";

export const createMemoryDB = async ({ content, metadata, embedding }) => {
  const result = await db
    .insert(memories)
    .values({
      content,
      metadata,
      embedding,
    })
    .returning();

  return result[0];
};

export const searchMemoriesDB = async (embedding, limit = 5) => {
  const vector = `[${embedding.join(",")}]`;

  const similarity = sql`
      1 - (
        ${memories.embedding} <=> ${sql.raw(`'${vector}'::vector`)}
      )
    `;

  return db
    .select({
      id: memories.id,
      content: memories.content,
      metadata: memories.metadata,
      similarity,
    })
    .from(memories)
    .orderBy(desc(similarity))
    .limit(limit);
};
