import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import apiRouter from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";

export const port = Number(process.env.PORT) || 3000;

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.get("/", (_req, res) => {
	res.type("html").send(`TaskFlow API is running on port ${port}. <a href="http://localhost:${port}/api">Open API</a>`);
});
app.use("/api", apiRouter);
app.use(errorHandler);

export default app;
