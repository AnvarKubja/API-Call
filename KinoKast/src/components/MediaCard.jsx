// Ühe filmi või sarja kaart

import { Link } from 'react-router-dom';
import { useFavourites } from '../context/FavouritesContext';
import { getImageUrl } from '../services/tmdb';

export default function MediaCard({ item }) {
  const { isFavourite, addFavourite, removeFavourite } = useFavourites();

  // Määra meediumitüüp (film või sari)
  const mediaType = item.media_type || (item.title ? 'movie' : 'tv');
  const pealkiri = item.title || item.name;
  const aasta = (item.release_date || item.first_air_date || '').slice(0, 4);
  const pilt = getImageUrl(item.poster_path, 'w342');
  const onLemmik = isFavourite(item.id, mediaType);

  const handleLemmik = (e) => {
    e.preventDefault(); // Ära liigu detailvaatele
    if (onLemmik) {
      removeFavourite(item.id, mediaType);
    } else {
      addFavourite({ ...item, media_type: mediaType });
    }
  };

  return (
    <Link to={`/${mediaType}/${item.id}`} style={stiilid.kaart}>
      {/* Filmi poster */}
      <div style={stiilid.piltKonteiner}>
        {pilt ? (
          <img src={pilt} alt={pealkiri} style={stiilid.pilt} loading="lazy" />
        ) : (
          <div style={stiilid.piltPuudub}>🎬</div>
        )}

        {/* Reiting paremas ülanurgas */}
        {item.vote_average > 0 && (
          <div style={stiilid.reiting}>
            ★ {item.vote_average.toFixed(1)}
          </div>
        )}
      </div>

      {/* Kaardi allosa info */}
      <div style={stiilid.info}>
        <p style={stiilid.pealkiri}>{pealkiri}</p>
        <div style={stiilid.meta}>
          <span style={stiilid.aasta}>{aasta}</span>
          {/* Lemmiku nupp - täidetud punane süda kui lemmik, outline kui mitte */}
          <button onClick={handleLemmik} style={stiilid.lemmikNupp} title="Lisa/eemalda lemmikutest">
            <svg width="22" height="22" viewBox="0 0 24 24" fill={onLemmik ? '#e53935' : 'none'} stroke={onLemmik ? '#e53935' : '#333'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>
      </div>
    </Link>
  );
}

const stiilid = {
  kaart: {
    display: 'block',
    backgroundColor: 'white',
    borderRadius: '8px',
    overflow: 'hidden',
    border: '1px solid #ddd',
    textDecoration: 'none',
    color: '#222',
    transition: 'transform 0.2s, box-shadow 0.2s',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  piltKonteiner: {
    position: 'relative',
    aspectRatio: '2/3',
    backgroundColor: '#eee',
    overflow: 'hidden',
  },
  pilt: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  piltPuudub: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '40px',
    color: '#999',
  },
  reiting: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    backgroundColor: 'rgba(0,0,0,0.75)',
    color: '#f5c518',
    padding: '2px 6px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  info: {
    padding: '10px',
  },
  pealkiri: {
    fontWeight: 'bold',
    fontSize: '14px',
    marginBottom: '6px',
    // Lõika pikk pealkiri kahele reale
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  meta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  aasta: {
    color: '#666',
    fontSize: '13px',
  },
  lemmikNupp: {
    background: 'none',
    border: 'none',
    fontSize: '18px',
    padding: '0',
    lineHeight: 1,
  },
};
