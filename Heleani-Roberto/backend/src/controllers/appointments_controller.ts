import { Request, Response } from "express";
import { eq, and } from "drizzle-orm";
import { db } from "../db/connection";
import { appointment } from "../db/schema/appointment";
import { users } from "../db/schema/users";
import { user_roles } from "../db/schema/user_roles";
import { veterinarian } from "../db/schema/veterinarian";
import { get_auth_user } from "../middleware/auth_validation";
import { pets } from "../db/schema/pets";

// create appointment

/* 
    Users will be able to schedule appointments for their pets with veterinarians; 
    the system will look up the user ID, the pet, and the veterinarian to establish the connection.
*/
export const create_appointment = async (req: Request, res: Response) => {
    try {

        // get auth user
        const auth_user = await get_auth_user(req);

        // extract data
        const { veterinarian_id, pet_id, date } = req.body;

        // insert data
        const [new_appointment] = await db
            .insert(appointment)
            .values({
                user_id: auth_user.id,
                veterinarian_id,
                pet_id,
                date: new Date(date),
                status: "pending",
            })
            .returning();

        // Notify that the appointment has been scheduled.
        res.status(201).json({ message: "Appointment scheduled" });

        // handle errors
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// get a user's pet's appointments

/* 
    Appointments—along with their associated diagnoses or status—should be visible on the pet's profile;
    therefore, this function searches through the appointments to find those that match the pet's ID and returns them.
*/
export const get_user_pet_appointments = async (req: Request, res: Response) => {
    try {

        // call function to get user data from token
        const auth_user = await get_auth_user(req);

        //Validate the user's role 

        const [user_data] = await db
            .select({ role_name: user_roles.name })
            .from(users)
            .innerJoin(user_roles, eq(users.role_id, user_roles.id))
            .where(eq(users.id, auth_user.id));

        // Verify that the user is an administrator or veterinarian.
        const is_adorvet = user_data?.role_name === "admin" || "Veterinarian";

        /* 
            If the user is an administrator or a veterinarian and the `user` query parameter is present,
            appointments for the pet belonging to the user whose ID matches that parameter will be displayed;
            otherwise, only appointments for a pet belonging to the authenticated user will be displayed.
        */
        const user_id = is_adorvet && req.query.user
            ? String(req.query.user)
            : auth_user.id

        // take pet id
        const pet_id = String(req.params.id);

        // search pet_id in auth_user pets
        const [pet] = await db
            .select()
            .from(pets)
            .where(and(eq(pets.id, pet_id), eq(pets.user_id, user_id)));

        // If the user ID and the pet's user ID do not match, an error will be generated
        if (!pet) {
            return res.status(404).json({ message: "Pet in not registered" });
        }

        // search for pet appointments
        const results = await db
            .select()
            .from(appointment)
            .where(eq(appointment.pet_id, pet_id));

        // If no appointments are found, the error is handled.
        if (!results.length) {
            return res.status(404).json({ message: "There are no appointments scheduled for that pet." });
        }

        // Return appointments
        res.status(200).json(results);
    
    // handle errors
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};



// Get appointments of a veterinarian

/* 
    Veterinarians can view all appointments that are still in "pending"
    status to better manage their appointments.
*/
export const get_vet_appointments = async (req: Request, res: Response) => {
    try {

        // get auth user
        const auth_user = await get_auth_user(req);

        //Verify the user's role 
        const [user_data] = await db
            .select({ role_name: user_roles.name })
            .from(users)
            .innerJoin(user_roles, eq(users.role_id, user_roles.id))
            .where(eq(users.id, auth_user.id));

        // Validate that the user is an admin.
        const is_admin = user_data?.role_name === "admin";

        /* 
            If the user is an admin and the query parameter exists, appointments matching the query ID will be displayed;
            however, if the user is a veterinarian, only appointments matching the authenticated user's ID will be shown.
        */
        const user_id = is_admin && req.query.user
            ? String(req.query.user)
            : auth_user.id

        // Serach veterinarian
        const [vet] = await db
            .select()
            .from(veterinarian)
            .where(eq(veterinarian.user_id, user_id));

        // If the veterinarian's profile is not found, handle the error.
        if (!vet) {
            return res.status(404).json({ message: "Veterinarian not found" });
        }

        /* 
            Search for appointments scheduled with that veterinarian
            specifically those with a "pending" status. 
        */
        const results = await db
            .select()
            .from(appointment)
            .where(and(eq(appointment.veterinarian_id, vet.id), eq(appointment.status, "pending")));

        // return all appointments
        res.status(200).json(results);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// update appointment

/* 
    Once the appointment has taken place, the veterinarian
    can update it to change its status to "completed" and add a diagnosis.
*/
export const update_appointment = async (req: Request, res: Response) => {
    try {

        // get auth user
        const auth_user = await get_auth_user(req);

        // extract appointment_id
        const appointment_id = String(req.params.id);

        // extract diagnosis
        const { diagnosis } = req.body;

        // update with diagnosis and status
        const [updated] = await db
            .update(appointment)
            .set({ diagnosis, status:'completed', updated_at: new Date() })
            .where(eq(appointment.id, appointment_id))
            .returning();
        
        // If the appointment is not found, handle the error.
        if (!updated) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        // Notify that the data has been updated
        res.status(200).json({ message: "Updated appointment"});
    
    // handle errors
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};


// Delete appointment (Cancel appointment)

/* 
    Users may wish to cancel an appointment; this function handles that by first verifying that the user ID matches the `user_id`.

    Admin Only! Regular users can only cancel their own appointments, whereas admins can cancel any appointment.
*/
export const delete_appointment = async (req: Request, res: Response) => {
    try {

        // get auth user
        const auth_user = await get_auth_user(req);

        // get appoitment id
        const appointment_id = String(req.params.id);

        //Verify the user's role 
        const [user_data] = await db
            .select({ role_name: user_roles.name })
            .from(users)
            .innerJoin(user_roles, eq(users.role_id, user_roles.id))
            .where(eq(users.id, auth_user.id));

        // Validate that the user is an admin.
        const is_admin = user_data?.role_name === "admin";

        /* 
            If the user is an administrator and the `user` query parameter exists,
            appointments belonging to the user whose ID matches that parameter can be deleted;
            otherwise, only appoitments belonging to the user whose ID matches the authenticated user's ID can be deleted.
        */
        const user_id = is_admin && req.query.user
            ? String(req.query.user)
            : auth_user.id

        /* 
            Verify that the appointment exists and that the authentication user ID matches the appointment user ID.
            This prevents a user who knows other users appointment IDs from deleting their data
        */
        const [search_appointment] = await db
            .select()
            .from(appointment)
            .where(and(eq(appointment.id, appointment_id), eq(appointment.user_id, user_id)));

        // If the user ID and the pet's user ID do not match, an error will be generated
        if (!search_appointment) {
            return res.status(404).json({ message: "The appointment is not registered" });
        }

        // Delete appoitment
        await db.delete(appointment).where(eq(appointment.id, appointment_id));

        // Notify that the appoitment deleted
        res.status(200).json({ message: "Cita cancelada" });
    
    // handle errors
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};