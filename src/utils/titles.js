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

export function mediaTypeOf(movie) {
  if (movie?.media_type === "movie" || movie?.media_type === "tv") {
    return movie.media_type;
  }
  return movie?.title ? "movie" : "tv";
}

export function listKey(movie) {
  return `${mediaTypeOf(movie)}-${movie?.id}`;
}

export function titleOf(movie) {
  return movie?.title || movie?.name || "Untitled";
}

export function genreLabels(movie, limit = 3) {
  return (movie?.genre_ids ?? [])
    .map((id) => GENRE_NAMES[id])
    .filter(Boolean)
    .slice(0, limit);
}

export function toListItem(movie) {
  return {
    id: movie.id,
    title: movie.title || "",
    name: movie.name || "",
    overview: movie.overview || "",
    poster_path: movie.poster_path || "",
    backdrop_path: movie.backdrop_path || "",
    media_type: mediaTypeOf(movie),
    genre_ids: movie.genre_ids || [],
    vote_average: movie.vote_average ?? null,
  };
}
