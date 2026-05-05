import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FavouritesProvider } from './context/FavouritesContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Movies from './pages/Movies';
import TV from './pages/TV';
import Detail from './pages/Detail';
import Search from './pages/Search';
import Favourites from './pages/Favourites';

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
          <Route path="*" element={
            <div style={{ textAlign: 'center', padding: '120px 20px', color: '#666' }}>
              <h1 style={{ fontSize: '6rem', color: '#1976d2' }}>404</h1>
              <p>Lehekülge ei leitud</p>
            </div>
          } />
        </Routes>
        <Footer />
      </BrowserRouter>
    </FavouritesProvider>
  );
}
