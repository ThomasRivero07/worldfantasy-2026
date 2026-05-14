import { Router } from 'express';
const router = Router();
router.get('/', (_, res) => res.json({ teams: [], message: 'Draft system en fase 2' }));
export default router;
