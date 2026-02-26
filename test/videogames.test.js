import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import app from '../index.js';

// Mocks function for database calls
vi.mock('../models/VideogameModel.js', () => ({
    getAllVideogames: vi.fn().mockResolvedValue([{ id: 1, name: 'Zelda' }]),
    getVideogameById: vi.fn().mockImplementation((id) => {
        if (id === '1') return Promise.resolve({ id: 1, name: 'Zelda' });
        return Promise.resolve(null);
    }),
    createVideogame: vi.fn().mockResolvedValue({ id: 2, name: 'Mario', genero: 'plataformas', nota: 10 }),
    linkAllEntities: vi.fn().mockResolvedValue(true),
    getUserGames: vi.fn().mockResolvedValue([{ id: 1, name: 'Zelda' }])
}));

vi.mock('../models/CompaniesModel.js', () => ({
    getCompanyByName: vi.fn().mockResolvedValue([{ id: 1, name: 'Nintendo' }]),
    createCompany: vi.fn().mockResolvedValue({ id: 1, name: 'Nintendo' })
}));

vi.mock('../models/CollectionsModel.js', () => ({
    getCollectionByNameUser: vi.fn().mockResolvedValue({ id: 1, name: 'Favoritos' }),
    createCollection: vi.fn().mockResolvedValue({ id: 1, name: 'Favoritos' })
}));


describe('Videogames API', () => {
    it('GET /api/videogames should return a list of videogames', async () => {
        const res = await request(app).get('/api/videogames');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body[0]).toHaveProperty('name', 'Zelda');
    });

    it('GET /api/videogames/:id should return a videogame if it exists', async () => {
        const res = await request(app).get('/api/videogames/1');
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('name', 'Zelda');
    });

    it('GET /api/videogames/:id should return 404 if it does not exist', async () => {
        const res = await request(app).get('/api/videogames/999');
        expect(res.status).toBe(404);
    });

    it('POST /api/videogames should create a videogame', async () => {
        const res = await request(app)
            .post('/api/videogames')
            .send({
                name: 'Mario',
                genero: 'plataformas',
                nota: 10,
                companyName: 'Nintendo',
                collectionName: 'Favoritos',
                user_id: 1
            });
        expect(res.status).toBe(201);
        expect(res.body.message).toBe('Videogame creado exitosamente');
        expect(res.body.game).toHaveProperty('name', 'Mario');
    });

    it('GET /api/videogames/user/:id should return a list of user videogames', async () => {
        const res = await request(app).get('/api/videogames/user/1');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBeTruthy();
    });
});
