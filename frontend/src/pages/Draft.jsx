import { useState, useEffect } from 'react';
import api from '../services/api.js';

const C = { red: '#D4213D', blue: '#002868', green: '#006847', gold: '#C9A84C', dark: '#080C18', dark2: '#0D1220', dark3: '#131928', border: '#1E2840', white: '#F0F4FF', gray: '#6B7A99' };
const POS_COLOR = { Goalkeeper: '#C9A84C', Defender: '#002868', Midfielder: '#006847', Attacker: '#D4213D' };
const POS_LABEL = { Goalkeeper: 'Portero', Defender: 'Defensa', Midfielder: 'Mediocampista', Attacker: 'Delantero' };
const POS_SHORT = { Goalkeeper: 'POR', Defender: 'DEF', Midfielder: 'MED', Attacker: 'DEL' };
const POSITIONS = ['Todos', 'Goalkeeper', 'Defender', 'Midfielder', 'Attacker'];
const BUDGET = 100;
const MAX_PLAYERS = 11;
const MAX_PER_POS = { Goalkeeper: 1, Defender: 4, Midfielder: 4, Attacker: 2 };

export default function Draft() {
  const [players, setPlayers] = useState([]);
  const [team, setTeam] = useState([]);
  const [search, setSearch] = useState('');
  const [position, setPosition] = useState('Todos');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [leagues, setLeagues] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState('');

  useEffect(() => {
    api.get('/players').then(r => { setPlayers(r.data.players || []); setLoading(false); }).catch(() => setLoading(false));
    api.get('/leagues/my').then(r => { setLeagues(r.data.leagues || []); if (r.data.leagues?.[0]) setSelectedLeague(r.data.leagues[0].id); }).catch(() => {});
  }, []);

  const budgetUsed = team.reduce((s, p) => s + Number(p.fantasy_price), 0);
  const budgetLeft = BUDGET - budgetUsed;

  const canAdd = (p) => !team.find(t => t.id === p.id) && team.length < MAX_PLAYERS && Number(p.fantasy_price) <= budgetLeft && team.filter(t => t.position === p.position).length < MAX_PER_POS[p.position];

  const filtered = players.filter(p => {
    const ms = !search || p.name.toLowerCase().includes(search.toLowerCase());
    const mp = position === 'Todos' || p.position === position;
    return ms && mp;
  });

  const inp = { background: C.dark2, border: `1px solid ${C.border}`, borderRadius: '8px', padding: '0.55rem 0.875rem', color: C.white, fontSize: '0.875rem', outline: 'none' };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem', height: 'calc(100vh - 4rem)' }}>

      {/* LEFT */}
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <div style={{ marginBottom: '1rem' }}>
          <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '2rem', marginBottom: '4px' }}>Draft</h1>
          <p style={{ color: C.gray, fontSize: '0.875rem' }}>Arma tu equipo de {MAX_PLAYERS} jugadores con ${BUDGET}M de presupuesto</p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <input placeholder="Buscar jugador..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...inp, flex: 1, minWidth: '150px' }} />
          <div style={{ display: 'flex', gap: '3px', background: C.dark2, border: `1px solid ${C.border}`, borderRadius: '8px', padding: '3px' }}>
            {POSITIONS.map(pos => (
              <button key={pos} onClick={() => setPosition(pos)}
                style={{ padding: '4px 10px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600,
                  background: position === pos ? (pos === 'Todos' ? '#1A2236' : `${POS_COLOR[pos]}22`) : 'transparent',
                  color: position === pos ? (pos === 'Todos' ? C.white : POS_COLOR[pos]) : C.gray }}>
                {pos === 'Todos' ? 'Todos' : POS_SHORT[pos]}
              </button>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1px', background: C.border, borderRadius: '10px', overflow: 'hidden', border: `1px solid ${C.border}` }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: C.gray, background: C.dark2 }}>Cargando...</div>
          ) : filtered.map(player => {
            const inTeam = !!team.find(p => p.id === player.id);
            const addable = canAdd(player);
            const pc = POS_COLOR[player.position];
            return (
              <div key={player.id} style={{ background: inTeam ? '#070F0A' : C.dark2, padding: '0.7rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', opacity: (!addable && !inTeam) ? 0.4 : 1, borderLeft: inTeam ? `3px solid ${C.green}` : `3px solid transparent` }}>
                <div style={{ width: '30px', height: '30px', borderRadius: '6px', background: `${pc}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontFamily: 'Bebas Neue', fontSize: '0.75rem', color: pc }}>{POS_SHORT[player.position]}</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{player.name}</div>
                  <div style={{ color: C.gray, fontSize: '0.72rem' }}>{player.team_name}</div>
                </div>
                <span style={{ color: C.gold, fontWeight: 700, fontSize: '0.82rem', flexShrink: 0 }}>${player.fantasy_price}M</span>
                {inTeam ? (
                  <button onClick={() => setTeam(t => t.filter(p => p.id !== player.id))}
                    style={{ padding: '3px 10px', background: '#1A0A0D', border: `1px solid #5C1020`, borderRadius: '6px', color: '#F87171', fontSize: '0.72rem', cursor: 'pointer', flexShrink: 0 }}>
                    Quitar
                  </button>
                ) : (
                  <button onClick={() => addable && setTeam(t => [...t, player])} disabled={!addable}
                    style={{ padding: '3px 10px', background: addable ? '#D4213D' : 'transparent', border: addable ? 'none' : `1px solid ${C.border}`, borderRadius: '6px', color: addable ? '#fff' : C.gray, fontSize: '0.72rem', cursor: addable ? 'pointer' : 'not-allowed', fontWeight: 600, flexShrink: 0 }}>
                    Agregar
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT */}
      <div style={{ background: C.dark2, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '1.25rem', display: 'flex', flexDirection: 'column', overflowY: 'auto', borderTop: `3px solid ${C.gold}` }}>
        <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '1.4rem', marginBottom: '1rem' }}>Mi Equipo</h2>

        {/* Presupuesto */}
        <div style={{ background: C.dark, border: `1px solid ${C.border}`, borderRadius: '10px', padding: '0.875rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.78rem', color: C.gray }}>Presupuesto restante</span>
            <span style={{ fontFamily: 'Bebas Neue', fontSize: '1.1rem', color: budgetLeft < 10 ? C.red : C.gold }}>${budgetLeft.toFixed(1)}M</span>
          </div>
          <div style={{ background: '#1A2236', borderRadius: '999px', height: '5px', overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: '999px', background: budgetLeft < 10 ? C.red : C.gold, width: `${(budgetLeft / BUDGET) * 100}%`, transition: 'width 0.3s' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.7rem', color: C.gray }}>
            <span>{team.length}/{MAX_PLAYERS} jugadores</span>
            <span>${budgetUsed.toFixed(1)}M usados</span>
          </div>
        </div>

        {/* Contadores por posicion */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', marginBottom: '1rem' }}>
          {Object.entries(MAX_PER_POS).map(([pos, max]) => {
            const count = team.filter(p => p.position === pos).length;
            const pc = POS_COLOR[pos];
            return (
              <div key={pos} style={{ background: C.dark, borderRadius: '6px', padding: '6px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: `1px solid ${count === max ? pc + '44' : C.border}` }}>
                <span style={{ fontSize: '0.7rem', color: C.gray }}>{POS_SHORT[pos]}</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: count === max ? pc : C.gray }}>{count}/{max}</span>
              </div>
            );
          })}
        </div>

        {/* Lista del equipo */}
        <div style={{ flex: 1 }}>
          {['Goalkeeper','Defender','Midfielder','Attacker'].map(pos => {
            const pp = team.filter(p => p.position === pos);
            if (!pp.length) return null;
            const pc = POS_COLOR[pos];
            return (
              <div key={pos} style={{ marginBottom: '8px' }}>
                <div style={{ fontSize: '0.68rem', color: pc, fontWeight: 700, letterSpacing: '0.1em', marginBottom: '4px' }}>{POS_LABEL[pos].toUpperCase()}</div>
                {pp.map(p => (
                  <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 8px', background: C.dark, borderRadius: '6px', marginBottom: '3px', borderLeft: `2px solid ${pc}` }}>
                    <span style={{ flex: 1, fontSize: '0.78rem', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</span>
                    <span style={{ fontSize: '0.72rem', color: C.gold }}>${p.fantasy_price}M</span>
                    <button onClick={() => setTeam(t => t.filter(x => x.id !== p.id))} style={{ background: 'transparent', border: 'none', color: C.gray, cursor: 'pointer', fontSize: '0.8rem', padding: '0 2px' }}>x</button>
                  </div>
                ))}
              </div>
            );
          })}
          {team.length === 0 && (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: C.gray, fontSize: '0.82rem' }}>
              Selecciona jugadores de la lista para armar tu equipo
            </div>
          )}
        </div>

        {/* Guardar */}
        {team.length === MAX_PLAYERS && (
          <div style={{ marginTop: '1rem', borderTop: `1px solid ${C.border}`, paddingTop: '1rem' }}>
            {leagues.length > 0 && (
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ fontSize: '0.78rem', color: C.gray, display: 'block', marginBottom: '4px' }}>Guardar en liga</label>
                <select value={selectedLeague} onChange={e => setSelectedLeague(e.target.value)}
                  style={{ width: '100%', background: C.dark, border: `1px solid ${C.border}`, borderRadius: '8px', padding: '0.6rem 0.75rem', color: C.white, fontSize: '0.82rem', outline: 'none', cursor: 'pointer' }}>
                  {leagues.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                </select>
              </div>
            )}
            {saved ? (
              <div style={{ textAlign: 'center', padding: '0.75rem', background: '#070F0A', border: `1px solid #0D3018`, borderRadius: '8px', color: '#6EE7B7', fontSize: '0.875rem' }}>
                Equipo guardado correctamente
              </div>
            ) : (
              <button onClick={async () => {
                setSaving(true);
                try {
                  await api.post('/teams/draft', { league_id: selectedLeague, players: team.map(p => ({ player_id: p.id, position: p.position })) });
                  setSaved(true);
                } catch (err) { alert(err.response?.data?.error || 'Error al guardar'); }
                setSaving(false);
              }} disabled={saving}
                style={{ width: '100%', padding: '0.85rem', background: saving ? C.red + '80' : C.red, border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer' }}>
                {saving ? 'Guardando...' : 'Guardar equipo'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
