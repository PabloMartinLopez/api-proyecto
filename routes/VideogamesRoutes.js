import express from 'express';
import {
    getVideogames,
    getVideogame,
    createVideogame,
    updateVideogame,
    deleteVideogame
} from '../controllers/VideogamesController.js';

const router = express.Router();

router.get('/', getVideogames);
router.get('/:id', getVideogame);
router.post('/', createVideogame);
router.put('/:id', updateVideogame);
router.delete('/:id', deleteVideogame);

export default router;
