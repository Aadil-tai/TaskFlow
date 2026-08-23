import { prisma } from "../../config/db.js";
import { AppError } from "../../utils/AppError.js";
import type { CreateProjectInput } from "./projects.schema.js";

const projectSelect = {
  id: true,
  name: true,
  description: true,
  createdBy: true,
  createdAt: true,
  deletedAt: true,
} as const;

async function getAccessibleProject(projectId: string, userId: string, role: string) {
  const project = await prisma.project.findFirst({
    where: role === "ADMIN" ? {
      id: projectId,
      deletedAt: null,
    } : {
      id: projectId,
      deletedAt: null,
      OR: [{ createdBy: userId }, { members: { some: { userId } } }],
    },
    select: projectSelect,
  });

  if (!project) {
    throw new AppError("Project not found or access denied", 404);
  }

  return project;
}

export async function createProjectService(input: CreateProjectInput, userId: string) {
  return prisma.project.create({
    data: {
      name: input.name,
      ...(input.description !== undefined ? { description: input.description } : {}),
      createdBy: userId,
    },
    select: projectSelect,
  });
}

export async function getProjectsService(userId: string, role: string = "MEMBER") {
  return prisma.project.findMany({
    where: role === "ADMIN" ? {
      deletedAt: null,
    } : {
      deletedAt: null,
      OR: [{ createdBy: userId }, { members: { some: { userId } } }],
    },
    select: projectSelect,
    orderBy: { createdAt: "desc" },
  });
}

export async function getProjectByIdService(projectId: string, userId: string, role: string = "MEMBER") {
  const project = await getAccessibleProject(projectId, userId, role);
  const [totalTasks, todoTasks, inProgressTasks, completedTasks] = await Promise.all([
    prisma.task.count({ where: { projectId, deletedAt: null } }),
    prisma.task.count({ where: { projectId, deletedAt: null, status: "TODO" } }),
    prisma.task.count({ where: { projectId, deletedAt: null, status: "IN_PROGRESS" } }),
    prisma.task.count({ where: { projectId, deletedAt: null, status: "DONE" } }),
  ]);

  return {
    ...project,
    progress: {
      totalTasks,
      todoTasks,
      inProgressTasks,
      completedTasks,
      progressPercentage: totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100),
    },
  };
}

export async function addProjectMemberService(projectId: string, memberId: string, userId: string) {
  const project = await prisma.project.findFirst({
    where: { id: projectId, createdBy: userId, deletedAt: null },
    select: { id: true },
  });

  if (!project) {
    throw new AppError("Only the project creator can add members", 403);
  }

  const member = await prisma.user.findFirst({
    where: { id: memberId, deletedAt: null },
    select: { id: true },
  });

  if (!member) {
    throw new AppError("User not found", 404);
  }

  return prisma.projectMember.upsert({
    where: { projectId_userId: { projectId, userId: memberId } },
    create: { projectId, userId: memberId },
    update: {},
  });
}
