// imports
import { Request, Response, NextFunction } from 'express';

// tables
import { users } from '../db/schema/users';
import { user_roles } from '../db/schema/user_roles';

// drizzle utils
import {eq} from 'drizzle-orm';

// data base
import db from '../db/connection';

// Auth user function
import { get_auth_user } from "../middleware/auth_validation";

// authorize role functions
/*
    some functions of de app, will be exclusive to admins or veterinarians, because that is neccesary
    valitade the role of the user
*/

/* 
    An array with the permitted roles will be entered and the system will only allow access to the specified roles.
    something like authorize_role(["admin"]) or authorize_role(["admin", "Veterinarian"]).
*/
export const authorize_role = (allowed_roles: string[]) => {

    return async (req: Request, res: Response, next: NextFunction) => {

        // Get auth user
        const auth_user = await get_auth_user(req);

        // Extract user data
        const [user_data] = await db
            .select({ role_name: user_roles.name })
            .from(users)
            .innerJoin(user_roles, eq(users.role_id, user_roles.id))
            .where(eq(users.id, auth_user.id));

        // Verify role, if the role does not match those specified, deny access
        if (!user_data || !allowed_roles.includes(user_data.role_name)) {
            return res.status(403).json({ message: "Access denied" });
        }

        next();
    };
};