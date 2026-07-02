// imports
import { pgTable, uuid, text, timestamp, integer} from "drizzle-orm/pg-core";
import {relations} from "drizzle-orm";
import {createInsertSchema, createSelectSchema} from "drizzle-zod";
import { pets } from "./pets";

// define table
export const pet_types = pgTable('pet_types', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull()
});

// define relations
export const pet_types_relations = relations ((pet_types), ({many}) => ({
    pets: many(pets)
}));

// infer types
export type Pet_types = typeof pet_types.$inferSelect;

// Create Zod schemas for validation

export const insert_pet_types_schema = createInsertSchema (pet_types);
export const select_pet_types_schema = createSelectSchema (pet_types);