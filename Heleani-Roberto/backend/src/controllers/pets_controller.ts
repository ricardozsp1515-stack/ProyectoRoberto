// imports
import { Request, Response } from "express";
import { db } from '../db/connection';
import { pets } from "../db/schema/pets";
import { users } from "../db/schema/users";
import { user_roles } from "../db/schema/user_roles";
import { eq, and, ilike } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { pet_types } from "../db/schema/pet_types";
import { images } from "../db/schema/images";
import { get_auth_user } from "../middleware/auth_validation";


// get user pets

/* 
    In user profile, all pets supposed to be visible, for that this function will take user data with the auth token and search for
    all pets of provided user

    Admin or veterinarian only!
    Users only have access to their own pets; however, administrators and veterinarians can access all of any user's pets.
*/

export const get_user_pets = async (req: Request, res: Response) => {
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
        const is_adorvet = user_data?.role_name === "admin" || user_data?.role_name === "Veterinarian";

        /* 
            If the user is an administrator or veterinarian and the `id` parameter exists,
            pets belonging to the user whose ID matches that parameter will be displayed;
            otherwise, pets belonging to the user whose ID matches the authenticated user's ID will be displayed
        */
        const user_id = is_adorvet && req.params.id
            ? String(req.params.id)
            : auth_user.id

        // load pets data
        const user_pets = await db
            .select({
                id: pets.id,
                user_id: pets.user_id,
                //pet_type_id: pets.pet_type_id,
                pet_type_name: pet_types.name,
                name: pets.name,
                breed: pets.breed,
                age: pets.age,
                image_url: images.url
                /*
                created_at: pets.created_at,
                updated_at: pets.updated_at
                */
            })
            .from(pets)
            .innerJoin(pet_types, eq(pets.pet_type_id, pet_types.id))
            .innerJoin(images, eq(pets.image_id, images.id))
            .where(eq(pets.user_id, user_id))
        
        //In the event that a user has not yet registered pets
        if (!user_pets.length) {
            return res.status(404).json({ message: "No pets registered" });
        }

        // If you request for more than one user, the respone will duplicate, for avoid that this const specify only one object for one pet
        const unique_pets = user_pets.filter(
            (row, index, self) => index === self.findIndex(r => r.id === row.id)
        );

        // convert data to array to use that in front
        const array_pets = unique_pets.map(row => ({
            id: row.id,
            name: row.name,
            breed: row.breed,
            age: row.age,
            pet_type_name: row.pet_type_name,
            image_url: row.image_url
        }));

        // return array
        res.status(200).json({
            message: "Get user pets!",
            pets: array_pets,
        });

        // handle errors
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal server error" });
    }
};

// create pet function
export const create_pet = async (req: Request, res: Response) => {

    try {
        // call function to get user data from token
        const auth_user = await get_auth_user(req);

        // take new pet data
        const { name, breed, age, pet_type_id } = req.body;

        // take auth_user id to search for it pets
        const user_id = auth_user.id;

        //search for corresponding image
        const [matched_image] = await db
            .select({ image_id: images.id })
            .from(pet_types)
            .innerJoin(images, eq(images.name, pet_types.name))
            .where(eq(pet_types.id, pet_type_id));

        const image_id = matched_image?.image_id ?? null;

        // insert data in the DB
        const [new_pet] = await db

            .insert(pets)
            .values({
                name: name,
                breed: breed,
                age: age,
                user_id: user_id,
                pet_type_id: pet_type_id,
                image_id: image_id
            })
            .returning({
                id: pets.id,
                name: pets.name,
                breed: pets.breed,
                age: pets.age,
                user_id: pets.user_id,
                pet_type_id: pets.pet_type_id,
                image_id: pets.image_id
            });

        // Notify that the pet was succesfully created
        res.status(201).json({
            message: "Pet created!"
        });

        // handle errors
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal server error" });
    }
};

// get pet by id

/* 
    This feature will allow users to access information about one of their pets.

    Admin and Veterinarian only!
    Regular users will only be able to access information about their own pets, but 
    veterinarians and admins will be able to access any user's pets through query parameters.
*/
export const get_pet_by_id = async (req: Request, res: Response) => {

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
        const is_adorvet = user_data?.role_name === "admin" || user_data?.role_name === "Veterinarian";

        /* 
            If the user is an administrator or veterinarian and the `user` query parameter exists,
            pets belonging to the user whose ID matches that parameter will be displayed;
            otherwise, pets belonging to the user whose ID matches the authenticated user's ID will be displayed.
        */
        const user_id = is_adorvet && req.query.user
            ? String(req.query.user)
            : auth_user.id

        // take pet id
        const pet_id = String(req.params.id);

        /* 
            Verify that the pet exists and that the authentication user ID matches the pets user ID.
            This prevents that pets of other users appears in wrong profile
        */
        // alias de la tabla images para traer la foto de perfil del dueño,
        // sin chocar con el join que ya trae la foto de la mascota
        const owner_images = alias(images, "owner_images");

        const results = await db
            .select({
                id: pets.id,
                user_id: pets.user_id,
                //pet_type_id: pets.pet_type_id,
                pet_type_name: pet_types.name,
                name: pets.name,
                breed: pets.breed,
                age: pets.age,
                image_url: images.url,
                created_at: pets.created_at,
                // datos del dueño, para mostrarlos en la seccion "Dueño(a)" del perfil de la mascota
                owner_name: users.name,
                owner_email: users.email,
                owner_image_url: owner_images.url
            })
            .from(pets)
            .innerJoin(pet_types, eq(pets.pet_type_id, pet_types.id))
            .innerJoin(images, eq(pets.image_id, images.id))
            .innerJoin(users, eq(pets.user_id, users.id))
            .innerJoin(owner_images, eq(users.image_id, owner_images.id))
            .where(and(eq(pets.id, pet_id), eq(pets.user_id, user_id)));

        // If the user ID and the pet's user ID do not match, an error will be generated
        if (!results.length) {
            return res.status(404).json({ message: "Pet in not registered" });
        }

        const pet = results[0];

        // return array
        res.status(200).json(pet);

        // handle errors
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal server error" });
    }

}

