import { prisma } from "../../config/db.js";
import { AppError } from "../../utils/AppError.js";

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

export async function getDeletedUsers() {
  return prisma.user.findMany({
    where: { deletedAt: { not: null } },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
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
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      deletedAt: true,
    },
  });
}

export async function updateUserRoleService(): Promise<void> {
  // TODO
}
