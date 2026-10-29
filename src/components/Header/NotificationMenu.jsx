import { useCallback, useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import { usePlayer } from "../../context/usePlayer";
import { useProfile } from "../../context/useProfile";
import { getDisplayTitle, getTitleKey, normalizeTitle } from "../../utils/titles";
import { fetchTrendingNotifications } from "../../services/tmdbService";
import styles from "./Header.module.css";

const SEEN_STORAGE_KEY = "netflix-clone-seen";
// Older builds stored one shared array; it is kept under this field until the
// first account signs in and claims it.
const LEGACY_SEEN_FIELD = "__legacy";
const MAX_SEEN_KEYS = 200;
const POSTER_BASE_URL = "https://image.tmdb.org/t/p/w92";

/**
 * Reads the per-account record of notifications the user has already seen.
 *
 * @returns {Record<string, string[]>} Seen title keys keyed by account id.
 */
function readSeenMap() {
  try {
    const parsed = JSON.parse(localStorage.getItem(SEEN_STORAGE_KEY) || "{}");
    if (Array.isArray(parsed)) return { [LEGACY_SEEN_FIELD]: parsed };
    if (parsed && typeof parsed === "object") return parsed;
  } catch {
    /* start with an empty seen map when storage cannot be read */
  }
  return {};
}

/**
 * Renders the bell button with an unread count and a dropdown of today's
 * trending titles. Opening the dropdown marks every listed title as seen for
 * the signed-in account.
 *
 * @returns {JSX.Element}
 */
export default function NotificationMenu() {
  const { openInfo } = usePlayer();
  const { userId } = useProfile();
  const containerRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [status, setStatus] = useState("loading");
  const [seenMap, setSeenMap] = useState(readSeenMap);

  // Mirrors `isOpen` so the fetch effect can read it without re-running.
  const isOpenRef = useRef(false);

  if (
    userId &&
    Array.isArray(seenMap[LEGACY_SEEN_FIELD]) &&
    seenMap[userId] === undefined
  ) {
    const legacySeenKeys = seenMap[LEGACY_SEEN_FIELD];
    setSeenMap((currentSeenMap) => {
      if (currentSeenMap[userId] !== undefined) return currentSeenMap;
      const nextSeenMap = { ...currentSeenMap, [userId]: legacySeenKeys };
      delete nextSeenMap[LEGACY_SEEN_FIELD];
      return nextSeenMap;
    });
  }

  const seenKeys =
    userId && Array.isArray(seenMap[userId]) ? seenMap[userId] : [];

  const markAsSeen = useCallback(
    (titles) => {
      if (!userId) return;
      setSeenMap((currentSeenMap) => {
        const previousKeys = Array.isArray(currentSeenMap[userId])
          ? currentSeenMap[userId]
          : [];
        const mergedKeys = [
          ...new Set([...previousKeys, ...titles.map((title) => getTitleKey(title))]),
        ].slice(-MAX_SEEN_KEYS);
        if (
          mergedKeys.length === previousKeys.length &&
          mergedKeys.every((key, index) => key === previousKeys[index])
        ) {
          return currentSeenMap;
        }
        const nextSeenMap = { ...currentSeenMap, [userId]: mergedKeys };
        delete nextSeenMap[LEGACY_SEEN_FIELD];
        return nextSeenMap;
      });
    },
    [userId],
  );

  useEffect(() => {
    const storedSeenMap = { ...seenMap };
    delete storedSeenMap[LEGACY_SEEN_FIELD];
    localStorage.setItem(SEEN_STORAGE_KEY, JSON.stringify(storedSeenMap));
  }, [seenMap]);

  useEffect(() => {
    let isCancelled = false;

    async function loadNotifications() {
      try {
        const trendingTitles = await fetchTrendingNotifications();
        if (isCancelled) return;
        const normalizedTitles = trendingTitles.map(normalizeTitle);
        setNotifications(normalizedTitles);
        setStatus("ready");
        if (isOpenRef.current) markAsSeen(normalizedTitles);
      } catch {
        if (!isCancelled) setStatus("error");
      }
    }

    loadNotifications();
    return () => {
      isCancelled = true;
    };
  }, [markAsSeen]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        isOpenRef.current = false;
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const unreadCount = notifications.filter(
    (notification) => !seenKeys.includes(getTitleKey(notification)),
  ).length;

  const handleToggle = () => {
    const nextIsOpen = !isOpen;
    isOpenRef.current = nextIsOpen;
    setIsOpen(nextIsOpen);
    if (nextIsOpen) markAsSeen(notifications);
  };

  const handleNotificationClick = (notification) => {
    openInfo(notification);
    isOpenRef.current = false;
    setIsOpen(false);
  };

  return (
    <div className={styles.menuWrap} ref={containerRef}>
      <button
        type="button"
        className={styles.notificationButton}
        aria-label="Notifications"
        aria-expanded={isOpen}
        onClick={handleToggle}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className={styles.notificationCount}>{unreadCount}</span>
        )}
      </button>
      {isOpen && (
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
          {status === "ready" && notifications.length === 0 && (
            <p className={styles.panelMessage}>No new titles right now.</p>
          )}
          {notifications.map((notification) => (
            <button
              key={getTitleKey(notification)}
              type="button"
              className={styles.resultButton}
              onClick={() => handleNotificationClick(notification)}
            >
              <img
                className={styles.resultPoster}
                src={`${POSTER_BASE_URL}${notification.poster_path}`}
                alt=""
              />
              <span>{getDisplayTitle(notification)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
