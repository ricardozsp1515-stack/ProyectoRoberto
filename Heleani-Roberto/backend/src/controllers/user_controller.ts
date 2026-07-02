//imports
import e, { Request, Response } from "express";
import {db} from '../db/connection';
import { get_auth_user } from "../middleware/auth_validation";

//import tables
import { users } from "../db/schema/users";
import { user_roles } from "../db/schema/user_roles";
import { images } from "../db/schema/images";
import {hash_password} from '../utils/passwords';
//db utils
import {eq, ilike} from 'drizzle-orm';

// Get all users function

/*
    
    Administrators only!
    retrieve all users, query the database for information on all users and print

*/

export const get_all = async (req:Request, res:Response) => {
    try {
        // get information
        const results = await db
            .select({
                id: users.id,
                //role_id: users.role_id,
                role_name: user_roles.name,
                name: users.name,
                email: users.email,
                password: users.password,
                image_url: images.url
                /*
                created_at: users.created_at,
                updated_at: users.updated_at
                */
            })

            // Join tables
            .from(users)
            .innerJoin(images, eq(users.image_id, images.id))
            .leftJoin(user_roles, eq(users.role_id, user_roles.id))
        
        // In the event that there are no registered users
            if (!results.length) {
            return res.status(404).json({ message: "Not users registered" });
        }

        // transform the data into an array
        const array_users = results.map(row => ({
            id: row.id,
            name: row.name,
            email: row.email,
            password: row.password,
            role_name: row.role_name,
            image_url: row.image_url
            /*
            created_at: row.created_at,
            updated_at: row.updated_at
            */
        }));
        
        // print array
        res.status(200).json(array_users);

    // handle errors
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Get user by id

/*
    
    In user profile, the user data suppose to be visible, to show user information, extract user id from the token 
    and search for this user data

    Admin only!
    If the user is an administrator, they can choose whether or not to enter an ID in the parameters to search for that
    user; if they do not, their own information will be displayed.

*/

export const get_by_id = async (req:Request, res:Response) => {
    try {

        // call function to get user data from token
        const auth_user = await get_auth_user(req);

        //Validate the user's role 

        const [user_data] = await db
            .select({ role_name: user_roles.name })
            .from(users)
            .innerJoin(user_roles, eq(users.role_id, user_roles.id))
            .where(eq(users.id, auth_user.id));

        // Verify that the user is an administrator.
        const is_admin = user_data?.role_name === "admin";

        /* 
            If the user is an administrator and the `id` parameter exists,
            the user displayed will be the one with an ID equal to the parameter's ID;
            otherwise, the user displayed will be the one with the ID that matches the authenticated user's ID.
        */
        const user_id = is_admin && req.params.id
            ? String(req.params.id)
            : auth_user.id
        
        // fetch data from the DB
        const results = await db
            .select({
                id: users.id,
                //role_id: users.role_id,
                role_name: user_roles.name,
                name: users.name,
                email: users.email,
                image_url: images.url
                //password: users.password,
                /*
                created_at: users.created_at,
                updated_at: users.updated_at
                */
            })
            .from(users)
            .leftJoin(user_roles, eq(users.role_id, user_roles.id))
            .innerJoin(images, eq(users.image_id, images.id))
        // search data from specific user
            .where(eq(users.id, user_id))
        
        // verify that this user has data
        if (!results.length) {
            return res.status(404).json({ message: "User not found" });
        }

        // convert results into an object
        const user = results[0];
        
        // return user
        res.status(200).json(user);
    
    // handle errors
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// Get users by name Not used

/*
    
    1. Extract name params
    2. Search for some user with equal name (Use ilike to UX, because you can search Ricardo, ricardo or RicArDO and results wont be affected)
    3. If anyone has this name, add it to "results"
    4. Convert results to Array
    5. Return array

*/

/*
export const get_by_name = async (req:Request, res:Response) => {
    try {
        //1
        const name = String(req.params.name);

        //2, 3
        const results = await db
            .select({
                id: users.id,
                //role_id: users.role_id,
                role_name: user_roles.name,
                name: users.name,
                email: users.email,
                image_url: images.url
                //password: users.password,
                /*
                created_at: users.created_at,
                updated_at: users.updated_at
                
            })
            .from(users)
            .leftJoin(user_roles, eq(users.role_id, user_roles.id))
            .innerJoin(images, eq(users.image_id, images.id))
            .where(ilike(users.name, `%${name}%`))

        if (!results.length) {
            return res.status(404).json({ message: "Not user with this name" });
        }

        //4
        const array_users = results.map(row => ({
            id: row.id,
            name: row.name,
            email: row.email,
            role_name: row.role_name,
            image_url: row.image_url
        }));
        //5
        res.status(200).json(array_users);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
*/


// update user

/*
    To prevent users from updating other users' information, the ID is extracted directly from the token.

    Administrators only!
    The endpoint has the option to place an ID in the route, and the user will be updated with that ID; 
    however, this ID is only taken into account if the user's role is an admin.

*/
export const update_user = async (req:Request, res:Response) => {

    try {
        // call function to get user data from token
        const auth_user = await get_auth_user(req);

        //Validate the user's role 

        const [user_data] = await db
            .select({ role_name: user_roles.name })
            .from(users)
            .innerJoin(user_roles, eq(users.role_id, user_roles.id))
            .where(eq(users.id, auth_user.id));

        // Verify that the user is an administrator.
        const is_admin = user_data?.role_name === "admin";

        /* 
            If the user is an administrator and the id parameter exists,
            then the user will be updated with an id equal to the parameter; 
            otherwise, the user will be updated with the id that matches the authenticated user's id.
        */
        const user_id = is_admin && req.params.id
            ? String(req.params.id)
            : auth_user.id

        const { name, email, password} = req.body;

        /* 
            verify that the password exist, if doesnt exist declare it as undefined
            this is because, without this condition you would have to send the password and generally
            you wouldn't want to change it
        */
        const hashed_password = password? await hash_password(password) : undefined;

        const update_data: Record<string, any> = {
            name,
            email,
            updated_at: new Date()
        };

        // this condition serves to prevent the password from being entered as undefined

        if(hash_password != undefined){
            update_data.password= hashed_password;
        }

        // insert new data in correct user
        const updated_user = await db.update(users)
            .set(update_data)

            // search for user id
            .where(eq(users.id, user_id))
            .returning();

        // this condition serves to prevent internal errors if, for some reason, the user is authenticated but does not exist.
        if (!updated_user.length) {
            return res.status(404).json({ message: "User not found" });
        }

        // notify that the data has been updated
        res.status(200).json({message: 'User updated'});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// Delete user

/*
    In the event that a user wants to delete their account, they can, however,
    only delete themselves, because the ID is taken directly from the token.

    Admin only!
    The endpoint has the option to place an ID in the route, and the user will be deleted with that ID; 
    however, this ID is only taken into account if the user's role is an admin.
*/

export const delete_user = async (req:Request, res:Response) => {

    try {

         // call function to get user data from token
        const auth_user = await get_auth_user(req);

        //Validate the user's role 

        const [user_data] = await db
            .select({ role_name: user_roles.name })
            .from(users)
            .innerJoin(user_roles, eq(users.role_id, user_roles.id))
            .where(eq(users.id, auth_user.id));

        // Verify that the user is an administrator.
        const is_admin = user_data?.role_name === "admin";

        /* 
            If the user is an administrator and the id parameter exists,
            then the user will be deleted with an id equal to the parameter; 
            otherwise, the user will be updated with the id that matches the authenticated user's id.
        */
        const user_id = is_admin && req.params.id
            ? String(req.params.id)
            : auth_user.id

        // Find the user and delete it.
        const deleted = await db.delete(users).where(eq(users.id, user_id)).returning();

        // Error handling, if the user cannot be found.
        if (!deleted.length) {
            return res.status(404).json({ message: "User not found" });
        }

        // Notify that the user was successfully deleted.
        res.status(200).json({ message: "User deleted successfully" });
    
    // Handle errors
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}