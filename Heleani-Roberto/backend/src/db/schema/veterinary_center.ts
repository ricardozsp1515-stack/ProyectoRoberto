// imports
import { pgTable, uuid, text, timestamp, integer} from "drizzle-orm/pg-core";
import {relations} from "drizzle-orm";
import {createInsertSchema, createSelectSchema} from "drizzle-zod";

// table imports
import { images } from "./images";
import { veterinarian } from "./veterinarian";
import { users } from "./users";
import { comments } from "./comments";

// define table
export const veterinary_center = pgTable('veterinary_center', {
    id: uuid('id').primaryKey().defaultRandom(),
    user_id: uuid('user_id').notNull().references(() => users.id, { onDelete: "cascade" }),
    image_id: uuid('image_id').references(() => images.id),
    name: text('name').notNull(),
    address: text('address').notNull(),
    contact: text('contact').notNull(),
    description: text('description').notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull()
});

// define relations

export const veterinary_center_relations = relations (veterinary_center, ({many, one}) =>({

    user: one(users, {
            fields: [veterinary_center.user_id],
            references: [users.id]
        }),

    image: one(images, {
        fields: [veterinary_center.image_id],
        references: [images.id]
    }),

    veterinarians: many(veterinarian),

    comments: many(comments)
}));

// Infer types
export type Veterinary_center = typeof veterinary_center.$inferSelect;

// Create Zod schemas for validation

export const insert_veterinary_center_schema = createInsertSchema(veterinary_center);
export const select_veterinary_center_schema = createSelectSchema(veterinary_center);
