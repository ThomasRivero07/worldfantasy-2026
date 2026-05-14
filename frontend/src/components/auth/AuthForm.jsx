import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

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
      if (isLogin) {
        await login(form.email, form.password);
      } else {
        await register(form.username, form.email, form.password);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Ocurrió un error, intentá de nuevo');
    } finally {
      setLoading(false);
    }
  };

  const input = { width: '100%', background: '#111827', border: '1px solid #374151', borderRadius: '8px', padding: '0.75rem 1rem', color: '#F9FAFB', fontSize: '0.95rem', outline: 'none' };
  const label = { fontSize: '0.85rem', color: '#9CA3AF', marginBottom: '6px', display: 'block' };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'block', textAlign: 'center', marginBottom: '2rem' }}>
          <span style={{ fontFamily: 'Bebas Neue', fontSize: '2rem', color: 'var(--green)', letterSpacing: '0.1em' }}>
            WORLD<span style={{ color: 'var(--white)' }}>FANTASY</span>
            <span style={{ color: 'var(--gold)', marginLeft: '6px' }}>2026</span>
          </span>
        </Link>

        <div style={{ background: 'var(--dark-2)', border: '1px solid #1F2937', borderRadius: '16px', padding: '2rem' }}>
          <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '1.8rem', marginBottom: '0.25rem' }}>
            {isLogin ? 'Bienvenido de vuelta' : 'Crear cuenta'}
          </h2>
          <p style={{ color: 'var(--gray)', fontSize: '0.875rem', marginBottom: '1.75rem' }}>
            {isLogin ? 'Ingresá a tu equipo fantasy' : 'Unite al Mundial más épico de la historia'}
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
              <label style={label}>Contraseña</label>
              <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="mínimo 6 caracteres" required style={input} />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ marginTop: '0.5rem', padding: '0.85rem', background: loading ? '#065F46' : 'var(--green)', border: 'none', borderRadius: '8px', color: '#000', fontWeight: 700, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s' }}
            >
              {loading ? 'Cargando...' : isLogin ? 'Iniciar sesión' : 'Crear cuenta'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--gray)', fontSize: '0.875rem' }}>
            {isLogin ? '¿No tenés cuenta? ' : '¿Ya tenés cuenta? '}
            <Link to={isLogin ? '/register' : '/login'} style={{ color: 'var(--green)', fontWeight: 500 }}>
              {isLogin ? 'Registrate gratis' : 'Iniciá sesión'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
