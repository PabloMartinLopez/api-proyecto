import express from "express";
import {
  getUserCollections,
  createCollection
} from "../controllers/CollectionsController.js";

const router = express.Router();

router.get("/:User_id", getUserCollections);
router.post("/", createCollection);

export default router;
