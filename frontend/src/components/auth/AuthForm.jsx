import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const G = '#C9A84C';
const R = '#E61D25';

export default function AuthForm({ mode }) {
  const isLogin = mode === 'login';
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      if (isLogin) await login(form.email, form.password);
      else await register(form.username, form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Ocurrio un error, intenta de nuevo');
    } finally { setLoading(false); }
  };

  const inp = { width: '100%', background: '#0A0A0A', border: '1px solid #1E1E1E', borderRadius: '6px', padding: '0.75rem 1rem', color: '#F0F0F0', fontSize: '0.95rem', outline: 'none', fontFamily: 'Barlow, sans-serif', transition: 'border-color 0.2s' };
  const lbl = { fontSize: '0.75rem', color: '#666', marginBottom: '6px', display: 'block', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' };

  return (
    <div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '3px', background: `linear-gradient(to right, ${R} 33%, ${G} 33%, ${G} 66%, #3CAC3B 66%)` }} />

      <div className="fade-in" style={{ width: '100%', maxWidth: '420px' }}>
        <Link to="/" style={{ display: 'block', textAlign: 'center', marginBottom: '2rem' }}>
          <span style={{ fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: '2rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            <span style={{ color: G }}>WORLD</span>
            <span style={{ color: '#F0F0F0' }}>FANTASY</span>
            <span style={{ color: R, marginLeft: '8px' }}>2026</span>
          </span>
        </Link>

        <div style={{ background: '#0A0A0A', border: '1px solid #1E1E1E', borderRadius: '10px', padding: '2rem', borderTop: `3px solid ${G}` }}>
          <h2 style={{ fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: '2rem', marginBottom: '4px', textTransform: 'uppercase' }}>
            {isLogin ? 'Bienvenido de vuelta' : 'Crear cuenta'}
          </h2>
          <p style={{ color: '#666', fontSize: '0.875rem', marginBottom: '1.75rem', fontFamily: 'Barlow' }}>
            {isLogin ? 'Ingresa a tu equipo fantasy' : 'Unite al Mundial mas epico de la historia'}
          </p>

          {error && (
            <div style={{ background: '#1A0000', border: '1px solid #7F1D1D', borderRadius: '6px', padding: '0.75rem 1rem', marginBottom: '1rem', color: '#FCA5A5', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {!isLogin && (
              <div>
                <label style={lbl}>Nombre de usuario</label>
                <input name="username" value={form.username} onChange={handleChange} placeholder="messi10" required style={inp}
                  onFocus={e => e.target.style.borderColor = G}
                  onBlur={e => e.target.style.borderColor = '#1E1E1E'} />
              </div>
            )}
            <div>
              <label style={lbl}>Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="tu@email.com" required style={inp}
                onFocus={e => e.target.style.borderColor = G}
                onBlur={e => e.target.style.borderColor = '#1E1E1E'} />
            </div>
            <div>
              <label style={lbl}>Contrasena</label>
              <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="minimo 6 caracteres" required style={inp}
                onFocus={e => e.target.style.borderColor = G}
                onBlur={e => e.target.style.borderColor = '#1E1E1E'} />
            </div>
            <button type="submit" disabled={loading} className="btn-primary"
              style={{ marginTop: '0.5rem', padding: '0.875rem', background: loading ? '#A8893A' : G, border: 'none', borderRadius: '6px', color: '#000', fontFamily: 'Barlow Condensed', fontWeight: 800, fontSize: '1.05rem', letterSpacing: '0.08em', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Cargando...' : isLogin ? 'Iniciar sesion' : 'Crear cuenta'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#666', fontSize: '0.875rem', fontFamily: 'Barlow' }}>
            {isLogin ? 'No tenes cuenta? ' : 'Ya tenes cuenta? '}
            <Link to={isLogin ? '/register' : '/login'} style={{ color: G, fontWeight: 600, transition: 'opacity 0.2s' }}
              onMouseEnter={e => e.target.style.opacity = '0.8'}
              onMouseLeave={e => e.target.style.opacity = '1'}>
              {isLogin ? 'Registrate gratis' : 'Inicia sesion'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
