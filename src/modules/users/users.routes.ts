import { Router } from "express";
import {
	createUser,
	deleteUser,
	listDeletedUsers,
	listUsers,
	restoreDeletedUser,
	updateUserRole,
	uploadAvatar,
} from "./users.controller.js";
import { authenticate } from "../../middleware/authenticate.js";
import { requireRole } from "../../middleware/requireRole.js";
import { avatarUpload } from "../../config/upload.js";

const router = Router();

/**
 * @openapi
 * /users:
 *   post:
 *     tags: [Users]
 *     summary: Create a team member account (admin only)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Ayesha Khan
 *               email:
 *                 type: string
 *                 format: email
 *                 example: ayesha@example.com
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 example: Passw0rd!123
 *               role:
 *                 $ref: '#/components/schemas/Role'
 *                 example: MEMBER
 *         example:
 *           name: Ayesha Khan
 *           email: ayesha@example.com
 *           password: Passw0rd!123
 *           role: MEMBER
 *     responses:
 *       201:
 *         description: Account created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string }
 *                 user: { $ref: '#/components/schemas/User' }
 *       409:
 *         description: Email already registered
 */
router.post("/users", authenticate, requireRole("ADMIN"), createUser);

/**
 * @openapi
 * /users:
 *   get:
 *     tags: [Users]
 *     summary: List active users (admin only)
 *     responses:
 *       200:
 *         description: Active users, newest first
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/User' }
 */
router.get("/users", authenticate, requireRole("ADMIN"), listUsers);

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
 *         example:
 *           role: ADMIN
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

/**
 * @openapi
 * /users/me/avatar:
 *   post:
 *     tags: [Users]
 *     summary: Upload or update your profile avatar
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [avatar]
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Avatar updated
 *       400:
 *         description: No file or invalid file type
 */
router.post("/users/me/avatar", authenticate, avatarUpload.single("avatar"), uploadAvatar);

export default router;
