import type { NextFunction, Request, Response } from "express";
import { AppError } from "../../utils/AppError.js";
import { addCommentSchema } from "./comments.schema.js";
import { addCommentService, getCommentsService } from "./comments.service.js";

function getTaskId(req: Request): string {
  const taskId = req.params.id;
  if (typeof taskId !== "string") {
    throw new AppError("Task ID is required", 400);
  }
  return taskId;
}

function getUserId(res: Response): string {
  const userId = res.locals.user?.sub;
  if (typeof userId !== "string") {
    throw new AppError("Authentication required", 401);
  }
  return userId;
}

export async function addComment(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { content } = addCommentSchema.parse(req.body);
    const comment = await addCommentService(getTaskId(req), getUserId(res), content);
    res.status(201).json({ comment });
  } catch (err) {
    next(err);
  }
}

export async function getComments(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const comments = await getCommentsService(getTaskId(req), getUserId(res));
    res.status(200).json({ comments });
  } catch (err) {
    next(err);
  }
}
