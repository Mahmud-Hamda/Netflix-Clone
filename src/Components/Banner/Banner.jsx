import { Check, Info, Play, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useMyList } from "../../context/useMyList";
import { usePlayer } from "../../context/usePlayer";
import bannerLogo from "../../assets/image/logo.png";
import { movieInstance } from "../../Utility/MovieInstance";
import requests from "../../Utility/requestUrls";
import styles from "./Banner.module.css";

const IMAGE_BASE = "https://image.tmdb.org/t/p/original";

function truncate(str, length) {
  if (!str) return "";
  return str.length > length ? `${str.slice(0, length)}...` : str;
}

export default function Banner() {
  const [movie, setMovie] = useState(null);
  const { has, toggle } = useMyList();
  const { openTrailer, openInfo } = usePlayer();
  const saved = movie ? has(movie) : false;

  useEffect(() => {
    const fetchBannerMovie = async () => {
      try {
        const { data } = await movieInstance.get(
          requests.fetchNetflixOriginals,
        );
        const withBackdrop = (data.results ?? []).filter(
          (item) => item.backdrop_path,
        );
        const pool = withBackdrop.length ? withBackdrop : data.results ?? [];
        if (!pool.length) return;
        setMovie(pool[Math.floor(Math.random() * pool.length)]);
      } catch {
        setMovie(null);
      }
    };

    fetchBannerMovie();
  }, []);

  return (
    <div
      className={styles.banner}
      style={
        movie?.backdrop_path
          ? {
              backgroundImage: `url(${IMAGE_BASE}${movie.backdrop_path})`,
            }
          : undefined
      }
    >
      <div className={styles.content}>
        {/* Netflix logo */}
        <img className={styles.logoImg} src={bannerLogo} alt="Netflix Logo" />

        {/* title */}
        <h1 className={styles.title}>{movie?.title || movie?.name || ""}</h1>

        {/* description */}
        <p className={styles.description}>{truncate(movie?.overview, 150)}</p>

        {/* button */}
        <div className={styles.buttonContainer}>
          <button
            type="button"
            className={styles.button}
            disabled={!movie}
            onClick={() => openTrailer(movie)}
          >
            <Play size={24} /> Play
          </button>
          <button
            type="button"
            className={`${styles.button} ${saved ? styles.listed : ""}`}
            disabled={!movie}
            onClick={() => toggle(movie)}
          >
            {saved ? <Check size={24} /> : <Plus size={24} />}
            {saved ? "In My List" : "My List"}
          </button>
          <button
            type="button"
            className={styles.button}
            disabled={!movie}
            onClick={() => openInfo(movie)}
          >
            <Info size={24} /> More Info
          </button>
        </div>
      </div>

      {/* fading effect */}
      <div className={styles.fadingEffect}></div>
    </div>
  );
}
