import { Router } from "express";
import { validate } from "../../common/middleware/validate.middleware.js";
import {
  mongoIdParams,
  paginationQuery,
} from "../../common/validators/common.validator.js";
import { createUserSchema, loginUserSchema } from "./user.validator.js";
import { authenticate } from "../../common/middleware/auth.middleware.js";
import { getUserById, loginUser, registerUser } from "./user.controller.js";

const router = Router();

router.post("/register", validate({ body: createUserSchema }), registerUser);
router.post("/login", validate({ body: loginUserSchema }), loginUser);
router.get("/byId", authenticate, getUserById);
export default router;
