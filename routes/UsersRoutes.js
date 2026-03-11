import express from "express";
import {
  login,
  getUserSuggestion,
  getAllUsers
} from "../controllers/UsersController.js";

const router = express.Router();

router.get("/", getAllUsers);
router.get("/:id/suggestion", getUserSuggestion);
router.post("/login", login);

export default router;
