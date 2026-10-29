import { useEffect, useState } from "react";
import { getDisplayTitle, getMediaType, getTitleKey } from "../../utils/titles";
import { tmdbClient } from "../../services/tmdbClient";
import { buildTmdbPath, pickYouTubeVideo } from "../../services/tmdbService";
import { usePlayer } from "../../context/usePlayer";
import styles from "./TrailerModal.module.css";

/**
 * Renders the trailer dialog for the title opened with `openTrailer`. It
 * looks up the title's videos on TMDB and embeds the best YouTube match, or
 * shows a message when none exists. Renders nothing when no title is open.
 *
 * @returns {JSX.Element | null}
 */
export default function TrailerModal() {
  const { trailerTitle, closeTrailer } = usePlayer();
  const trailerKey = trailerTitle ? getTitleKey(trailerTitle) : "";
  const [loadedKey, setLoadedKey] = useState("");
  const [status, setStatus] = useState("loading");
  const [videoKey, setVideoKey] = useState("");
  // Results from a previous title stay in state until the new request settles.
  const viewStatus = loadedKey === trailerKey ? status : "loading";

  useEffect(() => {
    if (!trailerTitle) return undefined;

    let isCancelled = false;
    const requestKey = trailerKey;

    async function loadTrailer() {
      try {
        const mediaType = getMediaType(trailerTitle);
        const { data } = await tmdbClient.get(
          buildTmdbPath(`/${mediaType}/${trailerTitle.id}/videos`),
        );
        const video = pickYouTubeVideo(data.results);
        if (isCancelled) return;
        setLoadedKey(requestKey);
        if (!video) {
          setStatus("empty");
          return;
        }
        setVideoKey(video.key);
        setStatus("ready");
      } catch {
        if (!isCancelled) {
          setLoadedKey(requestKey);
          setStatus("error");
        }
      }
    }

    loadTrailer();
    return () => {
      isCancelled = true;
    };
  }, [trailerTitle, trailerKey]);

  if (!trailerTitle) return null;

  const displayTitle = getDisplayTitle(trailerTitle);

  return (
    <div className={styles.backdrop} onClick={closeTrailer}>
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-label={`${displayTitle} trailer`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.toolbar}>
          <h2 className={styles.title}>{displayTitle}</h2>
          <button type="button" className={styles.close} onClick={closeTrailer}>
            Close
          </button>
        </div>

        {viewStatus === "loading" && <p className={styles.message}>Loading trailer...</p>}
        {viewStatus === "empty" && (
          <p className={styles.message}>No trailer is available for this title.</p>
        )}
        {viewStatus === "error" && (
          <p className={styles.message}>The trailer could not be loaded.</p>
        )}
        {viewStatus === "ready" && (
          <div className={styles.frame}>
            <iframe
              title={`${displayTitle} trailer`}
              src={`https://www.youtube-nocookie.com/embed/${videoKey}?autoplay=1`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}
      </div>
    </div>
  );
}
