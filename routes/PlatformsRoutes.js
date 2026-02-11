import express from "express";
import {getPlatform, getPlatforms, getPlatformUser} from "../controllers/PlatformController.js";

const router = express.Router();

// router.get("/", getPlatforms);
router.get("/users/:id", getPlatformUser);
// router.get("/:id", getPlatform);

export default router;