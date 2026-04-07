import express from "express";
import { getBusqueda } from "../controllers/ConsultasController.js";


const router = express.Router();

router.get("/", getBusqueda);


export default router;