// get pet by name

/* 
    generally users dont register more than 3 pets, but for some reason, the user has to many
    pets, their can be searched with name
*/

export const get_pet_by_name = async (req: Request, res: Response) => {

    try {
        // call function to get user data from token
        const auth_user = await get_auth_user(req);

        // take auth_user id to search for it pets
        const user_id = auth_user.id;

        // take pet id
        const pet_name = String(req.params.name);

        /* 
            Verify that the pet exists and that the authentication user ID matches the pets user ID.
            This prevents that pets of other users appears in wrong profile
        */
        const results = await db
            .select({
                id: pets.id,
                user_id: pets.user_id,
                //pet_type_id: pets.pet_type_id,
                pet_type_name: pet_types.name,
                name: pets.name,
                breed: pets.breed,
                age: pets.age,
                image_url: images.url
                /*
                created_at: pets.created_at,
                updated_at: pets.updated_at
                */
            })
            .from(pets)
            .innerJoin(pet_types, eq(pets.pet_type_id, pet_types.id))
            .innerJoin(images, eq(pets.image_id, images.id))
            .where(and(ilike(pets.name, `%${pet_name}%`), eq(pets.user_id, user_id)));

        // If the user ID and the pet's user ID do not match, an error will be generated
        if (!results.length) {
            return res.status(404).json({ message: "Not pet with this name" });
        }

        // convert db data in a array
        const array_pets = results.map(row => ({
            id: row.id,
            name: row.name,
            breed: row.breed,
            age: row.age,
            pet_type_name: row.pet_type_name,
            image_url: row.image_url
        }));

        // return array
        res.status(200).json(array_pets);

        // handle errors
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal server error" });
    }

}

// update pet function

/* 
    The user will enter updated pet data and this function will insert the data into
    corresponding pets record, to do this, the users ID is extracted from the token to 
    search for their pets. Then the pets id is obtained from params, the request body is 
    retrieved to obtain the new data, and this data is inserted into the corresponding pet's record

    Admin only!
    Users can only update their own pets, but administrators can update any user's pets.
*/
export const update_pet = async (req: Request, res: Response) => {

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
            pets belonging to the user whose ID matches that parameter can be modified;
            otherwise, only pets belonging to the user whose ID matches the authenticated user's ID can be modified.
        */
        const user_id = is_admin && req.query.user
            ? String(req.query.user)
            : auth_user.id

        // take pet id
        const pet_id = String(req.params.id);

        // take updated pet data
        const { name, breed, age, pet_type_id } = req.body;

        // create an object with updated data
        const update_data: Record<string, any> = {
            name,
            breed,
            age,
            pet_type_id,
            updated_at: new Date()
        };

        /* 
            Verify that the pet exists and that the authentication user ID matches the pets user ID.
            This prevents a user who knows other users pet IDs from updating their data
        */
        const [pet] = await db
            .select()
            .from(pets)
            .where(and(eq(pets.id, pet_id), eq(pets.user_id, user_id)));

        // If the user ID and the pet's user ID do not match, an error will be generated
        if (!pet) {
            return res.status(404).json({ message: "The pet is not registered" });
        }

        // insert new data in corresponding pet
        const updated_pet = await db.update(pets)
            .set(update_data)

            // search for pet id
            .where(eq(pets.id, pet_id))
            .returning();

        // this condition serves to prevent internal errors if, for some reason, the pets id matches with users id but does not exist.
        if (!updated_pet.length) {
            return res.status(404).json({ message: "Pet not found" });
        }

        // notify that the data has been updated
        res.status(200).json({ message: 'Pet updated' });

        // handle errors
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal server error" });
    }
}

// delete pet function

/* 
    The user will for some reason may want to erase a pet from their profile, for that
    extract user id from the token, and pet id from params, search for pet with same id
    and remove it from db

    Admin only!
    Users can only delete pets that belong to them, but admins can delete any user's pets.
*/
export const delete_pet = async (req: Request, res: Response) => {

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
            pets belonging to the user whose ID matches that parameter can be deleted;
            otherwise, only pets belonging to the user whose ID matches the authenticated user's ID can be deleted.
        */
        const user_id = is_admin && req.query.user
            ? String(req.query.user)
            : auth_user.id

        // take pet id
        const pet_id = String(req.params.id);

        /* 
            Verify that the pet exists and that the authentication user ID matches the pets user ID.
            This prevents a user who knows other users pet IDs from deleting their data
        */
        const [pet] = await db
            .select()
            .from(pets)
            .where(and(eq(pets.id, pet_id), eq(pets.user_id, user_id)));

        // If the user ID and the pet's user ID do not match, an error will be generated
        if (!pet) {
            return res.status(404).json({ message: "The pet is not registered" });
        }

        const deleted = await db.delete(pets).where(eq(pets.id, pet_id)).returning();

        if (!deleted.length) {
            return res.status(404).json({ message: "Pet not found" });
        }

        res.status(200).json({ message: "Pet deleted successfully" });

        // handle errors
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal server error" });
    }
}