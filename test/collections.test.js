import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import app from '../index.js';

vi.mock('../models/CollectionsModel.js', () => ({
    getCollectionsByUserId: vi.fn().mockImplementation((userId) => {
        if (userId === '1') {
            return Promise.resolve([{ id: 1, name: 'Favoritos' }]);
        }
        return Promise.resolve([]);
    }),
    createCollection: vi.fn().mockImplementation((nombre, id_jugador) => {
        return Promise.resolve({ id: 2, name: nombre, id_jugador });
    }),
    addGameToCollection: vi.fn().mockImplementation((collection_id, videogame_id) => {
        if (collection_id === '999') return Promise.reject(new Error("Collection does not exist"));
        return Promise.resolve({ collection_id, videogame_id });
    })
}));

describe('Collections API', () => {
    it('GET /api/collections/:User_id should return collections for a given user', async () => {
        const res = await request(app).get('/api/collections/1');

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body.length).toBe(1);
        expect(res.body[0]).toHaveProperty('name', 'Favoritos');
    });

    it('GET /api/collections/:User_id should return empty array if no collections', async () => {
        const res = await request(app).get('/api/collections/99');

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body.length).toBe(0);
    });

    it('POST /api/collections should create a new collection', async () => {
        const res = await request(app)
            .post('/api/collections')
            .send({ nombre: 'Juegos pasados', id_jugador: 1 });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('name', 'Juegos pasados');
        expect(res.body).toHaveProperty('id_jugador', 1);
    });

    it('POST /api/collections/:collection_id/games should add game to collection', async () => {
        const res = await request(app)
            .post('/api/collections/1/games')
            .send({ videogame_id: 10 });

        expect(res.status).toBe(201);
        expect(res.body.message).toBe("Game added to collection successfully");
        expect(res.body.data).toHaveProperty('videogame_id', 10);
    });

    it('POST /api/collections/:collection_id/games should return 404 if collection does not exist', async () => {
        const res = await request(app)
            .post('/api/collections/999/games')
            .send({ videogame_id: 10 });

        expect(res.status).toBe(404);
        expect(res.body.error).toBe("Collection does not exist");
    });
});
