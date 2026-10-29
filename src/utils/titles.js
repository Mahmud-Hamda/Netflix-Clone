/** @typedef {import("../services/tmdbService").Title} Title */

/** TMDB genre ids (movie and TV) mapped to short display names. */
const GENRE_NAMES = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Sci-Fi",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
  10759: "Action & Adventure",
  10762: "Kids",
  10763: "News",
  10764: "Reality",
  10765: "Sci-Fi & Fantasy",
  10766: "Soap",
  10767: "Talk",
  10768: "War & Politics",
};

/**
 * Determines whether a title is a movie or a TV show. Falls back to checking
 * for a `title` field when TMDB omits `media_type` (discover and list endpoints).
 *
 * @param {Title | null | undefined} title
 * @returns {"movie" | "tv"}
 */
export function getMediaType(title) {
  if (title?.media_type === "movie" || title?.media_type === "tv") {
    return title.media_type;
  }
  return title?.title ? "movie" : "tv";
}

/**
 * Builds a key that is unique across movies and shows, e.g. `"movie-550"`.
 *
 * @param {Title | null | undefined} title
 * @returns {string}
 */
export function getTitleKey(title) {
  return `${getMediaType(title)}-${title?.id}`;
}

/**
 * Returns the name to show for a movie or TV show.
 *
 * @param {Title | null | undefined} title
 * @returns {string} The movie title, the show name, or `"Untitled"`.
 */
export function getDisplayTitle(title) {
  return title?.title || title?.name || "Untitled";
}

/**
 * Maps a title's genre ids to display names, skipping unknown ids.
 *
 * @param {Title | null | undefined} title
 * @param {number} [limit=3] - Maximum number of names to return.
 * @returns {string[]}
 */
export function getGenreNames(title, limit = 3) {
  return (title?.genre_ids ?? [])
    .map((genreId) => GENRE_NAMES[genreId])
    .filter(Boolean)
    .slice(0, limit);
}

/**
 * Copies only the fields the app uses, with defaults and an explicit
 * `media_type`, so the result is small enough to store in My List.
 *
 * @param {Title} title
 * @returns {Title}
 */
export function normalizeTitle(title) {
  return {
    id: title.id,
    title: title.title || "",
    name: title.name || "",
    overview: title.overview || "",
    poster_path: title.poster_path || "",
    backdrop_path: title.backdrop_path || "",
    media_type: getMediaType(title),
    genre_ids: title.genre_ids || [],
    vote_average: title.vote_average ?? null,
  };
}
