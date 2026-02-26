import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import app from '../index.js';

vi.mock('../models/CompaniesModel.js', () => ({
    getAllCompanies: vi.fn().mockResolvedValue([{ id: 1, name: 'Nintendo' }, { id: 2, name: 'Sony' }])
}));

describe('Companies API', () => {
    it('GET /api/companies should return a list of companies', async () => {
        const res = await request(app).get('/api/companies');

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body.length).toBe(2);
        expect(res.body[0]).toHaveProperty('name', 'Nintendo');
    });
});
