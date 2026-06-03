import { z } from "zod";

const OBJECT_ID_REGEX = /^[0-9a-fA-F]{24}$/;

export const objectId = z
    .string()
    .regex(OBJECT_ID_REGEX, "Invalid MongoDB id");

export const uuid = z.uuid({ message: "Invalid UUID" });

export const mongoIdParams = z.object({
    id: objectId,
});

export const uuidParams = z.object({
    id: uuid,
});

export const mongoIdParam = (key = "id") =>
    z.object({ [key]: objectId });

export const uuidParam = (key = "id") =>
    z.object({ [key]: uuid });

export const paginationQuery = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
});

export const buildUpdateSchema = (schema) =>
    schema.partial().refine(
        (data) => Object.values(data).some((value) => value !== undefined),
        { message: "At least one field must be provided" }
    );
