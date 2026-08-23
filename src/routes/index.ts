import { Router } from "express";
import authRouter from "../modules/auth/auth.routes.js";
import commentsRouter from "../modules/comments/comments.routes.js";
import projectsRouter from "../modules/projects/projects.routes.js";
import tasksRouter from "../modules/tasks/tasks.routes.js";
import usersRouter from "../modules/users/users.routes.js";

const router = Router();

router.use(authRouter);
router.use(usersRouter);
router.use(projectsRouter);
router.use(tasksRouter);
router.use(commentsRouter);

export default router;
