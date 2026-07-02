//router
import { Router } from "express";

//middleware validations
import { validateBody, validateParams, validateQuery } from '../middleware/validations';

//controller
import { create_comment, get_vet_comments, get_center_comments, update_comment, delete_comment } from "../controllers/comments_controller";

// Zod validations
import { create_comment_schema, update_comment_schema, get_comment_schema } from "../zod_schemas/comment_schema";
import { validate_token } from "../middleware/auth_validation";


const router = Router();
// create comments
router.post("/", validate_token, validateBody(create_comment_schema), create_comment);

// get veterinarians comments
router.get("/vet/:id", validate_token, validateParams(get_comment_schema), get_vet_comments);

// get center comments
router.get("/center/:id", validate_token, validateParams(get_comment_schema), get_center_comments);

// update comments. Admin only! Admin can add query param ?user to update any comment
router.put("/:id", validate_token, validateParams(get_comment_schema), validateBody(update_comment_schema), update_comment);

// delete comments. Admin only! Admin can add query param ?user to delete any comment
router.delete("/:id", validate_token, validateParams(get_comment_schema), delete_comment);

export default router;