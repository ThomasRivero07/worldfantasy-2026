import { Router } from 'express';
import { protect } from '../middleware/auth.middleware.js';
import FantasyTeam from '../models/FantasyTeam.model.js';

const router = Router();
router.use(protect);

router.post('/draft', async (req, res) => {
  try {
    const { league_id, players } = req.body;
    if (!league_id || !players || players.length < 11)
      return res.status(400).json({ error: 'Necesitás exactamente 11 jugadores' });

    const team = await FantasyTeam.findOne({ where: { user_id: req.userId, league_id } });
    if (!team) return res.status(404).json({ error: 'No pertenecés a esta liga' });

    team.players = players;
    await team.save();

    res.json({ team });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

router.get('/my', async (req, res) => {
  try {
    const teams = await FantasyTeam.findAll({ where: { user_id: req.userId } });
    res.json({ teams });
  } catch (err) {
    res.status(500).json({ error: 'Error del servidor' });
  }
});

export default router;
