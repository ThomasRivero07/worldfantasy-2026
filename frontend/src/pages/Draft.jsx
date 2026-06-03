import { useState, useEffect } from 'react';
import api from '../services/api.js';

const G = '#C9A84C';
const R = '#E61D25';

const POSITIONS = ['Todos', 'Goalkeeper', 'Defender', 'Midfielder', 'Attacker'];
const POS_LABEL = { Goalkeeper: 'Portero', Defender: 'Defensa', Midfielder: 'Medio', Attacker: 'Delantero' };
const POS_COLOR = { Goalkeeper: '#F5C842', Defender: '#60A5FA', Midfielder: '#34D399', Attacker: '#F87171' };
const POS_SHORT = { Goalkeeper: 'POR', Defender: 'DEF', Midfielder: 'MED', Attacker: 'DEL' };

const BUDGET = 100;
const MAX_PLAYERS = 11;
const MAX_PER_POS = { Goalkeeper: 1, Defender: 4, Midfielder: 4, Attacker: 2 };
const PAGE_SIZE = 15;
const SORT_OPTIONS = [
  { value: 'price_desc', label: 'Mayor precio' },
  { value: 'price_asc',  label: 'Menor precio' },
  { value: 'name_asc',   label: 'Nombre A-Z' },
];

export default function Draft() {
  const [players, setPlayers] = useState([]);
  const [team, setTeam] = useState([]);
  const [search, setSearch] = useState('');
  const [position, setPosition] = useState('Todos');
  const [sort, setSort] = useState('price_desc');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [leagues, setLeagues] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState('');

  useEffect(() => { fetchPlayers(); fetchLeagues(); }, []);
  useEffect(() => { setPage(1); }, [search, position, sort]);

  const fetchPlayers = async () => {
    try { const res = await api.get('/players'); setPlayers(res.data.players || []); } catch {}
    setLoading(false);
  };
  const fetchLeagues = async () => {
    try {
      const res = await api.get('/leagues/my');
      setLeagues(res.data.leagues || []);
      if (res.data.leagues?.length > 0) setSelectedLeague(res.data.leagues[0].id);
    } catch {}
  };

  const budgetUsed = team.reduce((sum, p) => sum + Number(p.fantasy_price), 0);
  const budgetLeft = parseFloat((BUDGET - budgetUsed).toFixed(1));

  const canAdd = (player) => {
    if (team.find(p => p.id === player.id)) return false;
    if (team.length >= MAX_PLAYERS) return false;
    if (Number(player.fantasy_price) > budgetLeft) return false;
    if (team.filter(p => p.position === player.position).length >= MAX_PER_POS[player.position]) return false;
    return true;
  };

  const addPlayer = (player) => { if (canAdd(player)) setTeam(t => [...t, player]); };
  const removePlayer = (id) => { setTeam(t => t.filter(p => p.id !== id)); setSaved(false); };

  const filtered = players
    .filter(p => {
      const s = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.team_name.toLowerCase().includes(search.toLowerCase());
      return s && (position === 'Todos' || p.position === position);
    })
    .sort((a, b) => {
      if (sort === 'price_desc') return Number(b.fantasy_price) - Number(a.fantasy_price);
      if (sort === 'price_asc')  return Number(a.fantasy_price) - Number(b.fantasy_price);
      return a.name.localeCompare(b.name);
    });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const inp = { background: '#111118', border: '1px solid #2A2A38', borderRadius: '8px', padding: '0.6rem 1rem', color: '#F4F4F6', fontSize: '0.875rem', outline: 'none' };

  const PageBtn = ({ onClick, disabled, children }) => (
    <button onClick={onClick} disabled={disabled}
      style={{ padding: '4px 9px', background: 'transparent', border: '1px solid #2A2A38', borderRadius: '6px', color: disabled ? '#3A3A4E' : '#6B6B7E', cursor: disabled ? 'not-allowed' : 'pointer', fontSize: '0.8rem' }}>
      {children}
    </button>
  );

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.25rem', height: 'calc(100vh - 4rem)' }}>

      {/* LEFT */}
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <div style={{ marginBottom: '1rem' }}>
          <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '2rem', marginBottom: '2px' }}>Draft</h1>
          <p style={{ color: '#6B6B7E', fontSize: '0.85rem' }}>Arma tu equipo de 11 jugadores con ${BUDGET}M · {filtered.length} disponibles</p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
          <input placeholder="Buscar jugador o seleccion..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...inp, flex: 1, minWidth: '180px' }} />
          <select value={sort} onChange={e => setSort(e.target.value)} style={{ ...inp, cursor: 'pointer' }}>
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        <div style={{ display: 'flex', gap: '4px', marginBottom: '0.75rem' }}>
          {POSITIONS.map(pos => (
            <button key={pos} onClick={() => setPosition(pos)}
              style={{ padding: '0.4rem 0.8rem', borderRadius: '8px', border: `1px solid ${position === pos ? (pos === 'Todos' ? '#374151' : POS_COLOR[pos] + '55') : 'transparent'}`, cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500,
                background: position === pos ? (pos === 'Todos' ? '#2A2A38' : `${POS_COLOR[pos]}33`) : 'transparent',
                color: position === pos ? (pos === 'Todos' ? '#F4F4F6' : POS_COLOR[pos]) : '#6B6B7E' }}>
              {pos === 'Todos' ? 'Todos' : POS_SHORT[pos]}
            </button>
          ))}
        </div>

        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '5px', paddingRight: '4px' }}>
          {loading ? <div style={{ textAlign: 'center', padding: '2rem', color: '#6B6B7E' }}>Cargando...</div>
          : paginated.length === 0 ? <div style={{ textAlign: 'center', padding: '2rem', color: '#6B6B7E' }}>Sin resultados.</div>
          : paginated.map(player => {
            const inTeam = !!team.find(p => p.id === player.id);
            const addable = canAdd(player);
            const pc = POS_COLOR[player.position];
            return (
              <div key={player.id} style={{ background: inTeam ? '#1A160A' : '#111118', border: `1px solid ${inTeam ? G + '55' : '#2A2A38'}`, borderRadius: '10px', padding: '0.65rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', opacity: (!addable && !inTeam) ? 0.4 : 1 }}>
                <span style={{ fontSize: '0.68rem', padding: '2px 7px', borderRadius: '4px', background: `${pc}22`, color: pc, fontWeight: 700, flexShrink: 0 }}>{POS_SHORT[player.position]}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{player.name}</div>
                  <div style={{ color: '#6B6B7E', fontSize: '0.72rem' }}>{player.team_name} · Grupo {player.team_group}</div>
                </div>
                <span style={{ color: G, fontWeight: 700, fontSize: '0.875rem', flexShrink: 0 }}>${Number(player.fantasy_price).toFixed(1)}M</span>
                {inTeam
                  ? <button onClick={() => removePlayer(player.id)} style={{ padding: '4px 10px', background: '#2D1515', border: '1px solid #7F1D1D', borderRadius: '6px', color: '#FCA5A5', fontSize: '0.72rem', cursor: 'pointer', flexShrink: 0 }}>Quitar</button>
                  : <button onClick={() => addPlayer(player)} disabled={!addable} style={{ padding: '4px 10px', background: addable ? G : '#1A1A24', border: 'none', borderRadius: '6px', color: addable ? '#000' : '#4B5563', fontSize: '0.72rem', cursor: addable ? 'pointer' : 'not-allowed', fontWeight: 700, flexShrink: 0 }}>+ Agregar</button>
                }
              </div>
            );
          })}
        </div>

        {totalPages > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', paddingTop: '0.75rem', borderTop: '1px solid #2A2A38', marginTop: '0.75rem', flexWrap: 'wrap' }}>
            <PageBtn onClick={() => setPage(1)} disabled={page === 1}>«</PageBtn>
            <PageBtn onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Anterior</PageBtn>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let n;
              if (totalPages <= 5) n = i + 1;
              else if (page <= 3) n = i + 1;
              else if (page >= totalPages - 2) n = totalPages - 4 + i;
              else n = page - 2 + i;
              return (
                <button key={n} onClick={() => setPage(n)}
                  style={{ padding: '4px 10px', background: page === n ? G : 'transparent', border: `1px solid ${page === n ? G : '#2A2A38'}`, borderRadius: '6px', color: page === n ? '#000' : '#6B6B7E', cursor: 'pointer', fontSize: '0.8rem', fontWeight: page === n ? 700 : 400 }}>
                  {n}
                </button>
              );
            })}
            <PageBtn onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Siguiente</PageBtn>
            <PageBtn onClick={() => setPage(totalPages)} disabled={page === totalPages}>»</PageBtn>
            <span style={{ fontSize: '0.72rem', color: '#6B6B7E' }}>{(page-1)*PAGE_SIZE+1}–{Math.min(page*PAGE_SIZE, filtered.length)} de {filtered.length}</span>
          </div>
        )}
      </div>

      {/* RIGHT */}
      <div style={{ background: '#111118', border: '1px solid #2A2A38', borderRadius: '16px', padding: '1.25rem', display: 'flex', flexDirection: 'column', overflowY: 'auto', borderTop: `3px solid ${G}` }}>
        <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '1.4rem', marginBottom: '1rem' }}>Mi Equipo</h2>

        <div style={{ background: '#1A160A', border: `1px solid ${G}33`, borderRadius: '10px', padding: '0.875rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.78rem', color: '#6B6B7E' }}>Presupuesto restante</span>
            <span style={{ fontFamily: 'Bebas Neue', fontSize: '1.1rem', color: budgetLeft < 10 ? R : G }}>${budgetLeft}M</span>
          </div>
          <div style={{ background: '#2A2A38', borderRadius: '999px', height: '5px', overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: '999px', background: budgetLeft < 10 ? R : G, width: `${(budgetLeft/BUDGET)*100}%`, transition: 'width 0.3s' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px', fontSize: '0.7rem', color: '#6B6B7E' }}>
            <span>{team.length}/{MAX_PLAYERS} jugadores</span>
            <span>${budgetUsed.toFixed(1)}M usados</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', marginBottom: '1rem' }}>
          {Object.entries(MAX_PER_POS).map(([pos, max]) => {
            const count = team.filter(p => p.position === pos).length;
            return (
              <div key={pos} style={{ background: '#1A1A24', borderRadius: '6px', padding: '5px 8px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.7rem', color: '#6B6B7E' }}>{POS_SHORT[pos]}</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: count === max ? POS_COLOR[pos] : '#6B6B7E' }}>{count}/{max}</span>
              </div>
            );
          })}
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
          {['Goalkeeper','Defender','Midfielder','Attacker'].map(pos => {
            const posPlayers = team.filter(p => p.position === pos);
            if (!posPlayers.length) return null;
            return (
              <div key={pos}>
                <div style={{ fontSize: '0.65rem', color: POS_COLOR[pos], fontWeight: 700, letterSpacing: '0.1em', marginBottom: '3px', marginTop: '4px' }}>{POS_LABEL[pos].toUpperCase()}</div>
                {posPlayers.map(p => (
                  <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '5px 7px', background: '#1A1A24', borderRadius: '7px', marginBottom: '3px' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                      <div style={{ fontSize: '0.65rem', color: '#6B6B7E' }}>{p.team_name}</div>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: G, flexShrink: 0 }}>${Number(p.fantasy_price).toFixed(1)}M</span>
                    <button onClick={() => removePlayer(p.id)} style={{ background: 'transparent', border: 'none', color: '#6B6B7E', cursor: 'pointer', fontSize: '0.85rem', padding: 0, lineHeight: 1 }}>x</button>
                  </div>
                ))}
              </div>
            );
          })}
          {team.length === 0 && <div style={{ textAlign: 'center', padding: '1.5rem 1rem', color: '#6B6B7E', fontSize: '0.82rem', lineHeight: 1.6 }}>Selecciona jugadores de la lista para armar tu equipo</div>}
        </div>

        {team.length === MAX_PLAYERS && (
          <div style={{ marginTop: '1rem', borderTop: '1px solid #2A2A38', paddingTop: '1rem' }}>
            {leagues.length > 0 && (
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ fontSize: '0.75rem', color: '#6B6B7E', display: 'block', marginBottom: '4px' }}>Guardar en liga</label>
                <select value={selectedLeague} onChange={e => setSelectedLeague(e.target.value)}
                  style={{ width: '100%', background: '#1A1A24', border: '1px solid #2A2A38', borderRadius: '8px', padding: '0.55rem 0.75rem', color: '#F4F4F6', fontSize: '0.82rem', outline: 'none', cursor: 'pointer' }}>
                  {leagues.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                </select>
              </div>
            )}
            {saved
              ? <div style={{ textAlign: 'center', padding: '0.75rem', background: '#1A160A', border: `1px solid ${G}44`, borderRadius: '8px', color: G, fontSize: '0.875rem' }}>Equipo guardado correctamente</div>
              : <button onClick={async () => {
                  setSaving(true);
                  try { await api.post('/teams/draft', { league_id: selectedLeague, players: team.map(p => ({ player_id: p.id, position: p.position })) }); setSaved(true); }
                  catch (err) { alert(err.response?.data?.error || 'Error al guardar'); }
                  setSaving(false);
                }} disabled={saving}
                  style={{ width: '100%', padding: '0.85rem', background: saving ? '#A8893A' : G, border: 'none', borderRadius: '8px', color: '#000', fontWeight: 700, fontSize: '0.95rem', cursor: saving ? 'not-allowed' : 'pointer' }}>
                {saving ? 'Guardando...' : 'Guardar equipo'}
              </button>
            }
          </div>
        )}
      </div>
    </div>
  );
}
