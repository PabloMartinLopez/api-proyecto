import express from 'express';
import {
    getVideogames,
    getVideogame,
    createVideogame,
    getUserGames,
} from '../controllers/VideogamesController.js';

const router = express.Router();

router.get('/', getVideogames);
router.get('/:id', getVideogame);
router.get('/user/:id', getUserGames);

router.post('/', createVideogame);

export default router;
