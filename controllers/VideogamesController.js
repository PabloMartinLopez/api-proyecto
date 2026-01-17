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
  const { name, genero, nota, company_id } = req.body;

  try {
    // console.log(req.body);
    const newGame = await VideogamesModel.createVideogame({
      name,
      genero,
      nota,
    });
    await VideogamesModel.createCompanyVideogame(company_id, newGame.id);
    console.log(newGame);

    res.status(201).json(newGame);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteVideogameById = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await VideogamesModel.deleteVideogameById(id);
    if (!deleted) return res.status(404).json({ error: "No encontrado" });
    res.json({ message: "Eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateVideogame = async (req, res) => {
  const { id } = req.params;

  try {
    const { nombre, plataforma_id, nota, anio_lanzamiento } = req.body;
    const updated = await VideogamesModel.updateVideogame(id, {
      nombre,
      plataforma_id,
      nota,
      anio_lanzamiento,
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserGames = async (req, res) => {
  const { id } = req.params;
  try {
    const games = await VideogamesModel.getUserGames(id);
    res.json(games);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
