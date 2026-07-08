import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

type TErrorLike = {
    name?: string;
    errorMessage?: string;
    stack?: string;
    statusCode?: number;
    status?: string;
};

const globalErrorsHandler = (
    err: TErrorLike,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const statusCode =
        typeof err.statusCode === "number"
            ? err.statusCode
            : httpStatus.INTERNAL_SERVER_ERROR;

    const status = err.status || (statusCode >= 500 ? "error" : "fail");
    let errorMessage = err.errorMessage || "Internal Server Error";
    let errorName = err.name || "Error";

    res.status(statusCode).json({
        success: false,
        errorMessage,
        errorDetails: {
            errorName,
            statusCode,
            status,
            stack: err.stack,
            path: req.originalUrl,
            method: req.method,
        },
    });
};

export default globalErrorsHandler;