import { Role } from "../../../generated/prisma/enums.js";
import { prisma } from "../../config/db.js";
import { AppError } from "../../utils/AppError.js";
import { hashPassword } from "../../utils/hash.js";
import type { CreateUserInput } from "./users.schema.js";

const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  avatarUrl: true,
  createdAt: true,
} as const;

export async function createUserService(input: CreateUserInput) {
  const existingUser = await prisma.user.findUnique({
    where: { email: input.email },
    select: { id: true },
  });

  if (existingUser) {
    throw new AppError("Email is already registered", 409);
  }

  const passwordHash = await hashPassword(input.password);

  return prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash,
      role: input.role,
    },
    select: userSelect,
  });
}

export async function softDeleteUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, deletedAt: true },
  });

  if (!user || user.deletedAt !== null) {
    throw new AppError("User not found", 404);
  }

  return prisma.user.update({
    where: { id: userId },
    data: { deletedAt: new Date() },
    select: {
      id: true,
      deletedAt: true,
    },
  });
}

export async function getUsers() {
  return prisma.user.findMany({
    where: { deletedAt: null },
    select: userSelect,
    orderBy: { createdAt: "desc" },
  });
}

export async function getDeletedUsers() {
  return prisma.user.findMany({
    where: { deletedAt: { not: null } },
    select: {
      ...userSelect,
      deletedAt: true,
    },
    orderBy: { deletedAt: "desc" },
  });
}

export async function restoreUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, deletedAt: true },
  });

  if (!user || user.deletedAt === null) {
    throw new AppError("Deleted user not found", 404);
  }

  return prisma.user.update({
    where: { id: userId },
    data: { deletedAt: null },
    select: {
      ...userSelect,
      deletedAt: true,
    },
  });
}

export async function updateUserRoleService(userId: string, role: Role) {
  const user = await prisma.user.findFirst({
    where: { id: userId, deletedAt: null },
    select: { id: true },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return prisma.user.update({
    where: { id: userId },
    data: { role },
    select: userSelect,
  });
}

export async function updateAvatarService(userId: string, avatarUrl: string) {
  return prisma.user.update({
    where: { id: userId },
    data: { avatarUrl },
    select: userSelect,
  });
}
