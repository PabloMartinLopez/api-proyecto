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

  await VideogamesModel.linkAllEntities(game, company, collection);

  res.status(201).json({ message: "Videogame creado exitosamente", game, company, collection });
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