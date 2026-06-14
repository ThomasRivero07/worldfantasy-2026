import { useState, useEffect } from 'react';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

const G = '#C9A84C';
const R = '#E61D25';
const B = '#2A5298';
const GR = '#3CAC3B';

export default function Profile() {
  const { user } = useAuth();
  const [teams, setTeams] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [teamsRes, leaguesRes] = await Promise.all([
        api.get('/teams/my'),
        api.get('/leagues/my'),
      ]);
      setTeams(teamsRes.data.teams || []);
      setLeagues(leaguesRes.data.leagues || []);
    } catch {}
    setLoading(false);
  };

  const totalPoints = teams.reduce((sum, t) => sum + (t.total_points || 0), 0);
  const totalLeagues = leagues.length;
  const bestTeam = teams.length ? teams.reduce((best, t) => (t.total_points > (best?.total_points || -1) ? t : best), null) : null;

  const getLeagueRank = (team) => {
    const league = leagues.find(l => l.id === team.league_id);
    if (!league?.standings) return null;
    const sorted = [...league.standings].sort((a, b) => b.total_points - a.total_points);
    const idx = sorted.findIndex(s => s.team_id === team.id || s.user_id === user?.id);
    return idx >= 0 ? idx + 1 : null;
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>Cargando perfil...</div>;

  return (
    <div className="fade-in">
      {/* Header del perfil */}
      <div style={{ background: '#0A0A0A', border: '1px solid #1E1E1E', borderRadius: '14px', padding: '2rem', marginBottom: '1.5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: `linear-gradient(to right, ${R} 33%, ${G} 33%, ${G} 66%, ${GR} 66%)` }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: G, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: '2.2rem', flexShrink: 0 }}>
            {user?.username?.[0]?.toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <h1 style={{ fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: '1.8rem', textTransform: 'uppercase', marginBottom: '2px' }}>
              {user?.username}
              {user?.is_admin && <span style={{ marginLeft: '10px', fontSize: '0.65rem', background: R, color: '#fff', padding: '2px 8px', borderRadius: '4px', verticalAlign: 'middle' }}>ADMIN</span>}
            </h1>
            <p style={{ color: '#666', fontSize: '0.875rem' }}>{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Stats generales */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Puntos totales', value: totalPoints, color: G },
          { label: 'Ligas activas', value: totalLeagues, color: B },
          { label: 'Equipos', value: teams.length, color: GR },
          { label: 'Mejor equipo', value: bestTeam ? bestTeam.total_points : 0, color: R },
        ].map(s => (
          <div key={s.label} className="card-hover" style={{ background: '#0A0A0A', border: '1px solid #1E1E1E', borderRadius: '10px', padding: '1.25rem', borderTop: `3px solid ${s.color}`, textAlign: 'center' }}>
            <div style={{ fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: '2.2rem', color: s.color, lineHeight: 1 }}>{s.value}</div>
            <div style={{ color: '#666', fontSize: '0.75rem', marginTop: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Equipos por liga */}
      <h2 style={{ fontFamily: 'Barlow Condensed', fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.75rem', color: '#666', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
        Mis equipos
      </h2>

      {teams.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#666', background: '#0A0A0A', border: '1px solid #1E1E1E', borderRadius: '12px' }}>
          <p>Todavia no armaste ningun equipo.</p>
          <p style={{ fontSize: '0.8rem', marginTop: '4px' }}>Anda a una liga y hace el draft para empezar.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {teams.map(team => {
            const league = leagues.find(l => l.id === team.league_id);
            return (
              <div key={team.id} className="card-hover" style={{ background: '#0A0A0A', border: '1px solid #1E1E1E', borderRadius: '12px', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '10px', background: `${G}15`, border: `1px solid ${G}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: '1.3rem', color: G }}>{team.total_points}</span>
                </div>
                <div style={{ flex: 1, minWidth: '160px' }}>
                  <div style={{ fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: '1.1rem', textTransform: 'uppercase' }}>{team.name}</div>
                  <div style={{ color: '#666', fontSize: '0.8rem' }}>{league?.name || 'Liga'}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: '1.5rem', color: G }}>{team.total_points}</div>
                  <div style={{ color: '#666', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Puntos</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: '1.5rem', color: B }}>${Number(team.budget_remaining).toFixed(1)}M</div>
                  <div style={{ color: '#666', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Presupuesto</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: '1.5rem', color: GR }}>{(team.players || []).length}/11</div>
                  <div style={{ color: '#666', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Jugadores</div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Info de la cuenta */}
      <h2 style={{ fontFamily: 'Barlow Condensed', fontWeight: 800, fontSize: '1.1rem', marginTop: '1.5rem', marginBottom: '0.75rem', color: '#666', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
        Informacion de la cuenta
      </h2>
      <div style={{ background: '#0A0A0A', border: '1px solid #1E1E1E', borderRadius: '12px', padding: '1.25rem' }}>
        {[
          { label: 'Username', value: user?.username },
          { label: 'Email', value: user?.email },
          { label: 'Miembro desde', value: user?.created_at ? new Date(user.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }) : '--' },
        ].map(r => (
          <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid #111', fontSize: '0.85rem' }}>
            <span style={{ color: '#666' }}>{r.label}</span>
            <span style={{ fontWeight: 600 }}>{r.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
