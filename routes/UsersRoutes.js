import express from "express";
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUserById,
} from "../controllers/UsersController.js";

const router = express.Router();

router.get("/", getUsers);
router.get("/:id", getUser);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUserById);

export default router;
