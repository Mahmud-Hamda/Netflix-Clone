import { useCallback, useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import { usePlayer } from "../../context/usePlayer";
import { useProfile } from "../../context/useProfile";
import { listKey, titleOf, toListItem } from "../../Utility/titles";
import { fetchTrendingNotifications } from "../../Utility/tmdb";
import styles from "./Header.module.css";

const STORAGE_KEY = "netflix-clone-seen";
const POSTER_BASE = "https://image.tmdb.org/t/p/w92";

function readSeenMap() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    if (Array.isArray(parsed)) return { __legacy: parsed };
    if (parsed && typeof parsed === "object") return parsed;
  } catch {
    /* start with an empty seen map when storage cannot be read */
  }
  return {};
}

export default function NotificationMenu() {
  const { openInfo } = usePlayer();
  const { userId } = useProfile();
  const containerRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState([]);
  const [status, setStatus] = useState("loading");
  const [seenMap, setSeenMap] = useState(readSeenMap);

  const openRef = useRef(false);

  if (
    userId &&
    Array.isArray(seenMap.__legacy) &&
    seenMap[userId] === undefined
  ) {
    const legacy = seenMap.__legacy;
    setSeenMap((current) => {
      if (current[userId] !== undefined) return current;
      const next = { ...current, [userId]: legacy };
      delete next.__legacy;
      return next;
    });
  }

  const seen = userId && Array.isArray(seenMap[userId]) ? seenMap[userId] : [];

  const remember = useCallback((list) => {
    if (!userId) return;
    setSeenMap((current) => {
      const previous = Array.isArray(current[userId]) ? current[userId] : [];
      const merged = [
        ...new Set([...previous, ...list.map((note) => listKey(note))]),
      ].slice(-200);
      if (
        merged.length === previous.length &&
        merged.every((id, index) => id === previous[index])
      ) {
        return current;
      }
      const next = { ...current, [userId]: merged };
      delete next.__legacy;
      return next;
    });
  }, [userId]);

  useEffect(() => {
    const stored = { ...seenMap };
    delete stored.__legacy;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  }, [seenMap]);

  useEffect(() => {
    let cancelled = false;

    async function loadNotes() {
      try {
        const found = await fetchTrendingNotifications();
        if (cancelled) return;
        const items = found.map(toListItem);
        setNotes(items);
        setStatus("ready");
        if (openRef.current) remember(items);
      } catch {
        if (!cancelled) setStatus("error");
      }
    }

    loadNotes();
    return () => {
      cancelled = true;
    };
  }, [remember]);

  useEffect(() => {
    if (!open) return undefined;

    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        openRef.current = false;
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const unread = notes.filter((note) => !seen.includes(listKey(note))).length;

  return (
    <div className={styles.menuWrap} ref={containerRef}>
      <button
        type="button"
        className={styles.notificationButton}
        aria-label="Notifications"
        aria-expanded={open}
        onClick={() => {
          const next = !open;
          openRef.current = next;
          setOpen(next);
          if (next) remember(notes);
        }}
      >
        <Bell size={20} />
        {unread > 0 && <span className={styles.notificationCount}>{unread}</span>}
      </button>
      {open && (
        <div className={styles.panel}>
          <p className={styles.panelTitle}>New and trending</p>
          {status === "loading" && (
            <p className={styles.panelMessage}>Loading notifications...</p>
          )}
          {status === "error" && (
            <p className={styles.panelMessage}>
              Notifications could not be loaded.
            </p>
          )}
          {status === "ready" && notes.length === 0 && (
            <p className={styles.panelMessage}>No new titles right now.</p>
          )}
          {notes.map((note) => (
            <button
              key={listKey(note)}
              type="button"
              className={styles.resultButton}
              onClick={() => {
                openInfo(note);
                openRef.current = false;
                setOpen(false);
              }}
            >
              <img
                className={styles.resultPoster}
                src={`${POSTER_BASE}${note.poster_path}`}
                alt=""
              />
              <span>{titleOf(note)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
