import { useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import { getPopularMovies, getTopRatedMovies, getNowPlayingMovies, getMediaTitle } from '../services/tmdb';
import { useFetch } from '../hooks/useFetch';
import MediaGrid from '../components/MediaGrid';
import { LoadingSpinner, ErrorMessage } from '../components/LoadingSpinner';

const KATEGOORIAD = [
  { id: 'popular',     nimetus: 'Populaarsed',       fn: getPopularMovies },
  { id: 'top_rated',   nimetus: 'Kõrgelt hinnatud',  fn: getTopRatedMovies },
  { id: 'now_playing', nimetus: 'Kinodes',            fn: getNowPlayingMovies },
];

export default function Movies() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sorteeri, setSorteeri] = useState('vaikimisi');
  const [filter, setFilter] = useState('');

  // Lehe ja kategooria olek on URL-is → brauseri tagasi-nupp töötab
  const kategooria = searchParams.get('kategooria') || 'popular';
  const leht = parseInt(searchParams.get('leht') || '1', 10);

  const setKategooria = (uus) => setSearchParams({ kategooria: uus, leht: '1' });
  const setLeht = (fn) => {
    const uus = typeof fn === 'function' ? fn(leht) : fn;
    setSearchParams({ kategooria, leht: String(uus) });
  };

  const aktiivneFn = KATEGOORIAD.find(k => k.id === kategooria)?.fn || getPopularMovies;
  const { data, loading, error } = useFetch(() => aktiivneFn(leht), [kategooria, leht]);

  let tulemused = data?.results || [];
  if (filter.trim()) tulemused = tulemused.filter(f => getMediaTitle(f).toLowerCase().includes(filter.toLowerCase()));
  if (sorteeri === 'reiting_alla') tulemused = [...tulemused].sort((a, b) => b.vote_average - a.vote_average);
  if (sorteeri === 'reiting_üles') tulemused = [...tulemused].sort((a, b) => a.vote_average - b.vote_average);
  if (sorteeri === 'pealkiri') tulemused = [...tulemused].sort((a, b) => getMediaTitle(a).localeCompare(getMediaTitle(b)));

  const koguLehti = Math.min(data?.total_pages || 1, 500);

  return (
    <main className="container" style={{ padding: '40px 20px', position: 'relative', zIndex: 1 }}>
      <h1 style={s.pealkiri}>Filmid</h1>

      <div style={s.tööriistariba}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {KATEGOORIAD.map(k => (
            <button key={k.id} onClick={() => setKategooria(k.id)}
              style={k.id === kategooria ? s.nuppAktiivne : s.nupp}>
              {k.nimetus}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto', flexWrap: 'wrap' }}>
          <input type="text" value={filter} onChange={e => setFilter(e.target.value)}
            placeholder="Filtreeri pealkirja järgi..." style={s.input} />
          <select value={sorteeri} onChange={e => setSorteeri(e.target.value)} style={s.select}>
            <option value="vaikimisi">Sorteerimine</option>
            <option value="reiting_alla">Reiting ↓</option>
            <option value="reiting_üles">Reiting ↑</option>
            <option value="pealkiri">Pealkiri A–Z</option>
          </select>
        </div>
      </div>

      {loading && <LoadingSpinner text="Laadin filme..." />}
      {error && <ErrorMessage message={error} />}
      {!loading && !error && <MediaGrid items={tulemused} />}

      {!loading && !error && (
        <div style={s.leheNavi}>
          <button onClick={() => setLeht(l => Math.max(1, l - 1))} disabled={leht === 1} style={s.lehenupp}>
            ← Eelmine
          </button>
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>{leht} / {koguLehti}</span>
          <button onClick={() => setLeht(l => Math.min(koguLehti, l + 1))} disabled={leht === koguLehti} style={s.lehenupp}>
            Järgmine →
          </button>
        </div>
      )}
    </main>
  );
}

const s = {
  pealkiri: { fontSize: '28px', fontWeight: '800', marginBottom: '24px', color: 'white' },
  tööriistariba: {
    display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px',
    marginBottom: '24px', padding: '14px 16px',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)',
  },
  nupp: { padding: '6px 16px', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'rgba(255,255,255,0.65)', fontWeight: '500' },
  nuppAktiivne: { padding: '6px 16px', backgroundColor: 'rgba(108,99,255,0.25)', color: 'white', border: '1px solid rgba(108,99,255,0.5)', borderRadius: '8px', fontWeight: '700' },
  input: { padding: '7px 14px', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', fontSize: '14px', backgroundColor: 'rgba(255,255,255,0.06)', color: 'white', outline: 'none' },
  select: { padding: '7px 14px', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', fontSize: '14px', backgroundColor: '#0d0f2a', color: 'rgba(255,255,255,0.8)' },
  leheNavi: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', padding: '40px 0' },
  lehenupp: { padding: '8px 20px', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', color: 'rgba(255,255,255,0.7)' },
};
