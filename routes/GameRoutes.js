import express from "express";
import { createGame, getCommentsByVideogame, getCommentsByUser } from "../controllers/GameController.js";

const router = express.Router();

router.post("/:videogame_id", createGame);
router.get("/:videogame_id", getCommentsByVideogame);
router.get("/user/:user_id", getCommentsByUser);

export default router;
