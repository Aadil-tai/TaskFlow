import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { AppError } from "../utils/AppError.js";

export function errorHandler(
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (error instanceof z.ZodError) {
    res.status(400).json({
      message: "Validation failed",
      errors: error.issues,
    });
    return;
  }

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      message: error.message,
    });
    return;
  }

  console.error(error);
  res.status(500).json({
    message: "Internal server error",
  });
}
