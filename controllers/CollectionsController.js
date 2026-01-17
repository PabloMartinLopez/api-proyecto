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

export const createUserCollection = async (req, res) => {
  const { User_id } = req.params;
  const { name } = req.body;
  try {
    console.log(User_id, name);
    const newCollection = await collectionModel.createCollection(name);
    await collectionModel.createCollectionUser(newCollection.id, User_id);
    res.status(201).json(newCollection);
  } catch (error) {
    res.status(500).json({
      code: error.code,
      error: error.message,
    });
  }
};
