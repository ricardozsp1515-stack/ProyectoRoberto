//imports
import { pgTable, uuid, text, timestamp, integer} from "drizzle-orm/pg-core";
import {relations} from "drizzle-orm";
import {createInsertSchema, createSelectSchema} from "drizzle-zod";

// table imports
import { users } from "./users";
import { veterinarian } from "./veterinarian";
import { veterinary_center } from "./veterinary_center";

// define table
export const comments = pgTable ('comments', {
    id: uuid('id').primaryKey().defaultRandom(),
    user_id: uuid ('user_id').notNull().references(()=> users.id, { onDelete: "cascade" }),
    veterinarian_id: uuid ('veterinarian_id').references(() => veterinarian.id),
    veterinary_center_id: uuid ('veterinary_center_id').references(()=> veterinary_center.id),
    stars: integer ('stars').notNull(),
    comment: text ('comment').notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull()
});

// define relations
export const commets_relations = relations (comments, ({one}) => ({
    user: one(users, {
        fields: [comments.user_id],
        references: [users.id]
    }),

    veterinarian: one(veterinarian, {
        fields: [comments.veterinarian_id],
        references: [veterinarian.id]
    }),

    veterinary_center: one(veterinary_center, {
        fields: [comments.veterinary_center_id],
        references: [veterinary_center.id]
    }),
}));

// Infer types
export type Comments = typeof comments.$inferSelect;

// Create Zod schemas for validation
export const insert_comments_schema = createInsertSchema(comments);
export const select_comments_schema = createSelectSchema(comments);