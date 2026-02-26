import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import app from '../index.js';

vi.mock('../models/CollectionsModel.js', () => ({
    getAllCollections: vi.fn().mockImplementation((userId) => {
        if (userId === '1') {
            return Promise.resolve([{ id: 1, name: 'Favoritos' }]);
        }
        return Promise.resolve([]);
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
});
