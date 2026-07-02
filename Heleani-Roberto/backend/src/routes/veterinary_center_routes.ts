//router
import { Router } from "express";

//middleware validations
import { validateBody, validateParams, validateQuery } from '../middleware/validations';

//controller
import {get_all, get_by_name, get_by_id, get_my_center, update_center, delete_center, create_request, get_pending_requests, approve_request, reject_request, get_precessed_requests} from '../controllers/veterinary_center_controller';

// Zod validations
import { create_center_schema, update_center_schema, get_center_schema } from "../zod_schemas/center_schema";
import { validate_token } from "../middleware/auth_validation";
import { authorize_role } from "../middleware/roles_validation";

const router = Router();

//  get all
router.get('/', validate_token, get_all);

// get my own veterinary center (used after a request gets approved, so the
// owner can find and manage their new clinic)
router.get('/me', validate_token, get_my_center);

// get by name
router.get('/center_name/:name', validate_token, get_by_name);

// get by id
router.get('/center_id/:id', validate_token, validateParams(get_center_schema), get_by_id);

//update center
router.put('/:id', validate_token, validateParams(get_center_schema), validateBody(update_center_schema), update_center);

//delete center
router.delete('/:id', validate_token, validateParams(get_center_schema), delete_center);

// create request
router.post('/requests', validate_token, validateBody(create_center_schema), create_request);

// get all pending requests. Admin only!
router.get('/requests', validate_token, authorize_role(["admin"]), get_pending_requests);

// accept request. Admin only!
router.put('/:id/approve', validate_token, authorize_role(["admin"]), validateParams(get_center_schema), approve_request);

// accept request. Admin only!
router.put('/:id/reject', validate_token, authorize_role(["admin"]), validateParams(get_center_schema), reject_request);

// get processed requests
router.get('/processed', validate_token, get_precessed_requests);

export default router;