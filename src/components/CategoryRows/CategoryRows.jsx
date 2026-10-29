import { useEffect, useMemo, useState } from "react";
import { tmdbClient } from "../../services/tmdbClient";
import TMDB_ENDPOINTS from "../../services/tmdbEndpoints";
import { hasTmdbApiKey } from "../../services/tmdbService";
import TitleCarousel from "../TitleCarousel/TitleCarousel";
import styles from "./CategoryRows.module.css";

/** Browse categories in display order, each with its row heading and TMDB endpoint. */
const CATEGORIES = {
  trending: { heading: "Netflix Trending", endpoint: TMDB_ENDPOINTS.trending },
  popular: {
    heading: "Popular on Netflix",
    endpoint: TMDB_ENDPOINTS.netflixOriginals,
  },
  topRated: { heading: "Top Rated", endpoint: TMDB_ENDPOINTS.topRatedMovies },
  action: { heading: "Action", endpoint: TMDB_ENDPOINTS.actionMovies },
  comedy: { heading: "Comedy", endpoint: TMDB_ENDPOINTS.comedyMovies },
  horror: { heading: "Horror", endpoint: TMDB_ENDPOINTS.horrorMovies },
  romance: { heading: "Romance", endpoint: TMDB_ENDPOINTS.romanceMovies },
  documentaries: {
    heading: "Documentaries",
    endpoint: TMDB_ENDPOINTS.documentaries,
  },
};

const ALL_CATEGORY_KEYS = Object.keys(CATEGORIES);

/**
 * Picks which categories to show. The first `show...Only` flag that is set
 * wins; with no flags every category is shown.
 *
 * @param {Object} filters
 * @param {boolean} filters.showPopularOnly
 * @param {boolean} filters.showActionOnly
 * @param {boolean} filters.showTrendingOnly
 * @param {boolean} filters.showTopRatedOnly
 * @returns {string[]} Keys of `CATEGORIES` to render.
 */
function getVisibleCategoryKeys({
  showPopularOnly,
  showActionOnly,
  showTrendingOnly,
  showTopRatedOnly,
}) {
  if (showPopularOnly) return ["popular"];
  if (showActionOnly) return ["action"];
  if (showTrendingOnly) return ["trending"];
  if (showTopRatedOnly) return ["topRated"];
  return ALL_CATEGORY_KEYS;
}

/**
 * Fetches TMDB browse categories and renders one carousel per category.
 * Renders nothing while loading and an error message if any request fails.
 *
 * @param {Object} props
 * @param {boolean} [props.showPopularOnly=false] - Show only "Popular on Netflix".
 * @param {boolean} [props.showActionOnly=false] - Show only "Action".
 * @param {boolean} [props.showTrendingOnly=false] - Show only "Netflix Trending".
 * @param {boolean} [props.showTopRatedOnly=false] - Show only "Top Rated".
 * @returns {JSX.Element | null}
 */
export default function CategoryRows({
  showPopularOnly = false,
  showActionOnly = false,
  showTrendingOnly = false,
  showTopRatedOnly = false,
}) {
  const categoryKeys = useMemo(
    () =>
      getVisibleCategoryKeys({
        showPopularOnly,
        showActionOnly,
        showTrendingOnly,
        showTopRatedOnly,
      }),
    [showPopularOnly, showActionOnly, showTrendingOnly, showTopRatedOnly],
  );
  const [titlesByCategory, setTitlesByCategory] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let isCancelled = false;

    async function loadCategories() {
      if (!hasTmdbApiKey()) {
        setError("Add VITE_TMDB_API_KEY before building this site.");
        return;
      }

      try {
        const categoryEntries = await Promise.all(
          categoryKeys.map(async (categoryKey) => {
            const { data } = await tmdbClient.get(
              CATEGORIES[categoryKey].endpoint,
            );
            const titlesWithPosters = (data.results ?? []).filter(
              (title) => title.poster_path,
            );
            return [categoryKey, titlesWithPosters];
          }),
        );

        if (!isCancelled) {
          setTitlesByCategory(Object.fromEntries(categoryEntries));
          setError("");
        }
      } catch {
        if (!isCancelled) {
          setError("Movies could not be loaded. Check the API key and try again.");
        }
      }
    }

    loadCategories();
    return () => {
      isCancelled = true;
    };
  }, [categoryKeys]);

  if (error) {
    return <p className={styles.error}>{error}</p>;
  }

  if (!titlesByCategory) return null;

  return (
    <div className={styles.mainWrapper}>
      {categoryKeys.map((categoryKey) => (
        <TitleCarousel
          key={categoryKey}
          heading={CATEGORIES[categoryKey].heading}
          titles={titlesByCategory[categoryKey]}
        />
      ))}
    </div>
  );
}
