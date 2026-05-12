import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import app from '../index.js';

vi.mock('firebase/auth', () => ({
    signInWithEmailAndPassword: vi.fn().mockImplementation((auth, email, password) => {
        if (email === 'test@test.com' && password === '123456') {
            return Promise.resolve({ user: { uid: 'mocked-uid' } });
        }
        if (email === 'test@test.com' && password === 'oldpassword') {
            return Promise.resolve({ user: { uid: 'mocked-uid' } });
        }
        const error = new Error('Invalid credentials');
        error.code = 'auth/invalid-credential';
        return Promise.reject(error);
    }),
    createUserWithEmailAndPassword: vi.fn().mockImplementation((auth, email, password) => {
        if (email === 'new@test.com') {
            return Promise.resolve({ user: { uid: 'new-mocked-uid' } });
        }
        return Promise.reject(new Error('Email already in use'));
    }),
    updatePassword: vi.fn().mockResolvedValue(true)
}));

vi.mock('../config/firebase.js', () => ({
    auth: {}
}));

vi.mock('../models/UserModel.js', () => ({
    getUserByUUID: vi.fn().mockImplementation((uid) => {
        if (uid === 'mocked-uid') return Promise.resolve({ id: 1, email: 'test@test.com' });
        return Promise.resolve(null);
    }),
    createUser: vi.fn().mockImplementation((data) => {
        return Promise.resolve({ id: 2, ...data });
    }),
    getSuggestion: vi.fn().mockResolvedValue([{ id: 1, name: 'Zelda' }]),
    getAllUsers: vi.fn().mockResolvedValue([{ id: 1, name: 'Pepe' }]),
    getUserById: vi.fn().mockResolvedValue({ id: 1, name: 'Pepe' }),
    toggleFollowUser: vi.fn().mockImplementation((followerId, followedId) => {
        if (followerId == 1 && followedId == 2) return Promise.resolve({ followed: true });
        return Promise.resolve({ followed: false });
    }),
    getUserFeed: vi.fn().mockResolvedValue([{ id: 1, type: 'review', content: 'Great game!' }]),
    getUserVideogames: vi.fn().mockResolvedValue([{ id: 1, name: 'Mario' }]),
    updateUser: vi.fn().mockImplementation((id, data) => {
        if (id === '1' || id === 1) return Promise.resolve({ id: 1, ...data });
        return Promise.resolve(null);
    }),
    getRawUserById: vi.fn().mockImplementation((id) => {
        if (id === '1' || id === 1) return Promise.resolve({ id: 1, email: 'test@test.com', password: 'oldpassword' });
        return Promise.resolve(null);
    })
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
    });

    it('POST /api/users/register should create a new user', async () => {
        const res = await request(app)
            .post('/api/users/register')
            .send({ name: 'New User', email: 'new@test.com', password: 'password123' });

        expect(res.status).toBe(201);
        expect(res.body.user).toHaveProperty('email', 'new@test.com');
        expect(res.body.user).toHaveProperty('uuid', 'new-mocked-uid');
    });

    it('GET /api/users/:id/suggestion should return game suggestions', async () => {
        const res = await request(app).get('/api/users/1/suggestion');
        expect(res.status).toBe(200);
        expect(res.body[0]).toHaveProperty('name', 'Zelda');
    });

    it('GET /api/users should return all users', async () => {
        const res = await request(app).get('/api/users');
        expect(res.status).toBe(200);
        expect(res.body[0]).toHaveProperty('name', 'Pepe');
    });

    it('GET /api/users/:id should return user details', async () => {
        const res = await request(app).get('/api/users/1');
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('name', 'Pepe');
    });

    it('PUT /api/users/:id should update user details', async () => {
        const res = await request(app)
            .put('/api/users/1')
            .send({ name: 'Updated Pepe', image: 2 });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('name', 'Updated Pepe');
        expect(res.body).toHaveProperty('image', 2);
    });

    it('GET /api/users/:id/videogames should return user games', async () => {
        const res = await request(app).get('/api/users/1/videogames');
        expect(res.status).toBe(200);
        expect(res.body[0]).toHaveProperty('name', 'Mario');
    });

    it('GET /api/users/:id/feed should return user feed', async () => {
        const res = await request(app).get('/api/users/1/feed');
        expect(res.status).toBe(200);
        expect(res.body[0]).toHaveProperty('content', 'Great game!');
    });

    it('POST /api/users/:id/follow should toggle follow status', async () => {
        const res = await request(app)
            .post('/api/users/2/follow')
            .send({ follower_id: 1 });
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('followed', true);
    });
});
