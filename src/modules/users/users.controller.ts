import type { NextFunction, Request, Response } from "express";
import { AppError } from "../../utils/AppError.js";
import {
  createUserService,
  getDeletedUsers,
  getUsers,
  restoreUser,
  softDeleteUser,
  updateAvatarService,
  updateUserRoleService,
} from "./users.service.js";
import { createUserSchema, updateUserRoleSchema } from "./users.schema.js";

export async function createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const input = createUserSchema.parse(req.body);
    const user = await createUserService(input);
    res.status(201).json({ message: "Team member created successfully", user });
  } catch (err) {
    next(err);
  }
}

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

export async function listUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const users = await getUsers();
    res.status(200).json({ users });
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
  try {
    const userId = req.params.id;
    if (typeof userId !== "string") {
      throw new AppError("User ID is required", 400);
    }

    const { role } = updateUserRoleSchema.parse(req.body);

    const currentUserId = res.locals.user?.sub;
    if (currentUserId === userId) {
      throw new AppError("You cannot change your own role", 400);
    }

    const user = await updateUserRoleService(userId, role);
    res.status(200).json({ message: "User role updated successfully", user });
  } catch (err) {
    next(err);
  }
}

export async function uploadAvatar(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = res.locals.user?.sub;
    if (!userId) {
      throw new AppError("Authentication required", 401);
    }

    if (!req.file) {
      throw new AppError("No image file provided", 400);
    }

    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    const user = await updateAvatarService(userId, avatarUrl);
    res.status(200).json({ message: "Avatar updated successfully", user });
  } catch (err) {
    next(err);
  }
}
