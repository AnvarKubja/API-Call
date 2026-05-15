import { useParams } from 'react-router-dom';
import { getMovieDetails, getTVDetails, getImageUrl, getMediaTitle } from '../services/tmdb';
import { useFetch } from '../hooks/useFetch';
import { useFavourites } from '../context/FavouritesContext';
import MediaCard from '../components/MediaCard';
import { LoadingSpinner, ErrorMessage } from '../components/LoadingSpinner';

export default function Detail({ mediaType }) {
  const { id } = useParams();
  const { isFavourite, addFavourite, removeFavourite } = useFavourites();

  const { data: item, loading, error } = useFetch(
    () => mediaType === 'movie' ? getMovieDetails(Number(id)) : getTVDetails(Number(id)),
    [id, mediaType]
  );

  if (loading) return <LoadingSpinner text="Laadin..." />;
  if (error) return <div className="container"><ErrorMessage message={error} /></div>;
  if (!item) return null;

  const pealkiri = getMediaTitle(item);
  const aasta = (item.release_date || item.first_air_date || '').slice(0, 4);
  const poster = getImageUrl(item.poster_path, 'w342');
  const onLemmik = isFavourite(item.id, mediaType);
  const treiler = item.videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube');
  const näitlejad = (item.credits?.cast || []).slice(0, 8);
  const sarnased = (item.similar?.results || []).slice(0, 6).map(s => ({ ...s, media_type: mediaType }));

  const handleLemmik = () => {
    if (onLemmik) removeFavourite(item.id, mediaType);
    else addFavourite({ ...item, media_type: mediaType });
  };

  return (
    <main className="container" style={{ padding: '40px 20px', position: 'relative', zIndex: 1 }}>
      {/* Põhiinfo */}
      <div style={s.põhiinfo}>
        {poster && <img src={poster} alt={pealkiri} style={s.poster} />}
        <div style={{ flex: 1 }}>
          <h1 style={s.pealkiri}>{pealkiri}</h1>

          <div style={s.meta}>
            {aasta && <span>📅 {aasta}</span>}
            {item.runtime && <span>⏱ {item.runtime} min</span>}
            {item.number_of_seasons && <span>📺 {item.number_of_seasons} hooaeg</span>}
            {item.vote_average > 0 && (
              <span style={{ color: '#f5c518', fontWeight: '700' }}>
                ★ {item.vote_average.toFixed(1)} ({item.vote_count?.toLocaleString()} hinnangut)
              </span>
            )}
          </div>

          {item.genres?.length > 0 && (
            <div style={s.žanrid}>
              {item.genres.map(g => (
                <span key={g.id} style={s.žanr}>{g.name}</span>
              ))}
            </div>
          )}

          {item.overview && (
            <p style={s.kirjeldus}>{item.overview}</p>
          )}

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button onClick={handleLemmik} style={onLemmik ? s.nuppLemmikAktiivne : s.nuppLemmik}>
              <svg width="18" height="18" viewBox="0 0 24 24"
                fill={onLemmik ? '#e53935' : 'none'}
                stroke={onLemmik ? '#e53935' : 'rgba(255,255,255,0.7)'}
                strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                style={{ verticalAlign: 'middle', marginRight: '6px' }}>
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {onLemmik ? 'Lemmikutes' : 'Lisa lemmikuks'}
            </button>
            {treiler && (
              <a href={`https://www.youtube.com/watch?v=${treiler.key}`}
                target="_blank" rel="noreferrer" style={s.nuppTreeiler}>
                ▶ Vaata treilerit
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Näitlejad */}
      {näitlejad.length > 0 && (
        <section style={{ marginTop: '48px' }}>
          <h2 style={s.sektsiooniPealkiri}>Näitlejad</h2>
          <div style={s.näitlejadRuudustik}>
            {näitlejad.map(n => (
              <div key={n.id} style={s.näitlejaKaart}>
                <div style={s.näitlejaFoto}>
                  {n.profile_path ? (
                    <img src={getImageUrl(n.profile_path, 'w185')} alt={n.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontSize: '28px' }}>👤</span>
                  )}
                </div>
                <p style={{ fontSize: '12px', fontWeight: '600', textAlign: 'center', color: 'rgba(255,255,255,0.85)' }}>{n.name}</p>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>{n.character}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Sarnased */}
      {sarnased.length > 0 && (
        <section style={{ marginTop: '48px' }}>
          <h2 style={s.sektsiooniPealkiri}>Sarnased</h2>
          <div style={s.sarnasedRuudustik}>
            {sarnased.map(si => <MediaCard key={si.id} item={si} />)}
          </div>
        </section>
      )}
    </main>
  );
}

const s = {
  põhiinfo: {
    display: 'flex', gap: '32px', flexWrap: 'wrap',
    backgroundColor: 'rgba(255,255,255,0.04)',
    padding: '28px', borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.08)',
  },
  poster: { width: '220px', borderRadius: '12px', flexShrink: 0 },
  pealkiri: { fontSize: '28px', fontWeight: '800', marginBottom: '12px', color: 'white', lineHeight: 1.2 },
  meta: {
    display: 'flex', flexWrap: 'wrap', gap: '16px',
    marginBottom: '16px', color: 'rgba(255,255,255,0.55)', fontSize: '14px',
  },
  žanrid: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' },
  žanr: {
    backgroundColor: 'rgba(108,99,255,0.15)',
    color: 'rgba(180,170,255,0.9)',
    padding: '4px 12px', borderRadius: '20px', fontSize: '12px',
    border: '1px solid rgba(108,99,255,0.3)',
  },
  kirjeldus: { marginBottom: '24px', lineHeight: 1.8, color: 'rgba(255,255,255,0.65)', fontSize: '15px' },
  nuppLemmik: {
    padding: '10px 22px', backgroundColor: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px',
    fontSize: '14px', color: 'rgba(255,255,255,0.8)', fontWeight: '500',
  },
  nuppLemmikAktiivne: {
    padding: '10px 22px', backgroundColor: 'rgba(229,57,53,0.12)',
    border: '1px solid rgba(229,57,53,0.4)', borderRadius: '10px',
    fontSize: '14px', color: '#e57373', fontWeight: '600',
  },
  nuppTreeiler: {
    display: 'inline-block', padding: '10px 22px',
    backgroundColor: 'rgba(229,57,53,0.8)', color: 'white',
    borderRadius: '10px', fontSize: '14px', textDecoration: 'none', fontWeight: '600',
  },
  sektsiooniPealkiri: { fontSize: '20px', fontWeight: '700', marginBottom: '20px', color: 'white' },
  näitlejadRuudustik: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '16px',
  },
  näitlejaKaart: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' },
  näitlejaFoto: {
    width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.08)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    border: '2px solid rgba(255,255,255,0.12)',
  },
  sarnasedRuudustik: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '16px',
  },
};
