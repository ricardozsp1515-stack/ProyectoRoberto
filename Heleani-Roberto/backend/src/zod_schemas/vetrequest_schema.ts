//imports

//import zod utils
import { z } from 'zod';

// create request schema
// Define types structure and use noempty to avoid undefined data
export const create_vetrequest_schema = z.object({
    user_id: z.string().optional(),
    veterinary_center_id: z.string().optional(),
    license: z.string().nonempty(),
    specialty: z.string().nonempty()
});

// process request schema
export const process_vetrequest_schema = z.object({
    message: z.string().nonempty()
});

// get request schema
export const get_vetrequest_schema = z.object({
    id: z.string().nonempty()
});

