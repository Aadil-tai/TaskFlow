import type { NextFunction, Request, Response } from "express";
import { loginSchema, registerSchema } from "./auth.schema.js";
import { loginUser, registerUser } from "./auth.service.js";
import {
  signRefreshToken,
  signToken,
  verifyRefreshToken,
} from "../../utils/jwt.js";
import { AppError } from "../../utils/AppError.js";

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
  try {
    const input = loginSchema.parse(req.body);
    const user = await loginUser(input);
    const accessToken = signToken(
      { sub: user.id, role: user.role },
      "15m",
    );
    const refreshToken = signRefreshToken({ sub: user.id });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      accessToken,
      user,
    });
  } catch (err) {
    next(err);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      throw new AppError("Refresh token is required", 401);
    }

    const payload = verifyRefreshToken<{ sub: string; role?: string }>(refreshToken);
    const accessToken = signToken(
      { sub: payload.sub, ...(payload.role ? { role: payload.role } : {}) },
      "15m",
    );

    res.status(200).json({ accessToken });
  } catch (err) {
    next(err instanceof Error && !(err instanceof AppError)
      ? new AppError("Invalid or expired refresh token", 401)
      : err);
  }
}
