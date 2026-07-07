import { useState } from 'react';

const G = '#C9A84C';
const R = '#E61D25';

const FLAG_CODES = {
  'Alemania': 'de', 'Paraguay': 'py', 'Francia': 'fr', 'Suecia': 'se',
  'Sudáfrica': 'za', 'Canadá': 'ca', 'Países Bajos': 'nl', 'Marruecos': 'ma',
  'Portugal': 'pt', 'Croacia': 'hr', 'España': 'es', 'Austria': 'at',
  'Bosnia y Herzegovina': 'ba', 'Estados Unidos': 'us', 'Senegal': 'sn', 'Bélgica': 'be',
  'Brasil': 'br', 'Japón': 'jp', 'Costa de Marfil': 'ci', 'Noruega': 'no',
  'México': 'mx', 'Ecuador': 'ec', 'Inglaterra': 'gb-eng', 'RD Congo': 'cd',
  'Argentina': 'ar', 'Cabo Verde': 'cv', 'Egipto': 'eg', 'Nueva Zelanda': 'nz',
  'Argelia': 'dz', 'Suiza': 'ch', 'Colombia': 'co', 'Ghana': 'gh',
};

const flagUrl = (team) => {
  const code = FLAG_CODES[team];
  return code ? `https://flagcdn.com/96x72/${code}.png` : null;
};

const MATCHES_R16 = [
  { id: 0,  teamA: 'Alemania',              teamB: 'Paraguay' },
  { id: 1,  teamA: 'Francia',               teamB: 'Suecia' },
  { id: 2,  teamA: 'Sudáfrica',             teamB: 'Canadá' },
  { id: 3,  teamA: 'Países Bajos',          teamB: 'Marruecos' },
  { id: 4,  teamA: 'Portugal',              teamB: 'Croacia' },
  { id: 5,  teamA: 'España',                teamB: 'Austria' },
  { id: 6,  teamA: 'Bosnia y Herzegovina', teamB: 'Estados Unidos' },
  { id: 7,  teamA: 'Senegal',               teamB: 'Bélgica' },
  { id: 8,  teamA: 'Brasil',                teamB: 'Japón' },
  { id: 9,  teamA: 'Costa de Marfil',      teamB: 'Noruega' },
  { id: 10, teamA: 'México',                teamB: 'Ecuador' },
  { id: 11, teamA: 'Inglaterra',            teamB: 'RD Congo' },
  { id: 12, teamA: 'Argentina',             teamB: 'Cabo Verde' },
  { id: 13, teamA: 'Egipto',                teamB: 'Nueva Zelanda' },
  { id: 14, teamA: 'Argelia',               teamB: 'Suiza' },
  { id: 15, teamA: 'Colombia',              teamB: 'Ghana' },
];

const W = 860, H = 860, CX = 430, CY = 430;

// Radios de cada ronda
const R_R16  = 360;  // 32 equipos
const R_QF   = 275;  // 16 equipos
const R_SF   = 195;  // 8 equipos
const R_SEMI = 118;  // 4 equipos
const R_FIN  = 52;   // 2 finalistas

// Tamaños de círculos
const S_R16  = 22;
const S_QF   = 20;
const S_SF   = 18;
const S_SEMI = 16;
const S_FIN  = 15;

const toRad = (deg) => (deg * Math.PI) / 180;
const getPos = (deg, r) => ({ x: CX + r * Math.cos(toRad(deg)), y: CY + r * Math.sin(toRad(deg)) });

const getR16Angles = (idx) => {
  const base = (idx / 16) * 360 + (360 / 32);
  return { angA: base - 5.5, angB: base + 5.5 };
};

const getQFAngles = (idx) => {
  const base = (idx / 8) * 360 + (360 / 16);
  return { angA: base - 10, angB: base + 10 };
};

const getSFAngles = (idx) => {
  const base = (idx / 4) * 360 + (360 / 8);
  return { angA: base - 18, angB: base + 18 };
};

