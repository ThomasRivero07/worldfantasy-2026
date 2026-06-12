import { useState, useEffect } from 'react';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

const G = '#C9A84C';
const R = '#E61D25';
const B = '#2A5298';

const MATCHES = [
  // JORNADA 1
  { match_id: 'A-1',  date: '2026-06-11', teamA: 'México',         teamB: 'Sudáfrica',            group: 'A', jornada: 1 },
  { match_id: 'A-2',  date: '2026-06-11', teamA: 'Corea del Sur',  teamB: 'República Checa',      group: 'A', jornada: 1 },
  { match_id: 'B-1',  date: '2026-06-12', teamA: 'Canadá',         teamB: 'Bosnia y Herzegovina', group: 'B', jornada: 1 },
  { match_id: 'D-1',  date: '2026-06-12', teamA: 'Estados Unidos', teamB: 'Paraguay',             group: 'D', jornada: 1 },
  { match_id: 'B-2',  date: '2026-06-13', teamA: 'Qatar',          teamB: 'Suiza',                group: 'B', jornada: 1 },
  { match_id: 'C-1',  date: '2026-06-13', teamA: 'Brasil',         teamB: 'Marruecos',            group: 'C', jornada: 1 },
  { match_id: 'C-2',  date: '2026-06-13', teamA: 'Haití',          teamB: 'Escocia',              group: 'C', jornada: 1 },
  { match_id: 'D-2',  date: '2026-06-13', teamA: 'Australia',      teamB: 'Turquía',              group: 'D', jornada: 1 },
  { match_id: 'E-1',  date: '2026-06-14', teamA: 'Alemania',       teamB: 'Curazao',              group: 'E', jornada: 1 },
  { match_id: 'F-1',  date: '2026-06-14', teamA: 'Países Bajos',   teamB: 'Japón',                group: 'F', jornada: 1 },
  { match_id: 'E-2',  date: '2026-06-14', teamA: 'Costa de Marfil',teamB: 'Ecuador',              group: 'E', jornada: 1 },
  { match_id: 'F-2',  date: '2026-06-14', teamA: 'Suecia',         teamB: 'Túnez',                group: 'F', jornada: 1 },
  { match_id: 'H-1',  date: '2026-06-15', teamA: 'España',         teamB: 'Cabo Verde',           group: 'H', jornada: 1 },
  { match_id: 'G-1',  date: '2026-06-15', teamA: 'Bélgica',        teamB: 'Egipto',               group: 'G', jornada: 1 },
  { match_id: 'H-2',  date: '2026-06-15', teamA: 'Arabia Saudita', teamB: 'Uruguay',              group: 'H', jornada: 1 },
  { match_id: 'G-2',  date: '2026-06-15', teamA: 'Irán',           teamB: 'Nueva Zelanda',        group: 'G', jornada: 1 },
  { match_id: 'I-1',  date: '2026-06-16', teamA: 'Francia',        teamB: 'Senegal',              group: 'I', jornada: 1 },
  { match_id: 'I-2',  date: '2026-06-16', teamA: 'Irak',           teamB: 'Noruega',              group: 'I', jornada: 1 },
  { match_id: 'J-1',  date: '2026-06-16', teamA: 'Argentina',      teamB: 'Argelia',              group: 'J', jornada: 1 },
  { match_id: 'J-2',  date: '2026-06-16', teamA: 'Austria',        teamB: 'Jordania',             group: 'J', jornada: 1 },
  { match_id: 'K-1',  date: '2026-06-17', teamA: 'Portugal',       teamB: 'RD Congo',             group: 'K', jornada: 1 },
  { match_id: 'L-1',  date: '2026-06-17', teamA: 'Inglaterra',     teamB: 'Croacia',              group: 'L', jornada: 1 },
  { match_id: 'L-2',  date: '2026-06-17', teamA: 'Ghana',          teamB: 'Panamá',               group: 'L', jornada: 1 },
  { match_id: 'K-2',  date: '2026-06-17', teamA: 'Uzbekistán',     teamB: 'Colombia',             group: 'K', jornada: 1 },
  // JORNADA 2
  { match_id: 'A-3',  date: '2026-06-18', teamA: 'República Checa',teamB: 'Sudáfrica',            group: 'A', jornada: 2 },
  { match_id: 'A-4',  date: '2026-06-18', teamA: 'México',         teamB: 'Corea del Sur',        group: 'A', jornada: 2 },
  { match_id: 'B-3',  date: '2026-06-18', teamA: 'Suiza',          teamB: 'Bosnia y Herzegovina', group: 'B', jornada: 2 },
  { match_id: 'B-4',  date: '2026-06-18', teamA: 'Canadá',         teamB: 'Qatar',                group: 'B', jornada: 2 },
  { match_id: 'C-3',  date: '2026-06-19', teamA: 'Escocia',        teamB: 'Marruecos',            group: 'C', jornada: 2 },
  { match_id: 'C-4',  date: '2026-06-19', teamA: 'Brasil',         teamB: 'Haití',                group: 'C', jornada: 2 },
  { match_id: 'D-3',  date: '2026-06-19', teamA: 'Estados Unidos', teamB: 'Australia',            group: 'D', jornada: 2 },
  { match_id: 'D-4',  date: '2026-06-19', teamA: 'Turquía',        teamB: 'Paraguay',             group: 'D', jornada: 2 },
  { match_id: 'E-3',  date: '2026-06-20', teamA: 'Alemania',       teamB: 'Costa de Marfil',      group: 'E', jornada: 2 },
  { match_id: 'E-4',  date: '2026-06-20', teamA: 'Ecuador',        teamB: 'Curazao',              group: 'E', jornada: 2 },
  { match_id: 'F-3',  date: '2026-06-20', teamA: 'Países Bajos',   teamB: 'Suecia',               group: 'F', jornada: 2 },
  { match_id: 'F-4',  date: '2026-06-20', teamA: 'Túnez',          teamB: 'Japón',                group: 'F', jornada: 2 },
  { match_id: 'H-3',  date: '2026-06-21', teamA: 'España',         teamB: 'Arabia Saudita',       group: 'H', jornada: 2 },
  { match_id: 'H-4',  date: '2026-06-21', teamA: 'Uruguay',        teamB: 'Cabo Verde',           group: 'H', jornada: 2 },
  { match_id: 'G-3',  date: '2026-06-21', teamA: 'Bélgica',        teamB: 'Irán',                 group: 'G', jornada: 2 },
  { match_id: 'G-4',  date: '2026-06-21', teamA: 'Nueva Zelanda',  teamB: 'Egipto',               group: 'G', jornada: 2 },
  { match_id: 'J-3',  date: '2026-06-22', teamA: 'Argentina',      teamB: 'Austria',              group: 'J', jornada: 2 },
  { match_id: 'I-3',  date: '2026-06-22', teamA: 'Francia',        teamB: 'Irak',                 group: 'I', jornada: 2 },
  { match_id: 'I-4',  date: '2026-06-22', teamA: 'Noruega',        teamB: 'Senegal',              group: 'I', jornada: 2 },
  { match_id: 'J-4',  date: '2026-06-22', teamA: 'Jordania',       teamB: 'Argelia',              group: 'J', jornada: 2 },
  { match_id: 'K-3',  date: '2026-06-23', teamA: 'Portugal',       teamB: 'Uzbekistán',           group: 'K', jornada: 2 },
  { match_id: 'L-3',  date: '2026-06-23', teamA: 'Inglaterra',     teamB: 'Ghana',                group: 'L', jornada: 2 },
  { match_id: 'L-4',  date: '2026-06-23', teamA: 'Panamá',         teamB: 'Croacia',              group: 'L', jornada: 2 },
  { match_id: 'K-4',  date: '2026-06-23', teamA: 'Colombia',       teamB: 'RD Congo',             group: 'K', jornada: 2 },
  // JORNADA 3
  { match_id: 'B-5',  date: '2026-06-24', teamA: 'Suiza',          teamB: 'Canadá',               group: 'B', jornada: 3 },
  { match_id: 'B-6',  date: '2026-06-24', teamA: 'Bosnia y Herzegovina', teamB: 'Qatar',          group: 'B', jornada: 3 },
  { match_id: 'C-5',  date: '2026-06-24', teamA: 'Escocia',        teamB: 'Brasil',               group: 'C', jornada: 3 },
  { match_id: 'C-6',  date: '2026-06-24', teamA: 'Marruecos',      teamB: 'Haití',                group: 'C', jornada: 3 },
  { match_id: 'A-5',  date: '2026-06-24', teamA: 'República Checa',teamB: 'México',               group: 'A', jornada: 3 },
  { match_id: 'A-6',  date: '2026-06-24', teamA: 'Sudáfrica',      teamB: 'Corea del Sur',        group: 'A', jornada: 3 },
  { match_id: 'E-5',  date: '2026-06-25', teamA: 'Curazao',        teamB: 'Costa de Marfil',      group: 'E', jornada: 3 },
  { match_id: 'E-6',  date: '2026-06-25', teamA: 'Ecuador',        teamB: 'Alemania',             group: 'E', jornada: 3 },
  { match_id: 'F-5',  date: '2026-06-25', teamA: 'Japón',          teamB: 'Suecia',               group: 'F', jornada: 3 },
  { match_id: 'F-6',  date: '2026-06-25', teamA: 'Túnez',          teamB: 'Países Bajos',         group: 'F', jornada: 3 },
  { match_id: 'D-5',  date: '2026-06-25', teamA: 'Turquía',        teamB: 'Estados Unidos',       group: 'D', jornada: 3 },
  { match_id: 'D-6',  date: '2026-06-25', teamA: 'Paraguay',       teamB: 'Australia',            group: 'D', jornada: 3 },
  { match_id: 'I-5',  date: '2026-06-26', teamA: 'Noruega',        teamB: 'Francia',              group: 'I', jornada: 3 },
  { match_id: 'I-6',  date: '2026-06-26', teamA: 'Senegal',        teamB: 'Irak',                 group: 'I', jornada: 3 },
  { match_id: 'H-5',  date: '2026-06-26', teamA: 'Cabo Verde',     teamB: 'Arabia Saudita',       group: 'H', jornada: 3 },
  { match_id: 'H-6',  date: '2026-06-26', teamA: 'Uruguay',        teamB: 'España',               group: 'H', jornada: 3 },
  { match_id: 'G-5',  date: '2026-06-26', teamA: 'Egipto',         teamB: 'Irán',                 group: 'G', jornada: 3 },
  { match_id: 'G-6',  date: '2026-06-26', teamA: 'Nueva Zelanda',  teamB: 'Bélgica',              group: 'G', jornada: 3 },
  { match_id: 'L-5',  date: '2026-06-27', teamA: 'Panamá',         teamB: 'Inglaterra',           group: 'L', jornada: 3 },
  { match_id: 'L-6',  date: '2026-06-27', teamA: 'Croacia',        teamB: 'Ghana',                group: 'L', jornada: 3 },
  { match_id: 'K-5',  date: '2026-06-27', teamA: 'Colombia',       teamB: 'Portugal',             group: 'K', jornada: 3 },
  { match_id: 'K-6',  date: '2026-06-27', teamA: 'RD Congo',       teamB: 'Uzbekistán',           group: 'K', jornada: 3 },
  { match_id: 'J-5',  date: '2026-06-27', teamA: 'Argelia',        teamB: 'Austria',              group: 'J', jornada: 3 },
  { match_id: 'J-6',  date: '2026-06-27', teamA: 'Jordania',       teamB: 'Argentina',            group: 'J', jornada: 3 },
];

