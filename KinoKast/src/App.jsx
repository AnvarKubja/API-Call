// App.jsx – Peamine komponent koos Router-iga

import { BrowserRouter, Routes, Route, ScrollRestoration } from 'react-router-dom';
import { FavouritesProvider } from './context/FavouritesContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Movies from './pages/Movies';
import TV from './pages/TV';
import Detail from './pages/Detail';
import Search from './pages/Search';
import Favourites from './pages/Favourites';

// ScrollToTop – lehe vahetus kerib ülespoole
function ScrollToTop() {
  return null;
}

export default function App() {
  return (
    <FavouritesProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/tv" element={<TV />} />
          <Route path="/movie/:id" element={<Detail mediaType="movie" />} />
          <Route path="/tv/:id" element={<Detail mediaType="tv" />} />
          <Route path="/search" element={<Search />} />
          <Route path="/favourites" element={<Favourites />} />
          {/* 404 */}
          <Route path="*" element={
            <div style={{ textAlign: 'center', padding: '120px 20px', color: 'var(--text-muted)' }}>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '6rem', color: 'var(--accent)' }}>404</h1>
              <p>Lehekülge ei leitud</p>
            </div>
          } />
        </Routes>
        <Footer />
      </BrowserRouter>
    </FavouritesProvider>
  );
}
