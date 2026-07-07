import { useState } from 'react';

const G = '#C9A84C';

const FLAG_CODES = {
  'México': 'mx', 'Sudáfrica': 'za', 'Corea del Sur': 'kr', 'República Checa': 'cz',
  'Suiza': 'ch', 'Canadá': 'ca', 'Bosnia y Herzegovina': 'ba', 'Qatar': 'qa',
  'Brasil': 'br', 'Marruecos': 'ma', 'Escocia': 'gb-sct', 'Haití': 'ht',
  'Estados Unidos': 'us', 'Australia': 'au', 'Paraguay': 'py', 'Turquía': 'tr',
  'Alemania': 'de', 'Costa de Marfil': 'ci', 'Ecuador': 'ec', 'Curazao': 'cw',
  'Países Bajos': 'nl', 'Japón': 'jp', 'Suecia': 'se', 'Túnez': 'tn',
  'Bélgica': 'be', 'Egipto': 'eg', 'Irán': 'ir', 'Nueva Zelanda': 'nz',
  'España': 'es', 'Cabo Verde': 'cv', 'Uruguay': 'uy', 'Arabia Saudita': 'sa',
  'Francia': 'fr', 'Noruega': 'no', 'Senegal': 'sn', 'Irak': 'iq',
  'Argentina': 'ar', 'Austria': 'at', 'Argelia': 'dz', 'Jordania': 'jo',
  'Colombia': 'co', 'Portugal': 'pt', 'RD Congo': 'cd', 'Uzbekistán': 'uz',
  'Inglaterra': 'gb-eng', 'Croacia': 'hr', 'Ghana': 'gh', 'Panamá': 'pa',
};

const flagUrl = (team) => {
  const code = FLAG_CODES[team];
  return code ? `https://flagcdn.com/32x24/${code}.png` : null;
};

