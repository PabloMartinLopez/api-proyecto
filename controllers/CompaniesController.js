import * as CompaniesModel from "../models/CompaniesModel.js";

export const getCompanies = async (req, res) => {
  const companies = await CompaniesModel.getAllCompanies();
  res.json(companies);
};