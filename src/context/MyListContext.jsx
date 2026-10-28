import { useEffect, useMemo, useState } from "react";
import { listKey, toListItem } from "../Utility/titles";
import { useProfile } from "./useProfile";
import { MyListContext } from "./useMyList";

const STORAGE_KEY = "netflix-clone-lists";
const LEGACY_KEY = "netflix-clone-my-list";
const EMPTY_LIST = [];

function validItems(parsed) {
  if (!Array.isArray(parsed)) return [];
  return parsed.filter((item) => item && item.id);
}

function readLists() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }
    return Object.fromEntries(
      Object.entries(parsed).map(([userId, items]) => [userId, validItems(items)]),
    );
  } catch {
    return {};
  }
}

function readLegacyList() {
  try {
    return validItems(JSON.parse(localStorage.getItem(LEGACY_KEY) || "[]"));
  } catch {
    return [];
  }
}

export function MyListProvider({ children }) {
  const { userId } = useProfile();
  const [lists, setLists] = useState(readLists);

  if (userId && lists[userId] === undefined) {
    const legacy = readLegacyList();
    setLists((current) => {
      if (current[userId] !== undefined) return current;
      return { ...current, [userId]: legacy };
    });
  }

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
    if (userId && Array.isArray(lists[userId])) {
      localStorage.removeItem(LEGACY_KEY);
    }
  }, [lists, userId]);

  const items = (userId && lists[userId]) || EMPTY_LIST;

  const value = useMemo(() => {
    const has = (movie) =>
      items.some((item) => listKey(item) === listKey(movie));

    const add = (movie) => {
      if (!userId) return;
      const item = toListItem(movie);
      setLists((current) => {
        const existing = current[userId] ?? [];
        if (existing.some((entry) => listKey(entry) === listKey(item))) {
          return current;
        }
        return {
          ...current,
          [userId]: [item, ...existing].slice(0, 100),
        };
      });
    };

    const remove = (movie) => {
      if (!userId) return;
      const key = listKey(movie);
      setLists((current) => ({
        ...current,
        [userId]: (current[userId] ?? []).filter((item) => listKey(item) !== key),
      }));
    };

    const toggle = (movie) => {
      if (has(movie)) remove(movie);
      else add(movie);
    };

    return { items, has, add, remove, toggle };
  }, [items, userId]);

  return (
    <MyListContext.Provider value={value}>{children}</MyListContext.Provider>
  );
}
