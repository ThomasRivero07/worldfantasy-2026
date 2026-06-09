import { Router } from 'express';
import { submitMatchStats, getTeamPoints } from '../controllers/stats.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();
router.post('/match', protect, submitMatchStats);
router.get('/team/:team_id', protect, getTeamPoints);

export default router;
