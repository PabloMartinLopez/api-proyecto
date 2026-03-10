import express from "express";
import {getPlatformUser, getAllPlatforms} from "../controllers/PlatformController.js";

const router = express.Router();

router.get("/", getAllPlatforms)
router.get("/users/:id", getPlatformUser);

export default router;