import express from "express";
import { getPlayerStats } from "../controllers/PlayerstatController.js";

const router = express.Router();

router.get("/:id", getPlayerStats);

export default router;
