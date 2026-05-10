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

export const getUserFeed = async (userId) => {
  const feed = await sql`
    WITH feed AS (
      -- 1. GAMES (Usuario interactua con un juego)
      SELECT 
        'game' AS type,
        u.id AS actor_id,
        u.name AS actor_name,
        v.id AS videogame_id,
        v.name AS videogame_name,
        v.cover AS videogame_cover,
        NULL::bigint AS target_user_id,
        NULL::varchar AS target_user_name,
        NULL::varchar AS collection_name,
        g.note AS note,
        g.player_notes AS review,
        g.created_at AS created_at
      FROM games g
      JOIN users u ON g.user_id = u.id
      JOIN videogames v ON g.videogame_id = v.id
      WHERE u.id = ${userId} OR u.id IN (SELECT followed_id FROM user_followers WHERE follower_id = ${userId})

      UNION ALL

      -- 2. FOLLOWS (Usuario sigue a otro usuario)
      SELECT
        'follow' AS type,
        u1.id AS actor_id,
        u1.name AS actor_name,
        NULL::bigint AS videogame_id,
        NULL::varchar AS videogame_name,
        NULL::text AS videogame_cover,
        u2.id AS target_user_id,
        u2.name AS target_user_name,
        NULL::varchar AS collection_name,
        NULL::numeric AS note,
        NULL::text AS review,
        uf.created_at AS created_at
      FROM user_followers uf
      JOIN users u1 ON uf.follower_id = u1.id
      JOIN users u2 ON uf.followed_id = u2.id
      WHERE uf.follower_id = ${userId} 
         OR uf.follower_id IN (SELECT followed_id FROM user_followers WHERE follower_id = ${userId})
         OR uf.followed_id = ${userId}

      UNION ALL

      -- 3. COLLECTIONS (Usuario añade un juego a una colección)
      SELECT
        'collection' AS type,
        u.id AS actor_id,
        u.name AS actor_name,
        v.id AS videogame_id,
        v.name AS videogame_name,
        v.cover AS videogame_cover,
        NULL::bigint AS target_user_id,
        NULL::varchar AS target_user_name,
        c.name AS collection_name,
        NULL::numeric AS note,
        NULL::text AS review,
        cv.created_at AS created_at
      FROM collections_videogames cv
      JOIN collections c ON cv.collection_id = c.id
      JOIN collections_users cu ON c.id = cu.collection_id
      JOIN users u ON cu.user_id = u.id
      JOIN videogames v ON cv.videogames_id = v.id
      WHERE u.id = ${userId} OR u.id IN (SELECT followed_id FROM user_followers WHERE follower_id = ${userId})
    )
    SELECT * FROM feed 
    ORDER BY created_at DESC NULLS LAST
    LIMIT 50;
  `;

  // Format the messages before returning
  const formattedFeed = feed.map(item => {
    let message = "";
    if (item.type === 'game') {
      message = `${item.actor_name} ha valorado ${item.videogame_name} con ${item.note}`;
    } else if (item.type === 'follow') {
      message = `${item.actor_name} sigue a ${item.target_user_name}`;
    } else if (item.type === 'collection') {
      message = `${item.actor_name} añadió ${item.videogame_name} a su colección ${item.collection_name}`;
    }

    return {
      ...item,
      message
    };
  });

  return formattedFeed;
};

export const getUserVideogames = async (userId) => {
  const videogames = await sql`
    SELECT 
        vg.id AS id,
        vg.name AS name,
        vg.cover AS cover,
        vg.genre,
        vg.note,
        vg.descripcion,
        vg.released_date,
        c.id AS collection_id,
        c.name AS collection_name
    FROM collections_users cu
    JOIN collections c ON cu.collection_id = c.id
    JOIN collections_videogames cv ON c.id = cv.collection_id
    JOIN videogames vg ON cv.videogames_id = vg.id
    WHERE cu.user_id = ${userId}
  `;
  return videogames;
};
