import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import app from '../index.js';

vi.mock('firebase/auth', () => ({
    signInWithEmailAndPassword: vi.fn().mockImplementation((auth, email, password) => {
        if (email === 'test@test.com' && password === '123456') {
            return Promise.resolve({ user: { uid: 'mocked-uid' } });
        }
        const error = new Error('Invalid credentials');
        error.code = 'auth/invalid-credential';
        return Promise.reject(error);
    })
}));

vi.mock('../config/firebase.js', () => ({
    auth: {}
}));

vi.mock('../models/UserModel.js', () => ({
    getUserByUUID: vi.fn().mockImplementation((uid) => {
        if (uid === 'mocked-uid') {
            return Promise.resolve({ id: 1, email: 'test@test.com' });
        }
        return Promise.resolve(null);
    }),
    getSuggestion: vi.fn().mockResolvedValue([{ id: 1, name: 'Zelda' }])
}));

describe('Users API', () => {
    it('POST /api/users/login should return user data on success', async () => {
        const res = await request(app)
            .post('/api/users/login')
            .send({ email: 'test@test.com', password: '123456' });

        expect(res.status).toBe(200);
        expect(res.body.user).toHaveProperty('email', 'test@test.com');
    });

    it('POST /api/users/login should return 401 on wrong credentials', async () => {
        const res = await request(app)
            .post('/api/users/login')
            .send({ email: 'wrong@test.com', password: 'wrong' });

        expect(res.status).toBe(401);
        expect(res.body.error).toBe('Credenciales inválidas');
    });

    it('POST /api/users/login should return 400 if missing data', async () => {
        const res = await request(app)
            .post('/api/users/login')
            .send({ email: 'test@test.com' });

        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Email y password son obligatorios');
    });

    it('GET /api/users/:id/suggestion should return game suggestions', async () => {
        const res = await request(app).get('/api/users/1/suggestion');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body[0]).toHaveProperty('name', 'Zelda');
    });
});
