import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import BackHome from "../../Components/BackHome/BackHome";
import Card from "../../Components/Card/Card";
import { searchTitles } from "../../Utility/tmdb";
import styles from "./Search.module.css";

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

    let cancelled = false;

    async function load() {
      try {
        const found = await searchTitles(query);
        if (!cancelled) {
          setResults(found);
          setStatus("ready");
        }
      } catch {
        if (!cancelled) setStatus("error");
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [query]);

  return (
    <div className={styles.page}>
      <BackHome />
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
          {results.map((movie) => (
            <Card key={`${movie.media_type}-${movie.id}`} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}
