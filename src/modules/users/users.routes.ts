import { Router } from "express";
import {
	deleteUser,
	listDeletedUsers,
	restoreDeletedUser,
	updateUserRole,
} from "./users.controller.js";
import { authenticate } from "../../middleware/authenticate.js";
import { requireRole } from "../../middleware/requireRole.js";

const router = Router();

/**
 * @openapi
 * /users/{id}/role:
 *   patch:
 *     tags: [Users]
 *     summary: Update a user's role (admin only)
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
 *             required: [role]
 *             properties:
 *               role:
 *                 $ref: '#/components/schemas/Role'
 *                 example: ADMIN
 *     responses:
 *       200:
 *         description: Role updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string }
 *                 user: { $ref: '#/components/schemas/User' }
 *       400:
 *         description: Validation failed or self role change
 *       403:
 *         description: Insufficient permissions
 *       404:
 *         description: User not found
 */
router.patch("/users/:id/role", authenticate, requireRole("ADMIN"), updateUserRole);

/**
 * @openapi
 * /users/{id}:
 *   delete:
 *     tags: [Users]
 *     summary: Soft delete a user (admin only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: User soft deleted
 *       404:
 *         description: User not found or already deleted
 */
router.delete("/users/:id", authenticate, requireRole("ADMIN"), deleteUser);

/**
 * @openapi
 * /users/deleted:
 *   get:
 *     tags: [Users]
 *     summary: List soft-deleted users (admin only)
 *     responses:
 *       200:
 *         description: Deleted users ordered by deletion date
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/User' }
 */
router.get("/users/deleted", authenticate, requireRole("ADMIN"), listDeletedUsers);

/**
 * @openapi
 * /users/{id}/restore:
 *   patch:
 *     tags: [Users]
 *     summary: Restore a soft-deleted user (admin only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: User restored
 *       404:
 *         description: Deleted user not found
 */
router.patch("/users/:id/restore", authenticate, requireRole("ADMIN"), restoreDeletedUser);

export default router;
