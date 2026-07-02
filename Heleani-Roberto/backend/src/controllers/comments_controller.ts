import { Request, Response } from "express";
import { and, eq } from "drizzle-orm";
import { db } from "../db/connection";
import { comments } from "../db/schema/comments";
import { get_auth_user } from "../middleware/auth_validation";
import { users } from "../db/schema/users";
import { user_roles } from "../db/schema/user_roles";

// create comment function

/* 
    It will be possible to post comments on the profiles of both veterinarians
    and veterinary centers; to achieve this, the function extracts the token to
    retrieve the user ID, while information from the request body is used to assign
    the comment to either a veterinarian or a center.
*/
export const create_comment = async (req: Request, res: Response) => {
    try {

        // get auth user
        const auth_user = await get_auth_user(req);

        // extract data
        const { veterinarian_id, veterinary_center_id, stars, comment } = req.body;

        // Verify that the comment is addressed to at least one entity. 
        if (!veterinarian_id && !veterinary_center_id) {
            return res.status(400).json({ message: "The comment must be addressed to at least one entity." });
        }

        // Verify that the comment is not addressed to more than one entity.
        if (veterinarian_id && veterinary_center_id) {
            return res.status(400).json({ message: "The comment cannot be addressed to more than one entity." });
        }
        
        // insert data
        const [new_comment] = await db
            .insert(comments)
            .values({
                user_id: auth_user.id,
                veterinarian_id: veterinarian_id ?? null,
                veterinary_center_id: veterinary_center_id ?? null,
                stars,
                comment,
            })
            .returning();
        
        // Notify that the comment was successfully created.
        res.status(201).json({ message: "Comment created"});
        
    // handle errors
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get a veterinarian's comments

/* 
    Comments must be visible on each veterinarian's page; therefore, the veterinarian's
    user ID will be retrieved to display all comments associated with them.
*/
export const get_vet_comments = async (req: Request, res: Response) => {
    try { 

        // extract id from params
        const vet_id = String(req.params.id);

        // Fetch comments data
        const results = await db
            .select({
                id: comments.id,
                user_id: comments.user_id,
                stars: comments.stars,
                comment: comments.comment,
                created_at: comments.created_at,
            })
            .from(comments)
            .where(eq(comments.veterinarian_id, vet_id));

        //handle errors
        if(!results.length){
            res.status(404).json({message: "No comments registered"});
        }

        // convert data into array
        const array_comments = results.map(row => ({
            id: row.id,
            user_id: row.user_id,
            stars: row.stars,
            comment: row.comment,
            reated_at: row.created_at,
        }))

        
        // Return comments
        res.status(200).json(array_comments);

    // handle errors
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get veterinary center comments

/*
    Comments must be visible on each veterinary center's page; therefore, the veterinary
    center's ID will be retrieved to display all comments associated with it.
*/
export const get_center_comments = async (req: Request, res: Response) => {
    try { 

        // extract center id
        const center_id = String(req.params.id);

        // fetch commets
        const results = await db
            .select({
                id: comments.id,
                user_id: comments.user_id,
                stars: comments.stars,
                comment: comments.comment,
                created_at: comments.created_at,
            })
            .from(comments)
            .where(eq(comments.veterinary_center_id, center_id));

        //handle errors
        if(!results.length){
            res.status(404).json({message: "No comments registered"});
        }

        // convert data into array
        const array_comments = results.map(row => ({
            id: row.id,
            user_id: row.user_id,
            stars: row.stars,
            comment: row.comment,
            reated_at: row.created_at,
        }))
        // response with comments
        res.status(200).json(array_comments);
    
    // handle errors
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// update comment function

/* 
    Users might want to update a comment's information; to that end, this function extracts
    the data from the request body and updates the corresponding user information.

    Admin only!
    Regular users can only update their own comments; admins can update any of them..
*/
export const update_comment = async (req: Request, res: Response) => {

    try {
        // call function to get user data from token
        const auth_user = await get_auth_user(req);

        //Validate the user's role 

        const [user_data] = await db
            .select({ role_name: user_roles.name })
            .from(users)
            .innerJoin(user_roles, eq(users.role_id, user_roles.id))
            .where(eq(users.id, auth_user.id));

        // Verify that the user is an admin.
        const is_admin = user_data?.role_name === "admin";

        /* 
            If the user is an administrator and the `user` query parameter exists,
            comments belonging to the user whose ID matches that parameter can be modified;
            otherwise, only comments belonging to the user whose ID matches that of the authenticated user can be modified.
        */
        const user_id = is_admin && req.query.user
            ? String(req.query.user)
            : auth_user.id

        // take comment id
        const comment_id = String(req.params.id);

        // take updated comment data
        const { stars, comment } = req.body;

        // create an object with updated data
        const update_data: Record<string, any> = {
            stars,
            comment,
            updated_at: new Date()
        };

        /* 
            Verify that the comment exists and that the authentication user ID matches the comment user ID.
            This prevents a user who knows other users comments IDs from updating their data
        */
        const [searched_comment] = await db
            .select()
            .from(comments)
            .where(and(eq(comments.id, comment_id), eq(comments.user_id, user_id)));

        // If the user ID and the comments user ID do not match, an error will be generated
        if (!searched_comment) {
            return res.status(404).json({ message: "The comment is not registered" });
        }

        // insert new data in corresponding comment
        const updated_comment = await db.update(comments)
            .set(update_data)

            // search for pet id
            .where(eq(comments.id, comment_id))
            .returning();

        // this condition serves to prevent internal errors if, for some reason, the comments id matches with users id but does not exist.
        if (!updated_comment.length) {
            return res.status(404).json({ message: "Comment not found" });
        }

        // notify that the data has been updated
        res.status(200).json({ message: 'Comment updated' });

        // handle errors
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal server error" });
    }
}



// Delete comment

/* 
    Users may want to delete a comment; to do this, this function extracts the ID of the comment to be deleted.

    Admin only!
    Users can only delete their own comments, but administrators can delete anyone's.
*/
export const delete_comment = async (req: Request, res: Response) => {
    try {

        // get auth user
        const auth_user = await get_auth_user(req);

        // extract comment id
        const comment_id = String(req.params.id);

        
        //Validate the user's role 

        const [user_data] = await db
            .select({ role_name: user_roles.name })
            .from(users)
            .innerJoin(user_roles, eq(users.role_id, user_roles.id))
            .where(eq(users.id, auth_user.id));

        // Verify that the user is an admin.
        const is_admin = user_data?.role_name === "admin";

        /* 
            If the user is an administrator and the `user` query parameter exists,
            comments belonging to the user whose ID matches that parameter can be modified;
            otherwise, only comments belonging to the user whose ID matches that of the authenticated user can be modified.
        */
        const user_id = is_admin && req.query.user
            ? String(req.query.user)
            : auth_user.id

        /* 
            Verify that the comment exists and that the authentication user ID matches the comment user ID.
            This prevents a user who knows other users comments IDs from deleting their data
        */
        const [searched_comment] = await db
            .select()
            .from(comments)
            .where(and(eq(comments.id, comment_id), eq(comments.user_id, user_id)));

        // If the user ID and the comments user ID do not match, an error will be generated
        if (!searched_comment) {
            return res.status(404).json({ message: "The comment is not registered" });
        }

        // deleted comment
        await db.delete(comments).where(eq(comments.id, comment_id));

        // Notify that the comment was successfully deleted.
        res.status(200).json({ message: "Comment deleted" });
    
    // handle errors
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};