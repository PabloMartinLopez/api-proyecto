import * as PlatformModel from "../models/PlatformModel.js";

export const getPlatformUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await PlatformModel.getPlatformUser(id);
    res.json(user);
  } catch (error) {
    res.status(500).json({
      code: error.code,
      error: error.message,
    });
  }
};

export const getAllPlatforms = async (req, res) => {
  const { id } = req.params;
  try {
    const platforms = await PlatformModel.getAllPlatforms(id);
    res.json(platforms);
  } catch (error) {
    res.status(500).json({
      code: error.code,
      error: error.message,
    });
  }
}