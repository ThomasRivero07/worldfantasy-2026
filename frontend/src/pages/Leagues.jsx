import { useState, useEffect } from 'react';
import api from '../services/api.js';

const C = { red: '#D4213D', blue: '#002868', green: '#006847', gold: '#C9A84C', dark2: '#0D1220', dark4: '#1A2236', border: '#1E2840', border2: '#273350', white: '#F0F4FF', gray: '#6B7A99' };

export default function Leagues() {
  const [leagues, setLeagues] = useState([]);
  const [view, setView] = useState('home');
  const [selectedLeague, setSelectedLeague] = useState(null);
  const [standings, setStandings] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [createForm, setCreateForm] = useState({ name: '', max_members: 10 });
  const [joinForm, setJoinForm] = useState({ invite_code: '', team_name: '' });

  useEffect(() => { fetchLeagues(); }, []);

  const fetchLeagues = async () => {
    try { const res = await api.get('/leagues/my'); setLeagues(res.data.leagues || []); } catch {}
  };

  const fetchStandings = async (league) => {
    setSelectedLeague(league); setView('standings');
    try { const res = await api.get(`/leagues/${league.id}/standings`); setStandings(res.data.standings || []); } catch {}
  };

  const handleCreate = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      await api.post('/leagues', createForm);
      setSuccess('Liga creada. Comparte el codigo con tus amigos.');
      setCreateForm({ name: '', max_members: 10 });
      fetchLeagues();
      setTimeout(() => { setSuccess(''); setView('home'); }, 2000);
    } catch (err) { setError(err.response?.data?.error || 'Error al crear la liga'); }
    setLoading(false);
  };

  const handleJoin = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      await api.post('/leagues/join', joinForm);
      setSuccess('Te uniste a la liga.');
      setJoinForm({ invite_code: '', team_name: '' });
      fetchLeagues();
      setTimeout(() => { setSuccess(''); setView('home'); }, 2000);
    } catch (err) { setError(err.response?.data?.error || 'Error al unirse'); }
    setLoading(false);
  };

  const inp = { width: '100%', background: '#080C18', border: `1px solid ${C.border}`, borderRadius: '8px', padding: '0.75rem 1rem', color: C.white, fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '2rem', marginBottom: '4px' }}>
            {view === 'home' && 'Mis Ligas'}
            {view === 'create' && 'Crear Liga'}
            {view === 'join' && 'Unirse a Liga'}
            {view === 'standings' && (selectedLeague?.name || 'Tabla de Posiciones')}
          </h1>
          <p style={{ color: C.gray, fontSize: '0.875rem' }}>
            {view === 'home' && 'Compite con amigos durante todo el Mundial'}
            {view === 'create' && 'Configura tu liga privada'}
            {view === 'join' && 'Ingresa el codigo de invitacion'}
            {view === 'standings' && 'Ranking actual de la liga'}
          </p>
        </div>
        {view === 'home' ? (
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={() => { setView('join'); setError(''); }} style={{ padding: '0.6rem 1.25rem', border: `1px solid ${C.border}`, borderRadius: '8px', color: C.white, background: 'transparent', cursor: 'pointer', fontSize: '0.875rem' }}>Unirse con codigo</button>
            <button onClick={() => { setView('create'); setError(''); }} style={{ padding: '0.6rem 1.25rem', background: C.red, border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }}>+ Crear liga</button>
          </div>
        ) : (
          <button onClick={() => { setView('home'); setError(''); setSuccess(''); }} style={{ padding: '0.6rem 1.25rem', border: `1px solid ${C.border}`, borderRadius: '8px', color: C.white, background: 'transparent', cursor: 'pointer', fontSize: '0.875rem' }}>Volver</button>
        )}
      </div>

      {error && <div style={{ background: '#1A0A0D', border: `1px solid #5C1020`, borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1rem', color: '#F87171', fontSize: '0.875rem' }}>{error}</div>}
      {success && <div style={{ background: '#070F0A', border: `1px solid #0D3018`, borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1rem', color: '#6EE7B7', fontSize: '0.875rem' }}>{success}</div>}

      {/* HOME */}
      {view === 'home' && (
        leagues.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', background: C.dark2, borderRadius: '12px', border: `1px solid ${C.border}` }}>
            <h3 style={{ fontFamily: 'Bebas Neue', fontSize: '1.5rem', marginBottom: '0.5rem' }}>No tenes ligas todavia</h3>
            <p style={{ color: C.gray, fontSize: '0.875rem', marginBottom: '1.5rem' }}>Crea una liga e invita a tus amigos para competir durante el Mundial</p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button onClick={() => setView('join')} style={{ padding: '0.6rem 1.25rem', border: `1px solid ${C.border}`, borderRadius: '8px', color: C.white, background: 'transparent', cursor: 'pointer' }}>Unirse con codigo</button>
              <button onClick={() => setView('create')} style={{ padding: '0.6rem 1.25rem', background: C.red, border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontWeight: 600 }}>+ Crear liga</button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: C.border, borderRadius: '12px', overflow: 'hidden', border: `1px solid ${C.border}` }}>
            {leagues.map(league => (
              <div key={league.id} style={{ background: C.dark2, padding: '1.1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '3px', height: '36px', background: C.red, borderRadius: '2px', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, marginBottom: '3px' }}>{league.name}</div>
                  <div style={{ color: C.gray, fontSize: '0.78rem', display: 'flex', gap: '1rem' }}>
                    <span>Codigo: <span style={{ color: C.gold, fontFamily: 'monospace', fontWeight: 700 }}>{league.invite_code}</span></span>
                    <span>Estado: <span style={{ color: league.status === 'active' ? '#6EE7B7' : C.gold }}>{league.status === 'waiting' ? 'Esperando' : 'Activa'}</span></span>
                  </div>
                </div>
                <button onClick={() => fetchStandings(league)} style={{ padding: '0.45rem 1rem', background: 'transparent', border: `1px solid ${C.border}`, borderRadius: '8px', color: C.white, fontSize: '0.82rem', cursor: 'pointer' }}>
                  Ver tabla
                </button>
              </div>
            ))}
          </div>
        )
      )}

      {/* CREATE */}
      {view === 'create' && (
        <div style={{ maxWidth: '480px' }}>
          <div style={{ background: C.dark2, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '2rem' }}>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ fontSize: '0.82rem', color: C.gray, marginBottom: '6px', display: 'block' }}>Nombre de la liga</label>
                <input value={createForm.name} onChange={e => setCreateForm(f => ({...f, name: e.target.value}))} placeholder="Los Cracks del Barrio" required style={inp} />
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', color: C.gray, marginBottom: '6px', display: 'block' }}>Maximo de participantes</label>
                <select value={createForm.max_members} onChange={e => setCreateForm(f => ({...f, max_members: Number(e.target.value)}))} style={{...inp, cursor: 'pointer'}}>
                  {[2,4,6,8,10,12,16,20].map(n => <option key={n} value={n}>{n} participantes</option>)}
                </select>
              </div>
              <div style={{ background: '#070F0A', border: `1px solid #0D3018`, borderRadius: '8px', padding: '0.75rem 1rem', fontSize: '0.82rem', color: '#6EE7B7' }}>
                Se genera un codigo de invitacion automaticamente para compartir con tus amigos.
              </div>
              <button type="submit" disabled={loading} style={{ padding: '0.85rem', background: loading ? C.red + '80' : C.red, border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer' }}>
                {loading ? 'Creando...' : 'Crear liga'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* JOIN */}
      {view === 'join' && (
        <div style={{ maxWidth: '480px' }}>
          <div style={{ background: C.dark2, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '2rem' }}>
            <form onSubmit={handleJoin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ fontSize: '0.82rem', color: C.gray, marginBottom: '6px', display: 'block' }}>Codigo de invitacion</label>
                <input value={joinForm.invite_code} onChange={e => setJoinForm(f => ({...f, invite_code: e.target.value.toUpperCase()}))} placeholder="ABC12345" required style={{...inp, fontFamily: 'monospace', fontSize: '1.1rem', letterSpacing: '0.1em'}} maxLength={8} />
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', color: C.gray, marginBottom: '6px', display: 'block' }}>Nombre de tu equipo</label>
                <input value={joinForm.team_name} onChange={e => setJoinForm(f => ({...f, team_name: e.target.value}))} placeholder="Los Invencibles" style={inp} />
              </div>
              <button type="submit" disabled={loading} style={{ padding: '0.85rem', background: loading ? C.red + '80' : C.red, border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer' }}>
                {loading ? 'Uniendose...' : 'Unirse a la liga'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* STANDINGS */}
      {view === 'standings' && (
        <div>
          <div style={{ background: C.dark2, border: `1px solid ${C.border}`, borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ padding: '0.875rem 1.5rem', borderBottom: `1px solid ${C.border}`, display: 'flex', gap: '1rem', fontSize: '0.75rem', color: C.gray, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              <span style={{ width: '40px' }}>#</span>
              <span style={{ flex: 1 }}>Equipo</span>
              <span style={{ width: '80px', textAlign: 'right' }}>Puntos</span>
            </div>
            {standings.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: C.gray, fontSize: '0.875rem' }}>
                Nadie tiene puntos todavia. El Mundial no empezo.
              </div>
            ) : standings.map((s, i) => (
              <div key={s.team?.id} style={{ padding: '0.875rem 1.5rem', borderBottom: i < standings.length - 1 ? `1px solid ${C.border}` : 'none', display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: i === 0 ? `3px solid ${C.gold}` : '3px solid transparent' }}>
                <span style={{ width: '40px', fontFamily: 'Bebas Neue', fontSize: '1.2rem', color: i === 0 ? C.gold : i === 1 ? '#9CA3AF' : i === 2 ? '#CD7F32' : C.gray }}>{i + 1}</span>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: C.blue, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '0.8rem', flexShrink: 0 }}>
                  {s.user?.username?.[0]?.toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{s.team?.name}</div>
                  <div style={{ color: C.gray, fontSize: '0.78rem' }}>{s.user?.username}</div>
                </div>
                <span style={{ fontFamily: 'Bebas Neue', fontSize: '1.4rem', color: C.gold, width: '80px', textAlign: 'right' }}>{s.team?.total_points}</span>
              </div>
            ))}
          </div>
          {selectedLeague && (
            <div style={{ marginTop: '1rem', background: C.dark2, border: `1px solid ${C.border}`, borderRadius: '10px', padding: '1rem 1.5rem', display: 'flex', gap: '2rem', flexWrap: 'wrap', fontSize: '0.82rem', color: C.gray }}>
              <span>Codigo: <span style={{ color: C.gold, fontFamily: 'monospace', fontWeight: 700 }}>{selectedLeague.invite_code}</span></span>
              <span>Participantes: <span style={{ color: C.white }}>{standings.length}/{selectedLeague.max_members}</span></span>
              <span>Presupuesto: <span style={{ color: C.white }}>${selectedLeague.budget}M</span></span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
