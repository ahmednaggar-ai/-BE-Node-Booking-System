export const badRequestError = (statusCode = 400, message = "Bad Request") => {
    return errorResponse(statusCode, message, null);
}

export const UnauthorizedError = (statusCode = 401, message = "Unauthorized") => {
    return errorResponse(statusCode, message, null);
}

export const ForbiddenError = (statusCode = 403, message = "Forbidden") => {
    return errorResponse(statusCode, message, null);
}

export const NotFoundError = (statusCode = 404, message = "Not Found") => {
    return errorResponse(statusCode, message, null);
}


export const InternalServerError = (statusCode = 500, message = "Internal Server Error") => {
    return errorResponse(statusCode, message, null);
}

export const errorResponse = (res, statusCode, message, error = null) => {
    return res.status(statusCode).json({
        success : false,
        message : message,
        error : error?.[0]?.message
    });
}

export const globalErrorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || err.status || 500;
    const message = err.message || "Internal Server Error";
    const error = err.errors ?? null;
    return errorResponse(res, statusCode, message, error);
}