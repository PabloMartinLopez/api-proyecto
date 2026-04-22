import sql from "../config/db.js";

// Obtener todos los videojuegos
export const getAllVideogames = async () => {
  const rows = await sql`
    SELECT v.*, 
           c.id AS "idEmpresa", c.name AS "Empresa",
           COALESCE(json_agg(json_build_object('id', p.id, 'name', p.name)) FILTER (WHERE p.id IS NOT NULL), '[]') AS platforms
    FROM videogames v 
    LEFT JOIN companies_videogames cv ON v.id = cv.videogame_id
    LEFT JOIN companies c ON cv.company_id = c.id
    LEFT JOIN platforms_videogames pv ON v.id = pv.videogame_id
    LEFT JOIN platforms p ON pv.platform_id = p.id
    GROUP BY v.id, c.id, c.name
  `;
  return rows;
};

// Obtener videojuego por ID
export const getVideogameById = async (id) => {
  const result = await sql`
    SELECT v.*, 
           c.id AS "idEmpresa", c.name AS "Empresa",
           COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', p.id, 'name', p.name)) FILTER (WHERE p.id IS NOT NULL), '[]') AS platforms,
           COALESCE(jsonb_agg(DISTINCT jsonb_build_object(
             'id', g.id,
             'user_id', g.user_id,
             'platform_id', g.platform_id,
             'complete', g.complete,
             'note', g.note,
             'total_time', g.total_time,
             'player_notes', g.player_notes
           )) FILTER (WHERE g.id IS NOT NULL), '[]') AS games
    FROM videogames v 
    LEFT JOIN companies_videogames cv ON v.id = cv.videogame_id
    LEFT JOIN companies c ON cv.company_id = c.id
    LEFT JOIN platforms_videogames pv ON v.id = pv.videogame_id
    LEFT JOIN platforms p ON pv.platform_id = p.id
    LEFT JOIN games g ON g.videogame_id = v.id
    WHERE v.id = ${id}
    GROUP BY v.id, c.id, c.name
  `;
  return result[0];
};

// Obtener videojuego por nombre
export const getVideogameByName = async (name) => {
  const result = await sql`
    SELECT *
    FROM videogames
    WHERE LOWER(name) = LOWER(${name})
    LIMIT 1
  `;
  return result[0];
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
    FROM videogames v JOIN collections_videogames cv ON v.id = cv.videogame_id
    JOIN collections c ON cv.collection_id = c.id
    JOIN collections_users cu ON cu.collection_id = c.id
    JOIN users u ON u.id = cu.user_id
    WHERE u.id = ${UserId};`;
  return rows;
};


export const linkAllEntities = async (videogame, collection, platform, user_id) => {

  if (collection && collection.id) {
    const videogameCollectionLink =
      await sql` INSERT INTO collections_videogames (collection_id, videogame_id)
          VALUES (${collection.id}, ${videogame.id})
          RETURNING *`;
  }

  if (platform && platform.id) {
    const videogamePlatformLink =
      await sql` INSERT INTO platforms_videogames (platform_id, videogame_id)
          VALUES (${platform.id}, ${videogame.id})
          ON CONFLICT DO NOTHING
          RETURNING *`;

    // También registramos que el usuario tiene esta plataforma (si no la tenía ya)
    if (user_id) {
      await sql` INSERT INTO platforms_users (platform_id, user_id)
          VALUES (${platform.id}, ${user_id})
          ON CONFLICT (platform_id, user_id) DO NOTHING`;
    }
  }
  return true;
};
