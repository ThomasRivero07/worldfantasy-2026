import { v4 as uuidv4 } from 'uuid';
import League from '../models/League.model.js';
import FantasyTeam from '../models/FantasyTeam.model.js';
import User from '../models/User.model.js';

const generateCode = () => Math.random().toString(36).substring(2, 10).toUpperCase();

export const createLeague = async (req, res) => {
  try {
    const { name, max_members = 10, budget = 100 } = req.body;
    if (!name) return res.status(400).json({ error: 'Nombre de liga requerido' });

    const invite_code = generateCode();
    const league = await League.create({
      id: uuidv4(), name, invite_code,
      owner_id: req.userId, max_members, budget
    });

    // El creador se une automáticamente con su equipo
    await FantasyTeam.create({
      id: uuidv4(), name: 'Mi Equipo',
      user_id: req.userId, league_id: league.id,
      budget_remaining: budget
    });

    res.status(201).json({ league });
  } catch (err) {
    console.error('Create league error:', err);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

export const joinLeague = async (req, res) => {
  try {
    const { invite_code, team_name } = req.body;
    const league = await League.findOne({ where: { invite_code } });
    if (!league) return res.status(404).json({ error: 'Liga no encontrada' });
    if (league.status !== 'waiting') return res.status(400).json({ error: 'La liga ya no acepta nuevos miembros' });

    const memberCount = await FantasyTeam.count({ where: { league_id: league.id } });
    if (memberCount >= league.max_members) return res.status(400).json({ error: 'Liga llena' });

    const alreadyJoined = await FantasyTeam.findOne({ where: { user_id: req.userId, league_id: league.id } });
    if (alreadyJoined) return res.status(409).json({ error: 'Ya sos miembro de esta liga' });

    const team = await FantasyTeam.create({
      id: uuidv4(), name: team_name || 'Mi Equipo',
      user_id: req.userId, league_id: league.id,
      budget_remaining: league.budget
    });

    res.status(201).json({ league, team });
  } catch (err) {
    console.error('Join league error:', err);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

export const getStandings = async (req, res) => {
  try {
    const { id } = req.params;
    const league = await League.findByPk(id);
    if (!league) return res.status(404).json({ error: 'Liga no encontrada' });

    const teams = await FantasyTeam.findAll({
      where: { league_id: id },
      order: [['total_points', 'DESC']],
    });

    // Enriquecer con info de usuario
    const standings = await Promise.all(teams.map(async (team, index) => {
      const user = await User.findByPk(team.user_id, { attributes: ['username', 'avatar_url'] });
      return { rank: index + 1, team, user };
    }));

    res.json({ league, standings });
  } catch (err) {
    res.status(500).json({ error: 'Error del servidor' });
  }
};

export const getMyLeagues = async (req, res) => {
  try {
    const teams = await FantasyTeam.findAll({ where: { user_id: req.userId } });
    const leagueIds = teams.map(t => t.league_id);
    const leagues = await League.findAll({ where: { id: leagueIds } });
    res.json({ leagues });
  } catch (err) {
    res.status(500).json({ error: 'Error del servidor' });
  }
};
