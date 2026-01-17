import * as CompaniesModel from "../models/CompaniesModel.js";

export const getCompanies = async (req, res) => {
  try {
    const companies = await CompaniesModel.getAllCompanies();
    res.json(companies);
  } catch (error) {
    res.status(500).json({
      code: error.code,
      error: error.message,
    });
  }
};
