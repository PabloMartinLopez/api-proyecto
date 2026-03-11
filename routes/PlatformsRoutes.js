import express from "express";
import { getPlatformUser, getAllPlatforms, createPlatform } from "../controllers/PlatformController.js";

const router = express.Router();

router.get("/", getAllPlatforms)
router.get("/users/:id", getPlatformUser);
router.post("/", createPlatform)

export default router;