const getSEMIAngles = (idx) => {
  const base = idx === 0 ? 270 : 90;
  return { angA: base - 22, angB: base + 22 };
};

const FIN_ANGLES = [180, 0];

export default function Bracket() {
  const [r16w,  setR16w]  = useState({});
  const [qfw,   setQfw]   = useState({});
  const [sfw,   setSfw]   = useState({});
  const [semiw, setSemiw] = useState({});
  const [champion, setChampion] = useState(null);

  const pickR16  = (id, t) => setR16w(w  => ({ ...w, [id]: t }));
  const pickQF   = (id, t) => setQfw(w   => ({ ...w, [id]: t }));
  const pickSF   = (id, t) => setSfw(w   => ({ ...w, [id]: t }));
  const pickSEMI = (id, t) => setSemiw(w => ({ ...w, [id]: t }));
  const reset = () => { setR16w({}); setQfw({}); setSfw({}); setSemiw({}); setChampion(null); };

  const qfMatches = Array.from({ length: 8 }, (_, i) => ({
    id: i, teamA: r16w[i*2] || '?', teamB: r16w[i*2+1] || '?',
  }));

  const sfMatches = Array.from({ length: 4 }, (_, i) => ({
    id: i, teamA: qfw[i*2] || '?', teamB: qfw[i*2+1] || '?',
  }));

  const semiMatches = [
    { id: 0, teamA: sfw[0] || '?', teamB: sfw[1] || '?' },
    { id: 1, teamA: sfw[2] || '?', teamB: sfw[3] || '?' },
  ];

  const finalist1 = semiw[0] || '?';
  const finalist2 = semiw[1] || '?';

  const FlagCircle = ({ team, x, y, size, elim, onPick }) => {
    const unknown = !team || team === '?';
    const url = !unknown ? flagUrl(team) : null;
    const clipId = `clip-${Math.round(x)}-${Math.round(y)}`;
    return (
      <g onClick={() => !elim && !unknown && onPick && onPick(team)}
        style={{ cursor: elim || unknown ? 'default' : 'pointer' }}>
        <defs><clipPath id={clipId}><circle cx={x} cy={y} r={size} /></clipPath></defs>
        {!elim && !unknown && <circle cx={x} cy={y} r={size+2.5} fill="none" stroke={G} strokeWidth="1.2" opacity="0.4" />}
        {url
          ? <image href={url} x={x-size} y={y-size} width={size*2} height={size*2}
              clipPath={`url(#${clipId})`} preserveAspectRatio="xMidYMid slice"
              style={{ filter: elim ? 'grayscale(1) brightness(0.2)' : 'none', transition: 'filter 0.3s' }} />
          : <circle cx={x} cy={y} r={size} fill="#111" stroke="#2A2A2A" strokeWidth="1" />
        }
        <circle cx={x} cy={y} r={size} fill="none"
          stroke={elim ? '#1A1A1A' : unknown ? '#2A2A2A' : G} strokeWidth={elim ? 0.8 : 1.5} />
        {unknown && <text x={x} y={y+1} textAnchor="middle" dominantBaseline="middle" fontSize={size*0.65} fill="#333" style={{userSelect:'none'}}>?</text>}
        {!unknown && <text x={x} y={y+size+8} textAnchor="middle" fontSize="6" fill={elim ? '#222' : '#999'} style={{fontFamily:'Barlow',userSelect:'none'}}>
          {team.length > 10 ? team.slice(0,9)+'.' : team}
        </text>}
      </g>
    );
  };

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '4px' }}>Fase Eliminatoria</h1>
          <p style={{ color: '#666', fontSize: '0.85rem' }}>16avos → 8vos → 4tos → Semis → Final → Campeón</p>
        </div>
        <button onClick={reset} style={{ padding: '0.6rem 1.25rem', background: 'transparent', border: `1px solid ${R}`, borderRadius: '8px', color: R, fontSize: '0.82rem', fontFamily: 'Barlow Condensed', fontWeight: 700, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Reiniciar
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', overflowX: 'auto' }}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ maxWidth: '100%' }}>

          {/* Guías */}
          {[R_R16, R_QF, R_SF, R_SEMI, R_FIN].map((r, i) => (
            <circle key={r} cx={CX} cy={CY} r={r} fill="none"
              stroke={i === 4 ? `${G}44` : '#1A1A1A'} strokeWidth="0.8"
              strokeDasharray={i === 4 ? '4,4' : 'none'} />
          ))}

          {/* Fondo negro para la copa para ocultar líneas que pasan por detrás */}
          <circle cx={CX} cy={CY} r={65} fill="#000000" />

          {/* Imagen de la copa con filtro de inversión nativo */}
<image href="/copa.jpg" x={CX-52} y={CY-70} width="104" height="140"
  preserveAspectRatio="xMidYMid meet"
  style={{ filter: 'invert(1) hue-rotate(180deg)' }} />

          {/* Campeón debajo de la copa */}
          {champion && (() => {
            const url = flagUrl(champion);
            const clipId = 'champClip';
            return (
              <>
                <defs><clipPath id={clipId}><circle cx={CX} cy={CY+52} r={18} /></clipPath></defs>
                {url && <image href={url} x={CX-18} y={CY+34} width="36" height="36"
                  clipPath={`url(#${clipId})`} preserveAspectRatio="xMidYMid slice" />}
                <circle cx={CX} cy={CY+52} r={18} fill="none" stroke={G} strokeWidth="1.5" />
                <text x={CX} y={CY+78} textAnchor="middle" fontSize="7" fill={G}
                  style={{ fontFamily:'Barlow Condensed', fontWeight:700, userSelect:'none' }}>
                  {champion.length > 10 ? champion.slice(0,9)+'.' : champion}
                </text>
              </>
            );
          })()}

          {/* ── 16AVOS: 32 equipos ── */}
          {MATCHES_R16.map((match, idx) => {
            const { angA, angB } = getR16Angles(idx);
            const pA = getPos(angA, R_R16), pB = getPos(angB, R_R16);
            const w = r16w[match.id];
            return (
              <g key={`r16-${match.id}`}>
                <line x1={pA.x} y1={pA.y} x2={pB.x} y2={pB.y} stroke="#1E1E1E" strokeWidth="0.8" />
                <FlagCircle team={match.teamA} x={pA.x} y={pA.y} size={S_R16} elim={!!(w && w!==match.teamA)} onPick={t => pickR16(match.id, t)} />
                <FlagCircle team={match.teamB} x={pB.x} y={pB.y} size={S_R16} elim={!!(w && w!==match.teamB)} onPick={t => pickR16(match.id, t)} />
              </g>
            );
          })}

          {/* ── 8VOS: 16 equipos ── */}
          {qfMatches.map((match, i) => {
            const { angA, angB } = getQFAngles(i);
            const pA = getPos(angA, R_QF), pB = getPos(angB, R_QF);
            const w = qfw[i];
            return (
              <g key={`qf-${i}`}>
                <line x1={pA.x} y1={pA.y} x2={pB.x} y2={pB.y} stroke="#1E1E1E" strokeWidth="0.8" />
                <FlagCircle team={match.teamA} x={pA.x} y={pA.y} size={S_QF} elim={!!(w && w!==match.teamA)} onPick={t => pickQF(i, t)} />
                <FlagCircle team={match.teamB} x={pB.x} y={pB.y} size={S_QF} elim={!!(w && w!==match.teamB)} onPick={t => pickQF(i, t)} />
              </g>
            );
          })}

          {/* ── 4TOS: 8 equipos ── */}
          {sfMatches.map((match, i) => {
            const { angA, angB } = getSFAngles(i);
            const pA = getPos(angA, R_SF), pB = getPos(angB, R_SF);
            const w = sfw[i];
            return (
              <g key={`sf-${i}`}>
                <line x1={pA.x} y1={pA.y} x2={pB.x} y2={pB.y} stroke="#1E1E1E" strokeWidth="0.8" />
                <FlagCircle team={match.teamA} x={pA.x} y={pA.y} size={S_SF} elim={!!(w && w!==match.teamA)} onPick={t => pickSF(i, t)} />
                <FlagCircle team={match.teamB} x={pB.x} y={pB.y} size={S_SF} elim={!!(w && w!==match.teamB)} onPick={t => pickSF(i, t)} />
              </g>
            );
          })}

          {/* ── SEMIS: 4 equipos (2 partidos) ── */}
          {semiMatches.map((match, i) => {
            const { angA, angB } = getSEMIAngles(i);
            const pA = getPos(angA, R_SEMI), pB = getPos(angB, R_SEMI);
            const w = semiw[i];
            return (
              <g key={`semi-${i}`}>
                <line x1={pA.x} y1={pA.y} x2={pB.x} y2={pB.y} stroke="#1E1E1E" strokeWidth="0.8" />
                <FlagCircle team={match.teamA} x={pA.x} y={pA.y} size={S_SEMI} elim={!!(w && w!==match.teamA)} onPick={t => pickSEMI(i, t)} />
                <FlagCircle team={match.teamB} x={pB.x} y={pB.y} size={S_SEMI} elim={!!(w && w!==match.teamB)} onPick={t => pickSEMI(i, t)} />
              </g>
            );
          })}

          {/* ── FINAL: 2 finalistas ── */}
          {(() => {
            const pA = getPos(FIN_ANGLES[0], R_FIN);
            const pB = getPos(FIN_ANGLES[1], R_FIN);
            const elimA = !!(champion && champion !== finalist1 && finalist1 !== '?');
            const elimB = !!(champion && champion !== finalist2 && finalist2 !== '?');
            return (
              <g>
                <line x1={pA.x} y1={pA.y} x2={pB.x} y2={pB.y} stroke="#1E1E1E" strokeWidth="0.8" />
                <FlagCircle team={finalist1} x={pA.x} y={pA.y} size={S_FIN} elim={elimA} onPick={t => setChampion(t)} />
                <FlagCircle team={finalist2} x={pB.x} y={pB.y} size={S_FIN} elim={elimB} onPick={t => setChampion(t)} />
              </g>
            );
          })()}

        </svg>
      </div>

      {/* Progreso */}
      <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.75rem' }}>
        {[
          { label: '16avos', wins: r16w,  max: 16 },
          { label: '8vos',   wins: qfw,   max: 8  },
          { label: '4tos',   wins: sfw,   max: 4  },
          { label: 'Semis',  wins: semiw, max: 2  },
        ].map(r => {
          const done = Object.keys(r.wins).length;
          return (
            <div key={r.label} style={{ background: '#0A0A0A', border: '1px solid #1E1E1E', borderRadius: '10px', padding: '0.875rem' }}>
              <div style={{ fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: '0.75rem', color: '#666', textTransform: 'uppercase', marginBottom: '6px' }}>{r.label}</div>
              <div style={{ background: '#1A1A1A', borderRadius: '4px', height: '4px', overflow: 'hidden' }}>
                <div style={{ background: G, height: '100%', width: `${Math.min((done/r.max)*100,100)}%`, transition: 'width 0.4s', borderRadius: '4px' }} />
              </div>
              <div style={{ fontSize: '0.7rem', color: '#555', marginTop: '5px' }}>{Math.min(done,r.max)}/{r.max}</div>
            </div>
          );
        })}
        <div style={{ background: '#0A0A0A', border: `1px solid ${champion ? G+'55' : '#1E1E1E'}`, borderRadius: '10px', padding: '0.875rem' }}>
          <div style={{ fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: '0.75rem', color: '#666', textTransform: 'uppercase', marginBottom: '4px' }}>Campeón</div>
          <div style={{ fontSize: '0.875rem', color: champion ? G : '#444', fontFamily: 'Barlow Condensed', fontWeight: 700 }}>
            {champion ? champion : 'Pendiente'}
          </div>
        </div>
      </div>
    </div>
  );
}