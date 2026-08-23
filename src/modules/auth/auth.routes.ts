import { Router } from "express";
import { login, refresh, register } from "./auth.controller.js";
// import { authenticate } from "../../middleware/authenticate.js";

const router = Router();

/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     security: []
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
 *                 minLength: 6
 *                 example: Passw0rd!123
 *         example:
 *           name: Ayesha Khan
 *           email: ayesha@example.com
 *           password: Passw0rd!123
 *     responses:
 *       201:
 *         description: User registered
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
router.post("/auth/register", register);

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
