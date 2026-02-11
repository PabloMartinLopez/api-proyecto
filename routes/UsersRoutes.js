import express from "express";
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUserById,
  login,
  getUserSuggestion
} from "../controllers/UsersController.js";

const router = express.Router();

// router.get("/", getUsers);
// router.get("/:id", getUser);
router.get("/:id/suggestion", getUserSuggestion);
// router.post("/", createUser);
// router.put("/:id", updateUser);
// router.delete("/:id", deleteUserById);
router.post("/login", login);

export default router;
