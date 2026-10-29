import { Check, Info, Play, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useMyList } from "../../context/useMyList";
import { usePlayer } from "../../context/usePlayer";
import bannerLogo from "../../assets/images/logo.png";
import { tmdbClient } from "../../services/tmdbClient";
import TMDB_ENDPOINTS from "../../services/tmdbEndpoints";
import styles from "./Banner.module.css";

const BACKDROP_BASE_URL = "https://image.tmdb.org/t/p/original";
const MAX_OVERVIEW_LENGTH = 150;

/**
 * Shortens text to `maxLength` characters, adding an ellipsis when cut.
 *
 * @param {string | undefined} text
 * @param {number} maxLength
 * @returns {string}
 */
function truncateText(text, maxLength) {
  if (!text) return "";
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
}

/**
 * Renders the home page hero with a random Netflix original as the backdrop,
 * plus Play, My List, and More Info actions for it.
 *
 * @returns {JSX.Element}
 */
export default function Banner() {
  const [featuredTitle, setFeaturedTitle] = useState(null);
  const { isInList, toggleInList } = useMyList();
  const { openTrailer, openInfo } = usePlayer();
  const isSaved = featuredTitle ? isInList(featuredTitle) : false;

  useEffect(() => {
    const fetchFeaturedTitle = async () => {
      try {
        const { data } = await tmdbClient.get(TMDB_ENDPOINTS.netflixOriginals);
        const withBackdrop = (data.results ?? []).filter(
          (item) => item.backdrop_path,
        );
        const candidates = withBackdrop.length
          ? withBackdrop
          : data.results ?? [];
        if (!candidates.length) return;
        setFeaturedTitle(
          candidates[Math.floor(Math.random() * candidates.length)],
        );
      } catch {
        setFeaturedTitle(null);
      }
    };

    fetchFeaturedTitle();
  }, []);

  return (
    <div
      className={styles.banner}
      style={
        featuredTitle?.backdrop_path
          ? {
              backgroundImage: `url(${BACKDROP_BASE_URL}${featuredTitle.backdrop_path})`,
            }
          : undefined
      }
    >
      <div className={styles.content}>
        <img className={styles.logoImg} src={bannerLogo} alt="Netflix Logo" />

        <h1 className={styles.title}>
          {featuredTitle?.title || featuredTitle?.name || ""}
        </h1>

        <p className={styles.description}>
          {truncateText(featuredTitle?.overview, MAX_OVERVIEW_LENGTH)}
        </p>

        <div className={styles.buttonContainer}>
          <button
            type="button"
            className={styles.button}
            disabled={!featuredTitle}
            onClick={() => openTrailer(featuredTitle)}
          >
            <Play size={24} /> Play
          </button>
          <button
            type="button"
            className={`${styles.button} ${isSaved ? styles.listed : ""}`}
            disabled={!featuredTitle}
            onClick={() => toggleInList(featuredTitle)}
          >
            {isSaved ? <Check size={24} /> : <Plus size={24} />}
            {isSaved ? "In My List" : "My List"}
          </button>
          <button
            type="button"
            className={styles.button}
            disabled={!featuredTitle}
            onClick={() => openInfo(featuredTitle)}
          >
            <Info size={24} /> More Info
          </button>
        </div>
      </div>

      <div className={styles.fadingEffect}></div>
    </div>
  );
}
