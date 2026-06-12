import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import Leagues from './Leagues.jsx';
import Players from './Players.jsx';
import Draft from './Draft.jsx';
import Matches from './Matches.jsx';
import MyTeam from './MyTeam.jsx';
import Transfers from './Transfers.jsx';
import Admin from './Admin.jsx';

const G = '#C9A84C';
const R = '#E61D25';
const B = '#2A5298';


const NAV_ITEMS = [
  { key: 'home',      label: 'Inicio' },
  { key: 'leagues',   label: 'Ligas' },
  { key: 'myteam',    label: 'Mi Equipo' },
  { key: 'transfers', label: 'Fichajes' },
  { key: 'players',   label: 'Jugadores' },
  { key: 'draft',     label: 'Draft' },
  { key: 'matches',   label: 'Partidos' },
  { key: 'admin',     label: 'Admin', adminOnly: true },
];

const MOBILE_NAV = [
  { key: 'home',      label: 'Inicio',   icon: '⌂' },
  { key: 'myteam',    label: 'Equipo',   icon: '◉' },
  { key: 'draft',     label: 'Draft',    icon: '✦' },
  { key: 'transfers', label: 'Fichajes', icon: '⇄' },
  { key: 'matches',   label: 'Partidos', icon: '▶' },
];

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return isMobile;
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [active, setActive] = useState('home');
  const isMobile = useIsMobile();
  const handleLogout = () => { logout(); navigate('/'); };
  const isAdmin = user?.is_admin === true;

  return (
    <div style={{ minHeight: '100vh', background: '#000', display: 'flex' }}>

      {!isMobile && (
        <>
          <div style={{ width: '3px', background: `linear-gradient(to bottom, ${R} 33%, ${G} 33%, ${G} 66%, #3CAC3B 66%)`, flexShrink: 0 }} />
          <aside style={{ width: '220px', background: '#0A0A0A', borderRight: '1px solid #1E1E1E', display: 'flex', flexDirection: 'column', padding: '1.5rem 0', flexShrink: 0 }}>
            <div style={{ padding: '0 1.25rem', marginBottom: '2rem' }}>
              <div style={{ fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: '1.4rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                <span style={{ color: G }}>WORLD</span><span style={{ color: '#F0F0F0' }}>FANTASY</span>
              </div>
              <div style={{ color: R, fontSize: '0.72rem', fontFamily: 'Barlow Condensed', fontWeight: 700, letterSpacing: '0.15em' }}>2026</div>
            </div>

            <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px', padding: '0 0.75rem' }}>
              {NAV_ITEMS.filter(item => !item.adminOnly || isAdmin).map(item => (
                <button key={item.key} onClick={() => setActive(item.key)}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0.65rem 0.85rem', borderRadius: '6px', border: 'none',
                    background: active === item.key ? '#111' : 'transparent',
                    color: active === item.key ? (item.adminOnly ? R : G) : '#666',
                    borderLeft: active === item.key ? `3px solid ${item.adminOnly ? R : G}` : '3px solid transparent',
                    cursor: 'pointer', fontSize: '0.875rem', fontFamily: 'Barlow Condensed', fontWeight: active === item.key ? 700 : 500,
                    letterSpacing: '0.05em', textTransform: 'uppercase', textAlign: 'left', transition: 'all 0.15s' }}>
                  {item.label}
                  {item.adminOnly && <span style={{ fontSize: '0.55rem', background: R, color: '#fff', padding: '1px 5px', borderRadius: '3px', marginLeft: 'auto' }}>ADMIN</span>}
                </button>
              ))}
            </nav>

            <div style={{ padding: '1rem', borderTop: '1px solid #1E1E1E', marginTop: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: G, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: '1rem' }}>
                  {user?.username?.[0]?.toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, fontFamily: 'Barlow Condensed' }}>{user?.username}</div>
                  <div style={{ fontSize: '0.72rem', color: '#666' }}>0 pts</div>
                </div>
              </div>
              <button onClick={handleLogout}
                style={{ width: '100%', padding: '0.5rem', background: 'transparent', border: '1px solid #1E1E1E', borderRadius: '6px', color: '#666', fontSize: '0.78rem', fontFamily: 'Barlow Condensed', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', cursor: 'pointer' }}>
                Cerrar sesion
              </button>
            </div>
          </aside>
        </>
      )}

      <main style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', paddingBottom: isMobile ? '70px' : '1.5rem' }}>
        {isMobile && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <span style={{ fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: '1.2rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              <span style={{ color: G }}>WORLD</span><span style={{ color: '#F0F0F0' }}>FANTASY</span>
              <span style={{ color: R, marginLeft: '6px' }}>2026</span>
            </span>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: G, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: '0.85rem' }}>
                {user?.username?.[0]?.toUpperCase()}
              </div>
              <button onClick={handleLogout} style={{ padding: '4px 10px', background: 'transparent', border: '1px solid #1E1E1E', borderRadius: '6px', color: '#666', fontSize: '0.7rem', fontFamily: 'Barlow Condensed', fontWeight: 600, textTransform: 'uppercase', cursor: 'pointer' }}>
                Salir
              </button>
            </div>
          </div>
        )}

        {active === 'home'      && <HomeTab user={user} setActive={setActive} />}
        {active === 'leagues'   && <Leagues />}
        {active === 'myteam'    && <MyTeam />}
        {active === 'transfers' && <Transfers />}
        {active === 'players'   && <Players />}
        {active === 'draft'     && <Draft />}
        {active === 'matches'   && <Matches />}
        {active === 'admin'     && <Admin />}
      </main>

      {isMobile && (
        <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#0A0A0A', borderTop: '1px solid #1E1E1E', display: 'flex', zIndex: 100 }}>
          {MOBILE_NAV.map(item => (
            <button key={item.key} onClick={() => setActive(item.key)}
              style={{ flex: 1, padding: '0.6rem 0.25rem', background: 'transparent', border: 'none',
                color: active === item.key ? G : '#555',
                borderTop: active === item.key ? `2px solid ${G}` : '2px solid transparent',
                cursor: 'pointer', fontSize: '0.55rem', fontFamily: 'Barlow Condensed', fontWeight: 700,
                letterSpacing: '0.05em', textTransform: 'uppercase', display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: '3px', transition: 'color 0.15s' }}>
              <span style={{ fontSize: '1.15rem' }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}

function HomeTab({ user, setActive }) {
  const stats = [
    { label: 'Puntos', value: '0', color: G },
    { label: 'Ligas', value: '0', color: B },
    { label: 'Equipo', value: '0/11', color: '#3CAC3B' },
    { label: 'Posicion', value: '--', color: R },
  ];
  return (
    <div className="fade-in">
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: 'clamp(1.5rem, 6vw, 2.5rem)', marginBottom: '4px', textTransform: 'uppercase' }}>
          Bienvenido, <span style={{ color: G }}>{user?.username}</span>
        </h1>
        <p style={{ color: '#666', fontSize: '0.875rem' }}>El Mundial arranca el 11 de junio.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {stats.map(s => (
          <div key={s.label} className="card-hover" style={{ background: '#0A0A0A', border: '1px solid #1E1E1E', borderRadius: '10px', padding: '1rem', borderTop: `3px solid ${s.color}` }}>
            <div style={{ fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: '2rem', color: s.color, lineHeight: 1 }}>{s.value}</div>
            <div style={{ color: '#666', fontSize: '0.72rem', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <h2 style={{ fontFamily: 'Barlow Condensed', fontWeight: 800, fontSize: '1rem', marginBottom: '0.75rem', color: '#444', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Accesos rapidos</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Mi Equipo', desc: 'Ver puntos, elegir capitan y seguir tu rendimiento', action: 'myteam', color: G },
          { label: 'Fichajes', desc: 'Cambia jugadores entre jornadas del Mundial', action: 'transfers', color: R },
          { label: 'Mis Ligas', desc: 'Tabla de posiciones y codigo de invitacion', action: 'leagues', color: B },
          { label: 'Partidos', desc: 'Fixture completo con predicciones ML', action: 'matches', color: '#3CAC3B' },
        ].map(item => (
          <div key={item.label} className="card-hover" style={{ background: '#0A0A0A', border: '1px solid #1E1E1E', borderRadius: '10px', padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', borderLeft: `3px solid ${item.color}` }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: '0.95rem', textTransform: 'uppercase', marginBottom: '2px' }}>{item.label}</div>
              <div style={{ color: '#666', fontSize: '0.78rem' }}>{item.desc}</div>
            </div>
            <button onClick={() => setActive(item.action)}
              style={{ padding: '0.4rem 0.85rem', background: 'transparent', border: `1px solid ${item.color}`, borderRadius: '6px', color: item.color, fontSize: '0.75rem', fontFamily: 'Barlow Condensed', fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              Ir
            </button>
          </div>
        ))}
      </div>

      <div style={{ background: '#0A0A0A', border: '1px solid #1E1E1E', borderRadius: '10px', padding: '1.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: `linear-gradient(to right, ${R} 33%, ${G} 33%, ${G} 66%, #3CAC3B 66%)` }} />
        <div className="pulse" style={{ color: G, fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.2em', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Mundial FIFA 2026</div>
        <div style={{ fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: 'clamp(1.8rem, 6vw, 3rem)', lineHeight: 1, textTransform: 'uppercase' }}>11 de Junio, 2026</div>
        <div style={{ color: '#666', fontSize: '0.8rem', marginTop: '8px' }}>USA · Mexico · Canada · 48 selecciones</div>
      </div>
    </div>
  );
}
