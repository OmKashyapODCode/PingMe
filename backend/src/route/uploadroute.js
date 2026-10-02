import express from "express";
import { uploadImage } from "../controller/uploadController.js";
import { protectRoute } from "../middleware/authmiddleware.js";

const router = express.Router();

// POST /api/upload/image - upload a base64 image, get back a Cloudinary URL
router.post("/image", protectRoute, uploadImage);

export default router;
