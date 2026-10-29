import { tmdbClient } from "./tmdbClient";

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const MAX_NOTIFICATIONS = 6;

/**
 * A movie or TV show from a TMDB list, search, or trending response, or the
 * trimmed copy produced by `normalizeTitle`.
 *
 * @typedef {Object} Title
 * @property {number} id - TMDB id, unique only within its media type.
 * @property {string} [title] - Movie title (movies only).
 * @property {string} [name] - Show name (TV only).
 * @property {string} [overview] - Plot summary.
 * @property {string|null} [poster_path] - Poster path to append to a TMDB image base URL.
 * @property {string|null} [backdrop_path] - Backdrop path to append to a TMDB image base URL.
 * @property {string} [media_type] - `"movie"` or `"tv"` (also `"person"` in multi-search results).
 * @property {number[]} [genre_ids] - TMDB genre ids.
 * @property {number|null} [vote_average] - Average rating from 0 to 10.
 */

/**
 * A video entry from TMDB's `/{media_type}/{id}/videos` endpoint.
 *
 * @typedef {Object} TmdbVideo
 * @property {string} key - Provider-specific id (the YouTube video id for YouTube).
 * @property {string} site - Hosting provider, e.g. `"YouTube"`.
 * @property {string} type - Video type, e.g. `"Trailer"` or `"Teaser"`.
 * @property {boolean} [official] - Whether the studio published the video.
 */

/**
 * Reports whether a TMDB API key was provided at build time.
 *
 * @returns {boolean}
 */
export function hasTmdbApiKey() {
  return Boolean(TMDB_API_KEY);
}

/**
 * Builds a TMDB request path with the API key, `language=en-US`, and any
 * extra query parameters. Empty, `null`, and `undefined` values are skipped.
 *
 * @param {string} path - API path such as `"/search/multi"`.
 * @param {Record<string, string|number|boolean|null|undefined>} [params] - Extra query parameters.
 * @returns {string} The path with its query string, relative to `tmdbClient`'s base URL.
 */
export function buildTmdbPath(path, params = {}) {
  const searchParams = new URLSearchParams({
    api_key: TMDB_API_KEY ?? "",
    language: "en-US",
  });

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value));
    }
  });

  return `${path}?${searchParams.toString()}`;
}

/**
 * Reports whether a TMDB result is a movie or show that has a poster.
 *
 * @param {Title} item
 * @returns {boolean}
 */
function isDisplayableTitle(item) {
  return Boolean(
    item.poster_path &&
      (item.media_type === "movie" || item.media_type === "tv"),
  );
}

/**
 * Searches TMDB for movies and shows matching a query.
 *
 * @param {string} query - Free-text search term.
 * @returns {Promise<Title[]>} Matching movies and shows that have a poster.
 */
export async function searchTitles(query) {
  const { data } = await tmdbClient.get(
    buildTmdbPath("/search/multi", { query, include_adult: "false" }),
  );

  return (data.results ?? []).filter(isDisplayableTitle);
}

/**
 * Fetches today's trending movies and shows for the header notifications.
 *
 * @returns {Promise<Title[]>} Up to six trending titles that have a poster.
 */
export async function fetchTrendingNotifications() {
  const { data } = await tmdbClient.get(buildTmdbPath("/trending/all/day"));
  return (data.results ?? [])
    .filter(isDisplayableTitle)
    .slice(0, MAX_NOTIFICATIONS);
}

/**
 * Chooses the best YouTube video to play as a trailer, preferring an
 * official trailer, then any trailer, then a teaser, then any YouTube video.
 *
 * @param {TmdbVideo[] | undefined} videos - Videos returned by TMDB.
 * @returns {TmdbVideo | null} The chosen video, or `null` when none is on YouTube.
 */
export function pickYouTubeVideo(videos) {
  const youtubeVideos = (videos ?? []).filter(
    (video) => video.site === "YouTube" && video.key,
  );

  return (
    youtubeVideos.find((video) => video.type === "Trailer" && video.official) ||
    youtubeVideos.find((video) => video.type === "Trailer") ||
    youtubeVideos.find((video) => video.type === "Teaser") ||
    youtubeVideos[0] ||
    null
  );
}
