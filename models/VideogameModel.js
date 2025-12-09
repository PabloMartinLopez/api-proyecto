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
export const createVideogame = async ({ nombre, plataforma_id, nota, anio_lanzamiento }) => {
    const [game] = await sql`
        INSERT INTO Videogames (nombre, plataforma_id, nota, anio_lanzamiento)
        VALUES (${nombre}, ${plataforma_id}, ${nota}, ${anio_lanzamiento})
        RETURNING *
    `;
    return game;
};

// Actualizar videojuego
export const updateVideogameById = async (id, { nombre, plataforma_id, nota, anio_lanzamiento }) => {
    const [game] = await sql`
        UPDATE Videogames
        SET nombre = ${nombre},
            plataforma_id = ${plataforma_id},
            nota = ${nota},
            anio_lanzamiento = ${anio_lanzamiento}
        WHERE id = ${id}
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
