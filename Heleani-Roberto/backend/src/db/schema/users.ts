// imports
import { pgTable, uuid, text, timestamp, integer} from "drizzle-orm/pg-core";
import {relations} from "drizzle-orm";
import {createInsertSchema, createSelectSchema} from "drizzle-zod";

// table imports
import { user_roles } from "../schema/user_roles";
import { images } from "./images";
import { pets } from "./pets";
import { comments } from "./comments";
import { appointment } from "./appointment";
import { veterinary_center } from "./veterinary_center";

// define table
export const users = pgTable('users',{
    id: uuid('id').primaryKey().defaultRandom(),
    role_id: uuid ('role_id').notNull().references(() => user_roles.id),
    image_id: uuid('image_id').references(() => images.id),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull()
});

// define relations
export const user_relations = relations (users, ({one, many}) => ({
    role: one(user_roles, {
        fields: [users.role_id],
        references: [user_roles.id]
    }),

    image: one(images, {
        fields: [users.image_id],
        references: [images.id]
    }),

    pets: many(pets),

    comments: many (comments),
    
    appointments: many(appointment),

    veterinary_centers: many(veterinary_center)
}));

// Infer types
export type User = typeof users.$inferSelect;

// Create Zod schemas for validation
export const insert_user_schema = createInsertSchema(users);
export const select_user_schema = createSelectSchema(users);
