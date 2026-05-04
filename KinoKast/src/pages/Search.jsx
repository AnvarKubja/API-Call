// Otsingutulemusete leht

import { useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { searchMulti } from '../services/tmdb';
import { useFetch } from '../hooks/useFetch';
import MediaGrid from '../components/MediaGrid';
import { LoadingSpinner, ErrorMessage } from '../components/LoadingSpinner';

export default function Search() {
  const [searchParams] = useSearchParams();
  const päring = searchParams.get('q') || ''; // URL-ist: /search?q=batman
  const [leht, setLeht] = useState(1);
  const [filter, setFilter] = useState('all'); // Filtreeri: kõik / filmid / sarjad

  // Lähtesta leht kui päring muutub
  useEffect(() => { setLeht(1); }, [päring]);

  const { data, loading, error } = useFetch(
    () => päring ? searchMulti(päring, leht) : Promise.resolve({ results: [] }),
    [päring, leht]
  );

  // Eemalda isikud (media_type: 'person'), jäta alles filmid ja sarjad
  let tulemused = (data?.results || []).filter(
    item => item.media_type === 'movie' || item.media_type === 'tv'
  );

  // Rakenda filter
  if (filter !== 'all') {
    tulemused = tulemused.filter(item => item.media_type === filter);
  }

  const koguLehti = Math.min(data?.total_pages || 1, 500);

  return (
    <main className="container" style={{ padding: '24px 16px' }}>
      {päring ? (
        <h1 style={{ marginBottom: '8px' }}>Otsing: "{päring}"</h1>
      ) : (
        <h1>Otsing</h1>
      )}

      {data?.total_results > 0 && (
        <p style={{ color: '#666', marginBottom: '16px' }}>
          {data.total_results.toLocaleString()} tulemust
        </p>
      )}

      {/* Filtreerimise nupud */}
      {päring && (
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          {[
            { id: 'all',   nimetus: 'Kõik' },
            { id: 'movie', nimetus: 'Filmid' },
            { id: 'tv',    nimetus: 'Sarjad' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              style={f.id === filter ? stiilid.nuppAktiivne : stiilid.nupp}
            >
              {f.nimetus}
            </button>
          ))}
        </div>
      )}

      {/* Kui päring puudub */}
      {!päring && (
        <p style={{ color: '#666', marginTop: '40px', textAlign: 'center' }}>
          Sisesta otsingusõna navigatsiooniribale.
        </p>
      )}

      {loading && <LoadingSpinner text="Otsin..." />}
      {error   && <ErrorMessage message={error} />}
      {!loading && !error && päring && <MediaGrid items={tulemused} />}

      {/* Lehekülgede navigatsioon */}
      {!loading && !error && päring && koguLehti > 1 && (
        <div style={stiilid.leheNavi}>
          <button onClick={() => setLeht(l => Math.max(1, l - 1))} disabled={leht === 1} style={stiilid.lehenupp}>
            ← Eelmine
          </button>
          <span>{leht} / {koguLehti}</span>
          <button onClick={() => setLeht(l => Math.min(koguLehti, l + 1))} disabled={leht === koguLehti} style={stiilid.lehenupp}>
            Järgmine →
          </button>
        </div>
      )}
    </main>
  );
}

const stiilid = {
  nupp: { padding: '6px 14px', backgroundColor: '#f5f5f5', border: '1px solid #ddd', borderRadius: '4px' },
  nuppAktiivne: { padding: '6px 14px', backgroundColor: '#1976d2', color: 'white', border: '1px solid #1976d2', borderRadius: '4px', fontWeight: 'bold' },
  leheNavi: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', padding: '32px 0', color: '#666' },
  lehenupp: { padding: '8px 16px', backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '4px' },
};
