import express from 'express';
import {
    getVideogames,
    getVideogame,
    createVideogame,
    updateVideogame,
    deleteVideogameById,
    getUserGames
} from '../controllers/VideogamesController.js';

const router = express.Router();

router.get('/', getVideogames);
router.get('/:id', getVideogame);
router.post('/', createVideogame);
router.put('/:id', updateVideogame);
router.delete('/:id', deleteVideogameById);

router.get('/user/:id', getUserGames);

export default router;
