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
    setError('');
    setLoading(true);
    try {
      if (isLogin) await login(form.email, form.password);
      else await register(form.username, form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Ocurrio un error, intenta de nuevo');
    } finally { setLoading(false); }
  };

  const input = { width: '100%', background: '#111118', border: '1px solid #2A2A38', borderRadius: '8px', padding: '0.75rem 1rem', color: '#F4F4F6', fontSize: '0.95rem', outline: 'none' };
  const label = { fontSize: '0.85rem', color: '#6B6B7E', marginBottom: '6px', display: 'block' };

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      {/* Barra tricolor */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '3px', background: `linear-gradient(to right, ${R} 33%, ${G} 33%, ${G} 66%, #3CAC3B 66%)` }} />

      <div style={{ width: '100%', maxWidth: '420px' }}>
        <Link to="/" style={{ display: 'block', textAlign: 'center', marginBottom: '2rem' }}>
          <span style={{ fontFamily: 'Bebas Neue', fontSize: '2rem', letterSpacing: '0.1em' }}>
            <span style={{ color: G }}>WORLD</span>
            <span style={{ color: '#F4F4F6' }}>FANTASY</span>
            <span style={{ color: R, marginLeft: '6px' }}>2026</span>
          </span>
        </Link>

        <div style={{ background: '#111118', border: '1px solid #2A2A38', borderRadius: '16px', padding: '2rem', borderTop: `3px solid ${G}` }}>
          <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '1.8rem', marginBottom: '0.25rem' }}>
            {isLogin ? 'Bienvenido de vuelta' : 'Crear cuenta'}
          </h2>
          <p style={{ color: '#6B6B7E', fontSize: '0.875rem', marginBottom: '1.75rem' }}>
            {isLogin ? 'Ingresa a tu equipo fantasy' : 'Unite al Mundial mas epico de la historia'}
          </p>

          {error && (
            <div style={{ background: '#2D1515', border: '1px solid #7F1D1D', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1rem', color: '#FCA5A5', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {!isLogin && (
              <div>
                <label style={label}>Nombre de usuario</label>
                <input name="username" value={form.username} onChange={handleChange} placeholder="messi10" required style={input} />
              </div>
            )}
            <div>
              <label style={label}>Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="tu@email.com" required style={input} />
            </div>
            <div>
              <label style={label}>Contrasena</label>
              <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="minimo 6 caracteres" required style={input} />
            </div>
            <button type="submit" disabled={loading}
              style={{ marginTop: '0.5rem', padding: '0.85rem', background: loading ? '#A8893A' : G, border: 'none', borderRadius: '8px', color: '#000', fontWeight: 700, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Cargando...' : isLogin ? 'Iniciar sesion' : 'Crear cuenta'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#6B6B7E', fontSize: '0.875rem' }}>
            {isLogin ? 'No tenes cuenta? ' : 'Ya tenes cuenta? '}
            <Link to={isLogin ? '/register' : '/login'} style={{ color: G, fontWeight: 500 }}>
              {isLogin ? 'Registrate gratis' : 'Inicia sesion'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
