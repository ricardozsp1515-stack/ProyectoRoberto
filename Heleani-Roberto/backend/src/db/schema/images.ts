// imports
import { pgTable, uuid, text, timestamp, integer} from "drizzle-orm/pg-core";
import {relations} from "drizzle-orm";
import {createInsertSchema, createSelectSchema} from "drizzle-zod";
import { users } from "./users";
import { veterinary_center } from "./veterinary_center";
import { pets } from "./pets";

// define table
export const images = pgTable('images', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull().unique(),
    url: text('url').notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull()
});

// define relations

export const images_relations = relations (images, ({many}) =>({
    users: many(users),
    veterinary_centers: many(veterinary_center),
    pets: many(pets)

}));

// Infer types
export type Images = typeof images.$inferSelect;

// Create Zod schemas for validation
export const insert_image_schema = createInsertSchema(images);
export const select_image_schema = createSelectSchema(images);



