import sql from "../config/db.js";

export const getStatsByUser = async (user_id) => {
    const stats = await sql`
        SELECT COUNT(*) AS total_games, COALESCE(SUM(NULLIF(total_time, '')::numeric), 0) AS total_hours 
        FROM games 
        WHERE user_id = ${user_id}
    `;
    return stats[0] || { total_games: 0, total_hours: 0 };
};
