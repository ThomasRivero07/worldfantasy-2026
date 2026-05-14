import { Router } from 'express';
import { createLeague, joinLeague, getStandings, getMyLeagues } from '../controllers/league.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();
router.use(protect);
router.post('/', createLeague);
router.post('/join', joinLeague);
router.get('/my', getMyLeagues);
router.get('/:id/standings', getStandings);

export default router;
