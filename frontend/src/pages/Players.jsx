import { useState, useEffect } from 'react';
import api from '../services/api.js';

const C = { red: '#D4213D', blue: '#002868', green: '#006847', gold: '#C9A84C', dark: '#080C18', dark2: '#0D1220', border: '#1E2840', white: '#F0F4FF', gray: '#6B7A99' };
const POSITIONS = ['Todos', 'Goalkeeper', 'Defender', 'Midfielder', 'Attacker'];
const POS_LABEL = { Goalkeeper: 'Portero', Defender: 'Defensa', Midfielder: 'Mediocampista', Attacker: 'Delantero' };
const POS_SHORT = { Goalkeeper: 'POR', Defender: 'DEF', Midfielder: 'MED', Attacker: 'DEL' };
const POS_COLOR = { Goalkeeper: '#C9A84C', Defender: '#002868', Midfielder: '#006847', Attacker: '#D4213D' };

const TEAMS = ['Todos','Argentina','Brasil','Colombia','Ecuador','Paraguay','Uruguay','Canada','Estados Unidos','Mexico','Alemania','Austria','Belgica','Bosnia y Herzegovina','Croacia','Escocia','Espana','Francia','Inglaterra','Noruega','Paises Bajos','Portugal','Republica Checa','Suiza','Suecia','Turquia','Curazao','Haiti','Panama','Argelia','Cabo Verde','Costa de Marfil','Egipto','Ghana','Marruecos','Senegal','Sudafrica','Tunez','Arabia Saudita','Australia','Corea del Sur','Emiratos Arabes','Iran','Irak','Japon','Jordania','Qatar','Uzbekistan','Nueva Zelanda'];

