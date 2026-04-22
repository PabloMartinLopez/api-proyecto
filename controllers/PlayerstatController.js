import * as PlayerstatModel from "../models/PlayerstatModel.js";

export const getPlayerStats = async (req, res) => {
    try {
        const { id } = req.params;
        const stats = await PlayerstatModel.getStatsByUser(id);
        
        // Ensure values are numbers
        const total_games = stats.total_games ? parseInt(stats.total_games, 10) : 0;
        const total_hours = stats.total_hours ? parseFloat(stats.total_hours) : 0;

        res.status(200).json({
            total_games,
            total_hours
        });
    } catch (error) {
        console.error("Error fetching player stats:", error);
        res.status(500).json({ message: "Error fetching player stats", error: error.message });
    }
};
