import BackToHomeLink from "../../components/BackToHomeLink/BackToHomeLink";
import styles from "./NotFound.module.css";

/**
 * 404 page for any unknown path inside the signed-in layout.
 *
 * @returns {JSX.Element}
 */
const NotFound = () => {
  return (
    <div className={styles.page}>
      <p className={styles.code}>404</p>
      <h1 className={styles.title}>Page not found</h1>
      <p className={styles.copy}>
        That address is not part of this site. Head back to the home page to
        keep browsing.
      </p>
      <BackToHomeLink />
    </div>
  );
};

export default NotFound;
