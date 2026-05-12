import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import app from '../index.js';

// Mocks function for database calls
vi.mock('../models/VideogameModel.js', () => ({
    getAllVideogames: vi.fn().mockResolvedValue([{ id: 1, nombre: 'Zelda' }]),
    getVideogameById: vi.fn().mockImplementation((id) => {
        if (id === '1' || id === 1) return Promise.resolve({ id: 1, nombre: 'Zelda' });
        return Promise.resolve(null);
    }),
    createVideogame: vi.fn().mockImplementation((data) => Promise.resolve({ id: 2, ...data })),
    getUserGames: vi.fn().mockResolvedValue([{ id: 1, nombre: 'Zelda' }])
}));

describe('Videogames API', () => {
    it('GET /api/videogames should return a list of videogames', async () => {
        const res = await request(app).get('/api/videogames');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body[0]).toHaveProperty('nombre', 'Zelda');
    });

    it('GET /api/videogames/:id should return a videogame if it exists', async () => {
        const res = await request(app).get('/api/videogames/1');
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('nombre', 'Zelda');
    });

    it('GET /api/videogames/:id should return 404 if it does not exist', async () => {
        const res = await request(app).get('/api/videogames/999');
        expect(res.status).toBe(404);
    });

    it('POST /api/videogames should create a new videogame with array of platforms', async () => {
        const res = await request(app)
            .post('/api/videogames')
            .send({
                nombre: 'Mario Bros',
                genero: 'Plataformas',
                id_compania: 1,
                plataformas: [1, 2],
                nota: 10,
                portada: 'http://image.com',
                descripcion: 'Classic game',
                released_date: '1985-09-13'
            });
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('nombre', 'Mario Bros');
        expect(res.body).toHaveProperty('released_date', '1985-09-13');
        expect(res.body.plataformas).toEqual([1, 2]);
    });

    it('GET /api/videogames/user/:id should return a list of user videogames', async () => {
        const res = await request(app).get('/api/videogames/user/1');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body[0]).toHaveProperty('nombre', 'Zelda');
    });
});
