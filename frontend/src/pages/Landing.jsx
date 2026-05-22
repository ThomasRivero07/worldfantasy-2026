import { Link } from 'react-router-dom';

const G = '#C9A84C';  // gold
const R = '#E61D25';  // red
const B = '#2A398D';  // blue
const GR = '#3CAC3B'; // green

export default function Landing() {
  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F', display: 'flex', flexDirection: 'column' }}>
      {/* Barra tricolor top */}
      <div style={{ height: '3px', background: `linear-gradient(to right, ${R} 33%, ${G} 33%, ${G} 66%, ${GR} 66%)` }} />

      {/* NAV */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 2rem', borderBottom: '1px solid #2A2A38' }}>
        <span style={{ fontFamily: 'Bebas Neue', fontSize: '1.6rem', letterSpacing: '0.1em' }}>
          <span style={{ color: G }}>WORLD</span>
          <span style={{ color: '#F4F4F6' }}>FANTASY</span>
          <span style={{ color: R, marginLeft: '6px' }}>2026</span>
        </span>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/login" style={{ padding: '0.5rem 1.25rem', border: '1px solid #2A2A38', borderRadius: '8px', color: '#F4F4F6', fontSize: '0.9rem' }}>
            Iniciar sesion
          </Link>
          <Link to="/register" style={{ padding: '0.5rem 1.25rem', background: G, borderRadius: '8px', color: '#000', fontSize: '0.9rem', fontWeight: 700 }}>
            Jugar gratis
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem', textAlign: 'center' }}>
        <div style={{ background: R, color: '#fff', fontSize: '0.75rem', fontWeight: 700, padding: '4px 14px', borderRadius: '999px', marginBottom: '1.5rem', letterSpacing: '0.12em' }}>
          MUNDIAL FIFA 2026 · JUNIO - JULIO
        </div>

        <h1 style={{ fontFamily: 'Bebas Neue', fontSize: 'clamp(3rem, 10vw, 7rem)', lineHeight: 1, marginBottom: '1.5rem' }}>
          EL FANTASY<br />
          <span style={{ color: G }}>DEL MUNDIAL</span><br />
          QUE ESTABAS<br />ESPERANDO
        </h1>

        <p style={{ color: '#6B6B7E', fontSize: '1.1rem', maxWidth: '520px', marginBottom: '2.5rem', lineHeight: 1.7 }}>
          Arma tu equipo, competi con amigos en ligas privadas y deja que la IA te diga quien va a brillar en USA, Mexico y Canada.
        </p>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link to="/register" style={{ padding: '0.85rem 2rem', background: G, borderRadius: '10px', color: '#000', fontWeight: 700, fontSize: '1rem' }}>
            Crear cuenta gratis
          </Link>
          <Link to="/login" style={{ padding: '0.85rem 2rem', border: '1px solid #2A2A38', borderRadius: '10px', color: '#F4F4F6', fontSize: '1rem' }}>
            Ya tengo cuenta
          </Link>
        </div>

        {/* FEATURES */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '5rem', maxWidth: '900px', width: '100%' }}>
          {[
            { color: B, label: 'IA Predictiva', desc: 'El modelo ML estima el score de cada jugador antes del partido' },
            { color: R, label: 'Ligas Privadas', desc: 'Invita amigos con un codigo, haz el draft y competi partido a partido' },
            { color: G, label: 'Puntos en Vivo', desc: 'Actualizaciones en tiempo real mientras se juegan los partidos del Mundial' },
            { color: GR, label: 'Estadisticas', desc: 'Dashboard completo con rendimiento de tu equipo y comparativas' },
          ].map(f => (
            <div key={f.label} style={{ background: '#111118', border: '1px solid #2A2A38', borderRadius: '12px', padding: '1.5rem', textAlign: 'left', borderTop: `3px solid ${f.color}` }}>
              <div style={{ fontWeight: 700, marginBottom: '0.5rem', fontSize: '1rem' }}>{f.label}</div>
              <div style={{ color: '#6B6B7E', fontSize: '0.85rem', lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </main>

      {/* Barra tricolor bottom */}
      <div style={{ height: '3px', background: `linear-gradient(to right, ${GR} 33%, ${G} 33%, ${G} 66%, ${R} 66%)` }} />
      <footer style={{ textAlign: 'center', padding: '1.25rem', color: '#3A3A4E', fontSize: '0.8rem', borderTop: '1px solid #2A2A38' }}>
        WorldFantasy 2026 · Proyecto portfolio de Thomas Rivero
      </footer>
    </div>
  );
}
