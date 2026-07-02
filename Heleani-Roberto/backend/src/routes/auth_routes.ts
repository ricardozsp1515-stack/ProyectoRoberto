//router
import { Router } from "express";

//middleware validations
import { validateBody } from '../middleware/validations';

//controller
import {register, login} from '../controllers/auth_controller';

// Zod validations
import { create_user_schema, login_user_schema } from "../zod_schemas/user_schemas";

const router = Router();

// register users
router.post('/register', validateBody(create_user_schema), register);

// login user
router.post('/login', validateBody(login_user_schema), login);

export default router;