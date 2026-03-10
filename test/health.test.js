import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import app from '../index.js';

vi.mock('../config/db.js', () => ({
    default: vi.fn()
}));

import sql from '../config/db.js';

describe('Health API', () => {
    it('GET /api/health should return 200 and success status if database is connected', async () => {
        sql.mockResolvedValueOnce([{ '?column?': 1 }]);

        const res = await request(app).get('/api/health');

        expect(res.status).toBe(200);
        expect(res.body).toEqual({
            status: 'ok',
            message: 'API is running',
            database: 'connected'
        });
    });

    it('GET /api/health should return 500 and error status if database connection fails', async () => {
        sql.mockRejectedValueOnce(new Error('Connection failed'));

        const res = await request(app).get('/api/health');

        expect(res.status).toBe(500);
        expect(res.body).toEqual({
            status: 'error',
            message: 'API is running, but database connection failed',
            database: 'disconnected',
            error: 'Connection failed'
        });
    });
});
