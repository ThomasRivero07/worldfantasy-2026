import { Link } from 'react-router-dom';

const G = '#C9A84C';
const R = '#E61D25';
const B = '#2A5298';
const GR = '#3CAC3B';

export default function Landing() {
  return (
    <div style={{ minHeight: '100vh', background: '#000', display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: '3px', background: `linear-gradient(to right, ${R} 33%, ${G} 33%, ${G} 66%, ${GR} 66%)` }} />

      {/* NAV */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', borderBottom: '1px solid #1E1E1E' }}>
        <span style={{ fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: 'clamp(1.2rem, 4vw, 1.75rem)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          <span style={{ color: G }}>WORLD</span>
          <span style={{ color: '#F0F0F0' }}>FANTASY</span>
          <span style={{ color: R, marginLeft: '6px' }}>2026</span>
        </span>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link to="/login" className="btn-outline"
            style={{ padding: '0.45rem 0.85rem', border: '1px solid #2A2A2A', borderRadius: '6px', color: '#F0F0F0', fontSize: '0.8rem', fontFamily: 'Barlow Condensed', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', display: 'inline-block' }}>
            Login
          </Link>
          <Link to="/register" className="btn-primary"
            style={{ padding: '0.45rem 0.85rem', background: G, borderRadius: '6px', color: '#000', fontSize: '0.8rem', fontFamily: 'Barlow Condensed', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase', display: 'inline-block' }}>
            Jugar
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'clamp(2rem, 8vw, 5rem) 1.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 50% 0%, ${B}18 0%, transparent 65%)`, pointerEvents: 'none' }} />

        <div className="fade-in" style={{ background: R, color: '#fff', fontSize: '0.7rem', fontFamily: 'Barlow Condensed', fontWeight: 700, padding: '3px 14px', borderRadius: '3px', marginBottom: '1.25rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
          Mundial FIFA 2026 · Junio - Julio
        </div>

        <h1 className="fade-in-2" style={{ fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: 'clamp(2.8rem, 14vw, 8rem)', lineHeight: 0.95, marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
          El Fantasy<br />
          <span style={{ color: G }}>del Mundial</span><br />
          que estabas<br />
          <span style={{ color: R }}>esperando</span>
        </h1>

        <p className="fade-in-3" style={{ color: '#666', fontSize: 'clamp(0.875rem, 2.5vw, 1.05rem)', maxWidth: '500px', marginBottom: '2rem', lineHeight: 1.7, fontFamily: 'Barlow' }}>
          Arma tu equipo, competi con amigos en ligas privadas y deja que la IA te diga quien va a brillar en USA, Mexico y Canada.
        </p>

        <div className="fade-in-4" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '3rem' }}>
          <Link to="/register" className="btn-primary"
            style={{ padding: '0.85rem 1.75rem', background: G, borderRadius: '6px', color: '#000', fontFamily: 'Barlow Condensed', fontWeight: 800, fontSize: 'clamp(0.95rem, 3vw, 1.1rem)', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'inline-block' }}>
            Crear cuenta gratis
          </Link>
          <Link to="/login" className="btn-outline"
            style={{ padding: '0.85rem 1.75rem', border: '1px solid #2A2A2A', borderRadius: '6px', color: '#F0F0F0', fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: 'clamp(0.95rem, 3vw, 1.1rem)', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'inline-block' }}>
            Ya tengo cuenta
          </Link>
        </div>

        {/* Features */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1px', maxWidth: '900px', width: '100%', background: '#1E1E1E', borderRadius: '10px', overflow: 'hidden', border: '1px solid #1E1E1E' }}>
          {[
            { color: B, label: 'IA Predictiva', desc: 'Score por jugador antes de cada partido' },
            { color: R, label: 'Ligas Privadas', desc: 'Draft y tabla en tiempo real' },
            { color: G, label: 'Puntos en Vivo', desc: 'Actualizaciones durante los partidos' },
            { color: GR, label: '48 Selecciones', desc: 'Todos los clasificados al Mundial' },
          ].map(f => (
            <div key={f.label} className="card-hover" style={{ background: '#0A0A0A', padding: '1.25rem', borderTop: `3px solid ${f.color}`, cursor: 'default' }}>
              <div style={{ fontFamily: 'Barlow Condensed', fontWeight: 800, fontSize: '1rem', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{f.label}</div>
              <div style={{ color: '#666', fontSize: '0.8rem', lineHeight: 1.5 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </main>

      <div style={{ height: '3px', background: `linear-gradient(to right, ${GR} 33%, ${G} 33%, ${G} 66%, ${R} 66%)` }} />
      <footer style={{ textAlign: 'center', padding: '1rem', color: '#333', fontSize: '0.75rem', borderTop: '1px solid #1E1E1E', fontFamily: 'Barlow' }}>
        WorldFantasy 2026 · Thomas Rivero
      </footer>
    </div>
  );
}
