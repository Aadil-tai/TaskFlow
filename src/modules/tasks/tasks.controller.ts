import type { NextFunction, Request, Response } from "express";
import { AppError } from "../../utils/AppError.js";
import {
  createTaskService,
  getTaskDeadlineHistoryService,
  getTasksService,
  softDeleteTaskService,
  updateTaskService,
  updateTaskStatusService,
} from "./tasks.service.js";
import {
  createTaskSchema,
  updateTaskSchema,
  updateTaskStatusSchema,
} from "./tasks.schema.js";

function getUserId(res: Response): string {
  const userId = res.locals.user?.sub;
  if (typeof userId !== "string") {
    throw new AppError("Authentication required", 401);
  }
  return userId;
}

function getTaskId(req: Request): string {
  const taskId = req.params.id;
  if (typeof taskId !== "string") {
    throw new AppError("Task ID is required", 400);
  }
  return taskId;
}

export async function createTask(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const task = await createTaskService(createTaskSchema.parse(req.body), getUserId(res));
    res.status(201).json({ task });
  } catch (err) { next(err); }
}

export async function getTasks(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const projectId = typeof req.query.projectId === "string" ? req.query.projectId : undefined;
    const role = res.locals.user?.role || "MEMBER";
    const tasks = await getTasksService(getUserId(res), role, projectId);
    res.status(200).json({ tasks });
  } catch (err) { next(err); }
}

export async function updateTask(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const task = await updateTaskService(getTaskId(req), updateTaskSchema.parse(req.body), getUserId(res));
    res.status(200).json({ task });
  } catch (err) { next(err); }
}

export async function updateTaskStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { status } = updateTaskStatusSchema.parse(req.body);
    const task = await updateTaskStatusService(getTaskId(req), status, getUserId(res));
    res.status(200).json({ task });
  } catch (err) { next(err); }
}

export async function getTaskDeadlineHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const history = await getTaskDeadlineHistoryService(getTaskId(req), getUserId(res));
    res.status(200).json({ history });
  } catch (err) { next(err); }
}

export async function softDeleteTask(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const task = await softDeleteTaskService(getTaskId(req), getUserId(res));
    res.status(200).json({ message: "Task deleted successfully", task });
  } catch (err) { next(err); }
}
