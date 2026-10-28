import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { usePlayer } from "../../context/usePlayer";
import { titleOf } from "../../Utility/titles";
import { searchTitles } from "../../Utility/tmdb";
import styles from "./Header.module.css";

const POSTER_BASE = "https://image.tmdb.org/t/p/w92";

export default function SearchBox() {
  const navigate = useNavigate();
  const location = useLocation();
  const { openInfo } = usePlayer();
  const containerRef = useRef(null);
  const [showSearch, setShowSearch] = useState(false);
  const [openPath, setOpenPath] = useState(location.pathname);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState("");
  const term = query.trim();
  const activeTerm = showSearch ? term : "";
  const [requestedTerm, setRequestedTerm] = useState("");

  if (showSearch && openPath !== location.pathname) {
    setOpenPath(location.pathname);
    setShowSearch(false);
  }

  if (activeTerm !== requestedTerm) {
    setRequestedTerm(activeTerm);
    setResults([]);
    setStatus(activeTerm ? "loading" : "");
  }

  useEffect(() => {
    if (!showSearch) return undefined;

    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setShowSearch(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showSearch]);

  useEffect(() => {
    if (!requestedTerm) return undefined;

    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        const found = await searchTitles(requestedTerm);
        if (cancelled) return;
        setResults(found.slice(0, 6));
        setStatus(found.length ? "ready" : "empty");
      } catch {
        if (!cancelled) {
          setResults([]);
          setStatus("error");
        }
      }
    }, 350);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [requestedTerm]);

  const goToResults = (event) => {
    event.preventDefault();
    const term = query.trim();
    if (!term) return;
    setShowSearch(false);
    navigate(`/search?q=${encodeURIComponent(term)}`);
  };

  return (
    <div className={styles.searchContainer} ref={containerRef}>
      <button
        type="button"
        className={styles.searchButton}
        aria-label="Search"
        aria-expanded={showSearch}
        onClick={() => {
          setOpenPath(location.pathname);
          setShowSearch((open) => !open);
        }}
      >
        <Search size={20} />
      </button>
      {showSearch && (
        <form className={styles.searchForm} onSubmit={goToResults}>
          <input
            type="search"
            value={query}
            placeholder="Titles, people, genres"
            className={styles.searchInput}
            autoFocus
            autoComplete="off"
            onChange={(event) => setQuery(event.target.value)}
          />
          {query.trim() && (
            <div className={styles.panel}>
              {status === "loading" && (
                <p className={styles.panelMessage}>Searching...</p>
              )}
              {status === "error" && (
                <p className={styles.panelMessage}>
                  Search failed. Check the API key and try again.
                </p>
              )}
              {status === "empty" && (
                <p className={styles.panelMessage}>No titles matched.</p>
              )}
              {results.map((movie) => (
                <button
                  key={`${movie.media_type}-${movie.id}`}
                  type="button"
                  className={styles.resultButton}
                  onClick={() => openInfo(movie)}
                >
                  <img
                    className={styles.resultPoster}
                    src={`${POSTER_BASE}${movie.poster_path}`}
                    alt=""
                  />
                  <span>{titleOf(movie)}</span>
                </button>
              ))}
              {status === "ready" && (
                <Link
                  className={styles.seeAll}
                  to={`/search?q=${encodeURIComponent(query.trim())}`}
                  onClick={() => setShowSearch(false)}
                >
                  See all results
                </Link>
              )}
            </div>
          )}
        </form>
      )}
    </div>
  );
}
