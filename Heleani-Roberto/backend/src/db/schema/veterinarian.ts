// imports
import { pgTable, uuid, text, timestamp, integer} from "drizzle-orm/pg-core";
import {relations} from "drizzle-orm";
import {createInsertSchema, createSelectSchema} from "drizzle-zod";

// table imports
import { users } from "./users";
import { veterinary_center } from "./veterinary_center";
import { appointment } from "./appointment";
import { comments } from "./comments";

// define table
export const veterinarian = pgTable ('veterinarian', {
    id: uuid('id').primaryKey().defaultRandom(),
    user_id: uuid ('user_id').notNull().unique().references(()=> users.id, { onDelete: "cascade" }),
    veterinary_center_id: uuid ('veterinary_center_id').references(()=> veterinary_center.id),
    license: text('license').notNull().unique(),
    specialty: text('specialty').notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull()
});

// define relations
export const veterinarian_relations = relations (veterinarian, ({one, many}) => ({
    user: one(users, {
        fields: [veterinarian.user_id],
        references: [users.id]
    }),

    veterinary_center: one(veterinary_center, {
        fields: [veterinarian.veterinary_center_id],
        references: [veterinary_center.id]
    }),

    appointments: many(appointment),
    
    comments: many(comments)
}));

// Infer types
export type Veterinarian = typeof veterinarian.$inferSelect;

// Create Zod schemas for validation

export const insert_veterinarian_schema = createInsertSchema(veterinarian);
export const select_veterinarian_schema = createSelectSchema(veterinarian);


