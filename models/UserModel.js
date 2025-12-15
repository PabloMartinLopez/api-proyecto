import sql from "../config/db.js"

export const getAllUsers = async (req, res) => {
    const users = await sql`SELECT * FROM users`;
    res.json(users);
};

export const getUserById = async (req, res) => {
    const { id } = req.params;
    const user = await sql`SELECT * FROM users WHERE id = ${id}`;
    res.json(user);
};

export const createUser = async (req, res) => {
    const { nombre, email, password } = req.body;
    const user = await sql`SELECT * FROM users WHERE email = ${email}`;
    if (user) return res.status(400).json({ error: "El usuario ya existe" });
    const newUser = await sql`INSERT INTO users (nombre, email, password) VALUES (${nombre}, ${email}, ${password}) RETURNING *`;
    res.status(201).json(newUser);
};

export const deleteUserById = async (req, res) => {
    const { id } = req.params;
    const deleted = await sql`DELETE FROM users WHERE id = ${id} RETURNING *`;
    res.json(deleted);
};

export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { nombre, email, password } = req.body;
    const updated = await sql`UPDATE users SET nombre = ${nombre}, email = ${email}, password = ${password} WHERE id = ${id} RETURNING *`;
    res.json(updated);
};