import { Router } from "express";
import { updateUserRole } from "./users.controller.js";
// import { authenticate } from "../../middleware/authenticate.js";
// import { requireRole } from "../../middleware/requireRole.js";

const router = Router();

router.patch("/users/:id/role", updateUserRole);

export default router;