// Resultados reales del Mundial 2026
// status: 'first' = 1ro, 'second' = 2do, 'third_adv' = 3ro clasificado, 'third_elim' = 3ro eliminado, 'elim' = eliminado
const GROUPS = [
  {
    name: 'A',
    teams: [
      { name: 'México',           pts: 9,  gf: 6, ga: 1, gd: 5,  pj: 3, status: 'first' },
      { name: 'Sudáfrica',        pts: 4,  gf: 2, ga: 3, gd: -1, pj: 3, status: 'second' },
      { name: 'Corea del Sur',    pts: 3,  gf: 3, ga: 4, gd: -1, pj: 3, status: 'third_elim' },
      { name: 'República Checa',  pts: 1,  gf: 2, ga: 6, gd: -4, pj: 3, status: 'elim' },
    ],
  },
  {
    name: 'B',
    teams: [
      { name: 'Suiza',               pts: 7,  gf: 6, ga: 2, gd: 4,  pj: 3, status: 'first' },
      { name: 'Canadá',              pts: 4,  gf: 6, ga: 1, gd: 5,  pj: 3, status: 'second' },
      { name: 'Bosnia y Herzegovina',pts: 4,  gf: 2, ga: 3, gd: -1, pj: 3, status: 'third_adv' },
      { name: 'Qatar',               pts: 1,  gf: 2, ga: 10,gd: -8, pj: 3, status: 'elim' },
    ],
  },
  {
    name: 'C',
    teams: [
      { name: 'Brasil',   pts: 7,  gf: 8, ga: 2, gd: 6,  pj: 3, status: 'first' },
      { name: 'Marruecos',pts: 7,  gf: 4, ga: 1, gd: 3,  pj: 3, status: 'second' },
      { name: 'Escocia',  pts: 3,  gf: 2, ga: 5, gd: -3, pj: 3, status: 'third_elim' },
      { name: 'Haití',    pts: 0,  gf: 1, ga: 7, gd: -6, pj: 3, status: 'elim' },
    ],
  },
  {
    name: 'D',
    teams: [
      { name: 'Estados Unidos', pts: 6,  gf: 5, ga: 1, gd: 4,  pj: 3, status: 'first' },
      { name: 'Australia',      pts: 4,  gf: 2, ga: 2, gd: 0,  pj: 3, status: 'second' },
      { name: 'Paraguay',       pts: 4,  gf: 2, ga: 4, gd: -2, pj: 3, status: 'third_adv' },
      { name: 'Turquía',        pts: 3,  gf: 2, ga: 4, gd: -2, pj: 3, status: 'elim' },
    ],
  },
  {
    name: 'E',
    teams: [
      { name: 'Alemania',      pts: 6,  gf: 7, ga: 1, gd: 6,  pj: 3, status: 'first' },
      { name: 'Costa de Marfil',pts: 6, gf: 4, ga: 2, gd: 2,  pj: 3, status: 'second' },
      { name: 'Ecuador',       pts: 4,  gf: 3, ga: 3, gd: 0,  pj: 3, status: 'third_adv' },
      { name: 'Curazao',       pts: 1,  gf: 1, ga: 9, gd: -8, pj: 3, status: 'elim' },
    ],
  },
  {
    name: 'F',
    teams: [
      { name: 'Países Bajos', pts: 7,  gf: 10,ga: 4, gd: 6,  pj: 3, status: 'first' },
      { name: 'Japón',        pts: 5,  gf: 7, ga: 3, gd: 4,  pj: 3, status: 'second' },
      { name: 'Suecia',       pts: 4,  gf: 7, ga: 7, gd: 0,  pj: 3, status: 'third_adv' },
      { name: 'Túnez',        pts: 0,  gf: 1, ga: 11,gd: -10,pj: 3, status: 'elim' },
    ],
  },
  {
    name: 'G',
    teams: [
      { name: 'Bélgica',     pts: 5,  gf: 6, ga: 3, gd: 3,  pj: 3, status: 'first' },
      { name: 'Egipto',      pts: 5,  gf: 5, ga: 3, gd: 2,  pj: 3, status: 'second' },
      { name: 'Irán',        pts: 3,  gf: 3, ga: 3, gd: 0,  pj: 3, status: 'elim' },
      { name: 'Nueva Zelanda',pts: 1, gf: 3, ga: 8, gd: -5, pj: 3, status: 'elim' },
    ],
  },
  {
    name: 'H',
    teams: [
      { name: 'España',        pts: 7,  gf: 5, ga: 0, gd: 5,  pj: 3, status: 'first' },
      { name: 'Cabo Verde',    pts: 3,  gf: 2, ga: 2, gd: 0,  pj: 3, status: 'second' },
      { name: 'Uruguay',       pts: 2,  gf: 3, ga: 4, gd: -1, pj: 3, status: 'elim' },
      { name: 'Arabia Saudita',pts: 2,  gf: 1, ga: 5, gd: -4, pj: 3, status: 'elim' },
    ],
  },
  {
    name: 'I',
    teams: [
      { name: 'Francia',  pts: 9,  gf: 10,ga: 2, gd: 8,  pj: 3, status: 'first' },
      { name: 'Noruega',  pts: 6,  gf: 8, ga: 7, gd: 1,  pj: 3, status: 'second' },
      { name: 'Senegal',  pts: 3,  gf: 7, ga: 10,gd: -3, pj: 3, status: 'third_adv' },
      { name: 'Irak',     pts: 0,  gf: 1, ga: 7, gd: -6, pj: 3, status: 'elim' },
    ],
  },
  {
    name: 'J',
    teams: [
      { name: 'Argentina', pts: 9,  gf: 8, ga: 1, gd: 7,  pj: 3, status: 'first' },
      { name: 'Austria',   pts: 4,  gf: 4, ga: 4, gd: 0,  pj: 3, status: 'second' },
      { name: 'Argelia',   pts: 4,  gf: 4, ga: 6, gd: -2, pj: 3, status: 'third_adv' },
      { name: 'Jordania',  pts: 0,  gf: 0, ga: 5, gd: -5, pj: 3, status: 'elim' },
    ],
  },
  {
    name: 'K',
    teams: [
      { name: 'Colombia',   pts: 7,  gf: 4, ga: 1, gd: 3,  pj: 3, status: 'first' },
      { name: 'Portugal',   pts: 5,  gf: 6, ga: 1, gd: 5,  pj: 3, status: 'second' },
      { name: 'RD Congo',   pts: 4,  gf: 4, ga: 3, gd: 1,  pj: 3, status: 'third_adv' },
      { name: 'Uzbekistán', pts: 0,  gf: 0, ga: 7, gd: -7, pj: 3, status: 'elim' },
    ],
  },
  {
    name: 'L',
    teams: [
      { name: 'Inglaterra', pts: 7,  gf: 5, ga: 1, gd: 4,  pj: 3, status: 'first' },
      { name: 'Croacia',    pts: 6,  gf: 4, ga: 4, gd: 0,  pj: 3, status: 'second' },
      { name: 'Ghana',      pts: 4,  gf: 4, ga: 4, gd: 0,  pj: 3, status: 'third_adv' },
      { name: 'Panamá',     pts: 0,  gf: 0, ga: 4, gd: -4, pj: 3, status: 'elim' },
    ],
  },
];

const STATUS_CONFIG = {
  first:      { bg: '#0A1F0A', border: '#1A5C1A', label: '1ro', color: '#4CAF50' },
  second:     { bg: '#0A1F0A', border: '#1A5C1A', label: '2do', color: '#4CAF50' },
  third_adv:  { bg: '#1A1500', border: '#5C4A00', label: '3ro', color: '#FFC107' },
  third_elim: { bg: '#1A0A0A', border: '#5C1A1A', label: '3ro', color: '#E61D25' },
  elim:       { bg: '#1A0A0A', border: '#5C1A1A', label: 'Elim', color: '#E61D25' },
};

