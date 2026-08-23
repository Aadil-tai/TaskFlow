import { prisma } from "../../config/db.js";
import { AppError } from "../../utils/AppError.js";

async function ensureTaskAccess(taskId: string, userId: string): Promise<void> {
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      deletedAt: null,
      project: {
        deletedAt: null,
        OR: [
          { createdBy: userId },
          { members: { some: { userId } } },
        ],
      },
    },
    select: { id: true },
  });

  if (!task) {
    throw new AppError("Task not found or access denied", 404);
  }
}

export async function addCommentService(taskId: string, userId: string, content: string) {
  await ensureTaskAccess(taskId, userId);

  return prisma.taskComment.create({
    data: { taskId, userId, content },
    include: {
      user: { select: { id: true, name: true, email: true } },
    },
  });
}

export async function getCommentsService(taskId: string, userId: string) {
  await ensureTaskAccess(taskId, userId);

  return prisma.taskComment.findMany({
    where: { taskId },
    include: {
      user: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: "asc" },
  });
}
