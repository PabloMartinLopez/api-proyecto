import sql from "../config/db.js";

export const getAllCollections = async () => {
  const Collections = await sql`SELECT * FROM Collections`;
  return Collections;
};

export const getCollectionById = async (id) => {
  const [collection] = await sql`SELECT * FROM Collections WHERE id = ${id}`;
  return collection;
};

export const createCollection = async (name, user_id) => {
  const [newCollection] = await sql`
    INSERT INTO Collections (name)
    VALUES (${name})
    RETURNING *
    `;
  const CollectionUser = await sql`
    INSERT INTO collections_users (collection_id, user_id)
    VALUES (${newCollection.id}, ${user_id})
    RETURNING *
    `;
  return newCollection;
};

export const createCollectionUser = async (CollectionId, UserId) => {
  await sql`
    INSERT INTO collections_users (collection_id, user_id)
    VALUES (${CollectionId}, ${UserId})
    RETURNING *
    `;
};

export const getCollectionByNameUser = async (user_id, name) => {
  const [collection] = await sql`
    SELECT c.*
    FROM collections c
    JOIN collections_users cu ON c.id = cu.collection_id
    JOIN users u ON cu.user_id = u.id
    WHERE u.id = ${user_id} AND c.name LIKE ${name};
    `;
  return collection;
};