export default function Groups() {
  const [view, setView] = useState('grid'); // grid | list

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '4px' }}>Fase de Grupos</h1>
          <p style={{ color: '#666', fontSize: '0.85rem' }}>Resultados finales de los 12 grupos del Mundial 2026</p>
        </div>
      </div>

      {/* Leyenda */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {[
          { color: '#4CAF50', bg: '#0A1F0A', label: '1ro / 2do — Clasificado directo' },
          { color: '#FFC107', bg: '#1A1500', label: '3ro — Mejor tercero clasificado' },
          { color: '#E61D25', bg: '#1A0A0A', label: '3ro / 4to — Eliminado' },
        ].map(l => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: '#888' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: l.bg, border: `1px solid ${l.color}` }} />
            {l.label}
          </div>
        ))}
      </div>

      {/* Grilla de grupos */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
        {GROUPS.map(group => (
          <div key={group.name} style={{ background: '#0A0A0A', border: '1px solid #1E1E1E', borderRadius: '12px', overflow: 'hidden' }}>
            {/* Header del grupo */}
            <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #1E1E1E', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: `${G}22`, border: `1px solid ${G}44`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: '0.85rem', color: G }}>{group.name}</span>
              </div>
              <span style={{ fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#888' }}>
                Grupo {group.name}
              </span>
            </div>

            {/* Header tabla */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 28px 28px 28px 28px 28px', gap: '4px', padding: '0.4rem 0.875rem', borderBottom: '1px solid #111' }}>
              <span style={{ fontSize: '0.65rem', color: '#444', fontFamily: 'Barlow Condensed', fontWeight: 700, textTransform: 'uppercase' }}>Equipo</span>
              {['PJ','GF','GC','DG','PTS'].map(h => (
                <span key={h} style={{ fontSize: '0.65rem', color: '#444', fontFamily: 'Barlow Condensed', fontWeight: 700, textTransform: 'uppercase', textAlign: 'center' }}>{h}</span>
              ))}
            </div>

            {/* Equipos */}
            {group.teams.map((team, i) => {
              const cfg = STATUS_CONFIG[team.status];
              const url = flagUrl(team.name);
              return (
                <div key={team.name}
                  style={{ display: 'grid', gridTemplateColumns: '1fr 28px 28px 28px 28px 28px', gap: '4px', padding: '0.5rem 0.875rem', alignItems: 'center',
                    background: cfg.bg, borderBottom: i < 3 ? '1px solid #0F0F0F' : 'none',
                    borderLeft: `3px solid ${cfg.color}` }}>

                  {/* Nombre + bandera */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                    <span style={{ fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: '0.7rem', color: cfg.color, width: '18px', flexShrink: 0 }}>
                      {i + 1}
                    </span>
                    {url ? (
                      <img src={url} alt={team.name}
                        style={{ width: '20px', height: '15px', objectFit: 'cover', borderRadius: '2px', flexShrink: 0 }} />
                    ) : (
                      <div style={{ width: '20px', height: '15px', background: '#222', borderRadius: '2px', flexShrink: 0 }} />
                    )}
                    <span style={{ fontSize: '0.78rem', fontWeight: 500, color: team.status === 'elim' || team.status === 'third_elim' ? '#444' : '#E0E0E0',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {team.name}
                    </span>
                  </div>

                  {/* Stats */}
                  {[team.pj, team.gf, team.ga, team.gd > 0 ? `+${team.gd}` : team.gd].map((val, j) => (
                    <span key={j} style={{ fontSize: '0.75rem', textAlign: 'center', color: '#555', fontFamily: 'Barlow Condensed' }}>{val}</span>
                  ))}
                  <span style={{ fontSize: '0.82rem', textAlign: 'center', fontFamily: 'Barlow Condensed', fontWeight: 700, color: cfg.color }}>{team.pts}</span>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Resumen terceros clasificados */}
      <div style={{ marginTop: '2rem' }}>
        <h2 style={{ fontFamily: 'Barlow Condensed', fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.75rem', color: '#666', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Mejores terceros clasificados
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
          {GROUPS.flatMap(g => g.teams.filter(t => t.status === 'third_adv').map(t => ({ ...t, group: g.name }))).map(team => {
            const url = flagUrl(team.name);
            return (
              <div key={team.name} style={{ background: '#1A1500', border: '1px solid #5C4A00', borderRadius: '8px', padding: '0.6rem 0.875rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {url && <img src={url} alt={team.name} style={{ width: '20px', height: '15px', objectFit: 'cover', borderRadius: '2px' }} />}
                <span style={{ fontSize: '0.8rem', color: '#FFC107', fontFamily: 'Barlow Condensed', fontWeight: 700 }}>{team.name}</span>
                <span style={{ fontSize: '0.7rem', color: '#666' }}>Grp {team.group} · {team.pts} pts</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
