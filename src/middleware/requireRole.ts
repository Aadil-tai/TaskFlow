import type { NextFunction, Request, Response } from "express";

export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    // TODO
  };
}
