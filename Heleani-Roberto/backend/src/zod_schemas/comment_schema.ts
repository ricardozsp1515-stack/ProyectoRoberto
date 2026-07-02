//imports

//import zod utils
import { z } from 'zod';

// create comment schema
// Define types structure and use noempty to avoid undefined data

/* 
    The veterinarian ID and the veterinary center ID are optional
    as the comment may be directed at either one; consequently 
    the 1-to-5 rating system—and thus the star rating—includes validation
    for a minimum of 1 and a maximum of 5.
*/
export const create_comment_schema = z.object({
    veterinarian_id: z.string().nonempty().optional(),
    veterinary_center_id: z.string().nonempty().optional(),
    stars: z.number().min(1).max(5),
    comment: z.string().nonempty() 
});

// update comment schema
// Use optional because may only one parameter will be updated, but use refine to force updated at least one
export const update_comment_schema = z.object({
    stars: z.number().min(1).max(5).optional(),
    comment: z.string().nonempty().optional()
}).refine(
    (data) => Object.entries(data).some(([_, value]) => value !== undefined && value !== ""),
    { message: "Updated body can't be empty" }
);

// get comment schema
export const get_comment_schema = z.object({
    id: z.string().nonempty()
});