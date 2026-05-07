import sql from "../config/db.js";

export const getAllUsers = async () => {
  const users = await sql`SELECT id, name FROM users`;
  return users;
};

export const getUserById = async (id, currentUserId = null) => {
  const user = await sql`
    SELECT 
      u.*,
      (SELECT COUNT(*) FROM user_followers WHERE followed_id = u.id)::int as followers_count,
      (SELECT COUNT(*) FROM user_followers WHERE follower_id = u.id)::int as following_count
    FROM users u 
    WHERE u.id = ${id}
  `;

  if (!user[0]) return null;

  const userData = user[0];

  if (currentUserId) {
    const [isFollowing] = await sql`
      SELECT 1 FROM user_followers 
      WHERE follower_id = ${currentUserId} AND followed_id = ${id}
    `;
    userData.is_following = !!isFollowing;
  } else {
    userData.is_following = false;
  }

  return userData;
};

export const createUser = async (user) => {
  const [newUser] = await sql`
        INSERT INTO users (name, email, password, uuid)
        VALUES (${user.name}, ${user.email}, ${user.password}, ${user.uuid})
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
    SELECT vg.*
FROM
    collections_videogames cv
    JOIN collections_users cu ON cv.collection_id = cu.collection_id
    JOIN videogames vg on cv.videogames_id = vg.id
WHERE
    cu.user_id = ${id}
    GROUP BY vg.id
    ORDER BY RANDOM()
    LIMIT 5
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
