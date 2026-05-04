const API_KEY = import.meta.env.VITE_TMDB_API_KEY || 'YOUR_API_KEY_HERE';
const BASE_URL = 'https://api.themoviedb.org/3';
export const IMAGE_BASE = 'https://image.tmdb.org/t/p';

// Üldine fetch funktsioon koos veahaldusega
async function fetchTMDb(endpoint, params = {}) {
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set('api_key', API_KEY);
  url.searchParams.set('language', 'et-EE'); // Eesti keel esmane
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== '') {
      url.searchParams.set(key, val);
    }
  });

  const response = await fetch(url.toString());
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.status_message || `HTTP viga: ${response.status}`);
  }
  return response.json();
}


//FILMID
// Populaarsed filmid
export const getPopularMovies = (page = 1) =>
  fetchTMDb('/movie/popular', { page });

//Tipptaseme filmid (Top Rated)
export const getTopRatedMovies = (page = 1) =>
  fetchTMDb('/movie/top_rated', { page });

//Praegu kinodes
export const getNowPlayingMovies = (page = 1) =>
  fetchTMDb('/movie/now_playing', { page });

//Ühe filmi detailid
export const getMovieDetails = (id) =>
  fetchTMDb(`/movie/${id}`, { append_to_response: 'credits,videos,similar' });


//SARJAD
//Populaarsed sarjad
export const getPopularTV = (page = 1) =>
  fetchTMDb('/tv/popular', { page });

//Tipptaseme sarjad
export const getTopRatedTV = (page = 1) =>
  fetchTMDb('/tv/top_rated', { page });

//Ühe sarja detailid
export const getTVDetails = (id) =>
  fetchTMDb(`/tv/${id}`, { append_to_response: 'credits,videos,similar' });


//OTSING
/**
 * Otsib filme ja sarjasid
 * @param {string} query - otsingusõna
 * @param {number} page - lehekülje number
 */
export const searchMulti = (query, page = 1) =>
  fetchTMDb('/search/multi', { query, page });


//ŽANRID
export const getMovieGenres = () => fetchTMDb('/genre/movie/list');
export const getTVGenres = () => fetchTMDb('/genre/tv/list');


//PILDID
/**
 * Tagastab täispildi URL-i
 * @param {string} path - pildi tee TMDb-st
 * @param {'w185'|'w342'|'w500'|'w780'|'original'} size
 */
export const getImageUrl = (path, size = 'w500') => {
  if (!path) return null;
  return `${IMAGE_BASE}/${size}${path}`;
};
