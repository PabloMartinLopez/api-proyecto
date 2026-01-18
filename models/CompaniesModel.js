import sql from "../config/db.js";

export const getAllCompanies = async () => {
  const companies = await sql`SELECT * FROM companies`;
  return companies;
};

export const createCompany = async (company) => {
  const [newCompany] = await sql`
  INSERT INTO companies (name, country_id)
  VALUES (${company.name}, 75)
  RETURNING *
`;
  return newCompany;
}

export const getCompanyByName = async (name) => {
  const companies = await sql`SELECT * FROM companies WHERE name LIKE ${name}`;  
  return companies;
}