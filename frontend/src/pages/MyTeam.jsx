import { useState, useEffect } from 'react';
import api from '../services/api.js';

const G = '#C9A84C';
const R = '#E61D25';
const B = '#2A5298';

const POS_LABEL = { Goalkeeper: 'Portero', Defender: 'Defensa', Midfielder: 'Mediocampista', Attacker: 'Delantero' };
const POS_COLOR = { Goalkeeper: '#F5C842', Defender: '#60A5FA', Midfielder: '#34D399', Attacker: '#F87171' };
const POS_SHORT = { Goalkeeper: 'POR', Defender: 'DEF', Midfielder: 'MED', Attacker: 'DEL' };

export default function MyTeam() {
  const [leagues, setLeagues] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState('');
  const [team, setTeam] = useState(null);
  const [players, setPlayers] = useState([]);
  const [pointsData, setPointsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [captainSaving, setCaptainSaving] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => { fetchLeagues(); }, []);
  useEffect(() => { if (selectedLeague) fetchTeam(); }, [selectedLeague]);

  const fetchLeagues = async () => {
    try {
      const res = await api.get('/leagues/my');
      setLeagues(res.data.leagues || []);
      if (res.data.leagues?.length > 0) setSelectedLeague(res.data.leagues[0].id);
    } catch {}
  };

  const fetchTeam = async () => {
    setLoading(true);
    try {
      const res = await api.get('/teams/my');
      const myTeam = res.data.teams?.find(t => t.league_id === selectedLeague);
      if (!myTeam) { setTeam(null); setLoading(false); return; }
      setTeam(myTeam);

      // Obtener info de jugadores
      if (myTeam.players?.length > 0) {
        const playersRes = await api.get('/players');
        const allPlayers = playersRes.data.players || [];
        const teamPlayerIds = myTeam.players.map(p => p.player_id);
        const myPlayers = allPlayers.filter(p => teamPlayerIds.includes(p.id));
        setPlayers(myPlayers);
      }

      // Obtener puntos
      try {
        const ptsRes = await api.get(`/stats/team/${myTeam.id}`);
        setPointsData(ptsRes.data);
      } catch {}

    } catch {}
    setLoading(false);
  };

  const setCaptain = async (player_id) => {
    setCaptainSaving(true);
    try {
      await api.post('/transfers/captain', { league_id: selectedLeague, player_id });
      setSuccess('Capitan actualizado');
      fetchTeam();
      setTimeout(() => setSuccess(''), 2000);
    } catch {}
    setCaptainSaving(false);
  };

  const getCaptain = () => team?.players?.find(p => p.is_captain)?.player_id;

  const getPlayerPoints = (player_id) => {
    if (!pointsData?.breakdown) return 0;
    return pointsData.breakdown.find(b => b.player?.id === player_id)?.total || 0;
  };

  if (leagues.length === 0) return (
    <div style={{ textAlign: 'center', padding: '4rem', color: '#666' }}>
      <h2 style={{ fontFamily: 'Barlow Condensed', fontSize: '1.5rem', marginBottom: '0.5rem' }}>Sin ligas</h2>
      <p>Primero crea o unite a una liga para ver tu equipo.</p>
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: '2rem', marginBottom: '4px', textTransform: 'uppercase' }}>Mi Equipo</h1>
        <p style={{ color: '#666', fontSize: '0.875rem' }}>Gestioná tu equipo, elegí el capitan y seguí tus puntos</p>
      </div>

      {/* Selector de liga */}
      {leagues.length > 1 && (
        <select value={selectedLeague} onChange={e => setSelectedLeague(e.target.value)}
          style={{ background: '#0A0A0A', border: '1px solid #1E1E1E', borderRadius: '8px', padding: '0.6rem 1rem', color: '#F0F0F0', fontSize: '0.875rem', outline: 'none', marginBottom: '1.5rem', cursor: 'pointer' }}>
          {leagues.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
        </select>
      )}

      {success && (
        <div style={{ background: '#1A1000', border: `1px solid ${G}44`, borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1rem', color: G, fontSize: '0.875rem' }}>
          {success}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>Cargando equipo...</div>
      ) : !team ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
          <p>No tenés equipo en esta liga todavia. Anda al Draft para armar uno.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '1.5rem' }}>

          {/* Jugadores */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: '1.1rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Plantel — {players.length}/11 jugadores
              </h2>
              <span style={{ fontFamily: 'Barlow Condensed', fontSize: '0.85rem', color: '#666' }}>
                Presupuesto restante: <span style={{ color: G }}>${Number(team.budget_remaining).toFixed(1)}M</span>
              </span>
            </div>

            {['Goalkeeper','Defender','Midfielder','Attacker'].map(pos => {
              const posPlayers = players.filter(p => p.position === pos);
              if (!posPlayers.length) return null;
              return (
                <div key={pos} style={{ marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.72rem', color: POS_COLOR[pos], fontWeight: 700, letterSpacing: '0.1em', marginBottom: '6px', textTransform: 'uppercase' }}>
                    {POS_LABEL[pos]}
                  </div>
                  {posPlayers.map(player => {
                    const isCaptain = getCaptain() === player.id;
                    const pts = getPlayerPoints(player.id);
                    return (
                      <div key={player.id} style={{ background: '#0A0A0A', border: `1px solid ${isCaptain ? G + '66' : '#1E1E1E'}`, borderRadius: '10px', padding: '0.875rem 1rem', display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '6px' }}>
                        <span style={{ fontSize: '0.68rem', padding: '2px 7px', borderRadius: '4px', background: `${POS_COLOR[player.position]}22`, color: POS_COLOR[player.position], fontWeight: 700, flexShrink: 0 }}>
                          {POS_SHORT[player.position]}
                        </span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontWeight: 600, fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{player.name}</span>
                            {isCaptain && <span style={{ background: G, color: '#000', fontSize: '0.6rem', padding: '1px 6px', borderRadius: '3px', fontFamily: 'Barlow Condensed', fontWeight: 800, letterSpacing: '0.05em', flexShrink: 0 }}>CAP x2</span>}
                          </div>
                          <div style={{ color: '#666', fontSize: '0.72rem' }}>{player.team_name}</div>
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <div style={{ fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: '1.3rem', color: pts > 0 ? G : '#444' }}>{pts} pts</div>
                          <div style={{ fontSize: '0.7rem', color: '#666' }}>${Number(player.fantasy_price).toFixed(1)}M</div>
                        </div>
                        <button onClick={() => setCaptain(player.id)} disabled={captainSaving || isCaptain}
                          style={{ padding: '4px 8px', background: isCaptain ? G : 'transparent', border: `1px solid ${isCaptain ? G : '#2A2A2A'}`, borderRadius: '6px', color: isCaptain ? '#000' : '#666', fontSize: '0.68rem', fontFamily: 'Barlow Condensed', fontWeight: 700, cursor: isCaptain ? 'default' : 'pointer', flexShrink: 0 }}>
                          {isCaptain ? 'CAPITAN' : 'Cap'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Panel derecho: resumen */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Puntos totales */}
            <div style={{ background: '#0A0A0A', border: '1px solid #1E1E1E', borderRadius: '12px', padding: '1.5rem', textAlign: 'center', borderTop: `3px solid ${G}` }}>
              <div style={{ color: '#666', fontSize: '0.75rem', fontFamily: 'Barlow Condensed', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px' }}>Puntos totales</div>
              <div style={{ fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: '3.5rem', color: G, lineHeight: 1 }}>{team.total_points}</div>
              <div style={{ color: '#666', fontSize: '0.75rem', marginTop: '6px' }}>pts acumulados</div>
            </div>

            {/* Nombre del equipo */}
            <div style={{ background: '#0A0A0A', border: '1px solid #1E1E1E', borderRadius: '12px', padding: '1.25rem' }}>
              <div style={{ color: '#666', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Equipo</div>
              <div style={{ fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: '1.2rem' }}>{team.name}</div>
            </div>

            {/* Sistema de puntuacion */}
            <div style={{ background: '#0A0A0A', border: '1px solid #1E1E1E', borderRadius: '12px', padding: '1.25rem' }}>
              <div style={{ color: '#666', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem', fontFamily: 'Barlow Condensed', fontWeight: 700 }}>Sistema de puntuacion</div>
              {[
                { label: 'Gol (DEL/MED)', pts: '+6' },
                { label: 'Gol (DEF/POR)', pts: '+10' },
                { label: 'Asistencia', pts: '+3' },
                { label: 'Clean sheet', pts: '+4' },
                { label: 'Cada 3 tiros', pts: '+1' },
                { label: 'Man of the Match', pts: '+2' },
                { label: 'Penal atajado', pts: '+3' },
                { label: '+60 min jugados', pts: '+2' },
                { label: 'Tarjeta amarilla', pts: '-1', neg: true },
                { label: 'Tarjeta roja', pts: '-3', neg: true },
                { label: 'Autogol', pts: '-3', neg: true },
                { label: 'Capitan', pts: 'x2' },
              ].map(r => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #111', fontSize: '0.78rem' }}>
                  <span style={{ color: '#888' }}>{r.label}</span>
                  <span style={{ fontFamily: 'Barlow Condensed', fontWeight: 700, color: r.neg ? R : r.pts === 'x2' ? G : '#F0F0F0' }}>{r.pts}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
