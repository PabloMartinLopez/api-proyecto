import express from 'express';
import cors from 'cors'
import dotenv from 'dotenv';
import VideogamesRoutes from "./routes/VideogamesRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Rutas principales
app.use('/api/videogames', VideogamesRoutes);

// Ruta base
app.get('/', (req, res) => {
    console.log("aaaaa");
    res.send('API de Videojuegos funcionando ✅');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

