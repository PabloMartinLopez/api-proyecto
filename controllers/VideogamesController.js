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
  const { name, genero, nota, companyName, collectionName, user_id } = req.body;
  let game = await VideogamesModel.createVideogame({
    name,
    genero,
    nota,
  });
  console.log("----");

  let company = await CompanyModel.getCompanyByName(companyName);
  if (company.length === 0) {
    company = await CompanyModel.createCompany({ name: companyName });
  }

  let collection = await CollecionsModel.getCollectionByNameUser(
    user_id,
    collectionName,
  );
  if (!collection) {
    collection = await CollecionsModel.createCollection(collectionName, user_id);
  }

  console.log(game.id);
  console.log(company);
  console.log(collection.id);
  console.log("----");

  await VideogamesModel.linkAllEntities(game, company, collection);

  res.status(201).json({ message: "Videogame creado exitosamente", game, company, collection });
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

export const addCollecion = async (req, res) => {
  const { collection_id } = req.params;
  const { game_id } = req.body;
  try {
    const result = await VideogamesModel.addCollection(collection_id, game_id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
