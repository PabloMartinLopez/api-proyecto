import * as UsersModel from "../models/UserModel.js";
import { signInWithEmailAndPassword } from "firebase/auth";
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
      password
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
