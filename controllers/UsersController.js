import * as UsersModel from "../models/UserModel.js";

export const getUsers = async (req, res) => {
  try {
    const users = await UsersModel.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({
      code: error.code,
      error: error.message,
    });
  }
};

export const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await UsersModel.getUserById(id);

    res.json(user);
  } catch (error) {
    res.status(500).json({
      code: error.code,
      error: error.message,
    });
  }
};

export const createUser = async (req, res) => {
  console.log(req.body);

  const { name, email, password } = req.body;
  try {
    const newUser = await UsersModel.createUser({ name, email, password });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({
      code: error.code,
      error: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;

  try {
    const { name, email, password } = req.body;
    const updated = await UsersModel.updateUser(id, { name, email, password });
    res.json(updated);
  } catch (error) {
    res.status(500).json({
      code: error.code,
      error: error.message,
    });
  }
};

export const deleteUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await UsersModel.deleteUserById(id);
    if (!deleted) return res.status(404).json({ error: "No encontrado" });
    res.json({ message: "Eliminado correctamente" });
  } catch (error) {
    console.log(error.code);
    if (error.code === "23503") {
      res
        .status(500)
        .json({ error: "Este campo tiene relaciones que no puedes borrar" });
    }
    res.status(500).json({
      code: error.code,
      error: error.message,
    });
  }
};
