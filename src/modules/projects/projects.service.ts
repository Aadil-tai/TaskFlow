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

async function getAccessibleProject(projectId: string, userId: string) {
  const project = await prisma.project.findFirst({
    where: {
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

export async function getProjectsService(userId: string) {
  return prisma.project.findMany({
    where: {
      deletedAt: null,
      OR: [{ createdBy: userId }, { members: { some: { userId } } }],
    },
    select: projectSelect,
    orderBy: { createdAt: "desc" },
  });
}

export async function getProjectByIdService(projectId: string, userId: string) {
  return getAccessibleProject(projectId, userId);
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
