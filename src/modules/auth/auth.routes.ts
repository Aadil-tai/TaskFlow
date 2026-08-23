import { Router } from "express";
import { login, refresh, register } from "./auth.controller.js";
// import { authenticate } from "../../middleware/authenticate.js";

const router = Router();

router.post("/auth/register", register);
router.post("/auth/login", login);
router.post("/auth/refresh", refresh);

export default router;
