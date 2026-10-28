import { useEffect, useState } from "react";
import { listKey, mediaTypeOf, titleOf } from "../../Utility/titles";
import { movieInstance } from "../../Utility/MovieInstance";
import { pickYouTubeVideo, tmdbPath } from "../../Utility/tmdb";
import { usePlayer } from "../../context/usePlayer";
import styles from "./TrailerModal.module.css";

export default function TrailerModal() {
  const { trailer, closeTrailer } = usePlayer();
  const trailerKey = trailer ? listKey(trailer) : "";
  const [loadedKey, setLoadedKey] = useState("");
  const [status, setStatus] = useState("loading");
  const [videoKey, setVideoKey] = useState("");
  const viewStatus = loadedKey === trailerKey ? status : "loading";

  useEffect(() => {
    if (!trailer) return undefined;

    let cancelled = false;
    const key = trailerKey;

    async function loadTrailer() {
      try {
        const type = mediaTypeOf(trailer);
        const { data } = await movieInstance.get(
          tmdbPath(`/${type}/${trailer.id}/videos`),
        );
        const video = pickYouTubeVideo(data.results);
        if (cancelled) return;
        setLoadedKey(key);
        if (!video) {
          setStatus("empty");
          return;
        }
        setVideoKey(video.key);
        setStatus("ready");
      } catch {
        if (!cancelled) {
          setLoadedKey(key);
          setStatus("error");
        }
      }
    }

    loadTrailer();
    return () => {
      cancelled = true;
    };
  }, [trailer, trailerKey]);

  if (!trailer) return null;

  const title = titleOf(trailer);

  return (
    <div className={styles.backdrop} onClick={closeTrailer}>
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-label={`${title} trailer`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.toolbar}>
          <h2 className={styles.title}>{title}</h2>
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
              title={`${title} trailer`}
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
