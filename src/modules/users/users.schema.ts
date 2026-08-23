import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().trim().min(2, "Name must contain at least 2 characters").max(100),
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must contain at least 8 characters"),
  role: z.enum(["ADMIN", "MEMBER"]).default("MEMBER"),
});

export const updateUserRoleSchema = z.object({
  role: z.enum(["ADMIN", "MEMBER"]),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;
