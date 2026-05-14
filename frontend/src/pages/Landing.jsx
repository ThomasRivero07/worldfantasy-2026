import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--dark)', display: 'flex', flexDirection: 'column' }}>
      {/* NAV */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 2rem', borderBottom: '1px solid #1F2937' }}>
        <span style={{ fontFamily: 'Bebas Neue', fontSize: '1.6rem', color: 'var(--green)', letterSpacing: '0.1em' }}>
          WORLD<span style={{ color: 'var(--white)' }}>FANTASY</span>
          <span style={{ color: 'var(--gold)', marginLeft: '6px' }}>2026</span>
        </span>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/login" style={{ padding: '0.5rem 1.25rem', border: '1px solid #374151', borderRadius: '8px', color: 'var(--white)', fontSize: '0.9rem' }}>
            Iniciar sesión
          </Link>
          <Link to="/register" style={{ padding: '0.5rem 1.25rem', background: 'var(--green)', borderRadius: '8px', color: '#000', fontSize: '0.9rem', fontWeight: 600 }}>
            Jugar gratis
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem', textAlign: 'center' }}>
        <div style={{ background: 'var(--green)', color: '#000', fontSize: '0.75rem', fontWeight: 700, padding: '4px 14px', borderRadius: '999px', marginBottom: '1.5rem', letterSpacing: '0.1em' }}>
          ⚽ MUNDIAL FIFA 2026 · JUNIO - JULIO
        </div>
        <h1 style={{ fontFamily: 'Bebas Neue', fontSize: 'clamp(3rem, 10vw, 7rem)', lineHeight: 1, marginBottom: '1.5rem' }}>
          EL FANTASY<br />
          <span style={{ color: 'var(--green)' }}>DEL MUNDIAL</span><br />
          QUE ESTABAS<br />ESPERANDO
        </h1>
        <p style={{ color: 'var(--gray)', fontSize: '1.1rem', maxWidth: '520px', marginBottom: '2.5rem', lineHeight: 1.7 }}>
          Armá tu equipo, competí con amigos en ligas privadas y dejá que la IA te diga quién va a romperla en Qatar… perdón, en USA, México y Canadá.
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link to="/register" style={{ padding: '0.85rem 2rem', background: 'var(--green)', borderRadius: '10px', color: '#000', fontWeight: 700, fontSize: '1rem' }}>
            Crear cuenta gratis →
          </Link>
          <Link to="/login" style={{ padding: '0.85rem 2rem', border: '1px solid #374151', borderRadius: '10px', color: 'var(--white)', fontSize: '1rem' }}>
            Ya tengo cuenta
          </Link>
        </div>

        {/* FEATURES */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '5rem', maxWidth: '900px', width: '100%' }}>
          {[
            { icon: '🤖', title: 'IA Predictiva', desc: 'El modelo ML te dice el score esperado de cada jugador antes del partido' },
            { icon: '🏆', title: 'Ligas Privadas', desc: 'Invitá amigos con un código, hacé el draft y competí partido a partido' },
            { icon: '⚡', title: 'Puntos en Vivo', desc: 'Actualizaciones en tiempo real mientras se juegan los partidos del Mundial' },
            { icon: '📊', title: 'Estadísticas', desc: 'Dashboard completo con rendimiento de tu equipo, gráficos y comparativas' },
          ].map(f => (
            <div key={f.title} style={{ background: 'var(--dark-2)', border: '1px solid #1F2937', borderRadius: '12px', padding: '1.5rem', textAlign: 'left' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{f.icon}</div>
              <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>{f.title}</div>
              <div style={{ color: 'var(--gray)', fontSize: '0.85rem', lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </main>

      <footer style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--gray)', fontSize: '0.8rem', borderTop: '1px solid #1F2937' }}>
        WorldFantasy 2026 · Proyecto portfolio de Thomas Rivero
      </footer>
    </div>
  );
}
