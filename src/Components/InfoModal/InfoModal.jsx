import { genreLabels, titleOf } from "../../Utility/titles";
import { useMyList } from "../../context/useMyList";
import { usePlayer } from "../../context/usePlayer";
import styles from "./InfoModal.module.css";

const IMAGE_BASE = "https://image.tmdb.org/t/p/w780";

export default function InfoModal() {
  const { info, closeInfo, openTrailer } = usePlayer();
  const { has, toggle } = useMyList();

  if (!info) return null;

  const title = titleOf(info);
  const saved = has(info);
  const genres = genreLabels(info, 4);
  const imagePath = info.backdrop_path || info.poster_path;
  const match = info.vote_average
    ? `${Math.round(info.vote_average * 10)}% match`
    : "";

  return (
    <div className={styles.backdrop} onClick={closeInfo}>
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
      >
        {imagePath && (
          <img
            className={styles.image}
            src={`${IMAGE_BASE}${imagePath}`}
            alt=""
          />
        )}
        <div className={styles.body}>
          <div className={styles.toolbar}>
            <h2 className={styles.title}>{title}</h2>
            <button type="button" className={styles.close} onClick={closeInfo}>
              Close
            </button>
          </div>
          {match && <p className={styles.match}>{match}</p>}
          <p className={styles.overview}>
            {info.overview || "No description is available for this title."}
          </p>
          {genres.length > 0 && (
            <p className={styles.genres}>{genres.join(" · ")}</p>
          )}
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.play}
              onClick={() => openTrailer(info)}
            >
              Play
            </button>
            <button
              type="button"
              className={styles.list}
              onClick={() => toggle(info)}
            >
              {saved ? "Remove from My List" : "Add to My List"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
