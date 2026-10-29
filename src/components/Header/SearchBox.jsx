import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { usePlayer } from "../../context/usePlayer";
import { getDisplayTitle } from "../../utils/titles";
import { searchTitles } from "../../services/tmdbService";
import styles from "./Header.module.css";

const POSTER_BASE_URL = "https://image.tmdb.org/t/p/w92";
const SEARCH_DEBOUNCE_MS = 350;
const MAX_PREVIEW_RESULTS = 6;

/**
 * Renders the header search toggle. When open it shows an input with a
 * debounced preview of up to six matches; submitting goes to the full
 * `/search` page. It closes on route change and on clicks outside.
 *
 * @returns {JSX.Element}
 */
export default function SearchBox() {
  const navigate = useNavigate();
  const location = useLocation();
  const { openInfo } = usePlayer();
  const containerRef = useRef(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [openedAtPath, setOpenedAtPath] = useState(location.pathname);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState("");
  const trimmedQuery = query.trim();
  const activeTerm = isSearchOpen ? trimmedQuery : "";
  const [requestedTerm, setRequestedTerm] = useState("");

  if (isSearchOpen && openedAtPath !== location.pathname) {
    setOpenedAtPath(location.pathname);
    setIsSearchOpen(false);
  }

  if (activeTerm !== requestedTerm) {
    setRequestedTerm(activeTerm);
    setResults([]);
    setStatus(activeTerm ? "loading" : "");
  }

  useEffect(() => {
    if (!isSearchOpen) return undefined;

    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSearchOpen]);

  useEffect(() => {
    if (!requestedTerm) return undefined;

    let isCancelled = false;
    const debounceTimer = setTimeout(async () => {
      try {
        const matches = await searchTitles(requestedTerm);
        if (isCancelled) return;
        setResults(matches.slice(0, MAX_PREVIEW_RESULTS));
        setStatus(matches.length ? "ready" : "empty");
      } catch {
        if (!isCancelled) {
          setResults([]);
          setStatus("error");
        }
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      isCancelled = true;
      clearTimeout(debounceTimer);
    };
  }, [requestedTerm]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!trimmedQuery) return;
    setIsSearchOpen(false);
    navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`);
  };

  const handleToggle = () => {
    setOpenedAtPath(location.pathname);
    setIsSearchOpen((wasOpen) => !wasOpen);
  };

  return (
    <div className={styles.searchContainer} ref={containerRef}>
      <button
        type="button"
        className={styles.searchButton}
        aria-label="Search"
        aria-expanded={isSearchOpen}
        onClick={handleToggle}
      >
        <Search size={20} />
      </button>
      {isSearchOpen && (
        <form className={styles.searchForm} onSubmit={handleSubmit}>
          <input
            type="search"
            value={query}
            placeholder="Titles, people, genres"
            className={styles.searchInput}
            autoFocus
            autoComplete="off"
            onChange={(event) => setQuery(event.target.value)}
          />
          {trimmedQuery && (
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
              {results.map((result) => (
                <button
                  key={`${result.media_type}-${result.id}`}
                  type="button"
                  className={styles.resultButton}
                  onClick={() => openInfo(result)}
                >
                  <img
                    className={styles.resultPoster}
                    src={`${POSTER_BASE_URL}${result.poster_path}`}
                    alt=""
                  />
                  <span>{getDisplayTitle(result)}</span>
                </button>
              ))}
              {status === "ready" && (
                <Link
                  className={styles.seeAll}
                  to={`/search?q=${encodeURIComponent(trimmedQuery)}`}
                  onClick={() => setIsSearchOpen(false)}
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
