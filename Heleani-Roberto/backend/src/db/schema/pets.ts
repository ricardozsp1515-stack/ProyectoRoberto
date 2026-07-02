// imports
import { pgTable, uuid, text, timestamp, integer} from "drizzle-orm/pg-core";
import {relations} from "drizzle-orm";
import {createInsertSchema, createSelectSchema} from "drizzle-zod";

// table imports
import { users } from "./users";
import { pet_types } from "./pet_types";
import { images } from "./images";
import { appointment } from "./appointment";

// define table
export const pets = pgTable('pets', {
    id: uuid('id').primaryKey().defaultRandom(),
    user_id: uuid ('user_id').notNull().references(()=> users.id, { onDelete: "cascade" }),
    pet_type_id: uuid ('pet_type_id').notNull().references(()=> pet_types.id),
    image_id: uuid('image_id').references(() => images.id),
    name: text('name').notNull(),
    breed: text ('breed').notNull(),
    age: text ('age').notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull()
});

// define relations

export const pets_relations = relations (pets, ({one, many}) => ({
    user: one(users, {
        fields: [pets.user_id],
        references: [users.id]
    }),

    pet_type: one(pet_types, {
        fields: [pets.pet_type_id],
        references: [pet_types.id]
    }),

    image: one(images, {
        fields: [pets.image_id],
        references: [images.id]
    }),

    appointments: many (appointment)
}));

// Infer types
export type Pets = typeof pets.$inferSelect;

// Create Zod schemas for validation
export const insert_pets_schema = createInsertSchema(pets);
export const select_pets_schema = createSelectSchema(pets);
