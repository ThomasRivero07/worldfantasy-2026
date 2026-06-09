import { v4 as uuidv4 } from 'uuid';
import FantasyTeam from '../models/FantasyTeam.model.js';
import Transfer from '../models/Transfer.model.js';
import Player from '../models/Player.model.js';

export const makeTransfer = async (req, res) => {
  try {
    const { league_id, player_out_id, player_in_id } = req.body;
    if (!league_id || !player_out_id || !player_in_id)
      return res.status(400).json({ error: 'league_id, player_out_id y player_in_id requeridos' });

    const team = await FantasyTeam.findOne({ where: { user_id: req.userId, league_id } });
    if (!team) return res.status(404).json({ error: 'No perteneces a esta liga' });

    const playerOut = await Player.findByPk(player_out_id);
    const playerIn  = await Player.findByPk(player_in_id);
    if (!playerOut || !playerIn) return res.status(404).json({ error: 'Jugador no encontrado' });

    // Verificar que el jugador a sacar está en el equipo
    const players = team.players || [];
    const outIndex = players.findIndex(p => p.player_id === player_out_id);
    if (outIndex === -1) return res.status(400).json({ error: 'El jugador no está en tu equipo' });

    // Verificar que el jugador a entrar no está ya en el equipo
    if (players.find(p => p.player_id === player_in_id))
      return res.status(400).json({ error: 'El jugador ya está en tu equipo' });

    // Verificar posición
    if (playerOut.position !== playerIn.position)
      return res.status(400).json({ error: `Solo podés reemplazar ${playerOut.position} por ${playerIn.position}` });

    // Verificar presupuesto
    const priceDiff = Number(playerIn.fantasy_price) - Number(playerOut.fantasy_price);
    const newBudget = Number(team.budget_remaining) - priceDiff;
    if (newBudget < 0) return res.status(400).json({ error: `Presupuesto insuficiente. Necesitas $${priceDiff.toFixed(1)}M más` });

    // Hacer la transferencia
    const newPlayers = [...players];
    newPlayers[outIndex] = { ...newPlayers[outIndex], player_id: player_in_id };

    await team.update({ players: newPlayers, budget_remaining: newBudget });

    await Transfer.create({
      id: uuidv4(),
      team_id: team.id,
      player_out_id,
      player_in_id,
      matchday: 1,
    });

    res.json({
      message: `Transferencia exitosa: ${playerOut.name} → ${playerIn.name}`,
      team,
      player_out: playerOut,
      player_in: playerIn,
      new_budget: newBudget,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

export const getTransferHistory = async (req, res) => {
  try {
    const { league_id } = req.params;
    const team = await FantasyTeam.findOne({ where: { user_id: req.userId, league_id } });
    if (!team) return res.status(404).json({ error: 'Equipo no encontrado' });

    const transfers = await Transfer.findAll({
      where: { team_id: team.id },
      order: [['created_at', 'DESC']],
    });

    const enriched = await Promise.all(transfers.map(async t => {
      const playerOut = await Player.findByPk(t.player_out_id, { attributes: ['name', 'position', 'team_name', 'fantasy_price'] });
      const playerIn  = await Player.findByPk(t.player_in_id,  { attributes: ['name', 'position', 'team_name', 'fantasy_price'] });
      return { ...t.toJSON(), player_out: playerOut, player_in: playerIn };
    }));

    res.json({ transfers: enriched });
  } catch (err) {
    res.status(500).json({ error: 'Error del servidor' });
  }
};

export const setCaptain = async (req, res) => {
  try {
    const { league_id, player_id } = req.body;
    const team = await FantasyTeam.findOne({ where: { user_id: req.userId, league_id } });
    if (!team) return res.status(404).json({ error: 'Equipo no encontrado' });

    const players = (team.players || []).map(p => ({
      ...p,
      is_captain: p.player_id === player_id
    }));

    await team.update({ players });
    res.json({ message: 'Capitan actualizado', team });
  } catch (err) {
    res.status(500).json({ error: 'Error del servidor' });
  }
};
