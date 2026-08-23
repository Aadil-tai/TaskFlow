import type { NextFunction, Request, Response } from "express";
import { registerSchema } from "./auth.schema.js";
import { registerUser } from "./auth.service.js";

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try{
 const input = registerSchema.parse(req.body);
    const user = await registerUser(input);

    res.status(201).json({
      message: "User registered successfully",
      user,
    });
  }catch(err){
    next(err)
  }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  // TODO
}

export async function refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
  // TODO
}
