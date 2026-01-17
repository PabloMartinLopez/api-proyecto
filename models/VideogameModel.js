import sql from "../config/db.js";

// Obtener todos los videojuegos
export const getAllVideogames = async () => {
  const rows = await sql`SELECT v.*, c.id AS "idEmpresa", c.name AS "Empresa"
    FROM videogames v LEFT JOIN companies_videogames cv ON v.id = cv.videogame_id
    LEFT JOIN companies c ON cv.company_id = c.id`;
  return rows;
};

// Obtener videojuego por ID
export const getVideogameById = async (id) => {
  const result = await sql`SELECT * FROM Videogames WHERE id = ${id}`;
  return result[0];
};

// Crear videojuego
export const createVideogame = async ({ name, genero, nota }) => {
  console.log(name, genero, nota);
  const [game] = await sql`
        INSERT INTO Videogames (name, genre, note)
        VALUES (${name}, ${genero}, ${nota})
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

export const createCompanyVideogame = async (company_id, videogame_id) => {
  const [relation] = await sql`
        INSERT INTO companies_videogames (company_id, videogame_id)
        VALUES (${company_id}, ${videogame_id})
        RETURNING *
        `;
  return relation;
};