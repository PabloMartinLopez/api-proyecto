import * as UsersModel from "../models/UserModel.js";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase.js";

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      error: "Email y password son obligatorios",
    });
  }

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );

    const firebaseUser = userCredential.user;

    const userBd = UsersModel.getUserByUUID(firebaseUser.uid);

    return res.status(200).json({
      user: await userBd,
    });
  } catch (error) {
    return res.status(401).json({
      error: "Credenciales inválidas",
      debug: error.code,
    });
  }
};

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({
      error: "Nombre, email y password son obligatorios",
    });
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const firebaseUser = userCredential.user;

    const newUser = await UsersModel.createUser({
      name,
      email,
      password,
      uuid: firebaseUser.uid
    });

    return res.status(201).json({
      user: newUser,
    });
  } catch (error) {
    return res.status(400).json({
      error: "Error al registrar usuario",
      debug: error.code || error.message,
    });
  }
};

export const getUserSuggestion = async (req, res) => {
  const { id } = req.params;
  try {
    const ListGames = await UsersModel.getSuggestion(id);

    res.status(200).json(ListGames);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await UsersModel.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserById = async (req, res) => {
  const { id } = req.params;
  const { currentUserId } = req.query;
  try {
    const user = await UsersModel.getUserById(id, currentUserId);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const toggleFollow = async (req, res) => {
  const { id: followedId } = req.params;
  const { follower_id: followerId } = req.body;

  if (!followerId || !followedId) {
    return res.status(400).json({ error: "Faltan datos: se requiere follower_id en el body y el id a seguir en la URL" });
  }

  // Comprobar que no se intenta seguir a sí mismo
  if (followerId == followedId) {
    return res.status(400).json({ error: "No puedes seguirte a ti mismo" });
  }

  try {
    const result = await UsersModel.toggleFollowUser(followerId, followedId);

    if (result.followed) {
      res.status(201).json({ message: "Usuario seguido correctamente", followed: true });
    } else {
      res.status(200).json({ message: "Usuario dejado de seguir correctamente", followed: false });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
