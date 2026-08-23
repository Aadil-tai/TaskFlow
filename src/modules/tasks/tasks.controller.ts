import type { NextFunction, Request, Response } from "express";

export async function createTask(req: Request, res: Response, next: NextFunction): Promise<void> {
  // TODO
}

export async function getTasks(req: Request, res: Response, next: NextFunction): Promise<void> {
  // TODO
}

export async function updateTask(req: Request, res: Response, next: NextFunction): Promise<void> {
  // TODO
}

export async function updateTaskStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
  // TODO
}

export async function getTaskDeadlineHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
  // TODO
}

export async function softDeleteTask(req: Request, res: Response, next: NextFunction): Promise<void> {
  // TODO
}
