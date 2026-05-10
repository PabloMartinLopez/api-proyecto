import express from "express";
import {
  login,
  register,
  getUserSuggestion,
  getAllUsers,
  getUserById,
  toggleFollow,
  getUserFeed,
  getUserVideogames
} from "../controllers/UsersController.js";

const router = express.Router();

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.get("/:id/videogames", getUserVideogames);
router.get("/:id/suggestion", getUserSuggestion);
router.get("/:id/feed", getUserFeed);
router.post("/:id/follow", toggleFollow);
router.post("/login", login);
router.post("/register", register);

export default router;
