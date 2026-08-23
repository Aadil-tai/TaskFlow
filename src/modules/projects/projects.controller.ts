import type { NextFunction, Request, Response } from "express";
import { AppError } from "../../utils/AppError.js";
import {
  addProjectMemberService,
  createProjectService,
  getProjectByIdService,
  getProjectsService,
} from "./projects.service.js";
import { addProjectMemberSchema, createProjectSchema } from "./projects.schema.js";

function userId(res: Response): string {
  const id = res.locals.user?.sub;
  if (typeof id !== "string") throw new AppError("Authentication required", 401);
  return id;
}

function projectId(req: Request): string {
  const id = req.params.id;
  if (typeof id !== "string") throw new AppError("Project ID is required", 400);
  return id;
}

export async function createProject(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const project = await createProjectService(createProjectSchema.parse(req.body), userId(res));
    res.status(201).json({ project });
  } catch (err) { next(err); }
}

export async function getProjects(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const projects = await getProjectsService(userId(res));
    res.status(200).json({ projects });
  } catch (err) { next(err); }
}

export async function getProjectById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const project = await getProjectByIdService(projectId(req), userId(res));
    res.status(200).json({ project });
  } catch (err) { next(err); }
}

export async function addProjectMember(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { userId: memberId } = addProjectMemberSchema.parse(req.body);
    const member = await addProjectMemberService(projectId(req), memberId, userId(res));
    res.status(201).json({ member });
  } catch (err) { next(err); }
}
