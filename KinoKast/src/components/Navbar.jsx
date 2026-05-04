// Ülemine navigatsiooniriba

import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useFavourites } from '../context/FavouritesContext';

export default function Navbar() {
  const [otsing, setOtsing] = useState('');
  const navigate = useNavigate();
  const { favourites } = useFavourites();

  // Otsingu käivitamine
  const handleOtsing = (e) => {
    e.preventDefault();
    if (otsing.trim()) {
      navigate(`/search?q=${encodeURIComponent(otsing.trim())}`);
      setOtsing('');
    }
  };

  return (
    <nav style={stiilid.nav}>
      <div className="container" style={stiilid.sisu}>
        {/* Logo */}
        <NavLink to="/" style={stiilid.logo}>
          KinoKast
        </NavLink>

        {/* Menüülingid */}
        <div style={stiilid.lingid}>
          <NavLink to="/" end style={({ isActive }) => isActive ? stiilid.aktiivne : stiilid.link}>
            Avaleht
          </NavLink>
          <NavLink to="/movies" style={({ isActive }) => isActive ? stiilid.aktiivne : stiilid.link}>
            Filmid
          </NavLink>
          <NavLink to="/tv" style={({ isActive }) => isActive ? stiilid.aktiivne : stiilid.link}>
            Sarjad
          </NavLink>
          <NavLink to="/favourites" style={({ isActive }) => isActive ? stiilid.aktiivne : stiilid.link}>
            Lemmikud {favourites.length > 0 && `(${favourites.length})`}
          </NavLink>
        </div>

        {/* Otsinguvorm */}
        <form onSubmit={handleOtsing} style={stiilid.vorm}>
          <input
            type="text"
            value={otsing}
            onChange={(e) => setOtsing(e.target.value)}
            placeholder="Otsi filme..."
            style={stiilid.input}
          />
          <button type="submit" style={stiilid.nupp}>Otsi</button>
        </form>
      </div>
    </nav>
  );
}

// Inline stiilid - lihtsam mõista kui eraldi CSS failid
const stiilid = {
  nav: {
    backgroundColor: '#1976d2',
    padding: '12px 0',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  sisu: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    flexWrap: 'wrap',
  },
  logo: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: '20px',
    textDecoration: 'none',
  },
  lingid: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  link: {
    color: 'rgba(255,255,255,0.85)',
    textDecoration: 'none',
    padding: '6px 12px',
    borderRadius: '4px',
  },
  aktiivne: {
    color: 'white',
    textDecoration: 'none',
    padding: '6px 12px',
    borderRadius: '4px',
    backgroundColor: 'rgba(255,255,255,0.2)',
    fontWeight: 'bold',
  },
  vorm: {
    display: 'flex',
    gap: '6px',
    marginLeft: 'auto',
  },
  input: {
    padding: '6px 12px',
    borderRadius: '4px',
    border: 'none',
    fontSize: '14px',
    width: '200px',
  },
  nupp: {
    padding: '6px 14px',
    backgroundColor: 'white',
    color: '#1976d2',
    border: 'none',
    borderRadius: '4px',
    fontWeight: 'bold',
  },
};
