import { pgTable, uuid, text, timestamp} from "drizzle-orm/pg-core";
import {createInsertSchema, createSelectSchema} from "drizzle-zod";
import {relations} from "drizzle-orm";

// table imports
import { users } from "./users";

// define table
export const veterinary_center_requests = pgTable('veterinary_center_requests', {
    id: uuid('id').primaryKey().defaultRandom(),
    user_id: uuid('user_id').notNull().references(() => users.id, { onDelete: "cascade" }),
    name: text('name').notNull(),
    address: text('address').notNull(),
    contact: text('contact').notNull(),
    description: text('description').notNull(),
    status: text('status').notNull().default('pending'),
    reviewed_by: uuid('reviewed_by').references(() => users.id),
    message: text('message'),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const veterinary_center_requests_relations = relations (veterinary_center_requests, ({one}) => ({
    user: one(users, {
        fields: [veterinary_center_requests.user_id],
        references: [users.id]
    })
}));

// Infer types
export type Veterinary_center_requests = typeof veterinary_center_requests.$inferSelect;

// Create Zod schemas for validation

export const insert_veterinary_center_requests_schema = createInsertSchema(veterinary_center_requests);
export const select_veterinary_center_requests_schema = createSelectSchema(veterinary_center_requests);