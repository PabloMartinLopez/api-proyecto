import sql from "../config/db.js";

// Obtener todos los videojuegos
export const getAllVideogames = async () => {
  const rows = await sql`SELECT * FROM videogames`;
  return rows;
};

// Obtener videojuego por ID
export const getVideogameById = async (id) => {
  const result = await sql`SELECT * FROM Videogames WHERE id = ${id}`;
  return result[0];
};

// Crear videojuego
export const createVideogame = async ({
  nombre,
  plataforma_id,
  nota,
  anio_lanzamiento,
}) => {
  const [game] = await sql`
        INSERT INTO Videogames (nombre, plataforma_id, nota, anio_lanzamiento)
        VALUES (${nombre}, ${plataforma_id}, ${nota}, ${anio_lanzamiento})
        RETURNING *
    `;
  return game;
};

// Eliminar videojuego
export const deleteVideogameById = async (id) => {
  const [deleted] = await sql`
        DELETE FROM Videogames
        WHERE id = ${id}
        RETURNING *
    `;
  return deleted;
};

// Actualizar videojuego por el id
export const updateVideogame = async (id, updatedGame) => {
  const { nombre, plataforma_id, nota, anio_lanzamiento } = updatedGame;
  const [game] = await sql`SELECT * FROM Videogames WHERE id = ${id}`;
  if (!game) return null;
  const updated =
    await sql`UPDATE Videogames SET nombre = ${nombre}, plataforma_id = ${plataforma_id}, nota = ${nota}, anio_lanzamiento = ${anio_lanzamiento} WHERE id = ${id} RETURNING *`;
  return updated[0];
};

export const getUserGames = async (UserId) => {
  const rows = await sql`SELECT v.*, c.name as Collection
    FROM videogames v JOIN collections_videogames cv ON v.id = cv.videogames_id
    JOIN collections c ON cv.collection_id = c.id
    JOIN collections_users cu ON cu.collection_id = c.id
    JOIN users u ON u.id = cu.user_id
    
    WHERE u.id = ${UserId};`;
  return rows;
};
