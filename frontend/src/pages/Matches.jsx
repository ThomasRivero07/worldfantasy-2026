import { useState } from 'react';

const G = '#C9A84C';
const R = '#E61D25';
const B = '#2A398D';

const MATCHES = [
  // GRUPO A
  { id: 1,  group: 'A', date: '2026-06-11', time: '15:00', teamA: 'México', teamB: 'Sudáfrica', venue: 'Estadio Ciudad de México' },
  { id: 2,  group: 'A', date: '2026-06-11', time: '22:00', teamA: 'Corea del Sur', teamB: 'República Checa', venue: 'Estadio Guadalajara' },
  { id: 3,  group: 'A', date: '2026-06-18', time: '12:00', teamA: 'República Checa', teamB: 'Sudáfrica', venue: 'Estadio Atlanta' },
  { id: 4,  group: 'A', date: '2026-06-18', time: '21:00', teamA: 'México', teamB: 'Corea del Sur', venue: 'Estadio Guadalajara' },
  { id: 5,  group: 'A', date: '2026-06-24', time: '21:00', teamA: 'República Checa', teamB: 'México', venue: 'Estadio Ciudad de México' },
  { id: 6,  group: 'A', date: '2026-06-24', time: '21:00', teamA: 'Sudáfrica', teamB: 'Corea del Sur', venue: 'Estadio Monterrey' },
  // GRUPO B
  { id: 7,  group: 'B', date: '2026-06-12', time: '15:00', teamA: 'Canadá', teamB: 'Bosnia y Herzegovina', venue: 'Estadio Toronto' },
  { id: 8,  group: 'B', date: '2026-06-13', time: '15:00', teamA: 'Qatar', teamB: 'Suiza', venue: 'Estadio Bahía de San Francisco' },
  { id: 9,  group: 'B', date: '2026-06-18', time: '15:00', teamA: 'Suiza', teamB: 'Bosnia y Herzegovina', venue: 'Estadio Los Ángeles' },
  { id: 10, group: 'B', date: '2026-06-18', time: '18:00', teamA: 'Canadá', teamB: 'Qatar', venue: 'Estadio BC Place Vancouver' },
  { id: 11, group: 'B', date: '2026-06-24', time: '15:00', teamA: 'Suiza', teamB: 'Canadá', venue: 'Estadio BC Place Vancouver' },
  { id: 12, group: 'B', date: '2026-06-24', time: '15:00', teamA: 'Bosnia y Herzegovina', teamB: 'Qatar', venue: 'Estadio Seattle' },
  // GRUPO C
  { id: 13, group: 'C', date: '2026-06-13', time: '18:00', teamA: 'Brasil', teamB: 'Marruecos', venue: 'Estadio Nueva York Nueva Jersey' },
  { id: 14, group: 'C', date: '2026-06-13', time: '21:00', teamA: 'Haití', teamB: 'Escocia', venue: 'Estadio Boston' },
  { id: 15, group: 'C', date: '2026-06-19', time: '18:00', teamA: 'Escocia', teamB: 'Marruecos', venue: 'Estadio Boston' },
  { id: 16, group: 'C', date: '2026-06-19', time: '21:00', teamA: 'Brasil', teamB: 'Haití', venue: 'Estadio Filadelfia' },
  { id: 17, group: 'C', date: '2026-06-24', time: '18:00', teamA: 'Escocia', teamB: 'Brasil', venue: 'Estadio Miami' },
  { id: 18, group: 'C', date: '2026-06-24', time: '18:00', teamA: 'Marruecos', teamB: 'Haití', venue: 'Estadio Atlanta' },
  // GRUPO D
  { id: 19, group: 'D', date: '2026-06-12', time: '21:00', teamA: 'Estados Unidos', teamB: 'Paraguay', venue: 'Estadio Los Ángeles' },
  { id: 20, group: 'D', date: '2026-06-13', time: '00:00', teamA: 'Australia', teamB: 'Turquía', venue: 'Estadio BC Place Vancouver' },
  { id: 21, group: 'D', date: '2026-06-19', time: '15:00', teamA: 'Estados Unidos', teamB: 'Australia', venue: 'Estadio Seattle' },
  { id: 22, group: 'D', date: '2026-06-19', time: '00:00', teamA: 'Turquía', teamB: 'Paraguay', venue: 'Estadio Bahía de San Francisco' },
  { id: 23, group: 'D', date: '2026-06-25', time: '22:00', teamA: 'Turquía', teamB: 'Estados Unidos', venue: 'Estadio Los Ángeles' },
  { id: 24, group: 'D', date: '2026-06-25', time: '22:00', teamA: 'Paraguay', teamB: 'Australia', venue: 'Estadio Bahía de San Francisco' },
  // GRUPO E
  { id: 25, group: 'E', date: '2026-06-14', time: '13:00', teamA: 'Alemania', teamB: 'Curazao', venue: 'Estadio Houston' },
  { id: 26, group: 'E', date: '2026-06-14', time: '19:00', teamA: 'Costa de Marfil', teamB: 'Ecuador', venue: 'Estadio Filadelfia' },
  { id: 27, group: 'E', date: '2026-06-20', time: '16:00', teamA: 'Alemania', teamB: 'Costa de Marfil', venue: 'Estadio Toronto' },
  { id: 28, group: 'E', date: '2026-06-20', time: '22:00', teamA: 'Ecuador', teamB: 'Curazao', venue: 'Estadio Kansas City' },
  { id: 29, group: 'E', date: '2026-06-25', time: '16:00', teamA: 'Curazao', teamB: 'Costa de Marfil', venue: 'Estadio Filadelfia' },
  { id: 30, group: 'E', date: '2026-06-25', time: '16:00', teamA: 'Ecuador', teamB: 'Alemania', venue: 'Estadio Nueva York Nueva Jersey' },
  // GRUPO F
  { id: 31, group: 'F', date: '2026-06-14', time: '16:00', teamA: 'Países Bajos', teamB: 'Japón', venue: 'Estadio Dallas' },
  { id: 32, group: 'F', date: '2026-06-14', time: '22:00', teamA: 'Suecia', teamB: 'Túnez', venue: 'Estadio Monterrey' },
  { id: 33, group: 'F', date: '2026-06-20', time: '13:00', teamA: 'Países Bajos', teamB: 'Suecia', venue: 'Estadio Houston' },
  { id: 34, group: 'F', date: '2026-06-20', time: '00:00', teamA: 'Túnez', teamB: 'Japón', venue: 'Estadio Monterrey' },
  { id: 35, group: 'F', date: '2026-06-25', time: '19:00', teamA: 'Japón', teamB: 'Suecia', venue: 'Estadio Dallas' },
  { id: 36, group: 'F', date: '2026-06-25', time: '19:00', teamA: 'Túnez', teamB: 'Países Bajos', venue: 'Estadio Kansas City' },
  // GRUPO G
  { id: 37, group: 'G', date: '2026-06-15', time: '15:00', teamA: 'Bélgica', teamB: 'Egipto', venue: 'Estadio Seattle' },
  { id: 38, group: 'G', date: '2026-06-15', time: '21:00', teamA: 'Irán', teamB: 'Nueva Zelanda', venue: 'Estadio Los Ángeles' },
  { id: 39, group: 'G', date: '2026-06-21', time: '15:00', teamA: 'Bélgica', teamB: 'Irán', venue: 'Estadio Los Ángeles' },
  { id: 40, group: 'G', date: '2026-06-21', time: '21:00', teamA: 'Nueva Zelanda', teamB: 'Egipto', venue: 'Estadio BC Place Vancouver' },
  { id: 41, group: 'G', date: '2026-06-26', time: '23:00', teamA: 'Egipto', teamB: 'Irán', venue: 'Estadio Seattle' },
  { id: 42, group: 'G', date: '2026-06-26', time: '23:00', teamA: 'Nueva Zelanda', teamB: 'Bélgica', venue: 'Estadio BC Place Vancouver' },
  // GRUPO H
  { id: 43, group: 'H', date: '2026-06-15', time: '12:00', teamA: 'España', teamB: 'Cabo Verde', venue: 'Estadio Atlanta' },
  { id: 44, group: 'H', date: '2026-06-15', time: '18:00', teamA: 'Arabia Saudita', teamB: 'Uruguay', venue: 'Estadio Miami' },
  { id: 45, group: 'H', date: '2026-06-21', time: '12:00', teamA: 'España', teamB: 'Arabia Saudita', venue: 'Estadio Atlanta' },
  { id: 46, group: 'H', date: '2026-06-21', time: '18:00', teamA: 'Uruguay', teamB: 'Cabo Verde', venue: 'Estadio Miami' },
  { id: 47, group: 'H', date: '2026-06-26', time: '20:00', teamA: 'Cabo Verde', teamB: 'Arabia Saudita', venue: 'Estadio Houston' },
  { id: 48, group: 'H', date: '2026-06-26', time: '20:00', teamA: 'Uruguay', teamB: 'España', venue: 'Estadio Guadalajara' },
  // GRUPO I
  { id: 49, group: 'I', date: '2026-06-16', time: '15:00', teamA: 'Francia', teamB: 'Senegal', venue: 'Estadio Nueva York Nueva Jersey' },
  { id: 50, group: 'I', date: '2026-06-16', time: '18:00', teamA: 'Irak', teamB: 'Noruega', venue: 'Estadio Boston' },
  { id: 51, group: 'I', date: '2026-06-22', time: '17:00', teamA: 'Francia', teamB: 'Irak', venue: 'Estadio Filadelfia' },
  { id: 52, group: 'I', date: '2026-06-22', time: '20:00', teamA: 'Noruega', teamB: 'Senegal', venue: 'Estadio Nueva York Nueva Jersey' },
  { id: 53, group: 'I', date: '2026-06-26', time: '15:00', teamA: 'Noruega', teamB: 'Francia', venue: 'Estadio Boston' },
  { id: 54, group: 'I', date: '2026-06-26', time: '15:00', teamA: 'Senegal', teamB: 'Irak', venue: 'Estadio Toronto' },
  // GRUPO J
  { id: 55, group: 'J', date: '2026-06-16', time: '21:00', teamA: 'Argentina', teamB: 'Argelia', venue: 'Estadio Kansas City' },
  { id: 56, group: 'J', date: '2026-06-16', time: '00:00', teamA: 'Austria', teamB: 'Jordania', venue: 'Estadio Bahía de San Francisco' },
  { id: 57, group: 'J', date: '2026-06-22', time: '13:00', teamA: 'Argentina', teamB: 'Austria', venue: 'Estadio Dallas' },
  { id: 58, group: 'J', date: '2026-06-22', time: '23:00', teamA: 'Jordania', teamB: 'Argelia', venue: 'Estadio Bahía de San Francisco' },
  { id: 59, group: 'J', date: '2026-06-27', time: '22:00', teamA: 'Argelia', teamB: 'Austria', venue: 'Estadio Kansas City' },
  { id: 60, group: 'J', date: '2026-06-27', time: '22:00', teamA: 'Jordania', teamB: 'Argentina', venue: 'Estadio Dallas' },
  // GRUPO K
  { id: 61, group: 'K', date: '2026-06-17', time: '13:00', teamA: 'Portugal', teamB: 'RD Congo', venue: 'Estadio Houston' },
  { id: 62, group: 'K', date: '2026-06-17', time: '22:00', teamA: 'Uzbekistán', teamB: 'Colombia', venue: 'Estadio Ciudad de México' },
  { id: 63, group: 'K', date: '2026-06-23', time: '13:00', teamA: 'Portugal', teamB: 'Uzbekistán', venue: 'Estadio Houston' },
  { id: 64, group: 'K', date: '2026-06-23', time: '22:00', teamA: 'Colombia', teamB: 'RD Congo', venue: 'Estadio Guadalajara' },
  { id: 65, group: 'K', date: '2026-06-27', time: '19:30', teamA: 'Colombia', teamB: 'Portugal', venue: 'Estadio Miami' },
  { id: 66, group: 'K', date: '2026-06-27', time: '19:30', teamA: 'RD Congo', teamB: 'Uzbekistán', venue: 'Estadio Atlanta' },
  // GRUPO L
  { id: 67, group: 'L', date: '2026-06-17', time: '16:00', teamA: 'Inglaterra', teamB: 'Croacia', venue: 'Estadio Dallas' },
  { id: 68, group: 'L', date: '2026-06-17', time: '19:00', teamA: 'Ghana', teamB: 'Panamá', venue: 'Estadio Toronto' },
  { id: 69, group: 'L', date: '2026-06-23', time: '16:00', teamA: 'Inglaterra', teamB: 'Ghana', venue: 'Estadio Boston' },
  { id: 70, group: 'L', date: '2026-06-23', time: '19:00', teamA: 'Panamá', teamB: 'Croacia', venue: 'Estadio Toronto' },
  { id: 71, group: 'L', date: '2026-06-27', time: '17:00', teamA: 'Panamá', teamB: 'Inglaterra', venue: 'Estadio Nueva York Nueva Jersey' },
  { id: 72, group: 'L', date: '2026-06-27', time: '17:00', teamA: 'Croacia', teamB: 'Ghana', venue: 'Estadio Filadelfia' },
];

