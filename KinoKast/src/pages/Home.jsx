// Avaleht - näitab populaarseid filme ja sarjasid

import { Link } from 'react-router-dom';
import { getPopularMovies, getPopularTV } from '../services/tmdb';
import { useFetch } from '../hooks/useFetch';
import MediaCard from '../components/MediaCard';
import { LoadingSpinner, ErrorMessage } from '../components/LoadingSpinner';

export default function Home() {
  // Laadi populaarsed filmid ja sarjad korraga
  const { data: filmidData, loading: filmidLaadib, error: filmidViga } = useFetch(
    () => getPopularMovies(1), []
  );
  const { data: sarjadData, loading: sarjadLaadib, error: sarjadViga } = useFetch(
    () => getPopularTV(1), []
  );

  // Võta esimesed 8 tulemust
  const filmid = (filmidData?.results || []).slice(0, 8).map(f => ({ ...f, media_type: 'movie' }));
  const sarjad = (sarjadData?.results || []).slice(0, 8).map(s => ({ ...s, media_type: 'tv' }));

  return (
    <main>
      {/* Päisebänner */}
      <div style={stiilid.bänner}>
        <div className="container">
          <h1 style={stiilid.pealkiri}>Tere tulemast KinoKasti!</h1>
          <p style={stiilid.kirjeldus}>
            Otsi ja salvesta lemmikuid filme ja sarjasid.
          </p>
          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            <Link to="/movies" style={stiilid.nuppValge}>Sirvi filme</Link>
            <Link to="/tv" style={stiilid.nuppLäbipaistev}>Sirvi sarjasid</Link>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '32px 16px' }}>
        {/* Populaarsed filmid */}
        <section style={{ marginBottom: '40px' }}>
          <div style={stiilid.sektsiooniPäis}>
            <h2>Populaarsed filmid</h2>
            <Link to="/movies">Vaata kõiki →</Link>
          </div>
          {filmidLaadib && <LoadingSpinner text="Laadin filme..." />}
          {filmidViga && <ErrorMessage message={filmidViga} />}
          {!filmidLaadib && !filmidViga && (
            <div style={stiilid.ruudustik}>
              {filmid.map(film => <MediaCard key={film.id} item={film} />)}
            </div>
          )}
        </section>

        {/* Populaarsed sarjad */}
        <section>
          <div style={stiilid.sektsiooniPäis}>
            <h2>Populaarsed sarjad</h2>
            <Link to="/tv">Vaata kõiki →</Link>
          </div>
          {sarjadLaadib && <LoadingSpinner text="Laadin sarjasid..." />}
          {sarjadViga && <ErrorMessage message={sarjadViga} />}
          {!sarjadLaadib && !sarjadViga && (
            <div style={stiilid.ruudustik}>
              {sarjad.map(sari => <MediaCard key={sari.id} item={sari} />)}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

const stiilid = {
  bänner: {
    backgroundColor: '#1976d2',
    color: 'white',
    padding: '48px 0',
  },
  pealkiri: {
    fontSize: '32px',
    marginBottom: '8px',
  },
  kirjeldus: {
    fontSize: '18px',
    opacity: 0.9,
  },
  nuppValge: {
    backgroundColor: 'white',
    color: '#1976d2',
    padding: '10px 20px',
    borderRadius: '6px',
    fontWeight: 'bold',
    textDecoration: 'none',
  },
  nuppLäbipaistev: {
    backgroundColor: 'transparent',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '6px',
    border: '2px solid white',
    textDecoration: 'none',
  },
  sektsiooniPäis: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  ruudustik: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gap: '16px',
  },
};
