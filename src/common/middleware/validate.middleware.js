import { z } from "zod";

export const formatZodErrors = (error) => {
    return error.issues.map((issue) => ({
        path: issue.path.join(".") || "root",
        message: issue.message,
    }));
};


export const validate = (schemas) => {
    return (req, res, next) => {
        try {
            if (schemas.body) {
                req.body = schemas.body.parse(req.body);
            }
            if (schemas.params) {
                req.params = schemas.params.parse(req.params);
            }
            if (schemas.query) {
                req.validatedQuery = schemas.query.parse(req.query);
            }
            next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                const validationError = new Error("Validation failed");
                validationError.statusCode = 400;
                validationError.errors = formatZodErrors(error);
                return next(validationError);
            }
            next(error);
        }
    };
};

export const validateBody = (schema) => validate({ body: schema });
export const validateParams = (schema) => validate({ params: schema });
export const validateQuery = (schema) => validate({ query: schema });
