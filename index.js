import express from 'express';
import cors from 'cors';
import VideogamesRoutes from "./routes/VideogamesRoutes.js";
import UserRoutes from "./routes/UsersRoutes.js";
import PlatformRoutes from "./routes/PlatformsRoutes.js";
import CompaniesRoutes from "./routes/CompaniesRoutes.js";
import CollectionsRoutes from "./routes/CollectionsRoutes.js";
import ConsultasRoutes from "./routes/ConsultasRoutes.js";
import HealthRoutes from "./routes/HealthRoutes.js";
import GameRoutes from "./routes/GameRoutes.js";
import dotenv from 'dotenv';
import morgan from 'morgan';

dotenv.config();

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use(cors());
if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
}
app.use(express.json());

// Ruta base
app.get('/', async (req, res) => {
    res.send("Bienvenido a la api de la buhardilla")
});

// Rutas principales
app.use('/api/videogames', VideogamesRoutes);
app.use('/api/users', UserRoutes);
app.use('/api/platforms', PlatformRoutes);
app.use('/api/companies', CompaniesRoutes);
app.use('/api/collections', CollectionsRoutes);
app.use('/api/search', ConsultasRoutes);
app.use('/api/game', GameRoutes);
app.use('/api/health', HealthRoutes);

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
}

export default app;
