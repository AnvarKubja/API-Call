const API_KEY = import.meta.env.VITE_TMDB_API_KEY || 'YOUR_API_KEY_HERE';
const BASE_URL = 'https://api.themoviedb.org/3';
export const IMAGE_BASE = 'https://image.tmdb.org/t/p';
export const PAGE_SIZE = 24;

const TMDB_PAGE_SIZE = 20;
const MAX_TMDB_PAGE = 500;
const resultPageCache = new Map();

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

async function fetchFixedResultPage(endpoint, { page = 1, params = {}, prepareItem = item => item, filterItem = () => true } = {}) {
  const safePage = Math.max(1, page);
  const wantedCount = safePage * PAGE_SIZE;
  const cacheKey = JSON.stringify({ endpoint, params });

  if (!resultPageCache.has(cacheKey)) {
    resultPageCache.set(cacheKey, {
      results: [],
      nextApiPage: 1,
      totalPages: 1,
      totalResults: 0,
      lastResponse: null,
    });
  }

  const cache = resultPageCache.get(cacheKey);

  while (cache.results.length < wantedCount && cache.nextApiPage <= Math.min(cache.totalPages || MAX_TMDB_PAGE, MAX_TMDB_PAGE)) {
    const response = await fetchTMDb(endpoint, { ...params, page: cache.nextApiPage });
    cache.lastResponse = response;
    cache.totalPages = response.total_pages || cache.totalPages;
    cache.totalResults = response.total_results || cache.totalResults;
    cache.nextApiPage += 1;

    const items = (response.results || [])
      .map(prepareItem)
      .filter(filterItem);

    cache.results.push(...items);

    if (!response.results?.length) break;
  }

  const start = (safePage - 1) * PAGE_SIZE;
  const totalRawResults = cache.totalResults || cache.totalPages * TMDB_PAGE_SIZE;

  return {
    ...(cache.lastResponse || {}),
    page: safePage,
    results: cache.results.slice(start, start + PAGE_SIZE),
    total_pages: Math.max(1, Math.ceil(totalRawResults / PAGE_SIZE)),
  };
}


//FILMID
// Populaarsed filmid
export const getPopularMovies = (page = 1) =>
  fetchFixedResultPage('/movie/popular', {
    page,
    prepareItem: item => ({ ...item, media_type: 'movie' }),
    filterItem: item => onLadinaTekst(getMediaTitle(item)),
  });

//Tipptaseme filmid (Top Rated)
export const getTopRatedMovies = (page = 1) =>
  fetchFixedResultPage('/movie/top_rated', {
    page,
    prepareItem: item => ({ ...item, media_type: 'movie' }),
    filterItem: item => onLadinaTekst(getMediaTitle(item)),
  });

//Praegu kinodes
export const getNowPlayingMovies = (page = 1) =>
  fetchFixedResultPage('/movie/now_playing', {
    page,
    prepareItem: item => ({ ...item, media_type: 'movie' }),
    filterItem: item => onLadinaTekst(getMediaTitle(item)),
  });

//Ühe filmi detailid
export const getMovieDetails = (id) =>
  fetchTMDb(`/movie/${id}`, { append_to_response: 'credits,videos,similar' });


//SARJAD
//Populaarsed sarjad
export const getPopularTV = (page = 1) =>
  fetchFixedResultPage('/tv/popular', {
    page,
    prepareItem: item => ({ ...item, media_type: 'tv' }),
    filterItem: item => onLadinaTekst(getMediaTitle(item)),
  });

//Tipptaseme sarjad
export const getTopRatedTV = (page = 1) =>
  fetchFixedResultPage('/tv/top_rated', {
    page,
    prepareItem: item => ({ ...item, media_type: 'tv' }),
    filterItem: item => onLadinaTekst(getMediaTitle(item)),
  });

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
  fetchFixedResultPage('/search/multi', {
    page,
    params: { query },
    filterItem: item =>
      (item.media_type === 'movie' || item.media_type === 'tv') &&
      onLadinaTekst(getMediaTitle(item)),
  });


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

export const getMediaTitle = (item) =>
  item?.original_title || item?.original_name || item?.title || item?.name || '';


// Kontrollib kas tekst sisaldab ainult ladina/lääne tähemärke
// Eemaldab hieroglüüfid, kirillitsa, araabia, jaapani jne
const LADINA_REGEX = /^[^\u0400-\u04FF\u0600-\u06FF\u0900-\u097F\u4E00-\u9FFF\u3040-\u309F\u30A0-\u30FF\uAC00-\uD7AF\u0E00-\u0E7F]+$/;

export const onLadinaTekst = (tekst) => {
  if (!tekst) return false;
  return LADINA_REGEX.test(tekst);
};
