import express from "express";
import {
  getUserCollections,
} from "../controllers/CollectionsController.js";

const router = express.Router();

router.get("/:User_id", getUserCollections);

export default router;
