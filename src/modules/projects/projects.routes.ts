import { Router } from "express";
import {
  addProjectMember,
  createProject,
  getProjectById,
  getProjects,
} from "./projects.controller.js";
// import { authenticate } from "../../middleware/authenticate.js";

const router = Router();

router.post("/projects", createProject);
router.get("/projects", getProjects);
router.get("/projects/:id", getProjectById);
router.post("/projects/:id/members", addProjectMember);

export default router;
