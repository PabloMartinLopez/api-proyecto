import * as GameModel from "../models/GameModel.js";

export const createGame = async (req, res) => {
    try {
        const { videogame_id } = req.params;
        const { user_id, platform_id, score, comment, hours } = req.body;

        const newGame = await GameModel.createGame({
            videogame_id,
            user_id,
            platform_id,
            score,
            comment,
            hours
        });

        res.status(201).json({ message: "Game created successfully", game: newGame });
    } catch (error) {
        console.error("Error creating game:", error);
        res.status(500).json({ message: "Error creating game", error: error.message });
    }
};

export const getCommentsByVideogame = async (req, res) => {
    try {
        const { videogame_id } = req.params;
        const comments = await GameModel.getCommentsByVideogame(videogame_id);
        res.status(200).json(comments);
    } catch (error) {
        console.error("Error fetching comments by videogame:", error);
        res.status(500).json({ message: "Error fetching comments", error: error.message });
    }
};

export const getCommentsByUser = async (req, res) => {
    try {
        const { user_id } = req.params;
        const comments = await GameModel.getCommentsByUser(user_id);
        res.status(200).json(comments);
    } catch (error) {
        console.error("Error fetching comments by user:", error);
        res.status(500).json({ message: "Error fetching comments", error: error.message });
    }
};
