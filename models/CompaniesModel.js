import sql from "../config/db.js";

export const getAllCompanies = async () => {
  const companies = await sql`SELECT * FROM companies`;
  return companies;
};

export const createCompany = async ({ name, country_id }) => {
  const [company] = await sql`
    INSERT INTO companies (name,country_id)
    VALUES (${name},${country_id})
    RETURNING *
    `;
  return company;
};
