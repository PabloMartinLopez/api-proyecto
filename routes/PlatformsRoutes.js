import express from "express";
import {getPlatform, getPlatforms} from "../controllers/PlatformController.js";

const router = express.Router();

router.get("/", getPlatforms);
router.get("/:id", getPlatform);

export default router;