import jwt from "jsonwebtoken";
import { env } from "../../../config/env.service.js";
import { errorResponse } from "../responses/error.response.js";

const extractToken = (authHeader) => {
    if (!authHeader) return null;
    if (authHeader.startsWith("Bearer ")) {
        return authHeader.slice(7).trim();
    }
    return authHeader.trim();
};

export const authenticate = (req, res, next) => {
    try {
        const token = extractToken(req.headers.authorization);

        if (!token) {
            return errorResponse(res, 401, "Authentication token required", null);
        }

        const decoded = jwt.verify(token, env.JWT_SECRET);

        req.userId = decoded.userId;
        next();
    } catch {
        return errorResponse(res, 401, "Invalid or expired token", null);
    }
};
