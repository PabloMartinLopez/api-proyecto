import express from 'express';
import { checkHealth } from '../controllers/HealthController.js';

const router = express.Router();

router.get('/', checkHealth);

export default router;
