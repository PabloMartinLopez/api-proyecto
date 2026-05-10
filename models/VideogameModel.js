import sql from "../config/db.js";

// Obtener todos los videojuegos
export const getAllVideogames = async () => {
  const rows = await sql`
    SELECT v.*, 
        c.id AS "idEmpresa", c.name AS "Empresa",
        COALESCE(json_agg(json_build_object('id', p.id, 'name', p.name)) FILTER (WHERE p.id IS NOT NULL), '[]') AS platforms
    FROM videogames v 
    LEFT JOIN companies_videogames cv ON v.id = cv.videogames_id
    LEFT JOIN companies c ON cv.company_id = c.id
    LEFT JOIN platforms_videogames pv ON v.id = pv.videogames_id
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
    LEFT JOIN companies_videogames cv ON v.id = cv.videogames_id
    LEFT JOIN companies c ON cv.company_id = c.id
    LEFT JOIN platforms_videogames pv ON v.id = pv.videogames_id
    LEFT JOIN platforms p ON pv.platform_id = p.id
    LEFT JOIN games g ON g.videogame_id = v.id
    WHERE v.id = ${id}
    GROUP BY v.id, c.id, c.name
  `;
  return result[0];
};

// Crear un nuevo videojuego
export const createVideogame = async (videogame) => {
  const { nombre, genero, nota, portada, id_compania, plataformas, descripcion, released_date } = videogame;

  const [newVideogame] = await sql`
    INSERT INTO videogames (name, genre, note, cover, descripcion, released_date)
    VALUES (${nombre}, ${genero}, ${nota || null}, ${portada || ''}, ${descripcion || null}, ${released_date || null})
    RETURNING *
  `;

  if (id_compania) {
    await sql`
      INSERT INTO companies_videogames (videogames_id, company_id)
      VALUES (${newVideogame.id}, ${id_compania})
    `;
  }

  if (plataformas && Array.isArray(plataformas) && plataformas.length > 0) {
    for (const platformId of plataformas) {
      await sql`
        INSERT INTO platforms_videogames (videogames_id, platform_id)
        VALUES (${newVideogame.id}, ${platformId})
      `;
    }
  }

  return newVideogame;
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

