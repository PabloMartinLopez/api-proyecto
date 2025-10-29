import db from '../config/db.js';

export const obtenerVideogames = async () => {
    const [rows] = await db.query('SELECT * FROM Videogames');
    return rows;
};

export const obtenerVideogamePorId = async (id) => {
    const [rows] = await db.query('SELECT * FROM Videogames WHERE id = ?', [id]);
    return rows[0];
};

export const crearVideogame = async ({ nombre, puesto, salario }) => {
    const [result] = await db.query(
        'INSERT INTO Videogames (nombre, genero) VALUES (?, ?, ?)',
        [nombre, genero]
    );
    return { id: result.insertId, nombre, genero };
};

export const actualizarVideogame = async (id, { nombre, genero }) => {
    await db.query(
        'UPDATE Videogames SET nombre = ?, genero = ? WHERE id = ?',
        [nombre, genero, id]
    );
};

export const eliminarVideogame = async (id) => {
    await db.query('DELETE FROM Videogames WHERE id = ?', [id]);
};