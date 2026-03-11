import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import app from '../index.js';

vi.mock('../models/PlatformModel.js', () => ({
    getPlatformUser: vi.fn().mockImplementation((id) => {
        if (id === '1') {
            return Promise.resolve([{ id: 1, name: 'PC' }, { id: 2, name: 'PS5' }]);
        }
        return Promise.resolve([]);
    }),
    createPlatform: vi.fn().mockImplementation(async (data) => {
        return { id: 3, name: data.name };
    })
}));

describe('Platforms API', () => {
    it('GET /api/platforms/users/:id should return platform list for a given user', async () => {
        const res = await request(app).get('/api/platforms/users/1');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body.length).toBe(2);
        expect(res.body[0]).toHaveProperty('name', 'PC');
    });

    it('GET /api/platforms/users/:id should return an empty array if user has no platforms', async () => {
        const res = await request(app).get('/api/platforms/users/99');
        expect(res.status).toBe(200);
        expect(res.body).toEqual([]);
    });

    it('POST /api/platforms should create a new platform', async () => {
        const res = await request(app).post('/api/platforms').send({ name: 'asd' });
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('name', 'asd');
    });
});
