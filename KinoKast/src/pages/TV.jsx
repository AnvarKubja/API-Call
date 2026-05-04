// Seriaalide sirvimise leht

import { useState } from 'react';
import { getPopularTV, getTopRatedTV } from '../services/tmdb';
import { useFetch } from '../hooks/useFetch';
import MediaGrid from '../components/MediaGrid';
import { LoadingSpinner, ErrorMessage } from '../components/LoadingSpinner';

const KATEGOORIAD = [
  { id: 'popular',   nimetus: 'Populaarsed', fn: getPopularTV },
  { id: 'top_rated', nimetus: 'Kõrgelt hinnatud',  fn: getTopRatedTV },
];

export default function TV() {
  const [kategooria, setKategooria] = useState('popular');
  const [leht, setLeht] = useState(1);
  const [sorteeri, setSorteeri] = useState('vaikimisi');
  const [filter, setFilter] = useState('');

  const aktiivneFn = KATEGOORIAD.find(k => k.id === kategooria)?.fn || getPopularTV;
  const { data, loading, error } = useFetch(() => aktiivneFn(leht), [kategooria, leht]);

  let tulemused = (data?.results || []).map(s => ({ ...s, media_type: 'tv' }));

  if (filter.trim()) {
    tulemused = tulemused.filter(s =>
      s.name?.toLowerCase().includes(filter.toLowerCase())
    );
  }

  if (sorteeri === 'reiting_alla') tulemused = [...tulemused].sort((a, b) => b.vote_average - a.vote_average);
  if (sorteeri === 'reiting_üles') tulemused = [...tulemused].sort((a, b) => a.vote_average - b.vote_average);
  if (sorteeri === 'pealkiri')     tulemused = [...tulemused].sort((a, b) => a.name?.localeCompare(b.name));

  const koguLehti = Math.min(data?.total_pages || 1, 500);

  return (
    <main className="container" style={{ padding: '24px 16px' }}>
      <h1 style={{ marginBottom: '20px' }}>Sarjad</h1>

      <div style={stiilid.tööriistariba}>
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
        <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
          <input
            type="text"
            value={filter}
            onChange={e => setFilter(e.target.value)}
            placeholder="Filtreeri nimetuse järgi..."
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

      {loading && <LoadingSpinner text="Laadin sarjasid..." />}
      {error   && <ErrorMessage message={error} />}
      {!loading && !error && <MediaGrid items={tulemused} />}

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
  nupp: { padding: '6px 14px', backgroundColor: '#f5f5f5', border: '1px solid #ddd', borderRadius: '4px' },
  nuppAktiivne: { padding: '6px 14px', backgroundColor: '#1976d2', color: 'white', border: '1px solid #1976d2', borderRadius: '4px', fontWeight: 'bold' },
  input: { padding: '6px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' },
  select: { padding: '6px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', backgroundColor: 'white' },
  leheNavi: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', padding: '32px 0', color: '#666' },
  lehenupp: { padding: '8px 16px', backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '4px' },
};
