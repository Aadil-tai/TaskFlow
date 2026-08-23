import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import swaggerUi from "swagger-ui-express";
import apiRouter from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { openapiSpec } from "./docs/swagger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const port = Number(process.env.PORT) || 3000;

const frontendUrl = process.env.FRONTEND_URL;

const app = express();

app.use(
  cors({
    origin: frontendUrl ? [frontendUrl] : true,
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());
app.set("trust proxy", 1);

// Serve uploaded files (avatars, etc.)
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.get("/", (req, res) => {
	const baseUrl = `${req.protocol}://${req.get("host")}`;
	res.type("html").send(`TaskFlow API is running on port ${port}. <a href="${baseUrl}/api">Open API</a>`);
});
app.use("/api", apiRouter);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(openapiSpec));
app.get("/api/openapi.json", (req, res) => {
	res.json(openapiSpec);
});
app.use(errorHandler);

export default app;
