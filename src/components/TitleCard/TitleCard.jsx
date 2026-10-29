import { useId } from "react";
import { BsCheckLg, BsPlusCircle } from "react-icons/bs";
import { FaCirclePlay } from "react-icons/fa6";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { useMyList } from "../../context/useMyList";
import { usePlayer } from "../../context/usePlayer";
import { getDisplayTitle, getGenreNames } from "../../utils/titles";
import styles from "./TitleCard.module.css";

const POSTER_BASE_URL = "https://image.tmdb.org/t/p/w500";

/**
 * Renders an icon button with a tooltip. A disabled button stays focusable
 * (it uses `aria-disabled`) so its tooltip can still explain why.
 *
 * @param {Object} props
 * @param {string} props.label - Accessible name, also shown as the tooltip.
 * @param {string} [props.className] - Extra class for the button.
 * @param {boolean} [props.isDisabled] - Ignores clicks and dims the button.
 * @param {boolean} [props.isPressed] - Sets `aria-pressed` for toggle buttons.
 * @param {"start"} [props.tooltipAlign] - Aligns the tooltip to the button's start edge.
 * @param {() => void} props.onClick - Called on click unless disabled.
 * @param {import("react").ReactNode} props.children - The icon.
 * @returns {JSX.Element}
 */
function IconActionButton({
  label,
  className,
  isDisabled,
  isPressed,
  tooltipAlign,
  onClick,
  children,
}) {
  const tooltipId = useId();
  const buttonClassName = [
    styles.iconHit,
    isDisabled ? styles.iconDisabled : "",
    tooltipAlign === "start" ? styles.tipStart : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      className={buttonClassName}
      aria-label={label}
      aria-describedby={tooltipId}
      aria-disabled={isDisabled || undefined}
      aria-pressed={isPressed}
      onClick={(event) => {
        event.stopPropagation();
        if (isDisabled) return;
        onClick();
      }}
    >
      {children}
      <span id={tooltipId} className={styles.tooltip} role="tooltip">
        {label}
      </span>
    </button>
  );
}

/**
 * Renders a poster card that expands on hover to show play, My List, and
 * more-info actions plus the title's genres.
 *
 * @param {Object} props
 * @param {import("../../services/tmdbService").Title} props.title - The movie or show to display.
 * @returns {JSX.Element}
 */
export default function TitleCard({ title }) {
  const { isInList, addToList, removeFromList } = useMyList();
  const { openTrailer, openInfo } = usePlayer();
  const displayTitle = getDisplayTitle(title);
  const genreNames = getGenreNames(title);
  const isSaved = isInList(title);

  return (
    <div className={styles.card}>
      <div className={styles.posterWrap}>
        <img
          className={styles.cardImage}
          src={`${POSTER_BASE_URL}${title?.poster_path}`}
          alt={displayTitle}
        />
      </div>

      <div className={styles.hoverEffect}>
        <img
          className={styles.hoverImage}
          src={`${POSTER_BASE_URL}${title?.poster_path}`}
          alt=""
        />

        <div className={styles.hoverContent}>
          <div className={styles.hoverBadge}>Recently added</div>

          <div className={styles.buttonsRow}>
            <IconActionButton
              label="Play trailer"
              tooltipAlign="start"
              onClick={() => openTrailer(title)}
            >
              <FaCirclePlay
                className={`${styles.hoverButton} ${styles.circleButton}`}
              />
            </IconActionButton>
            <IconActionButton
              label={isSaved ? "Already in My List" : "Add to My List"}
              isDisabled={isSaved}
              onClick={() => addToList(title)}
            >
              <BsPlusCircle
                className={`${styles.hoverButton} ${styles.addButton} ${isSaved ? styles.dimmed : ""}`}
              />
            </IconActionButton>
            <IconActionButton
              label={isSaved ? "Remove from My List" : "Not in My List yet"}
              isDisabled={!isSaved}
              isPressed={isSaved}
              onClick={() => removeFromList(title)}
            >
              <BsCheckLg
                className={`${styles.hoverButton} ${styles.circleButton} ${isSaved ? styles.inList : styles.dimmed}`}
              />
            </IconActionButton>
            <IconActionButton
              label="More info"
              className={styles.dropdownHit}
              onClick={() => openInfo(title)}
            >
              <IoIosArrowDropdownCircle
                className={`${styles.hoverButton} ${styles.dropdownButton}`}
              />
            </IconActionButton>
          </div>

          <div className={styles.hoverMetadata}>
            <span className={styles.tag}>U/A 16+ </span>
            <span className={styles.tag}>Movies</span>
            <span className={styles.tag}>HD</span>
          </div>
        </div>

        <div className={styles.hoverGenres}>
          {genreNames.map((genreName, index) => (
            <span key={genreName}>
              {genreName}
              {index < genreNames.length - 1 && (
                <span className={styles.dot}>•</span>
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
