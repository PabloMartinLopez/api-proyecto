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

export const createCompany = async (req, res) => {
  const { name } = req.body;
  
  try {
    const newCompany = await CompaniesModel.createCompany({ name, country_id: "75" });
    res.status(201).json(newCompany);
  } catch (error) {
    res.status(500).json({
      code: error.code,
      error: error.message,
    });
  }
};


