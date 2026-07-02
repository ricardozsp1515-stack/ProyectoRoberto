import { pgTable, uuid, text, timestamp, integer} from "drizzle-orm/pg-core";
import {relations} from "drizzle-orm";
import {createInsertSchema, createSelectSchema} from "drizzle-zod";

// table imports
import { users } from "./users";
import { veterinary_center } from "./veterinary_center";

// define table
export const veterinarian_requests = pgTable('veterinarian_requests', {
    id: uuid('id').primaryKey().defaultRandom(),
    user_id: uuid('user_id').notNull().references(() => users.id, { onDelete: "cascade" }),
    veterinary_center_id: uuid('veterinary_center_id').references(() => veterinary_center.id),
    license: text('license').notNull(),
    specialty: text('specialty').notNull(),
    status: text('status').notNull().default('pending'),
    reviewed_by: uuid('reviewed_by').references(() => users.id),
    message: text('message'),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// define relations
export const veterinarian_requests_relations = relations (veterinarian_requests, ({one}) => ({
    user: one(users, {
        fields: [veterinarian_requests.user_id],
        references: [users.id]
    }),

    veterinary_center: one(veterinary_center, {
            fields: [veterinarian_requests.veterinary_center_id],
            references: [veterinary_center.id]
        }),
}));

// Infer types
export type Veterinarian_requests = typeof veterinarian_requests.$inferSelect;

// Create Zod schemas for validation

export const insert_veterinarian_requests_schema = createInsertSchema(veterinarian_requests);
export const select_veterinarian_requests_schema = createSelectSchema(veterinarian_requests);