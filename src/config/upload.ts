import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { AppError } from "../utils/AppError.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, "..", "..", "uploads", "avatars");

// Ensure uploads directory exists
if (!fs.existsSync(uploadDir)) {
	fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
	destination: (_req, _file, cb) => {
		cb(null, uploadDir);
	},
	filename: (_req, file, cb) => {
		const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
		const ext = path.extname(file.originalname).toLowerCase();
		cb(null, `avatar-${uniqueSuffix}${ext}`);
	},
});

function fileFilter(
	_req: Express.Request,
	file: Express.Multer.File,
	cb: multer.FileFilterCallback,
) {
	const allowed = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
	const ext = path.extname(file.originalname).toLowerCase();
	if (allowed.includes(ext)) {
		cb(null, true);
	} else {
		cb(new AppError("Only image files (jpg, png, webp, gif) are allowed", 400));
	}
}

export const avatarUpload = multer({
	storage,
	fileFilter,
	limits: { fileSize: 2 * 1024 * 1024 }, // 2MB max
});
