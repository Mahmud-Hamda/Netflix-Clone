import { useId } from "react";
import { BsCheckLg, BsPlusCircle } from "react-icons/bs";
import { FaCirclePlay } from "react-icons/fa6";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { useMyList } from "../../context/useMyList";
import { usePlayer } from "../../context/usePlayer";
import { genreLabels, titleOf } from "../../Utility/titles";
import styles from "./Card.module.css";

const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

function IconAction({
  label,
  className,
  disabled,
  pressed,
  tipAlign,
  onClick,
  children,
}) {
  const tipId = useId();
  const classes = [
    styles.iconHit,
    disabled ? styles.iconDisabled : "",
    tipAlign === "start" ? styles.tipStart : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      className={classes}
      aria-label={label}
      aria-describedby={tipId}
      aria-disabled={disabled || undefined}
      aria-pressed={pressed}
      onClick={(event) => {
        event.stopPropagation();
        if (disabled) return;
        onClick();
      }}
    >
      {children}
      <span id={tipId} className={styles.tooltip} role="tooltip">
        {label}
      </span>
    </button>
  );
}

export default function Card({ movie }) {
  const { has, add, remove } = useMyList();
  const { openTrailer, openInfo } = usePlayer();
  const title = titleOf(movie);
  const genres = genreLabels(movie);
  const saved = has(movie);

  return (
    <div className={styles.card}>
      {/* poster image */}
      <div className={styles.posterWrap}>
        <img
          className={styles.cardImage}
          src={`${IMAGE_BASE}${movie?.poster_path}`}
          alt={title}
        />
      </div>

      {/* hover effect */}
      <div className={styles.hoverEffect}>
        {/* image for hover effect */}
        <img
          className={styles.hoverImage}
          src={`${IMAGE_BASE}${movie?.poster_path}`}
          alt=""
        />

        <div className={styles.hoverContent}>
          {/* badge for hover effect */}
          <div className={styles.hoverBadge}>Recently added</div>

          {/* buttons */}
          <div className={styles.buttonsRow}>
            <IconAction
              label="Play trailer"
              tipAlign="start"
              onClick={() => openTrailer(movie)}
            >
              <FaCirclePlay
                className={`${styles.hoverButton} ${styles.circleButton}`}
              />
            </IconAction>
            <IconAction
              label={saved ? "Already in My List" : "Add to My List"}
              disabled={saved}
              onClick={() => add(movie)}
            >
              <BsPlusCircle
                className={`${styles.hoverButton} ${styles.addButton} ${saved ? styles.dimmed : ""}`}
              />
            </IconAction>
            <IconAction
              label={saved ? "Remove from My List" : "Not in My List yet"}
              disabled={!saved}
              pressed={saved}
              onClick={() => remove(movie)}
            >
              <BsCheckLg
                className={`${styles.hoverButton} ${styles.circleButton} ${saved ? styles.inList : styles.dimmed}`}
              />
            </IconAction>
            <IconAction
              label="More info"
              className={styles.dropdownHit}
              onClick={() => openInfo(movie)}
            >
              <IoIosArrowDropdownCircle
                className={`${styles.hoverButton} ${styles.dropdownButton}`}
              />
            </IconAction>
          </div>

          {/* metadata */}
          <div className={styles.hoverMetadata}>
            <span className={styles.tag}>U/A 16+ </span>
            <span className={styles.tag}>Movies</span>
            <span className={styles.tag}>HD</span>
          </div>
        </div>

        {/* movies genres */}
        <div className={styles.hoverGenres}>
          {genres.map((genre, index) => (
            <span key={genre}>
              {genre}
              {index < genres.length - 1 && (
                <span className={styles.dot}>•</span>
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
