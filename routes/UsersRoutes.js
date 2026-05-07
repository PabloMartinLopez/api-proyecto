import express from "express";
import {
  login,
  register,
  getUserSuggestion,
  getAllUsers,
  getUserById,
  toggleFollow
} from "../controllers/UsersController.js";

const router = express.Router();

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.get("/:id/suggestion", getUserSuggestion);
router.post("/:id/follow", toggleFollow);
router.post("/login", login);
router.post("/register", register);

export default router;
