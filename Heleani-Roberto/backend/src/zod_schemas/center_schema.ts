//imports

//import zod utils
import { z } from 'zod';

// create request schema
// Define types structure and use noempty to avoid undefined data
export const create_center_schema = z.object({
    name: z.string().nonempty(),
    address: z.string().nonempty(),
    contact: z.string().nonempty(),
    description: z.string().nonempty()
});

// update comment schema
// Use optional because may only one parameter will be updated, but use refine to force updated at least one
export const update_center_schema = z.object({
    name: z.string().optional(),
    address: z.string().optional(),
    contact: z.string().optional(),
    description: z.string().optional()
}).refine(
    (data) => Object.entries(data).some(([_, value]) => value !== undefined && value !== ""),
    { message: "Updated body can't be empty" }
);

// process request schema
export const process_center_schema = z.object({
    message: z.string().nonempty()
});

// get request schema
export const get_center_schema = z.object({
    id: z.string().nonempty()
});