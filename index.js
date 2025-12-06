import express from 'express';
import cors from 'cors';
import VideogamesRoutes from "./routes/VideogamesRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

// Rutas principales
app.use('/api/videogames', VideogamesRoutes);

// Ruta base
app.get('/', async (req, res) => {
    res.send("Bienvenido a la api de la buhardilla")
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
