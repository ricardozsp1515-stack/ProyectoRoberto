//imports

//import zod utils
import { z } from 'zod';

// Zod validdations

// post pets
// Define types structure and use noempty to avoid undefined data
export const create_pet_schema = z.object({
    name: z.string().nonempty(),
    breed: z.string().nonempty(),
    age: z.string().nonempty(),
    pet_type_id: z.string().nonempty()
});

// get pet by id
// Nothing to say...
export const get_pet_schema = z.object({
    id: z.string().nonempty()
});

//get pet by name
export const get_pet_by_name_schema = z.object({
    name: z.string().nonempty()
});

// update pets schema
// Use optional because may only one parameter will be updated, but use refine to force updated at least one
export const update_pet_schema = z.object({
    name: z.string().optional(),
    breed: z.string().optional(),
    age: z.string().optional(),
    pet_type_id: z.string().optional()
}).refine(
    (data) => Object.entries(data).some(([_, value]) => value !== undefined && value !== ""),
    { message: "Updated body can't be empty" }
);