const emptyStats = (player_id) => ({
  player_id, minutes_played: 90, goals: 0, assists: 0,
  yellow_cards: 0, red_cards: 0, clean_sheet: false,
  shots_on_target: 0, penalties_saved: 0, own_goals: 0, is_motm: false,
});

export default function Admin() {
  const { user } = useAuth();
  const [selectedMatch, setSelectedMatch] = useState('');
  const [players, setPlayers] = useState([]);
  const [teamAPlayers, setTeamAPlayers] = useState([]);
  const [teamBPlayers, setTeamBPlayers] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [searchA, setSearchA] = useState('');
  const [searchB, setSearchB] = useState('');
  const [jornadaFilter, setJornadaFilter] = useState(1);

  if (!user?.is_admin) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center' }}>
        <div style={{ fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: '4rem', color: R, lineHeight: 1 }}>403</div>
        <h2 style={{ fontFamily: 'Barlow Condensed', fontWeight: 800, fontSize: '1.5rem', marginTop: '0.5rem', textTransform: 'uppercase' }}>Acceso denegado</h2>
        <p style={{ color: '#666', marginTop: '0.5rem', fontSize: '0.875rem' }}>Solo el administrador puede acceder a esta seccion.</p>
      </div>
    );
  }

  useEffect(() => { fetchPlayers(); }, []);

  useEffect(() => {
    if (!selectedMatch) return;
    const match = MATCHES.find(m => m.match_id === selectedMatch);
    if (!match) return;
    const a = players.filter(p => p.team_name === match.teamA);
    const b = players.filter(p => p.team_name === match.teamB);
    setTeamAPlayers(a);
    setTeamBPlayers(b);
    const initStats = {};
    [...a, ...b].forEach(p => { initStats[p.id] = emptyStats(p.id); });
    setStats(initStats);
  }, [selectedMatch, players]);

  const fetchPlayers = async () => {
    try {
      const res = await api.get('/players');
      setPlayers(res.data.players || []);
    } catch {}
  };

  const updateStat = (player_id, field, value) => {
    setStats(s => ({ ...s, [player_id]: { ...s[player_id], [field]: value } }));
  };

  const setMOTM = (player_id) => {
    const newStats = { ...stats };
    Object.keys(newStats).forEach(id => { newStats[id] = { ...newStats[id], is_motm: false }; });
    newStats[player_id] = { ...newStats[player_id], is_motm: true };
    setStats(newStats);
  };

  const handleSubmit = async () => {
    setError(''); setLoading(true);
    try {
      const playerStats = Object.values(stats).filter(s =>
        s.minutes_played > 0 || s.goals > 0 || s.assists > 0 || s.is_motm
      );
      await api.post('/stats/match', { match_id: selectedMatch, player_stats: playerStats });
      setSuccess(`Stats del partido ${selectedMatch} cargadas correctamente.`);
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cargar stats');
    }
    setLoading(false);
  };

  const filteredMatches = MATCHES.filter(m => m.jornada === jornadaFilter);
  const match = MATCHES.find(m => m.match_id === selectedMatch);
  const inp = { background: '#000', border: '1px solid #1E1E1E', borderRadius: '4px', padding: '3px 6px', color: '#F0F0F0', fontSize: '0.78rem', outline: 'none', width: '50px', textAlign: 'center' };

  const PlayerRow = ({ player }) => {
    const s = stats[player.id] || emptyStats(player.id);
    return (
      <div style={{ background: s.is_motm ? '#1A1000' : '#0A0A0A', border: `1px solid ${s.is_motm ? G + '66' : '#1E1E1E'}`, borderRadius: '8px', padding: '0.6rem 0.875rem', marginBottom: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ minWidth: '160px', flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: '0.82rem' }}>{player.name}</div>
            <div style={{ color: '#666', fontSize: '0.68rem' }}>{player.position}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.6rem', color: '#666', marginBottom: '2px' }}>MIN</div>
            <input type="number" min="0" max="120" value={s.minutes_played} onChange={e => updateStat(player.id, 'minutes_played', Number(e.target.value))} style={{ ...inp, width: '45px' }} />
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.6rem', color: '#666', marginBottom: '2px' }}>GOL</div>
            <input type="number" min="0" max="10" value={s.goals} onChange={e => updateStat(player.id, 'goals', Number(e.target.value))} style={inp} />
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.6rem', color: '#666', marginBottom: '2px' }}>ASS</div>
            <input type="number" min="0" max="10" value={s.assists} onChange={e => updateStat(player.id, 'assists', Number(e.target.value))} style={inp} />
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.6rem', color: '#666', marginBottom: '2px' }}>TIR</div>
            <input type="number" min="0" max="20" value={s.shots_on_target} onChange={e => updateStat(player.id, 'shots_on_target', Number(e.target.value))} style={inp} />
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.6rem', color: '#666', marginBottom: '2px' }}>TA</div>
            <input type="number" min="0" max="2" value={s.yellow_cards} onChange={e => updateStat(player.id, 'yellow_cards', Number(e.target.value))} style={{ ...inp, borderColor: s.yellow_cards > 0 ? '#F5C842' : '#1E1E1E' }} />
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.6rem', color: '#666', marginBottom: '2px' }}>TR</div>
            <input type="number" min="0" max="1" value={s.red_cards} onChange={e => updateStat(player.id, 'red_cards', Number(e.target.value))} style={{ ...inp, borderColor: s.red_cards > 0 ? R : '#1E1E1E' }} />
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.6rem', color: '#666', marginBottom: '2px' }}>AG</div>
            <input type="number" min="0" max="5" value={s.own_goals} onChange={e => updateStat(player.id, 'own_goals', Number(e.target.value))} style={inp} />
          </div>
          {(player.position === 'Goalkeeper' || player.position === 'Defender') && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.6rem', color: '#666', marginBottom: '2px' }}>CS</div>
              <input type="checkbox" checked={s.clean_sheet} onChange={e => updateStat(player.id, 'clean_sheet', e.target.checked)} style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: G }} />
            </div>
          )}
          {player.position === 'Goalkeeper' && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.6rem', color: '#666', marginBottom: '2px' }}>PEN</div>
              <input type="number" min="0" max="5" value={s.penalties_saved} onChange={e => updateStat(player.id, 'penalties_saved', Number(e.target.value))} style={inp} />
            </div>
          )}
          <button onClick={() => setMOTM(player.id)}
            style={{ padding: '3px 8px', background: s.is_motm ? G : 'transparent', border: `1px solid ${s.is_motm ? G : '#2A2A2A'}`, borderRadius: '4px', color: s.is_motm ? '#000' : '#666', fontSize: '0.65rem', fontFamily: 'Barlow Condensed', fontWeight: 700, cursor: 'pointer' }}>
            MOTM
          </button>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: '2rem', marginBottom: '4px', textTransform: 'uppercase' }}>Admin — Cargar Stats</h1>
        <p style={{ color: '#666', fontSize: '0.875rem' }}>Carga las estadisticas de cada partido para calcular los puntos de todas las ligas.</p>
      </div>

      {/* Filtro jornada */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '1rem' }}>
        {[1, 2, 3].map(j => (
          <button key={j} onClick={() => { setJornadaFilter(j); setSelectedMatch(''); }}
            style={{ padding: '0.45rem 1rem', borderRadius: '6px', border: 'none', cursor: 'pointer', fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.05em',
              background: jornadaFilter === j ? G : '#0A0A0A',
              color: jornadaFilter === j ? '#000' : '#666',
              border: `1px solid ${jornadaFilter === j ? G : '#1E1E1E'}` }}>
            Jornada {j}
          </button>
        ))}
      </div>

      {/* Selector de partido */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ fontSize: '0.78rem', color: '#666', display: 'block', marginBottom: '6px', fontFamily: 'Barlow Condensed', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Seleccionar partido</label>
        <select value={selectedMatch} onChange={e => setSelectedMatch(e.target.value)}
          style={{ background: '#0A0A0A', border: '1px solid #1E1E1E', borderRadius: '8px', padding: '0.7rem 1rem', color: '#F0F0F0', fontSize: '0.875rem', outline: 'none', cursor: 'pointer', minWidth: '360px' }}>
          <option value="">-- Elegir partido --</option>
          {filteredMatches.map(m => <option key={m.match_id} value={m.match_id}>{m.date} · Grupo {m.group} · {m.teamA} vs {m.teamB}</option>)}
        </select>
      </div>

      {error && <div style={{ background: '#1A0000', border: '1px solid #7F1D1D', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1rem', color: '#FCA5A5', fontSize: '0.875rem' }}>{error}</div>}
      {success && <div style={{ background: '#1A1000', border: `1px solid ${G}44`, borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1rem', color: G, fontSize: '0.875rem' }}>{success}</div>}

      {selectedMatch && match && (
        <div>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap', fontSize: '0.72rem', color: '#666' }}>
            {[['MIN','Minutos'],['GOL','Goles'],['ASS','Asistencias'],['TIR','Tiros'],['TA','Amarilla'],['TR','Roja'],['AG','Autogol'],['CS','Clean Sheet'],['PEN','Penales'],['MOTM','MVP']].map(([k,v]) => (
              <span key={k}><span style={{ color: G, fontWeight: 700 }}>{k}</span> = {v}</span>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <h2 style={{ fontFamily: 'Barlow Condensed', fontWeight: 800, fontSize: '1.2rem', marginBottom: '0.75rem', textTransform: 'uppercase', color: B }}>{match.teamA}</h2>
              <input placeholder="Buscar..." value={searchA} onChange={e => setSearchA(e.target.value)}
                style={{ background: '#0A0A0A', border: '1px solid #1E1E1E', borderRadius: '6px', padding: '0.5rem 0.75rem', color: '#F0F0F0', fontSize: '0.8rem', outline: 'none', width: '100%', marginBottom: '0.75rem' }} />
              {teamAPlayers.filter(p => !searchA || p.name.toLowerCase().includes(searchA.toLowerCase())).map(p => <PlayerRow key={p.id} player={p} />)}
            </div>
            <div>
              <h2 style={{ fontFamily: 'Barlow Condensed', fontWeight: 800, fontSize: '1.2rem', marginBottom: '0.75rem', textTransform: 'uppercase', color: R }}>{match.teamB}</h2>
              <input placeholder="Buscar..." value={searchB} onChange={e => setSearchB(e.target.value)}
                style={{ background: '#0A0A0A', border: '1px solid #1E1E1E', borderRadius: '6px', padding: '0.5rem 0.75rem', color: '#F0F0F0', fontSize: '0.8rem', outline: 'none', width: '100%', marginBottom: '0.75rem' }} />
              {teamBPlayers.filter(p => !searchB || p.name.toLowerCase().includes(searchB.toLowerCase())).map(p => <PlayerRow key={p.id} player={p} />)}
            </div>
          </div>

          <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #1E1E1E', display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={handleSubmit} disabled={loading}
              style={{ padding: '0.875rem 2.5rem', background: loading ? '#A8893A' : G, border: 'none', borderRadius: '8px', color: '#000', fontFamily: 'Barlow Condensed', fontWeight: 800, fontSize: '1.1rem', letterSpacing: '0.05em', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Calculando puntos...' : 'Confirmar y calcular puntos'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
