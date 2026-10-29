import { useEffect, useRef, useState } from "react";
import { ChevronDown, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useProfile } from "../../context/useProfile";
import styles from "./Header.module.css";

/**
 * Renders the avatar button and its dropdown with the account name and email,
 * Account and Help Center links, and Sign Out. Clicking outside closes it.
 *
 * @returns {JSX.Element}
 */
export default function ProfileMenu() {
  const { name, email, signOut } = useProfile();
  const containerRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  const handleSignOut = () => {
    setIsOpen(false);
    signOut();
  };

  return (
    <div className={styles.profileContainer} ref={containerRef}>
      <button
        type="button"
        className={styles.profileButton}
        aria-label="Profile menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((wasOpen) => !wasOpen)}
      >
        <div className={styles.userIcon}>
          <User size={20} />
        </div>
        <ChevronDown size={20} />
      </button>
      {isOpen && (
        <div className={styles.profileDropdown}>
          <p className={styles.profileName}>{name}</p>
          <p className={styles.profileEmail}>{email}</p>
          <Link
            to="/account"
            className={styles.dropdownItem}
            onClick={closeMenu}
          >
            Account
          </Link>
          <Link
            to="/help"
            className={styles.dropdownItem}
            onClick={closeMenu}
          >
            Help Center
          </Link>
          <hr className={styles.dropdownDivider} />
          <button
            type="button"
            className={styles.dropdownItem}
            onClick={handleSignOut}
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
