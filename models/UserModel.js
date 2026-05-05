import sql from "../config/db.js";

export const getAllUsers = async () => {
  const users = await sql`SELECT id, name FROM users`;
  return users;
};

export const getUserById = async (id) => {
  const user = await sql`SELECT * FROM users WHERE id = ${id}`;
  return user[0];
};

export const createUser = async (user) => {
  const [newUser] = await sql`
        INSERT INTO users (name, email, password)
        VALUES (${user.name}, ${user.email}, ${user.password})
        RETURNING *
    `;
  return newUser;
};

export const updateUser = async (id, updatedUser) => {
  const { name, email, password } = updatedUser;
  const [user] = await sql`SELECT * FROM users WHERE id = ${id}`;
  if (!user) return null;
  const updated =
    await sql`UPDATE users SET name = ${name}, email = ${email}, password = ${password} WHERE id = ${id} RETURNING *`;
  return updated[0];
};

export const deleteUserById = async (id) => {
  const [deleted] = await sql`
        DELETE FROM users
        WHERE id = ${id}
        RETURNING *
    `;
  return deleted;
};

export const getUserLogin = async (email, password) => {
  const [user] =
    await sql`SELECT id, name, email FROM users WHERE email = ${email} AND password = ${password}`;
  if (!user) return null;

  return user;
};

export const getUserByUUID = async (uuid) => {
  const [user] = await sql`SELECT * FROM users WHERE uuid = ${uuid}`;
  if (!user) return null;

  return user;
};

export const getSuggestion = async (id) => {
  const games = await sql`
    SELECT DISTINCT v.*
    FROM videogames v
    JOIN collections_videogames cv ON v.id = cv.videogames_id
    JOIN collections_users cu ON cv.collection_id = cu.collection_id
    WHERE cu.user_id = ${id}
      AND v.id NOT IN (
        SELECT videogame_id 
        FROM games 
        WHERE user_id = ${id}
      )
  `;
  return games;
};

export const toggleFollowUser = async (followerId, followedId) => {
  // Check if they already follow each other
  const [existingFollow] = await sql`
    SELECT * FROM user_followers 
    WHERE follower_id = ${followerId} AND followed_id = ${followedId}
  `;

  if (existingFollow) {
    // Unfollow
    await sql`
      DELETE FROM user_followers 
      WHERE follower_id = ${followerId} AND followed_id = ${followedId}
    `;
    return { followed: false };
  } else {
    // Follow
    await sql`
      INSERT INTO user_followers (follower_id, followed_id) 
      VALUES (${followerId}, ${followedId})
    `;
    return { followed: true };
  }
};
