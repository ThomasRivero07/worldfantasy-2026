import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

const NAV_ITEMS = [
  { key: 'home',    icon: '🏠', label: 'Inicio' },
  { key: 'leagues', icon: '🏆', label: 'Mis Ligas' },
  { key: 'players', icon: '⚽', label: 'Jugadores' },
  { key: 'draft',   icon: '📋', label: 'Draft' },
  { key: 'matches', icon: '🗓️', label: 'Partidos' },
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [active, setActive] = useState('home');

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--dark)', display: 'flex' }}>
      {/* SIDEBAR */}
      <aside style={{ width: '220px', background: 'var(--dark-2)', borderRight: '1px solid #1F2937', display: 'flex', flexDirection: 'column', padding: '1.5rem 0', flexShrink: 0 }}>
        <div style={{ padding: '0 1.25rem', marginBottom: '2rem' }}>
          <span style={{ fontFamily: 'Bebas Neue', fontSize: '1.3rem', color: 'var(--green)', letterSpacing: '0.1em' }}>
            WORLD<span style={{ color: 'var(--white)' }}>FANTASY</span>
          </span>
          <span style={{ display: 'block', color: 'var(--gold)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em' }}>2026 ⚽</span>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', padding: '0 0.75rem' }}>
          {NAV_ITEMS.map(item => (
            <button key={item.key} onClick={() => setActive(item.key)}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0.65rem 0.85rem', borderRadius: '8px', border: 'none', background: active === item.key ? '#1a2e1a' : 'transparent', color: active === item.key ? 'var(--green)' : '#9CA3AF', cursor: 'pointer', fontSize: '0.9rem', fontWeight: active === item.key ? 600 : 400, textAlign: 'left', transition: 'all 0.15s' }}
            >
              <span>{item.icon}</span> {item.label}
            </button>
          ))}
        </nav>

        {/* USER */}
        <div style={{ padding: '1rem', borderTop: '1px solid #1F2937', marginTop: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 700, fontSize: '0.9rem' }}>
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{user?.username}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--gray)' }}>0 pts</div>
            </div>
          </div>
          <button onClick={handleLogout}
            style={{ width: '100%', padding: '0.5rem', background: 'transparent', border: '1px solid #374151', borderRadius: '6px', color: '#9CA3AF', fontSize: '0.8rem', cursor: 'pointer' }}>
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        {active === 'home' && <HomeTab user={user} setActive={setActive} />}
        {active === 'leagues' && <ComingSoon title="Mis Ligas" desc="Creá o unite a una liga privada con amigos. Próximamente." icon="🏆" />}
        {active === 'players' && <ComingSoon title="Jugadores" desc="Explorá los 736 jugadores del Mundial con sus stats y score ML." icon="⚽" />}
        {active === 'draft' && <ComingSoon title="Draft" desc="Armá tu equipo de 11 jugadores con $100M de presupuesto." icon="📋" />}
        {active === 'matches' && <ComingSoon title="Partidos" desc="Fixture completo del Mundial 2026 con predicciones ML." icon="🗓️" />}
      </main>
    </div>
  );
}

function HomeTab({ user, setActive }) {
  const stats = [
    { label: 'Puntos totales', value: '0', icon: '⭐' },
    { label: 'Ligas activas', value: '0', icon: '🏆' },
    { label: 'Jugadores en equipo', value: '0/11', icon: '⚽' },
    { label: 'Posición global', value: '--', icon: '📊' },
  ];

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '2rem', marginBottom: '4px' }}>
          Bienvenido, <span style={{ color: 'var(--green)' }}>{user?.username}</span> 👋
        </h1>
        <p style={{ color: 'var(--gray)', fontSize: '0.9rem' }}>El Mundial arranca en junio. Armá tu equipo antes que nadie.</p>
      </div>

      {/* STATS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {stats.map(s => (
          <div key={s.label} style={{ background: 'var(--dark-2)', border: '1px solid #1F2937', borderRadius: '12px', padding: '1.25rem' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{s.icon}</div>
            <div style={{ fontFamily: 'Bebas Neue', fontSize: '1.8rem', color: 'var(--green)' }}>{s.value}</div>
            <div style={{ color: 'var(--gray)', fontSize: '0.8rem', marginTop: '2px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* QUICK ACTIONS */}
      <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '1.3rem', marginBottom: '1rem', color: 'var(--gray)', letterSpacing: '0.05em' }}>PRÓXIMOS PASOS</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {[
          { icon: '🏆', title: 'Crear una liga', desc: 'Invitá amigos y competí durante todo el Mundial', action: 'leagues', cta: 'Crear liga' },
          { icon: '⚽', title: 'Explorar jugadores', desc: 'Analizá el plantel de las 32 selecciones y sus stats', action: 'players', cta: 'Ver jugadores' },
          { icon: '📋', title: 'Hacer el draft', desc: 'Armá tu equipo de 11 con $100M de presupuesto', action: 'draft', cta: 'Ir al draft' },
        ].map(item => (
          <div key={item.title} style={{ background: 'var(--dark-2)', border: '1px solid #1F2937', borderRadius: '12px', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '1.75rem' }}>{item.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, marginBottom: '2px' }}>{item.title}</div>
              <div style={{ color: 'var(--gray)', fontSize: '0.85rem' }}>{item.desc}</div>
            </div>
            <button onClick={() => setActive(item.action)}
              style={{ padding: '0.5rem 1rem', background: 'transparent', border: '1px solid var(--green)', borderRadius: '8px', color: 'var(--green)', fontSize: '0.85rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              {item.cta} →
            </button>
          </div>
        ))}
      </div>

      {/* COUNTDOWN */}
      <div style={{ marginTop: '2rem', background: 'linear-gradient(135deg, #0A1F0A, #0F2D0F)', border: '1px solid #14532D', borderRadius: '12px', padding: '1.5rem', textAlign: 'center' }}>
        <div style={{ color: 'var(--green)', fontFamily: 'Bebas Neue', fontSize: '1rem', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>⚽ MUNDIAL FIFA 2026</div>
        <div style={{ fontFamily: 'Bebas Neue', fontSize: '2.5rem' }}>11 DE JUNIO, 2026</div>
        <div style={{ color: 'var(--gray)', fontSize: '0.875rem', marginTop: '4px' }}>Estados Unidos · México · Canadá · 48 selecciones · 104 partidos</div>
      </div>
    </div>
  );
}

function ComingSoon({ title, desc, icon }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center' }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{icon}</div>
      <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '2rem', marginBottom: '0.5rem' }}>{title}</h2>
      <p style={{ color: 'var(--gray)', maxWidth: '360px', lineHeight: 1.6 }}>{desc}</p>
      <div style={{ marginTop: '1.5rem', padding: '0.5rem 1.25rem', background: '#1a2e1a', border: '1px solid #14532D', borderRadius: '999px', color: 'var(--green)', fontSize: '0.85rem' }}>
        🚧 En construcción — Fase 2
      </div>
    </div>
  );
}
