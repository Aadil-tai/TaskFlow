import { z } from "zod";

export const createTaskSchema = z.object({
	projectId: z.string().uuid(),
	title: z.string().trim().min(1).max(200),
	description: z.string().trim().max(5000).optional(),
	priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
	deadline: z.coerce.date(),
	assignedTo: z.string().uuid().optional(),
});

export const updateTaskSchema = z.object({
	title: z.string().trim().min(1).max(200).optional(),
	description: z.string().trim().max(5000).nullable().optional(),
	priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
	deadline: z.coerce.date().optional(),
	assignedTo: z.string().uuid().nullable().optional(),
}).refine((input) => Object.keys(input).length > 0, {
	message: "At least one field is required",
});

export const updateTaskStatusSchema = z.object({
	status: z.enum(["TODO", "IN_PROGRESS", "DONE"]),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
