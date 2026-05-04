// Detailvaade - ühe filmi või sarja täielik info

import { useParams } from 'react-router-dom';
import { getMovieDetails, getTVDetails, getImageUrl } from '../services/tmdb';
import { useFetch } from '../hooks/useFetch';
import { useFavourites } from '../context/FavouritesContext';
import MediaCard from '../components/MediaCard';
import { LoadingSpinner, ErrorMessage } from '../components/LoadingSpinner';

// mediaType prop tuleb App.jsx marsruutidest: 'movie' või 'tv'
export default function Detail({ mediaType }) {
  const { id } = useParams(); // URL-ist: /movie/123 -> id = '123'
  const { isFavourite, addFavourite, removeFavourite } = useFavourites();

  // Vali õige API funktsioon
  const { data: item, loading, error } = useFetch(
    () => mediaType === 'movie' ? getMovieDetails(Number(id)) : getTVDetails(Number(id)),
    [id, mediaType]
  );

  if (loading) return <LoadingSpinner text="Laadin..." />;
  if (error)   return <div className="container"><ErrorMessage message={error} /></div>;
  if (!item)   return null;

  const pealkiri = item.title || item.name;
  const aasta = (item.release_date || item.first_air_date || '').slice(0, 4);
  const poster = getImageUrl(item.poster_path, 'w342');
  const onLemmik = isFavourite(item.id, mediaType);

  // Leia YouTube treiler
  const treiler = item.videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube');

  // Esimesed 8 näitlejat
  const näitlejad = (item.credits?.cast || []).slice(0, 8);

  // Sarnased filmid/sarjad
  const sarnased = (item.similar?.results || []).slice(0, 6).map(s => ({ ...s, media_type: mediaType }));

  const handleLemmik = () => {
    if (onLemmik) removeFavourite(item.id, mediaType);
    else addFavourite({ ...item, media_type: mediaType });
  };

  return (
    <main className="container" style={{ padding: '32px 16px' }}>
      {/* Põhiinfo - poster + detailid kõrvuti */}
      <div style={stiilid.põhiinfo}>
        {/* Vasak: poster */}
        {poster && (
          <img src={poster} alt={pealkiri} style={stiilid.poster} />
        )}

        {/* Parem: info */}
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>{pealkiri}</h1>

          {/* Meta: aasta, kestus, reiting */}
          <div style={stiilid.meta}>
            {aasta && <span>📅 {aasta}</span>}
            {item.runtime && <span>⏱ {item.runtime} min</span>}
            {item.number_of_seasons && <span>📺 {item.number_of_seasons} hooaeg</span>}
            {item.vote_average > 0 && (
              <span style={{ color: '#f5c518', fontWeight: 'bold' }}>
                ★ {item.vote_average.toFixed(1)} ({item.vote_count?.toLocaleString()} hinnangut)
              </span>
            )}
          </div>

          {/* Žanrid */}
          {item.genres?.length > 0 && (
            <div style={stiilid.žanrid}>
              {item.genres.map(g => (
                <span key={g.id} style={stiilid.žanr}>{g.name}</span>
              ))}
            </div>
          )}

          {/* Kirjeldus */}
          {item.overview && (
            <p style={{ marginBottom: '20px', lineHeight: 1.7, color: '#444' }}>
              {item.overview}
            </p>
          )}

          {/* Tegevusnupud */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button onClick={handleLemmik} style={onLemmik ? stiilid.nuppLemmikAktiivne : stiilid.nuppLemmik}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill={onLemmik ? '#e53935' : 'none'} stroke={onLemmik ? '#e53935' : '#333'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: '6px' }}>
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {onLemmik ? 'Lemmikutes' : 'Lisa lemmikuks'}
            </button>
            {treiler && (
              <a
                href={`https://www.youtube.com/watch?v=${treiler.key}`}
                target="_blank"
                rel="noreferrer"
                style={stiilid.nuppTreeiler}
              >
                ▶ Vaata treilerit
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Näitlejad */}
      {näitlejad.length > 0 && (
        <section style={{ marginTop: '40px' }}>
          <h2 style={{ marginBottom: '16px' }}>Näitlejad</h2>
          <div style={stiilid.näitlejadRuudustik}>
            {näitlejad.map(näitleja => (
              <div key={näitleja.id} style={stiilid.näitlejaKaart}>
                {/* Näitleja foto */}
                <div style={stiilid.näitlejaFoto}>
                  {näitleja.profile_path ? (
                    <img
                      src={getImageUrl(näitleja.profile_path, 'w185')}
                      alt={näitleja.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <span style={{ fontSize: '30px' }}>👤</span>
                  )}
                </div>
                <p style={{ fontSize: '13px', fontWeight: 'bold', textAlign: 'center' }}>{näitleja.name}</p>
                <p style={{ fontSize: '12px', color: '#666', textAlign: 'center' }}>{näitleja.character}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Sarnased */}
      {sarnased.length > 0 && (
        <section style={{ marginTop: '40px' }}>
          <h2 style={{ marginBottom: '16px' }}>Sarnased</h2>
          <div style={stiilid.sarnasedRuudustik}>
            {sarnased.map(s => <MediaCard key={s.id} item={s} />)}
          </div>
        </section>
      )}
    </main>
  );
}

const stiilid = {
  põhiinfo: {
    display: 'flex',
    gap: '32px',
    flexWrap: 'wrap',
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '8px',
    border: '1px solid #ddd',
  },
  poster: {
    width: '220px',
    borderRadius: '8px',
    flexShrink: 0,
  },
  meta: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
    marginBottom: '16px',
    color: '#555',
    fontSize: '15px',
  },
  žanrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '16px',
  },
  žanr: {
    backgroundColor: '#e3f2fd',
    color: '#1976d2',
    padding: '3px 10px',
    borderRadius: '12px',
    fontSize: '13px',
  },
  nuppLemmik: {
    padding: '10px 20px',
    backgroundColor: 'white',
    border: '2px solid #ddd',
    borderRadius: '6px',
    fontSize: '15px',
  },
  nuppLemmikAktiivne: {
    padding: '10px 20px',
    backgroundColor: '#fff0f0',
    border: '2px solid #e53935',
    borderRadius: '6px',
    fontSize: '15px',
    color: '#e53935',
  },
  nuppTreeiler: {
    display: 'inline-block',
    padding: '10px 20px',
    backgroundColor: '#e53935',
    color: 'white',
    borderRadius: '6px',
    fontSize: '15px',
    textDecoration: 'none',
  },
  näitlejadRuudustik: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
    gap: '16px',
  },
  näitlejaKaart: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
  },
  näitlejaFoto: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    overflow: 'hidden',
    backgroundColor: '#eee',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid #ddd',
  },
  sarnasedRuudustik: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gap: '16px',
  },
};
