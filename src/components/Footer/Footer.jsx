import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.socialRow} aria-label="Social media links">
          <a href="#" aria-label="Facebook" className={styles.socialLink}>
            <FaFacebookF aria-hidden="true" />
          </a>
          <a href="#" aria-label="Instagram" className={styles.socialLink}>
            <FaInstagram aria-hidden="true" />
          </a>
          <a href="#" aria-label="Twitter" className={styles.socialLink}>
            <FaTwitter aria-hidden="true" />
          </a>
          <a href="#" aria-label="YouTube" className={styles.socialLink}>
            <FaYoutube aria-hidden="true" />
          </a>
        </div>

        <nav className={styles.linksGrid} aria-label="Footer links">
          <a href="#">Audio Description</a>
          <a href="#">Help Centre</a>
          <a href="#">Gift Cards</a>
          <a href="#">Media Centre</a>

          <a href="#">Investor Relations</a>
          <a href="#">Jobs</a>
          <a href="#">Terms of Use</a>
          <a href="#">Privacy</a>

          <a href="#">Legal Notices</a>
          <a href="#">Cookie Preferences</a>
          <a href="#">Corporate Information</a>
          <a href="#">Contact Us</a>
        </nav>

        <p className={styles.copy}>
          Student project. Not affiliated with Netflix.
        </p>
        <p className={styles.copy}>
          Movie data from{" "}
          <a
            className={styles.creditLink}
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noreferrer"
          >
            TMDB
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
