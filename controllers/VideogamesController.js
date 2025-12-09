import * as VideogamesModel from "../models/VideogameModel.js";

export const getVideogames = async (req, res) => {
    try {
        const videogames = await VideogamesModel.getAllVideogames();
        res.json(videogames);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getVideogame = async (req, res) => {
    const { id } = req.params;
    try {
        const game = await VideogamesModel.getVideogameById(id);
        if (!game) return res.status(404).json({ error: "No encontrado" });
        res.json(game);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createVideogame = async (req, res) => {
    const { nombre, plataforma_id, nota, anio_lanzamiento } = req.body;
    try {
        const newGame = await VideogamesModel.createVideogame({ nombre, plataforma_id, nota, anio_lanzamiento });
        res.status(201).json(newGame);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};