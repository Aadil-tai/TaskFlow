import { Router } from "express";
import { addComment, getComments } from "./comments.controller.js";
// import { authenticate } from "../../middleware/authenticate.js";

const router = Router();

router.post("/tasks/:id/comments", addComment);
router.get("/tasks/:id/comments", getComments);

export default router;
