import { movieInstance } from "./MovieInstance";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export function hasApiKey() {
  return Boolean(API_KEY);
}

export function tmdbPath(path, params = {}) {
  const search = new URLSearchParams({
    api_key: API_KEY ?? "",
    language: "en-US",
  });

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      search.set(key, String(value));
    }
  });

  return `${path}?${search.toString()}`;
}

export async function searchTitles(query) {
  const { data } = await movieInstance.get(
    tmdbPath("/search/multi", { query, include_adult: "false" }),
  );

  return (data.results ?? []).filter(
    (item) =>
      item.poster_path &&
      (item.media_type === "movie" || item.media_type === "tv"),
  );
}

export async function fetchTrendingNotifications() {
  const { data } = await movieInstance.get(tmdbPath("/trending/all/day"));
  return (data.results ?? [])
    .filter(
      (item) =>
        item.poster_path &&
        (item.media_type === "movie" || item.media_type === "tv"),
    )
    .slice(0, 6);
}

export function pickYouTubeVideo(videos) {
  const youtube = (videos ?? []).filter(
    (video) => video.site === "YouTube" && video.key,
  );

  return (
    youtube.find((video) => video.type === "Trailer" && video.official) ||
    youtube.find((video) => video.type === "Trailer") ||
    youtube.find((video) => video.type === "Teaser") ||
    youtube[0] ||
    null
  );
}
