import sql from "../config/db.js";

// Crear un registro de un juego para un usuario (con su valoración, plataforma y comentarios)
export const createGame = async (gameData) => {
    const { videogame_id, user_id, platform_id, score, comment, hours } = gameData;

    // Tratamos los valores opcionales
    const finalScore = score !== undefined && score !== '' ? score : null;
    const finalComment = comment !== undefined && comment !== '' ? comment : null;
    const finalHours = hours !== undefined && hours !== '' ? hours : null;

    const [newGame] = await sql`
        INSERT INTO games (videogame_id, user_id, platform_id, note, player_notes, total_time)
        VALUES (${videogame_id}, ${user_id}, ${platform_id}, ${finalScore}, ${finalComment}, ${finalHours})
        RETURNING *
    `;

    return newGame;
};

// Obtener todos los comentarios de un juego específico
export const getCommentsByVideogame = async (videogame_id) => {
    const comments = await sql`
        SELECT g.id, g.note, g.player_notes, g.total_time, g.created_at,
               u.id AS user_id, u.name AS user_name, u.avatar AS user_avatar,
               p.id AS platform_id, p.name AS platform_name
        FROM games g
        JOIN users u ON g.user_id = u.id
        LEFT JOIN platforms p ON g.platform_id = p.id
        WHERE g.videogame_id = ${videogame_id} 
          AND g.player_notes IS NOT NULL 
          AND g.player_notes != ''
        ORDER BY g.created_at DESC
    `;
    return comments;
};

// Obtener todos los comentarios hechos por un jugador específico
export const getCommentsByUser = async (user_id) => {
    const comments = await sql`
        SELECT g.id, g.note, g.player_notes, g.total_time, g.created_at,
               v.id AS videogame_id, v.name AS videogame_name, v.cover AS videogame_cover,
               p.id AS platform_id, p.name AS platform_name
        FROM games g
        JOIN videogames v ON g.videogame_id = v.id
        LEFT JOIN platforms p ON g.platform_id = p.id
        WHERE g.user_id = ${user_id} 
          AND g.player_notes IS NOT NULL 
          AND g.player_notes != ''
        ORDER BY g.created_at DESC
    `;
    return comments;
};
