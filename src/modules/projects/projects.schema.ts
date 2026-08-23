import { z } from "zod";

export const createProjectSchema = z.object({
	name: z.string().trim().min(1).max(200),
	description: z.string().trim().max(5000).optional(),
});

export const addProjectMemberSchema = z.object({
	userId: z.string().uuid(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
