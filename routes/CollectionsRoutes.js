import express from "express";
import {
  getUserCollections,
  createUserCollection,
} from "../controllers/CollectionsController.js";

const router = express.Router();

// router.get("/:User_id", getUserCollections);
// router.post("/:User_id", createUserCollection);

export default router;
