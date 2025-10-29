import {
    obtenerVideogames,
    obtenerVideogamePorId,
    crearVideogame,
    actualizarVideogame,
    eliminarVideogame
} from '../models/VideogameModel.js';

export const getVideogames = async (req, res) => {
    try {
        const Videogames = await obtenerVideogames();
        res.json(Videogames);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener Videogames' });
    }
};

export const getVideogame = async (req, res) => {
    try {
        const Videogame = await obtenerVideogamePorId(req.params.id);
        if (!Videogame) return res.status(404).json({ error: 'Videogame no encontrado' });
        res.json(Videogame);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener Videogame' });
    }
};

export const createVideogame = async (req, res) => {
    try {
        const nuevo = await crearVideogame(req.body);
        res.status(201).json(nuevo);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear Videogame' });
    }
};

export const updateVideogame = async (req, res) => {
    try {
        await actualizarVideogame(req.params.id, req.body);
        res.json({ message: 'Videogame actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar Videogame' });
    }
};

export const deleteVideogame = async (req, res) => {
    try {
        await eliminarVideogame(req.params.id);
        res.json({ message: 'Videogame eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar Videogame' });
    }
};
