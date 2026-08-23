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

const router = Router();

router.post("/tasks", authenticate, createTask);
router.get("/tasks", authenticate, getTasks);
router.patch("/tasks/:id", authenticate, updateTask);
router.patch("/tasks/:id/status", authenticate, updateTaskStatus);
router.get("/tasks/:id/deadline-history", authenticate, getTaskDeadlineHistory);
router.delete("/tasks/:id", authenticate, softDeleteTask);

export default router;
