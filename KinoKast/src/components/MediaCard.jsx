import { Link } from 'react-router-dom';
import { useFavourites } from '../context/FavouritesContext';
import { getImageUrl } from '../services/tmdb';

export default function MediaCard({ item }) {
  const { isFavourite, addFavourite, removeFavourite } = useFavourites();

  const mediaType = item.media_type || (item.title ? 'movie' : 'tv');
  const pealkiri = item.title || item.name;
  const aasta = (item.release_date || item.first_air_date || '').slice(0, 4);
  const pilt = getImageUrl(item.poster_path, 'w342');
  const onLemmik = isFavourite(item.id, mediaType);

  const handleLemmik = (e) => {
    e.preventDefault();
    if (onLemmik) {
      removeFavourite(item.id, mediaType);
    } else {
      addFavourite({ ...item, media_type: mediaType });
    }
  };

  return (
    <Link to={`/${mediaType}/${item.id}`} style={s.kaart}>
      <div style={s.piltKonteiner}>
        {pilt ? (
          <img src={pilt} alt={pealkiri} style={s.pilt} loading="lazy" />
        ) : (
          <div style={s.piltPuudub}>🎬</div>
        )}
        {item.vote_average > 0 && (
          <div style={s.reiting}>★ {item.vote_average.toFixed(1)}</div>
        )}
      </div>

      <div style={s.info}>
        <p style={s.pealkiri}>{pealkiri}</p>
        <div style={s.meta}>
          <span style={s.aasta}>{aasta}</span>
          <button onClick={handleLemmik} style={s.lemmikNupp} title="Lisa/eemalda lemmikutest">
            <svg width="20" height="20" viewBox="0 0 24 24"
              fill={onLemmik ? '#e53935' : 'none'}
              stroke={onLemmik ? '#e53935' : '#aaa'}
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>
      </div>
    </Link>
  );
}

const s = {
  kaart: {
    display: 'block',
    backgroundColor: 'white',
    borderRadius: '6px',
    overflow: 'hidden',
    textDecoration: 'none',
    color: '#222',
  },
  piltKonteiner: {
    position: 'relative',
    aspectRatio: '2/3',
    backgroundColor: '#e8e8e8',
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
  },
  reiting: {
    position: 'absolute',
    top: '6px',
    right: '6px',
    backgroundColor: 'rgba(0,0,0,0.7)',
    color: '#f5c518',
    padding: '2px 6px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  info: {
    padding: '8px 10px',
  },
  pealkiri: {
    fontWeight: 'bold',
    fontSize: '13px',
    marginBottom: '4px',
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
    color: '#888',
    fontSize: '12px',
  },
  lemmikNupp: {
    background: 'none',
    border: 'none',
    padding: '0',
    lineHeight: 1,
    cursor: 'pointer',
  },
};
