import * as VideogamesModel from "../models/VideogameModel.js";
import * as CompanyModel from "../models/CompaniesModel.js";
import * as CollecionsModel from "../models/CollectionsModel.js";

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
  const { id, name, collectionId, platformId, plataforma_id, user_id } = req.body;
  const finalPlatformId = platformId || plataforma_id;

  try {
    let game;

    // Sanitizamos los IDs que pueden venir como string 'null' o '0' desde el frontend
    const sanitizeId = (id) => (id === 'null' || id === '0' || id === 0 || !id) ? null : id;

    const sanitizedCollectionId = sanitizeId(collectionId);
    let collection = { id: sanitizedCollectionId };
    let platform = { id: sanitizeId(finalPlatformId) };

    if (id) {
      game = await VideogamesModel.getVideogameById(id);
    } else if (name) {
      game = await VideogamesModel.getVideogameByName(name);
    }

    if (!game) {
      return res.status(404).json({ error: "El videojuego no existe. No se puede insertar." });
    }

    if (sanitizedCollectionId) {
      const targetCollection = await CollecionsModel.getCollectionById(sanitizedCollectionId);
      if (!targetCollection) {
        return res.status(404).json({ error: "La colección no existe." });
      }
    } else {
      return res.status(400).json({ error: "Se requiere una colección para insertar el juego." });
    }

    await VideogamesModel.linkAllEntities(game, collection, platform, user_id);

    res.status(201).json({ message: "Videogame vinculado exitosamente", game, collectionId: sanitizedCollectionId, platformId: finalPlatformId });
  } catch (error) {
    console.error("CREATE VIDEOGAME ERROR:", error);
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