import { useState, useEffect } from 'react';
import api from '../services/api.js';

const G = '#C9A84C';
const R = '#E61D25';
const B = '#2A5298';
const POS_COLOR = { Goalkeeper: '#F5C842', Defender: '#60A5FA', Midfielder: '#34D399', Attacker: '#F87171' };
const POS_SHORT = { Goalkeeper: 'POR', Defender: 'DEF', Midfielder: 'MED', Attacker: 'DEL' };

export default function Transfers() {
  const [leagues, setLeagues] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState('');
  const [team, setTeam] = useState(null);
  const [myPlayers, setMyPlayers] = useState([]);
  const [allPlayers, setAllPlayers] = useState([]);
  const [playerOut, setPlayerOut] = useState(null);
  const [search, setSearch] = useState('');
  const [history, setHistory] = useState([]);
  const [view, setView] = useState('transfer'); // transfer | history
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => { fetchData(); }, []);
  useEffect(() => { if (selectedLeague) fetchTeam(); }, [selectedLeague]);

  const fetchData = async () => {
    try {
      const [leaguesRes, playersRes] = await Promise.all([
        api.get('/leagues/my'),
        api.get('/players'),
      ]);
      setLeagues(leaguesRes.data.leagues || []);
      setAllPlayers(playersRes.data.players || []);
      if (leaguesRes.data.leagues?.length > 0) setSelectedLeague(leaguesRes.data.leagues[0].id);
    } catch {}
  };

  const fetchTeam = async () => {
    try {
      const res = await api.get('/teams/my');
      const myTeam = res.data.teams?.find(t => t.league_id === selectedLeague);
      setTeam(myTeam);
      if (myTeam?.players?.length) {
        const ids = myTeam.players.map(p => p.player_id);
        const playersRes = await api.get('/players');
        setMyPlayers(playersRes.data.players.filter(p => ids.includes(p.id)));
      }
      // Historial
      const histRes = await api.get(`/transfers/${selectedLeague}`);
      setHistory(histRes.data.transfers || []);
    } catch {}
  };

  const handleTransfer = async (playerIn) => {
    if (!playerOut) return;
    setError(''); setLoading(true);
    try {
      const res = await api.post('/transfers', {
        league_id: selectedLeague,
        player_out_id: playerOut.id,
        player_in_id: playerIn.id,
      });
      setSuccess(res.data.message);
      setPlayerOut(null);
      setSearch('');
      fetchTeam();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al hacer la transferencia');
    }
    setLoading(false);
  };

  // Jugadores disponibles para entrar (misma posicion, no en equipo)
  const available = allPlayers.filter(p => {
    if (!playerOut) return false;
    const myIds = myPlayers.map(mp => mp.id);
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.team_name.toLowerCase().includes(search.toLowerCase());
    return p.position === playerOut.position && !myIds.includes(p.id) && matchSearch;
  }).sort((a, b) => Number(b.fantasy_price) - Number(a.fantasy_price));

  const inp = { background: '#0A0A0A', border: '1px solid #1E1E1E', borderRadius: '8px', padding: '0.6rem 1rem', color: '#F0F0F0', fontSize: '0.875rem', outline: 'none' };

  if (leagues.length === 0) return (
    <div style={{ textAlign: 'center', padding: '4rem', color: '#666' }}>
      <h2 style={{ fontFamily: 'Barlow Condensed', fontSize: '1.5rem', marginBottom: '0.5rem' }}>Sin ligas</h2>
      <p>Primero crea o unite a una liga.</p>
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: '2rem', marginBottom: '4px', textTransform: 'uppercase' }}>Transferencias</h1>
        <p style={{ color: '#666', fontSize: '0.875rem' }}>Cambia jugadores de tu equipo. Solo podes reemplazar por la misma posicion.</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '1.5rem' }}>
        {['transfer', 'history'].map(v => (
          <button key={v} onClick={() => setView(v)}
            style={{ padding: '0.5rem 1.25rem', borderRadius: '6px', border: 'none', cursor: 'pointer', fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: '0.875rem', letterSpacing: '0.05em', textTransform: 'uppercase',
              background: view === v ? G : '#0A0A0A',
              color: view === v ? '#000' : '#666',
              border: `1px solid ${view === v ? G : '#1E1E1E'}` }}>
            {v === 'transfer' ? 'Hacer transferencia' : 'Historial'}
          </button>
        ))}
      </div>

      {error && <div style={{ background: '#1A0000', border: '1px solid #7F1D1D', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1rem', color: '#FCA5A5', fontSize: '0.875rem' }}>{error}</div>}
      {success && <div style={{ background: '#1A1000', border: `1px solid ${G}44`, borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1rem', color: G, fontSize: '0.875rem' }}>{success}</div>}

      {view === 'transfer' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

          {/* Mi equipo - elegir quien sale */}
          <div>
            <h2 style={{ fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: '1rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
              1. Elegí quien sale
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {myPlayers.map(player => (
                <div key={player.id} onClick={() => { setPlayerOut(player); setSearch(''); setError(''); }}
                  style={{ background: playerOut?.id === player.id ? '#1A1000' : '#0A0A0A', border: `1px solid ${playerOut?.id === player.id ? R : '#1E1E1E'}`, borderRadius: '10px', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', transition: 'all 0.15s' }}>
                  <span style={{ fontSize: '0.68rem', padding: '2px 7px', borderRadius: '4px', background: `${POS_COLOR[player.position]}22`, color: POS_COLOR[player.position], fontWeight: 700, flexShrink: 0 }}>
                    {POS_SHORT[player.position]}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{player.name}</div>
                    <div style={{ color: '#666', fontSize: '0.72rem' }}>{player.team_name}</div>
                  </div>
                  <span style={{ color: G, fontWeight: 700, fontSize: '0.82rem', flexShrink: 0 }}>${Number(player.fantasy_price).toFixed(1)}M</span>
                  {playerOut?.id === player.id && <span style={{ color: R, fontSize: '0.75rem', fontFamily: 'Barlow Condensed', fontWeight: 700, flexShrink: 0 }}>SALE</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Jugadores disponibles - elegir quien entra */}
          <div>
            <h2 style={{ fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: '1rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
              2. Elegí quien entra {playerOut && <span style={{ color: G }}>({POS_SHORT[playerOut.position]})</span>}
            </h2>

            {!playerOut ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#444', fontSize: '0.875rem', background: '#0A0A0A', borderRadius: '10px', border: '1px solid #1E1E1E' }}>
                Primero selecciona el jugador que queres sacar
              </div>
            ) : (
              <>
                <input placeholder="Buscar jugador..." value={search} onChange={e => setSearch(e.target.value)}
                  style={{ ...inp, width: '100%', marginBottom: '0.75rem' }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', maxHeight: '400px', overflowY: 'auto' }}>
                  {available.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '1.5rem', color: '#444', fontSize: '0.875rem' }}>No hay jugadores disponibles</div>
                  ) : available.map(player => {
                    const priceDiff = Number(player.fantasy_price) - Number(playerOut.fantasy_price);
                    const canAfford = Number(team?.budget_remaining || 0) >= priceDiff;
                    return (
                      <div key={player.id}
                        style={{ background: '#0A0A0A', border: '1px solid #1E1E1E', borderRadius: '10px', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', opacity: canAfford ? 1 : 0.4 }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 600, fontSize: '0.875rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{player.name}</div>
                          <div style={{ color: '#666', fontSize: '0.72rem' }}>{player.team_name}</div>
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <div style={{ color: G, fontWeight: 700, fontSize: '0.82rem' }}>${Number(player.fantasy_price).toFixed(1)}M</div>
                          <div style={{ fontSize: '0.68rem', color: priceDiff > 0 ? R : '#3CAC3B' }}>
                            {priceDiff > 0 ? `+$${priceDiff.toFixed(1)}M` : priceDiff < 0 ? `-$${Math.abs(priceDiff).toFixed(1)}M` : 'mismo precio'}
                          </div>
                        </div>
                        <button onClick={() => handleTransfer(player)} disabled={!canAfford || loading}
                          style={{ padding: '4px 10px', background: canAfford ? G : '#1A1A1A', border: 'none', borderRadius: '6px', color: canAfford ? '#000' : '#444', fontSize: '0.72rem', fontFamily: 'Barlow Condensed', fontWeight: 700, cursor: canAfford ? 'pointer' : 'not-allowed', flexShrink: 0 }}>
                          Fichar
                        </button>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {view === 'history' && (
        <div>
          {history.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>No hiciste transferencias todavia.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {history.map(t => (
                <div key={t.id} style={{ background: '#0A0A0A', border: '1px solid #1E1E1E', borderRadius: '10px', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <span style={{ color: R, fontWeight: 600, fontSize: '0.875rem' }}>{t.player_out?.name}</span>
                    <span style={{ color: '#444', margin: '0 8px' }}>→</span>
                    <span style={{ color: '#3CAC3B', fontWeight: 600, fontSize: '0.875rem' }}>{t.player_in?.name}</span>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '0.78rem', color: '#666' }}>
                    <div>{t.player_out?.team_name} → {t.player_in?.team_name}</div>
                    <div style={{ marginTop: '2px' }}>{new Date(t.created_at).toLocaleDateString('es-ES')}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
