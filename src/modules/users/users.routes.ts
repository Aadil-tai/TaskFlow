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

router.delete("/users/:id", authenticate, requireRole("ADMIN"), deleteUser);
router.patch("/users/:id/role", authenticate, requireRole("ADMIN"), updateUserRole);
router.get("/users/deleted", authenticate, requireRole("ADMIN"), listDeletedUsers);
router.patch("/users/:id/restore", authenticate, requireRole("ADMIN"), restoreDeletedUser);

export default router;
