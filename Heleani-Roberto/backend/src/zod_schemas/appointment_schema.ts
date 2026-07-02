//imports

//import zod utils
import { z } from 'zod';

// create appointment schema
// Define types structure and use noempty to avoid undefined data
export const create_appointment_schema = z.object({
    veterinarian_id: z.string().nonempty(),
    pet_id: z.string().nonempty(),
    date: z.string().nonempty()
});

// get appointment schema
export const get_appointment_schema = z.object({
    id: z.string().nonempty()
});

// update appointment schema
export const update_appointment_schema = z.object({
    diagnosis: z.string().nonempty(),
});