export default function Players() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [position, setPosition] = useState('Todos');
  const [team, setTeam] = useState('Todos');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api.get('/players').then(res => { setPlayers(res.data.players || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const filtered = players.filter(p => {
    const ms = !search || p.name.toLowerCase().includes(search.toLowerCase());
    const mp = position === 'Todos' || p.position === position;
    const mt = team === 'Todos' || p.team_name === team;
    return ms && mp && mt;
  });

  const inp = { background: C.dark2, border: `1px solid ${C.border}`, borderRadius: '8px', padding: '0.6rem 1rem', color: C.white, fontSize: '0.875rem', outline: 'none' };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '2rem', marginBottom: '4px' }}>Jugadores</h1>
        <p style={{ color: C.gray, fontSize: '0.875rem' }}>{players.length} jugadores de 48 selecciones</p>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <input placeholder="Buscar jugador..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...inp, flex: 1, minWidth: '180px' }} />
        <select value={position} onChange={e => setPosition(e.target.value)} style={{ ...inp, cursor: 'pointer' }}>
          {POSITIONS.map(p => <option key={p} value={p}>{p === 'Todos' ? 'Todas las posiciones' : POS_LABEL[p]}</option>)}
        </select>
        <select value={team} onChange={e => setTeam(e.target.value)} style={{ ...inp, cursor: 'pointer', maxWidth: '190px' }}>
          {TEAMS.map(t => <option key={t} value={t}>{t === 'Todos' ? 'Todas las selecciones' : t}</option>)}
        </select>
        {(search || position !== 'Todos' || team !== 'Todos') && (
          <button onClick={() => { setSearch(''); setPosition('Todos'); setTeam('Todos'); }} style={{ ...inp, cursor: 'pointer', color: '#F87171', border: `1px solid #5C1020` }}>
            Limpiar
          </button>
        )}
      </div>

      <div style={{ color: C.gray, fontSize: '0.78rem', marginBottom: '1rem' }}>{filtered.length} jugadores</div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: C.gray }}>Cargando...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1px', background: C.border, borderRadius: '12px', overflow: 'hidden', border: `1px solid ${C.border}` }}>
          {filtered.map(p => <PlayerCard key={p.id} player={p} onClick={() => setSelected(p)} />)}
          {filtered.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: C.gray, background: C.dark2 }}>
              No se encontraron jugadores.
            </div>
          )}
        </div>
      )}

      {selected && <PlayerModal player={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function PlayerCard({ player, onClick }) {
  const pc = POS_COLOR[player.position] || '#9CA3AF';
  return (
    <div onClick={onClick} style={{ background: '#0D1220', padding: '1rem', cursor: 'pointer', display: 'flex', gap: '0.875rem', alignItems: 'center', borderLeft: `3px solid ${pc}33` }}
      onMouseEnter={e => e.currentTarget.style.background = '#131928'}
      onMouseLeave={e => e.currentTarget.style.background = '#0D1220'}>
      <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: `${pc}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: `1px solid ${pc}33` }}>
        <span style={{ fontFamily: 'Bebas Neue', fontSize: '0.9rem', color: pc }}>{POS_SHORT[player.position]}</span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: '0.875rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{player.name}</div>
        <div style={{ color: '#6B7A99', fontSize: '0.75rem', marginTop: '2px' }}>{player.team_name}</div>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ fontFamily: 'Bebas Neue', fontSize: '1.1rem', color: '#C9A84C' }}>${player.fantasy_price}M</div>
        <div style={{ fontSize: '0.65rem', color: '#6B7A99' }}>ML: {player.ml_score ?? '--'}</div>
      </div>
    </div>
  );
}

function PlayerModal({ player, onClose }) {
  const pc = POS_COLOR[player.position] || '#9CA3AF';
  const stats = [
    { label: 'Goles', value: player.goals ?? 0 },
    { label: 'Asistencias', value: player.assists ?? 0 },
    { label: 'Amarillas', value: player.yellow_cards ?? 0 },
    { label: 'Rojas', value: player.red_cards ?? 0 },
    { label: 'Minutos', value: player.minutes_played ?? 0 },
    { label: 'Rating', value: player.rating ?? '--' },
  ];
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#0D1220', border: '1px solid #1E2840', borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '460px', position: 'relative', borderTop: `3px solid ${pc}` }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: '#6B7A99', fontSize: '1.1rem', cursor: 'pointer' }}>X</button>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ width: '54px', height: '54px', borderRadius: '10px', background: `${pc}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${pc}44` }}>
            <span style={{ fontFamily: 'Bebas Neue', fontSize: '1.1rem', color: pc }}>{POS_SHORT[player.position]}</span>
          </div>
          <div>
            <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '1.5rem', marginBottom: '2px' }}>{player.name}</h2>
            <div style={{ color: '#6B7A99', fontSize: '0.82rem' }}>{player.team_name} · #{player.number} · {player.age} años</div>
            <div style={{ marginTop: '6px', display: 'flex', gap: '8px' }}>
              <span style={{ fontSize: '0.72rem', padding: '2px 10px', borderRadius: '999px', background: `${pc}18`, color: pc, fontWeight: 600 }}>{POS_LABEL[player.position]}</span>
              <span style={{ fontSize: '0.72rem', padding: '2px 10px', borderRadius: '999px', background: '#1A1608', color: '#C9A84C', fontWeight: 700 }}>${player.fantasy_price}M</span>
            </div>
          </div>
        </div>

        <div style={{ background: '#080C18', border: '1px solid #1E2840', borderRadius: '10px', padding: '1rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#6B7A99', marginBottom: '4px' }}>Score ML esperado</div>
            <div style={{ fontFamily: 'Bebas Neue', fontSize: '2rem', color: '#C9A84C' }}>{player.ml_score ?? 'Sin datos'}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.72rem', color: '#6B7A99' }}>Grupo</div>
            <div style={{ fontFamily: 'Bebas Neue', fontSize: '1.5rem', color: '#F0F4FF' }}>{player.team_group ?? '--'}</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: '#1E2840', borderRadius: '8px', overflow: 'hidden' }}>
          {stats.map(s => (
            <div key={s.label} style={{ background: '#131928', padding: '0.875rem', textAlign: 'center' }}>
              <div style={{ fontFamily: 'Bebas Neue', fontSize: '1.4rem', color: '#F0F4FF' }}>{s.value}</div>
              <div style={{ fontSize: '0.7rem', color: '#6B7A99' }}>{s.label}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '0.75rem', fontSize: '0.72rem', color: '#6B7A99', textAlign: 'center' }}>Stats se actualizan durante el torneo</div>
      </div>
    </div>
  );
}
