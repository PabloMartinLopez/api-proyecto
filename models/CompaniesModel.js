import sql from "../config/db.js";

export const getAllCompanies=async()=>{
    const companies=await sql`SELECT * FROM companies`;
    return companies;
}