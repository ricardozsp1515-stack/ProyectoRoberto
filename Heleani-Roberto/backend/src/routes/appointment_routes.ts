//router
import { Router } from "express";

//middleware validations
import { validateBody, validateParams, validateQuery } from '../middleware/validations';

//controller
import {create_appointment, get_user_pet_appointments, get_vet_appointments, update_appointment, delete_appointment} from '../controllers/appointments_controller';

// Zod validations
import { create_appointment_schema, update_appointment_schema, get_appointment_schema } from "../zod_schemas/appointment_schema";
import { validate_token } from "../middleware/auth_validation";
import { authorize_role } from "../middleware/roles_validation";

const router = Router();

// create appointment
router.post('/', validate_token, validateBody(create_appointment_schema), create_appointment);

// get user pet appointments
router.get('/user_pet/:id', validate_token, get_user_pet_appointments);

// get vet appointments. Veterinarian or Admin only!
router.get('/vet', validate_token, authorize_role(["admin", "Veterinarian"]), get_vet_appointments);

// update appointment. Veterinarian or Admin only!
router.put('/:id', validate_token, authorize_role(["admin", "Veterinarian"]), validateParams(get_appointment_schema), validateBody(update_appointment_schema), update_appointment);

// delete appoitment
router.delete('/:id', validate_token, validateParams(get_appointment_schema), delete_appointment)

export default router;