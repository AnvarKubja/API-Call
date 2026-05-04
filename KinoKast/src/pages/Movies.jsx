// Filmide sirvimise leht - kategooriad, sorteerimine, filtreerimine

import { useState } from 'react';
import { getPopularMovies, getTopRatedMovies, getNowPlayingMovies } from '../services/tmdb';
import { useFetch } from '../hooks/useFetch';
import MediaGrid from '../components/MediaGrid';
import { LoadingSpinner, ErrorMessage } from '../components/LoadingSpinner';

// Saadaolevad kategooriad
const KATEGOORIAD = [
  { id: 'popular',    nimetus: 'Populaarsed',  fn: getPopularMovies },
  { id: 'top_rated',  nimetus: 'Kõrgelt hinnatud',   fn: getTopRatedMovies },
  { id: 'now_playing',nimetus: 'Kinodes',      fn: getNowPlayingMovies },
];

export default function Movies() {
  const [kategooria, setKategooria] = useState('popular');
  const [leht, setLeht] = useState(1);
  const [sorteeri, setSorteeri] = useState('vaikimisi');
  const [filter, setFilter] = useState('');

  // Leia aktiivne kategooria funktsioon
  const aktiivneFn = KATEGOORIAD.find(k => k.id === kategooria)?.fn || getPopularMovies;

  // Laadi andmed - uuesti kui kategooria või leht muutub
  const { data, loading, error } = useFetch(() => aktiivneFn(leht), [kategooria, leht]);

  // Töötle tulemused: lisa media_type, filtreeri, sorteeri
  let tulemused = (data?.results || []).map(f => ({ ...f, media_type: 'movie' }));

  if (filter.trim()) {
    tulemused = tulemused.filter(f =>
      f.title?.toLowerCase().includes(filter.toLowerCase())
    );
  }

  if (sorteeri === 'reiting_alla')  tulemused = [...tulemused].sort((a, b) => b.vote_average - a.vote_average);
  if (sorteeri === 'reiting_üles')  tulemused = [...tulemused].sort((a, b) => a.vote_average - b.vote_average);
  if (sorteeri === 'pealkiri')      tulemused = [...tulemused].sort((a, b) => a.title?.localeCompare(b.title));

  const koguLehti = Math.min(data?.total_pages || 1, 500);

  return (
    <main className="container" style={{ padding: '24px 16px' }}>
      <h1 style={{ marginBottom: '20px' }}>Filmid</h1>

      {/* Tööriistariba: kategooriad + filter + sorteerimine */}
      <div style={stiilid.tööriistariba}>
        {/* Kategooria nupud */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {KATEGOORIAD.map(k => (
            <button
              key={k.id}
              onClick={() => { setKategooria(k.id); setLeht(1); }}
              style={k.id === kategooria ? stiilid.nuppAktiivne : stiilid.nupp}
            >
              {k.nimetus}
            </button>
          ))}
        </div>

        {/* Filter ja sorteerimine */}
        <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
          <input
            type="text"
            value={filter}
            onChange={e => setFilter(e.target.value)}
            placeholder="Filtreeri pealkirja järgi..."
            style={stiilid.input}
          />
          <select value={sorteeri} onChange={e => setSorteeri(e.target.value)} style={stiilid.select}>
            <option value="vaikimisi">Sorteerimine</option>
            <option value="reiting_alla">Reiting ↓</option>
            <option value="reiting_üles">Reiting ↑</option>
            <option value="pealkiri">Pealkiri A–Z</option>
          </select>
        </div>
      </div>

      {/* Sisu */}
      {loading && <LoadingSpinner text="Laadin filme..." />}
      {error   && <ErrorMessage message={error} />}
      {!loading && !error && <MediaGrid items={tulemused} />}

      {/* Lehekülgede navigatsioon */}
      {!loading && !error && (
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
  tööriistariba: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '20px',
    padding: '12px',
    backgroundColor: 'white',
    borderRadius: '8px',
    border: '1px solid #ddd',
  },
  nupp: {
    padding: '6px 14px',
    backgroundColor: '#f5f5f5',
    border: '1px solid #ddd',
    borderRadius: '4px',
  },
  nuppAktiivne: {
    padding: '6px 14px',
    backgroundColor: '#1976d2',
    color: 'white',
    border: '1px solid #1976d2',
    borderRadius: '4px',
    fontWeight: 'bold',
  },
  input: {
    padding: '6px 12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
  },
  select: {
    padding: '6px 12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    backgroundColor: 'white',
  },
  leheNavi: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '16px',
    padding: '32px 0',
    color: '#666',
  },
  lehenupp: {
    padding: '8px 16px',
    backgroundColor: 'white',
    border: '1px solid #ddd',
    borderRadius: '4px',
  },
};
