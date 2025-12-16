import express from 'express';
import cors from 'cors';
import VideogamesRoutes from "./routes/VideogamesRoutes.js";
import UserRoutes from "./routes/UsersRoutes.js";
import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Ruta base
app.get('/', async (req, res) => {
    res.send("Bienvenido a la api de la buhardilla")
});

// Rutas principales
app.use('/api/videogames', VideogamesRoutes);
app.use('/api/users', UserRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
