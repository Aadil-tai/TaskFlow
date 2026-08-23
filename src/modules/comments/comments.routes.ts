import { Router } from "express";
import { addComment, getComments } from "./comments.controller.js";
import { authenticate } from "../../middleware/authenticate.js";

const router = Router();

/**
 * @openapi
 * /tasks/{id}/comments:
 *   post:
 *     tags: [Comments]
 *     summary: Add a comment to a task
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
 *             required: [content]
 *             properties:
 *               content:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 5000
 *                 example: Looks great! Can we try a darker shade for the CTA button?
 *         example:
 *           content: Looks great! Can we try a darker shade for the CTA button?
 *     responses:
 *       201:
 *         description: Comment created with author details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 comment: { $ref: '#/components/schemas/Comment' }
 *       400:
 *         description: Validation failed (empty or too long content)
 *       404:
 *         description: Task not found or access denied
 */
router.post("/tasks/:id/comments", authenticate, addComment);

/**
 * @openapi
 * /tasks/{id}/comments:
 *   get:
 *     tags: [Comments]
 *     summary: List comments on a task (oldest first)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Comments with author details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 comments:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Comment' }
 *       404:
 *         description: Task not found or access denied
 */
router.get("/tasks/:id/comments", authenticate, getComments);

export default router;
