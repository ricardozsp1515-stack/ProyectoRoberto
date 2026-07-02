// imports
import { pgTable, uuid, text, timestamp, integer} from "drizzle-orm/pg-core";
import {relations} from "drizzle-orm";
import {createInsertSchema, createSelectSchema} from "drizzle-zod";
import { users } from "./users";

// define table
export const user_roles = pgTable('user_roles', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull()
}); 

// define relations
export const user_roles_relations = relations(user_roles, ({many}) => ({
    users: many(users)
}));

// Infer types
export type User_roles = typeof user_roles.$inferSelect;

// Create Zod schemas for validation

export const insert_user_roles_schema = createInsertSchema(user_roles);
export const select_user_role_schema = createSelectSchema(user_roles);