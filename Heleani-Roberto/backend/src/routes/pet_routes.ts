// imports

import { Router } from "express";
import { get_user_pets, get_pet_by_id, create_pet, get_pet_by_name, update_pet, delete_pet} from "../controllers/pets_controller";
import { validate_token } from "../middleware/auth_validation";
import { validateBody, validateParams, validateQuery} from "../middleware/validations";
import { create_pet_schema, update_pet_schema, get_pet_schema, get_pet_by_name_schema} from "../zod_schemas/pet_schemas";
import { get_user_schema } from "../zod_schemas/user_schemas";
import { authorize_role } from "../middleware/roles_validation";

const router = Router();

// get all user pets
router.get("/", validate_token, get_user_pets);

// get all user pets. Admin and Veterinarian only!
router.get("/:id", validate_token, authorize_role(["admin", "Veterinarian"]), validateParams(get_user_schema), get_user_pets);

// get pet by id
router.get('/pet/:id', validate_token, validateParams(get_pet_schema), get_pet_by_id )

// post new pet
router.post("/", validate_token, validateBody(create_pet_schema), create_pet);

// get pets by name
router.get("/name/:name", validate_token, validateParams(get_pet_by_name_schema), get_pet_by_name);

// update pets
// Admin only! Query parameter pet.id?user=user.id
router.put("/:id", validate_token, validateParams(get_pet_schema), validateBody(update_pet_schema), update_pet);

// delete pets
// Admin only! Query parameter pet.id?user=user.id
router.delete("/:id", validate_token, validateParams(get_pet_schema), delete_pet);

export default router;