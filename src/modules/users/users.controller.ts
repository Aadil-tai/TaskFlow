import type { NextFunction, Request, Response } from "express";
import { AppError } from "../../utils/AppError.js";
import {
  getDeletedUsers,
  restoreUser,
  softDeleteUser,
} from "./users.service.js";

export async function deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.params.id;
    if (typeof userId !== "string") {
      throw new AppError("User ID is required", 400);
    }

    const user = await softDeleteUser(userId);
    res.status(200).json({ message: "User deleted successfully", user });
  } catch (err) {
    next(err);
  }
}

export async function listDeletedUsers(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const users = await getDeletedUsers();
    res.status(200).json({ users });
  } catch (err) {
    next(err);
  }
}

export async function restoreDeletedUser(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = req.params.id;
    if (typeof userId !== "string") {
      throw new AppError("User ID is required", 400);
    }

    const user = await restoreUser(userId);
    res.status(200).json({ message: "User restored successfully", user });
  } catch (err) {
    next(err);
  }
}

export async function updateUserRole(req: Request, res: Response, next: NextFunction): Promise<void> {
  // TODO
}
