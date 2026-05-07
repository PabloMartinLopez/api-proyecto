import express from "express";
import {
  getUserCollections,
  createCollection,
  addGameToCollection
} from "../controllers/CollectionsController.js";

const router = express.Router();

router.get("/:User_id", getUserCollections);
router.post("/", createCollection);
router.post("/:collection_id/games", addGameToCollection);

export default router;
