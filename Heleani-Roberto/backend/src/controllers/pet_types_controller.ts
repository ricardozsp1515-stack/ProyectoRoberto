// imports
import { Request, Response } from "express";
import { db } from "../db/connection";
import { pet_types } from "../db/schema/pet_types";
import { asc } from "drizzle-orm";

// get all pet types

/*
    El frontend necesita esta lista para poblar el selector de "especie"
    al crear o editar una mascota, ya que el backend requiere un pet_type_id
    (uuid) valido y no un texto libre.
*/

export const get_all_pet_types = async (req: Request, res: Response) => {
    try {
        const results = await db
            .select({
                id: pet_types.id,
                name: pet_types.name
            })
            .from(pet_types)
            .orderBy(asc(pet_types.name));

        res.status(200).json(results);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};