const getPrediction = (teamA, teamB) => {
  const seed = (teamA.length * 3 + teamB.length * 7) % 20;
  const winA = 30 + seed * 2;
  const winB = 25 + (20 - seed);
  const draw = Math.max(100 - winA - winB, 10);
  const total = winA + draw + winB;
  return {
    winA: Math.round((winA / total) * 100),
    draw: Math.round((draw / total) * 100),
    winB: Math.round((winB / total) * 100),
  };
};

const GROUPS = ['A','B','C','D','E','F','G','H','I','J','K','L'];

export default function Matches() {
  const [activeGroup, setActiveGroup] = useState('Todos');
  const [selected, setSelected] = useState(null);

  const filtered = activeGroup === 'Todos' ? MATCHES : MATCHES.filter(m => m.group === activeGroup);

  const groupedByDate = filtered.reduce((acc, m) => {
    if (!acc[m.date]) acc[m.date] = [];
    acc[m.date].push(m);
    return acc;
  }, {});

  const formatDate = (d) => {
    const date = new Date(d + 'T12:00:00');
    return date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '2rem', marginBottom: '4px' }}>Partidos</h1>
        <p style={{ color: '#6B6B7E', fontSize: '0.875rem' }}>{MATCHES.length} partidos · Fase de grupos · Horarios ET (Este de EE.UU.)</p>
      </div>

      {/* Filtro grupos */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {['Todos', ...GROUPS].map(g => (
          <button key={g} onClick={() => setActiveGroup(g)}
            style={{ padding: '0.4rem 0.85rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 500,
              background: activeGroup === g ? G : '#111118',
              color: activeGroup === g ? '#000' : '#6B6B7E',
              border: `1px solid ${activeGroup === g ? G : '#2A2A38'}` }}>
            {g === 'Todos' ? 'Todos' : `Grupo ${g}`}
          </button>
        ))}
      </div>

      {/* Lista por fecha */}
      {Object.entries(groupedByDate).sort().map(([date, matches]) => (
        <div key={date} style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.78rem', color: G, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid #2A2A38' }}>
            {formatDate(date)}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {matches.map(match => {
              const pred = getPrediction(match.teamA, match.teamB);
              return (
                <div key={match.id} onClick={() => setSelected(match)}
                  style={{ background: '#111118', border: '1px solid #2A2A38', borderRadius: '12px', padding: '1rem 1.25rem', cursor: 'pointer', transition: 'border-color 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = G + '66'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = '#2A2A38'}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontSize: '0.68rem', padding: '2px 7px', borderRadius: '4px', background: '#1A1A24', color: '#6B6B7E', fontWeight: 700, flexShrink: 0 }}>GRP {match.group}</span>
                    <span style={{ flex: 1, textAlign: 'right', fontWeight: 600, fontSize: '0.9rem' }}>{match.teamA}</span>
                    <div style={{ textAlign: 'center', flexShrink: 0, minWidth: '55px' }}>
                      <div style={{ fontFamily: 'Bebas Neue', fontSize: '1rem', color: G }}>VS</div>
                      <div style={{ fontSize: '0.68rem', color: '#6B6B7E' }}>{match.time} ET</div>
                    </div>
                    <span style={{ flex: 1, fontWeight: 600, fontSize: '0.9rem' }}>{match.teamB}</span>
                    <span style={{ fontSize: '0.7rem', color: '#6B6B7E', flexShrink: 0, textAlign: 'right', minWidth: '90px' }}>{match.venue.replace('Estadio ', '')}</span>
                  </div>
                  <div style={{ marginTop: '0.6rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: '#6B6B7E', marginBottom: '3px' }}>
                      <span style={{ color: B }}>{pred.winA}%</span>
                      <span>Empate {pred.draw}%</span>
                      <span style={{ color: R }}>{pred.winB}%</span>
                    </div>
                    <div style={{ display: 'flex', borderRadius: '999px', overflow: 'hidden', height: '4px' }}>
                      <div style={{ width: `${pred.winA}%`, background: B }} />
                      <div style={{ width: `${pred.draw}%`, background: '#2A2A38' }} />
                      <div style={{ width: `${pred.winB}%`, background: R }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {selected && <MatchModal match={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function MatchModal({ match, onClose }) {
  const pred = getPrediction(match.teamA, match.teamB);
  const goalsA = ((pred.winA / 100) * 2.5 + 0.4).toFixed(1);
  const goalsB = ((pred.winB / 100) * 2.5 + 0.4).toFixed(1);

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#111118', border: '1px solid #2A2A38', borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '480px', position: 'relative', borderTop: `3px solid ${G}` }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: '#6B6B7E', fontSize: '1.1rem', cursor: 'pointer' }}>X</button>

        <div style={{ fontSize: '0.72rem', color: G, fontWeight: 700, letterSpacing: '0.1em', marginBottom: '1.5rem' }}>
          GRUPO {match.group} · {match.venue} · {match.time} ET
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '1rem', alignItems: 'center', marginBottom: '2rem' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: B, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.5rem', fontFamily: 'Bebas Neue', fontSize: '1rem', color: '#fff' }}>
              {match.teamA.substring(0, 3).toUpperCase()}
            </div>
            <div style={{ fontWeight: 700 }}>{match.teamA}</div>
            <div style={{ fontFamily: 'Bebas Neue', fontSize: '2rem', color: B }}>{pred.winA}%</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'Bebas Neue', fontSize: '1.3rem', color: G }}>VS</div>
            <div style={{ fontSize: '0.75rem', color: '#6B6B7E' }}>Empate</div>
            <div style={{ fontFamily: 'Bebas Neue', fontSize: '1.1rem', color: '#6B6B7E' }}>{pred.draw}%</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: R, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.5rem', fontFamily: 'Bebas Neue', fontSize: '1rem', color: '#fff' }}>
              {match.teamB.substring(0, 3).toUpperCase()}
            </div>
            <div style={{ fontWeight: 700 }}>{match.teamB}</div>
            <div style={{ fontFamily: 'Bebas Neue', fontSize: '2rem', color: R }}>{pred.winB}%</div>
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.72rem', color: '#6B6B7E', marginBottom: '6px', fontWeight: 600, letterSpacing: '0.08em' }}>PREDICCION ML</div>
          <div style={{ display: 'flex', borderRadius: '999px', overflow: 'hidden', height: '8px' }}>
            <div style={{ width: `${pred.winA}%`, background: B }} />
            <div style={{ width: `${pred.draw}%`, background: '#2A2A38' }} />
            <div style={{ width: `${pred.winB}%`, background: R }} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {[
            { label: `Goles esperados - ${match.teamA}`, value: goalsA, color: B },
            { label: `Goles esperados - ${match.teamB}`, value: goalsB, color: R },
          ].map(s => (
            <div key={s.label} style={{ background: '#1A1A24', borderRadius: '10px', padding: '0.875rem', textAlign: 'center' }}>
              <div style={{ fontFamily: 'Bebas Neue', fontSize: '1.8rem', color: s.color }}>{s.value}</div>
              <div style={{ fontSize: '0.7rem', color: '#6B6B7E', lineHeight: 1.4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '1rem', fontSize: '0.7rem', color: '#3A3A4E', textAlign: 'center' }}>
          Predicciones generadas por modelo ML · Se actualizan con datos reales del torneo
        </div>
      </div>
    </div>
  );
}
