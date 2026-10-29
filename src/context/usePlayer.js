import { createContext, useContext } from "react";

/** @typedef {import("../services/tmdbService").Title} Title */

/**
 * Which title the info dialog and trailer dialog are showing, and the actions
 * that open and close them.
 *
 * @typedef {Object} PlayerContextValue
 * @property {Title | null} infoTitle - Title shown in the info dialog, or `null` when closed.
 * @property {Title | null} trailerTitle - Title whose trailer is playing, or `null` when closed.
 * @property {(title: Title) => void} openInfo - Opens the info dialog for a title.
 * @property {(title: Title) => void} openTrailer - Opens the trailer dialog for a title.
 * @property {() => void} closeInfo - Closes the info dialog.
 * @property {() => void} closeTrailer - Closes the trailer dialog.
 */

/** @type {import("react").Context<PlayerContextValue | null>} */
export const PlayerContext = createContext(null);

/**
 * Reads and controls the info and trailer dialogs.
 *
 * @returns {PlayerContextValue}
 * @throws {Error} When called outside `PlayerProvider`.
 */
export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer must be used within PlayerProvider");
  }
  return context;
}
