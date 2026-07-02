// imports
import { pgTable, uuid, text, timestamp, integer} from "drizzle-orm/pg-core";
import {relations} from "drizzle-orm";
import {createInsertSchema, createSelectSchema} from "drizzle-zod";

// table imports
import { users } from "./users";
import { veterinarian } from "./veterinarian";
import { pets } from "./pets";


// define table
export const appointment = pgTable ('appointment', {
    id: uuid('id').primaryKey().defaultRandom(),
    user_id: uuid ('user_id').notNull().references(()=> users.id, { onDelete: "cascade" }),
    veterinarian_id: uuid ('veterinarian_id').notNull().references(() => veterinarian.id),
    pet_id: uuid ('pet_id').notNull().references(() => pets.id, { onDelete: "cascade" }),
    date: timestamp('date').notNull(),
    diagnosis: text('diagnosis'),
    status:text('status').notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull()  
});

// define relations
export const appointment_relations = relations (appointment, ({one}) => ({
    user: one(users, {
        fields: [appointment.user_id],
        references: [users.id]
    }),

    veterinarian: one(veterinarian, {
        fields: [appointment.veterinarian_id],
        references: [veterinarian.id]
    }),

    pet: one(pets, {
        fields: [appointment.pet_id],
        references: [pets.id]
    })
}));

// Create Zod schemas for validation

export const insert_appointment_schema = createInsertSchema(appointment);
export const select_appointment_schema = createSelectSchema(appointment);