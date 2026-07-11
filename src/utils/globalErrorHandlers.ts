import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import {
    PrismaClientKnownRequestError,
    PrismaClientUnknownRequestError,
    PrismaClientValidationError,
    PrismaClientInitializationError,
} from "@prisma/client/runtime/client";

const globalErrorsHandler = (
    err: unknown,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
    let errorMessage: string = "Internal Server Error";
    let errorName: string = "InternalServerError";

    if (err instanceof Error) {
        errorMessage = err.message || errorMessage;
        errorName = err.name || errorName;
    }

    if (typeof err === "object" && err !== null && "statusCode" in err) {
        const code = (err as { statusCode: unknown }).statusCode;
        if (typeof code === "number") {
            statusCode = code;
        }
    }

    if (typeof err === "object" && err !== null && "errorMessage" in err) {
        const msg = (err as { errorMessage: unknown }).errorMessage;
        if (typeof msg === "string") {
            errorMessage = msg;
        }
    }


    
    // Prisma-specific error handling
    if (err instanceof PrismaClientValidationError) {
        statusCode = httpStatus.BAD_REQUEST;
        errorMessage = "You have provided incorrect fields type or Fields Missing";
        errorName = err.name;
    } else if (err instanceof PrismaClientKnownRequestError) {
        errorName = err.name;
        if (err.code === "P2002") {
            statusCode = httpStatus.CONFLICT;
            errorMessage = "Duplicate Key error";
        } else if (err.code === "P2003") {
            statusCode = httpStatus.BAD_REQUEST;
            errorMessage = "Foreign Key Constraint Failed";
        } else if (err.code === "P2025") {
            statusCode = httpStatus.NOT_FOUND;
            errorMessage =
                "An operation failed because it depends on one or more records that were required but not found.";
        } else {
            statusCode = httpStatus.BAD_REQUEST;
        }
    } else if (err instanceof PrismaClientInitializationError) {
        errorName = err.name;
        if (err.errorCode === "P1000") {
            statusCode = httpStatus.UNAUTHORIZED;
            errorMessage = "Authentication failed against database server.";
        } else if (err.errorCode === "P1001") {
            statusCode = httpStatus.BAD_REQUEST;
            errorMessage = "Can't reach database server.";
        } else {
            statusCode = httpStatus.INTERNAL_SERVER_ERROR;
            errorMessage = "Database initialization error.";
        }
    } else if (err instanceof PrismaClientUnknownRequestError) {
        statusCode = httpStatus.INTERNAL_SERVER_ERROR;
        errorMessage = "Error occurred during query execution.";
        errorName = err.name;
    }

    const status = statusCode >= 500 ? "error" : "fail";

    res.status(statusCode).json({
        success: false,
        errorMessage,
        errorDetails: {
            errorName,
            statusCode,
            status,
            stack: err instanceof Error ? err.stack : undefined,
            path: req.originalUrl,
            method: req.method,
        },
    });
};

export default globalErrorsHandler;