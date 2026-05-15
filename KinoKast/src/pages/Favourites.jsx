import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFavourites } from '../context/FavouritesContext';
import MediaGrid from '../components/MediaGrid';
import { getMediaTitle } from '../services/tmdb';

export default function Favourites() {
  const { favourites, removeFavourite } = useFavourites();
  const [filter, setFilter] = useState('all');
  const [sorteeri, setSorteeri] = useState('lisatud');

  let nimekiri = [...favourites];
  if (filter !== 'all') nimekiri = nimekiri.filter(i => i.media_type === filter);
  if (sorteeri === 'reiting') nimekiri = nimekiri.sort((a, b) => b.vote_average - a.vote_average);
  else if (sorteeri === 'pealkiri') nimekiri = nimekiri.sort((a, b) => getMediaTitle(a).localeCompare(getMediaTitle(b)));

  if (favourites.length === 0) {
    return (
      <main className="container" style={{ padding: '40px 20px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <h1 style={s.pealkiri}>Lemmikud</h1>
        <div style={s.tühiOlek}>
          <p style={{ fontSize: '48px', marginBottom: '16px' }}>🎬</p>
          <h2 style={{ color: 'white', marginBottom: '8px' }}>Lemmikuid pole veel</h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', margin: '8px 0 28px', fontSize: '15px' }}>
            Vajuta <strong style={{ color: 'rgba(255,255,255,0.7)' }}>♡</strong> nuppu filmil või sarjal, et see siia salvestada.
          </p>
          <Link to="/movies" style={s.sirviNupp}>Sirvi filme</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container" style={{ padding: '40px 20px', position: 'relative', zIndex: 1 }}>
      <h1 style={s.pealkiri}>Lemmikud</h1>
      <p style={{ color: 'rgba(255,255,255,0.35)', marginBottom: '24px', fontSize: '14px' }}>{favourites.length} salvestatud</p>

      <div style={s.tööriistariba}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { id: 'all', nimetus: `Kõik (${favourites.length})` },
            { id: 'movie', nimetus: `Filmid (${favourites.filter(f => f.media_type === 'movie').length})` },
            { id: 'tv', nimetus: `Sarjad (${favourites.filter(f => f.media_type === 'tv').length})` },
          ].map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)}
              style={f.id === filter ? s.nuppAktiivne : s.nupp}>
              {f.nimetus}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
          <select value={sorteeri} onChange={e => setSorteeri(e.target.value)} style={s.select}>
            <option value="lisatud">Lisamise järjekord</option>
            <option value="reiting">Reiting</option>
            <option value="pealkiri">Pealkiri</option>
          </select>
          <button
            onClick={() => { if (window.confirm('Kas kustutada kõik lemmikud?')) [...favourites].forEach(i => removeFavourite(i.id, i.media_type)); }}
            style={s.kustutaNupp}>
            Tühjenda kõik
          </button>
        </div>
      </div>

      <MediaGrid items={nimekiri} />
    </main>
  );
}

const s = {
  pealkiri: { fontSize: '28px', fontWeight: '800', marginBottom: '4px', color: 'white' },
  tühiOlek: {
    padding: '80px 20px',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.08)',
    marginTop: '24px',
  },
  sirviNupp: {
    display: 'inline-block', padding: '12px 28px',
    backgroundColor: 'rgba(108,99,255,0.8)', color: 'white',
    borderRadius: '10px', textDecoration: 'none', fontWeight: '700',
  },
  tööriistariba: {
    display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px',
    marginBottom: '24px', padding: '14px 16px',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)',
  },
  nupp: { padding: '6px 16px', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'rgba(255,255,255,0.65)' },
  nuppAktiivne: { padding: '6px 16px', backgroundColor: 'rgba(108,99,255,0.25)', color: 'white', border: '1px solid rgba(108,99,255,0.5)', borderRadius: '8px', fontWeight: '700' },
  select: { padding: '7px 14px', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', fontSize: '14px', backgroundColor: '#0d0f2a', color: 'rgba(255,255,255,0.8)' },
  kustutaNupp: { padding: '7px 14px', backgroundColor: 'rgba(229,57,53,0.12)', border: '1px solid rgba(229,57,53,0.3)', color: '#e57373', borderRadius: '8px', fontSize: '14px' },
};
