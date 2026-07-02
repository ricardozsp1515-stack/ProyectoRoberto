// imports

//router
import { Router } from "express";

// middleware
import { validate_token } from "../middleware/auth_validation";

//controller
import { get_all_pet_types } from "../controllers/pet_types_controller";

const router = Router();

// get all pet types (usado para llenar selects/dropdowns en el frontend)
router.get("/", validate_token, get_all_pet_types);

export default router;