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

router.post("/tasks", authenticate, requireRole("ADMIN"), createTask);
router.get("/tasks", authenticate, getTasks);
router.patch("/tasks/:id", authenticate, requireRole("ADMIN"), updateTask);
router.patch("/tasks/:id/status", authenticate, updateTaskStatus);
router.get("/tasks/:id/deadline-history", authenticate, getTaskDeadlineHistory);
router.delete("/tasks/:id", authenticate, requireRole("ADMIN"), softDeleteTask);

export default router;
