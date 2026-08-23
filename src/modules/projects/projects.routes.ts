import { Router } from "express";
import {
  addProjectMember,
  createProject,
  getProjectById,
  getProjects,
} from "./projects.controller.js";
import { authenticate } from "../../middleware/authenticate.js";
import { requireRole } from "../../middleware/requireRole.js";

const router = Router();

router.post("/projects", authenticate, requireRole("ADMIN"), createProject);
router.get("/projects", authenticate, getProjects);
router.get("/projects/:id", authenticate, getProjectById);
router.post("/projects/:id/members", authenticate, requireRole("ADMIN"), addProjectMember);

export default router;
