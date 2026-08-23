import { Router } from "express";
import { login, refresh } from "./auth.controller.js";

const router = Router();

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Log in and receive an access token
 *     description: >
 *       Log in with an ADMIN account (see the AdminLogin example, seeded via `npm run seed:admin`)
 *       to test admin-only endpoints such as project/task creation and user management.
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: ayesha@example.com
 *               password:
 *                 type: string
 *                 example: Passw0rd!123
 *           examples:
 *             MemberLogin:
 *               summary: Regular member account
 *               value:
 *                 email: ayesha@example.com
 *                 password: Passw0rd!123
 *             AdminLogin:
 *               summary: Seeded admin account for admin-only endpoints
 *               value:
 *                 email: admin@taskflow.dev
 *                 password: Admin@12345
 *     responses:
 *       200:
 *         description: Login successful. Also sets a httpOnly refreshToken cookie.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string }
 *                 accessToken: { type: string }
 *                 user: { $ref: '#/components/schemas/User' }
 *       401:
 *         description: Invalid credentials or deleted account
 */
router.post("/auth/login", login);

/**
 * @openapi
 * /auth/refresh:
 *   post:
 *     tags: [Auth]
 *     summary: Rotate the access token using the refresh cookie
 *     security:
 *       - refreshTokenCookie: []
 *     responses:
 *       200:
 *         description: New access token issued
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken: { type: string }
 *       401:
 *         description: Missing or invalid refresh token
 */
router.post("/auth/refresh", refresh);

export default router;
