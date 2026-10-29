import { useEffect, useMemo, useState } from "react";
import { getTitleKey, normalizeTitle } from "../utils/titles";
import { useProfile } from "./useProfile";
import { MyListContext } from "./useMyList";

/** @typedef {import("../services/tmdbService").Title} Title */

const LISTS_STORAGE_KEY = "netflix-clone-lists";
// Single shared list from before lists were stored per account; it is moved
// into the first account that signs in.
const LEGACY_LIST_STORAGE_KEY = "netflix-clone-my-list";
const MAX_SAVED_TITLES = 100;
const EMPTY_LIST = [];

/**
 * @param {unknown} parsed - Parsed JSON that should be a list of titles.
 * @returns {Title[]} The entries that have an id, or an empty list.
 */
function filterValidTitles(parsed) {
  if (!Array.isArray(parsed)) return [];
  return parsed.filter((item) => item && item.id);
}

/**
 * Reads every account's saved list from storage.
 *
 * @returns {Record<string, Title[]>} Saved titles keyed by account id.
 */
function readStoredLists() {
  try {
    const parsed = JSON.parse(localStorage.getItem(LISTS_STORAGE_KEY) || "{}");
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }
    return Object.fromEntries(
      Object.entries(parsed).map(([userId, titles]) => [
        userId,
        filterValidTitles(titles),
      ]),
    );
  } catch {
    return {};
  }
}

/**
 * Reads the pre-account shared list, if one is still stored.
 *
 * @returns {Title[]}
 */
function readLegacyList() {
  try {
    return filterValidTitles(
      JSON.parse(localStorage.getItem(LEGACY_LIST_STORAGE_KEY) || "[]"),
    );
  } catch {
    return [];
  }
}

/**
 * Provides the signed-in account's My List and keeps every account's list in
 * local storage.
 *
 * @param {Object} props
 * @param {import("react").ReactNode} props.children
 * @returns {JSX.Element}
 */
export function MyListProvider({ children }) {
  const { userId } = useProfile();
  const [listsByUser, setListsByUser] = useState(readStoredLists);

  if (userId && listsByUser[userId] === undefined) {
    const legacyList = readLegacyList();
    setListsByUser((currentLists) => {
      if (currentLists[userId] !== undefined) return currentLists;
      return { ...currentLists, [userId]: legacyList };
    });
  }

  useEffect(() => {
    localStorage.setItem(LISTS_STORAGE_KEY, JSON.stringify(listsByUser));
    if (userId && Array.isArray(listsByUser[userId])) {
      localStorage.removeItem(LEGACY_LIST_STORAGE_KEY);
    }
  }, [listsByUser, userId]);

  const savedTitles = (userId && listsByUser[userId]) || EMPTY_LIST;

  const value = useMemo(() => {
    const isInList = (title) =>
      savedTitles.some((item) => getTitleKey(item) === getTitleKey(title));

    const addToList = (title) => {
      if (!userId) return;
      const item = normalizeTitle(title);
      setListsByUser((currentLists) => {
        const existing = currentLists[userId] ?? [];
        if (existing.some((entry) => getTitleKey(entry) === getTitleKey(item))) {
          return currentLists;
        }
        return {
          ...currentLists,
          [userId]: [item, ...existing].slice(0, MAX_SAVED_TITLES),
        };
      });
    };

    const removeFromList = (title) => {
      if (!userId) return;
      const titleKey = getTitleKey(title);
      setListsByUser((currentLists) => ({
        ...currentLists,
        [userId]: (currentLists[userId] ?? []).filter(
          (item) => getTitleKey(item) !== titleKey,
        ),
      }));
    };

    const toggleInList = (title) => {
      if (isInList(title)) removeFromList(title);
      else addToList(title);
    };

    return { savedTitles, isInList, addToList, removeFromList, toggleInList };
  }, [savedTitles, userId]);

  return (
    <MyListContext.Provider value={value}>{children}</MyListContext.Provider>
  );
}
