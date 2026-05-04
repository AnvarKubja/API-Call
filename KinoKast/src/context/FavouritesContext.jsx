// Lemmikute haldamine localStorage abil

import { createContext, useContext, useState, useEffect } from 'react';

const FavouritesContext = createContext(null);

const STORAGE_KEY = 'cinemavault_favourites';

export function FavouritesProvider({ children }) {
  const [favourites, setFavourites] = useState(() => {
    // Laadi salvestatud lemmikud localStorage-st
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Salvesta muutused automaatselt localStorage-sse
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favourites));
    } catch (err) {
      console.warn('localStorage salvestamine ebaõnnestus:', err);
    }
  }, [favourites]);

  /** Lisa lemmikuks */
  const addFavourite = (item) => {
    setFavourites((prev) => {
      if (prev.find((f) => f.id === item.id && f.media_type === item.media_type)) {
        return prev;
      }
      return [item, ...prev];
    });
  };

  /** Eemalda lemmikutest */
  const removeFavourite = (id, mediaType) => {
    setFavourites((prev) =>
      prev.filter((f) => !(f.id === id && f.media_type === mediaType))
    );
  };

  /** Kontrolli, kas on lemmik */
  const isFavourite = (id, mediaType) =>
    favourites.some((f) => f.id === id && f.media_type === mediaType);

  return (
    <FavouritesContext.Provider
      value={{ favourites, addFavourite, removeFavourite, isFavourite }}
    >
      {children}
    </FavouritesContext.Provider>
  );
}

/** Hook lemmikute kasutamiseks */
export function useFavourites() {
  const ctx = useContext(FavouritesContext);
  if (!ctx) throw new Error('useFavourites peab olema FavouritesProvider sees');
  return ctx;
}
