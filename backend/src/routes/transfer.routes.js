import { Router } from 'express';
import { makeTransfer, getTransferHistory, setCaptain } from '../controllers/transfer.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();
router.use(protect);
router.post('/', makeTransfer);
router.get('/:league_id', getTransferHistory);
router.post('/captain', setCaptain);

export default router;
