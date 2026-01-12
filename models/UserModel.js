import sql from "../config/db.js"

export const getAllUsers = async () => {
    const users = await sql`SELECT * FROM users`;  
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
    if (!user) return null
    const updated = await sql`UPDATE users SET name = ${name}, email = ${email}, password = ${password} WHERE id = ${id} RETURNING *`;
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
    const [user] = await sql`SELECT id, name, email FROM users WHERE email = ${email} AND password = ${password}`;
    if (!user) return null

    return user;
};

export const getUserByUUID = async (uuid) => {
    const [user] = await sql`SELECT * FROM users WHERE uuid = ${uuid}`;
    if (!user) return null

    return user;
};