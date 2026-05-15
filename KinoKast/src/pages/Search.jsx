import { useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { searchMulti } from '../services/tmdb';
import { useFetch } from '../hooks/useFetch';
import MediaGrid from '../components/MediaGrid';
import { LoadingSpinner, ErrorMessage } from '../components/LoadingSpinner';

export default function Search() {
  const [searchParams] = useSearchParams();
  const päring = searchParams.get('q') || '';
  const [leht, setLeht] = useState(1);
  const [filter, setFilter] = useState('all');

  useEffect(() => { setLeht(1); }, [päring]);

  const { data, loading, error } = useFetch(
    () => päring ? searchMulti(päring, leht) : Promise.resolve({ results: [] }),
    [päring, leht]
  );

  let tulemused = data?.results || [];
  if (filter !== 'all') tulemused = tulemused.filter(i => i.media_type === filter);

  const koguLehti = Math.min(data?.total_pages || 1, 500);

  return (
    <main className="container" style={{ padding: '40px 20px', position: 'relative', zIndex: 1 }}>
      {päring ? (
        <h1 style={s.pealkiri}>Otsing: <span style={{ color: 'rgba(255,255,255,0.5)', fontWeight: '400' }}>"{päring}"</span></h1>
      ) : (
        <h1 style={s.pealkiri}>Otsing</h1>
      )}

      {data?.total_results > 0 && (
        <p style={{ color: 'rgba(255,255,255,0.35)', marginBottom: '20px', fontSize: '14px' }}>
          {data.total_results.toLocaleString()} tulemust
        </p>
      )}

      {päring && (
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          {[{ id: 'all', nimetus: 'Kõik' }, { id: 'movie', nimetus: 'Filmid' }, { id: 'tv', nimetus: 'Sarjad' }].map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)}
              style={f.id === filter ? s.nuppAktiivne : s.nupp}>
              {f.nimetus}
            </button>
          ))}
        </div>
      )}

      {!päring && (
        <p style={{ color: 'rgba(255,255,255,0.3)', marginTop: '60px', textAlign: 'center', fontSize: '15px' }}>
          Sisesta otsingusõna navigatsiooniribale.
        </p>
      )}

      {loading && <LoadingSpinner text="Otsin..." />}
      {error && <ErrorMessage message={error} />}
      {!loading && !error && päring && <MediaGrid items={tulemused} />}

      {!loading && !error && päring && koguLehti > 1 && (
        <div style={s.leheNavi}>
          <button onClick={() => setLeht(l => Math.max(1, l - 1))} disabled={leht === 1} style={s.lehenupp}>← Eelmine</button>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>{leht} / {koguLehti}</span>
          <button onClick={() => setLeht(l => Math.min(koguLehti, l + 1))} disabled={leht === koguLehti} style={s.lehenupp}>Järgmine →</button>
        </div>
      )}
    </main>
  );
}

const s = {
  pealkiri: { fontSize: '28px', fontWeight: '800', marginBottom: '8px', color: 'white' },
  nupp: { padding: '6px 16px', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'rgba(255,255,255,0.65)' },
  nuppAktiivne: { padding: '6px 16px', backgroundColor: 'rgba(108,99,255,0.25)', color: 'white', border: '1px solid rgba(108,99,255,0.5)', borderRadius: '8px', fontWeight: '700' },
  leheNavi: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', padding: '40px 0' },
  lehenupp: { padding: '8px 20px', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', color: 'rgba(255,255,255,0.7)' },
};
