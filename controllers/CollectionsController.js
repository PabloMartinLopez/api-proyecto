import * as collectionModel from "../models/CollectionsModel.js";

export const getUserCollections = async (req, res) => {
  const { User_id } = req.params;

  try {
    const collections = await collectionModel.getCollectionsByUserId(User_id);
    res.json(collections);
  } catch (error) {
    res.status(500).json({
      code: error.code,
      error: error.message,
    });
  }
};

export const createCollection = async (req, res) => {
  const { nombre, id_jugador } = req.body;

  try {
    const newCollection = await collectionModel.createCollection(nombre, id_jugador);
    res.status(201).json(newCollection);
  } catch (error) {
    res.status(500).json({
      code: error.code,
      error: error.message,
    });
  }
};

export const addGameToCollection = async (req, res) => {
  const { collection_id } = req.params;
  const { videogame_id } = req.body;

  if (!collection_id || !videogame_id) {
    return res.status(400).json({ error: "collection_id in params and videogame_id in body are required" });
  }

  try {
    const newEntry = await collectionModel.addGameToCollection(collection_id, videogame_id);
    res.status(201).json({ message: "Game added to collection successfully", data: newEntry });
  } catch (error) {
    if (error.message === "Collection does not exist" || error.message === "Videogame does not exist") {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};