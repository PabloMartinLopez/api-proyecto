import * as PlatformModel from "../models/PlatformModel.js";

export const getPlatforms = async (req, res) => {
  try {
    const users = await PlatformModel.getAllPlatforms();
    res.json(users);
  } catch (error) {
    res.status(500).json({
      code: error.code,
      error: error.message,
    });
  }
};

export const getPlatform = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await PlatformModel.getPlatformById(id);

    res.json(user);
  } catch (error) {
    res.status(500).json({
      code: error.code,
      error: error.message,
    });
  }
};
