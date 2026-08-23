import { Router } from "express";
import {
  createTask,
  getTaskDeadlineHistory,
  getTasks,
  softDeleteTask,
  updateTask,
  updateTaskStatus,
} from "./tasks.controller.js";
// import { authenticate } from "../../middleware/authenticate.js";

const router = Router();

router.post("/tasks", createTask);
router.get("/tasks", getTasks);
router.patch("/tasks/:id", updateTask);
router.patch("/tasks/:id/status", updateTaskStatus);
router.get("/tasks/:id/deadline-history", getTaskDeadlineHistory);
router.delete("/tasks/:id", softDeleteTask);

export default router;
