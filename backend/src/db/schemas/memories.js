import {
  pgTable,
  bigint,
  text,
  jsonb,
  timestamp,
  vector,
} from "drizzle-orm/pg-core";

export const memories = pgTable("memories", {
  id: bigint("id", {
    mode: "number",
  })
    .generatedAlwaysAsIdentity()
    .primaryKey(),

  content: text("content").notNull(),

  metadata: jsonb("metadata"),

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
