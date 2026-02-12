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