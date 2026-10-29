import { getDisplayTitle, getGenreNames } from "../../utils/titles";
import { useMyList } from "../../context/useMyList";
import { usePlayer } from "../../context/usePlayer";
import styles from "./TitleInfoModal.module.css";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w780";

/**
 * Renders the details dialog for the title opened with `openInfo`: artwork,
 * match score, overview, genres, and Play / My List actions. Clicking the
 * backdrop closes it. Renders nothing when no title is open.
 *
 * @returns {JSX.Element | null}
 */
export default function TitleInfoModal() {
  const { infoTitle, closeInfo, openTrailer } = usePlayer();
  const { isInList, toggleInList } = useMyList();

  if (!infoTitle) return null;

  const displayTitle = getDisplayTitle(infoTitle);
  const isSaved = isInList(infoTitle);
  const genreNames = getGenreNames(infoTitle, 4);
  const imagePath = infoTitle.backdrop_path || infoTitle.poster_path;
  const matchLabel = infoTitle.vote_average
    ? `${Math.round(infoTitle.vote_average * 10)}% match`
    : "";

  return (
    <div className={styles.backdrop} onClick={closeInfo}>
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-label={displayTitle}
        onClick={(event) => event.stopPropagation()}
      >
        {imagePath && (
          <img
            className={styles.image}
            src={`${IMAGE_BASE_URL}${imagePath}`}
            alt=""
          />
        )}
        <div className={styles.body}>
          <div className={styles.toolbar}>
            <h2 className={styles.title}>{displayTitle}</h2>
            <button type="button" className={styles.close} onClick={closeInfo}>
              Close
            </button>
          </div>
          {matchLabel && <p className={styles.match}>{matchLabel}</p>}
          <p className={styles.overview}>
            {infoTitle.overview || "No description is available for this title."}
          </p>
          {genreNames.length > 0 && (
            <p className={styles.genres}>{genreNames.join(" · ")}</p>
          )}
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.play}
              onClick={() => openTrailer(infoTitle)}
            >
              Play
            </button>
            <button
              type="button"
              className={styles.list}
              onClick={() => toggleInList(infoTitle)}
            >
              {isSaved ? "Remove from My List" : "Add to My List"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
