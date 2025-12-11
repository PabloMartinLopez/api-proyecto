import express from 'express';
import {
    getVideogames,
    getVideogame,
    createVideogame,
    updateVideogame,
    deleteVideogameById
} from '../controllers/VideogamesController.js';

const router = express.Router();

router.get('/', getVideogames);
router.get('/:id', getVideogame);
router.post('/', createVideogame);
router.put('/:id', updateVideogame);
router.delete('/:id', deleteVideogameById);

export default router;
