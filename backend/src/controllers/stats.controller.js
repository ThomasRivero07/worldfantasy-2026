import { v4 as uuidv4 } from 'uuid';
import PlayerStats from '../models/PlayerStats.model.js';
import Player from '../models/Player.model.js';
import FantasyTeam from '../models/FantasyTeam.model.js';
import PointsLog from '../models/PointsLog.model.js';
import Match from '../models/Match.model.js';
import { calculatePlayerPoints } from '../services/scoring.service.js';
import { io } from '../server.js';
import { emitPointsUpdate, emitMatchFinished } from '../sockets/index.js';

export const submitMatchStats = async (req, res) => {
  try {
    const { match_id, player_stats } = req.body;
    if (!match_id || !player_stats?.length)
      return res.status(400).json({ error: 'match_id y player_stats requeridos' });

    await Match.update({ status: 'finished' }, { where: { match_id } });

    const results = [];

    for (const stat of player_stats) {
      const player = await Player.findByPk(stat.player_id);
      if (!player) continue;

      const { points, breakdown } = calculatePlayerPoints(stat, player.position);

      await PlayerStats.destroy({ where: { player_id: stat.player_id, match_id } });
      await PlayerStats.create({ id: uuidv4(), ...stat, match_id, fantasy_points: points, breakdown });

      await Player.increment({
        goals:          stat.goals || 0,
        assists:        stat.assists || 0,
        yellow_cards:   stat.yellow_cards || 0,
        red_cards:      stat.red_cards || 0,
        minutes_played: stat.minutes_played || 0,
        clean_sheets:   stat.clean_sheet ? 1 : 0,
      }, { where: { id: stat.player_id } });

      results.push({ player_id: stat.player_id, name: player.name, points, breakdown });
    }

    // Calcular puntos para todos los fantasy teams
    const playerIds = player_stats.map(s => s.player_id);
    const allTeams = await FantasyTeam.findAll();

    // Agrupar equipos por liga para emitir eventos
    const leagueUpdates = {};

    for (const team of allTeams) {
      const teamPlayers = team.players || [];
      let teamPoints = 0;

      for (const tp of teamPlayers) {
        if (!playerIds.includes(tp.player_id)) continue;
        const statResult = results.find(r => r.player_id === tp.player_id);
        if (!statResult) continue;

        let pts = statResult.points;
        if (tp.is_captain) pts *= 2;
        teamPoints += pts;

        await PointsLog.create({
          id: uuidv4(),
          team_id: team.id,
          player_id: tp.player_id,
          match_id,
          points: pts,
          breakdown: { ...statResult.breakdown, is_captain: tp.is_captain || false }
        });
      }

      if (teamPoints > 0) {
        await team.increment({ total_points: teamPoints });

        // Acumular para el evento por liga
        if (!leagueUpdates[team.league_id]) leagueUpdates[team.league_id] = [];
        leagueUpdates[team.league_id].push({
          team_id: team.id,
          team_name: team.name,
          points_gained: teamPoints,
          new_total: team.total_points + teamPoints,
        });
      }
    }

    // Emitir eventos WebSocket
    // 1. Evento global: partido terminado
    emitMatchFinished(io, match_id, results);

    // 2. Evento por liga: puntos actualizados
    for (const [leagueId, updates] of Object.entries(leagueUpdates)) {
      emitPointsUpdate(io, leagueId, { match_id, updates });
    }

    res.json({ message: 'Stats cargadas correctamente', results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

export const getTeamPoints = async (req, res) => {
  try {
    const { team_id } = req.params;
    const team = await FantasyTeam.findByPk(team_id);
    if (!team) return res.status(404).json({ error: 'Equipo no encontrado' });

    const logs = await PointsLog.findAll({ where: { team_id }, order: [['created_at', 'DESC']] });

    const byPlayer = {};
    for (const log of logs) {
      if (!byPlayer[log.player_id]) byPlayer[log.player_id] = { total: 0, matches: [] };
      byPlayer[log.player_id].total += log.points;
      byPlayer[log.player_id].matches.push({ match_id: log.match_id, points: log.points, breakdown: log.breakdown });
    }

    const enriched = await Promise.all(
      Object.entries(byPlayer).map(async ([player_id, data]) => {
        const player = await Player.findByPk(player_id, { attributes: ['id', 'name', 'position', 'team_name'] });
        return { player, ...data };
      })
    );

    res.json({ team, total_points: team.total_points, breakdown: enriched });
  } catch (err) {
    res.status(500).json({ error: 'Error del servidor' });
  }
};
