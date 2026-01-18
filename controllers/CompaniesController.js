import { compile } from "morgan";
import * as CompaniesModel from "../models/CompaniesModel.js";

export const getCompanies = async (req, res) => {
  const companies = await CompaniesModel.getAllCompanies();
  res.json(companies);
};

export const createCompany = async (req, res) => {
  const { name } = req.body;

  console.log('➡️ createCompany called with:', name);

  try {
    const existingCompanies = await CompaniesModel.getCompaniesByName(name);
    console.log('🔎 existingCompanies:', existingCompanies);

    if (existingCompanies.length === 0) {
      const newCompany = await CompaniesModel.createCompany({ name });
      console.log('✅ newCompany created:', newCompany);

      res.status(201).json({
        company: newCompany,
      });
    } else {
      console.log('ℹ️ company already exists:', existingCompanies[0]);

      res.status(200).json({
        company: existingCompanies[0],
      });
    }
  } catch (error) {
    console.error('❌ error creating company:', error);

    res.status(500).json({
      code: error.code,
      error: error.message,
    });
  }
};


export const getCompaniesName = async (req, res) => {
  const { name } = req.query;
  try {
    const companies = await CompaniesModel.getCompaniesByName(name);
    res.status(200).json(companies);
  } catch (error) {
    res.status(500).json({
      code: error.code,
      error: error.message,
    });
  }
};
