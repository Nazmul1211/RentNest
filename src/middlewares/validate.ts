import type { Request, Response, NextFunction } from "express";

type ValidationFn = (req: Request) => string | null;

export const validate = (validationFn: ValidationFn) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const errorMessage = validationFn(req);

    if (errorMessage) {
      const error = new Error(errorMessage);
      error.name = "ValidationError";
      (error as any).statusCode = 400;
      (error as any).errorMessage = errorMessage;
      (error as any).status = "fail";
      return next(error);
    }

    next();
  };
};
