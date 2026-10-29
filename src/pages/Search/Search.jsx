import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import BackToHomeLink from "../../components/BackToHomeLink/BackToHomeLink";
import TitleCard from "../../components/TitleCard/TitleCard";
import { searchTitles } from "../../services/tmdbService";
import styles from "./Search.module.css";

/**
 * Search results page (`/search?q=...`): shows every TMDB movie and show that
 * matches the `q` query parameter as a grid of title cards.
 *
 * @returns {JSX.Element}
 */
export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q")?.trim() || "";
  const [trackedQuery, setTrackedQuery] = useState(query);
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState(query ? "loading" : "idle");

  if (query !== trackedQuery) {
    setTrackedQuery(query);
    setResults([]);
    setStatus(query ? "loading" : "idle");
  }

  useEffect(() => {
    if (!query) return undefined;

    let isCancelled = false;

    async function loadResults() {
      try {
        const matches = await searchTitles(query);
        if (!isCancelled) {
          setResults(matches);
          setStatus("ready");
        }
      } catch {
        if (!isCancelled) setStatus("error");
      }
    }

    loadResults();
    return () => {
      isCancelled = true;
    };
  }, [query]);

  return (
    <div className={styles.page}>
      <BackToHomeLink />
      <h1 className={styles.heading}>
        {query ? `Results for “${query}”` : "Search"}
      </h1>
      {!query && <p className={styles.message}>Type a title in the search box.</p>}
      {status === "loading" && <p className={styles.message}>Searching...</p>}
      {status === "error" && (
        <p className={styles.message}>
          Search failed. Check the API key and try again.
        </p>
      )}
      {status === "ready" && results.length === 0 && (
        <p className={styles.message}>No titles matched that search.</p>
      )}
      {results.length > 0 && (
        <div className={styles.grid}>
          {results.map((result) => (
            <TitleCard key={`${result.media_type}-${result.id}`} title={result} />
          ))}
        </div>
      )}
    </div>
  );
}
