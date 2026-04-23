import * as PlayerstatModel from "../models/PlayerstatModel.js";

export const getPlayerStats = async (req, res) => {
    try {
        const { id } = req.params;
        const stats = await PlayerstatModel.getStatsByUser(id);
        
        let total_games = Number(stats?.total_games);
        if (isNaN(total_games)) total_games = 0;

        let total_hours = Number(stats?.total_hours);
        if (isNaN(total_hours)) total_hours = 0;

        res.status(200).json({
            total_games,
            total_hours
        });
    } catch (error) {
        console.error("Error fetching player stats:", error);
        res.status(500).json({ message: "Error fetching player stats", error: error.message });
    }
};
