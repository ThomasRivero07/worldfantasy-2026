import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import Leagues from './Leagues.jsx';
import Players from './Players.jsx';
import Draft from './Draft.jsx';
import Matches from './Matches.jsx';

const G = '#C9A84C';
const R = '#E61D25';
const B = '#2A5298';

const NAV_ITEMS = [
  { key: 'home',    label: 'Inicio' },
  { key: 'leagues', label: 'Mis Ligas' },
  { key: 'players', label: 'Jugadores' },
  { key: 'draft',   label: 'Draft' },
  { key: 'matches', label: 'Partidos' },
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [active, setActive] = useState('home');
  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div style={{ minHeight: '100vh', background: '#000', display: 'flex' }}>
      <div style={{ width: '3px', background: `linear-gradient(to bottom, ${R} 33%, ${G} 33%, ${G} 66%, #3CAC3B 66%)`, flexShrink: 0 }} />

      <aside style={{ width: '220px', background: '#0A0A0A', borderRight: '1px solid #1E1E1E', display: 'flex', flexDirection: 'column', padding: '1.5rem 0', flexShrink: 0 }}>
        <div style={{ padding: '0 1.25rem', marginBottom: '2rem' }}>
          <div style={{ fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: '1.4rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            <span style={{ color: G }}>WORLD</span><span style={{ color: '#F0F0F0' }}>FANTASY</span>
          </div>
          <div style={{ color: R, fontSize: '0.72rem', fontFamily: 'Barlow Condensed', fontWeight: 700, letterSpacing: '0.15em' }}>2026</div>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px', padding: '0 0.75rem' }}>
          {NAV_ITEMS.map(item => (
            <button key={item.key} onClick={() => setActive(item.key)} className="nav-item"
              style={{ display: 'flex', alignItems: 'center', padding: '0.65rem 0.85rem', borderRadius: '6px', border: 'none',
                background: active === item.key ? '#111' : 'transparent',
                color: active === item.key ? G : '#666',
                borderLeft: active === item.key ? `3px solid ${G}` : '3px solid transparent',
                cursor: 'pointer', fontSize: '0.875rem', fontFamily: 'Barlow Condensed', fontWeight: active === item.key ? 700 : 500,
                letterSpacing: '0.05em', textTransform: 'uppercase', textAlign: 'left' }}>
              {item.label}
            </button>
          ))}
        </nav>

        <div style={{ padding: '1rem', borderTop: '1px solid #1E1E1E', marginTop: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: G, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: '1rem' }}>
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, fontFamily: 'Barlow Condensed', letterSpacing: '0.03em' }}>{user?.username}</div>
              <div style={{ fontSize: '0.72rem', color: '#666' }}>0 pts</div>
            </div>
          </div>
          <button onClick={handleLogout} className="btn-outline"
            style={{ width: '100%', padding: '0.5rem', background: 'transparent', border: '1px solid #1E1E1E', borderRadius: '6px', color: '#666', fontSize: '0.78rem', fontFamily: 'Barlow Condensed', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', cursor: 'pointer' }}>
            Cerrar sesion
          </button>
        </div>
      </aside>

      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        {active === 'home'    && <HomeTab user={user} setActive={setActive} />}
        {active === 'leagues' && <Leagues />}
        {active === 'players' && <Players />}
        {active === 'draft'   && <Draft />}
        {active === 'matches' && <Matches />}
      </main>
    </div>
  );
}

function HomeTab({ user, setActive }) {
  const stats = [
    { label: 'Puntos totales', value: '0', color: G },
    { label: 'Ligas activas', value: '0', color: B },
    { label: 'Jugadores', value: '0/11', color: '#3CAC3B' },
    { label: 'Posicion global', value: '--', color: R },
  ];
  return (
    <div className="fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: '2.5rem', marginBottom: '4px', textTransform: 'uppercase' }}>
          Bienvenido, <span style={{ color: G }}>{user?.username}</span>
        </h1>
        <p style={{ color: '#666', fontSize: '0.9rem' }}>El Mundial arranca el 11 de junio. Arma tu equipo antes que nadie.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {stats.map(s => (
          <div key={s.label} className="card-hover" style={{ background: '#0A0A0A', border: '1px solid #1E1E1E', borderRadius: '10px', padding: '1.25rem', borderTop: `3px solid ${s.color}` }}>
            <div style={{ fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: '2.2rem', color: s.color, lineHeight: 1 }}>{s.value}</div>
            <div style={{ color: '#666', fontSize: '0.78rem', marginTop: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <h2 style={{ fontFamily: 'Barlow Condensed', fontWeight: 800, fontSize: '1.2rem', marginBottom: '1rem', color: '#444', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Proximos pasos</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
        {[
          { label: 'Crear una liga', desc: 'Invita amigos y competi durante todo el Mundial', action: 'leagues', color: R },
          { label: 'Explorar jugadores', desc: 'Analiza el plantel de las 48 selecciones y sus stats', action: 'players', color: B },
          { label: 'Hacer el draft', desc: 'Arma tu equipo de 11 con $100M de presupuesto', action: 'draft', color: G },
          { label: 'Ver partidos', desc: 'Fixture completo con predicciones ML por partido', action: 'matches', color: '#3CAC3B' },
        ].map(item => (
          <div key={item.label} className="card-hover" style={{ background: '#0A0A0A', border: '1px solid #1E1E1E', borderRadius: '10px', padding: '1.1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: `3px solid ${item.color}` }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: '1rem', letterSpacing: '0.03em', textTransform: 'uppercase', marginBottom: '2px' }}>{item.label}</div>
              <div style={{ color: '#666', fontSize: '0.82rem' }}>{item.desc}</div>
            </div>
            <button onClick={() => setActive(item.action)} className="btn-outline"
              style={{ padding: '0.5rem 1rem', background: 'transparent', border: `1px solid ${item.color}`, borderRadius: '6px', color: item.color, fontSize: '0.8rem', fontFamily: 'Barlow Condensed', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              Ir ahora
            </button>
          </div>
        ))}
      </div>

      <div style={{ background: '#0A0A0A', border: '1px solid #1E1E1E', borderRadius: '10px', padding: '1.75rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: `linear-gradient(to right, ${R} 33%, ${G} 33%, ${G} 66%, #3CAC3B 66%)` }} />
        <div className="pulse" style={{ color: G, fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.2em', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Mundial FIFA 2026</div>
        <div style={{ fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: '3rem', lineHeight: 1, textTransform: 'uppercase' }}>11 de Junio, 2026</div>
        <div style={{ color: '#666', fontSize: '0.875rem', marginTop: '8px' }}>Estados Unidos · Mexico · Canada · 48 selecciones · 104 partidos</div>
      </div>
    </div>
  );
}
