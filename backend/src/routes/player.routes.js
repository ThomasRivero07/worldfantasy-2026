import { Router } from 'express';
import { Op } from 'sequelize';
import Player from '../models/Player.model.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();
router.use(protect);

router.get('/', async (req, res) => {
  try {
    const { position, team, search } = req.query;
    const where = {};
    if (position) where.position = position;
    if (team) where.team_name = { [Op.iLike]: `%${team}%` };
    if (search) where.name = { [Op.iLike]: `%${search}%` };
    const players = await Player.findAll({ where, order: [['fantasy_price', 'DESC']] });
    res.json({ players });
  } catch (err) {
    res.status(500).json({ error: 'Error del servidor' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const player = await Player.findByPk(req.params.id);
    if (!player) return res.status(404).json({ error: 'Jugador no encontrado' });
    res.json({ player });
  } catch (err) {
    res.status(500).json({ error: 'Error del servidor' });
  }
});

export default router;
