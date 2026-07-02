import { Request, Response } from "express";
import { eq, and, ilike, inArray } from "drizzle-orm";
import { db } from "../db/connection";
import { users } from "../db/schema/users";
import { user_roles } from "../db/schema/user_roles";
import { veterinarian } from "../db/schema/veterinarian";
import { veterinarian_requests } from "../db/schema/veterinarian_requests";
import { images } from "../db/schema/images";
import { get_auth_user } from "../middleware/auth_validation";

// get all veterinarians function
/* 
    On the homepage, veterinarians are supposed to be visible; to achieve this
    a database query is performed to extract information on all veterinarians.
*/
export const get_all = async (req: Request, res: Response) => {
    try {
        // extract data
        const results = await db
            .select({
                id: veterinarian.id,
                license: veterinarian.license,
                specialty: veterinarian.specialty,
                veterinary_center_id: veterinarian.veterinary_center_id,
                name: users.name,
                image_url: images.url,
            })
            .from(veterinarian)
            // join to users to extract user data
            .innerJoin(users, eq(veterinarian.user_id, users.id))
            .innerJoin(images, eq(users.image_id, images.id))

        //If there is no registered veterinarian, handle the error
        if (!results.length) {
            return res.status(404).json({ message: "No veterinarians registered" });
        }
        // convert data into array    
        const array_vets = results.map(row => ({
            id: row.id,
            license: row.license,
            specialty: row.specialty,
            veterinary_center_id: row.veterinary_center_id,
            name: row.name,
            image_url: row.image_url,

        }));

        // return array
        res.status(200).json(array_vets);

        // handle errors
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// get by name function
/* 
    Within the app, users will be able to search for veterinarians by name to find them more easily.
    to do this, the veterinarian's name is retrieved and searched for in the database.
*/
export const get_by_name = async (req: Request, res: Response) => {

    try {
        // take vet name
        const vet_name = String(req.params.name);

        // extract data
        const results = await db
            .select({
                id: veterinarian.id,
                license: veterinarian.license,
                specialty: veterinarian.specialty,
                veterinary_center_id: veterinarian.veterinary_center_id,
                name: users.name,
                image_url: images.url,
            })
            .from(veterinarian)
            // join to users to extract user data
            .innerJoin(users, eq(veterinarian.user_id, users.id))
            .innerJoin(images, eq(users.image_id, images.id))
            .where((ilike(users.name, `%${vet_name}%`)));

        if (!results.length) {
            return res.status(404).json({ message: "No veterinarians with this name" });
        }

        // convert data into array    
        const array_vets = results.map(row => ({
            id: row.id,
            license: row.license,
            specialty: row.specialty,
            veterinary_center_id: row.veterinary_center_id,
            name: row.name,
            image_url: row.image_url,

        }));

        // return array
        res.status(200).json(array_vets);

        // handle errors
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal server error" });
    }

}

// get by id function
/* 
    Within the app, users will be able to access a veterinarian's profile, and their information must be visible on the page;
    to achieve this, the veterinarian's ID is retrieved and used to look up their details.
*/
export const get_by_id = async (req: Request, res: Response) => {

    try {

        // take vet id
        const vet_id = String(req.params.id);

        // extract data
        const results = await db
            .select({
                id: veterinarian.id,
                license: veterinarian.license,
                specialty: veterinarian.specialty,
                veterinary_center_id: veterinarian.veterinary_center_id,
                name: users.name,
                image_url: images.url,
                created_at: veterinarian.created_at,
            })
            .from(veterinarian)
            // join to users to extract user data
            .innerJoin(users, eq(veterinarian.user_id, users.id))
            .innerJoin(images, eq(users.image_id, images.id))
            .where(eq(veterinarian.id, vet_id))

        //If there is no registered veterinarian with this id, handle the error
        if (!results.length) {
            return res.status(404).json({ message: "Veterinarian not found" });
        }
        // convert data into an object    
        const vet = results[0];

        // return vet
        res.status(200).json(vet);

        // handle errors
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal server error" });
    }

}

// Get all veterinarian's from a veterinary center
/* 
    Veterinarians associated with a center should be visible on the veterinary center's page;
    therefore, this function searches through the veterinarians to display those belonging to that center.
*/
export const get_vet_from_center = async (req: Request, res: Response) => {
    try {

        // extract id from params
        const center_id = String(req.params.id);

        // Fetch veterinarians data
        const results = await db
            .select({
                id: veterinarian.id,
                license: veterinarian.license,
                specialty: veterinarian.specialty,
                veterinary_center_id: veterinarian.veterinary_center_id,
                name: users.name,
                image_url: images.url
            })
            .from(veterinarian)
            .where(eq(veterinarian.veterinary_center_id, center_id));
        
        // convert data into array
        const array_vets = results.map(row => ({
                id: row.id,
                license: row.license,
                specialty: row.specialty,
                veterinary_center_id: row.veterinary_center_id,
                name: row.name,
                image_url: row.image_url
        }));

        // Return array
        res.status(200).json(array_vets);

        // handle errors
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// get my own veterinarian profile function
/* 
    Used by the "switch to vet mode" button: takes the user id from the token
    and looks up their own veterinarian record, so the frontend knows which
    veterinarian.id to navigate to (it's not the same as the user id).
*/
export const get_my_profile = async (req: Request, res: Response) => {
    try {
        // call function to get user data from token
        const auth_user = await get_auth_user(req);

        const results = await db
            .select({
                id: veterinarian.id,
                license: veterinarian.license,
                specialty: veterinarian.specialty,
                veterinary_center_id: veterinarian.veterinary_center_id,
            })
            .from(veterinarian)
            .where(eq(veterinarian.user_id, auth_user.id));

        // If the user is not a veterinarian, they don't have a record here
        if (!results.length) {
            return res.status(404).json({ message: "You are not a registered veterinarian" });
        }

        res.status(200).json(results[0]);

        // handle errors
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// request to be a veterinarian function
/* 
    Users can submit an application to become veterinarians, providing documentation that will then be reviewed. 
*/
export const create_request = async (req: Request, res: Response) => {
    try {
        // call function to get user data from token
        const auth_user = await get_auth_user(req);

        // extract data 
        const { veterinary_center_id, license, specialty } = req.body;
        const user_id = auth_user.id;

        // avoid duplicate requests
        const [existing] = await db
            .select()
            .from(veterinarian_requests)
            .where(and(
                eq(veterinarian_requests.user_id, user_id),
                eq(veterinarian_requests.status, "pending")
            ));

        if (existing) {
            return res.status(409).json({ message: "You already send a request" });
        }

        // create request
        const [new_request] = await db
            .insert(veterinarian_requests)
            .values({
                user_id,
                veterinary_center_id,
                license,
                specialty,
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
                id: veterinarian_requests.id,
                user_id: veterinarian_requests.user_id,
                user_name: users.name,
                user_email: users.email,
                veterinary_center_id: veterinarian_requests.veterinary_center_id,
                license: veterinarian_requests.license,
                specialty: veterinarian_requests.specialty,
                created_at: veterinarian_requests.created_at
            })
            .from(veterinarian_requests)
            .innerJoin(users, eq(veterinarian_requests.user_id, users.id))

            // search for pending requests only
            .where(eq(veterinarian_requests.status, "pending"));

            if(!results.length){
                return res.status(404).json({message: "No pending requests"})
            }

        // convert data into array    
        const array_requests = results.map(row => ({
            id: row.id,
            user_id: row.user_id,
            user_name: row.user_name,
            user_email: row.user_email,
            veterinary_center_id: row.veterinary_center_id,
            license: row.license,
            specialty: row.specialty,
            created_at: row.created_at
        }));

        // return array
        res.status(200).json(array_requests);

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
            .from(veterinarian_requests)
            .where(eq(veterinarian_requests.id, request_id));

        // before approve, verify that it exist
        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }

        // verify that the application status is still pending
        if (request.status !== "pending") {
            return res.status(409).json({ message: "This request was already processed" });
        }

        // search verinarian role
        const [vet_role] = await db
            .select({ id: user_roles.id })
            .from(user_roles)
            .where(eq(user_roles.name, "Veterinarian"));

        if (!vet_role) {
            return res.status(500).json({ message: "Veterinarian rol was not found" });
        }

        // create a transaction to executte many operations 

        const result = await db.transaction(async (transaction_db) => {

            // update user role with vet_role
            await transaction_db
                .update(users)
                .set({ role_id: vet_role.id, updated_at: new Date() })
                .where(eq(users.id, request.user_id));

            // insert user in veterinarian
            const [new_vet] = await transaction_db
                .insert(veterinarian)
                .values({
                    user_id: request.user_id,
                    veterinary_center_id: request.veterinary_center_id,
                    license: request.license,
                    specialty: request.specialty,
                })
                .returning();

            // update veterinarian requests to approved
            await transaction_db
                .update(veterinarian_requests)
                .set({
                    status: "approved",
                    reviewed_by: auth_user.id,
                    message: message,
                    updated_at: new Date(),
                })
                .where(eq(veterinarian_requests.id, request_id));

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
            .update(veterinarian_requests)
            .set({
                status: "rejected",
                reviewed_by: auth_user.id,
                message: message,
                updated_at: new Date(),
            })
            .where(and(
                eq(veterinarian_requests.id, request_id),
                eq(veterinarian_requests.status, "pending")
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
                id: veterinarian_requests.id,
                user_id: veterinarian_requests.user_id,
                user_name: users.name,
                user_email: users.email,
                veterinary_center_id: veterinarian_requests.veterinary_center_id,
                license: veterinarian_requests.license,
                specialty: veterinarian_requests.specialty,
                message: veterinarian_requests.message,
                status: veterinarian_requests.status,
                created_at: veterinarian_requests.created_at
            })
            .from(veterinarian_requests)
            .innerJoin(users, eq(veterinarian_requests.user_id, users.id))

            // use inArray to search for requests approved and rejected
            .where(and(eq(veterinarian_requests.user_id, auth_user.id),inArray(veterinarian_requests.status, ["approved", "rejected"])));
        
        // handle errors
        if(!results.length){
            return res.status(404).json({ message: "No appointments processed" });
        }

        // convert data into array    
        const array_requests = results.map(row => ({
            id: row.id,
            user_id: row.user_id,
            user_name: row.user_name,
            user_email: row.user_email,
            veterinary_center_id: row.veterinary_center_id,
            license: row.license,
            specialty: row.specialty,
            message: row.message,
            status: row.status,
            created_at: row.created_at
        }));

        // return array
        res.status(200).json(array_requests);

        // handle errors
    } catch (error) {
        console.error("Error fetching requests:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};