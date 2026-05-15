// Ülemine navigatsiooniriba - tumeda portfolio stiilis

import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useFavourites } from '../context/FavouritesContext';

export default function Navbar() {
  const [otsing, setOtsing] = useState('');
  const navigate = useNavigate();
  const { favourites } = useFavourites();

  const handleOtsing = (e) => {
    e.preventDefault();
    if (otsing.trim()) {
      navigate(`/search?q=${encodeURIComponent(otsing.trim())}`);
      setOtsing('');
    }
  };

  return (
    <nav style={s.nav}>
      <div className="container" style={s.sisu}>
        <NavLink to="/" style={s.logo}>
          KinoKast
        </NavLink>

        <div style={s.lingid}>
          <NavLink to="/" end style={({ isActive }) => isActive ? s.aktiivne : s.link}>
            Avaleht
          </NavLink>
          <NavLink to="/movies" style={({ isActive }) => isActive ? s.aktiivne : s.link}>
            Filmid
          </NavLink>
          <NavLink to="/tv" style={({ isActive }) => isActive ? s.aktiivne : s.link}>
            Sarjad
          </NavLink>
          <NavLink to="/favourites" style={({ isActive }) => isActive ? s.aktiivne : s.link}>
            Lemmikud {favourites.length > 0 && `(${favourites.length})`}
          </NavLink>
        </div>

        <form onSubmit={handleOtsing} style={s.vorm}>
          <input
            type="text"
            value={otsing}
            onChange={(e) => setOtsing(e.target.value)}
            placeholder="Otsi filme..."
            style={s.input}
          />
          <button type="submit" style={s.nupp}>Otsi</button>
        </form>
      </div>
    </nav>
  );
}

const s = {
  nav: {
    backgroundColor: 'rgba(8, 9, 26, 0.85)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    padding: '14px 0',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  sisu: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    flexWrap: 'wrap',
  },
  logo: {
    color: 'white',
    fontWeight: '800',
    fontSize: '20px',
    textDecoration: 'none',
    letterSpacing: '0.5px',
  },
  lingid: {
    display: 'flex',
    gap: '4px',
    flexWrap: 'wrap',
  },
  link: {
    color: 'rgba(255,255,255,0.6)',
    textDecoration: 'none',
    padding: '6px 14px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s',
  },
  aktiivne: {
    color: 'white',
    textDecoration: 'none',
    padding: '6px 14px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    backgroundColor: 'rgba(108, 99, 255, 0.2)',
    border: '1px solid rgba(108, 99, 255, 0.4)',
  },
  vorm: {
    display: 'flex',
    gap: '6px',
    marginLeft: 'auto',
  },
  input: {
    padding: '7px 14px',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.15)',
    fontSize: '14px',
    width: '200px',
    backgroundColor: 'rgba(255,255,255,0.07)',
    color: 'white',
    outline: 'none',
  },
  nupp: {
    padding: '7px 16px',
    backgroundColor: 'rgba(108, 99, 255, 0.8)',
    color: 'white',
    border: '1px solid rgba(108, 99, 255, 0.5)',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '14px',
  },
};
