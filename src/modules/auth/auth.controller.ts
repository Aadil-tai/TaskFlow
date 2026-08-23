import type { NextFunction, Request, Response } from "express";
import { loginSchema } from "./auth.schema.js";
import { loginUser } from "./auth.service.js";
import { prisma } from "../../config/db.js";
import {
  signRefreshToken,
  signToken,
  verifyRefreshToken,
} from "../../utils/jwt.js";
import { AppError } from "../../utils/AppError.js";

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const input = loginSchema.parse(req.body);
    const user = await loginUser(input);
    const accessToken = signToken(
      { sub: user.id, role: user.role },
      "15m",
    );
    const refreshToken = signRefreshToken({ sub: user.id, role: user.role });

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

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, role: true, deletedAt: true },
    });

    if (!user || user.deletedAt !== null) {
      throw new AppError("User not found or deactivated", 401);
    }

    const accessToken = signToken(
      { sub: user.id, role: user.role },
      "15m",
    );

    res.status(200).json({ accessToken });
  } catch (err) {
    next(err instanceof Error && !(err instanceof AppError)
      ? new AppError("Invalid or expired refresh token", 401)
      : err);
  }
}
