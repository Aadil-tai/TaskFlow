import { Router } from "express";
import {
  createTask,
  getTaskDeadlineHistory,
  getTasks,
  softDeleteTask,
  updateTask,
  updateTaskStatus,
} from "./tasks.controller.js";
import { authenticate } from "../../middleware/authenticate.js";
import { requireRole } from "../../middleware/requireRole.js";

const router = Router();

/**
 * @openapi
 * /tasks:
 *   post:
 *     tags: [Tasks]
 *     summary: Create a task in a project (admin only)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [projectId, title, priority, deadline]
 *             properties:
 *               projectId:
 *                 type: string
 *                 format: uuid
 *                 example: 7c9e6679-7425-40de-944b-e07fc1f90ae7
 *               title:
 *                 type: string
 *                 example: Design homepage hero section
 *               description:
 *                 type: string
 *                 example: Create two hero variants for A/B testing, desktop and mobile
 *               priority:
 *                 $ref: '#/components/schemas/Priority'
 *                 example: HIGH
 *               deadline:
 *                 type: string
 *                 format: date-time
 *                 example: '2026-09-15T18:00:00.000Z'
 *               assignedTo:
 *                 type: string
 *                 format: uuid
 *                 example: 3f2504e0-4f89-11d3-9a0c-0305e82c3301
 *                 description: Must be an active project member or the project creator
 *     responses:
 *       201:
 *         description: Task created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string }
 *                 task: { $ref: '#/components/schemas/Task' }
 *       400:
 *         description: Assignee is not an active project member
 */
router.post("/tasks", authenticate, requireRole("ADMIN"), createTask);

/**
 * @openapi
 * /tasks:
 *   get:
 *     tags: [Tasks]
 *     summary: List tasks across projects the user can access
 *     parameters:
 *       - in: query
 *         name: projectId
 *         schema: { type: string, format: uuid }
 *         description: Filter by project
 *     responses:
 *       200:
 *         description: Tasks ordered by creation date
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tasks:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Task' }
 */
router.get("/tasks", authenticate, getTasks);

/**
 * @openapi
 * /tasks/{id}:
 *   patch:
 *     tags: [Tasks]
 *     summary: Update a task (admin only). Deadline changes are recorded in history.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             minProperties: 1
 *             properties:
 *               title:
 *                 type: string
 *                 example: Design homepage hero section v2
 *               description:
 *                 type: string
 *                 example: Updated after client feedback on copy
 *               priority:
 *                 $ref: '#/components/schemas/Priority'
 *                 example: MEDIUM
 *               deadline:
 *                 type: string
 *                 format: date-time
 *                 example: '2026-09-20T18:00:00.000Z'
 *               assignedTo:
 *                 type: string
 *                 format: uuid
 *                 nullable: true
 *                 example: 3f2504e0-4f89-11d3-9a0c-0305e82c3301
 *     responses:
 *       200:
 *         description: Updated task
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string }
 *                 task: { $ref: '#/components/schemas/Task' }
 *       403:
 *         description: Access denied
 *       404:
 *         description: Task not found
 */
router.patch("/tasks/:id", authenticate, requireRole("ADMIN"), updateTask);

/**
 * @openapi
 * /tasks/{id}/status:
 *   patch:
 *     tags: [Tasks]
 *     summary: Update a task's status
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 $ref: '#/components/schemas/Status'
 *                 example: IN_PROGRESS
 *     responses:
 *       200:
 *         description: Status updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string }
 *                 task: { $ref: '#/components/schemas/Task' }
 */
router.patch("/tasks/:id/status", authenticate, updateTaskStatus);

/**
 * @openapi
 * /tasks/{id}/deadline-history:
 *   get:
 *     tags: [Tasks]
 *     summary: Get deadline change history for a task
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Deadline changes, newest first
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 history:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/DeadlineChange' }
 */
router.get("/tasks/:id/deadline-history", authenticate, getTaskDeadlineHistory);

/**
 * @openapi
 * /tasks/{id}:
 *   delete:
 *     tags: [Tasks]
 *     summary: Soft delete a task (admin only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Task soft deleted
 *       404:
 *         description: Task not found
 */
router.delete("/tasks/:id", authenticate, requireRole("ADMIN"), softDeleteTask);

export default router;
