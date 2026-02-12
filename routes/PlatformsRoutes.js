import express from "express";
import {getPlatformUser} from "../controllers/PlatformController.js";

const router = express.Router();

router.get("/users/:id", getPlatformUser);

export default router;