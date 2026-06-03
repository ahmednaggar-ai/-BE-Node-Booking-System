import { z } from "zod";
import { buildUpdateSchema } from "../../common/validators/common.validator.js";

export const createUserSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required"),
  email: z.email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginUserSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const updateUserSchema = buildUpdateSchema(createUserSchema);
