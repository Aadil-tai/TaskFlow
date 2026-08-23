import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError.js";
import { verifyToken } from "../utils/jwt.js";

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  try {
    const authorization = req.get("authorization");
    const token = authorization?.startsWith("Bearer ")
      ? authorization.slice(7)
      : undefined;

    if (!token) {
      throw new AppError("Authentication required", 401);
    }

    res.locals.user = verifyToken<{ sub: string; role: string }>(token);
    next();
  } catch (err) {
    next(err instanceof Error && !(err instanceof AppError)
      ? new AppError("Invalid or expired access token", 401)
      : err);
  }
}
