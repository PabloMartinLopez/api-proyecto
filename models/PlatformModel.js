import sql from "../config/db.js";

export const getAllPlatforms = async () => {
  const Platforms = await sql`SELECT * FROM Platforms`;
  return Platforms;
};

export const getPlatformById = async (id) => {
  const Platform = await sql`SELECT * FROM Platforms WHERE id = ${id}`;
  return Platform[0];
};

export const getPlatformUser = async (id) => {
  const Platform = await sql`SELECT p.*
    FROM platforms_users pu JOIN users u ON pu.user_id = u.id
    JOIN platforms p ON pu.platform_id = p.id 
    WHERE u.id = ${id}`;
  return Platform;
};

export const createPlatform = async ({ name }) => {
  const [platform] = await sql`INSERT INTO platforms (name) VALUES (${name}) RETURNING *`;
  return platform;
};
