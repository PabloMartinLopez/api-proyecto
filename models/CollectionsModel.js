import sql from "../config/db.js";

export const getAllCollections = async () => {
  const Collections = await sql`SELECT * FROM Collections`;
  return Collections;
};

export const createCollection = async (name) => {
  const [newCollection] = await sql`
    INSERT INTO Collections (name)
    VALUES (${name})
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
