import sql from '../config/db.js';

export const checkHealth = async (req, res) => {
    try {
        // Obtenemos 1 para comprobar que la conexión funciona
        await sql`SELECT 1`;

        res.status(200).json({
            status: 'ok',
            message: 'API is running',
            database: 'connected'
        });
    } catch (error) {
        console.error('Database connection error:', error);
        res.status(500).json({
            status: 'error',
            message: 'API is running, but database connection failed',
            database: 'disconnected',
            error: error.message
        });
    }
};
