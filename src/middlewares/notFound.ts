import type { NextFunction, Request, Response } from "express";

export const notFound = (req: Request, res: Response, next: NextFunction) => {
    next({
        name: "NotFoundError",
        statusCode: 404,
        status: "fail",
        message: `Route not found: ${req.originalUrl}`,
    });
};