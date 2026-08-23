import type { NextFunction, Request, Response } from "express";

export function validate(schema: unknown) {
  return (req: Request, res: Response, next: NextFunction): void => {
    // TODO
  };
}
