import { pgTable, bigint, text, timestamp, vector } from "drizzle-orm/pg-core";

export const projectDocuments = pgTable("project_documents", {
  id: bigint("id", {
    mode: "number",
  })
    .generatedAlwaysAsIdentity()
    .primaryKey(),

  project: text("project").notNull(),

  filePath: text("file_path").notNull(),

  content: text("content").notNull(),

  embedding: vector("embedding", {
    dimensions: 768,
  }),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  }).defaultNow(),

  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  }).defaultNow(),
});
