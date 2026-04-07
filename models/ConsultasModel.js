import sql from "../config/db.js";

export const getBusqueda = async (cadBusq) => {
  // El uso de ${} dentro de los backticks de 'sql'
  // gestiona automáticamente los parámetros de forma segura.
  const term = `%${(cadBusq || "").toLowerCase()}%`;
  
  const companies = await sql`
    SELECT id, name, 'videogame' as cat 
    FROM Videogames 
    WHERE lower(name) LIKE ${term}
    UNION 
    SELECT id, name, 'user' as cat 
    FROM users 
    WHERE lower(name) LIKE ${term}
  `;

  return companies;
};
