import { Router } from 'express';
const router = Router();
router.get('/', (_, res) => res.json({ matches: [], message: 'Se integra con API-Football en fase 2' }));
export default router;
