import { prisma } from "../../config/db.js";
import { AppError } from "../../utils/AppError.js";
import type { CreateTaskInput, UpdateTaskInput } from "./tasks.schema.js";

const taskSelect = {
  id: true,
  projectId: true,
  title: true,
  description: true,
  priority: true,
  status: true,
  deadline: true,
  assignedTo: true,
  createdBy: true,
  createdAt: true,
  deletedAt: true,
} as const;

async function ensureTaskExists(taskId: string) {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    select: { id: true, projectId: true, deletedAt: true, deadline: true },
  });

  if (!task || task.deletedAt !== null) {
    throw new AppError("Task not found", 404);
  }

  return task;
}

async function ensureTaskAccess(taskId: string, userId: string) {
  const task = await ensureTaskExists(taskId);
  const project = await prisma.project.findFirst({
    where: {
      id: task.projectId,
      OR: [{ createdBy: userId }, { members: { some: { userId } } }],
    },
    select: { id: true, createdBy: true },
  });

  if (!project) {
    throw new AppError("Access denied", 403);
  }

  return task;
}

export async function createTaskService(input: CreateTaskInput, userId: string) {
  const project = await prisma.project.findFirst({
    where: {
      id: input.projectId,
      deletedAt: null,
      OR: [
        { createdBy: userId },
        { members: { some: { userId } } },
      ],
    },
    select: { id: true, createdBy: true },
  });

  if (!project) {
    throw new AppError("Project not found or access denied", 404);
  }

  if (input.assignedTo !== undefined) {
    const assignee = await prisma.user.findFirst({
      where: {
        id: input.assignedTo,
        deletedAt: null,
      },
      select: { id: true },
    });

    if (!assignee) {
      throw new AppError("Assignee must be an active user", 400);
    }
  }

  return prisma.task.create({
    data: {
      projectId: input.projectId,
      title: input.title,
      ...(input.description !== undefined ? { description: input.description } : {}),
      priority: input.priority,
      deadline: input.deadline,
      ...(input.assignedTo !== undefined ? { assignedTo: input.assignedTo } : {}),
      createdBy: userId,
    },
    select: taskSelect,
  });
}

export async function getTasksService(userId: string, projectId?: string) {
  return prisma.task.findMany({
    where: {
      deletedAt: null,
      ...(projectId ? { projectId } : {}),
      project: {
        deletedAt: null,
        OR: [
          { createdBy: userId },
          { members: { some: { userId } } },
        ],
      },
    },
    select: taskSelect,
    orderBy: { createdAt: "desc" },
  });
}

export async function updateTaskService(taskId: string, input: UpdateTaskInput, userId: string) {
  const task = await ensureTaskExists(taskId);
  const access = await prisma.project.findFirst({
    where: {
      id: (await prisma.task.findUniqueOrThrow({ where: { id: taskId }, select: { projectId: true } })).projectId,
      OR: [{ createdBy: userId }, { members: { some: { userId } } }],
    },
    select: { id: true, createdBy: true },
  });

  if (!access) {
    throw new AppError("Access denied", 403);
  }

  if (input.assignedTo !== undefined && input.assignedTo !== null) {
    const assignee = await prisma.user.findFirst({
      where: {
        id: input.assignedTo,
        deletedAt: null,
      },
      select: { id: true },
    });

    if (!assignee) {
      throw new AppError("Assignee must be an active user", 400);
    }
  }

  const updateData = {
    ...(input.title !== undefined ? { title: input.title } : {}),
    ...(input.description !== undefined ? { description: input.description } : {}),
    ...(input.priority !== undefined ? { priority: input.priority } : {}),
    ...(input.deadline !== undefined ? { deadline: input.deadline } : {}),
    ...(input.assignedTo !== undefined ? { assignedTo: input.assignedTo } : {}),
  };

  const updated = await prisma.$transaction(async (transaction) => {
    const result = await transaction.task.update({
      where: { id: taskId },
      data: updateData,
      select: taskSelect,
    });

    if (input.deadline && input.deadline.getTime() !== task.deadline.getTime()) {
      await transaction.taskDeadlineHistory.create({
        data: {
          taskId,
          oldDeadline: task.deadline,
          newDeadline: input.deadline,
          changedBy: userId,
        },
      });
    }

    return result;
  });

  return updated;
}

export async function updateTaskStatusService(taskId: string, status: "TODO" | "IN_PROGRESS" | "DONE", userId: string) {
  await ensureTaskAccess(taskId, userId);
  return prisma.task.update({
    where: { id: taskId },
    data: { status },
    select: taskSelect,
  });
}

export async function getTaskDeadlineHistoryService(taskId: string, userId: string) {
  await ensureTaskAccess(taskId, userId);
  return prisma.taskDeadlineHistory.findMany({
    where: { taskId },
    orderBy: { changedAt: "desc" },
  });
}

export async function softDeleteTaskService(taskId: string, userId: string) {
  await ensureTaskAccess(taskId, userId);
  return prisma.task.update({
    where: { id: taskId },
    data: { deletedAt: new Date() },
    select: { id: true, deletedAt: true },
  });
}
