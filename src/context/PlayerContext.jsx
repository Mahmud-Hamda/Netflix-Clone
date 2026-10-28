import { useEffect, useMemo, useState } from "react";
import { toListItem } from "../Utility/titles";
import { PlayerContext } from "./usePlayer";

export function PlayerProvider({ children }) {
  const [info, setInfo] = useState(null);
  const [trailer, setTrailer] = useState(null);

  useEffect(() => {
    if (!info && !trailer) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event) => {
      if (event.key !== "Escape") return;
      if (trailer) setTrailer(null);
      else setInfo(null);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [info, trailer]);

  const value = useMemo(
    () => ({
      info,
      trailer,
      openInfo(movie) {
        setInfo(toListItem(movie));
      },
      openTrailer(movie) {
        setTrailer(toListItem(movie));
      },
      closeInfo() {
        setInfo(null);
      },
      closeTrailer() {
        setTrailer(null);
      },
    }),
    [info, trailer],
  );

  return (
    <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
  );
}
