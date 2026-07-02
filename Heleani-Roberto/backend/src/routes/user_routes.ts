// imports

//router
import { Router } from "express";

//middleware validations
import { validateBody, validateParams, validateQuery } from '../middleware/validations';
import { validate_token } from "../middleware/auth_validation";
// controller
import {get_all, get_by_id, update_user, delete_user} from '../controllers/user_controller'

// Zod validations

import { get_user_schema, get_user_by_name_schema, update_user_schema } from "../zod_schemas/user_schemas";
import { authorize_role } from "../middleware/roles_validation";

// create router
const router = Router();

// Get all users. Admin only!

router.get("/", validate_token, authorize_role(["admin"]), get_all);

// Get user by id
router.get("/get_user", validate_token, get_by_id);
// Get user by id. Admin only!
router.get("/get_user/:id", validate_token, authorize_role(["admin"]), validateParams(get_user_schema), get_by_id);


/* Not used

// Get user by name
router.get("/name/:name", validate_token, validateParams(get_user_by_name_schema), get_by_name);

*/

// update users
router.put("/", validate_token, validateBody(update_user_schema), update_user);
// update users. Admin only!
router.put("/:id", validate_token, authorize_role(["admin"]), validateParams(get_user_schema), validateBody(update_user_schema), update_user);

// Delete user
router.delete("/", validate_token, delete_user);
// Delete user. Admin only!
router.delete("/:id", validate_token, authorize_role(["admin"]), validateParams(get_user_schema), delete_user);

export default router;