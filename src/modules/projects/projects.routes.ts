import { Router } from "express";
import {
  addProjectMember,
  createProject,
  getProjectById,
  getProjects,
} from "./projects.controller.js";
import { authenticate } from "../../middleware/authenticate.js";
import { requireRole } from "../../middleware/requireRole.js";

const router = Router();

/**
 * @openapi
 * /projects:
 *   post:
 *     tags: [Projects]
 *     summary: Create a project (admin only)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Website Redesign
 *               description:
 *                 type: string
 *                 example: Revamp the marketing site with a new design system
 *     responses:
 *       201:
 *         description: Project created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string }
 *                 project: { $ref: '#/components/schemas/Project' }
 */
router.post("/projects", authenticate, requireRole("ADMIN"), createProject);

/**
 * @openapi
 * /projects:
 *   get:
 *     tags: [Projects]
 *     summary: List projects the authenticated user owns or belongs to
 *     responses:
 *       200:
 *         description: Projects ordered by creation date
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 projects:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Project' }
 */
router.get("/projects", authenticate, getProjects);

/**
 * @openapi
 * /projects/{id}:
 *   get:
 *     tags: [Projects]
 *     summary: Get a single project with task progress stats
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Project details with progress
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 project:
 *                   allOf:
 *                     - $ref: '#/components/schemas/Project'
 *                     - type: object
 *                       properties:
 *                         progress: { $ref: '#/components/schemas/ProjectProgress' }
 *       404:
 *         description: Project not found or access denied
 */
router.get("/projects/:id", authenticate, getProjectById);

/**
 * @openapi
 * /projects/{id}/members:
 *   post:
 *     tags: [Projects]
 *     summary: Add a member to a project (creator/admin only)
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
 *             required: [userId]
 *             properties:
 *               userId:
 *                 type: string
 *                 format: uuid
 *                 example: 3f2504e0-4f89-11d3-9a0c-0305e82c3301
 *     responses:
 *       201:
 *         description: Member added (idempotent)
 *       403:
 *         description: Only the project creator can add members
 *       404:
 *         description: User not found
 */
router.post("/projects/:id/members", authenticate, requireRole("ADMIN"), addProjectMember);

export default router;
