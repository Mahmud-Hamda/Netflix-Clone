import { useEffect, useMemo, useState } from "react";
import { movieInstance } from "../../Utility/MovieInstance";
import requests from "../../Utility/requestUrls";
import SlideShow from "../SlideShow/SlideShow";
import styles from "./DisplayRow.module.css";

const ROWS = {
  trending: { title: "Netflix Trending", request: requests.fetchTrending },
  popular: {
    title: "Popular on Netflix",
    request: requests.fetchNetflixOriginals,
  },
  topRated: { title: "Top Rated", request: requests.fetchTopRatedMovies },
  action: { title: "Action", request: requests.fetchActionMovies },
  comedy: { title: "Comedy", request: requests.fetchComedyMovies },
  horror: { title: "Horror", request: requests.fetchHorrorMovies },
  romance: { title: "Romance", request: requests.fetchRomanceMovies },
  documentaries: {
    title: "Documentaries",
    request: requests.fetchDocumentaries,
  },
};

const ALL_KEYS = Object.keys(ROWS);

function rowKeys({
  showPopularOnly,
  showActionOnly,
  showTrendingOnly,
  showTopRatedOnly,
}) {
  if (showPopularOnly) return ["popular"];
  if (showActionOnly) return ["action"];
  if (showTrendingOnly) return ["trending"];
  if (showTopRatedOnly) return ["topRated"];
  return ALL_KEYS;
}

export default function DisplayRow({
  showPopularOnly = false,
  showActionOnly = false,
  showTrendingOnly = false,
  showTopRatedOnly = false,
}) {
  const keys = useMemo(
    () =>
      rowKeys({
        showPopularOnly,
        showActionOnly,
        showTrendingOnly,
        showTopRatedOnly,
      }),
    [showPopularOnly, showActionOnly, showTrendingOnly, showTopRatedOnly],
  );
  const [rows, setRows] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadRows() {
      if (!import.meta.env.VITE_TMDB_API_KEY) {
        setError("Add VITE_TMDB_API_KEY before building this site.");
        return;
      }

      try {
        const results = await Promise.all(
          keys.map(async (key) => {
            const { data } = await movieInstance.get(ROWS[key].request);
            const movies = (data.results ?? []).filter(
              (movie) => movie.poster_path,
            );
            return [key, movies];
          }),
        );

        if (!cancelled) {
          setRows(Object.fromEntries(results));
          setError("");
        }
      } catch {
        if (!cancelled) {
          setError("Movies could not be loaded. Check the API key and try again.");
        }
      }
    }

    loadRows();
    return () => {
      cancelled = true;
    };
  }, [keys]);

  if (error) {
    return <p className={styles.error}>{error}</p>;
  }

  if (!rows) return null;

  return (
    <div className={styles.mainWrapper}>
      {keys.map((key) => (
        <SlideShow key={key} title={ROWS[key].title} movies={rows[key]} />
      ))}
    </div>
  );
}
