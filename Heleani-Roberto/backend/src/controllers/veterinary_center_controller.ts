import { Request, Response } from "express";
import { eq, and, ilike, inArray } from "drizzle-orm";
import { db } from "../db/connection";
import { veterinary_center } from "../db/schema/veterinary_center";
import { images } from "../db/schema/images";
import { users } from "../db/schema/users";
import { user_roles } from "../db/schema/user_roles";
import { veterinary_center_requests } from "../db/schema/veterinary_center_requests";
import { get_auth_user } from "../middleware/auth_validation";

// get all centers function

/* 
    On the main page, registered veterinary centers are supposed to be visible; this function queries for them and returns them.
*/
export const get_all = async (req: Request, res: Response) => {
    try {
        
        // fetch centers
        const results = await db
            .select({
                id: veterinary_center.id,
                owner: users.name,
                name: veterinary_center.name,
                address: veterinary_center.address,
                contact: veterinary_center.contact,
                description: veterinary_center.description,
                image_url: images.url
                /*
                created_at: veterinary_center.created_at,
                updated_at: veterinary_center.updated_at
                */
            })
            .from(veterinary_center)
            .innerJoin(images, eq(veterinary_center.image_id, images.id))
            .innerJoin(users, eq(veterinary_center.user_id, users.id))

        if(!results.length){
            return res.status(404).json({message:"No centers registered"});
        }
        
        // convert data into array
        const array_vet_centers = results.map(row => ({
            id: row.id,
            owner: row.owner,
            name: row.name,
            address: row.address,
            contact: row.contact,
            description: row.description,
            image_url: row.image_url
            /*
            created_at: row.created_at,
            updated_at: row.updated_at
            */
        }));
        
        // return array
        res.status(200).json(array_vet_centers);
    
    // handle errors
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const get_by_name = async (req: Request, res: Response) => {

    try {
        // take center name
        const center_name = String(req.params.name);

        const results = await db
            .select({
                id: veterinary_center.id,
                owner: users.name,
                name: veterinary_center.name,
                address: veterinary_center.address,
                contact: veterinary_center.contact,
                description: veterinary_center.description,
                image_url: images.url
                /*
                created_at: pets.created_at,
                updated_at: pets.updated_at
                */
            })
            .from(veterinary_center)
            .innerJoin(images, eq(veterinary_center.image_id, images.id))
            .innerJoin(users, eq(veterinary_center.user_id, users.id))
            .where((ilike(veterinary_center.name, `%${center_name}%`)));

        if (!results.length) {
            return res.status(404).json({ message: "Not center with this name" });
        }

        // convert db data in a array
        const array_centers = results.map(row => ({
            id: row.id,
            owner: row.owner,
            name: row.name,
            address: row.address,
            contact: row.contact,
            description: row.description,
            image_url: row.image_url
        }));

        // return array
        res.status(200).json(array_centers);

        // handle errors
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal server error" });
    }

}

export const get_by_id = async (req: Request, res: Response) => {

    try {

        // take center id
        const center_id = String(req.params.id);

        const results = await db
            .select({
                id: veterinary_center.id,
                user_id: veterinary_center.user_id,
                owner: users.name,
                name: veterinary_center.name,
                address: veterinary_center.address,
                contact: veterinary_center.contact,
                description: veterinary_center.description,
                image_url: images.url
                /*
                created_at: pets.created_at,
                updated_at: pets.updated_at
                */
            })
            .from(veterinary_center)
            .innerJoin(images, eq(veterinary_center.image_id, images.id))
            .innerJoin(users, eq(veterinary_center.user_id, users.id))
            .where(eq(veterinary_center.id, center_id))
        
        // convert data into an object
        const center = results[0];


        if (!center) {
            return res.status(404).json({ message: "Center in not registered" });
        }

        // return center
        res.status(200).json(center);

        // handle errors
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal server error" });
    }

}

// get my own veterinary center function
/* 
    Once a center request is approved, the owner needs a way to find their
    own clinic (they don't know its id yet). Same pattern as veterinarian's
    /me: takes the user id from the token and looks up the center they own.
*/
export const get_my_center = async (req: Request, res: Response) => {

    try {
        const auth_user = await get_auth_user(req);

        const results = await db
            .select({
                id: veterinary_center.id,
                user_id: veterinary_center.user_id,
                owner: users.name,
                name: veterinary_center.name,
                address: veterinary_center.address,
                contact: veterinary_center.contact,
                description: veterinary_center.description,
                image_url: images.url
            })
            .from(veterinary_center)
            .innerJoin(images, eq(veterinary_center.image_id, images.id))
            .innerJoin(users, eq(veterinary_center.user_id, users.id))
            .where(eq(veterinary_center.user_id, auth_user.id));

        const center = results[0];

        // If the user doesn't own a center yet (no approved request), there's
        // nothing to return
        if (!center) {
            return res.status(404).json({ message: "You don't have a registered center" });
        }

        res.status(200).json(center);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }

}

// update center function

/* 
    Function to update centers, only owners will be able to do it

    Admin only!
    Admins can update everything
*/

export const update_center = async (req: Request, res: Response) => {

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

        const user_id = is_admin && req.query.user
            ? String(req.query.user)
            : auth_user.id

        const center_id = String(req.params.id)

        const { name, address, contact, description } = req.body;

        const [center] = await db
            .select()
            .from(veterinary_center)
            .where(and(eq(veterinary_center.id, center_id), eq(veterinary_center.user_id, user_id)));
        
        if (!center) {
            return res.status(404).json({ message: "You can't update this center, because you're not the owner." });
        }
        

        const update_data: Record<string, any> = {
            name,
            address,
            contact,
            description,
            updated_at: new Date()
        };
        
        const updated_center = await db.update(veterinary_center)
            .set(update_data)
            .where(eq(veterinary_center.id, center_id))
            .returning();

        if (!updated_center.length) {
            return res.status(404).json({ message: "Center not found" });
        }

        // notify that the data has been updated
        res.status(200).json({ message: 'Center updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// Delete center

export const delete_center = async (req: Request, res: Response) => {

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

        const user_id = is_admin && req.query.user
            ? String(req.query.user)
            : auth_user.id

        // take center id
        const center_id = String(req.params.id);

        const [center] = await db
            .select()
            .from(veterinary_center)
            .where(and(eq(veterinary_center.id, center_id), eq(veterinary_center.user_id, user_id)));
        
        if (!center) {
            return res.status(404).json({ message: "You can't delete this center, because you're not the owner." });
        }

        const deleted = await db.delete(veterinary_center).where(eq(veterinary_center, center_id)).returning();

        if (!deleted.length) {
            return res.status(404).json({ message:"center not found" });
        }

        res.status(200).json({ message: "Center deleted successfully" });

        // handle errors
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal server error" });
    }
}

// request to be a veterinarian function

/* 
    Users can submit an application to become veterinarians, providing documentation that will then be reviewed. 
*/
export const create_request = async (req: Request, res: Response) => {
    try {
        // call function to get user data from token
        const auth_user = await get_auth_user(req);

        // extract data 
        const { name, address, contact, description } = req.body;
        const user_id = auth_user.id;

        // avoid duplicate requests
        const [existing] = await db
            .select()
            .from(veterinary_center_requests)
            .where(and(
                eq(veterinary_center_requests.user_id, user_id),
                eq(veterinary_center_requests.status, "pending")
            ));

        if (existing) {
            return res.status(409).json({ message: "You already send a request" });
        }

        // create request
        const [new_request] = await db
            .insert(veterinary_center_requests)
            .values({
                user_id,
                name,
                address,
                contact,
                description,
                status: "pending",
            })
            .returning();

        // notify that the request was sent
        res.status(201).json({ message: "Request sended" });

        // handle errors
    } catch (error) {
        console.error("Error creating request:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// get all pending requests function
/* 
    Admin only!
    Administrators must be able to access requests in order to accept them;
    to do this, the system retrieves all requests with a "pending" status.
*/
export const get_pending_requests = async (req: Request, res: Response) => {
    try {

        // extract all pending requests
        const results = await db
            .select({
                id: veterinary_center_requests.id,
                user_id: veterinary_center_requests.user_id,
                user_name: users.name,
                user_email: users.email,
                name: veterinary_center_requests.name,
                address: veterinary_center_requests.address,
                contact: veterinary_center_requests.contact,
                created_at: veterinary_center_requests.created_at,
            })
            .from(veterinary_center_requests)
            .innerJoin(users, eq(veterinary_center_requests.user_id, users.id))

            // search for pending requests only
            .where(eq(veterinary_center_requests.status, "pending"));

        // return data
        res.status(200).json(results);

        // handle errors
    } catch (error) {
        console.error("Error fetching requests:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// approve request function
/* 
    Admin only!
    Once the request has been identified, the admin can approve it.
*/
export const approve_request = async (req: Request, res: Response) => {
    try {
        // call function to get user data from token
        const auth_user = await get_auth_user(req);

        // extract request id
        const request_id = String(req.params.id);

        // extract message
        const {message} = req.body;

        // extract data
        const [request] = await db
            .select()
            .from(veterinary_center_requests)
            .where(eq(veterinary_center_requests.id, request_id));

        // before approve, verify that it exist
        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }

        // verify that the application status is still pending
        if (request.status !== "pending") {
            return res.status(409).json({ message: "This request was already processed" });
        }

        // search verinary center image
        const [vet_center_image] = await db
            .select({ id: images.id })
            .from(images)
            .where(eq(images.name, "Veterinary center"));

        if (!vet_center_image) {
            return res.status(500).json({ message: "image not found" });
        }

        // create a transaction to executte many operations 

        const result = await db.transaction(async (transaction_db) => {

            // insert veterinary_center
            const [new_vet] = await transaction_db
                .insert(veterinary_center)
                .values({
                    user_id: request.user_id,
                    name: request.name,
                    address: request.address,
                    contact: request.contact,
                    description: request.description,
                    image_id: vet_center_image.id
                })
                .returning();

            // update veterinarian requests to approved
            await transaction_db
                .update(veterinary_center_requests)
                .set({
                    status: "approved",
                    message: message,
                    reviewed_by: auth_user.id,
                    updated_at: new Date(),
                })
                .where(eq(veterinary_center_requests.id, request_id));

        });

        res.status(200).json({ message: "Request approved" });

    } catch (error) {
        console.error("Error approving request:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// reject function
/* 
    Admin only!
    Once the request has been identified, the admin can reject it.
*/
export const reject_request = async (req: Request, res: Response) => {
    try {
        // call function to get user data from token
        const auth_user = await get_auth_user(req);

        // extract request id
        const request_id = String(req.params.id);

        // extract message
        const {message} = req.body;

        // update request status to rejected
        const [updated] = await db
            .update(veterinary_center_requests)
            .set({
                status: "rejected",
                reviewed_by: auth_user.id,
                message: message,
                updated_at: new Date(),
            })
            .where(and(
                eq(veterinary_center_requests.id, request_id),
                eq(veterinary_center_requests.status, "pending")
            ))
            .returning();

        if (!updated) {
            return res.status(404).json({ message: "This request was already processed" });
        }

        res.status(200).json({ message: "rejected request"});

    } catch (error) {
        console.error("Error rejecting request:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// get precessed requests function
/* 
    Once the request has been processed, the user can view the result; to do this, the authenticated user is retrieved
    and requests with a status of "approved" or "rejected" are searched for.
*/ 
export const get_precessed_requests = async (req: Request, res: Response) => {
    try {
        // call function to get user data from token
        const auth_user = await get_auth_user(req);

        // extract all processed requests
        const results = await db
            .select({
                id: veterinary_center.id,
                owner: users.name,
                name: veterinary_center.name,
                address: veterinary_center.address,
                contact: veterinary_center.contact,
                description: veterinary_center.description,
                image_url: images.url,
                message: veterinary_center_requests.message
            })
            .from(veterinary_center_requests)
            .innerJoin(users, eq(veterinary_center_requests.user_id, users.id))

            // use inArray to search for requests approved and rejected
            .where(and(eq(veterinary_center_requests.user_id, auth_user.id), inArray(veterinary_center_requests.status, ["approved", "rejected"])));
        
        if(!results.length){
            return res.status(404).json({ message: "No appointments processed" });
        }

        const array_precessed_requests = results.map(row => ({
            id: row.id,
            owner: row.name,
            name: row.name,
            address: row.address,
            contact: row.contact,
            description: row.address,
            image_url: row.image_url,
            message: row.message
            /*
            created_at: row.created_at,
            updated_at: row.updated_at
            */
        }));

        // return array
        res.status(200).json(array_precessed_requests);

        // handle errors
    } catch (error) {
        console.error("Error fetching requests:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};