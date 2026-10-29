import { createContext, useContext } from "react";

/** @typedef {import("../services/tmdbService").Title} Title */

/**
 * The signed-in account's saved titles and the actions that change them.
 *
 * @typedef {Object} MyListContextValue
 * @property {Title[]} savedTitles - Saved titles, newest first.
 * @property {(title: Title) => boolean} isInList - Whether the title is saved.
 * @property {(title: Title) => void} addToList - Saves the title if it is not saved yet.
 * @property {(title: Title) => void} removeFromList - Removes the title from the list.
 * @property {(title: Title) => void} toggleInList - Adds or removes the title.
 */

/** @type {import("react").Context<MyListContextValue | null>} */
export const MyListContext = createContext(null);

/**
 * Reads My List for the signed-in account.
 *
 * @returns {MyListContextValue}
 * @throws {Error} When called outside `MyListProvider`.
 */
export function useMyList() {
  const context = useContext(MyListContext);
  if (!context) {
    throw new Error("useMyList must be used within MyListProvider");
  }
  return context;
}
