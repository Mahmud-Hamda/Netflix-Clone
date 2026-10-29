import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import styles from "./Header.module.css";
import NotificationMenu from "./NotificationMenu";
import ProfileMenu from "./ProfileMenu";
import SearchBox from "./SearchBox";

const SCROLL_THRESHOLD_PX = 50;

/**
 * @param {{ isActive: boolean }} linkState - State passed by `NavLink`.
 * @returns {string} Class names for a primary navigation link.
 */
function getNavLinkClassName({ isActive }) {
  return `${styles.navLink} ${isActive ? styles.active : ""}`;
}

/**
 * Renders the fixed top bar with the logo, primary navigation, search,
 * notifications, and profile menu. Its background turns solid after the page
 * scrolls.
 *
 * @returns {JSX.Element}
 */
export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > SCROLL_THRESHOLD_PX);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ""}`}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link to="/">
            <img src={logo} alt="Netflix Logo" />
          </Link>
        </div>

        <nav className={styles.nav}>
          <NavLink className={getNavLinkClassName} to="/home">
            Home
          </NavLink>
          <NavLink className={getNavLinkClassName} to="/tv">
            Tv Shows
          </NavLink>
          <NavLink className={getNavLinkClassName} to="/movies">
            Movies
          </NavLink>
          <NavLink className={getNavLinkClassName} to="/news">
            New & Popular
          </NavLink>
          <NavLink className={getNavLinkClassName} to="/mylist">
            My List
          </NavLink>
        </nav>

        <div className={styles.actions}>
          <SearchBox />
          <NotificationMenu />
          <ProfileMenu />
        </div>
      </div>
    </header>
  );
}
