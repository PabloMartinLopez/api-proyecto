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
  const { id, name, genero, nota, companyId, collectionId, platformId, plataforma_id, user_id, cover } = req.body;
  const finalPlatformId = platformId || plataforma_id;

  // Imprimos los valores concretos recibidos para facilitar la depuración
  console.log("=== PARÁMETROS RECIBIDOS MIENTRAS SE CREABA EL JUEGO ===");
  console.log(req.body);
  console.log("=========================================================");

  try {
    let game;
    let company;

    // Sanitizamos los IDs que pueden venir como string 'null' o '0' desde el frontend
    const sanitizeId = (id) => (id === 'null' || id === '0' || id === 0 || !id) ? null : id;

    let collection = { id: sanitizeId(collectionId) };
    let platform = { id: sanitizeId(finalPlatformId) };

    if (id) {
      game = await VideogamesModel.getVideogameById(id);
    } else if (name) {
      game = await VideogamesModel.getVideogameByName(name);
    }

    if (game) {
      company = null; // Los datos de empresa se omiten para un juego que ya existe
    } else {
      game = await VideogamesModel.createVideogame({
        name,
        genero,
        nota,
        cover,
      });
      company = [{ id: sanitizeId(companyId) || 1 }];
    }

    await VideogamesModel.linkAllEntities(game, company, collection, platform, user_id);

    res.status(201).json({ message: id ? "Videogame vinculado exitosamente" : "Videogame creado exitosamente", game, companyId, collectionId, platformId: finalPlatformId });
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