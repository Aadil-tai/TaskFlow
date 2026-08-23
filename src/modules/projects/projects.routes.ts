import { Router } from "express";
import {
  addProjectMember,
  createProject,
  getProjectById,
  getProjects,
} from "./projects.controller.js";
import { authenticate } from "../../middleware/authenticate.js";

const router = Router();

router.post("/projects", authenticate, createProject);
router.get("/projects", authenticate, getProjects);
router.get("/projects/:id", authenticate, getProjectById);
router.post("/projects/:id/members", authenticate, addProjectMember);

export default router;
