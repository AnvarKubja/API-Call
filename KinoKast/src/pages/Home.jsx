import { Link } from 'react-router-dom';
import { getPopularMovies, getPopularTV } from '../services/tmdb';
import { useFetch } from '../hooks/useFetch';
import MediaCard from '../components/MediaCard';
import { LoadingSpinner, ErrorMessage } from '../components/LoadingSpinner';

export default function Home() {
  const { data: filmidData, loading: filmidLaadib, error: filmidViga } = useFetch(
    () => getPopularMovies(1), []
  );
  const { data: sarjadData, loading: sarjadLaadib, error: sarjadViga } = useFetch(
    () => getPopularTV(1), []
  );

  const filmid = (filmidData?.results || []).slice(0, 8);
  const sarjad = (sarjadData?.results || []).slice(0, 8);

  return (
    <main style={{ position: 'relative', zIndex: 1 }}>
      {/* Hero bänner */}
      <div style={s.banner}>
        <div className="container" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
          <p style={s.subheading}>• Filmide ja seriaalide kogu</p>
          <h1 style={s.title}>KINOKAST</h1>
          <p style={s.desc}>Otsi ja salvesta lemmikuid filme ja sarjasid.</p>
          <div style={{ display: 'flex', gap: '14px', marginTop: '28px', flexWrap: 'wrap' }}>
            <Link to="/movies" style={s.nuppPrimary}>Sirvi filme</Link>
            <Link to="/tv" style={s.nuppSecondary}>Sirvi sarjasid</Link>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '48px 20px' }}>
        {/* Populaarsed filmid */}
        <section style={{ marginBottom: '56px' }}>
          <div style={s.sektsiooniPäis}>
            <h2 style={s.sektsiooniPealkiri}>Populaarsed filmid</h2>
            <Link to="/movies" style={s.vaataKõiki}>Vaata kõiki →</Link>
          </div>
          {filmidLaadib && <LoadingSpinner text="Laadin filme..." />}
          {filmidViga && <ErrorMessage message={filmidViga} />}
          {!filmidLaadib && !filmidViga && (
            <div style={s.ruudustik}>
              {filmid.map(film => <MediaCard key={film.id} item={film} />)}
            </div>
          )}
        </section>

        {/* Populaarsed sarjad */}
        <section>
          <div style={s.sektsiooniPäis}>
            <h2 style={s.sektsiooniPealkiri}>Populaarsed sarjad</h2>
            <Link to="/tv" style={s.vaataKõiki}>Vaata kõiki →</Link>
          </div>
          {sarjadLaadib && <LoadingSpinner text="Laadin sarjasid..." />}
          {sarjadViga && <ErrorMessage message={sarjadViga} />}
          {!sarjadLaadib && !sarjadViga && (
            <div style={s.ruudustik}>
              {sarjad.map(sari => <MediaCard key={sari.id} item={sari} />)}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

const s = {
  banner: {
    background: 'linear-gradient(180deg, rgba(50,30,100,0.15) 0%, transparent 100%)',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    textAlign: 'center',
  },
  subheading: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: '14px',
    letterSpacing: '2px',
    marginBottom: '20px',
  },
  title: {
    fontSize: 'clamp(48px, 8vw, 96px)',
    fontWeight: '900',
    letterSpacing: '6px',
    color: 'white',
    lineHeight: 1,
    marginBottom: '12px',
  },
  subtitle: {
    fontSize: '16px',
    letterSpacing: '10px',
    color: 'rgba(255,255,255,0.5)',
    marginBottom: '24px',
    fontWeight: '300',
  },
  desc: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: '16px',
    maxWidth: '400px',
    margin: '0 auto',
  },
  nuppPrimary: {
    backgroundColor: 'rgba(108, 99, 255, 0.85)',
    color: 'white',
    padding: '12px 28px',
    borderRadius: '8px',
    fontWeight: '700',
    textDecoration: 'none',
    border: '1px solid rgba(108,99,255,0.5)',
    fontSize: '15px',
  },
  nuppSecondary: {
    backgroundColor: 'transparent',
    color: 'rgba(255,255,255,0.8)',
    padding: '12px 28px',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.2)',
    textDecoration: 'none',
    fontSize: '15px',
    fontWeight: '500',
  },
  sektsiooniPäis: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  sektsiooniPealkiri: {
    fontSize: '20px',
    fontWeight: '700',
    color: 'white',
  },
  vaataKõiki: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: '14px',
    transition: 'color 0.2s',
  },
  ruudustik: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gap: '16px',
  },
};
