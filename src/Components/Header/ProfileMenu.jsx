import { useEffect, useRef, useState } from "react";
import { ChevronDown, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useProfile } from "../../context/useProfile";
import styles from "./Header.module.css";

export default function ProfileMenu() {
  const { name, email, signOut } = useProfile();
  const containerRef = useRef(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return undefined;

    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className={styles.profileContainer} ref={containerRef}>
      <button
        type="button"
        className={styles.profileButton}
        aria-label="Profile menu"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <div className={styles.userIcon}>
          <User size={20} />
        </div>
        <ChevronDown size={20} />
      </button>
      {open && (
        <div className={styles.profileDropdown}>
          <p className={styles.profileName}>{name}</p>
          <p className={styles.profileEmail}>{email}</p>
          <Link
            to="/account"
            className={styles.dropdownItem}
            onClick={() => setOpen(false)}
          >
            Account
          </Link>
          <Link
            to="/help"
            className={styles.dropdownItem}
            onClick={() => setOpen(false)}
          >
            Help Center
          </Link>
          <hr className={styles.dropdownDivider} />
          <button
            type="button"
            className={styles.dropdownItem}
            onClick={() => {
              setOpen(false);
              signOut();
            }}
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
