import { useEffect, useMemo, useState } from "react";
import { normalizeTitle } from "../utils/titles";
import { PlayerContext } from "./usePlayer";

/**
 * Provides the open/closed state of the info and trailer dialogs. While either
 * dialog is open it locks page scrolling, and Escape closes the trailer first,
 * then the info dialog.
 *
 * @param {Object} props
 * @param {import("react").ReactNode} props.children
 * @returns {JSX.Element}
 */
export function PlayerProvider({ children }) {
  const [infoTitle, setInfoTitle] = useState(null);
  const [trailerTitle, setTrailerTitle] = useState(null);

  useEffect(() => {
    if (!infoTitle && !trailerTitle) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key !== "Escape") return;
      if (trailerTitle) setTrailerTitle(null);
      else setInfoTitle(null);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [infoTitle, trailerTitle]);

  const value = useMemo(
    () => ({
      infoTitle,
      trailerTitle,
      openInfo(title) {
        setInfoTitle(normalizeTitle(title));
      },
      openTrailer(title) {
        setTrailerTitle(normalizeTitle(title));
      },
      closeInfo() {
        setInfoTitle(null);
      },
      closeTrailer() {
        setTrailerTitle(null);
      },
    }),
    [infoTitle, trailerTitle],
  );

  return (
    <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
  );
}
