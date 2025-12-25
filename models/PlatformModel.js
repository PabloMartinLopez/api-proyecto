import sql from "../config/db.js"

export const getAllPlatforms = async () => {
    const Platforms = await sql`SELECT * FROM Platforms`;  
    return Platforms;
};

export const getPlatformById = async (id) => {
    const Platform = await sql`SELECT * FROM Platforms WHERE id = ${id}`;
    return Platform[0];
};