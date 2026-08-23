import { prisma } from "../../config/db.js";
import { AppError } from "../../utils/AppError.js";
import { comparePassword } from "../../utils/hash.js";
import type { LoginInput } from "./auth.schema.js";

export async function loginUser(input: LoginInput) {
  const user = await prisma.user.findUnique({
    where: {
      email: input.email,
    },
  });

  if (
    !user ||
    user.deletedAt !== null ||
    !(await comparePassword(input.password, user.passwordHash))
  ) {
    throw new AppError("Invalid email or password", 401);
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatarUrl: user.avatarUrl,
    createdAt: user.createdAt,
  };
}