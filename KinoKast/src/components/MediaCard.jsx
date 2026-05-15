import { Link } from 'react-router-dom';
import { useFavourites } from '../context/FavouritesContext';
import { getImageUrl, getMediaTitle } from '../services/tmdb';

export default function MediaCard({ item }) {
  const { isFavourite, addFavourite, removeFavourite } = useFavourites();

  const mediaType = item.media_type || (item.title ? 'movie' : 'tv');
  const pealkiri = getMediaTitle(item);
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
    <Link to={`/${mediaType}/${item.id}`} style={s.kaart}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
        e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.5)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={s.piltKonteiner}>
        {pilt ? (
          <img src={pilt} alt={pealkiri} style={s.pilt} loading="lazy" />
        ) : (
          <div style={s.piltPuudub}>🎬</div>
        )}
        {item.vote_average > 0 && (
          <div style={s.reiting}>★ {item.vote_average.toFixed(1)}</div>
        )}
        <div style={{ ...s.tüüpBadge, backgroundColor: mediaType === 'movie' ? 'rgba(108,99,255,0.85)' : 'rgba(20,120,80,0.85)' }}>
          {mediaType === 'movie' ? 'Film' : 'Sari'}
        </div>
      </div>

      <div style={s.info}>
        <p style={s.pealkiri}>{pealkiri}</p>
        <div style={s.meta}>
          <span style={s.aasta}>{aasta}</span>
          <button onClick={handleLemmik} style={s.lemmikNupp} title="Lisa/eemalda lemmikutest">
            <svg width="18" height="18" viewBox="0 0 24 24"
              fill={onLemmik ? '#e53935' : 'none'}
              stroke={onLemmik ? '#e53935' : 'rgba(255,255,255,0.4)'}
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
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: '12px',
    overflow: 'hidden',
    textDecoration: 'none',
    color: 'white',
    border: '1px solid rgba(255,255,255,0.08)',
    transition: 'transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease',
  },
  piltKonteiner: {
    position: 'relative',
    aspectRatio: '2/3',
    backgroundColor: 'rgba(255,255,255,0.05)',
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
    color: 'rgba(255,255,255,0.2)',
  },
  reiting: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    backgroundColor: 'rgba(0,0,0,0.75)',
    color: '#f5c518',
    padding: '3px 8px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '700',
    backdropFilter: 'blur(4px)',
  },
  tüüpBadge: {
    position: 'absolute',
    top: '8px',
    left: '8px',
    color: 'white',
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '10px',
    fontWeight: '700',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
  },
  info: {
    padding: '10px 12px 12px',
  },
  pealkiri: {
    fontWeight: '600',
    fontSize: '13px',
    marginBottom: '6px',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    color: 'rgba(255,255,255,0.9)',
    lineHeight: '1.4',
  },
  meta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  aasta: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: '12px',
  },
  lemmikNupp: {
    background: 'none',
    border: 'none',
    padding: '0',
    lineHeight: 1,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
};
