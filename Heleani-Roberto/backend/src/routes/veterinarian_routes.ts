//router
import { Router } from "express";

//middleware validations
import { validateBody, validateParams, validateQuery } from '../middleware/validations';

//controller
import {get_all, get_by_name, get_by_id, get_vet_from_center, get_my_profile, create_request, get_pending_requests, approve_request, reject_request, get_precessed_requests} from '../controllers/veterinarian_controller';

// Zod validations
import { create_vetrequest_schema, get_vetrequest_schema, process_vetrequest_schema } from "../zod_schemas/vetrequest_schema";
import { validate_token } from "../middleware/auth_validation";
import { authorize_role } from "../middleware/roles_validation";

const router = Router();

//  get all
router.get('/', validate_token, get_all);

// get my own veterinarian profile (used by the "switch to vet mode" button)
router.get('/me', validate_token, get_my_profile);

// get by name
router.get('/vets_name/:name', validate_token, get_by_name);

// get by id
router.get('/vets_id/:id', validate_token, validateParams(get_vetrequest_schema), get_by_id);

// get all veterinarians from a center
router.get('/vets_from_center/:id', validate_token, validateParams(get_vetrequest_schema), get_vet_from_center);

// create request
router.post('/requests', validate_token, validateBody(create_vetrequest_schema), create_request);

// get all pending requests. Admin only!
router.get('/requests', validate_token, authorize_role(["admin"]), get_pending_requests);

// accept request. Admin only!
router.put('/:id/approve', validate_token, authorize_role(["admin"]), validateParams(get_vetrequest_schema), validateBody(process_vetrequest_schema), approve_request);

// accept request. Admin only!
router.put('/:id/reject', validate_token, authorize_role(["admin"]), validateParams(get_vetrequest_schema), validateBody(process_vetrequest_schema), reject_request);

// get processed requests
router.get('/processed', validate_token, get_precessed_requests);

export default router;