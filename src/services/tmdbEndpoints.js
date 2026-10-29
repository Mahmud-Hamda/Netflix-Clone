const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

/**
 * Ready-to-request TMDB list paths (relative to `tmdbClient`'s base URL)
 * for the browse rows and the home banner.
 */
const TMDB_ENDPOINTS = {
  trending: `/trending/all/week?api_key=${TMDB_API_KEY}&language=en-US`,
  netflixOriginals: `/discover/tv?api_key=${TMDB_API_KEY}&with_networks=213`,
  topRatedMovies: `/movie/top_rated?api_key=${TMDB_API_KEY}&language=en-US`,
  actionMovies: `/discover/movie?api_key=${TMDB_API_KEY}&with_genres=28`,
  comedyMovies: `/discover/movie?api_key=${TMDB_API_KEY}&with_genres=35`,
  horrorMovies: `/discover/movie?api_key=${TMDB_API_KEY}&with_genres=27`,
  romanceMovies: `/discover/movie?api_key=${TMDB_API_KEY}&with_genres=10749`,
  documentaries: `/discover/movie?api_key=${TMDB_API_KEY}&with_genres=99`,
};

export default TMDB_ENDPOINTS;
