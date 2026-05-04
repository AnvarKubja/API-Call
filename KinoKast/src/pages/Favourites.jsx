// Lemmikute leht - andmed pärinevad localStorage-st

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFavourites } from '../context/FavouritesContext';
import MediaGrid from '../components/MediaGrid';

export default function Favourites() {
  const { favourites, removeFavourite } = useFavourites();
  const [filter, setFilter] = useState('all');
  const [sorteeri, setSorteeri] = useState('lisatud');

  // Filtreeri
  let nimekiri = [...favourites];
  if (filter !== 'all') {
    nimekiri = nimekiri.filter(item => item.media_type === filter);
  }

  // Sorteeri
  if (sorteeri === 'reiting') {
    nimekiri = nimekiri.sort((a, b) => b.vote_average - a.vote_average);
  } else if (sorteeri === 'pealkiri') {
    nimekiri = nimekiri.sort((a, b) => {
      const a_pealkiri = a.title || a.name || '';
      const b_pealkiri = b.title || b.name || '';
      return a_pealkiri.localeCompare(b_pealkiri);
    });
  }
  // 'lisatud' jätab algse järjekorra

  // Kui lemmikuid pole, näita tühja olekut
  if (favourites.length === 0) {
    return (
      <main className="container" style={{ padding: '24px 16px', textAlign: 'center' }}>
        <h1 style={{ marginBottom: '20px' }}>Lemmikud</h1>
        <div style={stiilid.tühiOlek}>
          <p style={{ fontSize: '48px' }}></p>
          <h2>Lemmikuid pole veel</h2>
          <p style={{ color: '#666', margin: '8px 0 20px' }}>
            Vajuta <strong>♡</strong> nuppu filmil või sarjal, et see siia salvestada.
          </p>
          <Link to="/movies" style={stiilid.sirviNupp}>Sirvi filme</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container" style={{ padding: '24px 16px' }}>
      <h1 style={{ marginBottom: '4px' }}>Lemmikud</h1>
      <p style={{ color: '#666', marginBottom: '20px' }}>{favourites.length} salvestatud</p>

      {/* Tööriistariba */}
      <div style={stiilid.tööriistariba}>
        {/* Filtreerimine */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {[
            { id: 'all',   nimetus: `Kõik (${favourites.length})` },
            { id: 'movie', nimetus: `Filmid (${favourites.filter(f => f.media_type === 'movie').length})` },
            { id: 'tv',    nimetus: `Sarjad (${favourites.filter(f => f.media_type === 'tv').length})` },
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

        <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
          <select value={sorteeri} onChange={e => setSorteeri(e.target.value)} style={stiilid.select}>
            <option value="lisatud">Lisamise järjekord</option>
            <option value="reiting">Reiting</option>
            <option value="pealkiri">Pealkiri</option>
          </select>

          {/* Tühjenda kõik */}
          <button
            onClick={() => {
              if (window.confirm('Kas kustutada kõik lemmikud?')) {
                [...favourites].forEach(item => removeFavourite(item.id, item.media_type));
              }
            }}
            style={stiilid.kustutaNupp}
          >
            Tühjenda kõik
          </button>
        </div>
      </div>

      <MediaGrid items={nimekiri} />
    </main>
  );
}

const stiilid = {
  tühiOlek: {
    padding: '60px 20px',
    backgroundColor: 'white',
    borderRadius: '8px',
    border: '1px solid #ddd',
  },
  sirviNupp: {
    display: 'inline-block',
    padding: '10px 24px',
    backgroundColor: '#1976d2',
    color: 'white',
    borderRadius: '6px',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  tööriistariba: {
    display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px',
    marginBottom: '20px', padding: '12px', backgroundColor: 'white',
    borderRadius: '8px', border: '1px solid #ddd',
  },
  nupp: { padding: '6px 14px', backgroundColor: '#f5f5f5', border: '1px solid #ddd', borderRadius: '4px' },
  nuppAktiivne: { padding: '6px 14px', backgroundColor: '#1976d2', color: 'white', border: '1px solid #1976d2', borderRadius: '4px', fontWeight: 'bold' },
  select: { padding: '6px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', backgroundColor: 'white' },
  kustutaNupp: { padding: '6px 12px', backgroundColor: '#fff0f0', border: '1px solid #e53935', color: '#e53935', borderRadius: '4px' },
};
