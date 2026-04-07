import * as collectionModel from "../models/CollectionsModel.js";

export const getUserCollections = async (req, res) => {
  const { User_id } = req.params;

  try {
    const collections = await collectionModel.getAllCollections(User_id);
    res.json(collections);
  } catch (error) {
    res.status(500).json({
      code: error.code,
      error: error.message,
    });
  }
};

export const createCollection = async (req, res) => {
  const { name, user_id } = req.body;

  try {
    const newCollection = await collectionModel.createCollection(name, user_id);
    res.status(201).json(newCollection);
  } catch (error) {
    res.status(500).json({
      code: error.code,
      error: error.message,
    });
  }
};